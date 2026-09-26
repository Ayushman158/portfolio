'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'motion/react'

/**
 * The avatar as a fridge magnet. Pick it up and it lifts (a little bigger, a
 * longer shadow, straightened); put it down and it settles where it was left,
 * tilted again. It never snaps home: the point is that it stays where you put
 * it. At night it dims and loses most of its gloss, like a real one would.
 *
 * Bounds keep it on the fridge: it can travel left across the headline and
 * down the hero, not off the page.
 */
const BOUNDS = { minX: -320, maxX: 40, minY: -40, maxY: 220 }
const NARROW = { minX: -8, maxX: 200, minY: -20, maxY: 160 }

export default function Magnet({ size = 112, drop = true }) {
  const reduceMotion = useReducedMotion()
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [lifted, setLifted] = useState(false)
  const drag = useRef(null)
  // The drop starts from the same moment as the lamp's entrance (hydration),
  // so the order holds on a slow connection: cord first, then the magnet.
  const [go, setGo] = useState(false)
  useEffect(() => setGo(true), [])

  const onPointerDown = (e) => {
    e.preventDefault()
    const b = window.matchMedia('(min-width: 60rem)').matches ? BOUNDS : NARROW
    drag.current = { sx: e.clientX - pos.x, sy: e.clientY - pos.y, b }
    setLifted(true)
    const move = (ev) => {
      const d = drag.current
      setPos({
        x: Math.max(d.b.minX, Math.min(d.b.maxX, ev.clientX - d.sx)),
        y: Math.max(d.b.minY, Math.min(d.b.maxY, ev.clientY - d.sy)),
      })
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      setLifted(false)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  return (
    <div
      onPointerDown={onPointerDown}
      className="relative z-10 cursor-grab select-none active:cursor-grabbing"
      style={{
        width: size,
        height: size,
        touchAction: 'none',
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${lifted ? 0 : -3}deg) scale(${lifted ? 1.06 : 1})`,
        transition: lifted ? 'transform .15s ease' : reduceMotion ? 'none' : 'transform .35s cubic-bezier(.3,1.6,.5,1)',
      }}
    >
      <div className={`h-full w-full${drop ? ' magnet-drop' : ''}`} data-go={go || undefined}>
      <div className="magnet relative h-full w-full overflow-hidden rounded-full" data-lifted={lifted || undefined} style={{ transition: 'box-shadow .25s ease' }}>
        <Image
          src="/assets/avatar-sketch.webp"
          alt="A pencil self-portrait of Ayushman, curly-haired and half smiling, in a yellow circle"
          width={800}
          height={800}
          sizes={`${size}px`}
          priority
          draggable={false}
          className="magnet-img pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="magnet-gloss pointer-events-none absolute inset-0 rounded-full" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: 'inset 0 -4px 8px rgba(0,0,0,.14), inset 0 2px 2px rgba(255,255,255,.45), inset 0 0 0 1px rgba(0,0,0,.06)' }}
        />
      </div>
      </div>
    </div>
  )
}
