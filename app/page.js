'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'motion/react'
import GradientText from './components/gradient-text'
import LetterSwap from './components/letter-swap'
import ScrambleText from './components/scramble-text'
import Shipped from './components/shipped'
import Magnet from './components/magnet'
import { FigmaMark, FramerMark, ClaudeMark, IllustratorGlyph, PromptGlyph } from './components/tool-marks'
import VerticalCutReveal from './components/vertical-cut-reveal'

// Live, client-run, and reachable by anyone — so these are shown, not listed.
const SHIPPED = [
  {
    name: 'Banyan Tree',
    kind: 'Website · Live',
    href: '/banyan',
    site: 'himanshugarg.in',
    url: 'https://www.himanshugarg.in/',
    shot: '/shipped/banyan.jpg',
    alt: 'The Banyan Tree homepage: twelve categories of symptom over a banyan canopy',
    what: 'A website for a functional-medicine practice. You move from a symptom down to its causes.',
    tags: ['Concept', 'Interface', 'Front end', 'Handover'],
  },
  {
    name: 'Hoychoy Cafe',
    kind: 'Service design · Live',
    href: '/case-study',
    live: true,
    site: 'hoychoycafe.com',
    url: 'https://www.hoychoycafe.com/',
    shot: '/shipped/hoychoy-card.jpg',
    alt: 'Three Hoychoy Cafe screens on yellow: the owner’s open/closed switch, the menu, and the checkout',
    what: (
      <>
        A café’s WhatsApp orders moved to a web ordering system. Handling time per order went from{' '}
        <GradientText>6–8 minutes to 2–3</GradientText>.
      </>
    ),
    tags: ['Research', 'Service design', 'Interface', 'Build'],
  },
]

// A campaign and maker platform: a static page of its own, so it opens as a
// plain link rather than through the case-study card transition.
const CAMPAIGN = [
  {
    name: 'Choose Assam',
    kind: 'Campaign and maker platform · Tata Tea Premium',
    href: '/choose-assam',
    static: true,
    site: 'M.Des project · Speculative',
    shot: '/choose-assam/card.jpg',
    alt: 'A gift box of six Tata Tea Premium packs, each with a pattern from one Assam craft community, and their story cards',
    what: 'After a flood, Tata Tea uses its packs and ads to send people to Assam’s makers, so they can buy from them instead of donating. Six community pack editions and a maker platform.',
    tags: ['Strategy', 'Packaging', 'Campaign', 'Platform'],
  },
]

// Case studies of work that is not live, so the right-hand slot names the
// evidence rather than a domain — but shown, not listed: the screens are the
// argument, and a hover-only preview hid them from every phone.
const RESEARCH = [
  {
    name: 'Koi Wishing Pond',
    kind: 'Interactive installation · Exhibited at UPES',
    href: '/koi-wishing-pond',
    play: '/koi-wishing-pond/pond',
    site: 'Exhibited at UPES',
    shot: '/research/koi-loop.jpg',
    video: '/research/koi-loop.mp4',
    alt: 'The koi pond from above: six koi, lily pads and coins on the water, with ripple rings',
    what: 'A koi pond projected on the floor that answers your hand. You can play it in your browser.',
    tags: ['Interaction', 'TouchDesigner', 'Hand tracking', 'Installation'],
  },
  {
    name: 'Kizuku',
    kind: 'iOS app · In development',
    href: '/kizuku',
    site: 'In development',
    shot: '/research/kizuku-loop.jpg',
    video: '/research/kizuku-loop.mp4',
    alt: 'A worry becomes one small action, the seed grows when it is done, then three Kizuku screens',
    what: 'An iOS app for people who overthink the future. You give it one worry and get one small thing to do today.',
    tags: ['Brand', 'Design system', 'Interaction', 'iOS build'],
  },
  {
    name: 'Signal',
    kind: 'Concept feature for DMRC · Research and interaction design',
    href: '/signal',
    site: '7 interviews · 3 directions dropped',
    shot: '/signal/v4/hero.jpg',
    alt: 'Three Signal screens on a pale blue sky: a lock-screen alert, the decision screen reading Backups work until 9:31, and a booked bike taxi',
    what: 'For people who take the Delhi Metro to work every day. When their line is delayed, Signal shows how long their other ways to work still get them there on time.',
    tags: ['Research', 'Interaction', 'Systems', 'Prototype'],
  },
]

// Ordered for a recruiter: live work with measured results, then tested research, then
// the product being built, then the speculative campaign, then the installation.
const byName = Object.fromEntries([...CAMPAIGN, ...SHIPPED, ...RESEARCH].map((p) => [p.name, p]))
const SELECTED = ['Signal', 'Kizuku'].map((n) => byName[n])

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

// Brand and communication work: a different discipline from the product case
// studies, so it gets its own short index rather than a card among them.
// The case study is a standalone static page, opened in a new tab.

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
      {/* Entrance: the text is there from the first frame; the lamp drops in
          (see Lamp), then the magnet lands at 500ms. */}
      <div className="relative h-[140px] w-[220px] flex-none lg:order-last lg:mt-1.5 lg:h-[190px]">
        <div data-lamp-target className="absolute left-0 top-0 lg:left-12 lg:top-[46px]">
          <Magnet drop={!returning} />
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-5 lg:pt-10 [&>*]:max-w-[38rem]">
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
      </div>
      </div>

      <motion.div {...rise(0.12)}>
        {/* Only the work with a full case study, strongest first, one per row.
            Everything else is in the Archive (linked under the list and in the nav). */}
        <Shipped label="Selected work" items={SELECTED} rows />
        <p className="track-wide text-faint mt-6" style={{ fontSize: '0.95rem' }}>
          Client work, the Koi Wishing Pond, the Choose Assam campaign, motion and smaller experiments are in the <Link href="/archive" className="prose-link">archive</Link>.
        </p>
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
