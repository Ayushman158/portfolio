'use client'

import { motion, useReducedMotion } from 'motion/react'
import WorkIndex from '../components/work-index'
import ExplorationSlider from '../components/exploration-slider'

/*
 * Work kept off the homepage: client work, an installation, a campaign,
 * and small experiments. The index sits below the video previews so
 * the three selected case studies read first.
 */

const CLIENT = [
  { name: 'Banyan Tree · himanshugarg.in', year: '2026', href: '/banyan', img: '/shipped/banyan.jpg', w: 1600, h: 900 },
]

// Choose Assam is a static page of its own, so it opens as a plain link.
const PROJECTS = [
  { name: 'Koi Wishing Pond', year: '2026', href: '/koi-wishing-pond', img: '/research/koi-loop.jpg', w: 960, h: 540 },
  { name: 'Choose Assam · Tata Tea Premium', year: '2026', href: '/choose-assam', external: true, img: '/choose-assam/card.jpg', w: 1536, h: 864 },
]

const EXPERIMENTS = [
  { name: 'Gone or Still Here?', year: '2026', href: '/gone-or-still-here', img: '/gone/home.jpg', w: 1600, h: 1000 },
  { name: 'ALBUM//ALIVE', year: '2026', href: '/album-alive', img: '/album-alive/fan.jpg', w: 1200, h: 900 },
]

export default function Exploration() {
  const reduceMotion = useReducedMotion()
  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })
  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <motion.header {...rise(0)} className="track-wide space-y-4">
        <h1 className="display">Exploration</h1>
      </motion.header>
      <div className="track-wide mt-8"><ExplorationSlider showTitle={false} /></div>
      <motion.div {...rise(0.08)}>
        <WorkIndex label="client work" items={CLIENT} />
        <WorkIndex label="installation and campaign" items={PROJECTS} />
        <WorkIndex label="experiments" items={EXPERIMENTS} />
      </motion.div>
    </main>
  )
}
