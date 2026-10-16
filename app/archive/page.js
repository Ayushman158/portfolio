'use client'

import { motion, useReducedMotion } from 'motion/react'
import WorkIndex from '../components/work-index'

/*
 * Work kept off the homepage: client work, an installation, a campaign,
 * motion and small experiments. Kept, and findable, but off the homepage so
 * the two selected case studies read first.
 */

const CLIENT = [
  { name: 'Hoychoy Cafe · hoychoycafe.com', year: '2025', href: '/case-study', img: '/shipped/hoychoy-card.jpg', w: 2400, h: 1350 },
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

const MOTION = [
  { name: 'Showreel', year: '2026', href: '/reel', video: '/reel/showreel-preview.mp4' },
  { name: 'Motion studies', year: '2026', href: '/motion', img: '/assets/motion-studies.png', w: 1360, h: 1020 },
]

export default function Archive() {
  const reduceMotion = useReducedMotion()
  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })
  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <motion.header {...rise(0)} className="track-wide space-y-4">
        <h1 className="display">Archive</h1>
        <p className="max-w-[38rem]">Client work, an installation, a campaign, motion and smaller experiments. Hover a row to see it.</p>
      </motion.header>
      <motion.div {...rise(0.08)}>
        <WorkIndex label="Client work" items={CLIENT} />
        <WorkIndex label="Installation and campaign" items={PROJECTS} />
        <WorkIndex label="Experiments" items={EXPERIMENTS} />
        <WorkIndex label="Motion" items={MOTION} />
      </motion.div>
    </main>
  )
}
