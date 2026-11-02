'use client'

/*
 * The case study's demonstrations: screen recordings of the live app and the
 * sign test, and small interactive pieces where a recording can't explain as
 * well. Clips are silent MP4s recorded by signal-wayfinding/scripts/record-clips.ts;
 * their chapter times live beside them in /signal/clips/clips.json.
 * Colour still lives only in the content: the sign, the app, the line marks.
 */
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { W } from './wayfinding'
import manifest from '../../public/signal/clips/clips.json'

const C = '/signal/clips'

// Chapter times written by the recorder next to the clips; re-recording keeps them in step.
export const CLIPS = Object.fromEntries(Object.entries(manifest).map(([k, v]) => [k, v.steps.map((s) => [s.label, s.t])]))

/* Plays only while on screen; with Reduce Motion it waits for a tap. */
function useClip(ref, reduce) {
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const on = () => setPlaying(true)
    const off = () => setPlaying(false)
    v.addEventListener('play', on)
    v.addEventListener('pause', off)
    if (reduce || typeof IntersectionObserver === 'undefined') return () => { v.removeEventListener('play', on); v.removeEventListener('pause', off) }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.4 })
    io.observe(v)
    return () => { io.disconnect(); v.removeEventListener('play', on); v.removeEventListener('pause', off) }
  }, [ref, reduce])
  const toggle = () => { const v = ref.current; if (v) v.paused ? v.play().catch(() => {}) : v.pause() }
  return [playing, toggle]
}

function Frame({ shape, children }) {
  // A plain device outline: the recording is the phone screen, nothing invented around it.
  const r = shape === 'land' ? 'rounded-[1.4rem]' : 'rounded-[2rem]'
  return (
    <div className={`relative overflow-hidden ${r}`} style={{ border: '6px solid #121212', background: '#121212', boxShadow: '0 0 0 1px var(--rule)' }}>
      {children}
    </div>
  )
}

