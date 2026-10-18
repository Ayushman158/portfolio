'use client'

import { useState } from 'react'

/*
 * Limits, and the system change they point to. The redesign can only be as
 * early as DMRC's alerts, so the section lets the reader move the deadline and
 * the alert's delay, then shows the alert flow today next to the one proposed.
 * The model uses the example trip: quickest backup 54 min on a bad run, 5 min margin, fault
 * logged at 9:04. Everything it prints is simulated, so it carries the *.
 */

const SIG = 'var(--sig)'
const LATE = 'var(--sig-late)'
const BACKUP = 54, MARGIN = 5, FAULT = 4, AXIS = 60
const clock = (m) => `${9 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
const pct = (m) => `${Math.max(0, Math.min(AXIS, m)) / AXIS * 100}%`

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <label className="block">
      <span className="text-ink flex justify-between gap-3" style={{ fontSize: '0.95rem' }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-2 block w-full" style={{ accentColor: 'var(--sig)' }} />
    </label>
  )
}

/* Move the deadline and the alert's delay; see whether the backups outlast the alert. */
export function AlertWindow() {
  const [deadline, setDeadline] = useState(90)
  const [lag, setLag] = useState(0)
  const arrives = FAULT + lag
  const until = deadline - BACKUP - MARGIN
  const left = until - arrives
  const ok = left > 0
  const marks = [
    [FAULT, `Fault logged ${clock(FAULT)}`, 'var(--faint)', 'top'],
    [arrives, `Alert reaches the rider ${clock(arrives)}*`, 'var(--ink)', 'bottom'],
    [until, `Backups work until ${clock(until)}*`, ok ? SIG : LATE, 'top'],
  ]
  return (
    <figure className="track-wide mt-8 rounded-2xl p-5 sm:p-8" style={{ background: 'var(--raised)' }}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Slider label={<>Rider’s deadline <span>{clock(deadline)}</span></>} value={deadline} min={60} max={105} step={5} onChange={setDeadline} />
        <Slider label={<>Alert takes this long to reach them <span>{lag} min</span></>} value={lag} min={0} max={30} step={1} onChange={setLag} />
      </div>

      <div className="relative mt-12 h-20" aria-hidden="true">
        <div className="absolute inset-x-0 top-9 h-1.5 rounded-full" style={{ background: 'var(--rule)' }} />
        <div
          className="absolute top-9 h-1.5 rounded-full transition-all duration-300"
          style={ok
            ? { left: pct(arrives), width: `calc(${pct(until)} - ${pct(arrives)})`, background: SIG }
            : { left: pct(until), width: `calc(${pct(arrives)} - ${pct(until)})`, background: `repeating-linear-gradient(90deg, ${LATE} 0 6px, transparent 6px 10px)` }}
        />
        {marks.map(([m, t, c, side]) => (
          <div key={t.split(' ')[0]} className="absolute transition-all duration-300" style={{ left: pct(m), top: 0, bottom: 0 }}>
            <span className="absolute left-0 top-[30px] h-5 w-5 -translate-x-1/2 rounded-full" style={{ border: `4px solid ${c}`, background: 'var(--raised)' }} />
            <span className={`absolute whitespace-nowrap ${m === FAULT && t.startsWith('Fault') ? 'hidden sm:block' : ''}`} style={{ top: side === 'top' ? -8 : 58, left: 0, transform: m > AXIS * 0.6 ? 'translateX(-100%)' : m < AXIS * 0.15 ? 'translateX(-8px)' : 'translateX(-50%)', fontSize: '0.85rem', color: c }}>{t}</span>
          </div>
        ))}
      </div>
      <div className="text-faint flex justify-between" style={{ fontSize: '0.8rem' }}><span>9:00</span><span>10:00</span></div>

      <p className="mt-6 font-serif leading-tight" style={{ fontSize: '1.7rem', color: ok ? 'var(--ink)' : LATE }} aria-live="polite">
        {ok ? `${left} min to decide*` : 'The backups stopped working before the alert arrived*'}
      </p>
      <figcaption className="text-faint mt-2" style={{ fontSize: '0.88rem' }}>
        Simulated on the example trip: the quickest backup takes {BACKUP} min on a bad run, {MARGIN} min spare. With a tight deadline, even an instant alert leaves no time.
      </figcaption>
    </figure>
  )
}

/* How a fault reaches a rider today, one hand-off at a time. */
const TODAY = [
  ['Fault on the line', 'Logged in DMRC’s control room'],
  ['Posted on X', 'Often the first place it shows up'],
  ['Station display', 'A number, sometimes wrong'],
  ['App', 'A scrolling line of text, not tied to a trip'],
]

/* The proposal: one structured alert, sent everywhere at the moment it's logged. */
const FIELDS = ['Line and stretch', 'Logged at 9:04', 'Expected time, or “unknown”', 'Source']
const TARGETS = [
  ['Riders’ saved trips', 'Only riders whose trip uses the stretch', SIG],
  ['Station displays', 'The same words and time as the app', 'var(--line-yellow)'],
  ['Ride partners', 'Pickups ready at the open gates', 'var(--line-green)'],
]

export function AlertFlow() {
  return (
    <div className="track-wide mt-8 grid gap-10">
      <figure>
        <figcaption className="text-faint mb-4" style={{ fontSize: '0.9rem' }}>Today: one hand-off at a time</figcaption>
        <ol className="grid gap-0 md:grid-cols-4">
          {TODAY.map(([t, d], i) => (
            <li key={t} className="relative flex gap-4 pb-6 md:block md:pb-0 md:pr-6">
              <div className="flex shrink-0 flex-col items-center md:flex-row">
                <span className="h-4 w-4 shrink-0 rounded-full" style={{ border: '4px solid var(--sig-quiet)', background: 'var(--ground)' }} />
                {i < TODAY.length - 1 && <span className="w-1 flex-1 md:h-1 md:w-auto" style={{ background: 'var(--rule)' }} />}
              </div>
              <div className="md:mt-3">
                <div className="text-ink">{t}</div>
                <div style={{ fontSize: '0.9rem' }}>{d}</div>
              </div>
            </li>
          ))}
        </ol>
      </figure>

      <figure>
        <figcaption className="mb-4" style={{ fontSize: '0.9rem', color: SIG }}>Proposed: one alert, everywhere at once</figcaption>
        <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] md:gap-0">
          <div className="rounded-2xl p-5" style={{ background: 'var(--sig-tint)', border: `1.5px solid ${SIG}` }}>
            <div className="text-ink">The control room logs one alert</div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {FIELDS.map((f) => (
                <li key={f} className="rounded-full px-3 py-1" style={{ fontSize: '0.85rem', background: 'var(--ground)', color: 'var(--ink)' }}>{f}</li>
              ))}
            </ul>
          </div>
          <svg viewBox="0 0 72 180" preserveAspectRatio="none" className="hidden h-full w-full md:block" aria-hidden="true" fill="none" strokeWidth="3" strokeLinecap="round">
            {TARGETS.map(([, , c], i) => <path key={i} d={`M0 90 C36 90 36 ${30 + i * 60} 72 ${30 + i * 60}`} stroke={c} vectorEffect="non-scaling-stroke" />)}
          </svg>
          <div className="text-faint md:hidden" style={{ fontSize: '0.85rem' }}>sent at the same moment to</div>
          <ul className="grid gap-3">
            {TARGETS.map(([t, d, c]) => (
              <li key={t} className="flex gap-3 rounded-xl p-4" style={{ background: 'var(--raised)' }}>
                <span className="mt-1 h-auto w-[5px] shrink-0 rounded-full" style={{ background: c }} />
                <div><div className="text-ink">{t}</div><div style={{ fontSize: '0.9rem' }}>{d}</div></div>
              </li>
            ))}
          </ul>
        </div>
      </figure>
    </div>
  )
}

/* The rule as a system: what goes in, what's worked out, what the rider sees. */
const IN = [
  ['Service alerts', 'DMRC control room', 2],
  ['Your deadline', 'Set by the rider, once', 1],
  ['Ride and pickup times', 'Ride partners', 2],
  ['Gates and exits', 'DMRC station data', 2],
]
const WORK = ['Does the fault hit this trip?', 'Backups work until = deadline − quickest backup on a bad run − 5 min', 'Nearest open gate to the pickup']
const OUT = [['On time', 'Home card'], ['Backups work until 9:31', 'Decision screen'], ['Every backup, with its status', 'Backups sheet'], ['Closure ahead', 'The night before']]

export function SystemMap() {
  const box = 'rounded-xl px-4 py-3'
  const Col = ({ title, children }) => (
    <div className="min-w-0">
      <div className="text-faint mb-3" style={{ fontSize: '0.85rem' }}>{title}</div>
      <ul className="grid gap-2.5">{children}</ul>
    </div>
  )
  const Arrow = () => <span aria-hidden="true" className="text-faint hidden self-center md:block" style={{ fontSize: '1.4rem' }}>→</span>
  return (
    <figure className="track-wide mt-10 rounded-2xl p-5 sm:p-8" style={{ border: '1px solid var(--rule)' }}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.1fr)_auto_minmax(0,1fr)] md:gap-4">
        <Col title="In">
          {IN.map(([t, d, layer]) => (
            <li key={t} className={box} style={{ background: 'var(--raised)' }}>
              <div className="text-ink" style={{ fontSize: '0.95rem' }}>{t}</div>
              <div style={{ fontSize: '0.82rem' }}>{d}</div>
              <div className="mt-1" style={{ fontSize: '0.78rem', color: layer === 1 ? 'var(--sig)' : 'var(--sig-est)' }}>{layer === 1 ? 'Layer 1 · in the design' : 'Layer 2 · simulated in the prototype'}</div>
            </li>
          ))}
        </Col>
        <Arrow />
        <Col title="Worked out">
          {WORK.map((t) => (
            <li key={t} className={box} style={{ background: 'var(--sig-tint)', border: '1.5px solid var(--sig)', fontSize: '0.92rem', color: 'var(--ink)' }}>{t}</li>
          ))}
        </Col>
        <Arrow />
        <Col title="The rider sees">
          {OUT.map(([t, d]) => (
            <li key={t} className={box} style={{ border: '1px solid var(--rule)' }}>
              <div className="text-ink" style={{ fontSize: '0.95rem' }}>{t}</div>
              <div style={{ fontSize: '0.82rem' }}>{d}</div>
            </li>
          ))}
        </Col>
      </div>
    </figure>
  )
}
