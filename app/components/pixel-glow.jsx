'use client'

import { useEffect, useRef } from 'react'

/*
 * The lamp's light, laid as a pale mosaic: small square tiles (the size of
 * the squares in the checkered band above Exploration) with a hairline of
 * grout, in shades only just off the wall colour, a few scattered in a second
 * colour like a laid mosaic (kilim mustard and terracotta in light mode). It
 * pools from the top right, where the lamp cord hangs; towards its edge, fewer
 * tiles show (an ordered dither), so it fades out evenly. It drifts very
 * slowly. Move the mouse over it and more tiles light up in a soft spot that
 * follows the pointer, then fade when the mouse rests.
 *
 * As you scroll, the field gathers into the photo window in the headline.
 * The visible area shrinks (a clip-path) from the
 * whole hero down to that window, then fades, and the photos carry on there.
 * Scrolling back up lets the light out again.
 *
 * The area around the headline and intro is kept clear so the text stays easy
 * to read. Reduced Motion: a still field, no drift and no gathering.
 *
 *   target   CSS selector of the window the light gathers into
 *   clear      CSS selector of the text block (used for motif placement)
 *   clearText  CSS selector(s) of the lines of text to keep clear; the
 *              light can then sit in the gaps between them
 */
const CELL = 8 // px per tile: the size of the squares in the checkered band
const GROUT = 1 // px of gap between tiles
const DRIFT = 0.000008 // how fast the light drifts: barely
// 4×4 ordered-dither thresholds (0…1): which squares turn on first.
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map((r) => r.map((n) => (n + 0.5) / 16))
const MOUSE_R = 150 // px: radius of the warm spot that follows the pointer
const REST_MS = 700 // rest the mouse this long and a hidden motif appears

/*
 * The easter egg: rest the mouse over the light (or hold a finger still) and
 * a small, familiar shape gathers out of the tiles under it, a different one
 * each time. Some then do their thing: the bird and the butterfly flap and
 * fly off, the paper plane glides, the fish swims, the note floats up, and
 * the chai steams. Move and a resting one
 * melts back into the pattern.
 *
 * Each shape is drawn as text on the tile grid: '#' is the main colour, 'o'
 * the accent, '.' empty. `frames` holds its poses (all the same size), `rest`
 * the pose it forms in, `cycle` + `every` the poses it loops through, and
 * `path(k, t)` where it travels (in tiles) over its exit, k = 0…1. Shapes
 * without a path stay put until the mouse moves; `pulse` gently breathes
 * their brightness.
 */
