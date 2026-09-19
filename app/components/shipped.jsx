'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import ScrambleText from './scramble-text'

/**
 * Shipped client work, shown rather than listed.
 *
 * The hairline index below this is still the right way to name work in
 * passing, but it has two limits for the things that are actually live: the
 * image only appears on hover, so a phone visitor never sees one at all, and
 * a row of text cannot say "this is real, go and use it."
 *
 * The card is the agency pattern — a shot of the running site, the name with
 * its live domain opposite, one line of what it is, then the parts of the job
 * that were mine. Two links, not one: the shot and the name open the case
 * study, the domain opens the site. Nesting them would be invalid markup and
 * would also hide the more interesting of the two.
 */
export default function Shipped({ label = 'Shipped', items, className = 'mt-16' }) {
  const reduceMotion = useReducedMotion()
  const section = useRef(null)
  const cards = useRef([])
  const turns = useTurns(section, cards, items)

  return (
    <section ref={section} className={className}>
      {/* The label rides the track, not the measure: a heading that does not
          share a left edge with the thing it names reads as an accident. */}
      <h2 className="track-wide text-faint text-[0.95rem] mb-4">
        <ScrambleText>{label}</ScrambleText>
      </h2>

      <div className="track-wide grid gap-x-5 gap-y-10 sm:grid-cols-2">
        {items.map((p, i) => (
          /* One card, one hover response, two destinations. The shot and the
             name used to react separately — hovering the shot scaled it while
             the name sat still, hovering the name underlined it while the shot
             sat still — which read as two unrelated controls stacked up. */
          <article
            key={p.name}
            ref={(el) => { cards.current[i] = el }}
            className="group"
            onMouseEnter={() => turns.take(i)}
            onMouseLeave={() => turns.release(i)}
            onFocus={() => turns.take(i)}
            onBlur={() => turns.release(i)}
          >
            <Link
              href={p.href}
              aria-label={`${p.name} — read the case study`}
              className="block overflow-hidden rounded-xl"
              style={{ border: '1px solid var(--rule)', background: 'var(--raised)' }}
            >
              {p.video && !reduceMotion ? (
                <Loop
                  src={p.video}
                  poster={p.shot}
                  playing={turns.playing === i}
                  repeat={turns.repeat(i)}
                  onEnded={() => turns.next(i)}
                />
              ) : (
                <Image
                  src={p.shot}
                  alt={p.alt}
                  width={1600}
                  height={900}
                  sizes="(min-width: 60rem) 460px, (min-width: 640px) 50vw, 100vw"
                  className={`aspect-video w-full object-cover object-top${
                    reduceMotion ? '' : ' transition-transform duration-500 ease-out group-hover:scale-[1.02]'
                  }`}
                />
              )}
            </Link>

            <div className="mt-3 flex items-baseline justify-between gap-4">
              <Link
                href={p.href}
                className="text-muted transition-colors duration-150 ease-out group-hover:text-ink focus-visible:text-ink"
              >
                {p.name}
              </Link>
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="prose-link shrink-0"
                  style={{ fontSize: '0.9rem' }}
                >
                  {/* The address is the "go and look" affordance, and a string of
                      characters resolving into a domain is the one place on the
                      page where the effect means something. */}
                  <ScrambleText delay={140 + i * 90}>{p.site}</ScrambleText>
                </a>
              ) : (
                // Research work has nothing live to link to, so the slot says
                // what the evidence is instead of pretending to be a domain.
                <span className="text-faint shrink-0" style={{ fontSize: '0.9rem' }}>{p.site}</span>
              )}
            </div>

            <p className="text-faint mt-1" style={{ fontSize: '0.95rem' }}>{p.what}</p>

            <ul className="mt-3 flex flex-wrap gap-1.5 p-0">
              {p.tags.map((t) => (
                <li key={t} className="chip">{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
 * TURNS
 *
 * Two loops side by side split attention, so the cards take turns: one
 * plays, the other rests on its most telling frame. When the playing loop
 * ends, the turn passes to the next card.
 *
 *   in view     the first card plays; the rest wait on their posters
 *   ended       the turn passes on (Kizuku → Signal → Kizuku …)
 *   hover/focus that card plays now, and repeats while held
 *   release     the held card finishes its loop, then passes the turn
 *   stacked     on a phone, whichever card is most on screen plays
 *   off screen  nothing plays
 * ───────────────────────────────────────────────────────── */

const STACKED = '(max-width: 639px)' // the grid is one column below sm

function useTurns(section, cards, items) {
  const order = items.map((p, i) => (p.video ? i : null)).filter((i) => i !== null)
  const [turn, setTurn] = useState(order[0] ?? null)
  const [held, setHeld] = useState(null)
  const [inView, setInView] = useState(false)
  const [stacked, setStacked] = useState(false)
  const [mostSeen, setMostSeen] = useState(null)

  useEffect(() => {
    const mq = window.matchMedia(STACKED)
    const set = () => setStacked(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  // Side by side: the section as a whole decides whether anything plays.
  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [section])

  // Stacked: each card reports how much of it is on screen; the most-seen
  // card with a video gets the turn, provided most of it is visible.
  useEffect(() => {
    if (!stacked) return
    const ratios = new Map()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => ratios.set(Number(e.target.dataset.turn), e.intersectionRatio))
      let best = null
      let top = 0.5
      ratios.forEach((r, i) => { if (r > top) { top = r; best = i } })
      setMostSeen(best)
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] })
    order.forEach((i) => {
      const el = cards.current[i]
      if (el) { el.dataset.turn = i; io.observe(el) }
    })
    return () => io.disconnect()
    // order is derived from items, which is a module constant on the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stacked, cards])

  const playing = stacked ? mostSeen : inView ? (held ?? turn) : null

  return {
    playing,
    // A held card, or the only card on a phone's screen, keeps looping.
    repeat: (i) => stacked || held === i,
    next: useCallback((i) => {
      const at = order.indexOf(i)
      setTurn(order[(at + 1) % order.length])
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order.join()]),
    take: (i) => { if (!stacked && items[i].video) setHeld(i) },
    // Letting go hands the turn to the card that was held, so it finishes
    // the loop it is in the middle of rather than cutting back.
    release: (i) => { if (held === i) { setTurn(i); setHeld(null) } },
  }
}

/**
 * A few seconds of the product doing its one thing — the card's shot, moving.
 * Muted and decorative (the link names the project). It plays only when it is
 * this card's turn; otherwise it rests on the poster, the loop's most telling
 * frame, a shade quieter so the eye goes to the card that is moving. A hairline
 * along the bottom shows how long this turn has left.
 */
function Loop({ src, poster, playing, repeat, onEnded }) {
  const ref = useRef(null)
  const [resting, setResting] = useState(true)
  const progress = useMotionValue(0)
  const width = useTransform(progress, (x) => `${x * 100}%`)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (playing) {
      if (v.ended) v.currentTime = 0
      v.play().catch(() => {})
    } else {
      v.pause()
      setResting(true)
      // Rewind behind the poster, so the next turn starts at the beginning.
      const t = setTimeout(() => { v.currentTime = 0; progress.set(0) }, 300)
      return () => clearTimeout(t)
    }
  }, [playing, progress])

  useEffect(() => {
    const v = ref.current
    if (v) v.loop = repeat
  }, [repeat])

  // The progress line follows the video frame by frame while it plays.
  useEffect(() => {
    if (!playing) return
    const v = ref.current
    let raf
    const tick = () => {
      if (v && v.duration) progress.set(v.currentTime / v.duration)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, progress])

  return (
    <div className="relative aspect-video w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]">
      <video
        ref={ref}
        src={src}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => setResting(false)}
        onEnded={onEnded}
        className="block h-full w-full object-cover"
      />
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-300 ease-out"
        style={{ opacity: resting ? 1 : 0, filter: playing ? 'none' : 'saturate(0.8) brightness(0.97)' }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px]"
        style={{ width, background: 'var(--ink)', opacity: playing && !repeat ? 0.45 : 0, transition: 'opacity 300ms' }}
      />
    </div>
  )
}
