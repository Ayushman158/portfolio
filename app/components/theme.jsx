'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { usePathname } from 'next/navigation'

const ThemeContext = createContext({ theme: 'light', setTo: () => {}, themable: false })
export const useTheme = () => useContext(ThemeContext)

/*
 * Sunrise and sunset in Assam (Guwahati, 26.14°N 91.74°E) for today, in IST
 * minutes after midnight. A standard solar approximation: declination, the
 * hour angle at -0.83°, and the equation of time. Good to a few minutes, which
 * is all a lamp needs. Shared as a string with the pre-paint script below.
 */
const SUN_SRC = `function(){
  var d=new Date(),n=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5),lat=26.14*Math.PI/180;
  var decl=23.44*Math.PI/180*Math.sin(2*Math.PI*(284+n)/365);
  var ha=Math.acos(Math.max(-1,Math.min(1,(Math.sin(-0.83*Math.PI/180)-Math.sin(lat)*Math.sin(decl))/(Math.cos(lat)*Math.cos(decl)))))*180/Math.PI;
  var B=2*Math.PI*(n-81)/364,eot=9.87*Math.sin(2*B)-7.53*Math.cos(B)-1.5*Math.sin(B);
  var noon=720-4*(91.74-82.5)-eot;
  var m=(d.getUTCHours()*60+d.getUTCMinutes()+330)%1440;
  return {rise:noon-ha*4,set:noon+ha*4,now:m};
}`
// eslint-disable-next-line no-new-func
const assamSky = new Function(`return (${SUN_SRC})()`)

/**
 * Runs before first paint. A visitor's own choice wins; otherwise the site
 * follows the sky where Ayushman is: light while the sun is up in Assam, dark
 * after it sets.
 */
