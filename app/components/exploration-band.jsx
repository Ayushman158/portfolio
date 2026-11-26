'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PIECES, Media } from './pinboard'
import { createLens, lensMap } from './band-lens'
import styles from './exploration-band.module.css'

/*
 * Craft: the experiments and smaller work, as one slow, drifting band of
 * photos on the homepage (after hanif.rest, made ours). It replaced the
 * separate Exploration page and its pinboard.
 *
 * Rounded photos of each piece drift left in an endless loop, with no text on
 * them. The band is seen as if through a curved VR screen: the middle is flat
 * and sharp, and toward the left and right edges the picture grows taller, so
 * the photos' edges flare outward in a curve, smear sideways and pick up a
 * faint pink-and-cyan fringe, then fade. That part is drawn with WebGL
 * (band-lens.js); without WebGL the band falls back to plain photos that blur
 * and fade toward the edges.
 *
 * Mouse: hover a photo and the band coasts to a stop; a small dark pill with
 * the piece's name (or just "View", see BAND.caption.text) appears beside the
 * cursor and follows it, on the cursor's left near
 * the right edge. Click opens the piece.
 * Touch: drag the band sideways (it follows the finger and keeps gliding after
 * a flick, then eases back into its drift); tap a photo to open it. There is no
 * hover, so the photo in the middle is named under the band. Phones get
 * smaller photos and a gentler curve.
 * Keyboard: Tab moves through the pieces; the focused one glides to the middle
 * and its caption shows at its corner.
 * Mouse and trackpad can also drag it, or swipe it sideways with two fingers.
 * Reduced Motion: no drift.
 *
 * The links themselves stay in the page (invisible in the WebGL version) so
 * keyboards, screen readers and middle-clicks work as normal.
 *
 * All the numbers that shape it live in BAND. /lab/band has live dials for
 * them (DialKit); copy the tuned values back in here.
 */
export const BAND = {
  speed: 30,          // drift, in px per second, leftward
  width: 510,         // width of one photo, px (phones: at most 74% of the screen)
  gap: 30,            // space between photos, px
  radius: 18,         // corner rounding of the photos, px
  lens: {
    start: 0.81,      // where the curve begins: 0 = centre of the screen, 1 = the edge
    curve: 0.5,       // how much taller the picture gets at the very edge (0.5 = 50%)
    stretch: 0.1,     // how much wider it gets at the very edge
    split: 0.12,      // the pink/cyan colour fringe at the edge
    smear: 18,        // sideways smear at the very edge, px
    fade: 0.56,       // how much it fades at the very edge (0 to 1)
  },
  dissolve: 0,        // % of the width at each side that fades into the wall
  glow: 0,            // strength of the lamp glow behind the middle
  coast: 0.3,         // seconds to coast to a stop on hover
  caption: {
    offset: 20,       // distance from the cursor, px
    follow: 0.27,     // how loosely the caption trails the cursor, seconds
    text: 'name',     // what the hover pill says: 'name' (the piece's name) or 'view'
  },
}

const COPIES = 3    // the row is drawn three times so the loop never shows a gap
const RATIO = 0.706 // photo height / width
const NARROW = 700  // below this window width, the phone sizes apply

// Sizes for the current band width: phones get smaller photos, a gentler
// curve (still only at the outer edges, so the middle photo stays flat), and
// less room above and below.
function fit(p, W) {
  const narrow = W < NARROW
  const width = Math.round(Math.min(p.width, W * 0.74))
  return {
    width,
    gap: narrow ? Math.min(p.gap, 16) : p.gap,
    h: Math.round(width * RATIO),
    top: narrow ? 32 : 88,
    bottom: narrow ? 24 : 56,
    lens: narrow ? { ...p.lens, start: Math.max(p.lens.start, 0.78), curve: p.lens.curve * 0.7, smear: p.lens.smear * 0.6 } : p.lens,
  }
}

