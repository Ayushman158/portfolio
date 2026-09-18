'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Decisions, Facts, Heading, Rule, Shots } from '../components/case-study'

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
  ['7 semi-structured interviews', 'Daily commuters across the Dwarka, Noida and Gurgaon corridors. 45–60 minutes each, think-aloud. Recruited through personal networks and corridor WhatsApp groups.'],
  ['2 observational sessions', 'Rajiv Chowk and HUDA City Centre, peak hours only. Phone use, decision-checking sequences and stress behaviour at the interchange.'],
  ['DMRC ridership data, FY 2024–25', 'Station-level entry and exit volumes; office commuting is 52% of ridership.'],
  ['Benchmarking five systems', 'TfL, Tokyo Metro, Singapore SMRT, Berlin BVG and Delhi. The others publish commuter data through open APIs. Delhi collects the same data and surfaces none of it.'],
  ['Cognitive journey mapping', 'Twelve journeys mapped end to end from transcripts and observation notes — decision points, stress triggers and failure modes at each moment.'],
  ['App timing study', 'Time-to-information across five transit apps, evaluated against Nielsen Norman heuristics. DMRC Sarthi scored lowest for habitual commuters.'],
]

const FINDINGS = [
  ['Four apps, no intelligence', 'Commuters with two or more transfers run Google Maps, the DMRC app, WhatsApp groups and the clock at once to approximate what one integrated signal could give them. None of them gives a departure verdict.'],
  ['INA is the blind transfer', 'Crowding on the connecting line, the corridor walk time and the next Violet Line train are all unknown until you are standing there. “I start checking my phone as soon as we leave Rajiv Chowk.”'],
  ['The buffer is anxiety management, not planning', '7 of 7 participants add a buffer every day, and they reported losing an average of 34 minutes a day to missing information. What commuters call planning ahead is that cost, paid every morning.'],
  ['Safety routes before speed', '4 of 7 participants, all women, choose routes by perceived safety — lighting, crowd density, CISF presence — and accept longer journeys to reduce uncertainty. Scoped out of this version; see below.'],
  ['Support ends at the exit gate', 'Information stops at the metro exit and mode choice is driven by what is visibly available. 89% of riders prefer paid autos over free buses — for predictability, not cost (WRI India 2023, n=7,200).'],
  ['Delhi collects the data. It doesn’t share it.', 'DMRC records tap-in and tap-out for every journey and publishes no real-time feed — no GTFS-RT, no crowding signal. That constraint shaped the product.'],
]

