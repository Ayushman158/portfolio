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
import manifest from '../../public/signal/clips/clips.json'
import { Phone } from './device'

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
  // Phone recordings sit in the drawn iPhone; landscape test clips keep a plain outline.
  if (shape !== 'land') return <Phone bar="#ffffff">{children}</Phone>
  const r = 'rounded-[1.4rem]'
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
    <div className={`grid items-start gap-6 ${land ? '' : 'sm:grid-cols-[minmax(0,16.5rem)_1fr] sm:gap-12'} ${className}`}>
      <div className={land ? '' : 'mx-auto w-full max-w-[16.5rem]'}>
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
