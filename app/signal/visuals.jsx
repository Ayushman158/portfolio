'use client'

/**
 * The drawn parts of the Signal case study. The page was an essay; these carry
 * the argument visually and leave the prose to explain, not to list.
 *
 * Signal orange is the product's own colour, so it is used here as the
 * product uses it: only where a decision is being made.
 */

export const ORANGE = '#FF3E00'

const label = { fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase' }

/** Big numbers first, the words underneath. */
export function Numbers({ items, cols = 'grid-cols-2 sm:grid-cols-4' }) {
  return (
    <div className={`grid ${cols} gap-px overflow-hidden rounded-xl`} style={{ background: 'var(--rule)', border: '1px solid var(--rule)' }}>
      {items.map(([value, text]) => (
        <div key={text} className="p-4 sm:p-5" style={{ background: 'var(--ground)' }}>
          <p className="tnum" style={{ color: 'var(--ink)', fontSize: '2rem', lineHeight: 1, fontWeight: 500, letterSpacing: '-0.03em' }}>
            {value}
          </p>
          <p className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{text}</p>
        </div>
      ))}
    </div>
  )
}

/**
 * Cognitive load across one morning. Qualitative — the shape comes from the
 * interviews and the curve is Ayushman's own geometry, so there is no numeric
 * axis to pretend otherwise. Labels are HTML over the SVG so they stay legible
 * when the chart is 360px wide.
 */
const STATIONS = [
  [55, 'Home'],
  [280, 'Rajiv Chowk'],
  [430, 'INA', true],
  [660, 'HUDA City Ctr'],
  [780, 'Office'],
]
const CURVE = 'M55,145 C90,145 110,145 150,140 C170,130 180,135 200,130 C220,125 235,148 280,148 C320,148 355,110 385,80 C405,60 420,90 440,85 L455,95 L470,80 C490,70 510,130 550,120 C590,108 620,148 660,148 C720,148 750,148 780,148'
const SPIKES = [
  [175, '01', 'Departure', 'gaming the timing'],
  [430, '02', 'INA transfer', 'the blind transfer', true],
  [660, '03', 'Last mile', 'the vacuum at the exit'],
]

export function LoadCurve() {
  // Labels are placed in the viewBox's own coordinates, so they track the curve.
  const pct = (x) => `${((x - 40) / 750) * 100}%`
  return (
    <figure className="track-wide">
      <div className="relative pt-20 pb-8">
        {SPIKES.map(([x, n, title, sub, hot]) => (
          <div
            key={n}
            className="absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5"
            style={{
              left: pct(x),
              background: hot ? ORANGE : 'var(--raised)',
              color: hot ? '#fff' : 'var(--ink)',
              border: hot ? 'none' : '1px solid var(--rule)',
            }}
          >
            <p style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>{n} {title}</p>
            <p className="hidden sm:block" style={{ fontSize: '0.75rem', opacity: 0.75, lineHeight: 1.3 }}>{sub}</p>
          </div>
        ))}

        <svg viewBox="40 40 750 125" className="block w-full h-auto" style={{ overflow: 'visible' }} aria-hidden="true">
          <line x1="40" y1="160" x2="790" y2="160" stroke="var(--rule)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <defs>
            <linearGradient id="load-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={ORANGE} stopOpacity="0.22" />
              <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${CURVE} L780,160 L55,160 Z`} fill="url(#load-fill)" />
          <path
            d={CURVE}
            fill="none"
            stroke={ORANGE}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          {STATIONS.map(([x, name, hot]) => (
            <circle key={name} cx={x} cy={x === 430 ? 80 : x === 55 ? 145 : 148} r={hot ? 7 : 5.5} fill={hot ? ORANGE : 'var(--ink)'} />
          ))}
        </svg>

        {STATIONS.map(([x, name, hot], i) => (
          <span
            key={name}
            // The last two stops sit 120 units apart, which is 55px on a phone:
            // too close for both names, so the office is left to the dot there.
            className={`absolute bottom-0 whitespace-nowrap${i === 0 ? '' : i === STATIONS.length - 1 ? ' hidden -translate-x-full sm:block' : ' -translate-x-1/2'}`}
            style={{ left: pct(i === 0 ? 40 : x), fontSize: '0.75rem', color: hot ? ORANGE : 'var(--faint)' }}
          >
            {name}
          </span>
        ))}
      </div>
      <figcaption className="text-faint mt-3" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
        Cognitive load across one commute, drawn from the interviews — a shape, not a measurement.
      </figcaption>
    </figure>
  )
}

/** Four moments of one morning, as a strip rather than a table. */
export function Morning({ items }) {
  return (
    <ol className="track-wide grid grid-cols-2 gap-3 p-0 sm:grid-cols-4">
      {items.map(([time, place, q, what], i) => (
        <li key={time} className="list-none rounded-xl p-4" style={{ border: '1px solid var(--rule)', background: i === 2 ? 'var(--raised)' : 'transparent' }}>
          <p className="tnum" style={{ color: i === 2 ? ORANGE : 'var(--ink)', fontSize: '1.5rem', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em' }}>{time}</p>
          <p className="text-faint mt-2" style={label}>{place}</p>
          <p className="mt-2" style={{ color: 'var(--ink)', fontSize: '0.95rem', lineHeight: 1.35 }}>“{q}”</p>
          <p className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{what}</p>
        </li>
      ))}
    </ol>
  )
}

/** k of n, as people. */
function Dots({ k, n }) {
  return (
    <span className="flex gap-1.5" aria-label={`${k} of ${n}`}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="block h-3 w-3 rounded-full" style={i < k ? { background: ORANGE } : { border: '1.5px solid var(--rule)' }} />
      ))}
    </span>
  )
}

function Bar({ pct }) {
  return (
    <span className="block h-3 w-full overflow-hidden rounded-full" style={{ background: 'var(--rule)' }}>
      <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: ORANGE }} />
    </span>
  )
}

function Pills({ items }) {
  return (
    <span className="flex flex-wrap gap-1">
      {items.map((t) => <span key={t} className="chip">{t}</span>)}
    </span>
  )
}

const VIZ = { dots: Dots, bar: Bar, pills: Pills }

/**
 * Findings as cards: the number that makes the point, a small picture of it,
 * then one or two sentences. Source attribution stays in the text.
 */
export function Findings({ items }) {
  return (
    <div className="track-wide grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => {
        const Viz = f.viz && VIZ[f.viz[0]]
        return (
          <article key={f.title} className="flex flex-col rounded-xl p-5" style={{ border: '1px solid var(--rule)' }}>
            <p className="text-faint tnum" style={{ fontSize: '0.8rem' }}>{String(i + 1).padStart(2, '0')}</p>
            <p className="tnum mt-3" style={{ color: 'var(--ink)', fontSize: '2.25rem', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em' }}>
              {f.stat}
            </p>
            {Viz && <div className="mt-3 min-h-3">{<Viz {...f.viz[1]} />}</div>}
            <p className="mt-4" style={{ color: 'var(--ink)', lineHeight: 1.3 }}>{f.title}</p>
            <p className="text-faint mt-1.5" style={{ fontSize: '0.9rem', lineHeight: 1.45 }}>{f.body}</p>
          </article>
        )
      })}
    </div>
  )
}

/**
 * Who does what, as a dot matrix. Full dot: does it. Ring with a dot: partly,
 * or only reactively. Empty ring: not at all. The words stay in the cell for
 * anyone who wants the nuance, and for screen readers.
 */
function Level({ n }) {
  const s = { width: 12, height: 12, borderRadius: 999, display: 'inline-block', flex: 'none' }
  if (n === 2) return <span aria-hidden="true" style={{ ...s, background: 'var(--ink)' }} />
  if (n === 1) return <span aria-hidden="true" style={{ ...s, border: '1.5px solid var(--ink)', background: 'radial-gradient(var(--ink) 30%, transparent 34%)' }} />
  return <span aria-hidden="true" style={{ ...s, border: '1.5px solid var(--rule)' }} />
}

export function Matrix({ columns, rows }) {
  return (
    <figure className="track-wide">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left" style={{ fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th className="py-2 pr-3 font-normal text-faint" />
              {columns.map((c) => (
                <th key={c} className="py-2 px-2 font-normal text-faint align-bottom" style={{ lineHeight: 1.25 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, cells, us]) => (
              <tr key={name} style={{ borderTop: '1px solid var(--rule)', background: us ? 'var(--raised)' : undefined }}>
                <th scope="row" className="py-3 pr-3 font-normal whitespace-nowrap" style={{ color: us ? ORANGE : 'var(--ink)' }}>{name}</th>
                {cells.map(([n, text], j) => (
                  <td key={j} className="py-3 px-2 align-top">
                    <span className="flex items-start gap-2">
                      <Level n={n} />
                      <span className="text-faint" style={{ lineHeight: 1.25, color: us ? 'var(--ink)' : undefined }}>{text}</span>
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="text-faint mt-3 flex flex-wrap items-center gap-x-4 gap-y-1" style={{ fontSize: '0.85rem' }}>
        <span className="flex items-center gap-1.5"><Level n={2} /> does it</span>
        <span className="flex items-center gap-1.5"><Level n={1} /> partly, or only after you ask</span>
        <span className="flex items-center gap-1.5"><Level n={0} /> not at all</span>
      </figcaption>
    </figure>
  )
}

/**
 * The prototype, as screens. A scroll strip on a phone, a row on desktop.
 * The captures already include the device status bar, so the frame is only a
 * rounded edge and a hairline.
 */
export function Screens({ items }) {
  return (
    <div className="track-full -mb-2 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:overflow-visible" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map(([src, caption]) => (
        <figure key={src} className="w-[62vw] max-w-[15rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
          <img
            src={src}
            alt={caption}
            width={780}
            height={1688}
            loading="lazy"
            className="block h-auto w-full rounded-[1.4rem]"
            style={{ border: '1px solid var(--rule)' }}
          />
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}

/** The four verdicts, each with the colour it would carry. */
export function Verdicts({ items }) {
  return (
    <div className="track-wide grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(([state, verdict, detail, color]) => (
        <div key={state} className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--rule)' }}>
          <div style={{ height: 4, background: color }} />
          <div className="p-4">
            <p style={{ ...label, color }}>{state}</p>
            <p className="mt-2" style={{ color: 'var(--ink)', fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.2 }}>{verdict}</p>
            <p className="text-faint mt-2" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>{detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** k of n testers, against the target the study set itself. */
export function Tested({ items }) {
  return (
    <div className="space-y-5">
      {items.map(([title, k, n, target]) => (
        <div key={title}>
          <div className="flex items-baseline justify-between gap-4">
            <p style={{ color: 'var(--ink)' }}>{title}</p>
            <p className="tnum text-faint shrink-0" style={{ fontSize: '0.9rem' }}>{k} of {n}</p>
          </div>
          <div className="relative mt-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {Array.from({ length: n }, (_, i) => (
              <span key={i} className="block h-2.5 rounded-full" style={{ background: i < k ? ORANGE : 'var(--rule)' }} />
            ))}
            {target != null && (
              <span className="absolute -top-1.5 -bottom-1.5 w-px" style={{ left: `${target}%`, background: 'var(--ink)' }} />
            )}
          </div>
          {target != null && <p className="text-faint mt-1.5" style={{ fontSize: '0.8rem' }}>target {target}%</p>}
        </div>
      ))}
    </div>
  )
}

/** Before, struck through; after, in ink. */
export function Iterations({ items }) {
  return (
    <div className="space-y-2">
      {items.map(([before, after]) => (
        <div key={before} className="grid items-center gap-2 rounded-xl p-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-4" style={{ border: '1px solid var(--rule)' }}>
          <span className="text-faint line-through" style={{ fontSize: '0.95rem', textDecorationColor: 'var(--faint)' }}>{before}</span>
          <span aria-hidden="true" className="hidden sm:inline" style={{ color: ORANGE }}>→</span>
          <span style={{ color: 'var(--ink)', fontSize: '0.95rem' }}>{after}</span>
        </div>
      ))}
    </div>
  )
}

/** Short titled cards in a grid, for lists whose items are parallel. */
export function Cards({ items, cols = 'sm:grid-cols-2' }) {
  return (
    <div className={`grid gap-3 ${cols}`}>
      {items.map(([title, body], i) => (
        <div key={title} className="rounded-xl p-5" style={{ border: '1px solid var(--rule)' }}>
          <p className="text-faint tnum" style={{ fontSize: '0.8rem' }}>{String(i + 1).padStart(2, '0')}</p>
          <p className="mt-2" style={{ color: 'var(--ink)' }}>{title}</p>
          <p className="text-faint mt-1.5" style={{ fontSize: '0.9rem', lineHeight: 1.45 }}>{body}</p>
        </div>
      ))}
    </div>
  )
}