const SHAPES = {
  bird: {
    frames: {
      up: ['...##........', '....##.......', '.....##..##..', '#.#########o.', '.########....', '.............', '.............'],
      mid: ['.............', '.............', '.........##..', '#.#########o.', '.#########...', '....####.....', '.............'],
      down: ['.............', '.............', '.........##..', '#.#########o.', '.########....', '.....##......', '......##.....'],
    },
    rest: 'mid', cycle: ['up', 'mid', 'down', 'mid'], every: 120,
    path: (k, t) => [k * k * 70 + k * 18, -k * 34 + Math.sin(t / 240) * 1.2],
  },
  butterfly: {
    frames: {
      open: ['.##.......##.', '####.....####', '#o###.#.###o#', '######o######', '.#####o#####.', '..###.o.###..', '.####.o.####.', '.###.....###.', '..#.......#..'],
      shut: ['....#...#....', '....##.##....', '.....#.#.....', '....##o##....', '....##o##....', '.....#o#.....', '....##o##....', '....#...#....', '.............'],
    },
    rest: 'open', cycle: ['open', 'shut'], every: 170,
    path: (k, t) => [-k * 26 + Math.sin(t / 320) * 3, -k * 42],
  },
  plane: {
    frames: {
      a: ['...........##', '........####.', '.....######..', '..########...', '##########...', '..ooo####....', '....oo###....', '......o##....', '.......#.....'],
    },
    rest: 'a', path: (k) => [k * 90, -k * 40 + k * k * 10],
  },
  note: {
    frames: {
      a: ['...######', '...######', '...#....#', '...#....#', '...#....#', '...#....#', '.###..###', '####.####', '####.####', '.##...##.'],
    },
    rest: 'a', path: (k, t) => [Math.sin(t / 300) * 2.5, -k * 36],
  },
  // a fish, tail flicking as it swims off to the right
  fish: {
    frames: {
      a: ['......###......', '....#######....', '#..##########..', '##.#######o#o#.', '##########o####', '##.#######o###.', '#..##########..', '....#######....', '......##.......'],
      b: ['......###......', '....#######....', '...##########..', '.#.#######o#o#.', '##########o####', '.#.#######o###.', '...##########..', '....#######....', '......##.......'],
    },
    rest: 'a', cycle: ['a', 'b'], every: 160,
    path: (k, t) => [k * 72, Math.sin(t / 260) * 1.3],
  },
  // a cutting chai: the small ribbed glass, tea inside, steam curling up
  chai: {
    frames: {
      s1: ['..o....o...', '...o....o..', '..o....o...', '.#########.', '.#ooooooo#.', '.#o#o#o#o#.', '..#ooooo#..', '..#o#o#o#..', '..#ooooo#..', '...#####...'],
      s2: ['...o....o..', '..o....o...', '...o....o..', '.#########.', '.#ooooooo#.', '.#o#o#o#o#.', '..#ooooo#..', '..#o#o#o#..', '..#ooooo#..', '...#####...'],
    },
    rest: 's1', cycle: ['s1', 's2'], every: 300,
  },
}
const MOTIF_NAMES = Object.keys(SHAPES)
const FORM_MS = 1100 // tiles gather in over this long, from the centre out
const TILE_MS = 450 // each tile's own glide into place
const LEAVE_MS = 500 // dissolving back into the light
const FLY_MS = 2600 // a travelling shape's exit before it's gone

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

