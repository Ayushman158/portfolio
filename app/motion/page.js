'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import KizukuInteractions from '../components/kizuku-interactions'
import { Back, Heading, Rule } from '../components/case-study'

/**
 * The Kizuku gestures on their own page.
 *
 * They already appear inside the case study, where they argue a point about
 * that product. Here they are the subject: the same three components, framed
 * by what each one is actually solving. Nothing is duplicated — the page
 * imports the same component the case study does, so there is one source of
 * truth for the behaviour and one place to fix it.
 */
const NOTES = [
  {
    title: 'A drag that resists',
    body: 'The can follows your finger exactly for the first 96px and then compresses, so the boundary is felt rather than hit. Release is decided by where the can actually is on screen — not the raw finger delta, because past the free radius those diverge and the can is what you are watching. A committed flick counts even when it is short.',
  },
  {
    title: 'A hold you can abandon',
    body: 'Committing to something hard should take a moment longer than a tap, and it should be abandonable without penalty. Letting go early returns the ring to nothing at a different speed than it filled — quick to give up, slow to commit, which is the honest asymmetry.',
  },
  {
    title: 'Growth you did not have to wait for',
    body: 'The plant rises from where the seed stood, on the same ground and the same centre, so nothing teleports. The whole sequence is skippable from the first frame: ceremony should never gate the way out.',
  },
]

export default function MotionStudies() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-40 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}><Back /></motion.div>

      <motion.div {...rise(0.04)} className="space-y-5 mt-8">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Motion studies · 2026</p>
        <h1 style={{ color: 'var(--ink)', fontSize: '2rem', lineHeight: 1.2, fontWeight: 500, letterSpacing: '-0.02em' }}>
          Three gestures, running the same code as the app.
        </h1>
        <p>
          These are lifted from{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link>, an iOS app I designed and built. Every
          constant here — the free radius, the damping factor, the velocity threshold — is the number the
          React Native build uses, and the release logic is the same function, ported rather than
          reimplemented. So they demonstrate the behaviour instead of describing it.
        </p>
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>
          Rebuilt for the browser with Motion. They want a pointer or a thumb.
        </p>
      </motion.div>

      <motion.div {...rise(0.1)} className="mt-12">
        <KizukuInteractions />
      </motion.div>

      <Rule />

      <motion.section {...rise(0.14)}>
        <Heading>What each one is solving.</Heading>
        {NOTES.map((n) => (
          <div key={n.title} className="index-row" style={{ gridTemplateColumns: '1fr', gap: '0.35rem' }}>
            <span style={{ color: 'var(--ink)' }}>{n.title}</span>
            <p className="text-faint" style={{ fontSize: '0.95rem' }}>{n.body}</p>
          </div>
        ))}
      </motion.section>

      <motion.section {...rise(0.18)} className="mt-14">
        <p>
          The reasoning behind them, and the product they belong to, is in the{' '}
          <Link href="/kizuku" className="prose-link">Kizuku case study</Link>. Back to{' '}
          <Link href="/#work" className="prose-link">the work index</Link>.
        </p>
      </motion.section>
    </main>
  )
}
