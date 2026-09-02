'use client'

import { motion, useReducedMotion } from 'motion/react'
import WorkIndex from '../components/work-index'

const EXPERIMENTS = [
  {
    name: 'FieldNote',
    year: '2026',
    href: 'https://fieldnote-ten.vercel.app/',
    external: true,
    img: '/assets/fieldnote-ss.png',
    w: 1200,
    h: 634,
  },
]

export default function Experiments() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-40 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)} className="space-y-5">
        <h1 className="text-faint text-[0.95rem]">Experiments</h1>
        <p>
          Weekend builds. Rapid prototypes, LLM integrations and front-end work that exists to
          answer a question rather than to ship.
        </p>
      </motion.div>

      <motion.div {...rise(0.08)}>
        <WorkIndex label="Live" items={EXPERIMENTS} />
      </motion.div>

      <motion.section {...rise(0.14)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">FieldNote</h2>
        <p>
          An AI research assistant that transcribes user interviews and synthesises the patterns
          across them. Built with React, the Web Speech API and Gemini 1.5 Pro.
        </p>
      </motion.section>
    </main>
  )
}
