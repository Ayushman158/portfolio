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

/* One participant's exam morning, as a journey line. */
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
