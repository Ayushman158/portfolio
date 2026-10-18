'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Figure, Heading, Tradeoffs } from '../components/case-study'
import { Arcs, Contrast, Coverage, DailyLoop, DelayMap, Headlines, Journey, Orbit, Timeline } from './charts'
import { Network, Pill, YellowLine } from './lines'
import Wave from './wave'
import { AlertFlow, AlertWindow } from './limits'

/*
 * Personalising the Delhi Metro app for daily commuters (Signal v4). When a
 * commuter's line is delayed, DMRC's app shows how long their other ways to
 * work still get them there on time, and leaves the choice to them.
 * Minimal on purpose: one light blue for the product, Delhi Metro's line
 * colours as accents and as the line graphic, plain section titles, no tags,
 * no participant names a reader has no context for. Times marked * are the
 * simulated example (Malviya Nagar to Rajiv Chowk, work at 10:30). Copy
 * informs, never instructs: "Backups work until 9:31", never "Switch by 9:31".
 */

const V = '/signal/v4'
const TEST = 'https://signal-scenario-test.vercel.app'

const STATIONS = [
  ['overview', 'Overview'], ['problem', 'The problem'], ['found', 'Research'], ['tried', 'What I tried first'],
  ['idea', 'The idea'], ['change', 'Before and after'], ['screens', 'The screens'], ['stress', 'Stress test'],
  ['system', 'How it works'], ['limits', 'Limits and asks'], ['next', 'Future scope'],
]
const IDS = STATIONS.map(([id]) => id)

const METHODS = [
  ['7', 'in-depth interviews', 'Daily commuters with trips of 1 to 4 stages, 15 minutes to 1.5 hours.'],
  ['5', 'usability tests', 'Of the first version, with daily commuters.'],
  ['244', 'stations modelled', 'Entrances and walking distance, from OpenStreetMap.'],
  ['8', 'press and DMRC sources', 'Punctuality, faults, closures and the last-mile policy.'],
]

const SYNTHESIS = [
  ['Delays add up across stages', 'Most trips have two to four stages. A late train means a missed bus or a later auto. This was the pain point people raised first.', 'Top pain point'],
  ['Everyone pays for the bad day in advance', 'All seven add a buffer to every trip, 34 minutes a day on average by their own estimate.', '7 of 7'],
  ['Nobody says how long a delay will last', 'One display said 6 minutes while a participant waited 20 to 25. Alerts often reach X before they reach the station.', 'Interviews and press'],
  ['Riders trust experience over the map', 'They know which train to let go and which exit to use. Two changed where they live or board to avoid an interchange.', '2 of 7'],
  ['The last mile is fragile', 'Surge prices, no ride found, shared autos that wait to fill.', '4 of 7'],
  ['Safety shapes routes for women', 'Lighting, crowding and guards decide which station and which hour. Its own project, so it sits in future scope.', '4 of 7'],
]

const TRADEOFFS = [
  ['Nobody knows how long the delay will last', 'Count down to the backups, not the train', 'It can’t say whether the train will come'],
  ['Ride times vary, and traffic can add 20 minutes', 'Use the slowest end of every range', 'Some riders leave when waiting would have worked'],
  ['DMRC earns from the rides it shows', '“Keep waiting” is an equal choice, and the bus is listed too', 'It’s less useful as a sales channel'],
  ['Alerts pile up and get ignored', 'One alert per trip, only for trips with a deadline', 'Miss it, and the rider has to open the app'],
]

