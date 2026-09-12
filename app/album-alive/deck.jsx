'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'motion/react'

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — "the deck deals you a card"
 *
 * Read top-to-bottom. Each `at` value is ms after scroll-into-view.
 *
 *    0ms   four cards sit squared in a tight stack, waiting
 *  250ms   deck fans out — cards spread and rotate, like a hand
 *  950ms   handwritten note + arrow fade in over the fan
 * 1500ms   fan gathers back into the stack (stagger 60ms, last→first)
 * 1900ms   top card deals forward: flat, large, scannable
 * 2350ms   QR and the scan instructions rise beside it
 *
 * The sequence exists to solve a real problem, not to decorate: a fanned
 * or stacked card cannot be tracked by MindAR. The choreography ends by
 * laying exactly one card flat and unobstructed, which is the state the
 * visitor's phone actually needs.
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  fanOut:      250,   // deck spreads into a hand
  noteAppear:  950,   // handwritten guidance fades in
  gather:     1500,   // hand collapses back to a stack
  deal:       1900,   // top card comes forward, flat
  scanBlock:  2350,   // QR + instructions arrive
}

/* The four printed cards. Order matches albums.js, which is also the
   MindAR target index — reordering here would mislabel the captions. */
const DECK = {
  fanSpring:    { type: 'spring', stiffness: 260, damping: 26 },
  gatherSpring: { type: 'spring', stiffness: 300, damping: 30 },
  gatherStagger: 0.06,  // seconds between cards collapsing, last card first
  stackNudge:    6,     // px each card sits off the one below in the stack
  cards: [
    { id: 'lumen',      title: 'Spectra',             artist: 'Lumen',       year: 'MMXXIII', fan: { x: -168, y: 14, rotate: -13 } },
    { id: 'linkinpark', title: 'Minutes to Midnight', artist: 'Linkin Park', year: '2007',    fan: { x: -56,  y: -6, rotate: -4.5 } },
    { id: 'pinkfloyd',  title: 'The Wall',            artist: 'Pink Floyd',  year: '1979',    fan: { x: 56,   y: -6, rotate: 4.5 } },
    { id: 'greenday',   title: 'American Idiot',      artist: 'Green Day',   year: '2004',    fan: { x: 168,  y: 14, rotate: 13 } },
  ],
}

/* Handwritten guidance floating over the fan */
const NOTE = {
  spring: { type: 'spring', stiffness: 300, damping: 24 },
  liftY:  10,       // px it rises from
  tilt:   -3,       // deg, so it reads as written by hand not set in type
}

/* The card dealt forward for scanning */
const HERO = {
  spring:       { type: 'spring', stiffness: 280, damping: 30 },
  initialScale: 0.92,
  finalScale:   1,
  offsetY:      18,   // px it rises from
}

/* QR + instructions */
const SCAN = {
  spring:  { type: 'spring', stiffness: 320, damping: 30 },
  offsetY: 14,
  steps: [
    'Point your phone camera at this QR',
    'Allow the camera when it asks',
    'Aim it at the record card on this screen',
  ],
}