export default function ExplorationBand({ only, tune = BAND }) {
  const pieces = only ? only.map((t) => PIECES.find((p) => p.title === t)).filter(Boolean) : PIECES
  const band = useRef(null)
  const canvas = useRef(null)
  const items = useRef([])
  const videos = useRef({})
  const cap = useRef(null)
  const params = useRef(tune)
  params.current = tune
  const held = useRef(false)          // pointer over the band, or keyboard focus inside
  const hoverKey = useRef(-1)         // index of the photo under the mouse (WebGL mode)
  const seek = useRef(-1)             // keyboard: the photo gliding to the middle
  const drag = useRef(null)           // a finger or the mouse dragging the band
  const dragged = useRef(false)       // the last press was a drag, so it isn't also a click
  const wheel = useRef(0)             // trackpad sideways swipe, px, not yet applied
  const flat = useRef({ lefts: [], f: null, mid: 0, pad: 0, W: 0 }) // last frame's layout, for taps
  const pointer = useRef({ x: 0, y: 0, cx: 0, cy: 0, fresh: true, inside: false })
  const [mode, setMode] = useState('css') // 'gl' once WebGL is up
  const gl = useRef(false)            // the same, readable inside the animation loop
  const [shown, setShown] = useState(null) // the piece whose caption is up
  const [centre, setCentre] = useState(pieces[0])
  const [calm, setCalm] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const stop = useRef(false)
  stop.current = calm

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setCalm(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  // Videos for the WebGL textures play only while the band is on screen and moving.
  useEffect(() => {
    Object.values(videos.current).forEach((v) => {
      if (!v) return
      if (mode === 'gl' && onScreen && !calm) v.play().catch(() => {})
      else v.pause()
    })
  }, [mode, onScreen, calm])

  useEffect(() => {
    // Images (and video posters) for the WebGL textures.
    const stills = {}
    pieces.forEach((p) => { const im = new Image(); im.src = p.poster || p.img; stills[p.title] = im })

    const lens = createLens(canvas.current)
    gl.current = !!lens
    setMode(lens ? 'gl' : 'css')

    let raf = 0
    let last = performance.now()
    let x = 0            // how far the row has drifted, px
    let v = params.current.speed
    let visible = true
    let centreTitle = ''
    const lifts = new Map()
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; setOnScreen(e.isIntersecting) })
    io.observe(band.current)
    // Trackpad: a sideways two-finger swipe slides the band (vertical ones still scroll the page).
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      wheel.current -= e.deltaX
    }
    const bandEl = band.current
    bandEl.addEventListener('wheel', onWheel, { passive: false })

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible) return
      // Leaving the page: React lets go of the band a moment before this loop
      // is stopped, so a last frame can find it gone. Skip that frame.
      if (!band.current || !canvas.current) return
      const p = params.current
      const W = band.current.clientWidth
      const f = fit(p, W)
      const step = f.width + f.gap
      const copyW = pieces.length * step
      band.current.style.setProperty('--card-h', `${f.h}px`)
      band.current.style.setProperty('--top', `${f.top}px`)
      band.current.style.height = `${f.top + f.h + f.bottom}px`

      // Speed: a dragging finger moves the band directly; otherwise coast
      // toward the drift (0 while held or paused), so stops and flicks ease out.
      const d = drag.current
      if (wheel.current) { x += wheel.current; wheel.current = 0 }
      if (d && d.moved) {
        x += d.dx
        v = -d.vx // keep the finger's speed for the glide after release
        d.dx = 0
      } else {
        const target = held.current || stop.current ? 0 : p.speed
        // After a flick the band glides out slowly; a hover stop takes `coast`.
        const tc = d ? 0.45 : p.coast / 3
        const k = tc > 0 ? 1 - Math.exp(-dt / tc) : 1
        v += (target - v) * k
        x -= v * dt
      }

      // Flat layout: where each photo sits before the lens bends it.
      const place = (i) => {
        const left = i * step + x
        return ((left % (copyW * COPIES)) + copyW * COPIES) % (copyW * COPIES) - copyW
      }
      // Keyboard: glide the focused photo to the middle.
      if (seek.current >= 0) {
        const diff = (W / 2 - f.width / 2) - place(seek.current)
        x += diff * (1 - Math.exp(-dt / 0.12))
        v = 0
      }
      x %= copyW
      const lefts = items.current.map((_, i) => place(i))

      // The photo nearest the middle, named under the band on phones.
      let best = Infinity, bestI = 0
      lefts.forEach((l, i) => { const dd = Math.abs(l + f.width / 2 - W / 2); if (dd < best) { best = dd; bestI = i } })
      const ct = pieces[bestI % pieces.length].title
      if (ct !== centreTitle) { centreTitle = ct; setCentre(pieces[bestI % pieces.length]) }

      const ptr = pointer.current
      const bandH = band.current.clientHeight
      const pad = Math.ceil(f.h * f.lens.curve * 0.6 + 40)
      const mid = pad + f.top + f.h / 2
      flat.current = { lefts, f, mid, pad, W }

      if (lens) {
        // Canvas: the band plus room above and below for the flare.
        const c = canvas.current
        c.style.top = `${-pad}px`
        c.style.height = `${bandH + pad * 2}px`
        const dpr = Math.min(window.devicePixelRatio || 1, W < NARROW ? 1.25 : 1.5)
        const cw = Math.round(W * dpr), ch = Math.round((bandH + pad * 2) * dpr)
        if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch }

        // Which photo is under the mouse: undo the lens, then look in the flat layout.
        let under = -1
        if (ptr.inside) {
          const r = band.current.getBoundingClientRect()
          under = hit(ptr.x - r.left, ptr.y - r.top)
        }
        if (under !== hoverKey.current) {
          hoverKey.current = under
          if (seek.current < 0) setShown(under >= 0 ? pieces[under % pieces.length] : null)
          if (under >= 0) ptr.fresh = true
        }

        const cards = []
        lefts.forEach((l, i) => {
          if (l > W + 40 || l + f.width < -40) return
          const piece = pieces[i % pieces.length]
          const vid = videos.current[piece.title]
          const prev = lifts.get(i) || 0
          const lift = prev + ((i === under ? 1 : 0) - prev) * (1 - Math.exp(-dt / 0.09))
          lifts.set(i, lift)
          cards.push({
            key: piece.title,
            source: vid && vid.readyState >= 2 ? vid : stills[piece.title],
            x: l * dpr,
            y: (pad + f.top - 4 * lift) * dpr,
            w: f.width * dpr,
            h: f.h * dpr,
            lift,
          })
        })
        lens.draw(cards, {
          scale: dpr, radius: p.radius * dpr, mid: mid * dpr,
          start: f.lens.start, curve: f.lens.curve, stretch: f.lens.stretch,
          split: f.lens.split, smear: f.lens.smear * dpr, fade: f.lens.fade,
        })
      }

      // The links: placed flat (in WebGL mode they are invisible, for focus and
      // screen readers). In the plain version they also blur and fade.
      items.current.forEach((el, i) => {
        if (!el) return
        const left = lefts[i]
        el.style.width = `${f.width}px`
        el.style.transform = `translate3d(${left}px,0,0)`
        if (lens) return
        const dd = (left + f.width / 2 - W / 2) / (W / 2)
        const t = Math.min(1, Math.max(0, (Math.abs(dd) - f.lens.start) / (1 - f.lens.start || 1)))
        const e = t * t
        el.style.filter = e > 0.01 ? `blur(${(e * f.lens.smear * 0.6).toFixed(2)}px)` : 'none'
        el.style.opacity = String(1 - e * f.lens.fade)
      })

      // Keyboard: the caption sits at the focused photo's lower-left corner.
      if (seek.current >= 0) {
        const r = band.current.getBoundingClientRect()
        ptr.x = r.left + lefts[seek.current] + 4
        ptr.y = r.top + f.top + f.h - 4
      }

      // The caption trails the cursor a little, and sits on its left near the
      // right edge of the window so it never runs off screen.
      const cEl = cap.current
      if (cEl) {
        const kc = p.caption.follow > 0 ? 1 - Math.exp(-dt / p.caption.follow) : 1
        if (ptr.fresh) { ptr.cx = ptr.x; ptr.cy = ptr.y; ptr.fresh = false }
        ptr.cx += (ptr.x - ptr.cx) * kc
        ptr.cy += (ptr.y - ptr.cy) * kc
        const flip = ptr.x + p.caption.offset + cEl.offsetWidth > window.innerWidth - 16
        const cx = flip ? ptr.cx - p.caption.offset - cEl.offsetWidth : ptr.cx + p.caption.offset
        cEl.style.transform = `translate3d(${cx}px, ${ptr.cy + p.caption.offset}px, 0)`
      }
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); io.disconnect(); bandEl.removeEventListener('wheel', onWheel); lens?.dispose() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieces.length])

  // Which photo is at a point in the band (band-relative css px), seen through
  // the lens in the WebGL version. -1 for none.
  const hit = (bx, by) => {
    const { lefts, f, mid, pad, W } = flat.current
    if (!f) return -1
    const q = gl.current
      ? lensMap(bx, by + pad, W, mid, f.lens)
      : { x: bx, y: by + pad }
    let found = -1
    lefts.forEach((l, i) => { if (q.x >= l && q.x <= l + f.width && q.y >= mid - f.h / 2 && q.y <= mid + f.h / 2) found = i })
    return found
  }

  const open = (i, newTab) => {
    const a = items.current[i]?.querySelector('a')
    if (!a) return
    if (newTab) window.open(a.href, '_blank', 'noopener')
    else a.click()
  }

  // Drag the band with a finger or the mouse; it follows, then glides on after
  // a flick. A tap or click without movement opens the photo under it.
  const onDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragged.current = false
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, lastX: e.clientX, lastT: performance.now(), dx: 0, vx: 0, moved: false }
  }
  const onDrag = (e) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    if (!d.moved && Math.abs(e.clientX - d.x0) > 8 && Math.abs(e.clientX - d.x0) > Math.abs(e.clientY - d.y0)) {
      d.moved = true
      dragged.current = true
      band.current.dataset.dragging = ''
      e.currentTarget.setPointerCapture?.(e.pointerId)
    }
    if (!d.moved) return
    const now = performance.now()
    const step = e.clientX - d.lastX
    d.dx += step
    d.vx = step / Math.max(1, now - d.lastT) * 1000 * 0.8
    d.lastX = e.clientX
    d.lastT = now
  }
  const onUp = (e) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    if (!d.moved) {
      // A mouse click is handled by onBandClick; the plain version's photos
      // are real links and take the tap themselves.
      if (e.pointerType === 'mouse' || !gl.current) { drag.current = null; return }
      const r = band.current.getBoundingClientRect()
      const i = hit(e.clientX - r.left, e.clientY - r.top)
      if (i >= 0) open(i)
      drag.current = null
      return
    }
    delete band.current.dataset.dragging
    drag.current = { ...d, moved: false } // released: glide, then ease back to the drift
    setTimeout(() => { if (drag.current && !drag.current.moved) drag.current = null }, 1200)
  }

  const onMove = (e) => { pointer.current.x = e.clientX; pointer.current.y = e.clientY }
  // Plain version: the links themselves get the mouse hover.
  const enter = (p) => (e) => {
    if (mode === 'gl' || e.pointerType !== 'mouse') return
    pointer.current = { ...pointer.current, x: e.clientX, y: e.clientY, fresh: true }
    setShown(p)
  }
  const focusIn = (p, n) => () => {
    seek.current = n
    pointer.current.fresh = true
    setShown(p)
  }
  // WebGL version: a mouse click on the band opens the photo under the pointer.
  const onBandClick = (e) => {
    if (dragged.current) { dragged.current = false; return }
    if (mode !== 'gl' || hoverKey.current < 0) return
    if (e.target.closest('a')) return
    open(hoverKey.current, e.metaKey || e.ctrlKey)
  }

  const t = tune
  const h = Math.round(t.width * RATIO)
  return (
    <>
    <div className={styles.wrap}>
      <div
        ref={band}
        className={styles.band}
        data-mode={mode}
        style={{
          '--dissolve': `${t.dissolve}%`,
          '--glow': t.glow,
          '--radius': `${t.radius}px`,
          '--card-h': `${h}px`,
          '--top': '88px',
        }}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') { held.current = true; pointer.current.inside = true } }}
        onPointerLeave={(e) => { if (e.pointerType !== 'mouse') return; held.current = false; pointer.current.inside = false; if (mode !== 'gl') setShown(null) }}
        onPointerMove={(e) => { if (e.pointerType === 'mouse') onMove(e); onDrag(e) }}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => { drag.current = null; delete band.current.dataset.dragging }}
        // After a drag, the release must not also open a link (plain version: the links are real).
        onClickCapture={(e) => { if (dragged.current && e.target.closest('a')) { e.preventDefault(); e.stopPropagation(); dragged.current = false } }}
        onClick={onBandClick}
        onFocus={() => { held.current = true }}
        onBlur={() => { held.current = false; seek.current = -1; setShown(null) }}
      >
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
        {/* Video sources for the WebGL version (not shown themselves). */}
        {mode === 'gl' && (
          <div className={styles.pool} aria-hidden="true">
            {pieces.filter((p) => p.video).map((p) => (
              <video key={p.title} ref={(el) => { videos.current[p.title] = el }} src={p.video} poster={p.poster} muted loop playsInline preload="metadata" />
            ))}
          </div>
        )}
        <ul className={styles.row}>
          {Array.from({ length: COPIES }, (_, c) => pieces.map((p, i) => {
            const n = c * pieces.length + i
            // Only the middle copy is read out and tabbable; the others are the loop's repeats.
            const echo = c !== 1
            const inner = mode === 'gl'
              ? <span className={styles.ghost} />
              : <span className={styles.photo}><Media piece={p} play={!calm} /></span>
            const common = {
              className: styles.card,
              tabIndex: echo ? -1 : undefined,
              'aria-label': `${p.title}, ${p.note}${p.kind === 'out' ? ' (opens in a new tab)' : ''}`,
              onPointerEnter: enter(p),
              onPointerLeave: () => { if (mode !== 'gl') setShown(null) },
              onFocus: focusIn(p, n),
            }
            return (
              <li key={n} ref={(el) => { items.current[n] = el }} className={styles.item} aria-hidden={echo || undefined}>
                {p.kind === 'page' && <Link href={p.href} {...common}>{inner}</Link>}
                {p.kind === 'static' && <a href={p.href} {...common}>{inner}</a>}
                {p.kind === 'out' && <a href={p.href} target="_blank" rel="noopener noreferrer" {...common}>{inner}</a>}
              </li>
            )
          }))}
        </ul>
      </div>
    </div>
    {/* The caption beside the cursor (fixed, so it isn't clipped by the band). */}
    <div ref={cap} className={styles.cursorCap} data-on={shown ? '' : undefined} aria-hidden="true">
      {shown && <Pill piece={shown} text={t.caption.text} />}
    </div>
    {/* Phones (no hover): the photo in the middle, named under the band. */}
    <div className={styles.centreCap} aria-hidden="true"><Caption piece={centre} /></div>
    </>
  )
}

// The hover pill: the piece's name (the key point) or just "View".
function Pill({ piece, text }) {
  return (
    <span className={styles.pill}>
      {text === 'view' ? 'View' : piece.title}
      {piece.kind === 'out' && <OutArrow />}
    </span>
  )
}

function OutArrow() {
  return (
    <svg className={styles.out} width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 9 L9 3 M4 3 H9 V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Caption({ piece }) {
  return (
    <>
      <span className={styles.title}>
        {piece.title}
        {/* Opens another site: a small drawn arrow, not the ↗ character (it can turn into an emoji). */}
        {piece.kind === 'out' && (
          <svg className={styles.out} width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 9 L9 3 M4 3 H9 V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={styles.note}>{piece.note}</span>
    </>
  )
}
