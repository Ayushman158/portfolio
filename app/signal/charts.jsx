/*
 * Signal's diagrams. Minimal on purpose: hairlines, one light blue, and colour
 * only where it means something (the journey, Signal's answer, a delay, an
 * estimate). Every colour reads from the site's tokens, so dark mode holds.
 * Times marked * are the simulated example; the rest are interviews, press or
 * my own counts, named in the footnote at the end of the page.
 */

const SKY = 'var(--sig-line)'
const SIG = 'var(--sig)'
const LATE = 'var(--sig-late)'
const EST = 'var(--sig-est)'

/* Three disruptions, as plain rows. */
export function Disruptions() {
  const rows = [
    ['Yellow Line: third technical snag in one week', '2025'],
    ['Blue Line: overhead wire failure stops services', 'June 2026'],
    ['45 of 303 stations closed for security', '10 Oct 2026'],
  ]
  return (
    <ul className="track-wide mt-8">
      {rows.map(([t, d]) => (
        <li key={t} className="flex items-center gap-3 py-3.5" style={{ borderBottom: '1px solid var(--rule)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--ink)', flexShrink: 0 }}>
            <path d="M12 3.5l9.5 16.5h-19z" /><path d="M12 10v4.5M12 17.2v.3" />
          </svg>
          <span style={{ color: 'var(--ink)' }}>{t}</span>
          <span className="text-faint ml-auto shrink-0" style={{ fontSize: '0.9rem' }}>{d}</span>
        </li>
      ))}
    </ul>
  )
}

/* The two numbers the problem rests on. */
export function Contrast() {
  return (
    <figure className="track-wide mt-10 grid gap-8 rounded-2xl p-8 sm:grid-cols-2 sm:p-10" style={{ background: 'var(--sig-panel)', color: 'var(--sig-panel-ink)', border: '1px solid var(--rule)' }}>
      <div>
        <div className="font-serif leading-none" style={{ fontSize: 'clamp(4rem, 3rem + 4vw, 6.5rem)', letterSpacing: '-0.03em' }}>99.95%</div>
        <p className="mt-3" style={{ color: 'inherit', opacity: 0.75 }}>of trains ran on time in 2026</p>
      </div>
      <div>
        <div className="font-serif leading-none" style={{ fontSize: 'clamp(4rem, 3rem + 4vw, 6.5rem)', letterSpacing: '-0.03em', color: 'var(--sig-panel-accent)' }}>34 min</div>
        <p className="mt-3" style={{ color: 'inherit', opacity: 0.75 }}>of buffer riders add, every day</p>
      </div>
    </figure>
  )
}

