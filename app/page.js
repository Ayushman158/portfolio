'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'motion/react'
import GradientText from './components/gradient-text'
import LetterSwap from './components/letter-swap'
import WorkIndex from './components/work-index'
import ScrambleText from './components/scramble-text'
import Shipped from './components/shipped'
import Magnet from './components/magnet'
import { FigmaMark, FramerMark, ClaudeMark, IllustratorGlyph, PromptGlyph } from './components/tool-marks'
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
    live: true,
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

// Each tool is a button in its own colour; the methods are paper tags.
const TOOLS = [
  { label: 'Figma', mark: <FigmaMark />, ball: '#F7F5F0' },
  { label: 'Framer', mark: <FramerMark fill="#fff" />, ball: '#2553F0' },
  { label: 'Illustrator', mark: <IllustratorGlyph />, ball: '#2B0A02' },
  { label: 'Claude', mark: <ClaudeMark />, ball: '#F3ECE0' },
  { label: 'Codex', mark: <PromptGlyph />, ball: '#111111' },
]

const METHODS = ['UX Research', 'Usability Design', 'Design Thinking', 'Design Systems']

const PLAYGROUND = [
  // The reel lives on its own page; here it is one row, and the hover preview
  // plays it, so the index never repeats what the cards above already show.
  { name: 'Showreel', year: '2026', href: '/reel', video: '/reel/showreel-preview.mp4' },
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

const EMAIL = 'ayushman15899@gmail.com'

/**
 * The page's one call to action. A mailto link alone fails anyone without a
 * mail app set up, which on a borrowed or work laptop is most people, so the
 * address can also be copied, and says so when it has been.
 */
function EmailActions({ onCopied }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      onCopied?.()
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${EMAIL}`} className="btn-primary">Email me</a>
      <button type="button" onClick={copy} className="btn-quiet">
        <span aria-live="polite" className="inline-block min-w-[6.5rem] text-center">{copied ? 'Copied ✓' : 'Copy address'}</span>
      </button>
    </div>
  )
}

/**
 * Connect, pinned to the page as a paper note. Copying the address makes the
 * pin hop, as if the note had been tapped.
 */
function PinnedNote({ children }) {
  const [hop, setHop] = useState(false)
  const onCopied = () => {
    setHop(true)
    setTimeout(() => setHop(false), 170)
  }
  return (
    <div className="relative mt-8 max-w-[29rem]" style={{ transform: 'rotate(-1.2deg)' }}>
      <span
        aria-hidden="true"
        className="pushpin absolute left-1/2 top-[-13px] z-10 -ml-3.5 block h-7 w-7 rounded-full"
        style={{ transform: `translateY(${hop ? -7 : 0}px)` }}
      >
        <span className="absolute left-1.5 top-[5px] block h-1.5 w-2.5 rounded-full" style={{ background: 'rgba(255,255,255,.45)' }} />
      </span>
      <div className="pin-note flex flex-col gap-5 px-7 pb-6 pt-8">
        {children}
        <EmailActions onCopied={onCopied} />
      </div>
    </div>
  )
}

export default function Home() {
  const reduceMotion = useReducedMotion()
  // Coming back from a case study, the page is already here: a card is about
  // to shrink into place, and a page fading in underneath would swallow it.
  const [returning] = useState(() => typeof window !== 'undefined' && window.__caseReturn === true)
  useEffect(() => { window.__caseReturn = false }, [])

  const rise = (delay) => returning ? { initial: false } : ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      {/* One left edge for the whole page. The intro, the work and the closing
          sections all start where the case-study cards start, and the text
          only narrows on the right, to a reading width. Before, the edge
          stepped in for the intro, out for the work and in again at the end. */}
      {/* The hero: words on the left, the avatar on the right as a magnet you
          can pick up, with the lamp hanging beside it. On a phone the avatar
          leads, as it always has. */}
      <div className="track-wide flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-12">
      <motion.div {...rise(0)} className="relative h-[140px] w-[220px] flex-none lg:order-last lg:mt-1.5 lg:h-[190px]">
        <div data-lamp-target className="absolute left-0 top-0 lg:left-12 lg:top-[46px]">
          <Magnet />
        </div>
      </motion.div>

      <motion.div {...rise(0.06)} className="min-w-0 flex-1 space-y-5 lg:pt-10 [&>*]:max-w-[38rem]">
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
      </div>

      <motion.div {...rise(0.12)}>
        <Shipped items={SHIPPED} />
        <Shipped label="Case studies" items={RESEARCH} />
        <WorkIndex label="Playground" items={PLAYGROUND} />
      </motion.div>

      {/* Skills across the full track, as things to pick up; then Connect. */}
      <div className="track-wide mt-16 grid gap-y-16">
        <motion.section {...rise(0.18)}>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-faint text-[0.95rem]"><ScrambleText>Skills</ScrambleText></h2>
            {!reduceMotion && <span aria-hidden="true" className="text-faint text-[0.95rem]">Drag them around</span>}
          </div>

          {/* Named in server-rendered text, for crawlers, keyword scans and
              screen readers. The well below shows the same words and marks as
              things to throw, and is hidden from assistive tech. */}
          <p className="sr-only">{METHODS.join(', ')}. Tools: {TOOLS.map((t) => t.label).join(', ')}.</p>

          <SkillsGravity tools={TOOLS} tags={METHODS} still={!!reduceMotion} />
        </motion.section>

        <motion.section {...rise(0.22)}>
          <h2 className="text-faint text-[0.95rem] mb-3"><ScrambleText>Connect</ScrambleText></h2>
          <PinnedNote>
            <p>
              I’m looking for UX/UI or design-engineering work, somewhere I can take an idea from research
              through to shipping. The fastest way to reach me is email. I’m also on{' '}
              <a href="https://www.linkedin.com/in/ayushman-bharadwaj-660759289/" target="_blank" rel="noopener noreferrer" className="prose-link">LinkedIn</a>{' '}
              and <a href="https://x.com/AyushmanBharad" target="_blank" rel="noopener noreferrer" className="prose-link">X</a>.
            </p>
          </PinnedNote>
        </motion.section>
      </div>
    </main>
  )
}
