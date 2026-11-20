'use client'

import { useEffect, useRef } from 'react'

/*
 * The lamp's light, drawn as a pale checkerboard: the same square size and
 * every-other-square pattern as the checkered band above Exploration, in a
 * shade only just off the wall colour. It pools from the top right, where
 * the lamp cord hangs; towards its edge, fewer squares show (an ordered
 * dither), so it fades out evenly. It drifts very slowly. Move the mouse over
 * it and more squares light up in a soft spot that follows the pointer, then
 * fade when the mouse rests.
 *
 * As you scroll, the field gathers into the photo window between
 * "Ayushman" and "Bharadwaj": the visible area shrinks (a clip-path) from the
 * whole hero down to that window, then fades, and the photos carry on there.
 * Scrolling back up lets the light out again.
 *
 * The area around the name and intro is kept clear so the text stays easy
 * to read. Reduced Motion: a still field, no drift and no gathering.
 *
 *   target   CSS selector of the window the light gathers into
 *   clear    CSS selector of the text block to keep clear
 */
const CELL = 8 // px per square: the same size as the squares in the checkered band
const DRIFT = 0.000008 // how fast the light drifts: barely
// 4×4 ordered-dither thresholds (0…1): which squares turn on first.
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map((r) => r.map((n) => (n + 0.5) / 16))
const MOUSE_R = 150 // px: radius of the warm spot that follows the pointer
const REST_MS = 700 // rest the mouse this long and a hidden motif appears

/*
 * The easter egg: rest the mouse over the light and a small motif from
 * Assam is picked out in the squares under it, a different one each time;
 * move and it melts back into the pattern. Drawn on the same 8px grid,
 * 13 squares across.
 */
const MOTIFS = {
  // the flower woven along the border of a gamosa
  phul: [
    '......#......', '.....#.#.....', '....#.#.#....', '...#..#..#...', '..#.#...#.#..',
    '.#...#.#...#.', '#.#.#.#.#.#.#', '.#...#.#...#.', '..#.#...#.#..', '...#..#..#...',
    '....#.#.#....', '.....#.#.....', '......#......',
  ],
  // the xorai, the bell-metal offering stand
  xorai: [
    '......#......', '.....###.....', '...#######...', '..#########..', '...#######...',
    '.....###.....', '......#......', '.....###.....', '....#####....', '...#######...',
    '..#########..',
  ],
  // the japi, the woven sun hat
  japi: [
    '......#......', '.....###.....', '....#.#.#....', '...#######...', '..#.#.#.#.#..',
    '.###########.', '#############', '..#.#.#.#.#..',
  ],
  // the one-horned rhino
  rhino: [
    '.........#...', '..#####.##...', '.#########..#', '############.', '############.',
    '.##.##..##...', '.##.##..##...',
  ],
  // the lotus
  padma: [
    '......#......', '.....###.....', '.#...###...#.', '.##..###..##.', '.###.###.###.',
    '..#########..', '...#######...', '....#####....', '######.######',
  ],
}
const MOTIF_NAMES = Object.keys(MOTIFS)

// Small value-noise: smooth random hills in 2D, enough for soft clouds.
function makeNoise(seed = 7) {
  const p = new Uint8Array(512)
  let s = seed
  for (let i = 0; i < 256; i++) { s = (s * 16807) % 2147483647; p[i] = s & 255 }
  for (let i = 0; i < 256; i++) p[i + 256] = p[i]
  const h = (x, y) => p[(p[x & 255] + y) & 511] / 255
  const sm = (t) => t * t * (3 - 2 * t)
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi)
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1)
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf
  }
}

