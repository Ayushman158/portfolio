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
 *   koi       a few koi drift through the empty margins either side of the
 *             text, curious about the pointer, never crossing the words
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
 * Koi in the margins. A 2D cousin of the pond's koi: each one steers toward a
 * point in its margin, turns gently, and bends its body in slices so the tail
 * swings as it swims. The column of text (and a gap around it) is out of bounds.
 */
function MarginKoi({ column }) {
  const canvas = useRef(null)
  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const img = new Image(); img.src = ATLAS
    let raf = 0, W = 0, H = 0, dpr = 1, last = performance.now(), lastScroll = window.scrollY
    const ptr = { x: -9999, y: -9999, t: 0 }
    const rand = (a, b) => a + Math.random() * (b - a)

    // where the words are: the koi keep this much clear either side of it
    const bounds = () => {
      const el = column.current
      const r = el ? el.getBoundingClientRect() : { left: W / 2 - 360, right: W / 2 + 360 }
      return { l: r.left - 56, r: r.right + 56 }
    }
    const pickSide = (side) => {
      const b = bounds()
      return side < 0 ? rand(40, Math.max(60, b.l - 40)) : rand(Math.min(W - 60, b.r + 40), W - 40)
    }
    const fish = []
    const make = (i) => {
      const side = i % 2 ? 1 : -1
      const f = { side, cell: [0, 3, 5, 1, 6][i % 5], len: rand(78, 104), phase: rand(0, 6.28), speed: rand(22, 34) }
      f.x = pickSide(side); f.y = rand(80, H - 80); f.a = rand(0, 6.28)
      f.tx = pickSide(side); f.ty = rand(80, H - 80)
      return f
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth; H = window.innerHeight
      cv.width = W * dpr; cv.height = H * dpr
      cv.style.width = W + 'px'; cv.style.height = H + 'px'
      const b = bounds()
      const room = Math.min(b.l, W - b.r)
      const n = room > 180 ? 5 : room > 110 ? 3 : 0     // no margin, no koi
      fish.length = 0
      for (let i = 0; i < n; i++) fish.push(make(i))
    }

    const draw = (f, t) => {
      const cw = 320, ch = 480, sx = (f.cell % 4) * cw, sy = Math.floor(f.cell / 4) * ch
      const w = f.len * (cw / ch), h = f.len, slices = 14
      ctx.save()
      ctx.translate(f.x * dpr, f.y * dpr)
      ctx.rotate(f.a + Math.PI / 2)        // the atlas swims up the image
      ctx.scale(dpr, dpr)
      for (let i = 0; i < slices; i++) {
        const v = i / slices                 // 0 at the head, 1 at the tail
        const sway = Math.sin(f.phase - v * 3.2) * (2 + 14 * v * v) * (0.6 + f.speed / 60)
        ctx.drawImage(img, sx, sy + v * ch, cw, ch / slices + 1, -w / 2 + sway, -h / 2 + v * h, w, h / slices + 0.6)
      }
      ctx.restore()
    }

    const step = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05); last = t
      // scrolling stirs them: they drift the other way a little
      const scroll = window.scrollY - lastScroll; lastScroll = window.scrollY
      ctx.clearRect(0, 0, cv.width, cv.height)
      ctx.globalAlpha = 0.5
      const b = bounds()
      for (const f of fish) {
        f.y -= scroll * 0.12
        // curious: a pointer in this koi's margin, held still, draws it over
        const near = Math.hypot(ptr.x - f.x, ptr.y - f.y) < 260 && t - ptr.t < 2500 &&
          (f.side < 0 ? ptr.x < b.l : ptr.x > b.r)
        if (near) { f.tx = ptr.x; f.ty = ptr.y }
        else if (Math.hypot(f.tx - f.x, f.ty - f.y) < 40) { f.tx = pickSide(f.side); f.ty = rand(80, H - 80) }
        const want = Math.atan2(f.ty - f.y, f.tx - f.x)
        let d = want - f.a; d = Math.atan2(Math.sin(d), Math.cos(d))
        f.a += Math.max(-1.2 * dt, Math.min(1.2 * dt, d))
        const v = f.speed * (near ? 1.3 : 1)
        f.x += Math.cos(f.a) * v * dt; f.y += Math.sin(f.a) * v * dt
        // stay out of the words and inside the window
        if (f.side < 0) f.x = Math.min(f.x, b.l - 30); else f.x = Math.max(f.x, b.r + 30)
        if (f.y < -120) f.y = H + 100; if (f.y > H + 120) f.y = -100
        f.phase += dt * (3 + v / 9)
        if (img.complete) draw(f, t)
      }
      raf = requestAnimationFrame(step)
    }

    const onMove = (e) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = performance.now() }
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
