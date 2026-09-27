'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Decisions, Facts, Gallery, Heading, Overview, Rule, Shots, SkipTo, Subhead } from '../components/case-study'
import SignalHero from './hero'
import { Cards, Findings, JobStories, Personas, Ramp, Weights, Iterations, LoadCurve, Matrix, Morning, Numbers, ORANGE, Screens, Tested, Verdicts } from './visuals'

/*
 * Signal, rebuilt from the research case study. The words are Ayushman's; the
 * edits are for sourcing, not tone:
 *   - figures are attributed where they are claimed, and the sources are linked
 *     at the foot of the page (the 89% is scoped as WRI India scopes it)
 *   - "100%" of seven people is written as 7 of 7
 *   - the +34 min figure is labelled self-reported
 *   - a count that mixed the interview and test cohorts is dropped
 *   - safety is stated as scoped out, and limitations are named
 */

const PROTOTYPE = 'https://dainty-capybara-dd3d7e.netlify.app/'

// The whole project in four answers, readable before anything else.
const OVERVIEW = [
  ['Context', 'Daily commuters on the Delhi Metro’s Yellow Line who change trains at INA. A 14-week M.Des project, done alone.'],
  ['Problem', 'Regular riders know the route. What they can’t know is whether today is a normal day, so every one of them adds a buffer. Jasleen leaves 20 minutes early every morning.'],
  ['Why it matters', 'That buffer is paid every day, whether or not anything goes wrong. Participants reported losing 34 minutes a day on average, across four apps that never say when to leave.'],
  ['What I did', 'Interviews, peak-hour observation and five usability tests. Then a concept app that gives one answer, like “leave by 8:28”, and says how sure it is.'],
]

// Every outside figure on this page, scoped as its source scopes it. Anything
// without a link is my own fieldwork and says so.
// Jobs to be done, from the interviews — the wording is the document's.
// The persona cards, in the layout they were drawn in.
const PERSONAS = [
  {
    name: 'Jasleen Kaur, 29',
    role: 'the daily switcher',
    avatar: '/signal/personas/jasleen.webp',
    tint: '#E8A38C',
    meta: [
      ['work', 'Works in a corporate office (Gurugram)'],
      ['home', 'Lives in West Delhi'],
      ['study', 'Postgraduate'],
    ],
    quote: 'I leave 20 minutes early every day. Not because I want to — because I have no choice.',
    goals: ['Reach work on time, stress-free', 'Smoother, more predictable transfers', 'Real-time, reliable information'],
    pains: ['Tight transfer windows', 'Fragile timing — one delay breaks everything', 'Too many apps to plan one trip', 'No alternative when things go wrong'],
  },
  {
    name: 'Priya Mehta, 26',
    role: 'the late-night commuter, a composite rather than a participant',
    avatar: '/signal/personas/priya.webp',
    tint: '#8CAEDC',
    meta: [
      ['work', 'Works in a creative or tech firm (Noida)'],
      ['home', 'Lives in South Delhi'],
      ['study', 'Graduate'],
    ],
    quote: 'I avoid Kashmere Gate at night. Not because it is unsafe — because I do not know if it is.',
    goals: ['Feel safe commuting at night', 'Clear information about station safety', 'Confidence to explore new routes', 'Reliable last-mile options'],
    pains: ['Unfamiliar stations and areas', 'No clear safety information', 'Uncomfortable travelling alone late', 'Few routes she trusts'],
  },
]

const JOBS = [
  {
    id: '01', title: 'Morning departure',
    when: 'I’m standing at home deciding whether to leave now or wait ten minutes',
    want: 'one trustworthy signal about whether today’s 8:28 departure is safe',
    so: 'commit to leaving, without the buffer I’ve added for two years',
    response: 'S1 departure signal · 74% · “Likely on time”',
  },
  {
    id: '02', title: 'The INA transfer',
    when: 'I’m on the train approaching INA and don’t know if I’ll make the connection',
    want: 'a verdict on whether to walk fast or wait for the next service',
    so: 'decide calmly at the interchange instead of guessing from the platform',
    response: 'S4 transfer moment · four states · walk bar',
  },
  {
    id: '03', title: 'The night before',
    when: 'tomorrow might be disrupted — a match at Kotla, or a foggy week',
    want: 'an early signal the night before, so I can adjust the plan',
    so: 'not scramble at 7:30 when it’s too late to change the first mile',
    response: 'NB-01 · computed at 9pm · weather and calendar',
  },
]

