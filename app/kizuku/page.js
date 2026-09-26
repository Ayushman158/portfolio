'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import KizukuInteractions from '../components/kizuku-interactions'
import { Back, Cards, Decisions, Facts, Heading, Rule, Shots, SkipTo } from '../components/case-study'
import KizukuHero from './hero'
import { CompetitorMap, Onboarding, Palette, Plate } from './diagrams'

// Carried over from the long version — the substance, without the scaffolding.
const FACTS = [
  ['Role', 'Sole designer and developer'],
  ['Scope', 'Research, brand, design system, iOS build'],
  ['Stack', 'React Native · Expo · Figma'],
  ['Status', 'In development — the loop runs end to end on device'],
  ['Testing', 'Reviewed with professors — not yet tested with users'],
]


const TYPES = [
  { type: 'optimizer', tree: 'spiral tree', quote: 'is this the most efficient use of my time right now?' },
  { type: 'seeker', tree: 'crystal tree', quote: 'what if this is not the life i was supposed to build?' },
  { type: 'planner', tree: 'strata tree', quote: 'i need to make sure i am not making a mistake i cannot undo.' },
]

// Found the first time the app ran on a phone rather than in a browser
// pretending to be one. Kept because the specifics are the point.
const DEVICE = [
  ['A crash on the very first launch', 'A dev-only shortcut read window.location during render. React Native defines a global window, so the guard around it passed, but location does not exist there, and it would have thrown before anything drew.'],
  ['The primary button under the keyboard', 'The worry screen focuses its input on entry, so the keyboard is up from the first frame, covering the only button. A KeyboardAvoidingView was already there and doing nothing: padding shrinks the container, but the slip has a minimum height, so nothing inside could yield.'],
  ['Two reference edges in one layout', 'The garden was measured downward from the top and the prompt card upward from the bottom. That holds until the container changes height, and the safe area takes about 93pt out of it, so the card climbed into the plant.'],
  ['A white halo on every tree', 'Cutting the illustrations off the white board they were drawn on left the board’s colour in the anti-aliased rim with partial transparency. Invisible on white, a fringe on parchment. About half the edge pixels; now under one percent.'],
  ['The garden assembling itself', 'Nothing was preloaded, so the screen arrived first and the landscape and the plant a beat later. What a returning user actually saw was a watering can alone on an empty field.'],
]

// Placed by hand from the review — a picture of positions, not a measurement.
const APPS = [['Headspace', 47, 71, 'below'], ['Calm', 40, 63, 'left'], ['Forest', 56, 59, 'right'], ['Finch', 43, 49, 'above'], ['Reflectly', 36, 54, 'left']]

const GROWTH = [
  ['/kizuku/growth-seeker.webp', 'seeker, the crystal tree — fractures outward at every stage'],
  ['/kizuku/growth-optimizer.webp', 'optimizer, the spiral tree — coils tighten as it matures'],
  ['/kizuku/growth-planner.webp', 'planner, the strata tree — wide and patient, mass before height'],
]

const COLOURS = [
  ['parchment', '#F2EDE0', 'Every competitor uses white or dark. Parchment signals warmth before a word is read.'],
  ['forest', '#2C5228', 'The colour of growth rather than calm, away from the blue-grey wellness register.'],
  ['amber', '#ECD858', 'The kizuku moment, in the logo’s leaf tips. Warm without aggression.'],
  ['sky', '#A8CEDE', 'The seeker. Unusual, and asks for observation rather than control.'],
  ['sage', '#A8CA9C', 'The planner. Slow, patient, long-lived — it rewards consistency.'],
  ['salmon', '#E0906F', 'The moment something arrives: the thirty-day plant, the reward for showing up.'],
]

// From the app's own commit (2e40e3c): the quiz was the second screen, so the
// fear question arrived about forty seconds in and could not be skipped.
const ONBOARDING = {
  before: [['welcome letter'], ['question 1 · what you do'], ['question 2 · what you do'], ['what are you most honestly afraid of? — required', true]],
  after: [['welcome letter'], ['four promises', true], ['question 1 · what you do'], ['question 2 · what you do'], ['the fear question — can be declined', true]],
}

