'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { MUKTA } from './font'

/*
 * The four moving parts of the Signal page. Each one explains something about the
 * system; none is decoration. Reduced Motion gets the finished state of each, also
 * forced in globals.css because the hook can miss the setting on first paint.
 */

const N = '/signal/night'
const ARROW = '100,600 100,-200 500,200 500,-100 0,-600 -500,-100 -500,200 -100,-200 -100,600'
const Cap = ({ children }) => <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>{children}</figcaption>

/* Wide signs turn to hairs on a phone, so there they keep a readable size and pan sideways. */
export function Pan({ label, children }) {
  return (
    <div tabIndex={0} role="group" aria-label={`${label}. Scrolls sideways on small screens.`} className="overflow-x-auto rounded-lg sm:overflow-visible">
      <div className="min-w-[46rem] sm:min-w-0">{children}</div>
    </div>
  )
}
export const SwipeHint = () => <span className="sm:hidden">Swipe to read. </span>

/* The sign's 1u grid draws across it as it scrolls in: 120u wide, 15u tall, 1.5u margins. */
export function ForkConstruction({ alt, cap }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.4'] })
  const clipPath = useTransform(scrollYProgress, [0, 0.8], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'])
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0.45])
  return (
    <figure ref={ref} className="track-wide case-fig mt-8">
      <Pan label="The fork sign"><div className="relative overflow-hidden rounded-lg">
        <img src={`${N}/night-fork.jpg`} width={2400} height={300} loading="lazy" alt={alt} className="block h-auto w-full" />
        <motion.div
          aria-hidden="true"
          className="sig-grid absolute inset-0"
          style={{
            clipPath,
            opacity,
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,.62) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.62) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.2) 1px, transparent 1px)',
            backgroundSize: 'calc(100% / 24) calc(100% / 3), calc(100% / 24) calc(100% / 3), calc(100% / 120) calc(100% / 15), calc(100% / 120) calc(100% / 15)',
          }}
        >
          <span className="absolute" style={{ inset: '10% 1.25%', outline: '1px solid #ffc400' }} />
        </motion.div>
      </div></Pan>
      {cap && <Cap><SwipeHint />{cap}</Cap>}
    </figure>
  )
}

/* One arrow, turned in 45° steps as the page scrolls, with all eight directions beside it. */
export function ArrowTurn() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.3'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setI(Math.min(7, Math.max(0, Math.floor(v * 8)))))
  return (
    <div ref={ref} role="img" aria-label="The one sign arrow, turned in 45 degree steps to point in eight directions" className="sig-panel track-wide mt-8 flex items-center justify-between gap-6 rounded-lg px-6 py-10 sm:px-16 sm:py-16" style={{ background: '#121212' }}>
      <motion.svg aria-hidden="true" viewBox="-500 -600 1000 1200" className="h-auto w-[34%] max-w-[15rem] flex-none" fill="#fff" animate={{ rotate: reduce ? 0 : i * 45 }} transition={{ duration: 0.35, ease: [0.77, 0, 0.175, 1] }}>
        <polygon points={ARROW} />
      </motion.svg>
      <div className="grid w-[52%] max-w-[26rem] grid-cols-4 gap-x-4 gap-y-6">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
          <svg key={k} aria-hidden="true" viewBox="-500 -600 1000 1200" className="sig-dir h-auto w-full" fill="#fff" style={{ transform: `rotate(${k * 45}deg)`, opacity: reduce || k === i ? 1 : 0.28, transition: 'opacity 200ms ease' }}>
            <polygon points={ARROW} />
          </svg>
        ))}
      </div>
    </div>
  )
}

/* A rider's trip as a line: it fills as you scroll and each stop lights up as you reach it. */
export function Trip({ children }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] })
  return (
    <div ref={ref} className="track-wide relative mt-16 pl-[var(--p)] [--p:2rem] sm:[--p:3.5rem]">
      <span aria-hidden="true" className="absolute bottom-0 left-[6px] top-2 w-[3px]" style={{ background: 'var(--rule)' }} />
      <motion.span aria-hidden="true" className="sig-fill absolute bottom-0 left-[6px] top-2 w-[3px]" style={{ background: 'var(--ink)', scaleY: reduce ? 1 : scrollYProgress, transformOrigin: 'top' }} />
      {children}
    </div>
  )
}

