'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'motion/react'

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — "scan me, then take two"
 *
 * Read top-to-bottom. Each `at` value is ms after scroll-into-view.
 *
 *    0ms   QR is already on screen — it is the first thing to do
 *  200ms   handwritten arrow points at it: start here
 *  750ms   deck fans out into a hand, four sleeves
 * 1300ms   note over the fan: each one is a target
 * 1850ms   hand gathers back to a stack (stagger 60ms, last→first)
 * 2250ms   two cards deal out side by side, flat
 * 2700ms   note: hold both, the engine tracks two at once
 *
 * Order is the point. The visitor scans the QR before they ever meet a
 * card, so by the time the deck deals they already have the app open and
 * a camera pointed at the screen.
 *
 * The sequence ends flat and side-by-side rather than fanned because
 * MindAR cannot track an overlapping or rotated sleeve, and arEngine.js
 * runs maxTrack: 2 — two records on the table at once is a real
 * capability, so the layout offers exactly two.
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  qrNote:     200,   // handwritten arrow lands on the QR
  fanOut:     750,   // deck spreads into a hand
  fanNote:   1300,   // note over the fan
  gather:    1850,   // hand collapses back to a stack
  deal:      2250,   // two cards come forward, flat and adjacent
  dealNote:  2700,   // the "two at once" annotation
}

/* QR panel. Deliberately not themed: a QR must be dark modules on a light
   ground in both themes, because most scanners will not read an inverted
   one. These are fixed hex values, never tokens. */
const QR = {
  spring:  { type: 'spring', stiffness: 320, damping: 30 },
  ground:  '#FBFAF7',   // paper, in light AND dark
  modules: '#171614',   // ink, in light AND dark
  steps: [
    'Scan this with your phone camera',
    'Allow the camera when the site asks',
    'Point it at a sleeve below — fill the frame with one',
  ],
}

/* The four printed cards. Order matches albums.js, which is also the MindAR
   target index — reordering here would mislabel the captions. */
const DECK = {
  fanSpring:     { type: 'spring', stiffness: 260, damping: 26 },
  gatherSpring:  { type: 'spring', stiffness: 300, damping: 30 },
  gatherStagger: 0.06,  // seconds between cards collapsing, last card first
  stackNudge:    6,     // px each card sits off the one below in the stack
  cards: [
    { id: 'lumen',      title: 'Spectra',             artist: 'Lumen',       year: 'MMXXIII', fan: { x: -168, y: 14, rotate: -13 } },
    { id: 'linkinpark', title: 'Minutes to Midnight', artist: 'Linkin Park', year: '2007',    fan: { x: -56,  y: -6, rotate: -4.5 } },
    { id: 'pinkfloyd',  title: 'The Wall',            artist: 'Pink Floyd',  year: '1979',    fan: { x: 56,   y: -6, rotate: 4.5 } },
    { id: 'greenday',   title: 'American Idiot',      artist: 'Green Day',   year: '2004',    fan: { x: 168,  y: 14, rotate: 13 } },
  ],
  // The two laid out for scanning: the highest-contrast targets of the four.
  dealt: ['pinkfloyd', 'greenday'],
}

/* Handwritten annotations */
const NOTE = {
  spring: { type: 'spring', stiffness: 300, damping: 24 },
  liftY:  10,    // px each note rises from
  tilt:   -3,    // deg, so it reads as written rather than set
}

/* The two cards dealt forward.
 *
 * These are scan targets before they are decoration, so they are sized for the
 * tracker rather than for the column. MindAR has to match the whole sleeve at
 * once: when the card is small on screen the phone has to come so close that
 * the frame holds only part of the artwork, which is the exact condition under
 * which detection fails. Bigger on screen means the visitor can sit back and
 * still fill the frame.
 *
 * 400px is the ceiling, not a preference — the sources are 800px wide, so
 * anything larger upscales and goes soft, and a soft target tracks worse than
 * a small sharp one. */
const DEALT = {
  spring:       { type: 'spring', stiffness: 280, damping: 30 },
  initialScale: 0.92,
  offsetY:      18,
  stagger:      0.09,   // seconds between the two landing
  maxWidth:     '25rem', // 400px — the 2x-DPR ceiling for an 800px source
}

