'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Figure, Heading, Tradeoffs } from '../components/case-study'
import { AlertSpeed, Arcs, Contrast, Coverage, DailyLoop, Disruptions, Journey, Orbit, ReviewBars, Slack } from './charts'

/*
 * How long can I wait? (Signal v4): when the metro is disrupted on a deadline trip, it shows how long
 * the other ways of getting there still work, and leaves the choice to her.
 * Minimal on purpose: one light blue, plain section titles, no tags. Times
 * marked * are the simulated example (Malviya Nagar to Rajiv Chowk, work at
 * 10:30), shown the way DMRC's app shows estimates. Copy informs, never
 * instructs: "Backups work until 9:31", never "Switch by 9:31".
 */

const V = '/signal/v4'
const TEST = 'https://signal-scenario-test.vercel.app'

const STATIONS = [
  ['overview', 'Overview'], ['problem', 'The problem'], ['found', 'What I found'], ['tried', 'What I tried first'],
  ['idea', 'The idea'], ['screens', 'The screens'], ['stress', 'Stress test'], ['system', 'How it works'],
  ['limits', 'Limits'], ['next', 'What’s next'],
]

const IDS = STATIONS.map(([id]) => id)

const TRADEOFFS = [
  ['Nobody knows how long the delay will last', 'Count down to the backups, not the train', 'It can’t say whether the train will come'],
  ['Ride times vary, and Ajeet hit traffic', 'Use the slowest end of every range', 'Some riders leave when waiting would have worked'],
  ['DMRC earns from the rides it shows', '“Keep waiting” is an equal choice, and the bus is listed too', 'It’s less useful as a sales channel'],
  ['Alerts pile up and get ignored', 'One alert per trip, only for trips with a deadline', 'Miss it, and she has to open the app'],
]

const BREAKS = [
  ['setup-daily', 'She taps a card, never a QR', 'So she saves her daily trip once.'],
  ['alert-lock', 'She’s working, not watching', 'One alert per trip, with both choices on it.'],
  ['s3-home', 'The fault hits before she leaves', 'The same decision, made from home.'],
  ['s3-train', 'Held between stations', 'The next stop, and what works from there.'],
  ['s3-offline', 'No signal underground', 'It shows what it last knew, and when.'],
  ['s3-restored', 'The first trains back are full', 'It says so.'],
  ['ride-booked', 'The gate fails on the way out', 'What to show at the counter.'],
]

const SCREENS = [
  ['s1-book', 'Night before', 'One new row: arrive by a set time.'],
  ['s2-home', '8:58', 'A normal day says “On time”.'],
  ['s3-decision', '9:10, delayed', 'How long backups work, and both choices.'],
  ['s4-backups', '9:12', 'Every way to get there, with its status.'],
  ['s5-past', '9:40', 'After 9:31, nothing is pushed.'],
]

const SKETCHES = [
  ['sketch-c1-signal-card', 'Signal Card'], ['sketch-c2-journey-thread', 'Journey Thread'],
  ['sketch-c4-pocket-brief', 'Pocket Brief'], ['sketch-c5-transfer', 'Transfer Moment'],
]

/* The section you're reading, for the line map. */
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

function Section({ id, title, lede, children }) {
  return (
    <section id={id} className="scroll-mt-24 pt-24">
      <Heading>{title}</Heading>
      {lede && <p className="text-ink" style={{ fontSize: '1.2rem', lineHeight: 1.5 }}>{lede}</p>}
      {children}
    </section>
  )
}