// The model's own weights, sources and percentages as specified.
const WEIGHTS = [
  ['AFC crowd patterns', 40, '90-day rolling tap-in and tap-out density at Dwarka Sec-21 and INA for this time window and day of week. Historical, not real time.'],
  ['GTFS timetable baseline', 30, 'DMRC’s published schedule sets the departure and arrival windows; confidence starts at 100% and degrades with historical deviation.'],
  ['IMD weather signal', 15, 'Three disruption proxies: dense fog on the elevated sections, heavy rain at station approaches, and heat events that change dwell time.'],
  ['Calendar disruption signal', 15, 'Matches at Kotla, board exam dates, public holidays and nearby concerts — all open data, indexed 90 days ahead.'],
]

const RAMP = [
  ['Days 1–3', 'Generic corridor', 'No personal signal: the Yellow Line average for this time and day. The screen says “Getting more accurate”.'],
  ['Days 4–9', 'Pattern emerging', 'Departure times and dismissals are recorded, and the weights start shifting to your corridor. The sub-label goes after six journeys.'],
  ['Days 10–13', 'Near-personal', 'Two working weeks in. Reliable for typical days; disruptions still use the corridor average.'],
  ['Day 14+', 'Personal', 'The score reflects your route, your departure style and how you have responded to disruption. No sub-label.'],
]

// The synthesis workshop board, exported from FigJam.
const BOARDS = [
  ['/signal/proof/synthesis-board.jpg', 'the whole workshop: objectives, primary, secondary, synthesis'],
  ['/signal/proof/primary-findings.jpg', 'seven participants, and what each transcript gave up'],
  ['/signal/proof/cross-synthesis.jpg', 'five themes, the how-might-we statements, four recommendations'],
]


const FACTS = [
  ['Role', 'Solo — research, interaction design, prototype, film'],
  ['Timeline', '14 weeks · M.Des Design Project I'],
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
  ['2 peak-hour observations', 'Rajiv Chowk and HUDA City Centre: phone checks and stress at the interchange.'],
  ['DMRC ridership, FY 2024–25', 'Station-level entries and exits; office commuting is 52% of ridership.'],
  ['Five systems benchmarked', 'TfL, Tokyo Metro, Singapore SMRT, Berlin BVG and Delhi.'],
  ['12 journeys mapped', 'Decision points, stress triggers and failure modes, moment by moment.'],
  ['App timing study', 'Time-to-information across five apps. DMRC Sarthi scored lowest for habitual commuters.'],
]

const FINDINGS = [
  { stat: '4 apps', viz: ['pills', { items: ['Google Maps', 'DMRC', 'WhatsApp', 'the clock'] }], title: 'Four apps to plan one trip', body: 'Commuters with two or more transfers juggle all four to approximate one signal. None gives a departure verdict.' },
  { stat: 'INA', title: 'The transfer is a guess', body: 'Crowding, the corridor walk and the next train are unknown until you are standing there. “I start checking my phone as soon as we leave Rajiv Chowk.”' },
  { stat: '7 of 7', viz: ['dots', { k: 7, n: 7 }], title: 'Everyone leaves early, every day', body: 'Every participant adds a buffer every day. They reported losing an average of 34 minutes a day to missing information.' },
  { stat: '4 of 7', viz: ['dots', { k: 4, n: 7 }], title: 'Women pick routes for safety first', body: 'Four participants, all women, choose routes by lighting, crowding and CISF presence. Not built here; it sits in the future scope.' },
  { stat: '89%', viz: ['bar', { pct: 89 }], title: 'The last mile is a share auto', body: <>Of Delhi riders in <a href="https://wri-india.org/sites/default/files/Improving%20metro%20access%20in%20India_%20Working%20Paper.pdf" target="_blank" rel="noopener noreferrer" className="prose-link">WRI India’s 2023 survey</a> chose a share auto over the bus on last-mile trips where both ran — waiting, not price.</> },
  { stat: '0', title: 'Live metro data to build on', body: <><a href="https://otd.delhi.gov.in/" target="_blank" rel="noopener noreferrer" className="prose-link">Delhi publishes</a> metro timetables and live bus positions, but nothing live from the trains: no positions, no crowding. That constraint shaped the product.</> },
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
  ['Lead with an answer, not data', 'Participants shown a percentage alone asked what it meant for them. Signal leads with an action; the numbers support it.'],
  ['Lock screen first', 'On a crowded Yellow Line train the phone stays in the pocket. The happy path opens the app exactly twice per commute.'],
  ['Set up the ride, never book it', 'Signal sets up Rapido; the commuter confirms it. Every consequential action keeps a human tap.'],
  ['Only speak when something changes', 'Orange appears only at decision moments. 90% of every screen is ink and paper. Silence when nothing has changed is what makes a signal worth heeding.'],
  ['Show how sure it is', '74% is always paired with “Likely on time”. The pattern model is directionally accurate, not statistically precise, and the design never claims more.'],
  ['Dismissing teaches the model', '“WFH today” and “I have a ride” both feed the model. “It doesn’t make me feel bad for dismissing it. It just wants to learn.” — Kavya (P5)'],
]

