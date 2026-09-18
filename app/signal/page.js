'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Decisions, Facts, Heading, Rule, Shots } from '../components/case-study'
import { Cards, Findings, Iterations, LoadCurve, Matrix, Morning, Numbers, ORANGE, Screens, Tested, Verdicts } from './visuals'

/*
 * Signal, rebuilt from the research case study. The words are Ayushman's; the
 * edits are for sourcing, not tone:
 *   - figures are attributed where they are claimed (89% is WRI India 2023)
 *   - "100%" of seven people is written as 7 of 7
 *   - the +34 min figure is labelled self-reported
 *   - a count that mixed the interview and test cohorts is dropped
 *   - safety is stated as scoped out, and limitations are named
 */

const PROTOTYPE = 'https://dainty-capybara-dd3d7e.netlify.app/'

const FACTS = [
  ['Role', 'Solo — research, interaction design, prototype, film'],
  ['Timeline', '14 weeks · M.Des Design Project I'],
  ['Research', '7 interviews · 2 observations · 5 usability tests'],
  ['Status', 'Concept with a working prototype — not shipped'],
]

const STORYBOARD = [
  ['/signal/story-1.png', 'what time should I leave? she doesn’t know.'],
  ['/signal/story-2.png', '38 minutes, spent standing. not by choice.'],
  ['/signal/story-3.png', 'three moments, three decisions, zero information'],
  ['/signal/story-4.png', 'one signal, before the journey begins'],
]

const MORNING = [
  ['7:45', 'Home', 'What time should I leave?', 'adds a 20-minute buffer'],
  ['8:52', 'Rajiv Chowk', 'Board now or wait?', 'board says 6 min — actual 14'],
  ['9:18', 'INA interchange', 'Will I make the connection?', 'runs the 4-minute walk, misses it'],
  ['9:55', 'HUDA City Centre', 'Why is every auto on surge?', 'mass exit surge from the delay'],
]

const METHODS = [
  ['7 semi-structured interviews', 'Dwarka, Noida and Gurgaon commuters. 45–60 minutes, think-aloud.'],
  ['2 peak-hour observations', 'Rajiv Chowk and HUDA City Centre — phone checks and stress at the interchange.'],
  ['DMRC ridership, FY 2024–25', 'Station-level entries and exits; office commuting is 52% of ridership.'],
  ['Five systems benchmarked', 'TfL, Tokyo Metro, Singapore SMRT, Berlin BVG and Delhi.'],
  ['12 journeys mapped', 'Decision points, stress triggers and failure modes, moment by moment.'],
  ['App timing study', 'Time-to-information across five apps. DMRC Sarthi scored lowest for habitual commuters.'],
]

const FINDINGS = [
  { stat: '4 apps', viz: ['pills', { items: ['Google Maps', 'DMRC', 'WhatsApp', 'the clock'] }], title: 'Four apps, no intelligence', body: 'Commuters with two or more transfers juggle all four to approximate one signal. None gives a departure verdict.' },
  { stat: 'INA', title: 'The blind transfer', body: 'Crowding, the corridor walk and the next train are unknown until you are standing there. “I start checking my phone as soon as we leave Rajiv Chowk.”' },
  { stat: '7 of 7', viz: ['dots', { k: 7, n: 7 }], title: 'The buffer is anxiety management', body: 'Every participant adds a buffer every day. They reported losing an average of 34 minutes a day to missing information.' },
  { stat: '4 of 7', viz: ['dots', { k: 4, n: 7 }], title: 'Safety routes before speed', body: 'Four participants, all women, choose routes by lighting, crowding and CISF presence. Scoped out of this version.' },
  { stat: '89%', viz: ['bar', { pct: 89 }], title: 'Support ends at the exit gate', body: 'Of riders prefer paid autos over free buses — for predictability, not cost (WRI India 2023, n=7,200).' },
  { stat: '0', title: 'Live feeds DMRC publishes', body: 'Every tap-in and tap-out is recorded; no GTFS-RT, no crowding signal is shared. That constraint shaped the product.' },
]

