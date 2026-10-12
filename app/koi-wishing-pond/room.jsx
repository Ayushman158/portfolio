'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * The room around the words. The installation was a dark lab lit only by the
 * pond and a few candle lanterns, with water and music playing. Below the live
 * pond, this keeps a little of that:
 *
 *   dark      the page is always the site's dark theme here (the lamp cord is
 *             hidden: the room's lights are off), and the reader's own theme
 *             comes back when they leave
 *   lanterns  two warm glows low at the edges of the window, breathing slowly
 *   koi       koi in the empty margins either side of the text (see MarginKoi),
 *             curious about the pointer, never crossing the words
 *   sound     a quiet toggle for the water and music, off until asked for
 *
 * Reduced motion keeps the dark and the still lantern light, and no koi.
 */

const ATLAS = '/koi-wishing-pond/pond/a/koi_atlas.webp'   // 4 x 2 koi, head up, 320 x 480 each
const AMBIENT = '/koi-wishing-pond/pond/a/ambient.m4a'

/** The room is dark: switch the site to dark for as long as this page is open. */
function useDarkRoom() {
  useEffect(() => {
    const root = document.documentElement
    const before = root.dataset.theme
    root.dataset.theme = 'dark'
    root.dataset.room = ''
    return () => { if (before) root.dataset.theme = before; delete root.dataset.room }
  }, [])
}

/** Two candle lanterns, low at either edge of the window. */
function Lanterns() {
  return (
    <div aria-hidden="true" className="koi-lanterns pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
      <span className="koi-lantern" style={{ left: '-10rem', bottom: '-6rem' }} />
      <span className="koi-lantern" style={{ right: '-10rem', bottom: '-6rem', animationDelay: '-3.1s' }} />
    </div>
  )
}

/**
 * Koi in the margins. A 2D cousin of the pond's koi: they swim in bursts and
 * glides, turn on a slowly wandering heading (a few layered sines, so the path
 * never repeats), bend their bodies in slices so the tail swings, and steer
 * softly away from the words and the window's edges. A pointer held still in a
 * koi's margin draws it over.
 *
 * Passing through: usually the margins are empty. Every 10-20 s one koi swims in
 * from above or below the window, wanders the length of one margin (sometimes
 * circling once on the way), and leaves off the other end. Chosen over two koi
 * idling in the margins, and over a pair, as the least busy beside the words.
 */