const DECISIONS = [
  ['Built for future anxiety, not general stress', 'The apps I reviewed treat anxiety as one broad spectrum. None addressed excessive forward simulation on its own. That gap is what Kizuku is designed for.'],
  ['The type had to actually decide something', 'For a while it did not. The quiz set colours and artwork, and the action was then picked by summing the character codes of your worry. Personality was not an input at all. Actions now carry the types they serve, selection rotates least-recently-used inside your own pool, and what you wrote is read once, in memory, to prefer one action over another. It is still never stored.'],
  ['Six stages, landing on thirty', 'Growth used to finish after a single action, so the metaphor the whole loop builds toward was spent on day one. Three trees at six stages each. The curve opens fast, so the second stage arrives immediately and nobody waits to see that this responds to them. Then it lengthens, to put the last stage at the thirty-day milestone the brand already committed to.'],
  ['Growth tied to emotional labour, not time', 'Forest grows a tree when you sit still. Kizuku grows one when you face something hard. Same mechanic, completely different meaning.'],
  ['Louder, without a new colour', 'Next to Finch it looked washed out: soft shadows at 8% opacity, pale grounds, grey outline icons. Everything I changed stayed inside the palette. The type colour became the ground, every surface got a hard darker edge, icons are filled with the three type pigments, and light breaks behind the two moments something arrives. I built a watercolour ground, measured it, then took it out after using it on a phone. Contrast was checked on every pixel.'],
  ['Copy decided at word level', '"Start quiz" against "find my tree type": one word decides whether the user feels assessed or invited. Every line documented with its before and after.'],
]

