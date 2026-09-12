'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
 * 1300ms   note over the fan: tap one to put it on the table
 * 1850ms   hand gathers to a stack as a beat (stagger 60ms, last→first)
 * 2250ms   two deal onto the table, and the hand re-fans as the picker
 * 2700ms   note: fill the frame with one, or hold both
 *
 * After the sequence the hand stays live. Tapping a sleeve swaps it onto
 * the table, replacing whichever record has been down longest — the way
 * you'd load the next one on a deck. That is why the fan exists at all;
 * without it the four sleeves are decoration and only two are reachable.
 *
 * Order is the point. The visitor scans the QR before they ever meet a
 * card, so by the time the deck deals they already have the app open.
 *
 * The table is flat and side-by-side rather than fanned because MindAR
 * cannot track an overlapping or rotated sleeve, and arEngine.js runs
 * maxTrack: 2 — two records at once is a real capability.
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  qrNote:     200,   // handwritten arrow lands on the QR
  fanOut:     750,   // deck spreads into a hand
  fanNote:   1300,   // note over the fan
  gather:    1850,   // hand collapses back to a stack
  deal:      2250,   // two cards come forward, flat and adjacent
  dealNote:  2700,   // the "fill the frame" annotation
}

/* QR panel. Deliberately not themed: a QR must be dark modules on a light
   ground in both themes, because most scanners will not read an inverted
   one. These are fixed hex values, never tokens. */
const QR = {
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
  // Opening pair: the highest-contrast targets of the four.
  opening: ['pinkfloyd', 'greenday'],
}

/* Tapping a sleeve in the hand puts it on the table */
const SWAP = {
  // Occasional, deliberate, and it changes state — so it animates, briefly.
  // 250ms is the select/dropdown band; springs keep it consistent with the page.
  spring:      { type: 'spring', stiffness: 420, damping: 34 },
  enterScale:  0.94,   // arriving record, never from 0 — nothing appears from nothing
  enterY:      10,
  liftOnHover: -6,     // px a sleeve rises when pointed at, fine pointers only
  restScale:   0.9,    // the hand sits back once the table is set
  activeScale: 1,      // a sleeve already on the table stays full size
}

/* Handwritten annotations */
const NOTE = {
  spring: { type: 'spring', stiffness: 300, damping: 24 },
  liftY:  10,
  tilt:   -3,
}

/* The pair on the table */
const TABLE = {
  spring:       { type: 'spring', stiffness: 280, damping: 30 },
  initialScale: 0.92,
  offsetY:      18,
  stagger:      0.09,
  maxWidth:     '25rem', // 400px — the 2x-DPR ceiling for an 800px source
}