const Phone = ({ src, alt, className = '' }) => (
  <img src={`${V}/${src}.png`} alt={alt} loading="lazy" className={`sig-dim block h-auto w-full rounded-[22px] ${className}`} style={{ boxShadow: '0 2px 14px rgba(23,22,20,0.07)' }} />
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

        <figure data-case-hero className="track-wide mt-12 overflow-hidden rounded-2xl">
          <img src={`${V}/hero.jpg`} alt="Three screens from the feature: a lock-screen alert, the decision screen reading Backups work until 9:31, and a booked bike taxi" width={1536} height={1024} className="sig-light block h-auto w-full" />
          <img src={`${V}/hero-dark.jpg`} alt="" aria-hidden="true" width={1536} height={1024} className="sig-dark h-auto w-full" />
        </figure>

        <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-rule pt-7 sm:grid-cols-3">
          <div><dt className="text-ink mb-1">Who it’s for</dt><dd style={{ fontSize: '0.98rem' }}>Office commuters who take the same metro trip every day and can’t be late.</dd></div>
          <div><dt className="text-ink mb-1">The problem</dt><dd style={{ fontSize: '0.98rem' }}>When the line is delayed, they can’t tell how long they can wait before their other options stop working.</dd></div>
          <div><dt className="text-ink mb-1">What I made</dt><dd style={{ fontSize: '0.98rem' }}>A feature in DMRC’s app that turns a delay into one time: when the backups stop working.</dd></div>
        </dl>
        <p className="text-faint mt-6" style={{ fontSize: '0.9rem' }}>Solo, 14 weeks, M.Des at UPES. A student concept, not made with or for DMRC.</p>
      </section>

      {/* ---------- The problem ---------- */}
      <Section id="problem" title="The problem" lede="Trains run on time 99.95% of the time. Daily commuters still leave 34 minutes early, every day, in case today is the day they don’t.">
        <Disruptions />
        <Contrast />
        <div className="track-wide mt-16 grid items-center gap-10 md:grid-cols-2">
          <DailyLoop />
          <div className="space-y-3">
            <h3 className="subhead">The buffer is how riders cope with not knowing</h3>
            <p>Nobody tells them how long a delay will last, so they pay for it in advance, every morning. One bad day makes the next buffer bigger. Better information can only help at one moment: “wait or leave?”.</p>
          </div>
        </div>
        <h3 className="subhead mt-16">When the bad day comes: Ajeet’s exam</h3>
        <Journey />
        <p className="mt-6">He had other ways to get there. He didn’t know how long they would still work.</p>
      </Section>

      {/* ---------- What I found ---------- */}
      <Section id="found" title="What I found" lede="I’m not from Delhi. I learned from a few rides on visits to the city, seven interviews and fifty app reviews.">
        <div className="track-wide mt-10 grid items-center gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <figure>
            <img src={`${V}/metro-ride.jpg`} alt="Riders inside a Delhi Metro coach, faces blurred" loading="lazy" className="sig-dim block aspect-[4/5] w-full max-w-[320px] rounded-2xl object-cover" />
          </figure>
          <div className="space-y-4">
            <p className="text-ink" style={{ fontSize: '1.15rem' }}>Daily riders don’t follow the map. They ride on what they’ve learned: which train to let go, which exit to use, which stop to skip.</p>
            <p>Jasleen knows “the second train is emptier”. Satabdee moved house to avoid a change at Rajiv Chowk. On one of my rides, the regular among my friends skipped our stop to save time. I would have followed the map.</p>
          </div>
        </div>

        <div className="track-wide mt-16 grid gap-14 md:grid-cols-2">
          <div className="space-y-5">
            <h3 className="subhead">What seven commuters told me</h3>
            <Arcs />
          </div>
          <div className="space-y-5">
            <h3 className="subhead">What 50 app reviews complain about</h3>
            <ReviewBars />
          </div>
        </div>

        <h3 className="subhead mt-16">Five things she has during a delay, and one she doesn’t</h3>
        <div className="track-wide mt-6"><Orbit /></div>

        <Figure src="/signal/proof/synthesis-board.jpg" alt="FigJam synthesis board from the seven interviews" caption="Synthesis of the seven interviews." track="track-wide mt-12" />
      </Section>

      {/* ---------- What I tried first ---------- */}
      <Section id="tried" title="What I tried first" lede="Three directions before this one. Each ended at something I found.">
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
        <Figure src={`${V}/sketch-c1-three-states.jpg`} alt="Pencil sketch: the Signal Card in three states, the default, a pre-filled ride prompt, and searching for a driver" caption="The ride is pre-filled, never booked for her. That rule survived into this version." track="track-wide mt-6" />

        <h3 className="subhead mt-16">Crowding at the interchange</h3>
        <p>A crowdsourced app for the INA interchange. A lead designer at Blinkit called it unbacked, and the coach data behind it was one undated trial.</p>

        <h3 className="subhead mt-14">A better station to board from</h3>
        <p>I mapped every station and entrance and modelled walking times. On foot, almost nobody has a second station to choose from.</p>
        <Coverage />
      </Section>

      {/* ---------- The idea ---------- */}
      <Section id="idea" title="The idea" lede="Nobody can say how long a delay will last. What can be worked out is how long the other ways still get you there on time.">
        <Slack />
        <p className="text-ink mt-10 font-serif" style={{ fontSize: '1.7rem', lineHeight: 1.25 }}>deadline − the slowest likely backup − a 5 minute margin</p>
        <p className="mt-4">It uses the slowest end of every estimate, because Ajeet hit traffic. Here, an auto could take 54 minutes from the platform, so backups work until 9:31.</p>

        <div className="track-wide mt-14 grid items-start gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="space-y-4">
            <h3 className="subhead">It informs. She decides.</h3>
            <p>The screen says “Backups work until 9:31”, never “Switch by 9:31”. Leaving and waiting sit side by side, each with a plain status.</p>
          </div>
          <Phone src="s3-decision" alt="The decision screen: backups work until 9:31, leave now or keep waiting" className="mx-auto max-w-[300px]" />
        </div>

        <h3 className="subhead mt-16">What I chose, and what it cost</h3>
        <div className="mt-4"><Tradeoffs items={TRADEOFFS} /></div>
      </Section>

      {/* ---------- The screens ---------- */}
      <Section id="screens" title="The screens" lede="Built on DMRC’s own app, with its contrast fixed, so it reads as an update rather than a new app.">
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
          <div className="rounded-2xl px-10 pt-10" style={{ background: 'var(--sig-tint)' }}>
            <img src={`${V}/s3b-closure.png`} alt="Closure announced the night before: Rajiv Chowk exits closed tomorrow, nearest open exit Barakhamba Road" loading="lazy" className="sig-dim mx-auto block h-auto w-full max-w-[260px] rounded-t-[24px]" />
          </div>
          <div className="space-y-3">
            <h3 className="subhead">When the closure is known the night before</h3>
            <p>Most disruptions from July to October 2026 were planned security closures, announced the evening before. So the choice moves home: which exit is open, and when to leave.</p>
          </div>
        </div>
      </Section>

      {/* ---------- Stress test ---------- */}
      <Section id="stress" title="Stress test with Satabdee" lede="Satabdee rides an hour and a half each way, laptop open. I ran her daily commute through the screens, one morning at a time. It broke in seven places.">
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
        <p>A scenario test with daily commuters is running. Each rider lives the same delayed morning on their own trip twice: with today’s app, then with the new feature. Results will be added here.</p>
        <p className="mt-3"><a className="prose-link" href={TEST} target="_blank" rel="noreferrer">Try the test</a></p>
      </Section>

      {/* ---------- How it works ---------- */}
      <Section id="system" title="How it works" lede="No new data to start. Alerts, ride times and gates already exist inside DMRC and its partners.">
        <Figure src={`${V}/s7-system.png`} alt="System board: service alerts, the rider's deadline, ride times and gates feed one rule, which drives the home card, the decision and the backups sheet" track="track-wide mt-10" />
        <div className="track-wide mt-10 grid gap-8 sm:grid-cols-3">
          <div className="space-y-2"><div className="h-1 rounded-full" style={{ background: 'var(--sig-sky)' }} /><div className="text-ink">Now</div><p style={{ fontSize: '0.95rem' }}>Works with alerts, partner ride times and gates as they are.</p></div>
          <div className="space-y-2"><div className="h-1 rounded-full" style={{ background: 'var(--sig)' }} /><div className="text-ink">Needs DMRC</div><p style={{ fontSize: '0.95rem' }}>Alerts the moment they’re logged. A delay given as a time. No exit charge during a declared fault.</p></div>
          <div className="space-y-2"><div className="h-0" style={{ borderTop: '4px dashed var(--rule)' }} /><div className="text-ink">Later</div><p style={{ fontSize: '0.95rem' }}>Live gaps between trains, so “longer than usual” is measured.</p></div>
        </div>
      </Section>

      {/* ---------- Limits ---------- */}
      <Section id="limits" title="Limits">
        <h3 className="subhead mt-6">It’s only as fast as DMRC’s alerts</h3>
        <AlertSpeed />
        <p className="mt-8">With a tighter deadline, backups stop working before the alert arrives. That needs faster alerts from DMRC, not a better screen.</p>
        <div className="mt-10 grid gap-6 border-t border-rule pt-8 sm:grid-cols-2">
          <p><span className="text-ink">How often faults happen is unknown.</span> If they’re rare, the daily setup has to be very light to be worth it.</p>
          <p><span className="text-ink">It can’t see crowding.</span> It can’t tell her if the first train back is too full to board.</p>
          <p><span className="text-ink">One leg of the trip.</span> Not the bus before the metro or the auto after it.</p>
          <p><span className="text-ink">The exit-fare rule is unconfirmed.</span> The note on the backups sheet is placeholder copy.</p>
        </div>
      </Section>

      {/* ---------- What's next ---------- */}
      <Section id="next" title="What’s next" lede="The same idea for occasional riders, set from the QR booking flow, for people without a saved trip." />

      <footer className="mt-20 space-y-3 border-t border-rule pt-6 text-faint" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
        <p><span style={{ color: 'var(--sig-est)' }}>*</span> Times and percentages with an asterisk are simulated: the trip example, and walking coverage modelled on OpenStreetMap. They’re shown the way DMRC’s app shows estimates.</p>
        <p>
          Quotes and habits come from seven interviews. Review figures are my own count. Punctuality and disruptions:{' '}
          <a className="prose-link" href="https://www.tribuneindia.com/news/delhi/delhi-metro-records-99-95-train-punctuality-in-2026-dmrc/" target="_blank" rel="noreferrer">The Tribune</a>,{' '}
          <a className="prose-link" href="https://www.theweek.in/wire-updates/national/2025/09/01/des110-dl-dmrc-technical-snag.html" target="_blank" rel="noreferrer">The Week</a>,{' '}
          <a className="prose-link" href="https://www.etvbharat.com/amp/en/state/technical-snag-on-delhi-metro-blue-line-disrupts-services-enn26063006928" target="_blank" rel="noreferrer">ETV Bharat</a>. Last mile:{' '}
          <a className="prose-link" href="https://wri-india.org/sites/default/files/Improving%20metro%20access%20in%20India_%20Working%20Paper.pdf" target="_blank" rel="noreferrer">WRI India</a>.
        </p>
        <p>A student concept. Not made with or for DMRC.</p>
      </footer>
    </main>
  )
}
