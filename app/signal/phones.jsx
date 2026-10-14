'use client'

import { ORANGE } from './visuals'

/**
 * The refocused screens, drawn in code rather than exported from Figma, in the
 * prototype's own language: #F9F9F8 paper, Inter for answers, Geist Mono for
 * labels, orange only where a decision is being made.
 *
 * Each phone is a size container, so everything inside is set in cqw and the
 * screen scales as one picture, from a 15rem strip on a phone to a desktop row.
 * The phones are product UI, so they stay light in both site themes.
 */

const INK = '#111111'
const FAINT = '#6B6B6B'
const RULE = '#E4E4E1'
const PAPER = '#F9F9F8'
const GREEN = '#1F8A5B'
const AMBER = '#C27C00'
const SANS = 'var(--font-inter), Inter, system-ui, sans-serif'
const MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

const mono = { fontFamily: MONO, fontSize: '2.9cqw', letterSpacing: '0.14em', textTransform: 'uppercase' }

function Phone({ time, children }) {
  return (
    <div className="rounded-[1.9rem] p-[5px]" style={{ background: '#161616' }}>
      <div
        className="relative overflow-hidden rounded-[1.6rem]"
        style={{ aspectRatio: '390 / 844', background: PAPER, color: INK, fontFamily: SANS, containerType: 'inline-size' }}
      >
        {/* Status bar and island, as on the captured screens. */}
        <div className="flex items-center justify-between" style={{ padding: '5cqw 7cqw 0', fontSize: '4cqw', fontWeight: 600 }}>
          <span className="tnum">{time}</span>
          <span aria-hidden="true" style={{ width: '30cqw', height: '8cqw', borderRadius: 999, background: '#000' }} />
          <span aria-hidden="true" className="flex items-center" style={{ gap: '1.4cqw' }}>
            <span style={{ width: '5cqw', height: '3cqw', borderRadius: 1, background: INK, opacity: 0.85 }} />
            <span style={{ width: '6.5cqw', height: '3.2cqw', borderRadius: 3, border: `1.5px solid ${INK}` }} />
          </span>
        </div>
        <div className="flex items-center justify-between" style={{ padding: '6cqw 6cqw 0' }}>
          <span className="flex items-center" style={{ gap: '2cqw', fontSize: '4.4cqw', fontWeight: 500 }}>
            <span aria-hidden="true" style={{ color: ORANGE }}>◎</span> Signal
          </span>
        </div>
        <div style={{ padding: '5cqw 6cqw 0' }}>{children}</div>
        <div aria-hidden="true" className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '2.4cqw', width: '34cqw', height: '1.3cqw', borderRadius: 999, background: INK }} />
      </div>
    </div>
  )
}

/** How full a train usually is, as five bars. */
function Load({ n, color }) {
  return (
    <span aria-hidden="true" className="flex items-end" style={{ gap: '0.8cqw' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ width: '1.6cqw', height: `${2.2 + i * 0.7}cqw`, borderRadius: 1, background: i < n ? color : RULE }} />
      ))}
    </span>
  )
}

/** S5 — at INA: which train, which coach. */
function Interchange() {
  const trains = [
    ['9:16', 5, ORANGE, 'Usually packed', '6 couldn’t board'],
    ['9:19', 3, AMBER, 'Standing room', 'most get on'],
    ['9:22', 2, GREEN, 'Seats likely', ''],
  ]
  return (
    <Phone time="9:14">
      <p style={{ ...mono, color: FAINT }}>Changing at INA · to HUDA City Ctr</p>
      <p style={{ marginTop: '3cqw', fontSize: '9.5cqw', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.02, color: ORANGE }}>Let one go.</p>
      <p style={{ marginTop: '2.5cqw', fontSize: '3.9cqw', lineHeight: 1.4, color: FAINT }}>
        The 9:16 is usually full by INA. The 9:19 usually has room, and you’ll still be at your desk by 9:58.
      </p>
      <ul style={{ marginTop: '5cqw', borderTop: `1px solid ${RULE}` }}>
        {trains.map(([t, n, c, what, note], i) => (
          <li key={t} className="flex items-center justify-between" style={{ padding: '3.2cqw 0', borderBottom: `1px solid ${RULE}`, background: i === 1 ? '#fff' : 'transparent', margin: i === 1 ? '0 -2cqw' : 0, paddingInline: i === 1 ? '2cqw' : 0 }}>
            <span className="flex items-center" style={{ gap: '3cqw' }}>
              <span className="tnum" style={{ fontSize: '4.6cqw', fontWeight: 600, width: '11cqw' }}>{t}</span>
              <Load n={n} color={c} />
              <span style={{ fontSize: '3.8cqw', fontWeight: i === 1 ? 600 : 400 }}>{what}</span>
            </span>
            <span style={{ fontSize: '3.1cqw', color: FAINT }}>{note}</span>
          </li>
        ))}
      </ul>
      <p style={{ ...mono, color: FAINT, marginTop: '6cqw' }}>Stand at</p>
      <div className="flex" style={{ gap: '1cqw', marginTop: '2.4cqw' }} aria-label="Coach 7 of 8 is usually emptier. Coach 1 is for women.">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
          <span key={c} className="flex flex-1 items-center justify-center tnum" style={{ height: '9cqw', borderRadius: '1.4cqw', fontSize: '3.4cqw', fontWeight: c === 7 ? 700 : 400, background: c === 7 ? INK : '#fff', color: c === 7 ? '#fff' : c === 1 ? '#B0306B' : FAINT, border: `1px solid ${c === 7 ? INK : RULE}` }}>
            {c === 1 ? '♀' : c}
          </span>
        ))}
      </div>
      <p style={{ marginTop: '2.4cqw', fontSize: '3.5cqw', lineHeight: 1.4 }}>
        <b style={{ fontWeight: 600 }}>Coach 7.</b> <span style={{ color: FAINT }}>Usually the emptiest at this time.</span>
      </p>
      <p style={{ ...mono, fontSize: '2.6cqw', color: FAINT, marginTop: '6cqw', lineHeight: 1.6 }}>From 14 riders, last 20 min<br />and 4 weeks of Tuesdays</p>
    </Phone>
  )
}