export default function Deck() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    // Reduced motion goes straight to the end state. It is the only stage that
    // carries information: the QR, and two cards lying flat.
    if (reduceMotion) { setStage(6); return }
    if (!isInView) { setStage(0); return }

    setStage(0)
    const timers = []
    timers.push(setTimeout(() => setStage(1), TIMING.qrNote))
    timers.push(setTimeout(() => setStage(2), TIMING.fanOut))
    timers.push(setTimeout(() => setStage(3), TIMING.fanNote))
    timers.push(setTimeout(() => setStage(4), TIMING.gather))
    timers.push(setTimeout(() => setStage(5), TIMING.deal))
    timers.push(setTimeout(() => setStage(6), TIMING.dealNote))
    return () => timers.forEach(clearTimeout)
  }, [isInView, reduceMotion])

  const dealt = DECK.dealt.map((id) => DECK.cards.find((c) => c.id === id))

  return (
    <div ref={ref}>
      {/* ── 1. Scan this first ───────────────────────────── */}
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <a
          href="https://vinylplayer-blond.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open ALBUM//ALIVE — opens in a new tab"
          className="shrink-0 rounded-md border border-rule p-3 transition-transform duration-150 ease-out active:scale-[0.97]"
          style={{ backgroundColor: QR.ground, color: QR.modules }}
        >
          <Image src="/album-alive/qr.svg" alt="" width={116} height={116} className="h-28 w-28" unoptimized />
        </a>

        <div>
          <motion.p
            className="font-reenie-beanie text-3xl text-accent"
            initial={{ opacity: 0, y: NOTE.liftY, rotate: 0 }}
            animate={{
              opacity: stage >= 1 ? 1 : 0,
              y:       stage >= 1 ? 0 : NOTE.liftY,
              rotate:  stage >= 1 ? NOTE.tilt : 0,
            }}
            transition={NOTE.spring}
          >
            ← start here
          </motion.p>

          <ol className="mt-2 space-y-1.5 text-[0.95rem]">
            {QR.steps.map((step, i) => (
              <li key={step} className="grid grid-cols-[1.4rem_1fr]">
                <span className="tnum text-faint" aria-hidden="true">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-3 font-caveat text-lg text-faint">
            no app, no printing — your screen is the marker
          </p>
        </div>
      </div>

      {/* ── 2. The hand ──────────────────────────────────── */}
      <div className="relative mx-auto mt-14 h-[290px] w-full max-w-[30rem] sm:h-[330px]">
        {DECK.cards.map((card, i) => {
          const fanned = stage >= 2 && stage < 4
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
                // Once two are dealt, the rest of the deck steps back rather
                // than competing with what the visitor is meant to point at.
                scale:  stage >= 5 ? 0.86 : 1,
                filter: stage >= 5 ? 'saturate(0.5)' : 'saturate(1)',
              }}
              transition={{
                ...(fanned ? DECK.fanSpring : DECK.gatherSpring),
                delay: stage === 4 ? (DECK.cards.length - 1 - i) * DECK.gatherStagger : 0,
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

        <motion.p
          className="pointer-events-none absolute -top-2 right-0 font-reenie-beanie text-2xl text-accent sm:text-3xl"
          initial={{ opacity: 0, y: NOTE.liftY, rotate: 0 }}
          animate={{
            opacity: stage >= 3 && stage < 5 ? 1 : 0,
            y:       stage >= 3 ? 0 : NOTE.liftY,
            rotate:  stage >= 3 ? NOTE.tilt : 0,
          }}
          transition={NOTE.spring}
        >
          four sleeves —
          <br />
          each one a target
        </motion.p>
      </div>

      {/* ── 3. Two on the table ──────────────────────────── */}
      <div className="mt-8">
        {/* Breaks the editorial measure on purpose: this pair is the
            instrument, and 41rem cannot hold two targets at a scannable size. */}
        <div className="relative left-1/2 flex w-[min(94vw,54rem)] -translate-x-1/2 items-start justify-center gap-4 sm:gap-8">
          {dealt.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: DEALT.offsetY, scale: DEALT.initialScale }}
              animate={{
                opacity: stage >= 5 ? 1 : 0,
                y:       stage >= 5 ? 0 : DEALT.offsetY,
                scale:   stage >= 5 ? 1 : DEALT.initialScale,
              }}
              transition={{ ...DEALT.spring, delay: stage >= 5 ? i * DEALT.stagger : 0 }}
            >
              <Image
                src={`/album-alive/${card.id}.jpg`}
                alt={`${card.title} by ${card.artist} — scan this sleeve`}
                width={800}
                height={1200}
                sizes={`(max-width: 640px) 42vw, ${DEALT.maxWidth}`}
                priority
                className="w-[min(42vw,25rem)] rounded-[4px] border border-rule shadow-[0_18px_44px_-18px_rgba(0,0,0,0.55)]"
              />
              <p className="mt-2 text-center font-caveat text-lg text-faint">{card.title}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-4 text-center font-reenie-beanie text-2xl text-accent sm:text-3xl"
          initial={{ opacity: 0, y: NOTE.liftY }}
          animate={{ opacity: stage >= 6 ? 1 : 0, y: stage >= 6 ? 0 : NOTE.liftY }}
          transition={NOTE.spring}
        >
          fill the frame with one — or hold both, it tracks two at once
        </motion.p>
      </div>
    </div>
  )
}
