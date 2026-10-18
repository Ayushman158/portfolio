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
        <p className="mt-3" style={{ color: 'inherit', opacity: 0.75 }}>of trains ran on time in 2026, by DMRC’s count. That’s trains, not door-to-door trips.</p>
      </div>
      <div>
        <div className="font-serif leading-none" style={{ fontSize: 'clamp(4rem, 3rem + 4vw, 6.5rem)', letterSpacing: '-0.03em', color: 'var(--sig-panel-accent)' }}>34 min</div>
        <p className="mt-3" style={{ color: 'inherit', opacity: 0.75 }}>of buffer a day, on average, that the seven riders I interviewed say they add</p>
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
      <text x="250" y="276" textAnchor="middle" style={{ font: '400 14px var(--font-sans), sans-serif', fill: 'var(--faint)' }}>of buffer a day, self-reported</text>
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
    [200, 1, '7 of 7', 'add a buffer every day', 'var(--line-blue)'],
    [165, 4 / 7, '4 of 7', 'struggle with the last mile', 'var(--line-magenta)'],
    [130, 4 / 7, '4 of 7', 'pick routes for safety', 'var(--line-pink)'],
    [95, 2 / 7, '2 of 7', 'moved or switched stations', 'var(--line-violet)'],
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
        {arcs.map(([r, , n, t, c]) => (
          <div key={r} className="flex gap-3">
            <span aria-hidden="true" className="mt-1 h-6 w-[5px] shrink-0 rounded-full" style={{ background: c }} />
            <div>
              <dt className="font-serif leading-none" style={{ fontSize: '1.6rem', color: 'var(--ink)' }}>{n}</dt>
              <dd className="text-faint" style={{ fontSize: '0.92rem' }}>{t}</dd>
            </div>
          </div>
        ))}
      </dl>
    </figure>
  )
}