/* The buffer loop: leave early, delay, wait or leave, add more buffer. */
export function DailyLoop() {
  const nodes = [
    [250, 62, 'Leave early'], [420, 160, 'Ride the metro'], [420, 340, 'A delay, no time given'],
    [250, 438, 'Wait or leave?'], [80, 340, 'Arrive late, or too early'], [80, 160, 'Add more buffer'],
  ]
  return (
    <svg viewBox="-40 0 580 500" className="mx-auto block w-full max-w-[480px]" role="img" aria-label="A loop: leave early with a buffer, ride the metro, a delay with no time given, wait or leave, arrive late or far too early, add more buffer tomorrow">
      <circle cx="250" cy="250" r="188" fill="none" stroke={SKY} strokeWidth="5" strokeDasharray="10 10" />
      <text x="250" y="246" textAnchor="middle" style={{ font: '400 48px var(--font-serif), serif', fill: 'var(--ink)' }}>34 min</text>
      <text x="250" y="276" textAnchor="middle" style={{ font: '400 14px var(--font-sans), sans-serif', fill: 'var(--faint)' }}>a day, spent on a bad day</text>
      {nodes.map(([x, y, t], i) => {
        const key = i === 3
        const late = i === 2
        const w = Math.max(110, t.length * 7.4 + 24)
        return (
          <g key={t}>
            <rect x={x - w / 2} y={y - 18} width={w} height="36" rx="18" fill={key ? SIG : 'var(--ground)'} stroke={key ? 'none' : late ? LATE : 'var(--rule)'} strokeWidth={late ? 2 : 1} />
            <text x={x} y={y + 5} textAnchor="middle" style={{ font: `${key ? 600 : 400} 14px var(--font-sans), sans-serif`, fill: key ? 'var(--ground)' : 'var(--ink)' }}>{t}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* Ajeet's exam morning, as a journey line. */
export function Journey() {
  const stops = [
    ['Bus to the metro', SKY, 'solid'],
    ['Display says 6 min', SKY, 'dashed'],
    ['Waits 20–25 min', LATE, 'grey'],
    ['Books a Rapido', 'var(--faint)', 'grey'],
    ['Stuck in traffic', 'var(--faint)', 'late'],
    ['15 min late and turned away', LATE, 'end'],
  ]
  return (
    <div className="track-wide mt-8 overflow-x-auto pb-2">
      <ol className="grid min-w-[720px] grid-cols-6">
        {stops.map(([t, ring, seg], i) => (
          <li key={t} className="flex flex-col gap-3">
            <div className="flex items-center">
              {seg === 'end'
                ? <span style={{ width: 18, height: 18, background: LATE, flexShrink: 0 }} />
                : <span style={{ width: 18, height: 18, borderRadius: '50%', border: `4px solid ${ring}`, background: 'var(--ground)', flexShrink: 0 }} />}
              {seg === 'solid' && <span style={{ flex: 1, height: 4, background: SKY }} />}
              {seg === 'dashed' && <span style={{ flex: 1, borderTop: `4px dashed ${LATE}` }} />}
              {seg === 'grey' && <span style={{ flex: 1, height: 4, background: 'var(--rule)' }} />}
              {seg === 'late' && <span style={{ flex: 1, height: 4, background: LATE }} />}
            </div>
            <span className="pr-3 leading-snug" style={{ color: i === 5 ? LATE : 'var(--ink)', fontSize: '0.95rem' }}>{t}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* What seven commuters told me, as concentric arcs. */
export function Arcs() {
  const arcs = [
    [200, 1, '7 of 7', 'add a buffer every day', SIG],
    [165, 4 / 7, '4 of 7', 'struggle with the last mile', '#3B97D6'],
    [130, 4 / 7, '4 of 7', 'pick routes for safety', '#7CCBF5'],
    [95, 2 / 7, '2 of 7', 'moved or switched stations', 'var(--sig-sky)'],
  ]
  return (
    <figure className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_200px]">
      <svg viewBox="0 0 420 240" className="block w-full" role="img" aria-label="Seven of seven add a buffer; four of seven struggle with the last mile; four pick routes for safety; two moved or switched stations">
        {arcs.map(([r, p, , , c]) => {
          const d = `M${210 - r} 230 A${r} ${r} 0 0 1 ${210 + r} 230`
          const len = Math.PI * r
          return (
            <g key={r} fill="none" strokeWidth="24">
              <path d={d} stroke="var(--rule)" strokeOpacity="0.45" />
              <path d={d} stroke={c} strokeDasharray={`${len * p} ${len}`} />
            </g>
          )
        })}
      </svg>
      <dl className="space-y-3">
        {arcs.map(([r, , n, t]) => (
          <div key={r}>
            <dt className="font-serif leading-none" style={{ fontSize: '1.6rem', color: 'var(--ink)' }}>{n}</dt>
            <dd className="text-faint" style={{ fontSize: '0.92rem' }}>{t}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}

/* What 50 recent app reviews complain about. */
export function ReviewBars() {
  const rows = [['Gate failure or wrong fare', 46, SIG], ['Crashes and bugs', 22, '#3B97D6'], ['Clutter and pop-ups', 16, '#7CCBF5'], ['Made me late', 12, LATE]]
  return (
    <figure className="space-y-3">
      {rows.map(([t, v, c]) => (
        <div key={t}>
          <div className="flex justify-between" style={{ fontSize: '0.95rem' }}><span>{t}</span><span style={{ color: 'var(--ink)' }}>{v}%</span></div>
          <div className="mt-1 h-2.5 rounded-full" style={{ background: 'var(--raised)' }}>
            <div className="h-2.5 rounded-full" style={{ width: `${v * 2}%`, background: c }} />
          </div>
        </div>
      ))}
      <figcaption className="text-faint pt-1" style={{ fontSize: '0.85rem' }}>My coding of the 50 most recent iOS reviews, May to October 2026.</figcaption>
    </figure>
  )
}

/* Five things she has during a delay, and the one she doesn't. */
export function Orbit() {
  const nodes = [
    [300, 62, 'What she knows'], [500, 180, 'What DMRC knows'], [500, 400, 'The backups'],
    [100, 400, 'Cost of leaving'], [100, 180, 'Her deadline'],
  ]
  return (
    <svg viewBox="0 0 600 560" className="mx-auto block w-full max-w-[560px]" role="img" aria-label="Around the decision to wait or leave: what she knows, what DMRC knows, the backups, the cost of leaving, her deadline, and time, the one thing nothing shows her">
      <circle cx="300" cy="280" r="215" fill="none" stroke="var(--rule)" strokeWidth="1.5" />
      <circle cx="300" cy="280" r="96" fill="var(--sig-panel)" stroke="var(--rule)" />
      <text x="300" y="274" textAnchor="middle" style={{ font: '400 30px var(--font-serif), serif', fill: 'var(--sig-panel-ink)' }}>Wait or</text>
      <text x="300" y="306" textAnchor="middle" style={{ font: '400 30px var(--font-serif), serif', fill: 'var(--sig-panel-ink)' }}>leave?</text>
      {nodes.map(([x, y, t]) => {
        const w = t.length * 8 + 32
        return (
          <g key={t}>
            <rect x={x - w / 2} y={y - 19} width={w} height="38" rx="19" fill="var(--ground)" stroke="var(--rule)" />
            <text x={x} y={y + 5} textAnchor="middle" style={{ font: '400 15px var(--font-sans), sans-serif', fill: 'var(--ink)' }}>{t}</text>
          </g>
        )
      })}
      <rect x="208" y="476" width="184" height="40" rx="20" fill={SIG} />
      <text x="300" y="501" textAnchor="middle" style={{ font: '600 15px var(--font-sans), sans-serif', fill: 'var(--ground)' }}>Time, the missing one</text>
    </svg>
  )
}

/* How often a second station is in reach. */
export function Coverage() {
  const rows = [[8, '10-minute walk', SIG], [30, '15-minute walk', '#3B97D6'], [81, 'By auto, about 2.5 km', '#7CCBF5']]
  return (
    <figure className="mt-6">
      <div className="grid grid-cols-3 gap-4">
        {rows.map(([v, t, c]) => (
          <div key={t} className="flex flex-col items-center gap-3 text-center">
            <div className="grid aspect-square w-full max-w-[150px] place-items-center rounded-full" style={{ background: `conic-gradient(${c} 0 ${v}%, var(--raised) ${v}% 100%)` }}>
              <div className="grid aspect-square w-[70%] place-items-center rounded-full" style={{ background: 'var(--ground)' }}>
                <span className="font-serif" style={{ fontSize: 'clamp(1.4rem, 1rem + 1.5vw, 2rem)', color: EST }}>{v}%*</span>
              </div>
            </div>
            <span style={{ fontSize: '0.9rem' }}>{t}</span>
          </div>
        ))}
      </div>
    </figure>
  )
}

/* Minutes of slack left during the delay: 27 at 9:04, none by 9:31. */
export function Slack() {
  return (
    <figure className="track-wide mt-8">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="whitespace-nowrap font-serif leading-none" style={{ fontSize: 'clamp(2.4rem, 2rem + 2vw, 3.4rem)', color: EST }}>27 min*</span>
        <span className="text-faint" style={{ fontSize: '0.95rem' }}>of slack at the 9:04 alert, for a 10:30 deadline</span>
      </div>
      <svg viewBox="0 0 900 260" className="block w-full" role="img" aria-label="Slack falls from 27 minutes at the 9:04 alert to zero at 9:31, then backups may arrive late">
        <defs>
          <linearGradient id="sig-up" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7CCBF5" stopOpacity="0.6" /><stop offset="1" stopColor="#7CCBF5" stopOpacity="0.04" /></linearGradient>
          <linearGradient id="sig-down" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C22E00" stopOpacity="0.04" /><stop offset="1" stopColor="#C22E00" stopOpacity="0.28" /></linearGradient>
        </defs>
        <line x1="0" y1="190" x2="900" y2="190" stroke="var(--rule)" />
        <polygon points="0,190 0,30 540,190" fill="url(#sig-up)" />
        <polygon points="540,190 900,250 900,190" fill="url(#sig-down)" />
        <line x1="0" y1="30" x2="900" y2="250" stroke="var(--ink)" strokeWidth="2" />
        <line x1="540" y1="0" x2="540" y2="280" stroke={SIG} strokeWidth="2" strokeDasharray="4 6" />
      </svg>
      <figcaption className="mt-2 grid grid-cols-[60fr_40fr]" style={{ fontSize: '0.88rem' }}>
        <span className="text-faint">9:04 alert</span>
        <span style={{ color: SIG }}>9:31* backups stop working</span>
      </figcaption>
    </figure>
  )
}

/* Two leave-by lines: with a tight deadline the window closes before the alert. */
export function AlertSpeed() {
  const Row = ({ label, at, pct, tone, note }) => (
    <div className="space-y-1.5">
      <div style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>{label}</div>
      <div className="relative h-11">
        <div className="absolute inset-x-0 top-[18px] h-1 rounded-full" style={{ background: 'var(--rule)' }} />
        {pct > 4.4 && <div className="absolute top-[18px] h-1" style={{ left: '4.4%', width: `${pct - 4.4}%`, background: tone }} />}
        <span className="text-faint absolute top-[-4px] -translate-x-1/2" style={{ left: '4.4%', fontSize: '0.8rem' }}>alert 9:04</span>
        <span className="absolute top-[11px] h-[18px] w-[18px] -translate-x-1/2 rounded-full" style={{ left: `${pct}%`, border: `4px solid ${tone}`, background: 'var(--ground)' }} />
        <span className="absolute top-[30px] whitespace-nowrap" style={{ left: `${pct}%`, transform: pct < 10 ? 'translateX(-20%)' : 'translateX(-50%)', fontSize: '0.85rem', color: tone }}>{at} {note}</span>
      </div>
    </div>
  )
  return (
    <div className="track-wide mt-8 space-y-7">
      <Row label="Deadline 10:30" at="9:31*" pct={34.4} tone={SIG} note="" />
      <Row label="Deadline 10:00" at="9:02*" pct={2.2} tone={LATE} note="already gone" />
    </div>
  )
}
