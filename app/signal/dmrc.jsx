'use client'

import { ORANGE } from './visuals'

/**
 * Signal as a feature of DMRC's own app, drawn in DMRC's language rather than
 * Signal's: its blue, white cards on a cool grey, line colours as chips. Signal
 * keeps one thing of its own, the orange, and only where a decision is made.
 *
 * The real app was studied from its App Store listing (October 2026): a
 * ticketing home with a scrolling service-alert ticker, an amenities grid,
 * a journey planner with fares, bike-taxi legs and a "Select Gate" picker.
 * Nothing here copies its artwork or logo; the mark is a plain ring.
 *
 * Every phone is a size container, so the whole screen is set in cqw and
 * scales as one picture. Product UI stays light in both site themes.
 */

const BLUE = '#1C9BEF'
const INK = '#16202A'
const FAINT = '#66717C'
const RULE = '#E2E8EE'
const BG = '#F3F6F9'
const GREEN = '#1F8A5B'
const AMBER = '#C27C00'
const PINK = '#E2007A'
const YELLOW = '#F2C200'
const SANS = 'var(--font-inter), Inter, system-ui, sans-serif'
const MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

const mono = { fontFamily: MONO, fontSize: '2.7cqw', letterSpacing: '0.12em', textTransform: 'uppercase' }
const card = { background: '#fff', border: `1px solid ${RULE}`, borderRadius: '3.4cqw' }

function Mark() {
  return <span aria-hidden="true" style={{ width: '7cqw', height: '7cqw', borderRadius: 999, border: '1.6cqw solid #D3202A', display: 'inline-block', flex: 'none' }} />
}

function Line({ c, children }) {
  return <span style={{ fontSize: '2.6cqw', fontWeight: 600, padding: '0.6cqw 1.8cqw', borderRadius: 999, background: c, color: c === YELLOW ? INK : '#fff' }}>{children}</span>
}

function Load({ n, color }) {
  return (
    <span aria-hidden="true" className="flex items-end" style={{ gap: '0.7cqw' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ width: '1.5cqw', height: `${2 + i * 0.65}cqw`, borderRadius: 1, background: i < n ? color : RULE }} />
      ))}
    </span>
  )
}

