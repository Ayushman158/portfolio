'use client'

/*
 * Before and after on one photo: today's sign under the redesign, split by a divider the
 * reader drags. Both images share one framing, so only the sign changes as the line moves.
 *
 * Drag anywhere on the photo, or tab to it and use the arrow keys (Home and End jump to
 * either side). The input underneath is a real range, so screen readers announce the split.
 * Clicks and keys glide the divider; dragging follows the pointer exactly. On first view the
 * divider eases from the middle to show the redesign and back once, so it reads as movable.
 * Reduce Motion: no glide, no hint.
 */
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export function Compare({ before, after, beforeLabel = 'Today', afterLabel = 'Redesign', aspect = '1250 / 780' }) {
  const box = useRef(null)
  const reduce = useReducedMotion()
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [glide, setGlide] = useState(false)

  const fromPointer = (e) => {
    const r = box.current.getBoundingClientRect()
    return Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100))
  }
  const onDown = (e) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    setGlide(!reduce)
    setPos(fromPointer(e))
  }
  const onMove = (e) => {
    if (!dragging) return
    setGlide(false)
    setPos(fromPointer(e))
  }
  const onUp = () => setDragging(false)

  // A single hint when the photo first comes into view.
  useEffect(() => {
    if (reduce || typeof IntersectionObserver === 'undefined' || !box.current) return
    let t1 = 0
    let t2 = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      setGlide(true)
      t1 = window.setTimeout(() => setPos(28), 450)
      t2 = window.setTimeout(() => setPos(50), 1350)
    }, { threshold: 0.6 })
    io.observe(box.current)
    return () => { io.disconnect(); window.clearTimeout(t1); window.clearTimeout(t2) }
  }, [reduce])

  const motion = glide ? `${dragging ? 180 : 650}ms ${EASE}` : '0ms'
  return (
    <div
      ref={box}
      className="cmp relative select-none overflow-hidden rounded-xl"
      style={{ aspectRatio: aspect, border: '1px solid var(--rule)', cursor: dragging ? 'grabbing' : 'ew-resize', touchAction: 'pan-y' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <img src={before.src} alt={before.alt} draggable={false} className="absolute inset-0 block h-full w-full object-cover" />
      <img
        src={after.src}
        alt={after.alt}
        draggable={false}
        className="absolute inset-0 block h-full w-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${pos}%)`, transition: `clip-path ${motion}` }}
      />

      {/* labels sit in the corners and fade as the divider covers them */}
      <span className="cmp__tag" style={{ left: '0.75rem', opacity: pos < 14 ? 0 : 1, background: 'rgba(18,18,18,.72)', color: '#fbfbf8' }}>{beforeLabel}</span>
      <span className="cmp__tag" style={{ right: '0.75rem', opacity: pos > 86 ? 0 : 1, background: '#fbfbf8', color: '#242424' }}>{afterLabel}</span>

      {/* the divider: a paper hairline with a round grip */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%`, transition: `left ${motion}` }}>
        <span className="absolute inset-y-0 -ml-px w-[2px]" style={{ background: '#fbfbf8', boxShadow: '0 0 0 1px rgba(18,18,18,.12)' }} />
        <span className="cmp__grip">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={Math.round(pos)}
        onChange={(e) => { setGlide(!reduce); setPos(Number(e.target.value)) }}
        aria-label={`Compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}: the share of the photo showing ${beforeLabel.toLowerCase()}`}
        aria-valuetext={`${Math.round(pos)}% ${beforeLabel.toLowerCase()}, ${100 - Math.round(pos)}% ${afterLabel.toLowerCase()}`}
        className="cmp__range"
      />
    </div>
  )
}
