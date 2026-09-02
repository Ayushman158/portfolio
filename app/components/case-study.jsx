'use client'

import Link from 'next/link'

/**
 * The furniture both case studies share, so they cannot drift apart again.
 * Everything reads from the site's tokens — no page pins its own palette.
 */

export function Rule() {
  return <div className="my-14" style={{ height: 1, background: 'var(--rule)' }} />
}

export function Heading({ children }) {
  return (
    <h2
      className="mb-4"
      style={{ color: 'var(--ink)', fontSize: '1.35rem', lineHeight: 1.3, fontWeight: 500, letterSpacing: '-0.01em' }}
    >
      {children}
    </h2>
  )
}

export function Back() {
  return <Link href="/#work" className="prose-link text-[0.95rem]">← Work</Link>
}

/** Role, scope, stack — the four rows a recruiter reads first. */
export function Facts({ rows }) {
  return (
    <dl className="mt-10">
      {rows.map(([k, v]) => (
        <div key={k} className="index-row">
          <dt className="text-faint">{k}</dt>
          <dd style={{ color: 'var(--ink)', textAlign: 'right' }}>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/** A numbered argument list. The number is faint; the claim carries the weight. */
export function Decisions({ items }) {
  return (
    <div className="mt-6">
      {items.map(([title, body], i) => (
        <div key={title} className="py-5" style={{ borderBottom: '1px solid var(--rule)' }}>
          <div className="flex gap-4">
            <span className="text-faint tabular-nums" style={{ fontSize: '0.9rem', paddingTop: '0.15rem' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p style={{ color: 'var(--ink)' }}>{title}</p>
              <p className="text-faint mt-1" style={{ fontSize: '0.95rem' }}>{body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Before and after, side by side. The tildes are kept: they were estimates. */
export function BeforeAfter({ rows }) {
  return (
    <div className="mt-8">
      <div className="index-row" style={{ gridTemplateColumns: '1fr auto auto', gap: '1.25rem' }}>
        <span className="text-faint" style={{ fontSize: '0.85rem' }} />
        <span className="text-faint" style={{ fontSize: '0.85rem', minWidth: '5.5rem', textAlign: 'right' }}>before</span>
        <span className="text-faint" style={{ fontSize: '0.85rem', minWidth: '5.5rem', textAlign: 'right' }}>after</span>
      </div>
      {rows.map(([label, before, after]) => (
        <div key={label} className="index-row" style={{ gridTemplateColumns: '1fr auto auto', gap: '1.25rem' }}>
          <span>{label}</span>
          <span className="text-faint tabular-nums" style={{ minWidth: '5.5rem', textAlign: 'right' }}>{before}</span>
          <span className="tabular-nums" style={{ color: 'var(--ink)', minWidth: '5.5rem', textAlign: 'right' }}>{after}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * Screenshots with captions, in a responsive row. On desktop the row leaves the
 * reading measure: five phone screens at 192px each told nobody anything, and
 * these are a sequence, so a single filmstrip of five reads as the flow rather
 * than as a 3-then-2 grid.
 */
export function Shots({ items, cols = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' }) {
  return (
    <div className={`track-full grid ${cols} gap-x-4 gap-y-8`}>
      {items.map(([src, caption, crop]) => (
        <figure key={src} className="m-0">
          {/* One capture is a 1170x4641 scroll — left at its natural height it
              hangs 450px below its neighbours and strands its own caption. The
              third slot names where to crop it to a phone's shape instead, so
              the row stays a row and the part the caption is about stays in. */}
          <img
            src={src}
            alt={caption}
            loading="lazy"
            className={`w-full h-auto rounded-xl${crop ? ' aspect-[430/932] object-cover' : ''}`}
            style={{ border: '1px solid var(--rule)', objectPosition: crop || undefined }}
          />
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
            {caption}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
