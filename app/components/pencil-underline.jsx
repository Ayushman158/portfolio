'use client'

import { useEffect, useId, useRef, useState } from 'react'

/*
 * A hand-drawn underline that a small pencil draws under a word, once, when
 * the page first opens. Idea borrowed from the self-drawing line on
 * gregskril.com, kept to the first screen.
 *
 *   delay   ms to wait before the pencil starts (the avatar lands at 500ms)
 *   skip    true to show the finished line with no drawing (coming back
 *           from a case study, when the page is already "here")
 *
 * To read as pencil rather than a vector stroke, the line is two passes (a
 * firm stroke out, then a lighter one back over it, as a hand underlines),
 * and an SVG filter roughens its edge and breaks it into grain, the way
 * graphite skips over paper tooth.
 *
 * How it works: each pass is one SVG path. Its stroke is hidden with a dash as
 * long as the path and revealed by shrinking the dash offset. The pencil is a
 * separate small drawing placed on the path's current end point each frame,
 * so it rides the line as it is drawn, then lifts away and fades.
 * Reduced Motion: the finished line, no pencil.
 */

// The two passes, in a 300 × 24 box. A: a firm, slightly wavy stroke from
// left to right. B: a lighter return stroke back over it, a little lower,
// lifting off before the start.
const PASSES = [
  { d: 'M3 16 C 40 12, 96 18, 150 14 S 240 8, 292 9', ms: 720, width: 2.6, opacity: 1 },
  { d: 'M288 11 C 236 14, 168 19, 96 16', ms: 380, width: 1.6, opacity: 0.7 },
]
const VB_W = 300
const VB_H = 24
const PAUSE_MS = 70 // the pencil rests a moment at the far end before turning back

export default function PencilUnderline({ children, delay = 700, skip = false }) {
  const grainId = `pencil-grain-${useId().replace(/:/g, '')}`
  const paths = useRef([])
  const box = useRef(null)
  const pencil = useRef(null)
  const [size, setSize] = useState({ w: VB_W, h: VB_H })
  const [state, setState] = useState(skip ? 'done' : 'waiting') // waiting → drawing → done

  // The SVG is drawn at the word's real pixel size, so the grain and the
  // rough edge stay the same size whatever the word's width.
  useEffect(() => {
    const el = box.current
    const set = () => { const r = el.getBoundingClientRect(); if (r.width) setSize({ w: r.width, h: r.height }) }
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (skip) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setState('done'); return undefined }
    const els = paths.current
    const lens = els.map((p) => p.getTotalLength())
    els.forEach((p, i) => { p.style.strokeDasharray = `${lens[i]}`; p.style.strokeDashoffset = `${lens[i]}` })

    // Pass A eases out (quick start, slowing into the end); pass B eases in
    // and out, a lighter flick.
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    const [a, b] = PASSES
    const total = a.ms + PAUSE_MS + b.ms

    let raf = 0
    let start = 0
    const place = (p, at) => {
      // Put the pencil's tip on the end of the drawn line, converting from
      // the 300 × 24 box to the word's pixels.
      const pt = p.getPointAtLength(at)
      const r = box.current.getBoundingClientRect()
      pencil.current.style.transform = `translate(${(pt.x / VB_W) * r.width}px, ${(pt.y / VB_H) * r.height}px)`
    }
    const frame = (now) => {
      if (!start) start = now
      const ms = now - start
      const tA = Math.min(1, ms / a.ms)
      const drawnA = lens[0] * easeOut(tA)
      els[0].style.strokeDashoffset = `${lens[0] - drawnA}`
      const tB = Math.max(0, Math.min(1, (ms - a.ms - PAUSE_MS) / b.ms))
      const drawnB = lens[1] * easeInOut(tB)
      els[1].style.strokeDashoffset = `${lens[1] - drawnB}`
      if (ms < a.ms + PAUSE_MS) place(els[0], drawnA)
      else place(els[1], drawnB)
      if (ms < total) raf = requestAnimationFrame(frame)
      else setState('done')
    }
    const timer = setTimeout(() => { setState('drawing'); raf = requestAnimationFrame(frame) }, delay)
    return () => { clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [delay, skip])

  return (
    <span className="pencil-u" data-state={state}>
      {children}
      {/* The track: the line and the pencil share one box under the word. */}
      <span ref={box} className="pencil-u__track" aria-hidden="true">
        <svg className="pencil-u__line" viewBox={`0 0 ${size.w} ${size.h}`}>
          <defs>
            {/* Pencil on paper: a soft warp roughens the edge, then noise
                stretched along the stroke (low frequency across x, high
                across y) breaks it into streaks, the way the lead skips over
                the paper's tooth. */}
            <filter id={grainId} x="-5%" y="-80%" width="110%" height="260%">
              <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="3" result="warp" />
              <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="rough" />
              <feTurbulence type="fractalNoise" baseFrequency="0.32 2.4" numOctaves="2" seed="8" result="grain" />
              <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.6 0 0 0 -1.05" result="tooth" />
              <feComposite in="rough" in2="tooth" operator="in" />
            </filter>
          </defs>
          <g filter={`url(#${grainId})`}>
            <g transform={`scale(${size.w / VB_W} ${size.h / VB_H})`}>
              {PASSES.map((p, i) => (
                <path key={p.d} ref={(el) => { paths.current[i] = el }} d={p.d} vectorEffect="non-scaling-stroke" strokeWidth={p.width} strokeOpacity={p.opacity} />
              ))}
            </g>
          </g>
        </svg>
        {/* The pencil, leaning like it's in a right hand: tip down-left, where it touches the line. */}
        <span ref={pencil} className="pencil-u__pencil">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <g transform="rotate(-135 12 12)">
              <path d="M12 1 L15 6 L9 6 Z" fill="#E9CFA5" />
              <path d="M12 1 L13.2 3 L10.8 3 Z" fill="var(--ink)" />
              <rect x="9" y="6" width="6" height="14" fill="var(--lamp)" />
              <rect x="9" y="20" width="6" height="3" rx="1" fill="var(--accent)" />
            </g>
          </svg>
        </span>
      </span>
    </span>
  )
}
