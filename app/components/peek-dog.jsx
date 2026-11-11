'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

/*
 * Hazel, peeking. She visits once per page view: up from behind the shelf,
 * a nod and a small heart, then back down. Clicking her while she is up
 * replays the nod and the heart. Hidden under Reduced Motion.
 *
 *   strip   she sits in a clipped box on a shelf (see CheckerStrip)
 *   arrive  visit ~1.2s after the page opens, if her shelf is on screen,
 *           instead of waiting for a scroll
 */
export default function PeekDog({ strip = false, arrive = false }) {
  const [visible, setVisible] = useState(false)
  const [replay, setReplay] = useState(0)
  const button = useRef(null)
  const visitEnded = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let idle
    let retreat
    let travelled = 0
    let lastY = window.scrollY

    const onShelf = () => {
      if (!strip) return true
      const edge = button.current?.parentElement?.getBoundingClientRect()
      return !!edge && edge.top >= 0 && edge.bottom <= window.innerHeight - 32
    }

    function visit() {
      window.removeEventListener('scroll', onScroll)
      setVisible(true)
      retreat = setTimeout(() => {
        visitEnded.current = true
        if (!button.current?.matches(':focus-visible')) setVisible(false)
      }, 1900)
    }

    let arrival
    if (arrive) arrival = setTimeout(() => { if (onShelf()) visit() }, 1200)

    function onScroll() {
      travelled += Math.abs(window.scrollY - lastY)
      lastY = window.scrollY
      clearTimeout(idle)
      if (travelled < 24) return

      idle = setTimeout(() => { if (onShelf()) visit() }, 250)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(idle)
      clearTimeout(retreat)
      clearTimeout(arrival)
    }
  }, [strip, arrive])

  return (
    <button
      ref={button}
      type="button"
      className={`peek-dog${strip ? ' peek-dog--strip' : ''}`}
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