/* [title, today: [screen, alt, marks, notes], redesign: [screen, alt, marks, notes]] */
const PAIRS = [
  ['Booking a trip',
    ['dmrc-book', 'DMRC’s Book QR Ticket screen today: two empty Select Station fields, and an App Store ad for a QR scanner below them',
      [[1, '93%', '17.5%'], [2, '93%', '44.8%']],
      [['Every trip starts from empty stations', 'Someone who rides the same trip daily picks both stations again each time.'],
        ['An ad sits where the trip could be', 'A third-party app ad fills the space below the form.']]],
    ['s1-book', 'The redesign: the trip filled in with its line, time and fare, and a new row to arrive by a set time',
      [[1, '93%', '14.6%'], [2, '93%', '42.4%']],
      [['The trip is filled in', 'Stations, line, time and fare.'],
        ['One new row: arrive by a set time', 'Set once. Now a delay has a deadline to be measured against.']]]],
  ['Opening the app on a normal morning',
    ['dmrc-tickets', 'DMRC’s Ticket tab today: an illustration, No Tickets Booked Yet, and a Book QR Ticket button',
      [[1, '93%', '25.2%'], [2, '89%', '63.6%']],
      [['No trip, no status', '“No tickets booked yet”, even for someone who rides every day.'],
        ['Booking is the only action', 'The screen points back to buying a ticket.']]],
    ['s2-home', 'The redesign’s home: the saved work trip says On time, with arrival and time to spare',
      [[1, '93%', '14.6%'], [2, '91%', '31.4%']],
      [['The day starts with a status', '“On time”, on the rider’s own line.'],
        ['Time to spare, worked out', 'Arrival against the deadline, so a delay can be read in minutes.']]]],
]

const BREAKS = [
  ['setup-daily', 'Daily riders tap a card, not a QR ticket', 'So the trip is saved once, with its deadline.'],
  ['alert-lock', 'They’re working on the way, not watching', 'One alert per trip, with both choices on it.'],
  ['s3-home', 'The fault can hit before they leave', 'The same decision, made from home.'],
  ['s3-train', 'The train can be held between stations', 'The next stop, and what works from there.'],
  ['s3-offline', 'There’s no signal underground', 'It shows what it last knew, and when.'],
  ['s3-restored', 'The first trains back are full', 'It says so, so nobody expects a seat.'],
  ['ride-booked', 'The gate can fail on the way out', 'What to show at the counter.'],
]

const SCREENS = [
  ['s1-book', 'Night before', 'One new row: arrive by a set time.'],
  ['s2-home', '8:58', 'A normal day says “On time”.'],
  ['s3-decision', '9:10, delayed', 'How long backups work, and both choices.'],
  ['s4-backups', '9:12', 'Every way to get there, with its status.'],
  ['s5-past', '9:40', 'After 9:31, nothing is pushed.'],
]

const SKETCHES = [
  ['sketch-c1-signal-card', 'Leave-by card'], ['sketch-c2-journey-thread', 'Journey thread'],
  ['sketch-c4-pocket-brief', 'Lock-screen brief'], ['sketch-c5-transfer', 'Interchange check'],
]

/* The section you're reading, for the margin menu. */
function useActive(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' },
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [ids])
  return active
}