function PlayButton({ playing, toggle, label }) {
  return (
    <button type="button" onClick={toggle} aria-label={playing ? `Pause ${label}` : `Play ${label}`} className="sig-play absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full" style={{ background: 'var(--ground)', color: 'var(--ink)', border: '1px solid var(--rule)' }}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        {playing ? <path d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor" /> : <path d="M3 1.5v11l9-5.5z" fill="currentColor" />}
      </svg>
    </button>
  )
}

/* A short loop with no chapters: a single detail. */
export function Clip({ name, label, shape = 'phone' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [playing, toggle] = useClip(ref, reduce)
  return (
    <Frame shape={shape}>
      <video ref={ref} src={`${C}/${name}.mp4`} poster={`${C}/${name}.jpg`} muted loop playsInline preload="metadata" aria-label={label} className="block w-full" />
      <PlayButton playing={playing} toggle={toggle} label={label} />
    </Frame>
  )
}

/*
 * A recording with its steps beside it. The active step follows the video;
 * tapping a step jumps there. Segments under the video fill as each step plays.
 */
export function StepVideo({ name, label, shape = 'phone', className = '', steps: only }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [playing, toggle] = useClip(ref, reduce)
  const steps = only ?? CLIPS[name]
  const [t, setT] = useState(0)
  const [dur, setDur] = useState(0)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    let raf = 0
    const tick = () => { setT(v.currentTime); raf = requestAnimationFrame(tick) }
    const meta = () => setDur(v.duration || 0)
    v.addEventListener('loadedmetadata', meta)
    if (v.readyState >= 1) meta()
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); v.removeEventListener('loadedmetadata', meta) }
  }, [])
  const ends = steps.map((_, i) => steps[i + 1]?.[1] ?? dur)
  const active = Math.max(0, steps.findIndex((s, i) => t >= s[1] && t < ends[i]))
  const seek = (i) => { const v = ref.current; if (!v) return; v.currentTime = steps[i][1] + 0.01; v.play().catch(() => {}) }
  const land = shape === 'land'
  return (
    <div className={`grid items-start gap-6 ${land ? '' : 'sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-10'} ${className}`}>
      <div className={land ? '' : 'mx-auto w-full max-w-[15rem]'}>
        <Frame shape={shape}>
          <video ref={ref} src={`${C}/${name}.mp4`} poster={`${C}/${name}.jpg`} muted loop playsInline preload="metadata" aria-label={label} className="block w-full" />
          <PlayButton playing={playing} toggle={toggle} label={label} />
        </Frame>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {steps.map((s, i) => {
            const len = Math.max(0.01, ends[i] - s[1])
            const fill = t >= ends[i] ? 1 : t <= s[1] ? 0 : (t - s[1]) / len
            return (
              <span key={s[0]} className="h-[3px] overflow-hidden rounded-full" style={{ flex: len, background: 'var(--rule)' }}>
                <span className="block h-full" style={{ width: `${fill * 100}%`, background: 'var(--ink)' }} />
              </span>
            )
          })}
        </div>
      </div>
      <ol className="space-y-1">
        {steps.map((s, i) => (
          <li key={s[0]}>
            <button type="button" onClick={() => seek(i)} aria-current={i === active ? 'step' : undefined} className="grid w-full grid-cols-[1.6rem_1fr] items-baseline py-1.5 text-left transition-colors duration-200" style={{ color: i === active ? 'var(--ink)' : 'var(--faint)' }}>
              <span className="tnum" style={{ fontSize: '0.85rem' }}>{i + 1}</span>
              <span style={{ fontSize: '0.98rem', lineHeight: 1.45 }}>{s[0]}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/*
 * The test question, to try here: today's Kashmere Gate sign, then the
 * redesign. The reader answers before seeing how the 84 riders did.
 */
export function TryTheSign() {
  const [stage, setStage] = useState('today') // today → todayAnswered → redesign → redesignAnswered
  const [pick, setPick] = useState(null)
  const redesign = stage.startsWith('redesign')
  const answered = stage.endsWith('Answered')
  const choose = (a) => { setPick(a); setStage(redesign ? 'redesignAnswered' : 'todayAnswered') }
  const verdict = pick === '5' ? 'Right: platform 5.' : pick === 'Not sure' ? 'Platform 5.' : `Platform 5, not ${pick}.`
  return (
    <div className="track-wide mt-10">
      <div className="rounded-xl p-4 sm:p-6" style={{ border: '1px solid var(--rule)' }}>
        <p className="text-faint" style={{ fontSize: '0.85rem' }}>{redesign ? 'The redesign' : 'Today’s sign'} · Kashmere Gate</p>
        <p className="text-ink mt-1" style={{ fontSize: '1.15rem' }}>You’re going to <b>Lajpat Nagar</b>. Which platform?</p>
        <img key={redesign ? 'new' : 'today'} src={`${W}/${redesign ? 'kg-new' : 'kg-today'}.jpg`} alt={redesign ? 'The redesigned Kashmere Gate sign: one row per platform, each with a coloured number and two stations' : 'Today’s Kashmere Gate sign: each platform named only by the last station of its line'} className="sig-fade mt-4 block w-full rounded-lg" />
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Your answer">
          {['3', '4', '5', 'Not sure'].map((a) => {
            const right = answered && a === '5'
            const mine = answered && a === pick
            return (
              <button key={a} type="button" disabled={answered} onClick={() => choose(a)} className="sig-press min-w-[3.5rem] rounded-full px-4 py-2" style={{ border: '1px solid', borderColor: right || mine ? 'var(--ink)' : 'var(--rule)', background: right ? 'var(--ink)' : 'transparent', color: right ? 'var(--ground)' : 'var(--ink)', fontSize: '0.95rem' }}>
                {a}
              </button>
            )
          })}
        </div>
        <div aria-live="polite" className="mt-4 min-h-[3.2rem]">
          {answered && (
            <div className="sig-fade flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-ink" style={{ fontSize: '0.98rem' }}>
                {verdict} {redesign ? 'With the redesign, riders were right 80% of the time.' : 'With today’s signs, riders were right only 45% of the time.'}
              </p>
              {redesign ? (
                <button type="button" className="prose-link" onClick={() => { setStage('today'); setPick(null) }}>Start again</button>
              ) : (
                <button type="button" className="sig-press rounded-full px-4 py-2" style={{ background: 'var(--ink)', color: 'var(--ground)', fontSize: '0.95rem' }} onClick={() => { setStage('redesign'); setPick(null) }}>Now the redesign →</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/*
 * The key, built up: number, colour, name. Then each one in turn lights up,
 * and the other two are the confirmation. A diagram of the sign row, so the
 * line colour is content here.
 */
export function KeyBuild() {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? 3 : 0)
  const box = useRef(null)
  useEffect(() => {
    if (reduce) return
    let id = 0
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id)
      if (!e.isIntersecting) return
      setN(0)
      id = setInterval(() => setN((k) => (k + 1) % 7), 1100)
    }, { threshold: 0.5 })
    if (box.current) io.observe(box.current)
    return () => { io.disconnect(); clearInterval(id) }
  }, [reduce])
  // 0–2: the three parts arrive. 3–5: each is the one remembered. 6: all three.
  const shown = (k) => n > k || n >= 3
  const lit = (k) => n < 3 || n === 6 || n - 3 === k
  const parts = ['The number', 'The colour', 'The name']
  return (
    <div ref={box} className="mt-10">
      <div className="flex items-center gap-3 rounded-xl p-4 sm:gap-4 sm:p-5" style={{ background: '#1f2a6b' }} aria-label="A sign row: platform 5, Violet Line, Mandi House and Lajpat Nagar" role="img">
        <span className="sig-key grid h-14 w-14 shrink-0 place-items-center rounded-lg sm:h-16 sm:w-16" style={{ opacity: shown(0) ? (lit(0) ? 1 : 0.35) : 0, border: '3px solid #fbfbf8', color: '#fbfbf8', fontSize: '2rem', fontWeight: 800, background: shown(1) ? '#7b3fe0' : 'transparent', transition: 'opacity .4s ease, background-color .5s ease' }}>5</span>
        <span className="sig-key min-w-0" style={{ opacity: shown(2) ? (lit(2) ? 1 : 0.35) : 0, color: '#fbfbf8', transition: 'opacity .4s ease' }}>
          <span className="block truncate" style={{ fontSize: '0.8rem', color: '#c9cff0' }}>वायलेट लाइन · Violet Line</span>
          <span className="block truncate" style={{ fontSize: 'clamp(1.05rem, 3.6vw, 1.6rem)', fontWeight: 700 }}>Mandi House · Lajpat Nagar</span>
        </span>
      </div>
      <ol className="mt-4 grid grid-cols-3 gap-2" aria-hidden="true">
        {parts.map((p, k) => (
          <li key={p} className="border-t pt-2 transition-colors duration-300" style={{ borderColor: n - 3 === k ? 'var(--ink)' : 'var(--rule)', color: n - 3 === k ? 'var(--ink)' : 'var(--faint)', fontSize: '0.88rem' }}>{p}</li>
        ))}
      </ol>
      <p className="text-faint mt-3" style={{ fontSize: '0.88rem' }}>Remember any one of the three on the ticket, and the other two on the sign confirm it.</p>
    </div>
  )
}

/* Line marks under colour-blindness simulations (Machado 2009, full severity). */
const MATRIX = {
  normal: null,
  protan: '0.152286 1.052583 -0.204868 0 0  0.114503 0.786281 0.099216 0 0  -0.003882 -0.048116 1.051998 0 0  0 0 0 1 0',
  deutan: '0.367322 0.860646 -0.227968 0 0  0.280085 0.672501 0.047413 0 0  -0.011820 0.042940 0.968881 0 0  0 0 0 1 0',
  tritan: '1.255528 -0.076749 -0.178779 0 0  -0.078411 0.930809 0.147602 0 0  0.004733 0.691367 0.303900 0 0  0 0 0 1 0',
}
const MARKS = [
  ['R', 'Red', '#d32f2f', <rect key="s" x="10" y="10" width="80" height="80" rx="6" />],
  ['Y', 'Yellow', '#d4ac14', <polygon key="s" points="50,2 98,50 50,98 2,50" />],
  ['B', 'Blue', '#1f5bc4', <circle key="s" cx="50" cy="50" r="45" />],
  ['G', 'Green', '#1f7a33', <polygon key="s" points="50,6 96,90 4,90" />],
  ['V', 'Violet', '#7b3fe0', <polygon key="s" points="50,3 90.7,26.5 90.7,73.5 50,97 9.3,73.5 9.3,26.5" />],
  ['P', 'Pink', '#c2185b', null],
  ['M', 'Magenta', '#9b1b8e', <polygon key="s" points="68.4,5.7 94.3,31.6 94.3,68.4 68.4,94.3 31.6,94.3 5.7,68.4 5.7,31.6 31.6,5.7" />],
]
export function ColourBlind() {
  const [mode, setMode] = useState('normal')
  const names = { normal: 'Normal', protan: 'Protanopia', deutan: 'Deuteranopia', tritan: 'Tritanopia' }
  return (
    <div>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        {Object.entries(MATRIX).map(([k, m]) => m && <filter key={k} id={`cb-${k}`} colorInterpolationFilters="linearRGB"><feColorMatrix type="matrix" values={m} /></filter>)}
      </svg>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Simulate colour vision">
        {Object.keys(MATRIX).map((k) => (
          <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)} className="sig-press rounded-full px-3 py-1" style={{ fontSize: '0.85rem', border: '1px solid', borderColor: mode === k ? 'var(--ink)' : 'var(--rule)', background: mode === k ? 'var(--ink)' : 'transparent', color: mode === k ? 'var(--ground)' : 'var(--ink)' }}>{names[k]}</button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 rounded-xl p-3" style={{ background: '#fbfbf8', filter: MATRIX[mode] ? `url(#cb-${mode})` : 'none', transition: 'filter .3s' }} role="img" aria-label={`The seven line marks as seen with ${names[mode].toLowerCase()} vision: each keeps its own shape and letter`}>
        {MARKS.map(([l, n, c, shape]) => (
          <svg key={l} viewBox="0 0 100 100" className="w-full">
            {shape ? <g fill={c}>{shape}</g> : <circle cx="50" cy="50" r="38" fill="#fff" stroke={c} strokeWidth="14" />}
            <text x="50" y={l === 'G' ? 72 : 64} textAnchor="middle" fontSize="40" fontWeight="700" fill={shape ? '#fff' : c} fontFamily="Noto Sans, system-ui, sans-serif">{l}</text>
          </svg>
        ))}
      </div>
    </div>
  )
}

/*
 * The sign from further away: the same artwork, smaller and softer as the
 * distance grows. The platform number outlasts the station names.
 */
export function Distance() {
  const [d, setD] = useState(10)
  const scale = Math.min(1, 9 / d)
  const blur = Math.max(0, (d - 10) / 16)
  const reads = d <= 12 ? 'Everything reads, Hindi and English.' : d <= 24 ? 'Names start to go. The number, arrow and colour still read.' : 'Only the number, arrow and colour are left. That’s the part that decides.'
  return (
    <div>
      <div className="grid h-36 place-items-center overflow-hidden rounded-xl sm:h-44" style={{ background: 'var(--ink)' }}>
        <img src={`${W}/sign-art.jpg`} alt="" className="block w-[92%]" style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, transition: 'transform .15s linear, filter .15s linear' }} />
      </div>
      <label className="mt-4 block">
        <span className="flex justify-between text-faint" style={{ fontSize: '0.85rem' }}><span>Distance from the sign</span><span className="tnum text-ink">{d} m</span></span>
        <input type="range" min="5" max="40" step="1" value={d} onChange={(e) => setD(+e.target.value)} className="sig-range mt-2 w-full" />
      </label>
      <p className="text-ink mt-2" style={{ fontSize: '0.95rem' }} aria-live="polite">{reads}</p>
    </div>
  )
}
