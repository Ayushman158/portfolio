'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import KizukuInteractions from '../components/kizuku-interactions'
import { Back, Decisions, Facts, Heading, Rule, Shots } from '../components/case-study'

// Carried over from the long version — the substance, without the scaffolding.
const FACTS = [
  ['Role', 'Sole designer and developer'],
  ['Scope', 'Research, brand, design system, iOS build'],
  ['Stack', 'React Native · Expo · Figma'],
  ['Status', 'In development — the loop runs end to end on device'],
]

const TYPES = [
  { type: 'optimizer', tree: 'spiral tree', quote: 'is this the most efficient use of my time right now?' },
  { type: 'seeker', tree: 'crystal tree', quote: 'what if this is not the life i was supposed to build?' },
  { type: 'planner', tree: 'strata tree', quote: 'i need to make sure i am not making a mistake i cannot undo.' },
]

// Found the first time the app ran on a phone rather than in a browser
// pretending to be one. Kept because the specifics are the point.
const DEVICE = [
  ['A crash on the very first launch', 'A dev-only shortcut read window.location during render. React Native defines a global window, so the guard around it passed — but location does not exist there, and it would have thrown before anything drew.'],
  ['The primary button under the keyboard', 'The worry screen focuses its input on entry, so the keyboard is up from the first frame, covering the only button. A KeyboardAvoidingView was already there and doing nothing: padding shrinks the container, but the slip has a minimum height, so nothing inside could yield.'],
  ['Two reference edges in one layout', 'The garden was measured downward from the top and the prompt card upward from the bottom. That holds until the container changes height — and the safe area takes about 93pt out of it, so the card climbed into the plant.'],
  ['A white halo on every tree', 'Cutting the illustrations off the white board they were drawn on left the board’s colour in the anti-aliased rim with partial transparency. Invisible on white, a fringe on parchment. About half the edge pixels; now under one percent.'],
  ['The garden assembling itself', 'Nothing was preloaded, so the screen arrived first and the landscape and the plant a beat later. What a returning user actually saw was a watering can alone on an empty field.'],
]

const DECISIONS = [
  ['Built for future anxiety, not general stress', 'The apps I reviewed treat anxiety as one broad spectrum. None addressed excessive forward simulation on its own. That gap is what Kizuku is designed for.'],
  ['The type had to actually decide something', 'For a while it did not. The quiz set colours and artwork, and the action was then picked by summing the character codes of your worry — personality was not an input at all. Actions now carry the types they serve, selection rotates least-recently-used inside your own pool, and what you wrote is read once, in memory, to prefer one action over another. It is still never stored.'],
  ['Six stages, landing on thirty', 'Growth used to finish after a single action, so the metaphor the whole loop builds toward was spent on day one. Three trees at six stages each. The curve opens fast — the second stage arrives immediately, so nobody waits to see that this responds to them — then lengthens to put the last stage at the thirty-day milestone the brand already committed to.'],
  ['Growth tied to emotional labour, not time', 'Forest grows a tree when you sit still. Kizuku grows one when you face something hard. Same mechanic, completely different meaning.'],
  ['No streaks, with the reasoning written down', 'Streaks create performance anxiety in someone who already has it. Missing a day does not shrink the tree. Designed out, not overlooked.'],
  ['Copy decided at word level', '"Start quiz" against "find my tree type" — one word decides whether the user feels assessed or invited. Every line documented with its before and after.'],
]

// Captured from the running build, not from the Figma comps — this is what
// the app actually looks like today, Satoshi and all.
const SCREENS = [
  ['/kizuku/app/garden.jpg', 'the garden. the planner’s tree at three actions.'],
  ['/kizuku/app/worry.jpg', 'one worry. it is read once and never stored.'],
  ['/kizuku/app/action.jpg', '“putting off the file” came back as start.'],
  ['/kizuku/app/reflection.jpg', 'what happened. this becomes the journal page.'],
  ['/kizuku/app/growth.jpg', 'the tree at its next stage.'],
]