export default function PixelGlow({ target, clear, clearText }) {
  const canvas = useRef(null)

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv.getContext('2d')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noise = makeNoise()
    let w = 0, h = 0, dpr = 1, raf = 0, palette = null, clearBox = null
    let textBoxes = [] // the actual lines of text to keep clear (name, intro, link)
    let tide = null // the open space under the name, where light laps in from the left
    let gathered = 0 // 0 at the top of the page, 1 once the light is in the window
    // The pointer: where it is (eased), and how present it is (fades out when
    // the mouse rests or leaves).
    const mouse = { x: -999, y: -999, tx: -999, ty: -999, on: 0, target: 0, idle: 0, down: false, lifted: false }
    // The hidden motif: which one, where it sits (in squares), and how visible.
    // phase: off → forming → held (or flying, for the bird) → leaving → off
    const motif = { name: null, cx: 0, cy: 0, phase: 'off', t0: 0, fx: 0, fy: 0, frame: 'mid', count: 0, armed: true }
    // Each tile starts a little scattered and glides into place; the scatter
    // is fixed per tile so it doesn't flicker.
    const scatter = (i, j) => {
      const hsh = ((i * 92821) ^ (j * 68917)) >>> 0
      return [((hsh % 7) - 3) * 0.9, (((hsh >> 3) % 7) - 3) * 0.9]
    }
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)
    let lightB = null // a second set of tones, for palettes that alternate squares
    let motifTones = ['#d8b678', '#d59a80'] // the motif's two tones, a little stronger

    // Four warm tones from the theme, light to strong; dark mode uses deeper
    // ambers so it glows on the dark wall instead of glaring.
    const readPalette = () => {
      const dark = document.documentElement.dataset.theme === 'dark'
      // Kept very close to the wall colour, so it's almost not there.
      lightB = null
      if (dark) {
        palette = ['rgba(0,0,0,0)', '#201a14', '#2a2119', '#3a2c1e']
        motifTones = ['#4d3a26', '#5e3b26']
      } else {
        motifTones = ['#d8b678', '#d59a80']
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
      textBoxes = clearText ? [...document.querySelectorAll(clearText)].map((el) => {
        const b = el.getBoundingClientRect()
        return { x: b.left - r.left, y: b.top - r.top, w: b.width, h: b.height }
      }) : []
      // On wide screens light drifts below the headline, to the left of the photo.
      tide = null
      const slot = target && document.querySelector(target)
      const intro = document.querySelector('.hero__intro')
      if (clearBox && slot && intro && w >= 960) {
        const sb = slot.getBoundingClientRect(), ib = intro.getBoundingClientRect()
        const left = clearBox.x, right = sb.left - r.left
        const nb = document.querySelector('.hero-title')?.getBoundingClientRect()
        if (right - left > 160 && nb) tide = { top: nb.bottom - r.top, bottom: ib.bottom - r.top, reach: right - 40 }
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
          // The faint pool in the open space under the name (wide screens).
          let low = 0, boxDist = Infinity
          if (tide && py > tide.top && py < tide.bottom) {
            // How far the water has come in at this height: a slow swell
            // (about 9 s in and out), a quicker ripple along the edge, and
            // some noise so the front isn't a straight line.
            const s1 = Math.sin(time / 1450), s2 = Math.sin(time / 610 + py * 0.018)
            const front = tide.reach * (0.42 + 0.2 * s1 + 0.05 * s2) + (noise(py * 0.03, time * 0.00012) - 0.5) * 70
            if (px < front) {
              const depth = 1 - px / front // 1 at the page edge, 0 at the front
              const band = Math.sin(Math.PI * (py - tide.top) / (tide.bottom - tide.top)) // soft at top and bottom
              low = 0.24 * depth * depth * band * (1 - gathered)
            }
          }
          // Keep a soft clearing around the text: around each line of it when
          // known, else around the whole block.
          const boxes = textBoxes.length ? textBoxes : clearBox ? [clearBox] : []
          if (boxes.length) {
            let d = Infinity
            for (const bx of boxes) {
              const dx = Math.max(bx.x - 24 - px, 0, px - (bx.x + bx.w + 24))
              const dy = Math.max(bx.y - 24 - py, 0, py - (bx.y + bx.h + 24))
              d = Math.min(d, Math.hypot(dx, dy))
            }
            boxDist = d
            // The clearing fills in as the light gathers, so the window it
            // shrinks into (which sits in the text) isn't empty.
            v *= Math.min(1, d / 90) * (1 - gathered) + gathered
          }
          // Fade out softly towards the bottom of the hero, instead of stopping.
          v *= Math.min(1, (1 - fy) / 0.45) * (1 - gathered) + gathered
          if (low) v = Math.max(v, low * (boxes.length ? Math.min(1, boxDist / 60) : 1))
          v += gathered * 0.25 // and the light thickens as it gathers
          // Drawn as the checkered band is: only every other square, and how
          // many of those show depends on how strong the light is there (an
          // ordered threshold, so the edge breaks up evenly, not in noise).
          // Mosaic tiles: every square is a small tile with a hairline of
          // grout around it. How many tiles show depends on how strong the
          // light is (an ordered threshold, so the edge breaks up evenly).
          const bayer = BAYER[y & 3][x & 3]
          // Below a small floor nothing shows, so no stray tiles far away.
          // Just above its threshold a tile is only partly there, so as the
          // light moves, tiles fade in and out instead of popping.
          const over = (v - 0.1) * 1.3 - bayer
          if (over <= 0) continue
          ctx.globalAlpha = Math.min(1, over / 0.14)
          // A few tiles in the second colour, scattered, like a laid mosaic.
          const pick = ((x * 73856093) ^ (y * 19349663)) >>> 0
          const tones = lightB && pick % 5 === 0 ? lightB : palette
          ctx.fillStyle = tones[v > 0.85 ? 3 : v > 0.55 ? 2 : 1]
          ctx.fillRect(px + GROUT, py + GROUT, CELL - GROUT, CELL - GROUT)
        }
      }
      ctx.globalAlpha = 1
      // The hidden motif, on top. Tiles gather in from the centre outwards,
      // each gliding a short way into place and fading up, so the shape
      // forms softly; leaving runs the same in reverse, quicker. A small
      // clearing behind it fades with it, so the silhouette reads.
      if (motif.phase !== 'off') {
        const shape = SHAPES[motif.name]
        const rows2 = shape.frames[motif.frame] || shape.frames[shape.rest]
        const mw = rows2[0].length, mh = rows2.length
        const ox = Math.round(motif.fx) - (mw >> 1), oy = Math.round(motif.fy) - (mh >> 1)
        const el = time - motif.t0
        const maxD = Math.hypot(mw / 2, mh / 2)
        // How far along each tile is (0…1), by its distance from the centre.
        const tileP = (i, j) => {
          const d = Math.hypot(i - mw / 2, j - mh / 2) / maxD
          if (motif.phase === 'forming') return Math.max(0, Math.min(1, (el - d * (FORM_MS - TILE_MS)) / TILE_MS))
          if (motif.phase === 'leaving') return Math.max(0, Math.min(1, 1 - (el - (1 - d) * LEAVE_MS * 0.5) / (LEAVE_MS * 0.5)))
          return 1
        }
        // A travelling shape fades over the last part of its exit instead of
        // vanishing; a resting heart or star breathes gently.
        let flyFade = motif.phase === 'flying' ? Math.max(0, Math.min(1, 1 - (el / FLY_MS - 0.75) / 0.25)) : 1
        if (motif.phase === 'held' && shape.pulse) flyFade = 0.78 + 0.22 * Math.cos(el / shape.pulse * Math.PI)
        const whole = (motif.phase === 'forming' ? Math.min(1, el / FORM_MS) : motif.phase === 'leaving' ? Math.max(0, 1 - el / LEAVE_MS) : 1) * flyFade
        ctx.globalAlpha = 0.9 * easeOut(whole)
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillRect((ox - 1) * CELL, (oy - 1) * CELL, (mw + 2) * CELL, (mh + 2) * CELL)
        ctx.globalCompositeOperation = 'source-over'
        rows2.forEach((row, j) => {
          for (let i = 0; i < row.length; i++) {
            if (row[i] === '.') continue
            const p = easeOut(tileP(i, j))
            if (p <= 0.01) continue
            const [sx, sy] = scatter(i, j)
            const tx = (ox + i + sx * (1 - p)) * CELL, ty = (oy + j + sy * (1 - p)) * CELL
            ctx.globalAlpha = 0.9 * p * flyFade
            ctx.fillStyle = row[i] === 'o' ? motifTones[1] : motifTones[0]
            ctx.fillRect(tx + GROUT, ty + GROUT, CELL - GROUT, CELL - GROUT)
          }
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
      if (!mouse.down && time - mouse.idle > 1400) mouse.target = 0
      mouse.on += (mouse.target - mouse.on) * 0.06
      // Resting inside the light: a motif appears where the pointer stopped,
      // a new one each time. Any movement melts it back.
      // (Not over the name and intro: the motif never sits on the text.)
      // On a phone the margin is tighter: there's only a strip above the name.
      const m = w < 640 ? 8 : 60
      const overText = clearBox && mouse.tx > clearBox.x - m && mouse.tx < clearBox.x + clearBox.w + m &&
        mouse.ty > clearBox.y - m && mouse.ty < clearBox.y + clearBox.h + m
      const rest = time - mouse.idle > REST_MS && !overText && gathered < 0.05 && !mouse.lifted &&
        mouse.ty >= 0 && mouse.ty <= h * 0.7 && mouse.tx >= 0 && mouse.tx <= w
      // After one motif, the mouse has to move before the next can appear.
      if (rest && motif.phase === 'off' && motif.armed) {
        motif.armed = false
        // The bird comes first (the one that flies), then the others at random.
        let next = motif.count === 0 ? 'bird' : motif.name
        while (next === motif.name) next = MOTIF_NAMES[Math.floor(Math.random() * MOTIF_NAMES.length)]
        motif.name = next
        // Keep the whole motif on screen and above the text, nudging it in from
        // the edges if the pointer rested close to them.
        const rows3 = SHAPES[next].frames[SHAPES[next].rest], halfW = rows3[0].length >> 1, halfH = rows3.length >> 1
        const maxY = clearBox ? Math.floor(clearBox.y / CELL) - halfH - 1 : Math.floor(h / CELL) - halfH
        motif.fx = motif.cx = Math.max(halfW + 1, Math.min(Math.floor(w / CELL) - halfW - 1, Math.round(mouse.tx / CELL)))
        motif.fy = motif.cy = Math.max(halfH + 1, Math.min(maxY, Math.round(mouse.ty / CELL)))
        motif.phase = 'forming'; motif.t0 = time; motif.frame = SHAPES[next].rest; motif.count++
      }
      const since = time - motif.t0
      if (motif.phase === 'forming' && since > FORM_MS) {
        motif.phase = SHAPES[motif.name].path ? 'flying' : 'held'; motif.t0 = time
      }
      // Moving the mouse melts a resting motif back; a flying bird keeps going.
      if ((motif.phase === 'forming' || motif.phase === 'held') && !rest) { motif.phase = 'leaving'; motif.t0 = time }
      if (motif.phase === 'leaving' && since > LEAVE_MS) motif.phase = 'off'
      // Loop through the shape's poses (wings, steam) once it has formed.
      const sh = motif.name && SHAPES[motif.name]
      if (sh && sh.cycle && (motif.phase === 'flying' || motif.phase === 'held')) {
        motif.frame = sh.cycle[Math.floor(since / sh.every) % sh.cycle.length]
      }
      if (motif.phase === 'flying') {
        // Travel along the shape's path, in whole tiles so it stays crisp.
        const k = since / FLY_MS
        const [dx, dy] = sh.path(k, since)
        motif.fx = motif.cx + dx
        motif.fy = motif.cy + dy
        if (since > FLY_MS || motif.fx * CELL > w + 120 || motif.fx * CELL < -120 || motif.fy * CELL < -80) {
          motif.phase = 'off'; motif.t0 = time
        }
      }
      // About 30 frames a second while something is happening (pointer,
      // motif, bird); when it's just the slow drift, about 6, which looks the
      // same and saves the battery. Nothing at all while it's off screen or
      // the tab is hidden.
      const busy = mouse.on > 0.01 || mouse.target > 0 || motif.phase !== 'off' || (tide && gathered < 0.05)
      if (visible && !document.hidden && time - last > (busy ? 33 : 160)) { draw(time); last = time }
      raf = requestAnimationFrame(loop)
    }
    // Mouse: the spot follows the pointer; rest to reveal a motif.
    // Touch: the spot follows your finger while it's down; press and hold
    // still to reveal a motif (lift and it melts back, though the bird still
    // flies off). Scrolling takes over from the finger as usual, since all of
    // this only listens and never blocks the page.
    const onPointer = (e) => {
      if (e.pointerType !== 'mouse' && !mouse.down) return
      const r = cv.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      if (mouse.on < 0.02) { mouse.x = x; mouse.y = y } // appear where the pointer is
      mouse.tx = x; mouse.ty = y
      mouse.target = y >= 0 && y <= r.height ? 1 : 0
      mouse.idle = performance.now()
      mouse.lifted = false
      motif.armed = true
    }
    const onDown = (e) => {
      if (e.pointerType === 'mouse') return
      mouse.down = true
      mouse.on = 0 // start the spot fresh under the finger
      onPointer(e)
    }
    const onUp = (e) => {
      if (e.pointerType === 'mouse') return
      mouse.down = false; mouse.lifted = true; mouse.target = 0
    }
    if (!still) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('pointerdown', onDown, { passive: true })
      window.addEventListener('pointerup', onUp, { passive: true })
      window.addEventListener('pointercancel', onUp, { passive: true })
    }
    // Only draw while the light is on screen.
    let visible = true
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
    io.observe(cv)

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
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      io.disconnect()
    }
  }, [target, clear, clearText])

  return <canvas ref={canvas} className="pixel-glow" aria-hidden="true" />
}