const COMPETITORS = {
  columns: ['Departure intelligence', 'Transfer viability', 'First-mile pre-fill', 'Proactive alerts', 'Corridor-specific'],
  rows: [
    ['Google Maps', [[1, 'Reactive only'], [0, 'None'], [0, 'None'], [0, 'None'], [0, 'Generic']]],
    ['DMRC Sarthi', [[1, 'Timetable lookup'], [0, 'None'], [0, 'None'], [0, 'None'], [0, 'Generic']]],
    ['Moovit', [[1, 'Reactive, per journey'], [0, 'None'], [0, 'None'], [1, 'Generic delays'], [0, 'Generic']]],
    ['Citymapper (London)', [[2, 'Proactive departure'], [1, 'Limited'], [0, 'None'], [1, 'Disruption alerts'], [1, 'Route-level']]],
    ['WhatsApp groups', [[1, 'Crowdsourced, delayed'], [1, 'Anecdotal'], [0, 'None'], [1, 'Manual posts'], [2, 'Very corridor-specific']]],
    ['Signal (concept)', [[2, 'Verdict before leaving'], [2, 'INA verdict before boarding'], [2, 'Rapido pre-filled'], [2, 'Night before + morning'], [2, 'Yellow Line only']], true],
  ],
}

// Only screens that fit whole on one phone. The live-journey screens scroll
// past the tab bar and the departure screen's Dismiss runs off its edge, so a
// still of either shows a cut-off button rather than the design.
const SCREENS = [
  ['/signal/screens/confidence.webp', 'Onboarding opens on the number the product lives by.'],
  ['/signal/screens/pattern.webp', 'Pattern intelligence, not live tracking — 90 days of corridor data.'],
  ['/signal/screens/lockscreen.webp', 'Glanceable on the lock screen: leave by 8:28, with Rapido one tap away.'],
  ['/signal/screens/arrival-time.webp', 'Setup works backwards from when you need to be at your desk.'],
  ['/signal/screens/first-mile.webp', 'How you reach the metro, with walking as the fallback.'],
  ['/signal/screens/ready.webp', 'Your signal is ready — and honest that confidence starts low.'],
]

const STATES = [
  ['Viable', 'You’ll make it.', '4 min walk · 7 min available', '#1F8A5B'],
  ['Tight', 'Move briskly.', '6 min walk · 7 min available', '#D08A00'],
  ['Risky', 'Next service.', 'window overrun · next at 9:04', ORANGE],
  ['Missed', 'Rebook.', 'a clean fallback, no alarm', 'var(--faint)'],
]

const TESTED = [
  ['Completed onboarding', 4, 5, 80],
  ['Read the “Viable” verdict correctly, in under 3 seconds', 4, 5],
]

const REJECTED = [
  ['A house icon for the Signal tab', 'Anshuman (P2) tapped it three times expecting home settings: “I thought the house meant home, not the main screen.” Replaced with ◎, a signal mark.'],
  ['“Walk ratio” as the S4 bar label', '“What ratio? Time vs distance?” The label has to describe what the bar shows, not how it is calculated — it became “Time left to walk.”'],
  ['“Confirm booking” as the S2 action', '“So this is booking it? Or confirming?” It implied the booking had already happened. Now “Book Rapido now” — honest about what the tap does.'],
  ['An AI agent that books Rapido for you', 'Surge pricing, edge cases and trust made its failure modes worse than the four seconds it saves. Signal pre-fills; the commuter confirms inside Rapido.'],
  ['Fraunces serif for the verdict', 'Emotional weight, but slower to read. The verdict has to land in two seconds under INA pressure, and Inter Bold reads faster.'],
  ['A warm parchment surface', 'Read as muddy in Delhi sunlight. Simplified to #F9F9F8 paper.'],
]

const PRINCIPLES = [
  ['Verdict, not data', 'Participants shown a percentage alone asked what it meant for them. Signal leads with an action; the numbers support it.'],
  ['Lock screen first', 'On a crowded Yellow Line train the phone stays in the pocket. The happy path opens the app exactly twice per commute.'],
  ['Pre-fill, never auto-book', 'Signal sets up Rapido; the commuter confirms it. Every consequential action keeps a human tap.'],
  ['Speak first, once', 'Orange appears only at decision moments — 90% of every screen is ink and paper. Silence when nothing has changed is what makes a signal worth heeding.'],
  ['Honest confidence', '74% is always paired with “Likely on time”. The pattern model is directionally accurate, not statistically precise, and the design never claims more.'],
  ['Dismiss is a signal', '“WFH today” and “I have a ride” both feed the model. “It doesn’t make me feel bad for dismissing it. It just wants to learn.” — Kavya (P5)'],
]

const ITERATIONS = [
  ['⌂ Signal · ◷ History · ○ Profile', '◎ Signal · ⟳ Trips · ⊙ You'],
  ['Rapido pre-filled before you open it', 'Rapido cab already set up — just confirm'],
  ['Walk ratio', 'Time left to walk'],
  ['Confirm booking', 'Book Rapido now'],
  ['When must you arrive?', 'When do you need to be at work?'],
]

