'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Decisions, Facts, Heading, Impact, Overview, Rule, SkipTo, Subhead, Tradeoffs } from '../components/case-study'
import SignalHero from './hero'
import { PlatformScreen } from './phones'
import { DmrcFlow, DmrcToday } from './dmrc'
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
  ['Who it’s for', 'Office commuters on the Delhi Metro who change lines on the way and finish the trip by auto or cab.'],
  ['The problem', 'Trains run on time, but the trip doesn’t. All seven people I interviewed leave early every day, just in case. What they can’t predict is getting on at the interchange and getting away from the exit.'],
  ['What I did', 'Seven interviews, two peak-hour observations, five usability tests and a prototype. Then I checked the idea against DMRC’s own figures and Google Maps, refocused it, and made it a feature of DMRC’s own app.'],
  ['Project', 'A 14-week M.Des project, done alone. A concept, not a shipped app.'],
]

// Usability results with five commuters. A concept, not a shipped product.
const IMPACT = [
  ['4 of 5', 'read the “leave by” answer correctly in under 3 seconds'],
  ['4 of 5', 'completed onboarding'],
  ['5', 'wording fixes from one test session'],
]

// What I was up against, what I chose, and what that gave up.
const TRADEOFFS = [
  ['Nobody downloads a new app for a daily annoyance, and crowdsourcing alone starts empty', 'A feature inside DMRC’s own app, on data DMRC already collects', 'It only happens if DMRC builds it. As a student I can propose it, not ship it'],
  ['The coach sensors are a trial, on some routes only', 'Rider reports fill the gaps, and cover the shared-auto queue', 'Where there are neither, Signal can only show the usual pattern'],
  ['Crowd reports can be wrong, stale or gamed', 'Reports fade after 20 minutes, and one report on its own never changes the answer', 'A slower answer when sensors are off'],
  ['Google Maps already tells you when to leave', 'Kept the leave-by time, but made the interchange and the exit the core', 'Signal is no longer a single morning glance; it speaks at two more moments'],
  ['Booking a ride for you risks surge pricing and wrong bookings', 'Signal fills in the Rapido ride; the commuter confirms it', 'One extra tap, about four seconds'],
  ['The answer has to land in two seconds, mid-transfer at INA', 'Inter Bold for the answer instead of a serif', 'Less warmth and personality on the main screen'],
  ['Safety had the strongest need, but lighting and crowding data isn’t published', 'Left safety out of this version', 'Priya’s need, the sharpest in the research, is unmet'],
  ['14 weeks, on my own', 'One line, one interchange, one exit: the Yellow Line, INA and HUDA City Centre', 'Says nothing yet about other lines'],
  ['Seven interviews and five tests, found through my own network', 'Findings written as counts, like “4 of 7”, not percentages', 'Enough to find problems, not to say how common they are'],
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
  ['Coach sensors, live', 40, 'DMRC is trialling occupancy measured by the weight of each coach, shown today only on platform screens. Signal shows it before you reach the platform.'],
  ['Tap-ins and tap-outs', 25, 'Card and QR entries and exits, by station and minute: how busy INA and the exit gates are now, and on a usual Tuesday.'],
  ['Timetable, calendar and weather', 20, 'DMRC’s published timetable, plus matches at Kotla, exam days, holidays, fog and heavy rain. All open data.'],
  ['Rider reports', 15, 'Two taps, where sensors aren’t running yet, and for the shared-auto queue. They fade after 20 minutes; one report alone never changes the answer.'],
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


// The checks that made me refocus. Each figure is scoped the way its source scopes it.
const CHECKS = [
  ['99.95%', 'of Delhi Metro trains ran on time in 2026, by DMRC’s count. A train is late if it arrives more than 59 seconds behind.', 'https://www.tribuneindia.com/news/delhi/delhi-metro-records-99-95-train-punctuality-in-2026-dmrc/', 'The Tribune'],
  ['2 min 18 s', 'between trains on DMRC’s busiest corridors, by its own figures.', 'https://businesstoday.in/india/story/99-95-punctuality-record-how-delhi-metro-beat-new-york-paris-subways-at-the-reliability-game-548187-2026-08-09', 'Business Today'],
  ['Built', 'Google Maps already reminds you when to leave, working back from when you need to arrive.', 'https://support.google.com/maps/answer/7382999', 'Google Maps help'],
]

const ASSUMED = [
  'Trains run late, so people need to know when to leave.',
  'The morning departure is the decision that matters.',
  'Better timing data would remove the buffer.',
]

const FOUND = [
  'Trains run on time. Getting on them at the interchange doesn’t.',
  'The hard decisions are at INA and at the exit.',
  'People already avoid interchanges and queue for shared autos that no app can see.',
]

// Why safety comes next, and what it would take.
const SAFETY = [
  ['It is the first thing people need', 'In a 2014 Delhi preference study, safety came first (36%) among what would get people onto public transport, ahead of reliability (27%).'],
  ['The walk to and from the station is the weak part', <>Safetipin’s 2015 evening audit of Yellow Line station areas scored HUDA City Centre 1.7 out of 5 and IFFCO Chowk 1.5, on lighting, walkways, visibility and how many people are around (<a href="https://safetyscore.safetipin.com/projects/13/enhancing-last-mile-connectivity-report/" target="_blank" rel="noopener noreferrer" className="prose-link">report</a>).</>],
  ['What I would do first', 'Talk to women who travel after dark, walk the exits with them using Safetipin’s audit method, and find out which exits, gates and last-mile options feel safe at which hours.'],
  ['Where it could land', 'The same place as Signal: DMRC’s app and platform screens, which exit is lit and staffed tonight, and where the women’s coach stops.'],
]

const NEW_APP = [
  'Nobody downloads an app for a daily annoyance; commuters adapt.',
  'Built on riders’ reports, it starts empty, and stays empty.',
  'Another thing to open on a crowded platform.',
]

const IN_DMRC = [
  'People already open it for their QR ticket.',
  'DMRC already weighs every coach, on trial, and logs every gate tap.',
  'Riders’ reports only fill the gaps.',
]

function Compare({ a, b }) {
  return (
    <div className="track-wide mt-6 grid gap-3 sm:grid-cols-2">
      {[a, b].map(([h, items], i) => (
        <div key={h} className="rounded-xl p-5" style={{ border: '1px solid var(--rule)', background: i ? 'var(--raised)' : 'transparent' }}>
          <p className="text-faint" style={{ fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</p>
          <ul className="mt-3 space-y-2 p-0">
            {items.map((x) => <li key={x} className="list-none" style={{ fontSize: '0.95rem', lineHeight: 1.45, color: i ? 'var(--ink)' : undefined }}>{x}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}

const FACTS = [
  ['Role', 'Solo — research, interaction design, prototype, film'],
  ['Timeline', '14 weeks · M.Des Design Project I'],
  ['Research', '7 interviews · 2 peak-hour observations · 5 usability tests'],
  ['Status', 'Concept. The first version was prototyped and tested; the refocus is not yet tested'],
]

const STORYBOARD = [
  ['/signal/story-1.png', 'what time should I leave? she doesn’t know.'],
  ['/signal/story-2.png', '38 minutes, spent standing. not by choice.'],
  ['/signal/story-3.png', 'three moments, three decisions, zero information'],
  ['/signal/story-4.png', 'one signal, before the journey begins'],
]

const MORNING = [
  ['7:45', 'Home', 'What time should I leave?', 'adds a 20-minute buffer, every day'],
  ['9:10', 'On the Pink Line', 'Will I get on at INA?', 'no way to know until the doors open'],
  ['9:16', 'INA interchange', 'This one, or the next?', 'the first train is too full; she waits'],
  ['9:52', 'HUDA City Centre', 'Shared auto or Rapido?', 'autos wait to fill up; Rapido is on surge'],
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
  { stat: '2 of 7', viz: ['dots', { k: 2, n: 7 }], title: 'People reorganise their lives around it', body: 'One participant moved house to get onto the Yellow Line and avoid changing at Rajiv Chowk. Another walks ten extra minutes every morning to skip an interchange. Nothing else in the research cost people this much.' },
  { stat: 'INA', title: 'The interchange is a guess', body: 'At peak the first train is often too full to board, and nobody knows how crowded the next one is until they are on the platform. “I start checking my phone as soon as we leave Rajiv Chowk.”' },
  { stat: '7 of 7', viz: ['dots', { k: 7, n: 7 }], title: 'Everyone leaves early, every day', body: 'Every participant adds a buffer every day. Muskaan leaves an hour early for a 40-minute journey. They reported losing an average of 34 minutes a day to it.' },
  { stat: '0 apps', title: 'The shared-auto queue is invisible', body: <>At Gurgaon exits, commuters wait at particular pillars and split the fare, and no app knows it exists. In <a href="https://wri-india.org/sites/default/files/Improving%20metro%20access%20in%20India_%20Working%20Paper.pdf" target="_blank" rel="noopener noreferrer" className="prose-link">WRI India’s 2023 survey</a>, 89% of Delhi riders chose a share auto over the bus where both ran.</> },
  { stat: '4 of 7', viz: ['dots', { k: 4, n: 7 }], title: 'Women pick routes for safety first', body: 'Four participants, all women, choose routes by lighting, crowding and CISF presence. Not built here; it sits in the future scope.' },
  { stat: '0', title: 'Live crowding data to build on', body: <><a href="https://otd.delhi.gov.in/" target="_blank" rel="noopener noreferrer" className="prose-link">Delhi publishes</a> metro timetables but nothing live about crowding. DMRC is <a href="https://www.dnaindia.com/delhi/report-delhi-metro-news-you-can-now-find-empty-coaches-before-you-board-train-know-how-3153723" target="_blank" rel="noopener noreferrer" className="prose-link">trialling coach occupancy</a> on platform screens, so you only see it once you are already there.</> },
]

const COMPETITORS = {
  columns: ['Leave-by time', 'Crowding before you board', 'Which coach', 'The last mile at the exit', 'Learns from riders'],
  rows: [
    ['Google Maps', [[2, 'Reminder to leave'], [0, 'Not confirmed for Delhi Metro'], [0, 'None'], [1, 'Routes, no queues'], [1, 'Crowd ratings, some cities']]],
    ['DMRC app and screens', [[1, 'Timetable lookup'], [1, 'On platform screens, on trial'], [1, 'Same, on the platform only'], [1, 'Bike taxi and e-auto booking'], [0, 'None']]],
    ['Rapido and Uber', [[0, 'None'], [0, 'None'], [0, 'None'], [1, 'A ride, at surge'], [0, 'None']]],
    ['WhatsApp groups', [[0, 'None'], [1, 'Anecdotal, late'], [0, 'None'], [1, 'Manual posts'], [2, 'Entirely rider-led']]],
    ['Signal, in DMRC’s app', [[1, 'Kept, but secondary'], [2, 'Before you reach the platform'], [2, 'Which coach is emptier'], [2, 'Shared-auto queue, surge, walk'], [1, 'Reports fill sensor gaps']], true],
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
  ['Board', 'Get on this one.', 'there’s usually room on it', '#1F8A5B'],
  ['Move down', 'Board at coach 7.', 'full by the stairs, room further along', '#D08A00'],
  ['Let one go', 'Wait for the next.', 'usually packed · next in 3 min', ORANGE],
  ['No live data', 'Usual pattern only.', 'says so, rather than guessing', 'var(--faint)'],
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
  ['A narrow, convenient sample', 'Interviewees and testers came from personal networks and corridor WhatsApp groups. The five testers were all aged 24–31 and live on the Dwarka corridor, and one is a UX student. The findings describe this group, not Delhi’s 6.46 million daily riders.'],
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
        <h1 className="display">Signal: what the timetable can’t tell Delhi Metro commuters</h1>
        {/* Ayushman's own telling, lightly edited. */}
        <div className="space-y-4 pt-2">
          <p>
            My first Delhi Metro ride, with my younger brother, went the wrong way. I set out to build an
            app for those decisions, and the research led me to the people who make them every day:
            office commuters.
          </p>
          <p>
            My first version told them when to leave. The data said that was mostly solved, and my own
            research pointed somewhere else: getting on at the interchange, and getting away from the
            exit. So Signal became a feature of DMRC’s own app, built for those two moments.
          </p>
        </div>
      </motion.header>
      <motion.div {...rise(0.08)}><Overview items={OVERVIEW} /></motion.div>
      <motion.div {...rise(0.1)}>
        <Impact items={IMPACT} note="Usability results from the first version, with five daily commuters. The redesign has not been tested yet." />
      </motion.div>

      <div data-case-hero className="track-full mt-12 overflow-hidden rounded-xl">
        <SignalHero className="rounded-xl" />
      </div>
      <SkipTo target="screens">skip to the screens</SkipTo>

      <motion.div {...rise(0.14)}><Facts rows={FACTS} /></motion.div>

      <Rule />

      <section>
        <Heading n="01">The problem</Heading>
        <p className="mb-8">A morning, put together from what participants described. Only the first guess is about time.</p>
        <Morning items={MORNING} />
        <div className="mt-14">
          <LoadCurve />
        </div>
      </section>

      <Rule />

      <section>
        <Heading n="02">What I found</Heading>
        <p className="mb-8">
          Seven interviews, two peak hours watching Rajiv Chowk and HUDA City Centre, and five apps
          compared.{' '}
          <a href="https://www.figma.com/board/WI0U6Rar6OSNFbAioAZmmo/Mobility-Research-Synthesis" target="_blank" rel="noopener noreferrer" className="prose-link">The synthesis board ↗</a>
        </p>
        <Findings items={FINDINGS} />

        <Subhead>What existing apps do</Subhead>
        <Matrix {...COMPETITORS} />

        <Subhead>Who I designed for</Subhead>
        <Personas items={PERSONAS} />
      </section>

      <Rule />

      <section>
        <Heading n="03">Is this a real problem?</Heading>
        <p className="mb-8">I’m not from Delhi, and my first version rested on my own guess that trains run late. So I checked.</p>
        <div className="track-wide grid gap-3 sm:grid-cols-3">
          {CHECKS.map(([stat, body, href, source]) => (
            <div key={stat} className="rounded-xl p-5" style={{ border: '1px solid var(--rule)' }}>
              <p className="tnum" style={{ color: 'var(--ink)', fontSize: '1.6rem', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em' }}>{stat}</p>
              <p className="mt-3" style={{ fontSize: '0.95rem', lineHeight: 1.45 }}>{body}</p>
              <a href={href} target="_blank" rel="noopener noreferrer" className="prose-link text-faint mt-3 inline-block" style={{ fontSize: '0.85rem' }}>{source} ↗</a>
            </div>
          ))}
        </div>
        <Compare a={['What I assumed', ASSUMED]} b={['What the research showed', FOUND]} />
        <p className="mt-8">
          When the Yellow Line does fail, it fails as crowding: in August 2025 a signal fault{' '}
          <a href="https://www.theweek.in/wire-updates/national/2025/08/29/des92-dl-3rdld-dmrc-delay.html" target="_blank" rel="noopener noreferrer" className="prose-link">packed the platforms</a>{' '}
          at Hauz Khas, Rajiv Chowk and Kashmere Gate.
        </p>

        <Subhead>Then: why would anyone download it?</Subhead>
        <Compare a={['A new app', NEW_APP]} b={['A feature of DMRC’s app', IN_DMRC]} />
      </section>

      <Rule />

      <section id="screens" tabIndex={-1} data-skip-target>
        <Heading n="04">The solution</Heading>
        <Subhead>DMRC’s app today</Subhead>
        <DmrcToday />

        <Subhead>The redesign: one trip, four screens</Subhead>
        <p className="mb-8">DMRC’s blue and layout stay. Signal gets a tab, and its orange appears only at a decision.</p>
        <DmrcFlow />
        <p className="text-faint mt-4" style={{ fontSize: '0.85rem' }}>A concept for DMRC, not affiliated with it. HUDA City Centre is now Millennium City Centre, the name the app uses. Times, counts and pillar numbers are illustrative.</p>

        <div className="mt-14"><PlatformScreen /></div>

        <Subhead>The answer at INA, in four states</Subhead>
        <Verdicts items={STATES} />

        <Subhead>Where the answer comes from</Subhead>
        <Weights
          items={WEIGHTS}
          note="Specified, not running. It depends on DMRC using data it already collects, and the coach sensors are still a trial."
        />

        <Subhead>The first version, in 85 seconds</Subhead>
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
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>
            The leave-by version, made in code with Remotion. <a href={PROTOTYPE} target="_blank" rel="noopener noreferrer" className="prose-link">Its prototype ↗</a>
          </figcaption>
        </figure>
      </section>

      <Rule />

      <section>
        <Heading n="05">Constraints and tradeoffs</Heading>
        <Tradeoffs items={TRADEOFFS} />

        <Subhead>What testing changed, in the first version</Subhead>
        <Iterations items={ITERATIONS} />
      </section>

      <Rule />

      <section>
        <Heading n="06">What I learned</Heading>
        <p>
          I had to question my own problem, twice. First, whether it was real; then, whether anyone
          would download the answer. My research had been pointing at the interchange and the exit all
          along. Next, I’d show the redesign to three to five of the original participants and ask what
          it does for them that Google Maps doesn’t.
        </p>

        <Subhead>The need I left out: safety</Subhead>
        <p className="mb-6">Four of my seven participants, all women, choose routes by lighting, crowding and whether CISF is around. It deserves its own project.</p>
        <Decisions items={SAFETY} />
        <p className="text-faint mt-8" style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>
          Participants agreed to be quoted and are named by first name.
        </p>
      </section>

      <section className="mt-16">
        <p>
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link>.
        </p>
      </section>
    </main>
  )
}
