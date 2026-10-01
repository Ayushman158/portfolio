'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Facts, Figure, Heading, Impact, Overview, Rule, Shots, Tradeoffs } from '../components/case-study'

// The whole project in four answers, readable before anything else.
const OVERVIEW = [
  ['Context', 'Himanshu Garg runs a functional-medicine practice. Patients came through referrals and talked to him on WhatsApp.'],
  ['Problem', 'He had nowhere to send someone who wanted to know what he does before messaging a stranger about their health.'],
  ['Why it matters', 'The brief was to look as credible online as he is in person, not to sell. And his idea, that every symptom has deeper causes, is hard to explain in words.'],
  ['What I did', 'The banyan idea is his: symptoms in the canopy, causes in the roots. I turned it into the site’s navigation, built it, launched it and handed it over.'],
]

const IMPACT = [
  ['Live', 'the practice’s only website, at himanshugarg.in'],
  ['1–2 min', 'for him to publish a new patient story from a spreadsheet, no developer'],
  ['6 MB', 'of illustrations, cut so the site loads well on phones', '27 MB'],
  ['108', 'conditions, each linked to its root causes'],
]

// What I was up against, what I chose, and what that gave up.
const TRADEOFFS = [
  ['A metaphor can easily hide the content', 'The tree is the navigation, with a breadcrumb that always shows where you are', 'Less familiar than a menu; it asks visitors to explore'],
  ['He has to run the site without me', 'Patient stories come from a Google Sheet, plus four short guides in the repo', 'He can change the stories, not the layout'],
  ['Heavy illustrations and animation on phones', 'Animation runs only on screen and not on touch; illustrations cut from 27 MB to 6 MB', 'Phones get a calmer, less animated page'],
  ['A health site that takes payments', 'Privacy, terms, refunds, a medical disclaimer and security headers, all before launch', 'More work up front than a simple site usually gets'],
]

const FACTS = [
  ['Role', 'Sole designer and developer'],
  ['Scope', 'Concept, interface, front end, launch, handover'],
  ['Stack', 'React 19 · Vite · Vercel'],
  ['Status', 'Live at himanshugarg.in'],
]

// The descent, captured from the live site.
const SCREENS = [
  ['/banyan/app/1-splash.jpg', 'The opening screen.'],
  ['/banyan/app/2-canopy.jpg', 'The canopy: twelve categories of symptom.'],
  ['/banyan/app/3-category.jpg', 'The symptoms in one category.'],
  ['/banyan/app/4-roots.jpg', 'Underground: the root causes behind the symptom you picked.'],
  ['/banyan/app/5-detail.jpg', 'One root cause, opened.'],
]

const DECISIONS = [
  [
    'The tree is the navigation',
    'A banyan behind an ordinary page would be decoration. Here the tree is the information architecture: symptoms live in the canopy, causes live in the roots, and getting from one to the other is a descent you perform rather than a claim you read. The breadcrumb keeps the whole path visible — the tree, the category, the condition, the root.',
  ],
  [
    'He updates testimonials from a spreadsheet',
    'Testimonials come from a published Google Sheet — one row per story, with the name, age, profession, an unlisted YouTube link and what changed. A new row is on the site in a minute or two with no deploy and nobody to call. If the sheet is ever unreachable the section falls back to built-in stories instead of collapsing.',
  ],
  [
    'Scrolling testimonials that stay smooth on phones',
    'Testimonial auto-scroll is a CSS keyframe so iOS never runs it on the main thread; the drag takes over on touch and hands it back without a seam. The speed is time-based rather than per-frame, so it reads the same on a 60Hz screen and a 120Hz one.',
  ],
  [
    'Animation runs only when it is on screen',
    'The method icons animate only while their section is on screen, and not at all on touch devices, where they cost more than they returned. The testimonial scroll starts when the section is reached, not when the page loads. The method illustrations came in at 27 MB and went out at 6, preloaded on hover so the popup opens instantly.',
  ],
  [
    'Security headers from day one',
    'HSTS, nosniff, frame options, a referrer policy, and a permissions policy that turns off camera, microphone, geolocation, payment and USB. None of it is required for a brochure site. It is the habit from the year I spent in security engineering, and it costs one config file.',
  ],
  [
    'Legal pages before launch, not after',
    'Privacy, terms, refund, consent and a medical disclaimer, written and wired into the footer before the site went live. A page that discusses chronic illness and takes money needs them on day one — adding them later means shipping a window in which it did not have them.',
  ],
]

export default function Banyan() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}>
        <Back />
      </motion.div>

      {/* ─── what it is, in the first screen ─────────────────────────────── */}
      <motion.header {...rise(0.06)} className="mt-10 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>himanshugarg.in · 2026 · Website, design and build</p>
        <h1 className="display">Banyan Tree: a website for a functional-medicine practice</h1>
      </motion.header>
      <motion.div {...rise(0.08)}><Overview items={OVERVIEW} /></motion.div>
      <motion.div {...rise(0.1)}><Impact items={IMPACT} /></motion.div>

      {/* The live site as it opens. Not faded in: the card on the index grows
          into this image. */}
      <figure data-case-hero className="track-full mt-12 overflow-hidden rounded-xl" style={{ border: '1px solid var(--rule)' }}>
        <img
          src="/shipped/banyan.jpg"
          alt="The Banyan Tree homepage: twelve categories of symptom over a banyan canopy"
          width={1600}
          height={900}
          className="block h-auto w-full"
        />
      </figure>

      <motion.div {...rise(0.12)}><Facts rows={FACTS} /></motion.div>
      <motion.p {...rise(0.14)} className="mt-8">
        <a href="https://www.himanshugarg.in/" target="_blank" rel="noopener noreferrer" className="prose-link">Visit himanshugarg.in</a>
      </motion.p>

      <Rule />

      <motion.section {...rise(0.18)}>
        <Heading n="01">The idea</Heading>
        <p>
          Functional medicine says a symptom is the visible end of a longer story. Rather than explain
          that, the site has you follow it: pick a condition in the canopy and the page goes underground
          to the causes behind it, with threads joining them.
        </p>
        <Figure
          src="/banyan/roots.jpg"
          alt="The underground view: eleven root causes laid along the banyan's roots, with threads drawn to the selected condition"
          caption="Underground, after choosing depression: the threads lead to the causes behind it."
          className="mt-8"
        />
      </motion.section>

      <Rule />

      <motion.section {...rise(0.2)}>
        <Heading n="02">How it works</Heading>
        <p className="mb-8">
          Four levels: canopy, category, roots, detail. One piece of state drives the background,
          breadcrumb and back button, so they never disagree. Escape goes back up one level.
        </p>
        <Shots items={SCREENS} />
      </motion.section>

      <Rule />

      <motion.section {...rise(0.22)}>
        <Heading n="03">Constraints and tradeoffs</Heading>
        <Tradeoffs items={TRADEOFFS} />
      </motion.section>

      <motion.section {...rise(0.26)} className="mt-16">
        <p>
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link> and{' '}
          <Link href="/case-study" className="prose-link">Hoychoy Cafe</Link>.
        </p>
      </motion.section>
    </main>
  )
}