const LIMITS = [
  ['A narrow, convenient sample', 'Interviewees and testers came from personal networks and corridor WhatsApp groups. The five testers were all aged 24–31 and live on the Dwarka corridor, and one is a UX student. The findings describe this group, not Delhi’s 6.5 million daily riders.'],
  ['Small numbers', 'Seven interviews and five usability sessions are enough to find problems and direction, not to measure prevalence. Figures from the sample are written as counts for that reason.'],
  ['An unvalidated model', 'Confidence comes from static GTFS schedules, weather, the calendar and patterns — not live data, and not yet checked against real outcomes.'],
  ['Safety is not addressed', 'The finding with the sharpest unmet need was scoped out. Priya’s need — safety-first routing on lighting, crowding and CISF presence — goes unmet in this version.'],
  ['One corridor', 'Yellow Line only, built around the INA interchange.'],
]

export default function Signal() {
  const reduceMotion = useReducedMotion()
  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-40 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}><Back /></motion.div>

      <motion.header {...rise(0.06)} className="mt-10 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Signal · 2026 · Research</p>
        <h1 style={{ color: 'var(--ink)', fontSize: '2rem', lineHeight: 1.2, fontWeight: 500, letterSpacing: '-0.02em' }}>
          A familiar commute should not start with doubt.
        </h1>
        <p>
          A Delhi Metro companion for the Yellow Line corridor. One screen replaces four apps, and one
          verdict tells you when to leave — before you need to.
        </p>
      </motion.header>

      {/* The product first. A research case study still has to show what the
          research turned into before it asks anyone to read the method. */}
      <motion.figure {...rise(0.1)} className="track-full mt-12">
        <img
          src="/research/signal.jpg"
          alt="Three Signal screens: 74% likely on time, the first signal set for 8:28, and the lock-screen departure card"
          width={1600}
          height={900}
          className="block h-auto w-full rounded-xl"
        />
      </motion.figure>

      <motion.div {...rise(0.12)} className="mt-10">
        <Numbers items={[['7', 'commuter interviews'], ['2', 'peak-hour observations'], ['5', 'usability sessions'], ['14', 'weeks, solo']]} />
      </motion.div>
      <motion.div {...rise(0.14)}><Facts rows={FACTS} /></motion.div>
      <motion.p {...rise(0.16)} className="mt-8">
        <a href={PROTOTYPE} target="_blank" rel="noopener noreferrer" className="prose-link">Try the prototype</a>
        <span className="text-faint"> · 22 screens, 9 phases, lock screen, app and watch</span>
      </motion.p>

      <Rule />

      <section>
        <Heading>One morning. Three decisions. No information.</Heading>
        <p className="mb-8">
          Before designing a screen I storyboarded the moments where the system fails a habitual
          commuter every day.
        </p>
        <Shots items={STORYBOARD} cols="grid-cols-2 lg:grid-cols-4" />

        <p className="mt-14 mb-4 text-faint" style={{ fontSize: '0.95rem' }}>
          Jasleen’s commute, Dwarka Sec-21 to HUDA City Centre — a real participant
        </p>
        <Morning items={MORNING} />

        <div className="mt-14">
          <LoadCurve />
        </div>
        <p className="mt-6">
          Load spikes at three moments — leaving, the INA transfer, and the exit. None of them is an
          infrastructure problem; each is an information problem.
        </p>
        <p className="mt-3 text-faint" style={{ fontSize: '0.85rem' }}>
          The route is simplified for the concept: one corridor, one interchange.
        </p>
      </section>

      <Rule />

      <section>
        <Heading>Three methods, one corridor, real commuters.</Heading>
        <div className="track-wide">
          <Cards items={METHODS} cols="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </section>

      <section className="mt-16">
        <Heading>Six findings.</Heading>
        <Findings items={FINDINGS} />
      </section>

      <section className="mt-16">
        <Heading>Nobody judges the transfer before you board.</Heading>
        <p className="mb-8">
          Five systems benchmarked. Citymapper comes closest, with proactive departures in London —
          on TfL’s open API. Delhi collects the same data and publishes none of it.
        </p>
        <Matrix {...COMPETITORS} />
        <p className="mt-8">
          So Signal is not a navigation app and not a booking agent. It is a companion: pattern
          intelligence that speaks first, shows its reasoning, and leaves every consequential decision to
          the commuter.
        </p>
      </section>

      <section className="mt-16">
        <Heading>Two people the research kept returning to.</Heading>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl p-5" style={{ border: '1px solid var(--rule)' }}>
            <p style={{ color: 'var(--ink)' }}>Jasleen Kaur, 29</p>
            <p className="text-faint" style={{ fontSize: '0.9rem' }}>the daily switcher</p>
            <p className="mt-3" style={{ fontSize: '0.95rem' }}>
              Two transfers, a hard 9:30 standup, four apps, and twenty minutes early every day.
            </p>
            <p className="mt-3" style={{ color: 'var(--ink)', fontSize: '0.95rem' }}>
              “I leave 20 minutes early every day. Not because I want to — because I have no choice.”
            </p>
          </div>
          <div className="rounded-xl p-5" style={{ border: '1px solid var(--rule)' }}>
            <p style={{ color: 'var(--ink)' }}>Priya Mehta, 26</p>
            <p className="text-faint" style={{ fontSize: '0.9rem' }}>the late-night commuter</p>
            <p className="mt-3" style={{ fontSize: '0.95rem' }}>
              Often alone after 9pm. Routes by perceived safety and avoids stations she knows nothing about.
            </p>
            <p className="mt-3" style={{ color: 'var(--ink)', fontSize: '0.95rem' }}>
              “I avoid Kashmere Gate at night. Not because it is unsafe — because I do not know if it is.”
            </p>
          </div>
        </div>
        <p className="mt-6">
          <span style={{ color: 'var(--ink)' }}>What this version leaves out.</span> Safety was the
          finding with the sharpest unmet need, and it is scoped out. The signals it would rest on —
          lighting, crowding by hour, CISF presence — are exactly the data Delhi does not publish
          (finding 06). This version does not pretend to address it.
        </p>
      </section>

      <Rule />

      <section>
        <Heading>The prototype.</Heading>
        <p className="mb-8">
          22 screens across 9 phases and 3 surfaces — lock screen, app and watch — from a warning the
          night before to arrival. Signal orange appears only at decision moments; the rest is ink and
          paper.
        </p>
        <Screens items={SCREENS} />

        <p className="mt-14 mb-4 text-faint" style={{ fontSize: '0.95rem' }}>
          The transfer verdict, in four states — designed for the INA interchange
        </p>
        <Verdicts items={STATES} />
      </section>

      <section className="mt-16">
        <Heading>The morning, as a film.</Heading>
        <p className="mb-8">
          Eighty-five seconds from the night before to arrival, written in React and rendered with
          Remotion. Sound on.
        </p>
        <figure className="track-full">
          <video
            src="/signal/signal.mp4"
            poster="/signal/poster.jpg"
            controls
            playsInline
            preload="metadata"
            className="block w-full rounded-xl"
            style={{ border: '1px solid var(--rule)', aspectRatio: '16 / 9', background: '#0f0f0f' }}
          />
        </figure>
      </section>

      <Rule />

      <section>
        <Heading>Six principles, each earned from research.</Heading>
        <Cards items={PRINCIPLES} />
      </section>

      <section className="mt-16">
        <Heading>What I rejected, and why.</Heading>
        <Decisions items={REJECTED} />
      </section>

      <Rule />

      <section>
        <Heading>Five participants. Every finding actioned.</Heading>
        <p className="mb-8">
          Moderated think-aloud sessions with habitual commuters on the Dwarka–Gurgaon corridor.
        </p>
        <Tested items={TESTED} />
        <p className="mt-10">
          The most useful session was one participant. Anshuman’s “What does pre-fill mean exactly?”
          turned up in five places: internal terms had leaked into the interface.
        </p>
        <p className="mt-8 mb-3 text-faint" style={{ fontSize: '0.95rem' }}>One session, five fixes</p>
        <Iterations items={ITERATIONS} />
      </section>

      <Rule />

      <section>
        <Heading>What this research can and can’t claim.</Heading>
        <Decisions items={LIMITS} />
      </section>

      <section className="mt-14">
        <Heading>What the process taught me.</Heading>
        <p>
          Constraints are the design argument. No live DMRC data forced pattern intelligence, and a 74%
          that admits its uncertainty is more honest than an unverified “train in 3 minutes”. Silence is a
          design decision: Signal says one thing in the morning and nothing more until it has something to
          say. And good critique changed the product — a visiting designer’s feedback moved it from a
          broadcaster to a companion that shows its reasoning and learns from being dismissed.
        </p>
      </section>

      <section className="mt-14">
        <p>
          <a href={PROTOTYPE} target="_blank" rel="noopener noreferrer" className="prose-link">Try the prototype</a>.
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link>, the other research case study.
        </p>
      </section>
    </main>
  )
}
