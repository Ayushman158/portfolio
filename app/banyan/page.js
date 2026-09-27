'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Decisions, Facts, Figure, Heading, Overview, Rule, Shots } from '../components/case-study'

// The whole project in four answers, readable before anything else.
const OVERVIEW = [
  ['Context', 'Himanshu Garg runs a functional-medicine practice. Patients found him through referrals and talked to him on WhatsApp.'],
  ['Problem', 'He had nowhere to send someone who wanted to know what he does before messaging a stranger about their health.'],
  ['Why it matters', 'The brief was credibility, not conversion: to look as serious online as he is in person. And his method, that every symptom has deeper causes, is hard to explain in words alone.'],
  ['What I did', 'The banyan idea is his: symptoms in the canopy, causes in the roots. I turned it into the site’s navigation, built it, launched it and handed it over so he can run it himself.'],
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

      <motion.div {...rise(0.1)}><Facts rows={FACTS} /></motion.div>
      <motion.p {...rise(0.14)} className="mt-8">
        <a href="https://www.himanshugarg.in/" target="_blank" rel="noopener noreferrer" className="prose-link">
          Visit himanshugarg.in
        </a>
        <span className="text-faint"> · 12 categories, 108 conditions, 11 root causes</span>
      </motion.p>

      <Rule />

      <motion.section {...rise(0.18)}>
        <Heading n="01">The idea</Heading>
        <p>
          Functional medicine says a symptom is the visible end of a longer story. Instead of writing
          that down, the site makes you do it: pick a condition in the canopy and the page goes
          underground to the causes behind it. Threads connect your condition to its roots, because the
          practice also says the roots are connected to each other.
        </p>
        <Figure
          src="/banyan/roots.jpg"
          alt="The underground view: eleven root causes laid along the banyan's roots, with threads drawn to the selected condition"
          caption="Underground, after choosing depression: the threads lead to the root causes behind it."
          className="mt-8"
        />
      </motion.section>

      <Rule />

      <motion.section {...rise(0.2)}>
        <Heading n="02">How it works</Heading>
        <p className="mb-8">
          Four levels: canopy, category, roots, detail. One state drives the background, the
          breadcrumb, the tint and the back button, so every level stays in step. Escape goes back up
          one level at a time.
        </p>
        <Shots items={SCREENS} />
      </motion.section>

      <Rule />

      <motion.section {...rise(0.22)}>
        <Heading n="03">Handing it over</Heading>
        <p className="mb-4">
          A site built for someone else shouldn’t need a phone call every time something changes. The
          repo has four short guides: running and deploying it, pointing the domain, adding a
          testimonial without touching code, and what can and can’t be protected in a site every
          browser downloads.
        </p>
        <p>
          Deploying is a push to <span style={{ color: 'var(--ink)' }}>main</span>, and rolling back is
          promoting the last good build. The part that changes every week, patient stories, he edits
          in a spreadsheet.
        </p>
        <Figure
          src="/banyan/detail.jpg"
          alt="A root cause opened in its side panel, with domain, span and layer metadata"
          caption="One root cause, opened: a side panel on desktop, a bottom sheet on a phone."
          className="mt-8"
        />
      </motion.section>

      <Rule />

      <motion.section {...rise(0.24)}>
        <Heading n="04">Decisions</Heading>
        <Decisions items={DECISIONS} />
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
