'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Decisions, Facts, Figure, Heading, Rule, Shots } from '../components/case-study'

const FACTS = [
  ['Role', 'Sole designer and developer'],
  ['Scope', 'Concept, interface, front end, launch, handover'],
  ['Stack', 'React 19 · Vite · Vercel'],
  ['Status', 'Live at himanshugarg.in'],
]

// The descent, captured from the live site.
const SCREENS = [
  ['/banyan/app/1-splash.jpg', 'the opening. one line, one door.'],
  ['/banyan/app/2-canopy.jpg', 'the canopy — twelve categories of symptom'],
  ['/banyan/app/3-category.jpg', 'the symptoms inside one category'],
  ['/banyan/app/4-roots.jpg', 'underground. the roots that feed the symptom you picked.'],
  ['/banyan/app/5-detail.jpg', 'one root, opened. a sheet on the phone, a panel on desktop.'],
]

const DECISIONS = [
  [
    'The metaphor is the navigation, not the wallpaper',
    'A banyan behind an ordinary page would be decoration. Here the tree is the information architecture: symptoms live in the canopy, causes live in the roots, and getting from one to the other is a descent you perform rather than a claim you read. The breadcrumb keeps the whole path visible — the tree, the category, the condition, the root.',
  ],
  [
    'The client edits the part that changes most',
    'Testimonials come from a published Google Sheet — one row per story, with the name, age, profession, an unlisted YouTube link and what changed. A new row is on the site in a minute or two with no deploy and nobody to call. If the sheet is ever unreachable the section falls back to built-in stories instead of collapsing.',
  ],
  [
    'The marquee runs off the main thread, and the drag hands back to it',
    'Testimonial auto-scroll is a CSS keyframe so iOS never runs it on the main thread; the drag takes over on touch and hands it back without a seam. The speed is time-based rather than per-frame, so it reads the same on a 60Hz screen and a 120Hz one.',
  ],
  [
    'Motion stops when nobody is watching it',
    'The method icons animate only while their section is on screen, and not at all on touch devices, where they cost more than they returned. The testimonial scroll starts when the section is reached, not when the page loads. The method illustrations came in at 27 MB and went out at 6, preloaded on hover so the popup opens instantly.',
  ],
  [
    'Security headers on a site that sells a coaching program',
    'HSTS, nosniff, frame options, a referrer policy, and a permissions policy that turns off camera, microphone, geolocation, payment and USB. None of it is required for a brochure site. It is the habit from the year I spent in security engineering, and it costs one config file.',
  ],
  [
    'The disclaimer and the policies shipped before launch, not after',
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
    <main className="measure min-h-screen pb-40 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}>
        <Back />
      </motion.div>

      {/* ─── what it is, in the first screen ─────────────────────────────── */}
      <motion.header {...rise(0.06)} className="mt-10 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>himanshugarg.in · 2026</p>

        <h1 style={{ color: 'var(--ink)', fontSize: '2rem', lineHeight: 1.2, fontWeight: 500, letterSpacing: '-0.02em' }}>
          A health practice whose whole claim is that symptoms are not causes.
        </h1>

        <p>
          So the site makes you go and find the cause. You pick a condition up in the canopy, the page
          descends into the root system, and threads are drawn from your condition to the roots that
          feed it. Twelve categories, 108 conditions, eleven root causes, one continuous move
          downward.
        </p>

        <p>
          It is live, it is the practice&rsquo;s only site, and the client updates the parts that change
          without needing me.
        </p>
      </motion.header>

      <motion.div {...rise(0.1)}><Facts rows={FACTS} /></motion.div>

      <motion.p {...rise(0.14)} className="mt-8">
        <a href="https://www.himanshugarg.in/" target="_blank" rel="noopener noreferrer" className="prose-link">
          himanshugarg.in
        </a>
      </motion.p>

      <Rule />

      {/* ─── the idea ────────────────────────────────────────────────────── */}
      <motion.section {...rise(0.18)}>
        <Heading>The metaphor had to carry weight, or it was decoration.</Heading>
        <p className="mb-4">
          Functional medicine argues that a symptom is the visible end of something with a longer
          history. That is a hard thing to make a person feel by writing it down. So the argument
          became the structure: a banyan, symptoms in the canopy, causes underground, and a
          navigation that is literally a descent.
        </p>
        <p>
          Choose depression and the ground opens. The eleven root causes are laid out along the real
          roots, and faint threads run from the condition you chose to the ones that feed it, because
          the practice&rsquo;s second claim is that the roots are connected to each other.
        </p>

        <Figure
          src="/banyan/roots.jpg"
          alt="The underground view: eleven root causes laid along the banyan's roots, with threads drawn to the selected condition"
          caption="underground, after choosing depression. the threads are the argument — “each root is connected. healing one nourishes all.”"
          className="mt-8"
        />
      </motion.section>

      <Rule />

      {/* ─── the descent ─────────────────────────────────────────────────── */}
      <motion.section {...rise(0.2)}>
        <Heading>The descent, in five screens.</Heading>
        <p className="mb-8">
          One state machine runs the whole page — canopy, category, roots, detail — so the background,
          the breadcrumb, the tint and the back label all follow from a single phase rather than from
          four separate screens. Escape walks you back up one level at a time.
        </p>

        <Shots items={SCREENS} />
      </motion.section>

      <Rule />

      {/* ─── the handoff ─────────────────────────────────────────────────── */}
      <motion.section {...rise(0.22)}>
        <Heading>He can run it without me.</Heading>
        <p className="mb-4">
          The failure mode for a site built for someone else is that it becomes a thing they have to
          phone you about. Four documents ship in the repo: how to run and deploy it, how to point the
          domain, how to add a testimonial without touching code, and a plain-language note on what
          can and cannot be protected about a design that gets sent to every visitor&rsquo;s browser.
        </p>
        <p>
          Deploys are a push to <span style={{ color: 'var(--ink)' }}>main</span>; a rollback is
          promoting the last good build. The one thing that changes weekly — client stories — he owns
          outright, in a spreadsheet.
        </p>

        <Figure
          src="/banyan/detail.jpg"
          alt="A root cause opened in its side panel, with domain, span and layer metadata"
          caption="one root, with its domain, span and layer. the panel is a side sheet on desktop and a bottom sheet on a phone."
          className="mt-8"
        />
      </motion.section>

      <Rule />

      {/* ─── the arguments ───────────────────────────────────────────────── */}
      <motion.section {...rise(0.24)}>
        <Heading>Six decisions I would defend.</Heading>
        <Decisions items={DECISIONS} />
      </motion.section>

      <motion.section {...rise(0.26)} className="mt-14">
        <p>
          The practice runs on it today at{' '}
          <a href="https://www.himanshugarg.in/" target="_blank" rel="noopener noreferrer" className="prose-link">himanshugarg.in</a>.
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link> and{' '}
          <Link href="/case-study" className="prose-link">Hoychoy Cafe</Link>.
        </p>
      </motion.section>
    </main>
  )
}