/* Plain text menu, fixed in the left margin on wide screens only. */
function LineMap({ active }) {
  return (
    <nav aria-label="Sections" className="sig-map fixed left-6 top-40 z-10 w-44">
      <ul className="space-y-0.5">
        {STATIONS.map(([id, name]) => {
          const on = id === active
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={on ? 'location' : undefined}
                className="-ml-3 block rounded-full px-3 py-1.5 transition-colors duration-200"
                style={{ fontSize: '0.92rem', color: on ? 'var(--ink)' : 'var(--faint)', background: on ? 'var(--sig-tint)' : 'transparent' }}
              >
                {name}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Section({ id, title, lede, line, children }) {
  return (
    <section id={id} className="scroll-mt-24 pt-24">
      {line && <Pill line={line} />}
      <Heading>{title}</Heading>
      {lede && <p className="text-ink" style={{ fontSize: '1.2rem', lineHeight: 1.5 }}>{lede}</p>}
      {children}
    </section>
  )
}

/*
 * An iPhone 15 Pro frame, built to the mobile-app-screen-mockup skill's
 * device spec (390 px body, 12 px bezel, 56 px outer and 44 px screen corners,
 * a 124 × 36 Dynamic Island 22 px from the top, side buttons, metallic rails,
 * a home indicator), with the real screen inside. Every measure is a
 * percentage of the frame, so it holds its proportions at any width.
 * `marks` pins numbered callouts onto the screen: [n, x%, y%].
 */
const BUTTONS = [
  ['left', '21.3%', '3.9%'], ['left', '27%', '7.35%'], ['left', '35.5%', '7.35%'], ['right', '30.6%', '12.25%'],
]
const DARK_SCREENS = ['alert-lock']
const Phone = ({ src, alt, className = '', marks = [], tone = 'var(--sig)', bare = false }) => (
  <div
    className={`relative isolate ${className}`}
    style={{
      padding: '3.08%',
      borderRadius: '14.4% / 6.86%',
      background: 'linear-gradient(160deg, #2a2a2c 0%, #1a1a1c 50%, #0e0e10 100%)',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 2px #000, 0 28px 60px -12px rgba(0,0,0,0.38), 0 8px 20px -8px rgba(0,0,0,0.3)',
    }}
  >
    {BUTTONS.map(([side, top, h]) => (
      <span key={side + top} aria-hidden="true" className="absolute w-[1.03%] rounded-sm" style={{ [side]: '-0.77%', top, height: h, background: '#0a0a0c' }} />
    ))}
    {['left', 'right'].map((side) => (
      <span key={side} aria-hidden="true" className="pointer-events-none absolute w-[0.8%]" style={{ [side]: '-0.25%', top: '12%', bottom: '12%', background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.08) 8%, transparent 16%, transparent 84%, rgba(255,255,255,0.05) 92%, transparent 100%)' }} />
    ))}
    <div className="relative overflow-hidden" style={{ borderRadius: '12% / 5.56%', background: '#000' }}>
      <img src={`${V}/${src}.png`} alt={alt} loading="lazy" className="sig-dim block h-auto w-full" />
      <span aria-hidden="true" className="absolute rounded-full" style={{ top: '1.26%', left: '33.05%', width: '33.9%', height: '4.55%', background: '#000' }} />
      {!bare && <span aria-hidden="true" className="absolute rounded-full" style={{ bottom: '1%', left: '31.7%', width: '36.6%', height: '0.63%', minHeight: 3, background: DARK_SCREENS.includes(src) ? 'rgba(255,255,255,0.85)' : 'rgba(26,25,22,0.85)' }} />}
      {marks.map(([n, x, y]) => (
        <span key={n} aria-hidden="true" className="absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[0.85rem] font-semibold" style={{ left: x, top: y, background: tone, color: '#fff', boxShadow: '0 0 0 3px rgba(255,255,255,0.9), 0 4px 12px rgba(0,0,0,0.25)' }}>{n}</span>
      ))}
    </div>
  </div>
)

const Notes = ({ items, tone }) => (
  <ol className="mt-6 space-y-4">
    {items.map(([t, d], i) => (
      <li key={t} className="flex gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.85rem] font-semibold" style={{ background: tone, color: '#fff' }}>{i + 1}</span>
        <div><div className="text-ink">{t}</div><div style={{ fontSize: '0.95rem' }}>{d}</div></div>
      </li>
    ))}
  </ol>
)

export default function Signal() {
  const reduceMotion = useReducedMotion()
  const active = useActive(IDS)
  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <LineMap active={active} />
      <motion.div {...rise(0)}><Back /></motion.div>

      {/* ---------- Overview ---------- */}
      <section id="overview" className="scroll-mt-24">
        <motion.header {...rise(0.06)} className="mt-10 space-y-5">
          <h1 className="display">Personalising the Delhi Metro app for daily commuters</h1>
          <p className="text-ink" style={{ fontSize: '1.3rem', lineHeight: 1.45 }}>
            A redesign of DMRC’s app around a commuter’s own daily trip. When their line is delayed, it shows
            how long their other ways to work still get them there on time. The choice stays theirs.
          </p>
        </motion.header>

        <Network className="track-wide mt-12" />
        <figure data-case-hero className="track-wide mt-8 overflow-hidden rounded-2xl">
          <img src={`${V}/hero.jpg`} alt="Three screens from the redesign: a lock-screen alert, the decision screen reading Backups work until 9:31, and a booked bike taxi" width={1536} height={1024} className="sig-light block h-auto w-full" />
          <img src={`${V}/hero-dark.jpg`} alt="" aria-hidden="true" width={1536} height={1024} className="sig-dark h-auto w-full" />
        </figure>

        <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-rule pt-7 sm:grid-cols-3">
          <div><dt className="text-ink mb-1">Who it’s for</dt><dd style={{ fontSize: '0.98rem' }}>Office commuters who take the same metro trip every day and can’t be late.</dd></div>
          <div><dt className="text-ink mb-1">The problem</dt><dd style={{ fontSize: '0.98rem' }}>When their line is delayed, they can’t tell how long they can wait before their other options stop working.</dd></div>
          <div><dt className="text-ink mb-1">What I made</dt><dd style={{ fontSize: '0.98rem' }}>A saved daily trip in DMRC’s app that turns a delay into one time: when the backups stop working.</dd></div>
        </dl>
        <p className="text-faint mt-6" style={{ fontSize: '0.9rem' }}>Solo, 14 weeks, M.Des at UPES. A student concept, not made with or for DMRC.</p>
      </section>

      {/* ---------- The problem ---------- */}
      <Section id="problem" line="red" title="The problem" lede="Delhi Metro trains run on time 99.95% of the time. But a commute is more than the train, and the bad days keep making the news.">
        <Headlines />
        <Contrast />

        <h3 className="subhead mt-16">A commute has several stages, and delays add up</h3>
        <p>A daily trip is a bus or auto, a gate, a platform, maybe a change of line, another gate and a last ride. A delay at any stage carries into the next. This project designs for faults and closures on the line. The rest is future scope.</p>
        <DelayMap />

        <div className="track-wide mt-16 grid items-center gap-10 md:grid-cols-2">
          <DailyLoop />
          <div className="space-y-3">
            <h3 className="subhead">So commuters pay for the bad day in advance</h3>
            <p>Nobody tells them how long a delay will last, so they leave 34 minutes early every morning. One bad day makes the next buffer bigger. Better information can only help at one moment: when they decide to wait or leave.</p>
          </div>
        </div>

        <h3 className="subhead mt-16">When the bad day comes</h3>
        <p>One participant, a student on his exam day: bus, then metro, then auto.</p>
        <Journey />
        <p className="mt-6">He had other ways to get there. He didn’t know how long they would still work.</p>
      </Section>

      {/* ---------- Research ---------- */}
      <Section id="found" line="magenta" title="Research" lede="I’m not from Delhi, so I built the picture from people who ride every day, and checked it against data.">
        <dl className="track-wide mt-10 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
          {METHODS.map(([n, t, d]) => (
            <div key={t} className="border-t border-rule pt-4">
              <dt><span className="font-serif" style={{ fontSize: '2.4rem', lineHeight: 1, color: 'var(--ink)' }}>{n}</span><span className="text-ink mt-1 block">{t}</span></dt>
              <dd className="mt-1" style={{ fontSize: '0.92rem' }}>{d}</dd>
            </div>
          ))}
        </dl>

        <div className="track-wide mt-16 grid items-center gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <figure>
            <img src={`${V}/metro-ride.jpg`} alt="Riders inside a Delhi Metro coach, faces blurred" loading="lazy" className="sig-dim block aspect-[4/5] w-full max-w-[320px] rounded-2xl object-cover" />
          </figure>
          <div className="space-y-4">
            <p className="text-ink" style={{ fontSize: '1.15rem' }}>Daily riders don’t follow the map. They ride on what they’ve learned: which train to let go, which exit to use, which stop to skip.</p>
            <p>One participant knows the second train is emptier. Another moved house to avoid changing lines at Rajiv Chowk. On one of my rides, the regular among my friends skipped our stop to save time. I would have followed the map.</p>
          </div>
        </div>

        <h3 className="subhead mt-16">What seven daily commuters told me</h3>
        <div className="track-wide mt-6"><Arcs /></div>

        <Figure src="/signal/proof/synthesis-board.jpg" alt="FigJam synthesis board from the seven interviews" caption="Affinity mapping of the seven interviews, in FigJam." track="track-wide mt-16" />
        <h3 className="subhead mt-10">What the synthesis showed</h3>
        <div className="track-wide mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {SYNTHESIS.map(([t, d, n], i) => (
            <div key={t} className="border-t border-rule pt-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-ink" style={{ fontSize: '1.05rem' }}><span className="text-faint mr-2">{i + 1}</span>{t}</span>
                <span className="text-faint shrink-0" style={{ fontSize: '0.85rem' }}>{n}</span>
              </div>
              <p className="mt-2" style={{ fontSize: '0.95rem' }}>{d}</p>
            </div>
          ))}
        </div>

        <h3 className="subhead mt-16">Five things a rider has during a delay, and one they don’t</h3>
        <div className="track-wide mt-6"><Orbit /></div>
      </Section>

      {/* ---------- What I tried first ---------- */}
      <Section id="tried" line="violet" title="What I tried first" lede="Three directions before this one. Each ended at something I found.">
        <h3 className="subhead mt-10">A leave-by time</h3>
        <p>I sketched five concepts and tested the best one with five commuters: 4 of 5 read its answer in under 3 seconds. Then I checked: trains run 99.95% on time, and Google Maps already reminds you when to leave.</p>
        <div className="track-wide mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {SKETCHES.map(([f, t]) => (
            <figure key={f}>
              <img src={`${V}/${f}.jpg`} alt={`Pencil sketch: ${t}`} loading="lazy" className="sig-dim block h-auto w-full rounded-xl" />
              <figcaption className="text-faint mt-2" style={{ fontSize: '0.88rem' }}>{t}</figcaption>
            </figure>
          ))}
        </div>
        <Figure src={`${V}/sketch-c1-three-states.jpg`} alt="Pencil sketch: the leave-by card in three states, the default, a pre-filled ride prompt, and searching for a driver" caption="The ride is pre-filled, never booked for the rider. That rule carried into this version." track="track-wide mt-6" />

        <h3 className="subhead mt-16">Crowding at the interchange</h3>
        <p>An app that would tell riders which train to let go at a busy interchange. There’s no reliable live crowd data to build it on, so crowding moved to future scope.</p>

        <h3 className="subhead mt-14">A better station to board from</h3>
        <p>I mapped every station and entrance and modelled walking times. On foot, almost nobody has a second station to choose from.</p>
        <Coverage />
      </Section>

      {/* ---------- The idea ---------- */}
      <Section id="idea" line="yellow" title="The idea" lede="Nobody can say how long a delay will last. What can be worked out is how long the other ways still get you there on time.">
        <YellowLine />
        <p className="mt-6">The example trip runs on the Yellow Line. A fault between Hauz Khas and Central Secretariat comes with no time. The backups leave from where the rider is, and they only work for a while.</p>
        <h3 className="subhead mt-16">How long the backups work</h3>
        <Timeline />
        <p className="mt-8">The rule: take the deadline, subtract the slowest likely backup (getting out of the station, waiting for a pickup, the ride), and keep 5 minutes spare. It uses the slowest end of every estimate, because traffic is what made the student late.</p>

        <h3 className="subhead mt-16">What I chose, and what it cost</h3>
        <div className="mt-4"><Tradeoffs items={TRADEOFFS} /></div>
      </Section>

      {/* ---------- Before and after ---------- */}
      <Section id="change" line="blue" title="Before and after" lede="DMRC’s app today, next to the redesign.">
        {PAIRS.map(([title, today, redesign]) => (
          <div key={title}>
            <h3 className="subhead mt-14">{title}</h3>
            <div className="track-wide mt-6 grid gap-14 md:grid-cols-2">
              {[[today, 'Today', 'var(--sig-quiet)'], [redesign, 'Redesign', 'var(--sig)']].map(([[src, alt, marks, notes], label, tone]) => (
                <div key={label}>
                  <div className="mb-4" style={{ fontSize: '0.9rem', color: label === 'Today' ? 'var(--faint)' : 'var(--sig)' }}>{label}</div>
                  <Phone src={src} alt={alt} className="mx-auto max-w-[280px]" tone={tone} marks={marks} bare={src.startsWith('dmrc-')} />
                  <Notes items={notes} tone={tone} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-faint mt-8" style={{ fontSize: '0.85rem' }}>Today’s screens are screenshots of DMRC’s app on iPhone.</p>
      </Section>

      {/* ---------- The screens ---------- */}
      <Section id="screens" line="aqua" title="The screens" lede="Built on DMRC’s own app, with its contrast fixed, so it reads as an update rather than a new app.">
        <Wave className="track-wide mt-10 rounded-2xl">
          <div className="flex items-end justify-center gap-2 px-4 pt-10 sm:gap-6 sm:px-10 sm:pt-14">
            <img src={`${V}/d3-decision.webp`} alt="The decision screen on an iPhone 15 Pro: Yellow Line delayed, backups work until 9:31" width={711} height={1100} loading="lazy" className="block h-auto w-[46%] max-w-[300px] translate-y-6 drop-shadow-2xl" />
            <img src={`${V}/d3-backups.webp`} alt="The backups sheet on an iPhone 15 Pro: every way to get there, each with its status" width={663} height={1100} loading="lazy" className="block h-auto w-[43%] max-w-[280px] drop-shadow-2xl" />
          </div>
        </Wave>
        <div className="track-wide mt-10 rounded-2xl px-5 pb-6 pt-8 sm:px-8" style={{ background: 'radial-gradient(90% 100% at 50% 0%, var(--sig-sky), var(--sig-tint) 55%, var(--ground))' }}>
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3">
            {SCREENS.map(([f, t, c]) => (
              <figure key={f} className="w-[200px] shrink-0 snap-start sm:w-[210px]">
                <div className="mb-2" style={{ fontSize: '0.9rem', color: t.includes('delayed') ? 'var(--sig-late)' : 'var(--faint)' }}>{t}</div>
                <Phone src={f} alt={c} />
                <figcaption className="mt-2" style={{ fontSize: '0.9rem' }}>{c}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="track-wide mt-14 grid items-center gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl px-10 pt-10" style={{ background: 'var(--sig-tint)', height: 'clamp(340px, 34vw, 460px)' }}>
            <Phone src="s3b-closure" alt="Closure announced the night before: Rajiv Chowk exits closed tomorrow, nearest open exit Barakhamba Road" className="mx-auto max-w-[260px]" />
          </div>
          <div className="space-y-3">
            <h3 className="subhead">When the closure is known the night before</h3>
            <p>Most disruptions from July to October 2026 were planned security closures, announced the evening before. So the choice moves home: which exit is open, and when to leave.</p>
          </div>
        </div>
      </Section>

      {/* ---------- Stress test ---------- */}
      <Section id="stress" line="pink" title="Stress-testing it on a real commute" lede="I took one participant’s commute, three stages and an hour and a half each way, and ran it through the screens one morning at a time. The flow broke in seven places.">
        <div className="track-wide mt-10 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4">
          {BREAKS.map(([f, t, c]) => (
            <figure key={f}>
              <Phone src={f} alt={`${t}. ${c}`} />
              <figcaption className="mt-3" style={{ fontSize: '0.92rem' }}><span className="text-ink block">{t}</span>{c}</figcaption>
            </figure>
          ))}
        </div>
        <Figure src={`${V}/s6-states.png`} alt="States board: every number says where it came from and how old it is" caption="All seven are states of one card. Every number says where it came from and how old it is." track="track-wide mt-12" />

        <h3 className="subhead mt-16">Testing it with riders</h3>
        <p>A scenario test with daily commuters is running. Each rider lives the same delayed morning on their own trip twice: with today’s app, then with the redesign. Results will be added here.</p>
        <p className="mt-3"><a className="prose-link" href={TEST} target="_blank" rel="noreferrer">Try the test</a></p>
      </Section>

      {/* ---------- How it works ---------- */}
      <Section id="system" line="green" title="How it works" lede="No new data to start. Alerts, ride times and gates already exist inside DMRC and its partners.">
        <Figure src={`${V}/s7-system.png`} alt="System board: service alerts, the rider's deadline, ride times and gates feed one rule, which drives the home card, the decision and the backups sheet" track="track-wide mt-10" />
        <div className="track-wide mt-10 grid gap-8 sm:grid-cols-3">
          <div className="space-y-2"><div className="h-1 rounded-full" style={{ background: 'var(--sig-sky)' }} /><div className="text-ink">Now</div><p style={{ fontSize: '0.95rem' }}>Works with alerts, partner ride times and gates as they are.</p></div>
          <div className="space-y-2"><div className="h-1 rounded-full" style={{ background: 'var(--sig)' }} /><div className="text-ink">Needs DMRC</div><p style={{ fontSize: '0.95rem' }}>Alerts the moment they’re logged. A delay given as a time. No exit charge during a declared fault.</p></div>
          <div className="space-y-2"><div className="h-0" style={{ borderTop: '4px dashed var(--rule)' }} /><div className="text-ink">Later</div><p style={{ fontSize: '0.95rem' }}>Live gaps between trains, so “longer than usual” is measured.</p></div>
        </div>
      </Section>

      {/* ---------- Limits ---------- */}
      <Section id="limits" line="grey" title="Limits, and what I’d ask DMRC to change" lede="The screens can only be as early as DMRC’s alerts. The bigger fix is in the system behind them.">
        <h3 className="subhead mt-10">It’s only as fast as the alert</h3>
        <p>Move the deadline and the alert’s delay. Every minute the alert spends getting to the rider comes out of the time they have to decide.</p>
        <AlertWindow />

        <h3 className="subhead mt-16">The system change I’d propose</h3>
        <p>Today a fault reaches riders through a chain of hand-offs, each one slower and vaguer than the last. I’d replace the chain with one alert, written once and sent everywhere when it’s logged.</p>
        <AlertFlow />
        <ol className="mt-10 space-y-4">
          {[
            ['Send alerts the moment they’re logged', 'The same second for the app, the displays and ride partners.'],
            ['Give the delay as a time, or say it’s unknown', 'Riders can plan around “unknown”. They can’t plan around silence.'],
            ['Waive the exit charge during a declared fault', 'So leaving the station isn’t a penalty for taking a backup.'],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.85rem] font-semibold" style={{ background: 'var(--sig)', color: 'var(--sig-on)' }}>{i + 1}</span>
              <div><div className="text-ink">{t}</div><div style={{ fontSize: '0.95rem' }}>{d}</div></div>
            </li>
          ))}
        </ol>

        <h3 className="subhead mt-16">What it still doesn’t cover</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <p><span className="text-ink">How often faults happen is unknown.</span> If they’re rare, the daily setup has to be very light to be worth it.</p>
          <p><span className="text-ink">It covers one stage of the trip.</span> Not the bus before the metro or the auto after it.</p>
          <p><span className="text-ink">The exit-fare rule is unconfirmed.</span> The note on the backups sheet is placeholder copy.</p>
          <p><span className="text-ink">It hasn’t been tested with riders yet.</span> The scenario test is running.</p>
        </div>
      </Section>

      {/* ---------- Future scope ---------- */}
      <Section id="next" line="orange" title="Future scope" lede="The other places a commute breaks, in the order I’d take them on.">
        <ol className="mt-8 space-y-5">
          {[
            ['Delays at the gates', 'QR tickets and cards that fail at the gate, and security queues. These need DMRC’s gate data.'],
            ['Crowding', 'Whether the next train is worth boarding. This needs live load data, which DMRC only trials today.'],
            ['The last mile', 'Rides that surge or never arrive, so the backup time reflects what’s really available.'],
            ['Occasional riders', 'The same idea in QR booking, for people without a saved trip.'],
            ['Safety at night', 'How women choose stations and hours. Its own project.'],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4 border-t border-rule pt-4">
              <span className="text-faint w-5 shrink-0">{i + 1}</span>
              <div><div className="text-ink">{t}</div><div style={{ fontSize: '0.95rem' }}>{d}</div></div>
            </li>
          ))}
        </ol>
      </Section>

      <footer className="mt-20 space-y-3 border-t border-rule pt-6 text-faint" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
        <p><span style={{ color: 'var(--sig-est)' }}>*</span> Times and percentages with an asterisk are simulated: the trip example, and walking coverage modelled on OpenStreetMap. They’re shown the way DMRC’s app shows estimates.</p>
        <p>
          Participant findings come from seven interviews. Punctuality:{' '}
          <a className="prose-link" href="https://www.tribuneindia.com/news/delhi/delhi-metro-records-99-95-train-punctuality-in-2026-dmrc/" target="_blank" rel="noreferrer">The Tribune</a>. Faults and closures: the articles linked above. Last mile:{' '}
          <a className="prose-link" href="https://wri-india.org/sites/default/files/Improving%20metro%20access%20in%20India_%20Working%20Paper.pdf" target="_blank" rel="noreferrer">WRI India</a>.
        </p>
        <p>A student concept. Not made with or for DMRC.</p>
      </footer>
    </main>
  )
}