function MarginKoi({ column }) {
  const canvas = useRef(null)
  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const img = new Image(); img.src = ATLAS
    let raf = 0, W = 0, H = 0, dpr = 1, last = performance.now(), lastScroll = window.scrollY, clock = 0
    const ptr = { x: -9999, y: -9999, t: -9 }
    const rand = (a, b) => a + Math.random() * (b - a)
    const wrapA = (d) => Math.atan2(Math.sin(d), Math.cos(d))
    const CELLS = [0, 1, 3, 5, 6, 7]

    const bounds = () => {
      const el = column.current
      const r = el ? el.getBoundingClientRect() : { left: W / 2 - 360, right: W / 2 + 360 }
      return { l: r.left - 64, r: r.right + 64 }
    }
    const margin = (side) => { const b = bounds(); return side < 0 ? [24, b.l] : [b.r, W - 24] }
    const roomy = () => { const b = bounds(); return Math.min(b.l, W - b.r) > 150 }

    const fish = []
    const koi = (side, o = {}) => {
      const [x0, x1] = margin(side)
      return {
        side, cell: CELLS[Math.floor(Math.random() * CELLS.length)], len: rand(80, 100),
        x: rand(x0 + 20, x1 - 20), y: rand(120, H - 120), a: rand(0, 6.28), v: 0,
        base: rand(28, 40), phase: rand(0, 6.28), burst: rand(0, 6.28),
        n: [rand(0, 6.28), rand(0, 6.28), rand(0, 6.28)], dir: Math.random() < 0.5 ? -1 : 1, circle: 0, circleDir: 1, ...o,
      }
    }

    // the first visitor comes soon after the page opens (or the window changes size)
    let nextVisit = 0
    const cast = () => { fish.length = 0; nextVisit = clock + rand(2, 5) }
    const visit = () => {                            // one koi swims in from beyond an edge of the window
      const side = Math.random() < 0.5 ? -1 : 1, [x0, x1] = margin(side)
      const fromTop = Math.random() < 0.5
      const f = koi(side, { x: rand(x0 + 30, x1 - 30), y: fromTop ? -110 : H + 110, dir: fromTop ? 1 : -1, base: rand(38, 50) })
      f.a = f.dir * Math.PI / 2 + rand(-0.4, 0.4)
      f.circleAt = Math.random() < 0.4 ? 1 : -1
      fish.push(f)
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth; H = window.innerHeight
      cv.width = W * dpr; cv.height = H * dpr
      cv.style.width = W + 'px'; cv.style.height = H + 'px'
      cast()
    }

    const draw = (f) => {
      const cw = 320, ch = 480, sx = (f.cell % 4) * cw, sy = Math.floor(f.cell / 4) * ch
      const w = f.len * (cw / ch), h = f.len, slices = 14
      ctx.save()
      ctx.translate(f.x * dpr, f.y * dpr)
      ctx.rotate(f.a + Math.PI / 2)        // the atlas swims up the image
      ctx.scale(dpr, dpr)
      for (let i = 0; i < slices; i++) {
        const v = i / slices                 // 0 at the head, 1 at the tail
        const sway = Math.sin(f.phase - v * 3.2) * (2 + 13 * v * v) * (0.5 + f.v / 50)
        ctx.drawImage(img, sx, sy + v * ch, cw, ch / slices + 1, -w / 2 + sway, -h / 2 + v * h, w, h / slices + 0.6)
      }
      ctx.restore()
    }

    // One koi's steering for this frame. Margins are tall and narrow, so a koi swims the
    // length of its margin, weaving on a wandering heading. It looks ahead, and if that
    // point would leave the margin it curves back toward the middle. Then: one circle, curiosity.
    const steer = (f, dt, b) => {
      const t = clock
      const [x0, x1] = f.side < 0 ? [24, b.l] : [b.r, W - 24]
      const mid = (x0 + x1) / 2, half = Math.max(30, (x1 - x0) / 2 - 46)
      const wander = Math.sin(t * 0.21 + f.n[0]) + 0.6 * Math.sin(t * 0.53 + f.n[1]) + 0.3 * Math.sin(t * 1.27 + f.n[2])
      let desired = f.dir * Math.PI / 2 + 0.5 * wander
      const ahead = f.x + Math.cos(f.a) * 90
      if (Math.abs(ahead - mid) > half) desired = Math.atan2(f.dir * 0.9, Math.sign(mid - ahead))
      let turn = wrapA(desired - f.a) * 1.3
      // a slow circle now and then (a), or once mid-visit (b)
      // a circle only starts near the middle of the margin, sized to fit it, and lasts one turn
      const centred = Math.abs(f.x - mid) < half * 0.35, rate = Math.max(0.7, f.v / Math.max(40, half * 0.7))
      if (f.circleAt > 0 && centred && f.y > H * 0.3 && f.y < H * 0.7) { f.circle = 6.283 / rate; f.circleDir = Math.random() < 0.5 ? -1 : 1; f.circleAt = -1 }
      if (f.circle > 0) { f.circle -= dt; turn = rate * f.circleDir; if (Math.abs(ahead - mid) > half + 20) f.circle = 0 }
      // curious: a pointer held still in this koi's margin
      const inMargin = f.side < 0 ? ptr.x < b.l : ptr.x > b.r
      if (inMargin && t - ptr.t < 2.5 && Math.hypot(ptr.x - f.x, ptr.y - f.y) < 280) turn = wrapA(Math.atan2(ptr.y - f.y, ptr.x - f.x) - f.a) * 1.6
      f.a += Math.max(-1.4, Math.min(1.4, turn)) * dt
      // burst and glide
      f.burst += dt * 0.9
      f.v = f.base * (0.75 + 0.8 * Math.pow(Math.max(0, Math.sin(f.burst)), 3))
      f.x += Math.cos(f.a) * f.v * dt; f.y += Math.sin(f.a) * f.v * dt
      f.x = Math.min(Math.max(f.x, x0), x1 - 10)          // never into the words or off the side
      f.phase += dt * (2.4 + f.v / 8)
    }

    const step = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05); last = t; clock += dt
      const scroll = window.scrollY - lastScroll; lastScroll = window.scrollY
      ctx.clearRect(0, 0, cv.width, cv.height)
      const b = bounds()
      if (roomy() && !fish.length && clock > nextVisit) visit()
      for (let i = fish.length - 1; i >= 0; i--) {
        const f = fish[i]
        f.y -= scroll * 0.1                                   // scrolling stirs them a little
        steer(f, dt, b)
        const gone = f.y < -160 || f.y > H + 160
        if (gone && (f.y - H / 2) * f.dir > 0) { fish.splice(i, 1); nextVisit = clock + rand(10, 20); continue }   // out the far end: gone
        // fade in from and out to the edges of the window
        const edge = Math.min(1, Math.max(0, Math.min(f.y + 80, H + 80 - f.y) / 160))
        ctx.globalAlpha = 0.5 * edge
        if (img.complete) draw(f)
      }
      raf = requestAnimationFrame(step)
    }

    const onMove = (e) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = clock }
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(step) } }
    resize()
    addEventListener('resize', resize); addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize); removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [column])
  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }} />
}

/** Water and music, quietly, once the reader asks. Silent while the live pond is on screen (it has its own). */
function SoundToggle({ hero }) {
  const audio = useRef(null)
  const [on, setOn] = useState(false)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = hero.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [hero])
  useEffect(() => {
    const a = audio.current
    if (!a) return
    let raf = 0
    const goal = on && shown ? 0.35 : 0
    if (goal > 0 && a.paused) a.play().catch(() => setOn(false))
    const fade = () => {
      a.volume = Math.max(0, Math.min(1, a.volume + Math.sign(goal - a.volume) * 0.02))
      if (Math.abs(a.volume - goal) > 0.02) raf = requestAnimationFrame(fade)
      else { a.volume = goal; if (goal === 0) a.pause() }
    }
    raf = requestAnimationFrame(fade)
    return () => cancelAnimationFrame(raf)
  }, [on, shown])
  return (
    <>
      <audio ref={audio} src={AMBIENT} loop preload="none" />
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className="fixed bottom-5 right-5 z-40 inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-[0.9rem]"
        style={{
          color: 'var(--ink)', background: 'color-mix(in srgb, var(--raised) 80%, transparent)', border: '1px solid var(--rule)',
          backdropFilter: 'blur(8px)', opacity: shown ? 1 : 0, pointerEvents: shown ? 'auto' : 'none',
          transition: 'opacity 400ms ease',
        }}
      >
        {on ? 'Sound on' : 'Sound off'}
      </button>
    </>
  )
}

export function Room({ column, hero, reduceMotion }) {
  useDarkRoom()
  return (
    <>
      <Lanterns />
      {!reduceMotion && <MarginKoi column={column} />}
      <SoundToggle hero={hero} />
    </>
  )
}