export default function Deck() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    // Reduced motion skips the performance and presents the end state, which is
    // the only stage that carries information: one card flat, and the QR.
    if (reduceMotion) { setStage(5); return }
    if (!isInView) { setStage(0); return }

    setStage(0)
    const timers = []
    timers.push(setTimeout(() => setStage(1), TIMING.fanOut))
    timers.push(setTimeout(() => setStage(2), TIMING.noteAppear))
    timers.push(setTimeout(() => setStage(3), TIMING.gather))
    timers.push(setTimeout(() => setStage(4), TIMING.deal))
    timers.push(setTimeout(() => setStage(5), TIMING.scanBlock))
    return () => timers.forEach(clearTimeout)
  }, [isInView, reduceMotion])

  const hero = DECK.cards[2] // The Wall — the highest-contrast target of the four

  return (
    <div ref={ref}>
      {/* ── The hand ─────────────────────────────────────── */}
      <div className="relative mx-auto h-[290px] w-full max-w-[30rem] sm:h-[330px]">
        {DECK.cards.map((card, i) => {
          const fanned = stage >= 1 && stage < 3
          return (
            <motion.div
              key={card.id}
              className="absolute left-1/2 top-4 w-[118px] sm:w-[136px]"
              style={{ marginLeft: -59, zIndex: i }}
              initial={{ x: 0, y: i * DECK.stackNudge, rotate: 0, opacity: 0 }}
              animate={{
                opacity: 1,
                x:      fanned ? card.fan.x : 0,
                y:      fanned ? card.fan.y : i * DECK.stackNudge,
                rotate: fanned ? card.fan.rotate : 0,
                // Once the hero card is dealt, the deck steps back rather than
                // competing with the thing the visitor is meant to point at.
                scale:   stage >= 4 ? 0.88 : 1,
                filter:  stage >= 4 ? 'saturate(0.55)' : 'saturate(1)',
              }}
              transition={{
                ...(fanned ? DECK.fanSpring : DECK.gatherSpring),
                delay: stage === 3 ? (DECK.cards.length - 1 - i) * DECK.gatherStagger : 0,
              }}
            >
              <Image
                src={`/album-alive/${card.id}.jpg`}
                alt={`${card.title} by ${card.artist}`}
                width={800}
                height={1200}
                sizes="136px"
                className="w-full rounded-[3px] border border-rule shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          )
        })}

        {/* Handwritten guidance */}
        <motion.p
          className="pointer-events-none absolute -top-2 right-0 font-reenie-beanie text-2xl text-accent sm:text-3xl"
          initial={{ opacity: 0, y: NOTE.liftY, rotate: 0 }}
          animate={{
            opacity: stage >= 2 && stage < 4 ? 1 : 0,
            y:       stage >= 2 ? 0 : NOTE.liftY,
            rotate:  stage >= 2 ? NOTE.tilt : 0,
          }}
          transition={NOTE.spring}
        >
          four printed cards —
          <br />
          each one a target
        </motion.p>
      </div>

      {/* ── The card it deals you ────────────────────────── */}
      <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10">
        <motion.div
          className="relative shrink-0"
          initial={{ opacity: 0, y: HERO.offsetY, scale: HERO.initialScale }}
          animate={{
            opacity: stage >= 4 ? 1 : 0,
            y:       stage >= 4 ? 0 : HERO.offsetY,
            scale:   stage >= 4 ? HERO.finalScale : HERO.initialScale,
          }}
          transition={HERO.spring}
        >
          <Image
            src={`/album-alive/${hero.id}.jpg`}
            alt={`${hero.title} by ${hero.artist} — scan this card`}
            width={800}
            height={1200}
            sizes="(max-width: 640px) 60vw, 220px"
            priority
            className="w-[190px] rounded-[4px] border border-rule shadow-[0_18px_44px_-18px_rgba(0,0,0,0.55)] sm:w-[220px]"
          />
          <p className="mt-3 text-center font-caveat text-xl text-faint">
            {hero.title} · {hero.year}
          </p>
        </motion.div>

        {/* ── Scan instructions ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: SCAN.offsetY }}
          animate={{ opacity: stage >= 5 ? 1 : 0, y: stage >= 5 ? 0 : SCAN.offsetY }}
          transition={SCAN.spring}
        >
          <p className="font-reenie-beanie text-3xl text-accent">try it from here →</p>

          <a
            href="https://web-ar-project.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex rounded-md border border-rule bg-ground p-3 text-ink transition-[transform,border-color] duration-150 ease-out hover:border-faint active:scale-[0.97]"
            aria-label="Open ALBUM//ALIVE — opens in a new tab"
          >
            <Image src="/album-alive/qr.svg" alt="" width={112} height={112} className="h-28 w-28" unoptimized />
          </a>

          <ol className="mt-4 space-y-1.5 text-[0.95rem]">
            {SCAN.steps.map((step, i) => (
              <li key={step} className="grid grid-cols-[1.4rem_1fr]">
                <span className="tnum text-faint" aria-hidden="true">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-3 font-caveat text-lg text-faint">
            no app, no printing — your screen is the marker
          </p>
        </motion.div>
      </div>
    </div>
  )
}
