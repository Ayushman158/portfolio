'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import Deck from './deck'

export default function AlbumAlive() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-40 pt-20 sm:pt-28">
      <motion.div {...rise(0)} className="space-y-5">
        <h1 className="text-faint text-[0.95rem]">ALBUM//ALIVE · 2026</h1>
        <p>
          Printed record cards. Point a phone at one and the vinyl slides out of the sleeve,
          spins up, and plays.
        </p>
        <p>
          WebAR, built with <span className="text-ink">MindAR</span> and{' '}
          <span className="text-ink">Three.js</span>. No app, no install — a URL, a camera, and
          an image the tracker recognises.
        </p>
      </motion.div>

      <motion.section {...rise(0.1)} className="mt-14">
        <Deck />
      </motion.section>

      <motion.section {...rise(0.16)} className="mt-20">
        <h2 className="text-faint text-[0.95rem] mb-3">The position</h2>
        <p>
          This is an AR project, not a website with a camera in it. That distinction drove
          every decision: there is no navigation, no album picker, no chrome. You point the
          phone at a card and the card answers. The interface is the object.
        </p>
      </motion.section>

      <motion.section {...rise(0.2)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">How it works</h2>
        <p>
          Each sleeve is compiled into a MindAR image target — a feature map the tracker
          matches against the camera feed. Anchor space is normalised to the target&apos;s width,
          so the cards are authored at a true 2:3 and the record geometry is expressed in
          card-widths rather than pixels. That is what lets the vinyl sit correctly whether the
          card is printed at postcard size or shown on a laptop screen.
        </p>
        <p className="mt-4">
          The record is procedural — grooves, the anisotropic sheen that runs around the disc,
          and the label are generated rather than textured from a file, so a new album is a
          cover image and four lines of metadata.
        </p>
      </motion.section>

      <motion.section {...rise(0.24)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">What was hard</h2>
        <p>
          Tracking is unforgiving about contrast and detail — a sleeve that looks striking to a
          person can be nearly featureless to a tracker. The four in the deck were chosen as
          much for what MindAR could hold onto as for the records themselves.
        </p>
        <p className="mt-4">
          The other problem was restraint. Everything the medium makes possible — menus,
          transitions, a player UI — pulls against the one idea worth protecting, which is that
          the card is the interface.
        </p>
      </motion.section>

      <motion.section {...rise(0.28)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">Elsewhere</h2>
        <p>
          <a href="https://web-ar-project.vercel.app/" target="_blank" rel="noopener noreferrer" className="prose-link">Live experience</a>
          <span className="text-faint"> · </span>
          <a href="https://github.com/Ayushman158/WebAR-Vinyl" target="_blank" rel="noopener noreferrer" className="prose-link">Source on GitHub</a>
          <span className="text-faint"> · </span>
          <Link href="/" className="prose-link">Back to index</Link>
        </p>
      </motion.section>
    </main>
  )
}
