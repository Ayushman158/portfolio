'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back } from '../components/case-study'

/*
 * The showreel on its own page. It lives here rather than on the index because
 * nearly everything in it — the avatar, the headline, the projects — is already
 * on the index; there it would only say the same things twice.
 *
 * It plays once, silent, when it scrolls into view, and rests on its last
 * frame. The chapters below are the table of contents: each one seeks the film.
 */

const CHAPTERS = [
  { at: 0, name: 'A question mark, and a camera slam' },
  { at: 1, name: 'The avatar, the grid, a handwritten hello' },
  { at: 2.5, name: 'Kinetic type: “figuring” resolves from mono into serif' },
  { at: 5, name: 'Signal: the departure time rolls in like an odometer' },
  { at: 7, name: 'Kizuku: a tree grows branch by branch' },
  { at: 9, name: 'Hoychoy: the owner’s steps flip to automatic' },
  { at: 11, name: 'A corridor through the work' },
  { at: 13, name: 'The end card' },
]

const stamp = (s) => `0:${String(Math.floor(s)).padStart(2, '0')}`

export default function Reel() {
  const reduceMotion = useReducedMotion()
  const video = useRef(null)
  const [ended, setEnded] = useState(false)
  const [playing, setPlaying] = useState(false)

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  // Plays once, the first time it is mostly on screen. Reduced motion never
  // autoplays; the film waits for a press.
  useEffect(() => {
    const v = video.current
    if (!v || reduceMotion) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {})
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduceMotion])

  const playFrom = (t) => {
    const v = video.current
    if (!v) return
    v.currentTime = t
    setEnded(false)
    v.play().catch(() => {})
  }

  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}><Back /></motion.div>

      <motion.div {...rise(0.04)} className="mt-8 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Showreel · 2026</p>
        <h1 className="display">Fifteen seconds, made in code.</h1>
        <p>
          I built it in Remotion, frame by frame, from the screens, colours and type of the projects on
          this site. Every cut lands on a beat, even though it plays here without sound.
        </p>
      </motion.div>

      <motion.figure {...rise(0.1)} className="track-wide mt-12">
        <div className="relative overflow-hidden rounded-xl" style={{ border: '1px solid var(--rule)', background: '#121110' }}>
          <video
            ref={video}
            src="/reel/showreel.mp4"
            poster="/reel/poster.jpg"
            muted
            playsInline
            preload="metadata"
            width={1920}
            height={1080}
            aria-label="Showreel, 15 seconds, no sound"
            className="block h-auto w-full"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => { setPlaying(false); setEnded(true) }}
          />
          {!playing && (
            <button
              type="button"
              onClick={() => playFrom(ended ? 0 : video.current?.currentTime ?? 0)}
              className="btn-primary absolute bottom-4 left-4"
              style={{ minHeight: 40, fontSize: '0.9rem' }}
            >
              {ended ? 'Play again' : 'Play'}
            </button>
          )}
        </div>
      </motion.figure>

      <motion.section {...rise(0.14)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-2">Chapters</h2>
        <ul className="border-t border-rule">
          {CHAPTERS.map((c) => (
            <li key={c.at}>
              <button type="button" onClick={() => playFrom(c.at)} className="index-row w-full text-left" style={{ gridTemplateColumns: '3.5rem 1fr' }}>
                <span className="tnum text-faint text-[0.9rem]">{stamp(c.at)}</span>
                <span>{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section {...rise(0.18)} className="mt-16">
        <p>
          The projects in it are in full on{' '}
          <Link href="/#work" className="prose-link">the work index</Link>.
        </p>
      </motion.section>
    </main>
  )
}
