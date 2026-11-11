'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

/*
 * Hazel, peeking. She visits once per page view: up from behind the shelf,
 * a nod and a small heart, then back down. Clicking her while she is up
 * replays the nod and the heart. Hidden under Reduced Motion.
 *
 * The shelf triggers the visit as it comes into view, even during scrolling.
 * `summon` (a count from CheckerStrip's tap target) brings her up again on
 * every tap: up, nod and heart, then down.
 */
export default function PeekDog({ summon = 0 }) {
  const [visible, setVisible] = useState(false)
  const [replay, setReplay] = useState(0)
  const button = useRef(null)
  const visitEnded = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const shelf = button.current?.parentElement
    if (!shelf) return

    let retreat
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.55) return
      observer.disconnect()
      setVisible(true)
      retreat = setTimeout(() => {
        visitEnded.current = true
        if (!button.current?.matches(':focus-visible')) setVisible(false)
      }, 1900)
    }, { threshold: 0.55 })
    observer.observe(shelf)

    return () => {
      observer.disconnect()
      clearTimeout(retreat)
    }
  }, [])

  // Each tap on her spot: up, a fresh nod and heart, then down after 1.6s.
  const summonTimer = useRef(null)
  useEffect(() => {
    if (!summon) return undefined
    setVisible(true)
    setReplay((count) => count + 1)
    clearTimeout(summonTimer.current)
    summonTimer.current = setTimeout(() => {
      visitEnded.current = true
      setVisible(false)
    }, 1600)
    return () => clearTimeout(summonTimer.current)
  }, [summon])

  return (
    <button
      ref={button}
      type="button"
      className="peek-dog"
      data-visible={visible || undefined}
      aria-hidden={!visible}
      aria-label="Say hello to Hazel"
      tabIndex={visible ? 0 : -1}
      onClick={() => setReplay((count) => count + 1)}
      onBlur={() => { if (visitEnded.current) setVisible(false) }}
    >
      <Image
        key={replay}
        className="peek-dog__art"
        data-nod={replay > 0 || undefined}
        src="/exploration/hazel-peek.png"
        alt=""
        width={288}
        height={288}
        loading="eager"
        unoptimized
      />
      {/* A small heart, once per nod. Keyed with the replay so a click restarts it. */}
      <svg key={`h${replay}`} className="peek-dog__heart" viewBox="0 0 12 11" aria-hidden="true">
        <path d="M6 10.2C2.6 7.8.8 6 .8 3.7.8 2 2 .8 3.5.8c1.1 0 1.9.6 2.5 1.5C6.6 1.4 7.4.8 8.5.8 10 .8 11.2 2 11.2 3.7c0 2.3-1.8 4.1-5.2 6.5Z" fill="#C0533A" />
      </svg>
    </button>
  )
}