export function Stop({ label, question, status, tested = false, src, alt, w, h, cap, framed = false, wide = false }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.62', 'start 0.52'] })
  const lit = useTransform(scrollYProgress, [0, 1], [0, 1])
  const fade = useTransform(scrollYProgress, [0, 1], [0.45, 1])
  return (
    <figure ref={ref} className="case-fig relative pb-14 last:pb-0 sm:pb-24">
      <span aria-hidden="true" className="absolute top-[0.32rem] h-[15px] w-[15px] rounded-full" style={{ left: 'calc(0px - var(--p))', background: 'var(--ground)', border: '3px solid var(--rule)' }} />
      <motion.span aria-hidden="true" className="sig-lit absolute top-[0.32rem] h-[15px] w-[15px] rounded-full" style={{ left: 'calc(0px - var(--p))', background: 'var(--ink)', opacity: reduce ? 1 : lit, scale: reduce ? 1 : lit }} />
      <motion.div className="sig-lit mb-4" style={{ opacity: reduce ? 1 : fade }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-faint" style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</p>
          {status && <span className={`sig-evidence${tested ? ' sig-evidence--tested' : ''}`}>{status}</span>}
        </div>
        {question && <p className="text-ink mt-2" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 2rem)', lineHeight: 1.18, textWrap: 'balance' }}>{question}</p>}
      </motion.div>
      {wide
        ? <Pan label={label}><img src={src} alt={alt} width={w} height={h} loading="lazy" className="block h-auto w-full" /></Pan>
        : <img src={src} alt={alt} width={w} height={h} loading="lazy" className="block h-auto w-full rounded-lg" style={framed ? { border: '1px solid var(--rule)' } : undefined} />}
      {cap && <Cap>{wide && <SwipeHint />}{cap}</Cap>}
    </figure>
  )
}

/*
 * The platform screen running: next train, then Arriving, then a service change.
 * Numbers swap with a short fade and only the new alert appears with movement,
 * matching the rule for these screens. It runs only while on screen.
 */
const HOLD = [3500, 3500, 5200]
export function LiveScreen({ cap }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduce = useReducedMotion()
  const [s, setS] = useState(0)
  useEffect(() => {
    if (!inView || reduce) return undefined
    const id = setTimeout(() => setS((x) => (x + 1) % 3), HOLD[s])
    return () => clearTimeout(id)
  }, [inView, s, reduce])
  const label = ['Next train in 3 minutes', 'Train arriving', 'Service change: Violet Line, a train every 12 minutes'][s]
  return (
    <figure ref={ref} className="track-wide case-fig mt-8">
      <div className="relative overflow-hidden rounded-lg" style={{ containerType: 'inline-size' }}>
        <img src={`${N}/digital-platform.jpg`} width={1920} height={1080} loading="lazy" alt="Platform screen: platform 5, Mandi House and Lajpat Nagar, with the stations ahead along the bottom" className="block h-auto w-full" />
        <img src={`${N}/digital-arriving.jpg`} width={1920} height={1080} loading="lazy" alt="" aria-hidden="true" className="absolute inset-0 block h-auto w-full" style={{ opacity: s === 1 ? 1 : 0, transition: 'opacity 200ms ease' }} />
        <motion.div
          aria-hidden="true"
          className="absolute"
          style={{ left: '2.6%', right: '2.6%', top: '9.5%', background: '#ffc400', padding: '0.7cqw 1.7cqw', transformOrigin: 'top' }}
          initial={false}
          animate={{ opacity: s === 2 ? 1 : 0, scaleY: s === 2 ? 1 : 0.92 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <span lang="hi" style={{ display: 'block', fontFamily: MUKTA, fontWeight: 800, color: '#1b1b1b', fontSize: '2.9cqw', lineHeight: 1.22, whiteSpace: 'nowrap' }}>वायलेट लाइन: हर 12 मिनट में गाड़ी</span>
          <span style={{ display: 'block', fontFamily: MUKTA, fontWeight: 800, color: '#1b1b1b', fontSize: '2.7cqw', lineHeight: 1.2, whiteSpace: 'nowrap' }}>Violet Line: a train every 12 min</span>
        </motion.div>
        <span className="sr-only" aria-live="off">{label}</span>
      </div>
      {cap && <Cap>{cap}</Cap>}
    </figure>
  )
}

/*
 * The night half of the page. Tokens are overridden in CSS, so every shared component
 * follows. While it fills the middle of the window the fixed menu and page ticks switch
 * too, otherwise their dark ink would vanish against it.
 */
export function NightZone({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    const root = document.documentElement
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) root.setAttribute('data-sig-night', '')
      else root.removeAttribute('data-sig-night')
    }, { rootMargin: '-75% 0px -25% 0px' })
    root.setAttribute('data-sig-flow', '')
    io.observe(ref.current)
    return () => { io.disconnect(); root.removeAttribute('data-sig-night'); root.removeAttribute('data-sig-flow') }
  }, [])
  return <div ref={ref} className="sig-night">{children}</div>
}

