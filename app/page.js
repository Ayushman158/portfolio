'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'motion/react'
import GradientText from './components/gradient-text'
import LetterSwap from './components/letter-swap'
import WorkIndex from './components/work-index'
import Shipped from './components/shipped'
import { FigmaMark, FramerMark, IllustratorMark, ClaudeMark, CodexMark } from './components/tool-marks'
import VerticalCutReveal, { useSplashDone } from './components/vertical-cut-reveal'

// Live, client-run, and reachable by anyone — so these are shown, not listed.
const SHIPPED = [
  {
    name: 'Banyan Tree',
    href: '/banyan',
    site: 'himanshugarg.in',
    url: 'https://www.himanshugarg.in/',
    shot: '/shipped/banyan.jpg',
    alt: 'The Banyan Tree homepage: twelve categories of symptom over a banyan canopy',
    what: 'An atlas of root-cause healing for a health practice. The metaphor is the navigation.',
    tags: ['Concept', 'Interface', 'Front end', 'Handover'],
  },
  {
    name: 'Hoychoy Cafe',
    href: '/case-study',
    site: 'hoychoycafe.com',
    url: 'https://www.hoychoycafe.com/',
    shot: '/shipped/hoychoy.jpg',
    alt: 'The Hoychoy Cafe menu, with live availability and prices',
    what: (
      <>
        A café’s WhatsApp ordering rebuilt as a service. Ordering went from{' '}
        <GradientText>6–8 minutes to 2–3</GradientText>.
      </>
    ),
    tags: ['Research', 'Service design', 'Interface', 'Build'],
  },
]

// Not live yet, so named rather than shown.
const BUILDING = [
  { name: 'Kizuku', year: '2026', href: '/kizuku', video: '/kizuku/tree-animation.mp4' },
]

// matter-js is ~30 kB gzipped and only matters once this section is reached, so
// it is split out of the initial bundle entirely rather than shipped with the fold.
const SkillsGravity = dynamic(() => import('./components/skills-gravity'), { ssr: false })

const TOOLS = [
  { label: 'Figma', mark: <FigmaMark /> },
  { label: 'Framer', mark: <FramerMark /> },
  { label: 'Illustrator', mark: <IllustratorMark /> },
  { label: 'Claude', mark: <ClaudeMark /> },
  { label: 'Codex', mark: <CodexMark /> },
]

const METHODS = ['UX Research', 'Usability Design', 'Design Thinking', 'Design Systems']

const PLAYGROUND = [
  { name: 'FieldNote', year: '2026', href: '/experiments', img: '/assets/fieldnote-ss.png', w: 1200, h: 675 },
]

// Signal, Madi Things and KL Hi-Tech are not live yet, so they are held back
// rather than listed as work a visitor cannot reach.
function Greeting() {
  const [hour, setHour] = useState(null)
  const splashDone = useSplashDone()
  useEffect(() => setHour(new Date().getHours()), [])

  const part = hour == null ? 'hello' : hour < 12 ? 'good morning' : hour < 17 ? 'good afternoon' : 'good evening'

  // Assamese and Hindi: he is from North Lakhimpur, Assam. The reveal waits for
  // the splash so it is not played underneath it.
  return (
    <p className="text-faint">
      <VerticalCutReveal
        start={splashDone && hour != null}
        delay={0.05}
        segments={[
          { text: `${part},`, lang: 'en' },
          { text: 'নমস্কাৰ,', lang: 'as' },
          { text: 'नमस्ते', lang: 'hi' },
        ]}
      />
    </p>
  )
}

export default function Home() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-40 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}>
        <Image
          src="/assets/avatar.png"
          alt="Ayushman Bharadwaj"
          width={620}
          height={756}
          sizes="72px"
          priority
          className="mb-12 h-auto w-[72px]"
        />
      </motion.div>

      <motion.div {...rise(0.06)} className="space-y-5">
        <Greeting />

        <p>
          I’m{' '}
          <LetterSwap className="text-ink font-medium">Ayushman</LetterSwap>
          , an interaction designer who ships the code.
        </p>

        <p>
          A year in security engineering before design, so I build for how systems actually fail.
          Finishing my masters in interaction design.
        </p>

      </motion.div>

      <motion.div {...rise(0.12)}>
        <Shipped items={SHIPPED} />
        <WorkIndex label="In progress" items={BUILDING} />
        <WorkIndex label="Playground" items={PLAYGROUND} />
      </motion.div>

      <motion.section {...rise(0.18)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">Skills</h2>
        <p>{METHODS.join(' · ')}</p>

        {/* Named in server-rendered text. The well below is client-only, so
            without this the tools appear in no crawler, no keyword scan and no
            no-JS view — and a mark without a label is unreadable regardless. */}
        <p className="mt-2">{TOOLS.map((t) => t.label).join(' · ')}</p>

        {/* Decorative: the marks for the tools named above. */}
        {!reduceMotion && <SkillsGravity items={TOOLS} />}
      </motion.section>

      <motion.section {...rise(0.22)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">Connect</h2>
        <p>
          I’m looking for design-engineering work. The fastest way to reach me is{' '}
          <a href="mailto:ayushman15899@gmail.com" className="prose-link">email</a>. I’m also on{' '}
          <a href="https://www.linkedin.com/in/ayushman-bharadwaj-660759289/" target="_blank" rel="noopener noreferrer" className="prose-link">LinkedIn</a>{' '}
          and <a href="https://x.com/AyushmanBharad" target="_blank" rel="noopener noreferrer" className="prose-link">X</a>.
        </p>
      </motion.section>
    </main>
  )
}