export default function PixelGlow({ target, clear }) {
  const canvas = useRef(null)

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv.getContext('2d')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noise = makeNoise()
    let w = 0, h = 0, dpr = 1, raf = 0, palette = null, clearBox = null
    let gathered = 0 // 0 at the top of the page, 1 once the light is in the window
    // The pointer: where it is (eased), and how present it is (fades out when
    // the mouse rests or leaves).
    const mouse = { x: -999, y: -999, tx: -999, ty: -999, on: 0, target: 0, idle: 0 }
    // The hidden motif: which one, where it sits (in squares), and how visible.
    const motif = { name: MOTIF_NAMES[0], cx: 0, cy: 0, a: 0, shown: false }
    let lightB = null // a second set of tones, for palettes that alternate squares

    // Four warm tones from the theme, light to strong; dark mode uses deeper
    // ambers so it glows on the dark wall instead of glaring.
    const readPalette = () => {
      const dark = document.documentElement.dataset.theme === 'dark'
      // Kept very close to the wall colour, so it's almost not there.
      lightB = null
      if (dark) palette = ['rgba(0,0,0,0)', '#201a14', '#2a2119', '#3a2c1e']
      else {
        // Light mode: a kilim weave, mustard and terracotta squares
        // alternating, like the rug in the footer room. Still very pale.
        palette = ['rgba(0,0,0,0)', '#efe3c9', '#ead7b2', '#e2c48d']
        lightB = ['rgba(0,0,0,0)', '#f0dcd1', '#eacbbd', '#dfae99']
      }
    }

    const measure = () => {
      const r = cv.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = r.width; h = r.height
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr)
      const c = clear && document.querySelector(clear)
      if (c) {
        const b = c.getBoundingClientRect()
        clearBox = { x: b.left - r.left, y: b.top - r.top, w: b.width, h: b.height }
      }
      readPalette()
    }

    const draw = (time) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const t = still ? 0 : time * DRIFT
      const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * CELL, py = y * CELL
          // Light pools from the top right (the lamp) and thins out down and left.
          const fx = px / w, fy = py / h
          const pool = Math.max(0, 1 - Math.hypot((1 - fx) * 0.9, fy * 1.25))
          let v = noise(x * 0.045 + t * 40, y * 0.055 - t * 25) * 0.7 + noise(x * 0.12 - t * 60, y * 0.12) * 0.3
          v = v * 0.4 + pool * 0.5 - 0.22 + (1 - fy) * 0.05
          // A soft warm spot under the pointer, as if the lamp light caught it.
          if (mouse.on > 0.01) {
            const d2 = (px + CELL / 2 - mouse.x) ** 2 + (py + CELL / 2 - mouse.y) ** 2
            v += 0.55 * mouse.on * Math.exp(-d2 / (2 * MOUSE_R * MOUSE_R))
          }
          // Keep a soft clearing around the text.
          if (clearBox) {
            const dx = Math.max(clearBox.x - 24 - px, 0, px - (clearBox.x + clearBox.w + 24))
            const dy = Math.max(clearBox.y - 24 - py, 0, py - (clearBox.y + clearBox.h + 24))
            const d = Math.hypot(dx, dy)
            // The clearing fills in as the light gathers, so the window it
            // shrinks into (which sits in the text) isn't empty.
            v *= Math.min(1, d / 90) * (1 - gathered) + gathered
          }
          // Fade out softly towards the bottom of the hero, instead of stopping.
          v *= Math.min(1, (1 - fy) / 0.45) * (1 - gathered) + gathered
          v += gathered * 0.25 // and the light thickens as it gathers
          // Drawn as the checkered band is: only every other square, and how
          // many of those show depends on how strong the light is there (an
          // ordered threshold, so the edge breaks up evenly, not in noise).
          if ((x + y) % 2) continue
          // Index the threshold on the checkerboard's own (diagonal) grid, so
          // the squares that drop out don't line up into stripes.
          const u = ((x + y) >> 1) & 3, k = (((x - y) >> 1) % 4 + 4) % 4
          const bayer = BAYER[u][k]
          // Below a small floor nothing shows, so no stray squares far away.
          if ((v - 0.1) * 1.3 < bayer) continue
          const tones = lightB && ((x >> 1) ^ (y >> 1)) & 1 ? lightB : palette
          ctx.fillStyle = tones[v > 0.85 ? 3 : v > 0.55 ? 2 : 1]
          ctx.fillRect(px, py, CELL, CELL)
        }
      }
      // The hidden motif, on top, in the strongest tone.
      if (motif.a > 0.01) {
        const rows2 = MOTIFS[motif.name]
        const ox = motif.cx - 6, oy = motif.cy - (rows2.length >> 1)
        ctx.globalAlpha = motif.a
        ctx.fillStyle = palette[3]
        rows2.forEach((row, j) => {
          for (let i = 0; i < row.length; i++) if (row[i] === '#') ctx.fillRect((ox + i) * CELL, (oy + j) * CELL, CELL, CELL)
        })
        ctx.globalAlpha = 1
      }
    }

    // Gather into the window as the page scrolls.
    const gather = () => {
      const tg = target && document.querySelector(target)
      if (!tg || still) { cv.style.clipPath = 'none'; cv.style.opacity = '1'; return }
      const range = window.innerHeight * 0.55
      const p = Math.max(0, Math.min(1, window.scrollY / range))
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
      gathered = e
      const c = cv.getBoundingClientRect(), s = tg.getBoundingClientRect()
      const top = (s.top - c.top) * e, left = (s.left - c.left) * e
      const right = (c.right - s.right) * e, bottom = (c.bottom - s.bottom) * e
      const radius = 8 * e
      cv.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`
      cv.style.opacity = String(p < 0.85 ? 1 : Math.max(0, 1 - (p - 0.85) / 0.15))
    }

    let last = 0
    const loop = (time) => {
      // Ease the spot after the pointer, and let it fade when the mouse rests.
      mouse.x += (mouse.tx - mouse.x) * 0.12
      mouse.y += (mouse.ty - mouse.y) * 0.12
      if (time - mouse.idle > 1400) mouse.target = 0
      mouse.on += (mouse.target - mouse.on) * 0.06
      // Resting inside the light: a motif appears where the pointer stopped,
      // a new one each time. Any movement melts it back.
      // (Not over the name and intro: the motif never sits on the text.)
      const overText = clearBox && mouse.tx > clearBox.x - 60 && mouse.tx < clearBox.x + clearBox.w + 60 &&
        mouse.ty > clearBox.y - 60 && mouse.ty < clearBox.y + clearBox.h + 60
      const rest = time - mouse.idle > REST_MS && !overText && gathered < 0.05 &&
        mouse.ty >= 0 && mouse.ty <= h * 0.7 && mouse.tx >= 0 && mouse.tx <= w
      if (rest && !motif.shown) {
        let next = motif.name
        while (next === motif.name) next = MOTIF_NAMES[Math.floor(Math.random() * MOTIF_NAMES.length)]
        motif.name = next
        motif.cx = Math.round(mouse.tx / CELL); motif.cy = Math.round(mouse.ty / CELL)
        motif.shown = true
      }
      if (!rest) motif.shown = false
      motif.a += ((motif.shown ? 0.85 : 0) - motif.a) * (motif.shown ? 0.05 : 0.15)
      // About 25 frames a second is plenty for light this slow.
      if (time - last > 40) { draw(time); last = time }
      raf = requestAnimationFrame(loop)
    }
    const onPointer = (e) => {
      if (e.pointerType !== 'mouse') return
      const r = cv.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      if (mouse.on < 0.02) { mouse.x = x; mouse.y = y } // appear where the pointer is
      mouse.tx = x; mouse.ty = y
      mouse.target = y >= 0 && y <= r.height ? 1 : 0
      mouse.idle = performance.now()
    }
    if (!still) window.addEventListener('pointermove', onPointer, { passive: true })

    measure()
    draw(0)
    gather()
    if (!still) raf = requestAnimationFrame(loop)
    const ro = new ResizeObserver(() => { measure(); draw(performance.now()); gather() })
    ro.observe(cv)
    const onScroll = () => gather()
    window.addEventListener('scroll', onScroll, { passive: true })
    // Re-colour when the lamp switches the theme.
    const mo = new MutationObserver(() => { readPalette(); draw(performance.now()) })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    // Fonts and the photo window settle after first paint; re-measure then.
    const settle = setTimeout(() => { measure(); draw(performance.now()); gather() }, 600)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); clearTimeout(settle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [target, clear])

  return <canvas ref={canvas} className="pixel-glow" aria-hidden="true" />
}
