'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'motion/react'
import GradientText from './components/gradient-text'
import LetterSwap from './components/letter-swap'
import WorkIndex from './components/work-index'
import ScrambleText from './components/scramble-text'
import Shipped from './components/shipped'
import { FigmaMark, FramerMark, IllustratorMark, ClaudeMark, CodexMark } from './components/tool-marks'
import VerticalCutReveal from './components/vertical-cut-reveal'

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

// Case studies of work that is not live, so the right-hand slot names the
// evidence rather than a domain — but shown, not listed: the screens are the
// argument, and a hover-only preview hid them from every phone.
const RESEARCH = [
  {
    name: 'Kizuku',
    href: '/kizuku',
    site: 'In development',
    shot: '/research/kizuku-loop.jpg',
    video: '/research/kizuku-loop.mp4',
    alt: 'A worry becomes one small action, the seed grows when it is done, then three Kizuku screens',
    what: 'A wellness app for people who overthink the future. One worry in, one small thing to do today — and the tree grows from the doing.',
    tags: ['Brand', 'Design system', 'Interaction', 'iOS build'],
  },
  {
    name: 'Signal',
    href: '/signal',
    site: '7 interviews · 5 tests',
    shot: '/research/signal-loop.jpg',
    video: '/research/signal-loop.mp4',
    alt: 'Signal’s departure card: leave by 8:28, 74% likely on time, then the three screens it lives on',
    what: 'A Delhi Metro companion that tells you when to leave, before you need to. Concept with a working prototype.',
    tags: ['Research', 'Interaction', 'Prototype', 'Film'],
  },
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
  { name: 'ALBUM//ALIVE', year: '2026', href: '/album-alive', img: '/album-alive/fan.jpg', w: 1200, h: 900 },
  { name: 'Motion studies', year: '2026', href: '/motion', img: '/assets/motion-studies.png', w: 1360, h: 1020 },
  { name: 'Gone or Still Here?', year: '2026', href: '/gone-or-still-here', img: '/gone/home.jpg', w: 1600, h: 1000 },
]

// Madi Things and KL Hi-Tech are not live yet, so they are held back
// rather than listed as work a visitor cannot reach.
function Greeting() {
  const [hour, setHour] = useState(null)
  useEffect(() => setHour(new Date().getHours()), [])

  const part = hour == null ? 'hello' : hour < 12 ? 'good morning' : hour < 17 ? 'good afternoon' : 'good evening'

  // Assamese and Hindi: he is from North Lakhimpur, Assam. The reveal waits
  // for the clock so it does not play against a placeholder greeting.
  return (
    <p className="text-faint">
      <VerticalCutReveal
        start={hour != null}
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
      {/* One left edge for the whole page. The intro, the work and the closing
          sections all start where the case-study cards start, and the text
          only narrows on the right, to a reading width. Before, the edge
          stepped in for the intro, out for the work and in again at the end. */}
      <motion.div {...rise(0)} className="track-wide">
        {/* A self-portrait he drew, set in a yellow circle that carries it on
            both themes: the ink never sits on the page ground, so it cannot
            disappear in the dark one. */}
        <Image
          src="/assets/avatar-sketch.webp"
          alt="A pencil self-portrait of Ayushman, curly-haired and half smiling, in a yellow circle"
          width={800}
          height={800}
          sizes="112px"
          priority
          className="mb-7 h-auto w-[112px]"
        />
      </motion.div>

      <motion.div {...rise(0.06)} className="track-wide space-y-5 [&>*]:max-w-[38rem]">
        <Greeting />

        {/* The one sentence the whole page exists to deliver, at the size the
            case studies give their own openings. It was set at 17px — the same
            as everything else — so the page had no element larger than body
            copy and nothing for a scanner to land on. */}
        <h1 className="display">
          I’m <LetterSwap>Ayushman</LetterSwap>, a designer who likes figuring
          things out.
        </h1>

        <p>
          I’m drawn to the space between people and technology: how people think and feel, what can
          actually be built, and turning both into things that are useful, intuitive and visually
          considered. Finishing my masters in interaction design.
        </p>

        <p>
          <Link href="/about" className="prose-link">More about me, and where I’ve worked</Link>
        </p>

      </motion.div>

      <motion.div {...rise(0.12)}>
        <Shipped items={SHIPPED} />
        <Shipped label="Case studies" items={RESEARCH} />
        <WorkIndex label="Playground" items={PLAYGROUND} />
      </motion.div>

      {/* Skills and Connect close the page side by side, on the same two
          columns as the cards, so the end reads as one footer, not two more
          sections in a narrow column. */}
      <div className="track-wide mt-16 grid gap-x-5 gap-y-16 lg:grid-cols-2">
        <motion.section {...rise(0.18)}>
          <h2 className="text-faint text-[0.95rem] mb-3"><ScrambleText>Skills</ScrambleText></h2>
          <p>{METHODS.join(' · ')}</p>

          {/* Named in server-rendered text. The well below is client-only, so
              without this the tools appear in no crawler, no keyword scan and no
              no-JS view — and a mark without a label is unreadable regardless. */}
          <p className="mt-2">{TOOLS.map((t) => t.label).join(' · ')}</p>

          {/* Decorative: the marks for the tools named above. */}
          {!reduceMotion && <SkillsGravity items={TOOLS} />}
        </motion.section>

        <motion.section {...rise(0.22)}>
          <h2 className="text-faint text-[0.95rem] mb-3"><ScrambleText>Connect</ScrambleText></h2>
          <p>
            I’m looking for UX/UI or design-engineering work, somewhere I can take an idea from research
            through to shipping. The fastest way to reach me is{' '}
            <a href="mailto:ayushman15899@gmail.com" className="prose-link">email</a>. I’m also on{' '}
            <a href="https://www.linkedin.com/in/ayushman-bharadwaj-660759289/" target="_blank" rel="noopener noreferrer" className="prose-link">LinkedIn</a>{' '}
            and <a href="https://x.com/AyushmanBharad" target="_blank" rel="noopener noreferrer" className="prose-link">X</a>.
          </p>
        </motion.section>
      </div>
    </main>
  )
}