/* Five things a rider has during a delay, and the one they don't. */
export function Orbit() {
  const nodes = [
    [300, 62, 'What they’ve learned'], [500, 180, 'What DMRC knows'], [500, 400, 'The backups'],
    [100, 400, 'Cost of leaving'], [100, 180, 'Their deadline'],
  ]
  return (
    <svg viewBox="0 0 600 560" className="mx-auto block w-full max-w-[560px]" role="img" aria-label="Around the decision to wait or leave: what they’ve learned, what DMRC knows, the backups, the cost of leaving, their deadline, and time, the one thing nothing shows them">
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

/* Real headlines, as screenshots of the articles. Each links to its source. */
const HEADLINES = [
  ['news-snag-week', 'News24', '1 Sep 2025', 'https://news24online.com/india/delhi-metro-faces-third-technical-glitch-in-a-week-commuters-hit-by-delays/624814/', 'Delhi Metro Faces Third Technical Glitch In A Week, Commuters Hit By Delays'],
  ['news-yellow-line', 'The Quint, reader report', '', 'https://www.thequint.com/my-report/delhi-metro-yellow-line-chattarpur-technical-glitch', 'Delhi Metro’s Yellow Line Snag was Painful for Many Like Me'],
  ['news-blue-line', 'ETV Bharat', '30 Jun 2026', 'https://www.etvbharat.com/amp/en/state/technical-snag-on-delhi-metro-blue-line-disrupts-services-enn26063006928', 'Technical Snag On Delhi Metro’s Blue Line Disrupts Services'],
  ['news-closed-july', 'Oneindia', '23 Jul 2026', 'https://www.oneindia.com/india/17-delhi-metro-stations-to-remain-closed-for-third-day-check-full-list-8155349.html', '17 Delhi Metro Stations To Remain Closed For Third Day'],
  ['news-closure-oct', 'Business Today', '9 Oct 2026', 'https://www.businesstoday.in/india/story/dmrc-issues-revised-metro-closure-update-ahead-of-oct-10-check-affected-stations-560777-2026-10-09', 'DMRC issues revised metro closure update ahead of Oct 10'],
]
export function Headlines() {
  const tilt = ['-1deg', '1.2deg', '0.6deg', '-0.8deg', '0.9deg']
  return (
    <div className="track-wide mt-10 columns-1 gap-6 sm:columns-2">
      {HEADLINES.map(([f, src, date, url, title], i) => (
        <a key={f} href={url} target="_blank" rel="noreferrer" className="mb-6 block break-inside-avoid transition-transform duration-200 hover:-translate-y-0.5" style={{ transform: `rotate(${tilt[i]})`, textDecoration: 'none' }}>
          <img src={`/signal/v4/${f}.jpg`} alt={`Headline: ${title}`} loading="lazy" className="sig-dim block h-auto w-full rounded-lg" style={{ background: '#fff', border: '1px solid var(--rule)', boxShadow: '0 12px 32px rgba(23,22,20,0.10)' }} />
          <span className="text-faint mt-2 block" style={{ fontSize: '0.8rem' }}>{src}{date ? ` · ${date}` : ''}</span>
        </a>
      ))}
    </div>
  )
}

/* A daily trip has several stages, and a delay can start at any of them. */
const STAGES = [
  ['Home', 'Bus or auto to the station', 'Traffic, no auto', false],
  ['Station gate', 'Security check, QR or card', 'Queue, QR or card fails', false],
  ['Platform', 'Wait for the train', 'Fault or closure', true],
  ['Train', 'Ride, maybe change lines', 'First train too full', false],
  ['Exit gate', 'Tap out', 'Exit not registered', false],
  ['Last mile', 'Auto, bike taxi, walk', 'Surge, no ride found', false],
]
export function DelayMap() {
  return (
    <figure className="track-wide mt-10">
      <div>
        <ol className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {STAGES.map(([name, what, delay, scope], i) => (
            <li key={name} className="flex flex-col gap-3 pr-4">
              <div className="flex items-center">
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: `4px solid ${scope ? SIG : 'var(--faint)'}`, background: 'var(--ground)', flexShrink: 0 }} />
                <span className={i === STAGES.length - 1 ? 'hidden' : 'block'} style={{ flex: 1, height: 3, background: 'var(--rule)' }} />
              </div>
              <div style={{ color: 'var(--ink)', fontSize: '1rem' }}>{name}</div>
              <div className="text-faint" style={{ fontSize: '0.85rem', lineHeight: 1.35 }}>{what}</div>
              <div className="rounded-lg px-2.5 py-1.5" style={{ fontSize: '0.85rem', lineHeight: 1.3, background: scope ? 'var(--sig-tint)' : 'var(--raised)', color: scope ? 'var(--ink)' : 'var(--muted)', border: scope ? `1.5px solid ${SIG}` : '1px solid transparent' }}>{delay}</div>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2" style={{ fontSize: '0.88rem' }}>
        <span className="flex items-center gap-2"><span style={{ width: 12, height: 12, borderRadius: 3, border: `1.5px solid ${SIG}`, background: 'var(--sig-tint)' }} />Designed for now</span>
        <span className="text-faint flex items-center gap-2"><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--raised)' }} />Future scope</span>
      </figcaption>
    </figure>
  )
}

/* The rule, drawn as one timeline: wait, then the quickest backup on a bad run, then a margin. */
export function Timeline() {
  const seg = [
    [27, 'You can keep waiting', '27 min*', 'var(--sig-sky)', 'var(--ink)'],
    [54, 'Quickest backup on a bad run: exit, pickup, ride', '54 min*', SIG, 'var(--sig-on)'],
    [5, 'Margin', '5', 'var(--sig-quiet)', '#fff'],
  ]
  return (
    <figure className="track-wide mt-8">
      <div className="flex justify-between font-medium" style={{ fontSize: '0.95rem' }}>
        <span style={{ color: 'var(--ink)' }}>9:04 · alert, no time given</span>
        <span style={{ color: 'var(--ink)' }}>10:30 · deadline</span>
      </div>
      <div className="mt-3 flex h-14 overflow-hidden rounded-xl">
        {seg.map(([w, , v, bg, fg]) => (
          <div key={v + w} className="flex items-center px-3" style={{ flex: w, background: bg, color: fg, fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{w > 6 ? v : ''}</div>
        ))}
      </div>
      <div className="relative mt-2 h-6" style={{ fontSize: '0.92rem' }}>
        <span className="absolute -translate-x-1/2 font-semibold" style={{ left: `${27 / 86 * 100}%`, color: SIG }}>9:31*</span>
      </div>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3" style={{ fontSize: '0.95rem' }}>
        {seg.map(([, t, v, bg]) => (
          <div key={t} className="flex gap-3">
            <span style={{ width: 14, height: 14, borderRadius: 4, background: bg, marginTop: 4, flexShrink: 0 }} />
            <div><dt style={{ color: 'var(--ink)' }}>{t}</dt><dd className="text-faint">{v === '5' ? '5 min, in case' : v}</dd></div>
          </div>
        ))}
      </dl>
    </figure>
  )
}
