'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

/*
 * A small window set into the hero line, right after the name, that flips
 * through photos from my life: "I'm Ayushman [photo], a designer…".
 * Idea borrowed from dnbls.com, where photos flip between the first and last
 * name.
 *
 * Each photo stays about two seconds, then crossfades into the next. They are
 * toned warm and soft so they sit on the cream wall instead of shouting.
 * Flipping starts a moment after load, and stops while the line is off screen
 * or the tab is hidden.
 * Hover (mouse): the photo shows in full colour, leans in a little, and the
 * flipping pauses until the pointer leaves (styles in globals.css).
 * Touch: a tap does the same for three seconds; the window dips slightly
 * under the finger as it's pressed.
 * Reduced Motion: the first photo, still.
 *
 * To change the photos: edit PHOTOS. Any shape works; each is cropped to the
 * window from the centre (set `pos` to move the crop, e.g. 'top'). Photos
 * already cropped to 1.5 : 1 show exactly as saved.
 */
const PHOTOS = [
  // From my Instagram, framed for the window's shape (about 1.5 : 1, as on dnbls.com) in
  // public/hero. Order: me and Hazel first, then a mix of places and things.
  { src: '/hero/frame/hazel-grass.jpg' },
  { src: '/hero/frame/childhood.jpg' }, // the one old photo, already black and white
  { src: '/hero/frame/cafe.jpg' },
  { src: '/hero/frame/valley.jpg' },
  { src: '/hero/frame/ride.jpg' },
  { src: '/hero/frame/fog-forest.jpg' },
  { src: '/hero/frame/chai.jpg' },
  { src: '/hero/frame/bike-river.jpg' },
  { src: '/hero/frame/paddy-sunset.jpg' },
]
const EVERY_MS = 2000 // time each photo stays (the 600ms crossfade is in globals.css)
const START_MS = 1300 // first flip, once the greeting and lamp have settled

export default function PhotoSlot({ className = '' }) {
  const box = useRef(null)
  const hovered = useRef(false)
  const [i, setI] = useState(0)
  // Touch has no hover, so a tap does the same: colour, a closer look, and a
  // pause, for a few seconds (or until the next tap).
  const [look, setLook] = useState(false)
  useEffect(() => {
    hovered.current = look
    if (!look) return undefined
    const t = setTimeout(() => setLook(false), 3000)
    return () => clearTimeout(t)
  }, [look])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let timer = 0
    let visible = true
    const tick = () => {
      if (visible && !document.hidden && !hovered.current) setI((n) => (n + 1) % PHOTOS.length)
      timer = setTimeout(tick, EVERY_MS)
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(box.current)
    timer = setTimeout(tick, START_MS)
    return () => { clearTimeout(timer); io.disconnect() }
  }, [])

  return (
    <span ref={box} className={`photo-slot ${className}`} role="img" aria-label="A few photos from my life"
      data-look={look || undefined}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') hovered.current = true }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') hovered.current = false }}
      onPointerUp={(e) => { if (e.pointerType !== 'mouse') setLook((v) => !v) }}>
      {PHOTOS.map((p, n) => (
        <Image
          key={p.src}
          src={p.src}
          alt=""
          fill
          sizes="200px"
          priority={n === 0}
          data-on={n === i || undefined}
          style={p.pos ? { objectPosition: p.pos } : undefined}
        />
      ))}
    </span>
  )
}
