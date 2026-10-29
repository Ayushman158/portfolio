/*
 * Iteration 5: finding the right platform. Delhi Metro signs name a train by
 * its last station; the redesign puts the platform number, line colour and
 * two real stations together, tested on riders' phones. Results are the 56
 * riders who finished all eight trips (Sheet read 28 Oct 2026).
 * Everything here uses the site's tokens only: colour lives in the images.
 */
export const W = '/signal/wayfinding'

/* Two images side by side with a caption each: today and the redesign, or two field photos. */
export function Pair({ items, className = 'mt-8' }) {
  return (
    <div className={`track-wide grid gap-4 sm:grid-cols-2 ${className}`}>
      {items.map(([src, label, alt]) => (
        <figure key={src}>
          <img src={`${W}/${src}.jpg`} alt={alt} loading="lazy" className="block w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

/* Today against the redesign, as two plain bars: faint for today, ink for the redesign. */
export function Compare({ rows }) {
  return (
    <div className="space-y-6">
      {rows.map(([title, a, b]) => (
        <div key={title}>
          <p className="text-ink mb-2" style={{ fontSize: '0.98rem' }}>{title}</p>
          {[[a, 'Today', 'var(--rule)'], [b, 'Redesign', 'var(--ink)']].map(([v, t, c]) => (
            <div key={t} className="mt-1.5 grid items-center gap-3" style={{ gridTemplateColumns: '5.5rem 1fr 3rem', fontSize: '0.85rem' }}>
              <span className="text-faint">{t}</span>
              <span className="h-2.5 rounded-full" style={{ width: `${v}%`, background: c }} />
              <span className="text-ink tnum text-right">{v}%</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* Phone screens in a row, cropped to the phone's shape. */
export function Phones({ items }) {
  return (
    <div className="track-wide grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
      {items.map(([src, title, note, alt]) => (
        <figure key={src}>
          <img src={`${W}/${src}.jpg`} alt={alt} loading="lazy" className="block aspect-[390/844] w-full rounded-2xl object-cover object-top" style={{ border: '1px solid var(--rule)' }} />
          <figcaption className="mt-3">
            <span className="text-ink block" style={{ fontSize: '0.95rem' }}>{title}</span>
            <span className="text-faint block" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>{note}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
