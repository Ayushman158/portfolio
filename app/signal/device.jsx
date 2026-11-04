'use client'

/*
 * Device mockups for the case study, drawn in code so they stay sharp at any size and
 * carry real recordings. Proportions follow a current 6.1" iPhone (393 × 852 pt screen):
 * a thin titanium band, a black glass border, the Dynamic Island and the side buttons.
 * Everything is sized in container units of the phone, so one `width` scales it all.
 *
 * LiveActivity is a concept for a native Saathi (the web app can't reach the island or
 * the lock screen): the island opens to the step you need now, and the lock screen
 * keeps the whole route, so the phone can stay in the pocket.
 */
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { SIGN_FONT } from './font'

const VIOLET = '#7b3fe0'
const PINK = '#c2185b'
const EXIT = '#1e7b3a'

/* 9:41, signal, wi-fi, battery: the status bar every screenshot was missing. */
function StatusBar({ tone = 'dark', bg = 'transparent' }) {
  const c = tone === 'dark' ? '#0b0b0c' : '#ffffff'
  return (
    <div className="iph__status" style={{ background: bg, color: c }} aria-hidden="true">
      <span className="iph__time">9:41</span>
      <span className="iph__icons">
        <svg viewBox="0 0 18 12" className="iph__ico"><g fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></g></svg>
        <svg viewBox="0 0 16 12" className="iph__ico"><path fill="currentColor" d="M8 2.6c2.3 0 4.4.9 6 2.4l1.1-1.2A10.2 10.2 0 0 0 8 1 10.2 10.2 0 0 0 .9 3.8L2 5c1.6-1.5 3.7-2.4 6-2.4Zm0 3.3c1.4 0 2.7.5 3.7 1.4l1.1-1.2A7.1 7.1 0 0 0 8 4.3a7 7 0 0 0-4.8 1.8l1.1 1.2c1-.9 2.3-1.4 3.7-1.4Zm0 3.3c.6 0 1.1.2 1.5.6L8 11.5 6.5 9.8c.4-.4.9-.6 1.5-.6Z" /></svg>
        <svg viewBox="0 0 27 12" className="iph__ico iph__ico--bat"><rect x=".5" y=".5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" strokeOpacity=".4" /><rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" /><path d="M25 4v4c.8-.3 1.3-1.1 1.3-2S25.8 4.3 25 4Z" fill="currentColor" fillOpacity=".45" /></svg>
      </span>
    </div>
  )
}

/**
 * A phone around a screen. `children` fill the screen below the status bar (top-aligned,
 * cropped at the bottom like a scrolled page); pass `bare` to fill the whole glass.
 */
