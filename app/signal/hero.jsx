'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { Phones, ease, spring, useFitStage, useSequence } from '../components/hero-stage'

/**
 * Signal's opening moment, built rather than filmed: the lock-screen nudge
 * arrives, then the departure card, then the time, the confidence and the
 * reasons — in the order the product says them. Every string, colour and the
 * two typefaces come from the prototype (Inter, Geist Mono, #FF3E00).
 *
 * Storyboard pattern: one TIMING table, one stage integer. Stage n means
 * "everything up to beat n has happened", so any frame of the sequence can be
 * reached by setting a number — which is also what reduced motion does.
 *
 * After the card has said everything, it steps aside for the three screens it
 * lives on, holds, and the whole sequence loops. The homepage video is recorded
 * from this same component, so the card and the case study cannot drift apart.
 */

const ORANGE = '#FF3E00'
const MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

// ms from the start of the sequence to each beat
const TIMING = {
  notify: 150, // 1 — the lock-screen nudge drops in
  card: 900, // 2 — the departure card rises
  time: 1250, // 3 — "8:28" sets, digit by digit
  meter: 1700, // 4 — confidence fills to 74%
  reasons: 2450, // 5 — why it thinks so
  phones: 5050, // 6 — the cards step aside for the three screens they live on
  out: 8400, // the frame empties…
  restart: 8850, // …and the sequence begins again
}
const CARD_DONE = 5
const PHONES = 6
const BEATS = [TIMING.notify, TIMING.card, TIMING.time, TIMING.meter, TIMING.reasons, TIMING.phones]

// The three screens, as they sit on the cover: the confidence number, the
// first signal, and the lock-screen card.
const SCREENS = ['/signal/screens/confidence.webp', '/signal/screens/ready.webp', '/signal/screens/lockscreen.webp']

export default function SignalHero({ className = '' }) {
  const box = useRef(null)
  const { scale, tall, stage: s } = useFitStage(box)
  // Reduced motion: the finished card, still. It says the most in one frame.
  const { stage, leaving, fade } = useSequence(box, { beats: BEATS, out: TIMING.out, restart: TIMING.restart, still: CARD_DONE })
  const cardsAway = stage >= PHONES

  return (
    <div
      ref={box}
      className={`relative overflow-hidden ${className}`}
      style={{ background: ORANGE, aspectRatio: `${s.w} / ${s.h}`, fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}
      role="img"
      aria-label="Signal's departure card — leave by 8:28, 74% likely on time — then the three screens it lives on: the confidence number, the first signal, and the lock-screen card."
    >
      <motion.div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: s.w, height: s.h, scale }}
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: fade, ease }}
      >
        {/* the cards: they lift away as the phones arrive */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={cardsAway ? { opacity: 0, y: -24, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease }}
        >
          {tall ? (
            <>
              <div className="absolute" style={{ left: 20, top: 26, width: 360 }}><Notification stage={stage} /></div>
              <div className="absolute" style={{ left: 20, top: 190, width: 360 }}><Departure stage={stage} /></div>
            </>
          ) : (
            <>
              {/* The card overlaps the nudge but stops short of its Dismiss, so
                  nothing reads as cut off. */}
              <div className="absolute" style={{ left: 96, top: 96, width: 380 }}><Notification stage={stage} /></div>
              <div className="absolute" style={{ left: 440, top: 216, width: 430 }}><Departure stage={stage} /></div>
            </>
          )}
        </motion.div>

        <Phones on={cardsAway} screens={SCREENS} stage={s} tall={tall} shadow="rgba(90,20,0,0.55)" />
      </motion.div>
    </div>
  )
}

/* ── beat 1: the lock-screen nudge ──────────────────────────────────────── */

function Notification({ stage }) {
  const on = stage >= 1
  return (
    <motion.div
      initial={false}
      animate={on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -28, scale: 0.97 }}
      transition={spring}
      className="overflow-hidden bg-white"
      style={{ borderRadius: 18, boxShadow: '0 18px 40px -14px rgba(90,20,0,0.45)' }}
    >
      <div className="px-4 pb-3 pt-3.5">
        <div className="flex items-center gap-2">
          <AppIcon />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#141414' }}>Signal</span>
          <span className="ml-auto" style={{ fontSize: 12, color: '#6F6F6F' }}>now</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p style={{ fontSize: 16, fontWeight: 700, color: '#111', letterSpacing: '-0.01em' }}>Leave by 8:28 AM</p>
            <p className="mt-0.5 truncate" style={{ fontSize: 12.5, color: '#6F6F6F' }}>74% on time · Yellow Line · Dwarka Sec-21</p>
          </div>
          <Gauge on={on} />
        </div>
      </div>
      <div className="grid grid-cols-2" style={{ borderTop: '1px solid #ececec' }}>
        <span className="py-2.5 text-center" style={{ fontSize: 13.5, fontWeight: 600, color: '#D93400' }}>Open Rapido ↗</span>
        <span className="py-2.5 text-center" style={{ fontSize: 13.5, color: '#6F6F6F', borderLeft: '1px solid #ececec' }}>Dismiss</span>
      </div>
    </motion.div>
  )
}

