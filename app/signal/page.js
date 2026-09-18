'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Decisions, Facts, Heading, Rule, Shots } from '../components/case-study'

const FACTS = [
  ['Role', 'Sole designer and developer'],
  ['Scope', 'Product concept, interface, motion, sound'],
  ['Stack', 'React · Remotion · TypeScript'],
  ['Status', 'Concept — told as a film, not shipped'],
]

// Captioned in the film's own words: each line is the title card of its scene.
const FRAMES = [
  ['/signal/night.jpg',    'night before — signal notices the pattern before morning'],
  ['/signal/morning.jpg',  'morning — leave by 8:28, arrive by 9:30'],
  ['/signal/plan.jpg',     'plan — first mile, train, coach, arrival. one screen.'],
  ['/signal/transfer.jpg', 'INA — at the transfer, signal gives a verdict'],
  ['/signal/coach.jpg',    'live — every surface follows the same commute'],
  ['/signal/arrival.jpg',  'arrival — the payoff is calm'],
]

const DECISIONS = [
  [
    'It speaks first',
    'The chaos scene names the morning routine — maps, X, Rapido, a clock — and the line that none of them speak first. Signal is built around a notification, not a screen you open. The answer arrives before the search does.',
  ],
  [
    'A verdict, not a dashboard',
    'At the INA interchange it does not show a timetable. It shows a four-minute walk against four and a half available, and says you will make it. The arithmetic is visible so the verdict can be trusted, but the verdict is what is said.',
  ],
  [
    'Confidence is a number, not a promise',
    'Every recommendation carries a percentage — 58% the night before, 74% the next morning. A commute is uncertain, and pretending otherwise is how an app loses trust the first time it is wrong.',
  ],
  [
    'The coach, not just the train',
    'The most specific thing on screen is also the most useful: coach 6, marked from Dwarka for the INA exit gate. Which coach to board is the detail a regular learns by habit and a newcomer never knows, and it is the difference between making the transfer and walking the length of the platform.',
  ],
  [
    'One screen for the whole journey',
    'Walk, Rapido, Yellow Line, walk — four legs, four times, one screen, from Dwarka Sec-21 to HUDA City Centre. The chaos scene is four apps; the plan scene is one.',
  ],
  [
    'The resolution is a change of light',
    'Every other scene sits on near-black. Arrival is the only one in light mode: 9:29, one minute inside the deadline, on time. The film resolves its argument with a change of light rather than a claim.',
  ],
]

export default function Signal() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-40 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}>
        <Back />
      </motion.div>

      {/* ─── what it is, in the first screen ─────────────────────────── */}
      <motion.header {...rise(0.06)} className="mt-10 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Signal · 2026</p>

        <h1 style={{ color: 'var(--ink)', fontSize: '2rem', lineHeight: 1.2, fontWeight: 500, letterSpacing: '-0.02em' }}>
          A familiar commute should not start with doubt.
        </h1>

        <p>
          Signal is a commute assistant for the Delhi Metro that tells you once, before you ask: when to
          leave, which coach to board, and whether you will make the interchange. Know before you go.
        </p>

        <p>
          It is a concept, and the film is the deliverable. Every scene is a React component, rendered
          with Remotion — the phone frames, the metro line, the confidence ring and the coach diagram
          are code, not keyframes.
        </p>
      </motion.header>

      <motion.div {...rise(0.1)}><Facts rows={FACTS} /></motion.div>

      <Rule />

      {/* ─── the film ────────────────────────────────────────────────── */}
      <motion.section {...rise(0.14)}>
        <Heading>Eighty-five seconds, one morning.</Heading>
        <p className="mb-8">
          From the night before to arrival, on a real route: Dwarka Sec-21 to HUDA City Centre, changing
          at INA. Sound on — the cues are part of the pacing.
        </p>

        {/* The film carries the argument, so it leaves the reading measure.
            preload="metadata" keeps the 4 MB off the wire until someone presses
            play; the poster is the 8:18 lock screen, the single most legible frame. */}
        <figure className="track-full">
          <video
            src="/signal/signal.mp4"
            poster="/signal/poster.jpg"
            controls
            playsInline
            preload="metadata"
            className="block w-full rounded-xl"
            style={{ border: '1px solid var(--rule)', aspectRatio: '16 / 9', background: '#0f0f0f' }}
          >
            <track kind="descriptions" />
          </video>
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
            1920×1080, 85 seconds. Rendered from React with Remotion.
          </figcaption>
        </figure>
      </motion.section>

      <Rule />

      {/* ─── the frames ──────────────────────────────────────────────── */}
      <motion.section {...rise(0.18)}>
        <Heading>Six scenes, in the film&rsquo;s own words.</Heading>
        <Shots items={FRAMES} cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      </motion.section>

      <Rule />

      {/* ─── the arguments ───────────────────────────────────────────── */}
      <motion.section {...rise(0.22)}>
        <Heading>Six decisions I would defend.</Heading>
        <Decisions items={DECISIONS} />
      </motion.section>

      <motion.section {...rise(0.26)} className="mt-14">
        <p>
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/album-alive" className="prose-link">ALBUM//ALIVE</Link> and{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link>.
        </p>
      </motion.section>
    </main>
  )
}
