'use client'

/**
 * The drawn parts of the Kizuku case study, restored from the long version the
 * Sept 2 rewrite cut, and redrawn in the site's tokens. Positions, colours and
 * reasons are Ayushman's own.
 */

const small = { fontSize: '0.8rem', lineHeight: 1.35 }
const eyebrow = { fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase' }

/**
 * Artwork drawn on white. It stays on white in the dark theme too — the same
 * rule the ALBUM//ALIVE QR follows — because the illustrations were painted
 * against it and their edges are only right there.
 */
export function Plate({ src, alt, caption, w, h, track = 'track-wide', pad = 'p-4 sm:p-6' }) {
  return (
    <figure className={track}>
      <div className={`overflow-hidden rounded-xl ${pad}`} style={{ background: '#FFFFFF', border: '1px solid var(--rule)' }}>
        <img src={src} alt={alt} width={w} height={h} loading="lazy" className="mx-auto block h-auto w-full" />
      </div>
      {caption && <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>{caption}</figcaption>}
    </figure>
  )
}

/**
 * Where the apps sit, on two axes: warm to clinical, passive to active. A
 * picture of a position, not a measurement — the positions were placed by
 * hand from the review, and the caption says so.
 */
export function CompetitorMap({ apps, us }) {
  return (
    <figure className="m-0">
      <div className="relative mx-auto aspect-square w-full max-w-[24rem] rounded-xl" style={{ border: '1px solid var(--rule)', background: 'var(--raised)' }}>
        {/* the quadrant nobody occupies */}
        <div className="absolute right-0 top-0 h-1/2 w-1/2 rounded-tr-xl" style={{ background: 'color-mix(in srgb, #2C5228 9%, transparent)' }} />
        <div className="absolute inset-y-3 left-1/2 w-px" style={{ background: 'var(--rule)' }} />
        <div className="absolute inset-x-3 top-1/2 h-px" style={{ background: 'var(--rule)' }} />

        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-faint" style={eyebrow}>warm</span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-faint" style={eyebrow}>clinical</span>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-faint" style={eyebrow}>passive</span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-faint" style={eyebrow}>active</span>

        {/* The five sit close together, so each label takes its own side of
            its dot rather than all stacking underneath and colliding. */}
        {apps.map(([name, x, y, side = 'below']) => {
          const at = {
            below: 'top-full left-1/2 -translate-x-1/2 mt-0.5',
            above: 'bottom-full left-1/2 -translate-x-1/2 mb-0.5',
            left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
            right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
          }[side]
          return (
            <span key={name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
              <span className="block h-2 w-2 rounded-full" style={{ background: 'var(--faint)', opacity: 0.7 }} />
              <span className={`absolute whitespace-nowrap text-faint ${at}`} style={{ fontSize: '0.72rem' }}>{name}</span>
            </span>
          )
        })}

        <span className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${us[1]}%`, top: `${us[2]}%` }}>
          <span className="block h-3.5 w-3.5 rounded-full" style={{ background: '#2C5228', boxShadow: '0 0 0 4px color-mix(in srgb, #2C5228 20%, transparent)' }} />
          <span className="mt-1 whitespace-nowrap" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>{us[0]}</span>
        </span>
      </div>
      <figcaption className="text-faint mt-2 text-center" style={small}>
        Warm and active — a quadrant none of the five occupies. Placed by hand from the review.
      </figcaption>
    </figure>
  )
}

/** Six colours, each with the reason it was chosen. */
export function Palette({ colours }) {
  return (
    <div className="track-wide grid grid-cols-2 gap-3 sm:grid-cols-3">
      {colours.map(([name, hex, reason]) => (
        <div key={name} className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--rule)' }}>
          <div className="h-16 sm:h-20" style={{ background: hex }} />
          <div className="p-3.5">
            <p className="flex items-baseline justify-between gap-2">
              <span style={{ color: 'var(--ink)' }}>{name}</span>
              <span className="tnum text-faint" style={{ fontSize: '0.75rem' }}>{hex}</span>
            </p>
            <p className="text-faint mt-1.5" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{reason}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** The onboarding change, as the order of screens before and after. */
export function Onboarding({ before, after }) {
  const Row = ({ title, steps, strike }) => (
    <div>
      <p className="text-faint mb-2" style={eyebrow}>{title}</p>
      <ol className="flex flex-wrap items-center gap-1.5 p-0">
        {steps.map(([label, hot], i) => (
          <li key={label} className="flex list-none items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-faint">→</span>}
            <span
              className="rounded-lg px-2.5 py-1.5"
              style={{
                fontSize: '0.85rem',
                border: `1px solid ${hot ? (strike ? 'var(--warm-b)' : '#2C5228') : 'var(--rule)'}`,
                background: hot ? (strike ? 'color-mix(in srgb, var(--warm-a) 50%, transparent)' : 'color-mix(in srgb, #2C5228 10%, transparent)') : 'transparent',
                color: 'var(--ink)',
              }}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
  return (
    <div className="space-y-5 rounded-xl p-5" style={{ border: '1px solid var(--rule)' }}>
      <Row title="before — about forty seconds in" steps={before} strike />
      <Row title="after" steps={after} />
    </div>
  )
}