function AppIcon() {
  return (
    <span className="grid h-[22px] w-[22px] place-items-center rounded-[6px]" style={{ background: '#111' }}>
      <span className="flex flex-col items-center gap-[2px]">
        <span className="block h-[2px] w-[10px] rounded-full bg-white/90" />
        <span className="block h-[2px] w-[10px] rounded-full bg-white/90" />
        <span className="block h-[2px] w-[7px] rounded-full" style={{ background: ORANGE }} />
      </span>
    </span>
  )
}

// A 240° arc; the fill draws to 74% of it.
function Gauge({ on }) {
  const arc = 'M 9 31 A 18 18 0 1 1 41 31'
  return (
    <svg width="50" height="38" viewBox="0 0 50 38" aria-hidden="true" className="shrink-0">
      <path d={arc} fill="none" stroke="#ececec" strokeWidth="4" strokeLinecap="round" />
      <motion.path
        d={arc}
        fill="none"
        stroke={ORANGE}
        strokeWidth="4"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: on ? 0.74 : 0 }}
        transition={{ duration: 1.1, delay: on ? 0.25 : 0, ease }}
      />
      <text x="25" y="29" textAnchor="middle" style={{ fontSize: 8.5, fontWeight: 700, fill: ORANGE, fontFamily: 'inherit' }}>74%</text>
    </svg>
  )
}

/* ── beats 2–5: the departure card ──────────────────────────────────────── */

function Departure({ stage }) {
  const on = stage >= 2
  return (
    <motion.div
      initial={false}
      animate={on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 36, scale: 0.97 }}
      transition={spring}
      style={{ background: '#0E0E0E', borderRadius: 22, padding: '22px 24px 18px', boxShadow: '0 30px 60px -20px rgba(60,10,0,0.6)' }}
    >
      <div className="flex items-baseline justify-between" style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.16em' }}>
        <span style={{ color: ORANGE, fontWeight: 600 }}>DEPARTURE SIGNAL</span>
        <span style={{ color: '#7a7a7a' }}>TUE, 6 MAY</span>
      </div>

      <div className="mt-3 flex items-baseline gap-3">
        <span style={{ color: '#8f8f8f', fontSize: 20 }}>Leave by</span>
        <Digits text="8:28" on={stage >= 3} />
      </div>

      <Meter on={stage >= 4} />

      <div className="mt-4 flex items-center justify-between gap-3" style={{ borderTop: '1px solid #262626', paddingTop: 12 }}>
        <p className="flex flex-wrap gap-x-1.5" style={{ fontSize: 13, color: '#7d7d7d' }}>
          {['Clear forecast', '·', 'Tue pattern strong', '·', '0 reports'].map((w, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={stage >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
              transition={{ duration: 0.35, delay: stage >= 5 ? i * 0.07 : 0, ease }}
            >
              {w}
            </motion.span>
          ))}
        </p>
        <motion.span
          initial={false}
          animate={stage >= 5 ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
          transition={{ duration: 0.35, delay: stage >= 5 ? 0.4 : 0, ease }}
          className="shrink-0"
          style={{ color: ORANGE, fontSize: 13.5, fontWeight: 500 }}
        >
          why →
        </motion.span>
      </div>
    </motion.div>
  )
}

// Each character rises out of its own mask, so the time sets like a
// departures board rather than fading in.
function Digits({ text, on }) {
  return (
    <span className="inline-flex" aria-label={text} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, lineHeight: 1, color: ORANGE, letterSpacing: '-0.02em' }}>
      {[...text].map((c, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden" style={{ paddingBottom: 2 }}>
          <motion.span
            className="inline-block"
            initial={false}
            animate={on ? { y: '0%', opacity: 1 } : { y: '105%', opacity: 0 }}
            transition={{ duration: 0.55, delay: on ? i * 0.07 : 0, ease }}
          >
            {c}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// The bar and the number move together: the percentage is read off the same
// motion value that sets the width.
function Meter({ on }) {
  const v = useMotionValue(0)
  const width = useTransform(v, (x) => `${x}%`)
  const [n, setN] = useState(0)

  useEffect(() => {
    const c = animate(v, on ? 74 : 0, { duration: on ? 1.2 : 0, ease })
    const off = v.on('change', (x) => setN(Math.round(x)))
    return () => { c.stop(); off() }
  }, [on, v])

  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="tabular-nums" style={{ color: '#fff', fontSize: 19, fontWeight: 600, minWidth: 44 }}>{n}%</span>
      <span className="relative h-[3px] flex-1 overflow-hidden rounded-full" style={{ background: '#2b2b2b' }}>
        <motion.span className="absolute inset-y-0 left-0 rounded-full" style={{ width, background: ORANGE }} />
      </span>
      <motion.span
        initial={false}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 0.4, delay: on ? 0.9 : 0 }}
        style={{ color: '#8f8f8f', fontSize: 14.5 }}
      >
        Likely on time
      </motion.span>
    </div>
  )
}