function Phone({ time, tab = 'home', children }) {
  return (
    <div className="rounded-[1.9rem] p-[5px]" style={{ background: '#161616' }}>
      <div className="relative overflow-hidden rounded-[1.6rem]" style={{ aspectRatio: '390 / 844', background: BG, color: INK, fontFamily: SANS, containerType: 'inline-size' }}>
        <div className="flex items-center justify-between" style={{ padding: '5cqw 7cqw 0', fontSize: '4cqw', fontWeight: 600 }}>
          <span className="tnum">{time}</span>
          <span aria-hidden="true" style={{ width: '30cqw', height: '8cqw', borderRadius: 999, background: '#000' }} />
          <span aria-hidden="true" style={{ width: '12cqw' }} />
        </div>
        <div style={{ padding: '4cqw 5cqw 0' }}>{children}</div>
        {/* DMRC's bottom bar, with Signal given a tab of its own. */}
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-4" style={{ background: '#fff', borderTop: `1px solid ${RULE}`, padding: '2.4cqw 0 6cqw' }}>
          {[['home', '⌂', 'Home'], ['signal', '◎', 'Signal'], ['tickets', '▭', 'Tickets'], ['you', '○', 'Profile']].map(([k, g, l]) => (
            <span key={k} className="flex flex-col items-center" style={{ gap: '0.6cqw', fontSize: '2.7cqw', color: k === tab ? (k === 'signal' ? ORANGE : BLUE) : FAINT, fontWeight: k === tab ? 600 : 400 }}>
              <span aria-hidden="true" style={{ fontSize: '4.6cqw', lineHeight: 1 }}>{g}</span>{l}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* 1 — Home. The ticker becomes one line about your line; the trip comes first. */
function Home() {
  return (
    <Phone time="8:10" tab="home">
      <div className="flex items-center" style={{ gap: '2.4cqw' }}>
        <Mark />
        <span style={{ fontSize: '3.4cqw', lineHeight: 1.25 }}><span style={{ color: FAINT }}>Good morning,</span><br /><b style={{ fontWeight: 600 }}>Jasleen</b></span>
      </div>
      <div style={{ ...card, marginTop: '4cqw', overflow: 'hidden' }}>
        <div style={{ height: '1.2cqw', background: ORANGE }} />
        <div style={{ padding: '3.6cqw 4cqw' }}>
          <p style={{ ...mono, color: ORANGE }}>Signal · your trip today</p>
          <p style={{ marginTop: '1.6cqw', fontSize: '7.6cqw', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>Leave by 8:28</p>
          <p className="flex flex-wrap items-center" style={{ marginTop: '2.4cqw', gap: '1.4cqw', fontSize: '3.2cqw', color: FAINT }}>
            <Line c={PINK}>Pink</Line> to INA, then <Line c={YELLOW}>Yellow</Line>
          </p>
          <p style={{ marginTop: '2cqw', fontSize: '3.4cqw' }}>At INA the 9:16 is usually full. <b style={{ fontWeight: 600 }}>Plan on the 9:19.</b></p>
        </div>
      </div>
      <div className="flex items-center justify-between" style={{ ...card, marginTop: '2.6cqw', padding: '3cqw 4cqw' }}>
        <span style={{ fontSize: '3.4cqw' }}><span aria-hidden="true" style={{ color: GREEN }}>●</span> Yellow Line running normally</span>
        <span style={{ fontSize: '3cqw', color: BLUE }}>All lines</span>
      </div>
      <div className="flex items-center justify-between" style={{ ...card, marginTop: '2.6cqw', padding: '3.4cqw 4cqw' }}>
        <span style={{ fontSize: '3.2cqw', lineHeight: 1.35 }}><b style={{ fontWeight: 600 }}>QR ticket ready</b><br /><span style={{ color: FAINT }}>Rajouri Garden → Millennium City Ctr</span></span>
        <span style={{ fontSize: '3.2cqw', fontWeight: 600, color: '#fff', background: BLUE, padding: '2cqw 3.4cqw', borderRadius: '2cqw' }}>Show QR</span>
      </div>
      <div className="grid grid-cols-4" style={{ ...card, marginTop: '2.6cqw', padding: '3.6cqw 2cqw' }}>
        {['Locker', 'Bike taxi', 'Timings', 'Map'].map((a) => (
          <span key={a} className="flex flex-col items-center" style={{ gap: '1.4cqw', fontSize: '2.8cqw', color: FAINT }}>
            <span aria-hidden="true" style={{ width: '9cqw', height: '9cqw', borderRadius: '2.4cqw', border: `1px solid ${RULE}`, background: BG }} />{a}
          </span>
        ))}
      </div>
    </Phone>
  )
}

/* 2 — The journey, with the interchange and the gate decided for you. */
function Plan() {
  const legs = [
    ['8:28', 'Leave home', 'Walk 9 min', null, null],
    ['8:37', 'Rajouri Garden', 'Usually standing room', PINK, 3],
    ['9:14', 'INA · change', 'Skip the 9:16. Take the 9:19, coach 7', ORANGE, 5],
    ['9:50', 'Millennium City Ctr', 'Exit Gate 2, for shared autos', YELLOW, null],
    ['10:02', 'Office', 'Shared auto, about 8 min', null, null],
  ]
  return (
    <Phone time="8:12" tab="signal">
      <p style={{ fontSize: '4.4cqw', fontWeight: 600 }}>Your trip</p>
      <p style={{ fontSize: '3.2cqw', color: FAINT, marginTop: '0.8cqw' }}>Be at your desk by 10:05</p>
      <ol style={{ ...card, marginTop: '3.4cqw', padding: '2cqw 4cqw' }}>
        {legs.map(([t, place, note, c, load], i) => (
          <li key={t} className="grid" style={{ gridTemplateColumns: '11cqw 4cqw 1fr', gap: '2cqw', padding: '2.6cqw 0' }}>
            <span className="tnum" style={{ fontSize: '3.4cqw', fontWeight: 600, color: c === ORANGE ? ORANGE : INK }}>{t}</span>
            <span className="relative flex justify-center" aria-hidden="true">
              <span style={{ width: '2.6cqw', height: '2.6cqw', marginTop: '0.6cqw', borderRadius: 999, background: c || '#fff', border: `0.6cqw solid ${c || FAINT}` }} />
              {i < legs.length - 1 && <span className="absolute" style={{ top: '3.8cqw', bottom: '-3.4cqw', width: '0.5cqw', background: RULE }} />}
            </span>
            <span>
              <span className="flex items-center justify-between" style={{ gap: '2cqw' }}>
                <span style={{ fontSize: '3.6cqw', fontWeight: 600 }}>{place}</span>
                {load && <Load n={load} color={load >= 5 ? ORANGE : AMBER} />}
              </span>
              <span className="block" style={{ fontSize: '3cqw', lineHeight: 1.4, marginTop: '0.6cqw', color: c === ORANGE ? INK : FAINT, fontWeight: c === ORANGE ? 500 : 400 }}>{note}</span>
            </span>
          </li>
        ))}
      </ol>
      <span className="block text-center" style={{ marginTop: '3.4cqw', fontSize: '3.6cqw', fontWeight: 600, color: '#fff', background: BLUE, padding: '3.4cqw', borderRadius: '2.4cqw' }}>Book QR ticket</span>
    </Phone>
  )
}

/* 3 — On the train, approaching INA. */
function Interchange() {
  const trains = [
    ['9:16', 5, ORANGE, 'Full', '6 couldn’t board'],
    ['9:19', 3, AMBER, 'Room at the back', ''],
    ['9:22', 2, GREEN, 'Seats likely', ''],
  ]
  return (
    <Phone time="9:13" tab="signal">
      <div className="flex items-center justify-between" style={{ fontSize: '3cqw', color: '#fff', background: BLUE, padding: '2cqw 3.4cqw', borderRadius: '2.4cqw' }}>
        <span>On your trip</span><span>INA in 2 min</span>
      </div>
      <p style={{ marginTop: '4cqw', fontSize: '9.4cqw', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: ORANGE }}>Let one go.</p>
      <p style={{ marginTop: '2cqw', fontSize: '3.6cqw', lineHeight: 1.4, color: FAINT }}>The 9:19 has room, and you’ll still be in by 10:05.</p>
      <ul style={{ ...card, marginTop: '3.6cqw', padding: '0 4cqw' }}>
        {trains.map(([t, n, c, what, note], i) => (
          <li key={t} className="flex items-center justify-between" style={{ padding: '2.8cqw 0', borderTop: i ? `1px solid ${RULE}` : 0 }}>
            <span className="flex items-center" style={{ gap: '2.6cqw' }}>
              <span className="tnum" style={{ fontSize: '4.2cqw', fontWeight: 600, width: '10cqw' }}>{t}</span>
              <Load n={n} color={c} />
              <span style={{ fontSize: '3.4cqw', fontWeight: i === 1 ? 600 : 400 }}>{what}</span>
            </span>
            <span style={{ fontSize: '2.8cqw', color: FAINT }}>{note}</span>
          </li>
        ))}
      </ul>
      <p style={{ ...mono, color: FAINT, marginTop: '4cqw' }}>Stand at coach 7</p>
      <div className="flex" style={{ gap: '1cqw', marginTop: '2cqw' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
          <span key={c} className="flex flex-1 items-center justify-center tnum" style={{ height: '8cqw', borderRadius: '1.4cqw', fontSize: '3.2cqw', fontWeight: c === 7 ? 700 : 400, background: c === 7 ? INK : '#fff', color: c === 7 ? '#fff' : c === 1 ? '#B0306B' : FAINT, border: `1px solid ${c === 7 ? INK : RULE}` }}>
            {c === 1 ? '♀' : c}
          </span>
        ))}
      </div>
      <p style={{ ...mono, fontSize: '2.4cqw', color: FAINT, marginTop: '3cqw' }}>Live from the coach sensors</p>
    </Phone>
  )
}

/* 4 — Through the gate: the exit confirmed, then the last mile. */
function Exit() {
  const ways = [
    ['Shared auto to Cyber City', 'Pillar 12 · about 5 waiting · leaves when full', 'Best now', GREEN],
    ['Bike taxi', 'Book here · surge until 10:05', 'Surge', ORANGE],
    ['Walk', '22 min', '', null],
  ]
  return (
    <Phone time="9:52" tab="signal">
      {/* The fix for the app's most common complaint: say the exit registered. */}
      <div className="flex items-center" style={{ gap: '2cqw', fontSize: '3.2cqw', color: GREEN, background: '#E6F3EC', padding: '2.4cqw 3.4cqw', borderRadius: '2.4cqw' }}>
        <span aria-hidden="true">✓</span> Exit registered · 9:51 · Gate 2
      </div>
      <p style={{ marginTop: '4cqw', fontSize: '9.4cqw', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: ORANGE }}>Shared auto.</p>
      <p style={{ marginTop: '2cqw', fontSize: '3.6cqw', lineHeight: 1.4, color: FAINT }}>Turn left out of Gate 2. The queue at pillar 12 is short right now.</p>
      <ul style={{ marginTop: '3cqw' }}>
        {ways.map(([name, detail, tag, c], i) => (
          <li key={name} style={{ ...card, marginTop: '2.2cqw', padding: '3.2cqw 3.6cqw', borderColor: i === 0 ? INK : RULE }}>
            <div className="flex items-baseline justify-between">
              <span style={{ fontSize: '3.8cqw', fontWeight: i === 0 ? 600 : 500 }}>{name}</span>
              {tag && <span style={{ ...mono, fontSize: '2.4cqw', color: c }}>{tag}</span>}
            </div>
            <p style={{ marginTop: '1cqw', fontSize: '3cqw', color: FAINT }}>{detail}</p>
          </li>
        ))}
      </ul>
      <p style={{ ...mono, fontSize: '2.4cqw', color: FAINT, marginTop: '3cqw', lineHeight: 1.6 }}>Queue from 9 riders, last 15 min</p>
    </Phone>
  )
}

const FLOW = [
  [Home, '01 · Home', 'The trip comes first. The scrolling ticker becomes one line about your line.'],
  [Plan, '02 · Your trip', 'The interchange and the exit gate are planned before you leave.'],
  [Interchange, '03 · Near INA', 'Which train, which coach, live from the coach sensors.'],
  [Exit, '04 · Through the gate', 'The exit is confirmed, then the fastest way to the office.'],
]

export function DmrcFlow() {
  return (
    <div className="track-full -mb-2 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
      {FLOW.map(([Screen, step, caption]) => (
        <figure key={step} className="w-[64vw] max-w-[15rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
          <div role="img" aria-label={`${step}: ${caption}`}><Screen /></div>
          <figcaption className="mt-3" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
            <span className="tnum block" style={{ color: 'var(--ink)' }}>{step}</span>
            <span className="text-faint">{caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/**
 * The app as it is, as a wireframe with what I'd change. Drawn, not
 * screenshotted: its structure is the point, not its artwork.
 */
const TODAY = [
  ['Alerts scroll past in a ticker', 'Hard to read, and never about your trip.', 6.4],
  ['Ticketing comes first', 'Origin, destination, a QR. Nothing about the journey itself.', 22],
  ['Amenities and offers', 'Lockers, timings, a bike-taxi banner. The last mile is a booking, not a choice.', 66],
]

export function DmrcToday() {
  return (
    <figure className="track-wide grid items-center gap-8 sm:grid-cols-[minmax(0,15rem)_1fr]">
      <div className="relative mx-auto w-full max-w-[15rem] rounded-[1.9rem] p-[5px]" style={{ background: '#161616' }} aria-hidden="true">
        <div className="relative overflow-hidden rounded-[1.6rem]" style={{ aspectRatio: '390 / 844', background: BG, containerType: 'inline-size' }}>
          <div style={{ height: '16cqw' }} />
          <div style={{ height: '6cqw', background: YELLOW, opacity: 0.85 }} />
          <div style={{ ...card, margin: '4cqw 5cqw 0', height: '56cqw', padding: '4cqw' }}>
            {[70, 100, 100, 60].map((w, i) => <div key={i} style={{ width: `${w}%`, height: '6cqw', borderRadius: '1.4cqw', background: i === 3 ? '#CFE7F8' : BG, marginTop: i ? '4cqw' : 0 }} />)}
          </div>
          <div style={{ ...card, margin: '3cqw 5cqw 0', height: '14cqw' }} />
          <div className="grid grid-cols-4" style={{ ...card, margin: '3cqw 5cqw 0', padding: '4cqw 3cqw', gap: '3cqw' }}>
            {[0, 1, 2, 3].map((i) => <span key={i} style={{ aspectRatio: '1', borderRadius: '2.4cqw', background: BG }} />)}
          </div>
          <div style={{ margin: '3cqw 5cqw 0', height: '26cqw', borderRadius: '3cqw', background: '#CFE7F8' }} />
          {TODAY.map(([, , top], i) => (
            <span key={i} className="absolute flex items-center justify-center tnum" style={{ right: '3cqw', top: `${top}%`, width: '8cqw', height: '8cqw', borderRadius: 999, background: ORANGE, color: '#fff', fontSize: '4cqw', fontWeight: 700 }}>{i + 1}</span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-faint" style={{ fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>DMRC’s app today · 2.4 on the App Store</p>
        <ol className="mt-4 space-y-4 p-0">
          {TODAY.map(([title, body], i) => (
            <li key={title} className="flex list-none gap-3">
              <span className="flex flex-none items-center justify-center tnum" style={{ width: 22, height: 22, borderRadius: 999, background: ORANGE, color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{i + 1}</span>
              <span><span style={{ color: 'var(--ink)' }}>{title}</span><span className="text-faint block" style={{ fontSize: '0.9rem' }}>{body}</span></span>
            </li>
          ))}
          <li className="flex list-none gap-3">
            <span className="flex flex-none items-center justify-center" style={{ width: 22, height: 22, borderRadius: 999, border: '1.5px solid var(--rule)', fontSize: '0.75rem' }}>★</span>
            <span><span style={{ color: 'var(--ink)' }}>What reviewers complain about</span><span className="text-faint block" style={{ fontSize: '0.9rem' }}>The gate opens but the exit isn’t registered, and the next entry is fined ₹60 for overstaying. Nothing tells you it happened.</span></span>
          </li>
        </ol>
      </div>
    </figure>
  )
}
