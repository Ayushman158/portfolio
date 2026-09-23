'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * The grid, on demand. The site runs on three power lines — the reading
 * measure, the wide track and the full track — and this draws them over any
 * page, the way Obys's grid site lets you switch its grid on. It is for anyone
 * curious how the layout holds together; it changes nothing for anyone who
 * never presses it.
 *
 * The positions are the CSS's own arithmetic, so the lines cannot drift from
 * the layout:
 *   text  .measure content edge   min(20.5rem, 50vw) - 1.5rem from centre
 *   wide  .track-wide             min(29rem, 50vw - 1.5rem)   (≥ 60rem only)
 *   full  .track-full             min(37rem, 50vw - 1.5rem)   (≥ 60rem only)
 */

const KEY = 'grid-overlay'

const LINES = [
  { name: 'text', half: 'calc(min(20.5rem, 50vw) - 1.5rem)', band: true },
  { name: 'wide', half: 'min(29rem, calc(50vw - 1.5rem))', wideOnly: true },
  { name: 'full', half: 'min(37rem, calc(50vw - 1.5rem))', wideOnly: true },
]

export function useGridOverlay() {
  const [on, setOn] = useState(false)

  // Remembered per visitor, as a convenience only: storage can be missing or
  // blocked, and the page is correct without it.
  useEffect(() => {
    try { setOn(localStorage.getItem(KEY) === '1') } catch {}
  }, [])

  const toggle = useCallback(() => {
    setOn((v) => {
      try { localStorage.setItem(KEY, v ? '0' : '1') } catch {}
      return !v
    })
  }, [])

  // G toggles it, unless someone is typing or reaching for a shortcut.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'g' && e.key !== 'G') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  return { on, toggle }
}

export function GridOverlay({ on }) {
  if (!on) return null
  return (
    <div aria-hidden="true" className="grid-overlay pointer-events-none fixed inset-0 z-40">
      {LINES.map(({ name, half, band, wideOnly }) => (
        <div key={name} className={wideOnly ? 'grid-wide-only' : undefined}>
          {band && (
            <div
              className="absolute inset-y-0"
              style={{ left: `calc(50% - ${half})`, width: `calc(${half} * 2)`, background: 'color-mix(in srgb, var(--accent) 5%, transparent)' }}
            />
          )}
          {['-', '+'].map((side) => (
            <div
              key={side}
              className="absolute inset-y-0 w-px"
              style={{ left: `calc(50% ${side} ${half})`, background: 'color-mix(in srgb, var(--accent) 45%, transparent)' }}
            />
          ))}
          <span
            className="absolute whitespace-nowrap"
            style={{
              left: `calc(50% - ${half} + 6px)`,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: '0.06em',
              color: 'color-mix(in srgb, var(--accent) 80%, transparent)',
              top: name === 'text' ? 12 : name === 'wide' ? 28 : 44,
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  )
}
