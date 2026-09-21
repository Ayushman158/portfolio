'use client'

import { useEffect, useRef, useState } from 'react'
import { Newsreader } from 'next/font/google'
import { motion } from 'motion/react'
import { Phones, ease, spring, useFitStage, useSequence } from '../components/hero-stage'

/**
 * Kizuku's opening moment, built rather than filmed: the whole loop in one
 * frame. A worry is written, the app answers with one small action, it is
 * done, and the seed grows — from the doing, not from the days. Then the
 * three screens, a rest, and it begins again.
 *
 * Every line of copy is the app's own, from the screens further down the page.
 * The faces are the app's too: Newsreader for what it says to you, Satoshi for
 * what the interface says about itself.
 */

const newsreader = Newsreader({ subsets: ['latin'], weight: ['300', '400'], style: ['normal', 'italic'], variable: '--font-newsreader' })
const SERIF = 'var(--font-newsreader), Newsreader, Georgia, serif'
const SANS = 'Satoshi, var(--font-inter), system-ui, sans-serif'

const FIELD = 'linear-gradient(180deg, #D3E3C6 0%, #C2D9B2 46%, #B8D4AC 100%)'
const FOREST = '#2C5228'
const PAPER = '#FBF9F2'
const INK = '#1F2A1C'
const MUTED = '#7C8577'

const WORRY = 'I keep putting off the file i need to open'

// ms from the start of the sequence to each beat
const TIMING = {
  slip: 150, // 1 — the worry slip rises
  type: 650, // 2 — the worry is written, a letter at a time
  action: 2750, // 3 — one thing. right now.
  press: 3950, // 4 — "i'll do it now"
  grow: 4550, // 5 — the cards step aside; the seed opens into its plant
  tended: 5900, // 6 — today is tended.
  phones: 7900, // 7 — the three screens it lives on
  out: 11200, // the frame empties…
  restart: 11650, // …and the sequence begins again
}
const BEATS = [TIMING.slip, TIMING.type, TIMING.action, TIMING.press, TIMING.grow, TIMING.tended, TIMING.phones]
const ACTION_DONE = 4
const GROW = 5
const TENDED = 6
const PHONES = 7

const TYPE_MS = 1700 // how long the worry takes to write
const LINE = 34 // ruled line height on the worry slip, px

// The type reveal, the garden and the grown plant — the loop, as screens.
const SCREENS = ['/kizuku/app/reveal.jpg', '/kizuku/app/garden.jpg', '/kizuku/app/growth.jpg']

export default function KizukuHero({ className = '' }) {
  const box = useRef(null)
  const { scale, tall, stage: s } = useFitStage(box)
  // Reduced motion: the worry and the action it produced, still.
  const { stage, leaving, reduce, fade } = useSequence(box, { beats: BEATS, out: TIMING.out, restart: TIMING.restart, still: ACTION_DONE })
  const cardsAway = stage >= GROW
  const gardenAway = stage >= PHONES

  return (
    <div
      ref={box}
      className={`relative overflow-hidden ${newsreader.variable} ${className}`}
      style={{ background: FIELD, aspectRatio: `${s.w} / ${s.h}`, fontFamily: SANS }}
      role="img"
      aria-label="Kizuku's loop: the worry 'I keep putting off the file I need to open' becomes one action — open the file, write a single sentence — and when it is done, the seed grows into its plant. Then three screens: a type reveal, the garden, the grown plant."
    >
      <motion.div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: s.w, height: s.h, scale }}
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: fade, ease }}
      >
        {/* worry in, action out */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={cardsAway ? { opacity: 0, y: -24, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease }}
        >
          {tall ? (
            <>
              {/* No room for both on a phone: the worry steps aside for its answer. */}
              <motion.div
                className="absolute"
                style={{ left: 22, top: 40, width: 356 }}
                initial={false}
                animate={stage >= 3 && !reduce ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease }}
              >
                <Worry stage={stage} still={reduce} compact />
              </motion.div>
              {!reduce && <div className="absolute" style={{ left: 22, top: 40, width: 356 }}><Action stage={stage} compact /></div>}
            </>
          ) : (
            <>
              {/* Centred on the stage as a pair, the answer set a step lower than
                  the question so the eye reads left to right, then down. */}
              <div className="absolute" style={{ left: 64, top: 90, width: 410 }}><Worry stage={stage} still={reduce} /></div>
              <div className="absolute" style={{ left: 506, top: 132, width: 392 }}><Action stage={stage} /></div>
            </>
          )}
        </motion.div>

        {/* the payoff: growth from the doing */}
        <Garden stage={stage} on={cardsAway && !gardenAway} s={s} tall={tall} />

        <Phones on={gardenAway} screens={SCREENS} stage={s} tall={tall} ratio={620 / 1348} shadow="rgba(30,60,25,0.35)" />
      </motion.div>
    </div>
  )
}