/*
 * Every section opens with a real sign row: arrow, numbered circle in a line colour,
 * Hindi and English. The band runs edge to edge like a panel hung across the page.
 * The sr-only span is the plain name for screen readers and the page position ticks.
 */
export function SignHead({ n, title, hi, colour, rot = 0, darkNumber = false, ring = false }) {
  return (
    <h2 data-route="" className="sig-band">
      <span className="headline sr-only">{title}</span>
      <span aria-hidden="true" className="flex items-center gap-4 sm:gap-8" style={{ fontFamily: MUKTA }}>
        <svg viewBox="-500 -600 1000 1200" fill="#fff" className="h-auto w-[clamp(2.1rem,4.2vw,4.2rem)] flex-none" style={{ transform: `rotate(${rot}deg)` }}><polygon points={ARROW} /></svg>
        <span className="grid aspect-square w-[clamp(3.2rem,6.4vw,6.4rem)] flex-none place-items-center rounded-full" style={{ background: colour, color: darkNumber ? '#1b1b1b' : '#fff', boxShadow: ring ? 'inset 0 0 0 3px #fff' : undefined, fontSize: 'clamp(2.1rem,4.4vw,4.4rem)', lineHeight: 1, fontWeight: 800 }}>{n}</span>
        <span className="block min-w-0 text-white" style={{ fontWeight: 800 }}>
          <span lang="hi" className="block" style={{ fontSize: 'clamp(1.35rem,2.7vw,2.7rem)', lineHeight: 1.2 }}>{hi}</span>
          <span className="block" style={{ fontSize: 'clamp(1.3rem,2.5vw,2.5rem)', lineHeight: 1.15 }}>{title}</span>
        </span>
      </span>
    </h2>
  )
}

/* The result as 100 dots each: one dot is one try in a hundred. Two states only, so ink carries it. */
function Dots({ n, label }) {
  const size = 11
  const gap = 5
  const w = 10 * size + 9 * gap
  return (
    <figure className="min-w-0 flex-1" style={{ maxWidth: '17rem' }}>
      <svg role="img" aria-label={`${n} of 100 tries reached the right platform first, ${label}`} viewBox={`0 0 ${w} ${w}`} className="block h-auto w-full">
        <title>{`${n} of 100 tries, ${label}`}</title>
        {Array.from({ length: 100 }, (_, i) => {
          const row = Math.floor(i / 10)
          const col = i % 10
          return <rect key={i} x={col * (size + gap)} y={(9 - row) * (size + gap)} width={size} height={size} rx={size / 2} fill={i < n ? 'var(--ink)' : 'var(--rule)'} />
        })}
      </svg>
      <figcaption className="mt-3 flex items-baseline gap-2">
        <span className="headline" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', lineHeight: 1 }}>{n}</span>
        <span className="text-faint" style={{ fontSize: '0.92rem', lineHeight: 1.3 }}>{label}</span>
      </figcaption>
    </figure>
  )
}

export function OutOf100({ before, after }) {
  return (
    <div className="mt-6 flex gap-8 sm:gap-12">
      <Dots n={before} label="today’s signs" />
      <Dots n={after} label="the first new sign" />
    </div>
  )
}
