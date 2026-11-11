'use client'

import { motion, useReducedMotion } from 'motion/react'
import Pinboard from '../components/pinboard'
import CheckerStrip from '../components/checker-strip'

/*
 * Exploration: the experimental and smaller work, pinned to one board rather
 * than listed. Hazel looks over the shelf under the title when the page opens.
 */
export default function Exploration() {
  const reduceMotion = useReducedMotion()
  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })
  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <motion.header {...rise(0)} className="track-wide">
        <CheckerStrip as="h1" arrive />
      </motion.header>
      <motion.div {...rise(0.08)} className="track-wide mt-6">
        <Pinboard />
      </motion.div>
    </main>
  )
}