const ITERATIONS = [
  ['⌂ Signal · ◷ History · ○ Profile', '◎ Signal · ⟳ Trips · ⊙ You'],
  ['Rapido pre-filled before you open it', 'Rapido cab already set up — just confirm'],
  ['Walk ratio', 'Time left to walk'],
  ['Confirm booking', 'Book Rapido now'],
  ['When must you arrive?', 'When do you need to be at work?'],
]

const LIMITS = [
  ['I am not this user', 'I don’t commute this corridor, or any corridor. I have taken the Delhi Metro twice. Everything I know about the morning came from seven people and two mornings of watching, so where the research was thin I had no lived experience to fall back on.'],
  ['A narrow, convenient sample', 'Interviewees and testers came from personal networks and corridor WhatsApp groups. The five testers were all aged 24–31 and live on the Dwarka corridor, and one is a UX student. The findings describe this group, not Delhi’s 6.5 million daily riders.'],
  ['Small numbers', 'Seven interviews and five usability sessions are enough to find problems and direction, not to measure prevalence. Figures from the sample are written as counts for that reason.'],
  ['An unvalidated model', 'Confidence comes from static GTFS schedules, weather, the calendar and patterns. None of it is live, and none of it has been checked against real outcomes.'],
  ['Safety is not addressed', 'The finding with the sharpest unmet need was scoped out. Priya’s need goes unmet in this version: safety-first routing on lighting, crowding and CISF presence.'],
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
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}><Back /></motion.div>

      <motion.header {...rise(0.06)} className="mt-10 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Signal · 2026 · Research and concept</p>
        <h1 className="display">Signal: an app that tells Delhi Metro commuters when to leave</h1>
      </motion.header>
      <motion.div {...rise(0.08)}><Overview items={OVERVIEW} /></motion.div>

      <div data-case-hero className="track-full mt-12 overflow-hidden rounded-xl">
        <SignalHero className="rounded-xl" />
      </div>
      <SkipTo target="screens">skip to the screens</SkipTo>

      <motion.div {...rise(0.12)} className="mt-10">
        <Numbers items={[['7', 'commuter interviews'], ['2', 'peak-hour observations'], ['5', 'usability sessions'], ['14', 'weeks, solo']]} />
      </motion.div>
      <motion.div {...rise(0.14)}><Facts rows={FACTS} /></motion.div>
      <motion.p {...rise(0.16)} className="mt-8">
        <a href={PROTOTYPE} target="_blank" rel="noopener noreferrer" className="prose-link">Try the prototype</a>
        <span className="text-faint"> · 22 screens: lock screen, app and watch</span>
      </motion.p>

      <Rule />

      <section>
        <Heading n="01">The problem</Heading>
        <p className="mb-8">
          One real morning, from the interviews. Jasleen has taken this route for two years. At each of
          these four points she has to make a decision, and nothing tells her what to do.
        </p>
        <Morning items={MORNING} />

        <div className="mt-14">
          <LoadCurve />
        </div>
        <p className="mt-6">
          Stress peaks at three points: leaving home, the INA transfer and the exit. None of them is an
          infrastructure problem. Each one is missing information.
        </p>

        <Subhead>The same morning, storyboarded before any screens</Subhead>
        <Shots items={STORYBOARD} cols="grid-cols-2 lg:grid-cols-4" />
      </section>

      <Rule />

      <section>
        <Heading n="02">How I researched it</Heading>
        <p className="mb-8">
          I started with first-time riders, because on my own first Metro ride I took the wrong direction
          to the airport. The interviews changed that. Daily riders know the route; they don’t know if
          today is normal. So the project moved to them.
        </p>
        <div className="track-wide">
          <Cards items={METHODS} cols="sm:grid-cols-2 lg:grid-cols-3" />
        </div>

        <Subhead>Synthesis board</Subhead>
        <p className="mb-8">Participants, what each interview gave up, the secondary research, and the themes that came out of both.</p>
        <Gallery items={BOARDS} />
        <p className="track-wide mt-4" style={{ fontSize: '0.95rem' }}>
          <a href="https://www.figma.com/board/WI0U6Rar6OSNFbAioAZmmo/Mobility-Research-Synthesis" target="_blank" rel="noopener noreferrer" className="prose-link">Open the board in FigJam ↗</a>
        </p>
      </section>

      <Rule />

      <section>
        <Heading n="03">What I found</Heading>
        <Findings items={FINDINGS} />

        <Subhead>What existing apps do</Subhead>
        <p className="mb-8">
          None of them tells you when to leave before you set off. Citymapper comes closest, in London,
          because TfL publishes live data. Delhi publishes metro timetables but not live metro positions.
        </p>
        <Matrix {...COMPETITORS} />

        <Subhead>Who I designed for</Subhead>
        <Personas items={PERSONAS} />
        <p className="mt-6">
          Safety had the sharpest unmet need in the interviews, and I didn’t build for it. It would need
          lighting, crowding and CISF data that isn’t published, so it sits in the future scope.
        </p>
      </section>

      <Rule />

      <section>
        <Heading n="04">What commuters need</Heading>
        <p className="mb-8">The interviews, written as job stories. Each screen answers one of these situations.</p>
        <JobStories items={JOBS} />
      </section>

      <Rule />

      <section id="screens" tabIndex={-1} data-skip-target>
        <Heading n="05">The solution</Heading>
        <p className="mb-8">
          A companion, not a navigation app. It speaks at decision moments, shows its reasoning, and
          leaves every booking to the commuter. The orange appears only when there is a decision to make.
        </p>
        <Screens items={SCREENS} />

        <Subhead>The transfer answer at INA, in four states</Subhead>
        <Verdicts items={STATES} />

        <Subhead>How the 74% is calculated</Subhead>
        <p className="mb-8">
          There is no live metro feed, so the score weighs four sources, and the app says what it is made
          of. The model is specified, not running: the crowd data it needs isn’t public yet.
        </p>
        <Weights
          items={WEIGHTS}
          note="Crowdsourced reports can only lower confidence, never raise it above the timetable baseline."
        />
        <p className="mt-10 mb-4 text-faint" style={{ fontSize: '0.95rem' }}>What the score knows about you, and when</p>
        <Ramp steps={RAMP} />

        <Subhead>The concept film</Subhead>
        <p className="mb-8">85 seconds, from the night before to arrival. Built in React with Remotion. Sound on.</p>
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
        <Heading n="06">Design principles</Heading>
        <Cards items={PRINCIPLES} />
      </section>

      <Rule />

      <section>
        <Heading n="07">Testing, and what changed</Heading>
        <p className="mb-8">Five think-aloud sessions with daily commuters on the Dwarka–Gurgaon corridor.</p>
        <Tested items={TESTED} />
        <p className="mt-10">
          One question, “What does pre-fill mean exactly?”, showed that my internal words had leaked into
          the interface in five places.
        </p>
        <p className="mt-8 mb-3 text-faint" style={{ fontSize: '0.95rem' }}>Before and after the sessions</p>
        <Iterations items={ITERATIONS} />

        <Subhead>What I rejected</Subhead>
        <Decisions items={REJECTED} />
      </section>

      <Rule />

      <section>
        <Heading n="08">Limits of this research</Heading>
        <Decisions items={LIMITS} />
        <p className="text-faint mt-6" style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>
          Participants agreed to be quoted and are named by first name. Interview notes are available on
          request.
        </p>
      </section>

      <section className="mt-16">
        <Heading n="09">What I learned</Heading>
        <p>
          The constraints shaped the design. With no live data, the app had to work from patterns, and a
          74% that admits it could be wrong is more honest than a made-up “train in 3 minutes”. Staying
          quiet is part of it too: Signal says one thing in the morning and nothing more until something
          changes. And a visiting designer’s critique moved it from something that broadcasts to
          something that shows its reasoning and learns when you dismiss it.
        </p>
      </section>

      <section className="mt-16">
        <p>
          <a href={PROTOTYPE} target="_blank" rel="noopener noreferrer" className="prose-link">Try the prototype</a>.
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link>.
        </p>
      </section>
    </main>
  )
}