/* ── beats 1–2: the worry ───────────────────────────────────────────────── */

function Worry({ stage, still, compact }) {
  const on = stage >= 1
  const typed = useTyping(WORRY, stage >= 2, still)
  return (
    <motion.div
      initial={false}
      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={spring}
    >
      <p style={{ fontSize: compact ? 11.5 : 13, letterSpacing: '0.08em', color: MUTED }}>today</p>
      <p className="mt-1" style={{ fontFamily: SERIF, fontWeight: 300, fontSize: compact ? 23 : 31, lineHeight: 1.18, color: INK }}>
        what future worry is on your mind right now?
      </p>
      {/* A slip torn off a pad: the ragged top edge is drawn against the
          field, and the shadow follows the tear rather than a box. */}
      <div className="mt-4" style={{ filter: 'drop-shadow(0 12px 18px rgba(30,60,25,0.22))' }}>
        <svg viewBox="0 0 372 12" preserveAspectRatio="none" className="block h-[12px] w-full" aria-hidden="true">
          <path d="M0 12 L0 6 L10 3 L19 7 L31 2 L42 6 L55 3 L66 8 L78 3 L90 6 L103 2 L115 7 L127 4 L140 7 L152 2 L165 6 L177 3 L190 8 L202 3 L214 6 L227 2 L239 7 L251 4 L264 7 L276 2 L289 6 L301 3 L314 8 L326 3 L338 6 L351 2 L362 6 L372 4 L372 12 Z" fill={PAPER} />
        </svg>
        <div style={{ background: PAPER, borderRadius: '0 0 18px 18px', marginTop: -1 }}>
          {/* Ruled like the app's slip: three lines to write on, so the field
              reads as a place for a real worry, not a one-line search box. */}
          <p
            className="px-5 pt-3"
            style={{
              fontSize: compact ? 15 : 17,
              lineHeight: `${LINE}px`,
              minHeight: LINE * 3 + 12,
              color: INK,
              backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${LINE - 1}px, #E7E4DA ${LINE - 1}px ${LINE}px)`,
              backgroundPosition: '0 12px',
              backgroundClip: 'content-box',
            }}
          >
            {typed}
            {!still && stage >= 1 && stage < 3 && <Caret />}
          </p>
          <div className="flex items-center gap-3 px-5 py-3" style={{ borderTop: '1px solid #ECE9E0' }}>
            <p className="flex-1" style={{ fontSize: compact ? 11.5 : 12.5, lineHeight: 1.4, color: MUTED }}>
              be specific. the more honest you are, the better your action will be.
            </p>
            <span aria-hidden="true" className="grid shrink-0 place-items-center rounded-full" style={{ width: 34, height: 34, background: '#EFEDE5', color: MUTED }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3.5 grid place-items-center" style={{ height: compact ? 42 : 50, borderRadius: 999, background: FOREST, color: '#fff', fontSize: compact ? 14 : 16, fontWeight: 500 }}>
        get my action →
      </div>
    </motion.div>
  )
}

function Caret() {
  return (
    <motion.span
      aria-hidden="true"
      className="ml-[1px] inline-block align-[-2px]"
      style={{ width: 1.5, height: '1.05em', background: '#4F6FD9' }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
    />
  )
}

// Letters at a steady pace, with the small hesitations of someone actually
// typing a worry: a beat after spaces.
function useTyping(text, on, still) {
  // Starts empty on both server and client — filling it during the first
  // render would make the two disagree and throw the page into client
  // rendering. The effect fills it in immediately afterwards.
  const [n, setN] = useState(0)
  useEffect(() => {
    if (still) { setN(text.length); return }
    if (!on) { setN(0); return }
    let i = 0
    let t
    const per = TYPE_MS / text.length
    const tick = () => {
      i += 1
      setN(i)
      if (i < text.length) t = setTimeout(tick, text[i - 1] === ' ' ? per * 1.8 : per * 0.8)
    }
    t = setTimeout(tick, per)
    return () => clearTimeout(t)
  }, [text, on, still])
  return text.slice(0, n)
}

/* ── beats 3–4: one thing, right now ────────────────────────────────────── */

function Action({ stage, compact }) {
  const on = stage >= 3
  const pressed = stage >= 4
  return (
    <motion.div
      initial={false}
      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={spring}
    >
      <p style={{ fontSize: compact ? 11.5 : 13, letterSpacing: '0.08em', color: MUTED }}>your action for today</p>
      <p className="mt-1" style={{ fontFamily: SERIF, fontWeight: 300, fontSize: compact ? 23 : 31, lineHeight: 1.18, color: INK }}>
        one thing. right now.
      </p>
      <div className="mt-4 px-6 py-5" style={{ background: PAPER, borderRadius: 18, boxShadow: '0 16px 36px -18px rgba(30,60,25,0.45)' }}>
        <p style={{ fontSize: compact ? 11.5 : 13, letterSpacing: '0.06em', color: MUTED }}>✧ start</p>
        <p className="mt-2" style={{ fontFamily: SERIF, fontSize: compact ? 16 : 20, lineHeight: 1.5, color: INK }}>
          open the file you’ve been avoiding. write a single sentence. close it again. that counts.
        </p>
      </div>
      <motion.div
        className="mt-3 grid place-items-center"
        initial={false}
        animate={pressed ? { scale: [1, 0.96, 1] } : { scale: 1 }}
        transition={{ duration: 0.32, ease }}
        style={{ height: compact ? 42 : 50, borderRadius: 999, background: FOREST, color: '#fff', fontSize: compact ? 14 : 16, fontWeight: 500 }}
      >
        i’ll do it now →
      </motion.div>
    </motion.div>
  )
}

/* ── beats 5–6: the seed, and today tended ──────────────────────────────── */

function Garden({ stage, on, s, tall }) {
  const plantScale = tall ? 0.95 : 1.15
  const plantW = 190 * plantScale
  const plantH = 261 * plantScale
  const toastW = tall ? 330 : 380
  // plant and note, centred as one block
  const top = tall ? 44 : 64
  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: on ? 1 : 0 }}
      transition={{ duration: 0.4, delay: on ? 0.35 : 0, ease }}
    >
      {/* a soft ground for the plant to stand on */}
      <div
        className="absolute rounded-[50%]"
        style={{ left: s.w / 2 - 150, top: top + plantH - 26, width: 300, height: 46, background: 'radial-gradient(closest-side, rgba(90,110,60,0.28), transparent)' }}
      />
      {/* The sprite restarts each time the beat arrives: keyed to `on`. */}
      <div
        key={on ? 'grow' : 'seed'}
        className="absolute"
        style={{
          left: s.w / 2 - plantW / 2,
          top,
          width: 190,
          height: 261,
          scale: plantScale,
          transformOrigin: 'top left',
          backgroundImage: 'url(/kizuku/growth-sprite.png)',
          backgroundRepeat: 'no-repeat',
          animation: on ? 'kz-grow-once 1.6s steps(12) 0.45s both' : 'none',
        }}
      />
      <motion.div
        className="absolute flex items-center gap-4 px-5 py-4"
        style={{ left: s.w / 2 - toastW / 2, top: top + plantH + 26, width: toastW, background: FOREST, borderRadius: 16, color: '#fff', boxShadow: '0 18px 36px -16px rgba(20,50,20,0.55)' }}
        initial={false}
        animate={stage >= TENDED && on ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={spring}
      >
        <div className="flex-1">
          <p style={{ fontSize: 17, fontWeight: 500 }}>today is tended.</p>
          <p className="mt-1" style={{ fontSize: 12.5, opacity: 0.72 }}>if something else comes up, you can go again.</p>
        </div>
        <span aria-hidden="true" style={{ fontSize: 20 }}>✓</span>
      </motion.div>
    </motion.div>
  )
}