export const themeInitScript = `
(function(){try{
  var s=localStorage.getItem('theme');
  if(!s){var k=(${SUN_SRC})();s=(k.now<k.rise||k.now>k.set)?'dark':'light';}
  document.documentElement.dataset.theme=s;
}catch(e){}})();
`

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const themable = true

  // The pre-paint script already decided; read its answer rather than decide twice.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
    delete document.documentElement.dataset.lightOnly
  }, [])

  const apply = useCallback((next) => {
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch (e) {}
    setTheme(next)
  }, [])

  /**
   * Switch theme as a single cross-fade of the whole page (a View Transition),
   * so every surface changes together instead of each at its own CSS speed.
   * Browsers without View Transitions, and reduced motion, switch in place.
   */
  const setTo = useCallback((next) => {
    const root = document.documentElement
    if (reducedMotion() || !document.startViewTransition) {
      apply(next)
      return
    }
    root.classList.add('theme-switching')
    const vt = document.startViewTransition(() => flushSync(() => apply(next)))
    vt.finished.finally(() => root.classList.remove('theme-switching'))
  }, [apply])

  return (
    <ThemeContext.Provider value={{ theme, setTo, themable }}>{children}</ThemeContext.Provider>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * THE LAMP
 *
 * A pull-cord hanging from the top of the page, at the right edge of the
 * wide track. In light mode it is lit: a warm pool of light spreads from where
 * it hangs. Pull it down and let go, or click it; Enter and Space work too.
 * The cord is a damped spring (pull) and a damped pendulum (sway).
 *
 *   hangs to     a page can mark an element with data-lamp-target and the cord
 *                grows to hang the bead level with it (the avatar on the index,
 *                the bookshelf on About); elsewhere it hangs a short way down.
 *                On a narrow screen it stays up in the nav.
 *   tap          the cord jerks down, springs back, swings a little
 *   drag > 42px  arms the switch; release fires it (drag back up to disarm)
 *   dusk         within 40 minutes after sunset in Assam it sways once on
 *                its own
 * ───────────────────────────────────────────────────────────────────────── */
const LAMP = {
  inNav: 8,        // cord at rest when the bead sits in the nav (narrow screens)
  short: 118,      // cord on a wide page with no target
  maxPull: 110,    // how far the cord stretches
  arm: 42,         // pull past this to arm the switch
  disarm: 30,      // back above this and it disarms
  pullK: 240, pullDamp: 12,  // cord spring
  swayK: 36, swayDamp: 1.8,  // pendulum
  lenK: 90, lenDamp: 17,     // the cord paying out to a new length
  tapKick: 560, tapSway: 4,  // the jerk a click gives it
  bead: 22,                  // half the bead's hit area
}
const WIDE = '(min-width: 60rem)'

export function Lamp() {
  const { theme, setTo, themable } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [, render] = useState(0)
  const sim = useRef({ pull: 0, sway: 0, vp: 0, vs: 0, len: LAMP.inNav, target: LAMP.inNav, vl: 0, drag: null, raf: null })
  const isDark = mounted && theme === 'dark'

  const step = useCallback(() => {
    const s = sim.current
    const dt = 1 / 60
    if (!s.drag) { s.vp += (-LAMP.pullK * s.pull - LAMP.pullDamp * s.vp) * dt; s.pull += s.vp * dt }
    if (!s.drag || !s.drag.moved) { s.vs += (-LAMP.swayK * s.sway - LAMP.swayDamp * s.vs) * dt; s.sway += s.vs * dt }
    s.vl += (-LAMP.lenK * (s.len - s.target) - LAMP.lenDamp * s.vl) * dt; s.len += s.vl * dt
    const still = !s.drag && Math.abs(s.pull) < 0.2 && Math.abs(s.vp) < 0.5 && Math.abs(s.sway) < 0.05 &&
      Math.abs(s.vs) < 0.1 && Math.abs(s.len - s.target) < 0.3 && Math.abs(s.vl) < 0.5
    if (still) {
      s.pull = 0; s.sway = 0; s.len = s.target; s.raf = null
      render((n) => n + 1)
      return
    }
    render((n) => n + 1)
    s.raf = requestAnimationFrame(step)
  }, [])

  const kick = useCallback(() => {
    if (!sim.current.raf) sim.current.raf = requestAnimationFrame(step)
  }, [step])

  // Where to hang: level with the page's target, or the fallbacks above.
  const measure = useCallback((animate) => {
    const s = sim.current
    let target = LAMP.inNav
    if (window.matchMedia(WIDE).matches) {
      const el = document.querySelector('[data-lamp-target]')
      if (el) {
        const r = el.getBoundingClientRect()
        target = Math.round(r.top + window.scrollY + r.height / 2 - LAMP.bead)
      } else {
        target = LAMP.short
      }
    }
    s.target = target
    if (!animate || reducedMotion()) { s.len = target; s.vl = 0; render((n) => n + 1) } else kick()
  }, [kick])

  useEffect(() => {
    setMounted(true)
    const s = sim.current
    measure(false)
    const onResize = () => measure(false)
    window.addEventListener('resize', onResize)
    // Dusk: once, if the page is opened within 40 minutes after sunset in Assam.
    const { set, now } = assamSky()
    let t
    if (!reducedMotion() && now > set && now < set + 40) {
      t = setTimeout(() => { s.vs = 10; s.vp = 60; kick() }, 1200)
    }
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); cancelAnimationFrame(s.raf); s.unbind?.() }
  }, [kick, measure])

  // A new page: let its content settle, then pay the cord out to its target.
  // Measured twice: once the page has mostly arrived, and again after its
  // entrance has fully settled, so the bead ends up level with the target.
  useEffect(() => {
    const a = setTimeout(() => measure(true), 450)
    const b = setTimeout(() => measure(true), 1100)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [pathname, measure])

  const flip = useCallback(() => {
    setTo(theme === 'dark' ? 'light' : 'dark')
  }, [setTo, theme])

  const pullOnce = useCallback(() => {
    if (!reducedMotion()) {
      sim.current.vp = LAMP.tapKick
      sim.current.vs = LAMP.tapSway
      kick()
    }
    flip()
  }, [flip, kick])

  const onPointerDown = (e) => {
    e.preventDefault()
    const s = sim.current
    s.drag = { sx: e.clientX, sy: e.clientY, moved: false, armed: false }
    const reduce = reducedMotion()
    const move = (ev) => {
      const dx = ev.clientX - s.drag.sx
      const dy = ev.clientY - s.drag.sy
      if (Math.abs(dx) + Math.abs(dy) > 3) s.drag.moved = true
      const p = Math.max(0, Math.min(LAMP.maxPull, dy * 0.8))
      if (p > LAMP.arm) s.drag.armed = true
      if (p < LAMP.disarm) s.drag.armed = false
      s.vp = 0; s.vs = 0
      s.pull = reduce ? 0 : p
      s.sway = reduce ? 0 : Math.max(-14, Math.min(14, -dx * 0.12))
      render((n) => n + 1)
    }
    const up = () => {
      const d = s.drag
      s.drag = null
      s.unbind()
      if (!d.moved) pullOnce()
      else if (d.armed) { s.vs += (Math.random() - 0.5) * 8; flip() }
      kick()
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    s.unbind = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    kick()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pullOnce() }
  }

  if (!themable) return null

  const s = sim.current
  const cord = s.len + s.pull
  const sway = s.sway.toFixed(2)

  return (
    <>
      {/* The light it gives, behind everything, only while it is on. */}
      <div aria-hidden="true" className="lamp-glow-anchor pointer-events-none absolute inset-x-0 top-0 h-[400px] overflow-hidden">
        <div className="chrome-track relative h-0">
          <div className="lamp-glow absolute" />
        </div>
      </div>

      <div className="lamp-anchor pointer-events-none absolute inset-x-0 top-0 h-0">
        <div className="chrome-track relative h-0">
          <div className="lamp-pivot absolute top-0 h-0 w-0" style={{ transform: `rotate(${sway}deg)` }}>
            <span aria-hidden="true" className="lamp-cord absolute left-0 top-0 w-px" style={{ height: cord + LAMP.bead - 8 }} />
            <span
              role="switch"
              aria-checked={isDark}
              aria-label="Dark theme. Pull the lamp cord, or press Enter, to switch."
              tabIndex={0}
              onPointerDown={onPointerDown}
              onKeyDown={onKeyDown}
              className="lamp-bead pointer-events-auto absolute flex h-11 w-11 -translate-x-1/2 cursor-grab items-center justify-center rounded-full active:cursor-grabbing"
              style={{ top: cord, left: 0, touchAction: 'none' }}
            >
              <span className="lamp-pill block h-4 w-[7px] rounded" />
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Live local time. Note this is the only location signal left on the site — the
 * copy no longer states where Ayushman is or what arrangement he wants, so the
 * dock's IST readout is what tells a visitor his timezone.
 */
export function LocalClock({ className = '' }) {
  const [now, setNow] = useState(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Render nothing server-side; a clock cannot be prerendered without mismatching.
  if (!now) return <span className={className} aria-hidden="true" />

  const time = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  })

  // Hovering the clock answers the visitor's real question: what time is it
  // for me, and how far apart are we?
  const off = -now.getTimezoneOffset() - 330
  const yours = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()
  const gap = off === 0
    ? 'the same time as Assam'
    : `${Math.floor(Math.abs(off) / 60)}h${Math.abs(off) % 60 ? ` ${Math.abs(off) % 60}m` : ''} ${off < 0 ? 'behind' : 'ahead of'} Assam`

  return (
    <span className={`tnum cursor-default ${className}`.trim()} title={`It’s ${yours} for you, ${gap}`}>
      <span className="sr-only">Local time in India: </span>
      IST {time}
    </span>
  )
}