const STATES = [
  ['Viable', 'You’ll make it.', '4 min walk · 7 min available'],
  ['Tight', 'Move briskly.', '6 min walk · 7 min available'],
  ['Risky', 'Next service.', 'window overrun · next at 9:04'],
  ['Missed', 'Rebook.', 'a clean fallback, no alarm'],
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
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Signal · 2026</p>
        <h1 style={{ color: 'var(--ink)', fontSize: '2rem', lineHeight: 1.2, fontWeight: 500, letterSpacing: '-0.02em' }}>
          A familiar commute should not start with doubt.
        </h1>
        <p>
          A Delhi Metro companion for the Yellow Line corridor. One screen replaces four apps, and one
          verdict tells you whether your INA transfer will hold — before you board the train.
        </p>
        <p>
          The project is research-led: seven commuters, two peak-hour observations, five usability
          sessions, and a confidence model built around the fact that DMRC publishes no live data.
        </p>
      </motion.header>

      <motion.div {...rise(0.1)}><Facts rows={FACTS} /></motion.div>
      <motion.p {...rise(0.12)} className="mt-8">
        <a href={PROTOTYPE} target="_blank" rel="noopener noreferrer" className="prose-link">Try the prototype</a>
        <span className="text-faint"> · 22 screens, 9 phases, lock screen, app and watch</span>
      </motion.p>

      <Rule />

      <section>
        <Heading>One morning. Three decisions. No information.</Heading>
        <p className="mb-8">
          Before designing a screen I storyboarded the problem — the moments where the system fails a
          habitual commuter every day.
        </p>
        <Shots items={STORYBOARD} cols="grid-cols-1 sm:grid-cols-2" />

        <p className="mt-10 mb-2 text-faint" style={{ fontSize: '0.95rem' }}>
          Jasleen’s commute, Dwarka Sec-21 to HUDA City Centre — a real participant
        </p>
        <div>
          {MORNING.map(([time, place, q, what]) => (
            <div key={time} className="index-row" style={{ gridTemplateColumns: '3.5rem 1fr', alignItems: 'start' }}>
              <span className="tnum text-faint">{time}</span>
              <div>
                <p><span style={{ color: 'var(--ink)' }}>{place}</span> — “{q}”</p>
                <p className="text-faint" style={{ fontSize: '0.9rem' }}>{what}</p>
              </div>
            </div>
          ))}
        </div>

        <blockquote className="mt-10 pl-4" style={{ borderLeft: '1px solid var(--rule)' }}>
          <p>
            Delhi Metro commuters on multi-stage journeys lack visibility into crowding, transfer
            viability and last-mile availability. They fall back on experience-based mental models, add
            daily buffers, and make high-stakes commute decisions under uncertainty.
          </p>
        </blockquote>
      </section>

      <Rule />

      <section>
        <Heading>Three methods, one corridor, real commuters.</Heading>
        <Decisions items={METHODS} />
      </section>

      <section className="mt-14">
        <Heading>Six findings.</Heading>
        <Decisions items={FINDINGS} />
      </section>

      <section className="mt-14">
        <Heading>Two people the research kept returning to.</Heading>
        <div className="space-y-6">
          <div>
            <p style={{ color: 'var(--ink)' }}>Jasleen Kaur, 29 — the daily switcher</p>
            <p className="mt-1">
              Dwarka Sec-21 to HUDA City Centre, two transfers, a hard 9:30 standup. Memorises platform
              positions, runs four apps, and leaves twenty minutes early every day.
            </p>
            <p className="mt-2 text-faint">“I leave 20 minutes early every day. Not because I want to — because I have no choice.”</p>
          </div>
          <div>
            <p style={{ color: 'var(--ink)' }}>Priya Mehta, 26 — the late-night commuter</p>
            <p className="mt-1">
              Noida Sec-18 to Connaught Place, often alone after 9pm. Routes by perceived safety,
              crowdsources it over WhatsApp, and avoids stations she has no information about.
            </p>
            <p className="mt-2 text-faint">“I avoid Kashmere Gate at night. Not because it is unsafe — because I do not know if it is.”</p>
          </div>
        </div>
      </section>

      <Rule />

      <section>
        <Heading>Three decision moments. One product space.</Heading>
        <p>
          Cognitive load spikes at three moments — deciding when to leave, the INA transfer, and the
          exit. None of them is an infrastructure problem; each is an information problem. Of the
          apps compared, Citymapper comes closest, with proactive departures in London. None of them —
          Google Maps, DMRC Sarthi, Moovit, corridor WhatsApp groups — judges a Delhi transfer before you
          board.
        </p>
        <p className="mt-4">
          So Signal is not a navigation app and not a booking agent. It is a companion: pattern
          intelligence that speaks first, shows its reasoning, and leaves every consequential decision to
          the commuter.
        </p>
        <p className="mt-4">
          <span style={{ color: 'var(--ink)' }}>What this version leaves out.</span> Safety was the
          finding with the sharpest unmet need, and it is scoped out of this version. The signals it would
          rest on — lighting, crowding by hour, CISF presence — are exactly the data Delhi does not publish
          (finding 06). It is not a settings toggle, and this version does not pretend to address it.
        </p>
      </section>

      <Rule />

      <section>
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
        <Heading>22 screens, 9 phases, 3 surfaces.</Heading>
        <p>
          The information architecture covers the whole commute day, from a warning the night before to
          arrival, across the lock screen, the app and the watch. Every screen has a defined trigger —
          a confidence drop below 60%, a geofence, train speed and bearing — and most of the weight sits
          on the lock screen.
        </p>
        <p className="mt-6 mb-2 text-faint" style={{ fontSize: '0.95rem' }}>
          The core moment: the INA transfer verdict, in four states
        </p>
        <div>
          {STATES.map(([state, verdict, detail]) => (
            <div key={state} className="index-row" style={{ gridTemplateColumns: '5rem 1fr auto' }}>
              <span className="text-faint">{state}</span>
              <span style={{ color: 'var(--ink)' }}>{verdict}</span>
              <span className="text-faint" style={{ fontSize: '0.9rem', textAlign: 'right' }}>{detail}</span>
            </div>
          ))}
        </div>
        <p className="mt-6">
          Signal orange (#FF3E00) appears only at decision moments; 90% of every screen is ink and paper.
          Across 250 commutes a year, that scarcity is what gives the departure time and the verdict their
          weight.
        </p>
      </section>

      <section className="mt-14">
        <Heading>What I rejected, and why.</Heading>
        <Decisions items={REJECTED} />
      </section>

      <section className="mt-14">
        <Heading>Six principles, each earned from research.</Heading>
        <Decisions items={PRINCIPLES} />
      </section>

      <Rule />

      <section>
        <Heading>Five participants. Every finding actioned.</Heading>
        <p>
          Moderated think-aloud sessions on the prototype, with habitual Yellow Line commuters on the
          Dwarka–Gurgaon corridor. 4 of 5 completed onboarding (the target was 80%), and 4 of 5 read the
          S4 “Viable” verdict correctly, in under three seconds.
        </p>
        <p className="mt-4">
          The most useful session was one participant. Anshuman’s “What does pre-fill mean exactly?” turned
          up in five places: internal terms had leaked into the interface. One session, five fixes.
        </p>
        <p className="mt-8 mb-2 text-faint" style={{ fontSize: '0.95rem' }}>Before → after</p>
        <div>
          {ITERATIONS.map(([before, after]) => (
            <div key={before} className="index-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <span className="text-faint">{before}</span>
              <span style={{ color: 'var(--ink)' }}>{after}</span>
            </div>
          ))}
        </div>
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
          <Link href="/album-alive" className="prose-link">ALBUM//ALIVE</Link> and{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link>.
        </p>
      </section>
    </main>
  )
}
