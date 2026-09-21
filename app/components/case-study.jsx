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
 * One wide figure, for a shot that carries an argument rather than illustrating
 * one. Breaks the reading measure on desktop like the screenshot rows do.
 */
export function Figure({ src, alt, caption, track = 'track-full', className = '' }) {
  // No `m-0` on the figure: it is a utility, so it would win over the track's
  // margin-inline and the figure would overflow instead of breaking out.
  // Preflight already zeroes figure margins.
  return (
    <figure className={`${track} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-auto rounded-xl"
        style={{ border: '1px solid var(--rule)' }}
      />
      {caption && (
        <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
          {caption}
        </figcaption>
      )}
    </figure>
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

/**
 * A way past the reading, for the people who came for the pictures — and a
 * case study is long enough now that it should admit they exist. Hand-drawn,
 * because it is an aside and should look like one: a note pinned under the
 * opening image, not another button.
 *
 * It scrolls rather than jumps, and moves focus to the section it lands on so
 * a keyboard user arrives where a mouse user does.
 */
export function SkipTo({ target, children }) {
  const go = (e) => {
    const el = document.getElementById(target)
    if (!el) return
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    el.focus({ preventScroll: true })
    history.replaceState(null, '', `#${target}`)

    // Lazy images above the target load as the page glides past them and push
    // it down, so the smooth scroll can finish short of where it aimed. Once
    // it settles, snap the last few pixels.
    let done = false
    const settle = () => {
      if (done) return
      done = true
      if (Math.abs(el.getBoundingClientRect().top - 40) > 12) el.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
    window.addEventListener('scrollend', settle, { once: true })
    setTimeout(settle, 1200)
  }

  return (
    <div className="track-full relative z-10 -mt-7 flex justify-end pr-4 sm:-mt-9 sm:pr-10">
      <a
        href={`#${target}`}
        onClick={go}
        className="skip-note group relative inline-block px-6 pb-3 pt-5 font-reenie-beanie"
        style={{ color: 'var(--ink)', fontSize: '1.9rem', lineHeight: 1 }}
      >
        {/* A wobbly bubble with its tail up toward the image it is talking
            about. Drawn loose on purpose; a perfect rounded rectangle would
            read as UI. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 240 86"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          style={{ overflow: 'visible' }}
        >
          <path
            d="M34 18 C 70 12, 150 10, 206 15 C 228 17, 236 30, 234 48 C 232 68, 220 78, 190 79 C 140 82, 80 81, 40 78 C 14 76, 5 64, 6 46 C 7 28, 16 20, 34 18 Z M 58 17 L 50 2 L 76 16"
            fill="var(--ground)"
            stroke="var(--ink)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="relative whitespace-nowrap">
          {children} <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
        </span>
      </a>
    </div>
  )
}

/**
 * Working artefacts — boards, maps, sheets — as equal thumbnails that open
 * full size. Unlike Shots, which is for phone screens, these are wide and
 * dense: the thumbnail is only an invitation, and the real thing is one click
 * away, at a size where the notes on it can be read.
 */
export function Gallery({ items }) {
  return (
    <div className="track-wide grid gap-4 sm:grid-cols-3">
      {items.map(([src, caption, alt]) => (
        <figure key={src} className="m-0">
          <a href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl" style={{ border: '1px solid var(--rule)' }}>
            <img
              src={src}
              alt={alt || caption}
              loading="lazy"
              className="block aspect-[4/3] w-full object-cover object-top transition-transform duration-500 ease-out hover:scale-[1.02]"
            />
          </a>
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>{caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}