export default function Kizuku() {
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
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>気づく · kizuku · 2026</p>

        <h1 style={{ color: 'var(--ink)', fontSize: '2rem', lineHeight: 1.2, fontWeight: 500, letterSpacing: '-0.02em' }}>
          A wellness app for people who overthink the future.
        </h1>

        <p>
          It turns one worry into one grounded action, every day, and grows a tree from the doing rather
          than from the time served. I did the research, the brand, the design system and the iOS build.
        </p>

        <p>
          The daily loop runs end to end — onboarding, the ritual, and the growth moment — and the three
          interactions below are pulled straight out of it.
        </p>
      </motion.header>

      <motion.div {...rise(0.1)}><Facts rows={FACTS} /></motion.div>

      <motion.p {...rise(0.14)} className="mt-8">
        <a href="https://www.figma.com/proto/80dVRiAfseQp409VZtvZZ6/Kizuku?node-id=160-994&t=xcyzJ9w5g52hdI6V-1" target="_blank" rel="noopener noreferrer" className="prose-link">Figma prototype</a>
        {' · '}
        <Link href="/kizuku/process" className="prose-link">Full process, 4 stages</Link>
      </motion.p>

      <Rule />

      {/* ─── the interesting part, second ────────────────────────────────── */}
      <motion.section {...rise(0.18)}>
        <Heading>Every animation has a reason that fits in one sentence.</Heading>
        <p className="mb-3">
          If it could not be explained, it was removed. Three of them are here — drag the can, hold the
          button, replay the growth. Every number is measured from the shipped React Native code, and the
          release logic is the same function.
        </p>
        <p className="text-faint mb-8" style={{ fontSize: '0.95rem' }}>
          Rebuilt for the browser with Motion. They want a pointer or a thumb.
        </p>

        <KizukuInteractions />

        <div className="mt-8 flex justify-center">
          <div className="kz-grow-sprite" role="img" aria-label="The optimiser's seed opening into its plant" />
        </div>
        <p className="text-faint mt-2 text-center" style={{ fontSize: '0.9rem' }}>
          The optimiser's growth, keyed to a 111 KB sprite from a 3.9 MB clip.
        </p>
      </motion.section>

      <Rule />

      {/* ─── why it exists ───────────────────────────────────────────────── */}
      <motion.section {...rise(0.2)}>
        <Heading>An underserved market, a precisely defined user.</Heading>
        <p className="mb-4">
          Future anxiety is a cognitive pattern rather than a disorder — mentally simulating what could go
          wrong before anything has happened. Every wellness app I reviewed either treats general stress or
          gamifies self-care. None addressed forward simulation on its own.
        </p>
        <p>
          The quiz sorts you into one of three types in three questions, and the type owns the plant you
          grow, the copy you read and the surface it sits on.
        </p>

        <div className="track-wide mt-8 grid sm:grid-cols-[1fr_200px] lg:grid-cols-[1fr_300px] gap-8 lg:gap-14 items-start">
          <div>
          {TYPES.map((t) => (
            <div key={t.type} className="index-row" style={{ gridTemplateColumns: '1fr', gap: '0.35rem' }}>
              <div className="flex items-baseline justify-between gap-4">
                <span style={{ color: 'var(--ink)' }}>{t.type}</span>
                <span className="text-faint" style={{ fontSize: '0.9rem' }}>{t.tree}</span>
              </div>
              <p className="text-faint" style={{ fontSize: '0.95rem' }}>“{t.quote}”</p>
            </div>
          ))}
          </div>
          <figure className="m-0">
            <img src="/kizuku/app/reveal.png" alt="The seeker's type reveal" loading="lazy"
              className="w-full h-auto rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
              the seeker's reveal — the type owns the surface
            </figcaption>
          </figure>
        </div>
      </motion.section>

      <Rule />

      {/* ─── the loop ────────────────────────────────────────────────────── */}
      <motion.section {...rise(0.22)}>
        <Heading>The daily loop.</Heading>
        <p className="mb-8">
          Five screens, one a day, captured from the app running on an iPhone. The tab bar leaves after the
          garden and comes back at the growth, so there is nothing to tab out to in the middle of the
          ritual. The action in the third shot is the one that worry actually produced.
        </p>

        <Shots items={SCREENS} />
      </motion.section>

      <Rule />

      {/* ─── the system ──────────────────────────────────────────────────── */}
      <motion.section {...rise(0.24)}>
        <Heading>The system underneath.</Heading>
        <p className="mb-4">
          Three faces, each with one job: Newsreader sets what the app says to you, Satoshi sets what the
          interface says about itself, and Caveat is reserved for the journal, because those words are
          yours and not ours. All lowercase — a register none of the apps I mapped use. Three tree types
          across eighteen illustrations, so the personality is visible from the seed. The logo was
          discovered rather than designed: it came out of a watercolour wash made during research.
        </p>
        <p>
          Colour, type, spacing, motion and components are documented as tokens the build consumes
          directly, rather than as a picture of a design system.
        </p>
      </motion.section>

      <Rule />

      {/* ─── what only the device knew ───────────────────────────────────── */}
      <motion.section {...rise(0.25)}>
        <Heading>Five bugs a browser could not have found.</Heading>
        <p className="mb-4">
          Every check I had run until then was a browser at 402&nbsp;&times;&nbsp;874, which is a picture of
          a phone rather than a phone. The first run on real hardware found five faults in an hour, and
          four of them were in code I had already reviewed and believed.
        </p>
        <p className="mb-8">
          None of them are exotic. They are what a simulated viewport cannot tell you: that a global exists
          but its properties do not, that a keyboard takes half the screen, that a safe area is not free,
          that an anti-aliased edge remembers the colour behind it.
        </p>

        <Decisions items={DEVICE} />
      </motion.section>

      <Rule />

      {/* ─── the arguments ───────────────────────────────────────────────── */}
      <motion.section {...rise(0.26)}>
        <Heading>Six decisions I would defend.</Heading>
        <Decisions items={DECISIONS} />
      </motion.section>

      <motion.section {...rise(0.28)} className="mt-14">
        <p>
          The complete process — the painting that became the brief, four rejected names, the competitive
          analysis and all eighteen illustrations — is in the{' '}
          <Link href="/kizuku/process" className="prose-link">full process</Link>.
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/banyan" className="prose-link">Banyan Tree</Link> and{' '}
          <Link href="/case-study" className="prose-link">Hoychoy Cafe</Link>.
        </p>
      </motion.section>
    </main>
  )
}