export function Phone({ children, bar = '#f4f4f4', tone = 'dark', bare = false, island, className = '', style }) {
  return (
    <div className={`iph ${className}`} style={style}>
      <span className="iph__btn iph__btn--action" aria-hidden="true" />
      <span className="iph__btn iph__btn--up" aria-hidden="true" />
      <span className="iph__btn iph__btn--down" aria-hidden="true" />
      <span className="iph__btn iph__btn--power" aria-hidden="true" />
      <div className="iph__band">
        <div className="iph__glass">
          <div className="iph__screen" style={{ background: bar }}>
            {!bare && <StatusBar tone={tone} />}
            <div className={bare ? 'iph__content iph__content--bare' : 'iph__content'}>{children}</div>
            {island ?? <span className="iph__island" aria-hidden="true" />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* A small badge in the line's colour: the number to remember. */
const Badge = ({ bg, children, size = 'md' }) => (
  <span className={`la-badge la-badge--${size}`} style={{ background: bg }}>{children}</span>
)
const ExitGlyph = () => (
  <svg viewBox="0 0 24 24" width="62%" height="62%" aria-hidden="true"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z" /></svg>
)

/*
 * The island: compact shows the platform and the change; expanded shows the step that
 * matters now, in the sign's own words. It breathes open and closed while on screen
 * (open 3.2 s, closed 1.8 s); a tap holds it where you leave it. Reduce Motion: open, still.
 */
function Island() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [held, setHeld] = useState(false)
  useEffect(() => {
    // Reduce Motion: start open and stay still; a tap still opens or closes it.
    if (reduce) { if (!held) setOpen(true); return }
    if (held || typeof IntersectionObserver === 'undefined') return
    let timer = 0
    let seen = false
    const cycle = (next) => {
      setOpen(next)
      timer = window.setTimeout(() => cycle(!next), next ? 3200 : 1800)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !seen) { seen = true; timer = window.setTimeout(() => cycle(true), 700) }
      if (!e.isIntersecting && seen) { seen = false; window.clearTimeout(timer); setOpen(false) }
    }, { threshold: 0.6 })
    if (ref.current) io.observe(ref.current)
    return () => { io.disconnect(); window.clearTimeout(timer) }
  }, [reduce, held])
  return (
    <button
      ref={ref}
      type="button"
      className={`la-island ${open ? 'is-open' : ''}`}
      onClick={() => { setHeld(true); setOpen((o) => !o) }}
      aria-label={open ? 'Dynamic Island, open: Platform 5, straight ahead. Tap to close' : 'Dynamic Island: platform 5, then platform 3. Tap to open'}
      aria-expanded={open}
      style={{ fontFamily: SIGN_FONT }}
    >
      <span className="la-island__compact" aria-hidden="true">
        <Badge bg={VIOLET} size="sm">5</Badge>
        <Badge bg={PINK} size="sm">3</Badge>
      </span>
      <span className="la-island__full" aria-hidden="true">
        <span className="la-island__row">
          <Badge bg={VIOLET} size="lg">5</Badge>
          <span className="la-island__text">
            <b>Platform 5, straight ahead</b>
            <small>Towards Raja Nahar Singh (Ballabhgarh)</small>
          </span>
        </span>
        <span className="la-island__foot">
          <span>Violet Line · 11 stops</span>
          <span>then <b style={{ color: '#f48fb1' }}>3</b> at Lajpat Nagar</span>
        </span>
      </span>
    </button>
  )
}

/* The lock screen card: the whole trip as one line, the way the route reads in the app. */
function LockCard() {
  const stops = [
    ['Kashmere Gate', VIOLET, '5'],
    ['Lajpat Nagar', PINK, '3'],
    ['Vinobapuri', EXIT, null],
  ]
  return (
    <div className="la-card" style={{ fontFamily: SIGN_FONT }}>
      <div className="la-card__head">
        <span className="la-card__app">
          <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path fill="#fff" d="M5 3h14a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H10l-5 4v-4a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" /><path d="M12 6.5l-4 4h2.6V14h2.8v-3.5H16z" fill="#121212" /></svg>
        </span>
        <span>Saathi</span>
        <span className="la-card__to">to Vinobapuri</span>
      </div>
      <div className="la-card__route">
        <span className="la-card__rail" aria-hidden="true">
          <i style={{ background: VIOLET }} />
          <i style={{ background: PINK }} />
        </span>
        {stops.map(([name, c, n]) => (
          <span key={name} className="la-card__stop">
            <Badge bg={c} size="md">{n ?? <ExitGlyph />}</Badge>
            <span className="la-card__name">{name}</span>
          </span>
        ))}
      </div>
      <p className="la-card__note">11 stops, then 1 · follow the green exit signs</p>
    </div>
  )
}

/* The concept: lock screen with the Live Activity, and the island above it. */
export function LiveActivity({ className = '' }) {
  return (
    <Phone
      bare
      className={`iph--lock ${className}`}
      bar="radial-gradient(120% 80% at 30% 0%, #4a3a86 0%, #241d45 45%, #121214 100%)"
      island={<Island />}
    >
      <StatusBar tone="light" />
      <div className="la-lock" style={{ fontFamily: SIGN_FONT }}>
        <p className="la-lock__date">Wednesday, 4 November</p>
        <p className="la-lock__clock">9:41</p>
      </div>
      <LockCard />
    </Phone>
  )
}
