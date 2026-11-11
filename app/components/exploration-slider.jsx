'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'motion/react'
import styles from './exploration-slider.module.css'

const clips = [
  { title: 'Koi Wishing Pond', video: '/research/koi-loop.mp4', poster: '/research/koi-loop.jpg', href: '/koi-wishing-pond' },
  { title: 'Album Alive', video: '/album-alive/scan.mp4', poster: '/album-alive/scan-poster.jpg', href: '/album-alive' },
  { title: 'Kizuku gestures', video: '/research/kizuku-loop.mp4', poster: '/research/kizuku-loop.jpg', href: '/kizuku' },
]

export function ExplorationDivider() {
  return <div className={styles.divider} aria-hidden="true" />
}

export default function ExplorationSlider({ showTitle = true }) {
  const track = useRef(null)
  const reduceMotion = useReducedMotion()
  const [playback, setPlayback] = useState(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const playing = playback ?? !reduceMotion

  useEffect(() => {
    const rail = track.current
    const videos = [...rail.querySelectorAll('video')]
    const observer = new IntersectionObserver((entries) => {
      for (const { target, intersectionRatio } of entries) {
        if (playing && intersectionRatio >= 0.65) target.play().catch(() => {})
        else target.pause()
      }
    }, { threshold: 0.65 })
    videos.forEach((video) => observer.observe(video))
    return () => {
      observer.disconnect()
      videos.forEach((video) => video.pause())
    }
  }, [playing])

  useEffect(() => {
    const rail = track.current
    function updateEdges() {
      setAtStart(rail.scrollLeft <= 2)
      setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2)
    }
    const observer = new ResizeObserver(updateEdges)
    observer.observe(rail)
    rail.addEventListener('scroll', updateEdges, { passive: true })
    return () => {
      observer.disconnect()
      rail.removeEventListener('scroll', updateEdges)
    }
  }, [])

  function move(direction) {
    const rail = track.current
    const [first, second] = rail.children
    const step = second.offsetLeft - first.offsetLeft
    rail.scrollBy({ left: direction * step, behavior: reduceMotion ? 'instant' : 'smooth' })
  }

  return (
    <section id="exploration" className={styles.section} aria-label="Exploration videos">
      <div className={styles.header}>
        {showTitle && <h2>Exploration</h2>}
        <div className={styles.controls}>
          <button type="button" onClick={() => setPlayback(!playing)}>{playing ? 'Pause videos' : 'Play videos'}</button>
          <button type="button" onClick={() => move(-1)} aria-label="Previous exploration" disabled={atStart}>←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next exploration" disabled={atEnd}>→</button>
        </div>
      </div>
      <ul ref={track} className={styles.track}>
        {clips.map(({ title, video, poster, href }) => (
          <li key={href}>
            <Link href={href} className={styles.card}>
              <video src={video} poster={poster} muted loop playsInline preload="none" aria-hidden="true" />
              <span>{title} <span aria-hidden="true">↗</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