/** S6 — the exit: the last mile before you reach the gate. */
function Exit() {
  const ways = [
    ['Shared auto to Cyber City', 'About 5 waiting · leaves when full, in 2–4 min', 'Best now', true],
    ['Rapido', 'Surge likely until 10:05', 'Set up ↗', false],
    ['Walk', '22 min · covered for the first half', '', false],
  ]
  return (
    <Phone time="9:49">
      <p style={{ ...mono, color: FAINT }}>Next stop · HUDA City Centre</p>
      <p style={{ marginTop: '3cqw', fontSize: '9.5cqw', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.02, color: ORANGE }}>Shared auto.</p>
      <p style={{ marginTop: '2.5cqw', fontSize: '3.9cqw', lineHeight: 1.4, color: FAINT }}>
        Gate 2, pillar 12. The queue is short right now, and Rapido is on surge for the next 15 minutes.
      </p>
      <ul style={{ marginTop: '5cqw' }}>
        {ways.map(([name, detail, tag, best]) => (
          <li key={name} style={{ marginTop: '2.4cqw', padding: '3.4cqw 3.6cqw', borderRadius: '3cqw', background: best ? '#fff' : 'transparent', border: `1px solid ${best ? INK : RULE}` }}>
            <div className="flex items-baseline justify-between" style={{ gap: '2cqw' }}>
              <span style={{ fontSize: '4.2cqw', fontWeight: best ? 600 : 500 }}>{name}</span>
              {tag && <span style={{ ...mono, fontSize: '2.6cqw', color: best ? GREEN : ORANGE, whiteSpace: 'nowrap' }}>{tag}</span>}
            </div>
            <p style={{ marginTop: '1.2cqw', fontSize: '3.3cqw', lineHeight: 1.4, color: FAINT }}>{detail}</p>
          </li>
        ))}
      </ul>
      <p style={{ ...mono, fontSize: '2.6cqw', color: FAINT, marginTop: '6cqw', lineHeight: 1.6 }}>Queue from 9 riders, last 15 min<br />Rapido from its own estimate</p>
    </Phone>
  )
}

/** S7 — the report that feeds the next rider. Two taps, then gone. */
function Report() {
  const opts = [
    ['Seats free', GREEN],
    ['Standing, but fine', AMBER],
    ['Packed', ORANGE],
  ]
  return (
    <Phone time="9:20">
      <p style={{ ...mono, color: FAINT }}>On the 9:19 · coach 7</p>
      <p style={{ marginTop: '3cqw', fontSize: '8.4cqw', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>How full is it?</p>
      <p style={{ marginTop: '2.5cqw', fontSize: '3.9cqw', lineHeight: 1.4, color: FAINT }}>
        One tap. It tells the riders behind you at INA what to expect.
      </p>
      <div className="grid" style={{ gap: '2.6cqw', marginTop: '6cqw' }}>
        {opts.map(([o, c]) => (
          <span key={o} className="flex items-center" style={{ gap: '3cqw', padding: '4.4cqw 4cqw', borderRadius: '3cqw', background: '#fff', border: `1px solid ${RULE}`, fontSize: '4.4cqw', fontWeight: 500 }}>
            <span aria-hidden="true" style={{ width: '3cqw', height: '3cqw', borderRadius: 999, background: c }} />{o}
          </span>
        ))}
        <span style={{ padding: '3.6cqw 4cqw', fontSize: '3.8cqw', color: FAINT, borderRadius: '3cqw', border: `1px dashed ${RULE}` }}>I couldn’t get on</span>
      </div>
      <p style={{ marginTop: '6cqw', fontSize: '3.4cqw', lineHeight: 1.45, color: FAINT }}>
        Reports fade after 20 minutes, and one report on its own never changes the answer.
      </p>
      <p style={{ marginTop: '4cqw', fontSize: '3.6cqw', textAlign: 'center', color: FAINT }}>Not now</p>
    </Phone>
  )
}

const SCREENS = [
  [Interchange, 'At INA: which train to board, and which coach to stand at.'],
  [Exit, 'Before the exit: the shared-auto queue, Rapido’s surge, or the walk.'],
  [Report, 'The two-tap report that feeds the riders behind you.'],
]

export function RefocusScreens() {
  return (
    <div className="track-wide -mb-2 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:overflow-visible">
      {SCREENS.map(([Screen, caption]) => (
        <figure key={caption} className="w-[66vw] max-w-[16rem] shrink-0 snap-start sm:w-auto sm:max-w-none">
          <div role="img" aria-label={caption}><Screen /></div>
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}