// Captured from the running build, not from the Figma comps — this is what
// the app actually looks like today, Satoshi and all.
const SCREENS = [
  ['/kizuku/app/garden.jpg', 'the garden. the seeker’s tree at three actions.'],
  ['/kizuku/app/worry.jpg', 'one worry. it is read once and never stored.'],
  ['/kizuku/app/action.jpg', '“a message i still haven’t replied to” came back as reach out.'],
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
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}>
        <Back />
      </motion.div>

      {/* ─── what it is, in the first screen ─────────────────────────────── */}
      <motion.header {...rise(0.06)} className="mt-10 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>気づく · kizuku · 2026</p>

        <h1 className="display">
          I think about the future too much.
        </h1>

        <p>
          Before I decide anything I run it forward — what happens, what breaks, what it costs — and the
          running doesn’t stop once the decision is made.
        </p>
        <p>
          Kizuku is for that specific loop: not stress in general, but rehearsing a future that hasn’t
          happened yet. You give it one worry. It gives you one small thing to do today, and your tree
          grows when you do it — from the doing, not from the days.
        </p>
        <p>
          It is an exploration as much as a product — the brand, the eighteen illustrations, the growth
          that only moves when you do something. Research, brand, design system and the iOS build are
          mine, and the whole loop runs on a phone.
        </p>
      </motion.header>

      <motion.div {...rise(0.1)} className="track-full mt-12">
        <KizukuHero className="rounded-xl" />
      </motion.div>
      <SkipTo target="trees">just here for the trees?</SkipTo>

      <motion.div {...rise(0.12)}><Facts rows={FACTS} /></motion.div>

      <motion.p {...rise(0.14)} className="mt-8">
        <a href="https://www.figma.com/proto/80dVRiAfseQp409VZtvZZ6/Kizuku?node-id=160-994&t=xcyzJ9w5g52hdI6V-1" target="_blank" rel="noopener noreferrer" className="prose-link">Figma prototype</a>
        {' · '}
        <Link href="/kizuku/process" className="prose-link">Full process, 4 stages</Link>
      </motion.p>

      <Rule />

      {/* ─── the loop ────────────────────────────────────────────────────── */}
      <motion.section {...rise(0.22)}>
        <Heading>One worry in, one action out.</Heading>
        <p className="mb-8">
          The whole app, in five screens — shot on an iPhone. The action in the middle is the one that
          worry really produced: “a message i still haven’t replied to” came back as <em>reach out</em>. The tab bar leaves
          after the garden and returns at the growth, so there is nothing to wander off to mid-ritual.
        </p>

        <Shots items={SCREENS} />
      </motion.section>

      <Rule />

      {/* ─── the interesting part, second ────────────────────────────────── */}
      <motion.section {...rise(0.18)}>
        <Heading>Every animation has a reason that fits in one sentence.</Heading>
        <p className="mb-3">
          If it could not be explained, it was removed. Three are playable below. Every number in them is
          the number the shipped React Native code uses, and the release logic is the same function.
        </p>
        <p className="text-faint mb-8" style={{ fontSize: '0.95rem' }}>
          Rebuilt for the browser with Motion — they want a pointer or a thumb.
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
        <div className="space-y-8">
          <p>
            Future anxiety is a pattern, not a disorder: rehearsing what could go wrong before anything has
            happened. Every wellness app I reviewed treats general stress or gamifies self-care. None
            addressed forward simulation on its own.
          </p>
          <CompetitorMap apps={APPS} us={['Kizuku', 76, 20]} />
        </div>
        <p className="mt-8">
          Three questions sort you into a type, and the type decides your tree, your copy, the surface it
          sits on — and which actions you are ever offered.
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
            <img src="/kizuku/app/reveal.jpg" alt="The seeker's type reveal" loading="lazy"
              className="w-full h-auto rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
              the seeker's reveal — the type owns the surface
            </figcaption>
          </figure>
        </div>

        <h3 id="trees" tabIndex={-1} data-skip-target className="mt-14 mb-2" style={{ color: 'var(--ink)' }}>Three trees, eighteen illustrations.</h3>
        <p className="mb-6">Each tree mirrors its type from the first stage — the personality is visible in the seed.</p>
        <div className="space-y-6">
          {GROWTH.map(([src, caption]) => (
            <Plate key={src} src={src} alt={`Six growth stages: ${caption}`} caption={caption} w={929} h={300} />
          ))}
        </div>
      </motion.section>

      <Rule />

      {/* ─── the system ──────────────────────────────────────────────────── */}
      <motion.section {...rise(0.24)}>
        <Heading>The system underneath.</Heading>
        <p className="mb-4">
          Three faces, each with one job: Newsreader for what the app says to you, Satoshi for what the
          interface says about itself, Caveat kept for the journal, because those words are the user’s.
          All lowercase — a register none of the apps I mapped use. Eighteen illustrations, so each tree’s
          personality is visible from the seed. Colour, type, spacing and motion are tokens the build
          consumes directly, not a picture of a design system.
        </p>

        <h3 className="mt-12 mb-2" style={{ color: 'var(--ink)' }}>The logo was found, not drawn.</h3>
        <p className="mb-6">A K, mirrored, and bamboo — resilient, fast-growing, it bends without breaking.</p>
        <Plate src="/kizuku/logo-formation.webp" alt="The Kizuku mark: a K mirrored and joined with bamboo, and the app icon in five colours" w={908} h={693} />

        <h3 className="mt-12 mb-2" style={{ color: 'var(--ink)' }}>Six colours, each with a reason.</h3>
        <p className="mb-6">The temperature was found in watercolour, not picked from a swatch.</p>
        <Palette colours={COLOURS} />
      </motion.section>

      <Rule />

      {/* ─── what only the device knew ───────────────────────────────────── */}
      <motion.section {...rise(0.25)}>
        <Heading>Five bugs a browser could not have found.</Heading>
        <p className="mb-8">
          Every check until then was a browser at 402&nbsp;&times;&nbsp;874, which is a picture of a phone
          rather than a phone. The first hour on real hardware found five faults — four in code I had
          already reviewed and believed.
        </p>

        <div className="track-wide">
          <Cards items={DEVICE} cols="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </motion.section>

      <Rule />

      {/* ─── the arguments ───────────────────────────────────────────────── */}
      <motion.section {...rise(0.26)}>
        <Heading>The app has to earn the third question.</Heading>
        <p className="text-faint mb-4" style={{ fontSize: '0.95rem' }}>Progressive disclosure, applied to onboarding</p>
        <p className="mb-6">
          The fear question used to arrive about forty seconds in, with the button disabled until you picked
          one of three intimate answers. Finch runs twelve screens of identity before its first emotional
          question. Now a screen of plain promises comes first — no account, nothing leaves your phone, no
          streaks, stop whenever — and the fear question can be declined.
        </p>
        <Onboarding {...ONBOARDING} />
      </motion.section>

      <motion.section {...rise(0.26)} className="mt-16">
        <Heading>Streaks were designed out.</Heading>
        <p>
          Streaks create performance anxiety in someone who already has it; a broken streak becomes one
          more thing to overthink. Missing a day does not shrink the tree.
        </p>
        <blockquote className="mt-6 pl-4" style={{ borderLeft: '2px solid #2C5228' }}>
          <p style={{ color: 'var(--ink)', fontSize: '1.15rem', lineHeight: 1.4 }}>
            The app is designed to be put down without consequence. That is a feature, not a bug.
          </p>
        </blockquote>
      </motion.section>

      <Rule />

      <motion.section {...rise(0.26)}>
        <Heading>Six more calls, and the reasoning.</Heading>
        <Decisions items={DECISIONS} />
      </motion.section>

      <motion.section {...rise(0.28)} className="mt-16">
        <p>
          The painting that became the brief, four rejected names, the competitive analysis and all
          eighteen illustrations are in the{' '}
          <Link href="/kizuku/process" className="prose-link">full process</Link>.
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/banyan" className="prose-link">Banyan Tree</Link> and{' '}
          <Link href="/case-study" className="prose-link">Hoychoy Cafe</Link>.
        </p>
      </motion.section>
    </main>
  )
}
