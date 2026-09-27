'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import KizukuInteractions from '../components/kizuku-interactions'
import { Back, Cards, Decisions, Facts, Heading, Overview, Rule, Shots, SkipTo, Subhead } from '../components/case-study'
import KizukuHero from './hero'
import LiveApp from './live-app'
import { CompetitorMap, Onboarding, Palette, Plate } from './diagrams'

// The whole project in four answers, readable before anything else.
const OVERVIEW = [
  ['Context', 'Future anxiety: rehearsing what could go wrong before anything has happened. It’s my own habit. I run every decision forward, and the running doesn’t stop once I’ve decided.'],
  ['Problem', 'The wellness apps I reviewed treat general stress or gamify self-care. None deals with this loop, and a broken streak gives an anxious person one more thing to worry about.'],
  ['Why it matters', 'Thinking more doesn’t end the loop. Kizuku bets that one small, concrete action today helps more than another round of reflection.'],
  ['What I did', 'Research, brand, a design system and the iOS build in React Native. You give it one worry, it gives you one thing to do today, and your tree grows when you do it. Reviewed with professors, not yet tested with users.'],
]

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

      <motion.header {...rise(0.06)} className="mt-10 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Kizuku · 2026 · Research, brand and iOS build</p>
        <h1 className="display">Kizuku: an iOS app for people who overthink the future</h1>
      </motion.header>
      <motion.div {...rise(0.08)}><Overview items={OVERVIEW} /></motion.div>

      {/* Not faded in: the card on the index grows into this. */}
      <div data-case-hero className="track-full mt-12 overflow-hidden rounded-xl">
        <KizukuHero className="rounded-xl" />
      </div>
      <SkipTo target="trees">skip to the illustrations</SkipTo>

      <motion.div {...rise(0.12)}><Facts rows={FACTS} /></motion.div>
      <motion.p {...rise(0.14)} className="mt-8">
        <a href="https://www.figma.com/proto/80dVRiAfseQp409VZtvZZ6/Kizuku?node-id=160-994&t=xcyzJ9w5g52hdI6V-1" target="_blank" rel="noopener noreferrer" className="prose-link">Figma prototype</a>
        {' · '}
        <Link href="/kizuku/process" className="prose-link">Full process, 4 stages</Link>
      </motion.p>

      <Rule />

      <motion.section {...rise(0.16)}>
        <Heading n="01">The problem</Heading>
        <p className="mb-8">
          The wellness apps I reviewed treat general stress or gamify self-care. Here are five of them,
          placed by tone (warm or clinical) and by what they ask of you (passive or active). None sits in
          the warm, active corner, and none is built for rehearsing the future.
        </p>
        <CompetitorMap apps={APPS} us={['Kizuku', 76, 20]} />
      </motion.section>

      <Rule />

      <motion.section {...rise(0.18)}>
        <Heading n="02">Who it’s for</Heading>
        <p className="mb-8">
          People overthink the future in different ways. Three questions sort you into one of three
          types, and your type decides your tree, the app’s wording and which actions you’re offered.
        </p>
        <div className="track-wide grid items-start gap-8 sm:grid-cols-[1fr_200px] lg:grid-cols-[1fr_300px] lg:gap-14">
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
              className="h-auto w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
              The seeker’s result screen.
            </figcaption>
          </figure>
        </div>
      </motion.section>

      <Rule />

      <motion.section {...rise(0.2)}>
        <Heading n="03">How it works</Heading>
        <p className="mb-8">
          One worry in, one action out, in five screens shot on an iPhone. “A message i still haven’t
          replied to” came back as <em>reach out</em>. The tab bar hides during the ritual so there is
          nothing to wander off to.
        </p>
        <Shots items={SCREENS} />

        <Subhead>Try the real app</Subhead>
        <LiveApp />
      </motion.section>

      <Rule />

      <motion.section {...rise(0.22)}>
        <Heading n="04">Onboarding</Heading>
        <p className="mb-6">
          The fear question used to come about forty seconds in, and you couldn’t continue without
          answering it. Now a screen of plain promises comes first (no account, nothing leaves your
          phone, no streaks, stop whenever) and the fear question can be skipped.
        </p>
        <Onboarding {...ONBOARDING} />
      </motion.section>

      <Rule />

      <motion.section {...rise(0.22)}>
        <Heading n="05">Animations</Heading>
        <p className="mb-3">
          Each animation had to have a reason I could say in one sentence, or it was removed. Three are
          playable here, using the same numbers and release logic as the app.
        </p>
        <p className="text-faint mb-8" style={{ fontSize: '0.95rem' }}>
          Rebuilt for the browser with Motion. They need a pointer or a thumb.
        </p>
        <KizukuInteractions />
        <div className="mt-8 flex justify-center">
          <div className="kz-grow-sprite" role="img" aria-label="The optimiser's seed opening into its plant" />
        </div>
        <p className="text-faint mt-2 text-center" style={{ fontSize: '0.9rem' }}>
          The optimiser’s growth: a 111 KB sprite made from a 3.9 MB clip.
        </p>
      </motion.section>

      <Rule />

      <motion.section {...rise(0.24)}>
        <Heading n="06">Visual system</Heading>
        <p>
          Three typefaces, each with one job: Newsreader for what the app says to you, Satoshi for the
          interface, Caveat for the journal, because those words are yours. Everything is lowercase.
          Colour, type, spacing and motion are tokens the build uses directly.
        </p>

        <Subhead id="trees">Illustrations: three trees, six stages each</Subhead>
        <p className="mb-6">Each tree reflects its type from the very first stage.</p>
        <div className="space-y-6">
          {GROWTH.map(([src, caption]) => (
            <Plate key={src} src={src} alt={`Six growth stages: ${caption}`} caption={caption} w={929} h={300} />
          ))}
        </div>

        <Subhead>Logo</Subhead>
        <p className="mb-6">A K, mirrored, with bamboo: it bends without breaking.</p>
        <Plate src="/kizuku/logo-formation.webp" alt="The Kizuku mark: a K mirrored and joined with bamboo, and the app icon in five colours" w={908} h={693} />

        <Subhead>Colour</Subhead>
        <p className="mb-6">Six colours, each with a reason, first found in watercolour.</p>
        <Palette colours={COLOURS} />
      </motion.section>

      <Rule />

      <motion.section {...rise(0.25)}>
        <Heading n="07">Testing on a real phone</Heading>
        <p className="mb-8">
          Until then I had only checked it in a browser at iPhone size. The first hour on a real phone
          found five bugs, four of them in code I had already reviewed.
        </p>
        <div className="track-wide">
          <Cards items={DEVICE} cols="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </motion.section>

      <Rule />

      <motion.section {...rise(0.26)}>
        <Heading n="08">Decisions</Heading>
        <Subhead>No streaks</Subhead>
        <p className="mb-10">
          A streak creates performance pressure in someone who already has it, and a broken one becomes
          one more thing to overthink. Missing a day doesn’t shrink the tree.
        </p>
        <Decisions items={DECISIONS} />
      </motion.section>

      <motion.section {...rise(0.28)} className="mt-16">
        <p>
          The painting that started it, four rejected names, the competitive analysis and all eighteen
          illustrations are in the <Link href="/kizuku/process" className="prose-link">full process</Link>.
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/banyan" className="prose-link">Banyan Tree</Link> and{' '}
          <Link href="/case-study" className="prose-link">Hoychoy Cafe</Link>.
        </p>
      </motion.section>
    </main>
  )
}
