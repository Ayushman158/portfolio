'use client'

import { useState } from 'react'

/**
 * A screen with numbered pins, and beside it the reason behind each pinned
 * decision. The notes are always visible (beside the image on wide screens,
 * listed under it on narrow ones), so nothing depends on hover; hovering or
 * focusing a pin or a note only brings that pair forward.
 *
 * pins: [{ x, y, title, body }] with x and y in % of the image.
 */
const MONO = "'Geist Mono', ui-monospace, monospace"

function Pin({ n, on, ...rest }) {
  return (
    <span
      className="grid place-items-center rounded-full transition-transform duration-200 motion-reduce:transition-none"
      style={{
        width: 26,
        height: 26,
        background: 'var(--accent)',
        color: 'var(--ground)',
        fontFamily: MONO,
        fontSize: 12,
        fontWeight: 600,
        boxShadow: '0 0 0 3px var(--ground)',
        transform: on ? 'scale(1.15)' : 'scale(1)',
      }}
      {...rest}
    >
      {n}
    </span>
  )
}

export default function AnnotatedScreen({ src, alt, width, height, pins, maxW = '22rem', caption }) {
  const [active, setActive] = useState(null)
  const enter = (i) => () => setActive(i)
  const leave = () => setActive(null)

  return (
    <figure className="track-wide mt-16 grid items-start gap-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-12">
      <div className="relative mx-auto w-full" style={{ maxWidth: maxW }}>
        <img src={src} alt={alt} width={width} height={height} loading="lazy" className="block h-auto w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
        {pins.map((p, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Note ${i + 1}: ${p.title}`}
            onMouseEnter={enter(i)}
            onMouseLeave={leave}
            onFocus={enter(i)}
            onBlur={leave}
            onClick={() => {
              setActive(i)
              document.getElementById(`${src}-note-${i}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 p-2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <Pin n={i + 1} on={active === i} aria-hidden="true" />
          </button>
        ))}
      </div>

      <figcaption>
        <ol className="space-y-6" style={{ maxWidth: '26rem' }}>
          {pins.map((p, i) => (
            <li
              key={i}
              id={`${src}-note-${i}`}
              onMouseEnter={enter(i)}
              onMouseLeave={leave}
              className="flex gap-4 transition-opacity duration-200 motion-reduce:transition-none"
              style={{ opacity: active === null || active === i ? 1 : 0.45 }}
            >
              <Pin n={i + 1} on={active === i} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-ink" style={{ fontSize: '1rem', lineHeight: 1.4, fontWeight: 500 }}>{p.title}</p>
                <p className="mt-1 text-faint" style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
        {caption && <p className="mt-8 text-faint" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{caption}</p>}
      </figcaption>
    </figure>
  )
}