export default function Deck() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState(0)
  const [pair, setPair] = useState(DECK.opening)

  useEffect(() => {
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

  /* Put a record on the table. Already down → no-op, so tapping twice does not
     shuffle the pair under the visitor. Otherwise it replaces the one that has
     been down longest, which is the slot they are least likely to be using. */
  const put = useCallback((id) => {
    setPair((current) => (current.includes(id) ? current : [current[1], id]))
    setStage((s) => Math.max(s, 5))   // tapping early skips ahead to the table
  }, [])

  const onTable = (id) => pair.includes(id)

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

      {/* ── 2. The hand, which is also the picker ────────── */}
      <div className="relative mx-auto mt-14 h-[300px] w-full max-w-[30rem] sm:h-[340px]">
        {DECK.cards.map((card, i) => {
          // Spread while presenting, briefly gathered as a beat, spread again
          // for good: stacked cards overlap and only the top one can be tapped.
          const fanned = (stage >= 2 && stage < 4) || stage >= 5
          const active = onTable(card.id)
          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => put(card.id)}
              aria-pressed={active}
              aria-label={`${card.title} by ${card.artist}${active ? ' — on the table' : ' — put on the table'}`}
              className="absolute left-1/2 top-4 w-[118px] cursor-pointer rounded-[3px] sm:w-[136px]"
              style={{ marginLeft: -59, zIndex: i }}
              initial={{ x: 0, y: i * DECK.stackNudge, rotate: 0, opacity: 0 }}
              animate={{
                opacity: 1,
                x:      fanned ? card.fan.x : 0,
                y:      fanned ? card.fan.y : i * DECK.stackNudge,
                rotate: fanned ? card.fan.rotate : 0,
                // Once the table is set the hand sits back, but a sleeve already
                // down stays full size so the pairing is readable at a glance.
                scale:  stage >= 5 ? (active ? SWAP.activeScale : SWAP.restScale) : 1,
                filter: stage >= 5 && !active ? 'saturate(0.55)' : 'saturate(1)',
              }}
              transition={{
                ...(fanned ? DECK.fanSpring : DECK.gatherSpring),
                delay: stage === 4 ? (DECK.cards.length - 1 - i) * DECK.gatherStagger : 0,
              }}
              whileHover={reduceMotion ? undefined : { y: SWAP.liftOnHover }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            >
              <Image
                src={`/album-alive/${card.id}.jpg`}
                alt=""
                width={800}
                height={1200}
                sizes="136px"
                className={`w-full rounded-[3px] border shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] ${
                  active ? 'border-accent' : 'border-rule'
                }`}
              />
            </motion.button>
          )
        })}

        {/* Sits below the hand, not across it. Floated top-right it overlapped
            three sleeves, and because the cards carry an explicit z-index (0-3)
            while this was z-index:auto, they painted over the text — the note
            was legible only where no card happened to be. z-10 keeps it above
            them whatever the layout does next. */}
        <motion.p
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 text-center font-reenie-beanie text-2xl text-accent sm:text-3xl"
          initial={{ opacity: 0, y: NOTE.liftY, rotate: 0 }}
          animate={{
            opacity: stage >= 3 ? 1 : 0,
            y:       stage >= 3 ? 0 : NOTE.liftY,
            rotate:  stage >= 3 ? NOTE.tilt : 0,
          }}
          transition={NOTE.spring}
        >
          {stage >= 5 ? 'tap one to swap it in' : 'four sleeves — each one a target'}
        </motion.p>
      </div>

      {/* ── 3. On the table ──────────────────────────────── */}
      <div className="mt-8">
        {/* Breaks the editorial measure on purpose: this pair is the
            instrument, and 41rem cannot hold two targets at a scannable size. */}
        <div className="relative left-1/2 flex w-[min(94vw,54rem)] -translate-x-1/2 items-start justify-center gap-4 sm:gap-8">
          {pair.map((id, i) => {
            const card = DECK.cards.find((c) => c.id === id)
            return (
              <motion.div
                // Keyed by album, so swapping a record animates the new one in
                // rather than crossfading pixels inside a shared box.
                key={card.id}
                initial={{ opacity: 0, y: SWAP.enterY, scale: SWAP.enterScale }}
                animate={{
                  opacity: stage >= 5 ? 1 : 0,
                  y:       stage >= 5 ? 0 : TABLE.offsetY,
                  scale:   stage >= 5 ? 1 : TABLE.initialScale,
                }}
                transition={{ ...SWAP.spring, delay: stage >= 5 ? i * TABLE.stagger : 0 }}
              >
                <Image
                  src={`/album-alive/${card.id}.jpg`}
                  alt={`${card.title} by ${card.artist} — scan this sleeve`}
                  width={800}
                  height={1200}
                  sizes={`(max-width: 640px) 42vw, ${TABLE.maxWidth}`}
                  priority
                  className="w-[min(42vw,25rem)] rounded-[4px] border border-rule shadow-[0_18px_44px_-18px_rgba(0,0,0,0.55)]"
                />
                <p className="mt-2 text-center font-caveat text-lg text-faint">{card.title}</p>
              </motion.div>
            )
          })}
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
