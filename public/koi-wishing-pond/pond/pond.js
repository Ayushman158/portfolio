/*
 * Koi Wishing Pond, for the browser.
 *
 * A port of the TouchDesigner installation shown at UPES on 8 October 2026. The behaviour is pond_logic.py line for line where it
 * matters (koi steering, burst-and-glide, the fist-then-open wish), and the
 * look is the same shaders with the values read from the live .toe:
 *
 *   ripples      damped 2D wave equation, 640x360   damp .993 speed .26 visc .45
 *   water        anime water, cel-stepped light       shallow/deep/light, bands 4
 *   under water  koi (16-point spine mesh), coins, shadows, koi trail specks
 *   surface      refraction .022 + ring contours drawn as drifting specks
 *                + wave light + hand / grab / wish lights; leaves float on top
 *   post         sunlight, saturation 1.08, grain, vignette, superellipse
 *                bank (582x317, n 2.4) with lapping, meniscus and a rim
 *
 * Input: the pointer is the hand. Moving it is the hand in the water; pressing
 * and holding is the closed fist (Wishhold 0.7 s); letting go is the open palm.
 * "Use your hand" swaps in MediaPipe hand tracking, the same detector the
 * installation ran, with the same openness test for fist and open palm.
 *
 * Pond space: x, y in 0..1 with y up, as in pond_logic. Frame space: pixels of
 * a 1280x720 frame, centred, y up (as fish_mesh_data / leaf_instances).
 */

// ---------------------------------------------------------------- settings
const ASP = 16 / 9, FW = 1280, FH = 720
const P = {                               // the installation's custom pars, as saved
  Koicount: 6, Koisize: 0.5, Koispacing: 0.3, Spinefollow: 0.55, Tailbeat: 0.6, Finflutter: 0.7,
  Koivolume: 0.85, Koishadow: 0.32, Kointrails: 0.8, Koitrailcount: 1,
  Lag: 0.06, Trailstrength: 0.28, Splashspeed: 3.2, Ripplemin: 4, Ripplemax: 8, Handbreadth: 0.45,
  Wishhold: 0.7, Stillspeed: 0.12, Coinsize: 48, Maxlotus: 12, Wishtexthold: 4.5,
  Ripplelife: 0.993, Ripplespeed: 0.26, Ripplevisc: 0.45, Refraction: 0.022,
  Rparticles: 1.1, Rline: 0.12, Rglow: 0.15, Inklevel: 0.06, Inkwidth: 1.2, Inkminslope: 0.0012,
  Lightbands: 0.22, Streaks: 0.35, Grain: 0.025, Vignette: 0.3, Saturation: 1.08,
  Shorelap: 4, Shorewave: 16, Shoresheen: 0.18, Shoremeniscus: 12, Trailamount: 10, Trailglow: 0.9,
  Volume: 0.8, Ambient: 0.18,
}
const SIZES = [1.0, 0.92, 0.78, 0.86, 0.7, 0.82, 0.74, 0.88]
const BRIGHT = [1.0, 1.0, 0.8, 1.0, 1.0, 1.0, 1.0, 1.0]
const TRAIL_COL = [[1, .42, .22], [1, .76, .38], [.88, .9, 1], [.72, .78, .92], [1, .45, .25], [1, .76, .38], [1, .42, .22], [.72, .78, .92]]
const LEAVES = [[-427, 120, 174, 200, 1], [397, -100, 148, 120, 0], [-296, 197, 100, 300, 2]]   // x, y px, size, rot, tex (as placed on the floor)
const WISH_LINES = ['May your wish come true.', 'Your wish is on its way.', 'Hold on to that wish.', 'The koi will carry your wish.',
  'May it find its way to you.', 'Your wish has been heard.', 'Keep believing in it.', 'May your wish grow with time.',
  'Something good is coming.', 'The koi will swim it home.']
const BANK = { rx: 582.4, ry: 316.8, n: 2.4 }

const F = (v) => (Number.isInteger(v) ? v.toFixed(1) : String(v))   // a float literal for GLSL
const rand = (a, b) => a + Math.random() * (b - a)
const clamp = (v, a, b) => Math.min(Math.max(v, a), b)
const hypot = Math.hypot
const ease = (dt, tau) => 1 - Math.exp(-dt / tau)

// ---------------------------------------------------------------- the bank
// The pond's edge as a signed distance field (screen heights, + inside) and
// its inward direction, sampled once on a 320x180 grid like pond_sdf.npy.
const SDF = (() => {
  const gw = 320, gh = 180, d = new Float32Array(gw * gh)
  const pts = []
  for (let i = 0; i < 720; i++) {
    const t = (i / 720) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t)
    pts.push([Math.sign(c) * Math.abs(c) ** (2 / BANK.n) * BANK.rx, Math.sign(s) * Math.abs(s) ** (2 / BANK.n) * BANK.ry])
  }
  for (let r = 0; r < gh; r++) for (let q = 0; q < gw; q++) {
    const px = (q / (gw - 1) - 0.5) * FW, py = (r / (gh - 1) - 0.5) * FH
    let m = 1e9
    for (const [x, y] of pts) { const dd = (x - px) ** 2 + (y - py) ** 2; if (dd < m) m = dd }
    const inside = Math.abs(px / BANK.rx) ** BANK.n + Math.abs(py / BANK.ry) ** BANK.n < 1
    d[r * gw + q] = (inside ? 1 : -1) * Math.sqrt(m) / FH
  }
  return { gw, gh, d }
})()
function pondEdge(x, y) {
  const { gw, gh, d } = SDF
  const c = clamp(Math.round(x * (gw - 1)), 1, gw - 2), r = clamp(Math.round(y * (gh - 1)), 1, gh - 2)
  const gx = d[r * gw + c + 1] - d[r * gw + c - 1], gy = d[(r + 1) * gw + c] - d[(r - 1) * gw + c]
  const g = hypot(gx, gy) + 1e-9
  return [d[r * gw + c], gx / g, gy / g]
}

// ---------------------------------------------------------------- state
const S = {
  t: 0, fish: [], wishes: [], wish: null, wishT: -99, wishLine: null,
  impulses: [], segments: [], events: [], hands: {}, grab: [0.5, 0.5, 0],
  trail: [], handSpecks: [], sparkles: [], motes: [], leafSpring: LEAVES.map(() => ({ tx: 0, ty: 0, z: 0, vx: 0, vy: 0, vz: 0 })),
  gentleT: -9, splashT: {}, bloopT: -9, swishT: -9, stir: 0,
}
function newTarget(f) {
  for (let i = 0; i < 30; i++) { f.tx = rand(0.1, 0.9); f.ty = rand(0.15, 0.85); if (pondEdge(f.tx, f.ty)[0] > 0.3) break }
}
function newTargetNear(f) {
  const a = rand(0, 6.283)
  f.tx = clamp(f.tx + Math.cos(a) * 0.12 / ASP, 0.1, 0.9); f.ty = clamp(f.ty + Math.sin(a) * 0.12, 0.12, 0.88)
}
for (let i = 0; i < P.Koicount; i++) {
  const f = { x: rand(0.3, 0.7), y: rand(0.35, 0.65), a: rand(0, 6.28), v: 0.05, mode: 'wander', until: 0, phase: rand(0, 5),
    tx: 0.5, ty: 0.5, fx: 0, fy: 0, w: 0, beat: 0.4, cyc: Math.random(), seed: rand(0, 50), bend: 0, dep: 0.3, happy: 0, hist: [] }
  newTarget(f); S.fish.push(f)
}
for (let i = 0; i < 45; i++) S.motes.push({ x: rand(-560, 560), y: rand(-300, 300), s: rand(1.5, 3.5), ph: rand(0, 6.28), sp: rand(4, 10) })
try {                                       // today's wishes come back, like wishes_today.json
  const w = JSON.parse(localStorage.getItem('koi-wishes') || 'null')
  if (w && w.date === new Date().toDateString()) S.wishes = w.coins.map((c) => ({ ...c, t: -60 }))
} catch {}
const saveWishes = () => { try { localStorage.setItem('koi-wishes', JSON.stringify({ date: new Date().toDateString(), coins: S.wishes.map(({ x, y, seed }) => ({ x, y, seed })) })) } catch {} }

// ---------------------------------------------------------------- hands
// Every hand source writes the same record: where the palm is (pond space),
// whether it is closed, and how close it is to the water (0..1).
//   { x, y, closed, near, span }  -> step() turns these into ripples, wishes and koi reactions
const hands = new Map()     // id -> live reading
function handStep(dt) {
  const now = S.t, k = dt > 0 ? 1 - Math.exp(-dt / P.Lag) : 0
  let grabNow = null
  for (const [id, h] of hands) {
    const st = S.hands[id] || (S.hands[id] = { x: h.x, y: h.y, m: 0, span: h.span, px: h.x, py: h.y, since: null, held: 0, released: -9, openT: null, still: 0 })
    if (st.fresh !== false) { S.impulses.push([h.x, h.y, 0.4, 9]); st.fresh = false }   // the hand enters the water
    const spd = hypot((h.x - st.px) * ASP, h.y - st.py) / Math.max(dt, 1e-3); st.px = h.x; st.py = h.y
    // fist held, then opened: the wish
    if (h.closed) {
      if (st.since === null) st.since = now
      st.held = now - st.since; st.openT = null
      grabNow = [st.x, st.y, Math.min(1, st.held / P.Wishhold)]
    } else if (st.since !== null) {
      if (st.openT === null) st.openT = now
      if (now - st.openT > (h.pointer ? 0 : 0.15)) {
        if (st.held >= P.Wishhold && now - S.wishT > (h.pointer ? 2.5 : 10)) makeWish(st.x, st.y)
        else if (h.pointer && st.held < 0.25) S.events.push([st.x, st.y, 0.6, 0.5])       // a quick click: a drop
        st.since = null; st.openT = null; st.held = 0
      }
    }
    // the whole hand in the water: one broad, soft body that moves as one (Glassstroke)
    const ox = st.x, oy = st.y
    st.x += (h.x - st.x) * k; st.y += (h.y - st.y) * k; st.span += (h.span - st.span) * k
    const hspd = hypot((st.x - ox) * ASP, st.y - oy) / Math.max(dt, 1e-3)
    st.m += (clamp((hspd - 0.06) / 1.0, 0, 1) - st.m) * k
    const r = Math.max(6, st.span * 640 / ASP * 0.5 * P.Handbreadth)
    S.segments.push([ox, oy, st.x, st.y, (0.15 + 0.85 * st.m) * (0.5 + h.near) * P.Trailstrength * 0.9, r])
    // flicks splash; gentle movement draws the koi over
    if (spd > P.Splashspeed && now - (S.splashT[id] ?? -9) > 0.6) { S.splashT[id] = now; S.events.push([h.x, h.y, 1, h.near]) }
    else if (spd > 0.28 && now - S.gentleT > 0.9) { S.gentleT = now; S.events.push([h.x, h.y, 0.22 * clamp((spd - 0.1) / 1.2, 0, 1), h.near]) }
    // stillness: the nearest koi come to see
    st.still = spd < P.Stillspeed ? st.still + dt : Math.max(0, st.still - dt * 3)
    if (st.still > 1 && now - (st.call ?? -9) > 1.5) {
      st.call = now
      const near = [...S.fish].sort((a, b) => hypot((a.x - st.x) * ASP, a.y - st.y) - hypot((b.x - st.x) * ASP, b.y - st.y)).slice(0, 3)
      for (const f of near) if (f.mode === 'wander' || f.mode === 'curious') {
        f.mode = 'curious'; f.until = now + 5
        const a = rand(0, 6.283), rr = rand(0.2, 0.28); f.tx = st.x + Math.cos(a) * rr / ASP; f.ty = st.y + Math.sin(a) * rr
      }
    }
    // specks shed by the moving hand
    const n = Math.floor(Math.min(hspd * 720 / 60, 1) * P.Trailamount * 0.5) + (Math.random() < 0.3 ? 1 : 0)
    const span = Math.max(st.span, 0.08) * 720 * 0.45
    for (let i = 0; i < n; i++) {
      const a = rand(0, 6.283), rr = span * Math.sqrt(rand(0.2, 1)), u = Math.random()
      const x = ((ox + (st.x - ox) * u) - 0.5) * FW + Math.cos(a) * rr, y = ((oy + (st.y - oy) * u) - 0.5) * FH + Math.sin(a) * rr
      S.handSpecks.push({ x, y, vx: (st.x - ox) * FW / Math.max(dt, 1e-3) * 0.25 + Math.cos(a) * rand(5, 30), vy: (st.y - oy) * FH / Math.max(dt, 1e-3) * 0.25 + Math.sin(a) * rand(5, 30), t: now, life: rand(0.9, 1.8), s: rand(2.5, 5.5) })
    }
  }
  for (const id of Object.keys(S.hands)) if (!hands.has(id)) delete S.hands[id]
  const g = S.grab
  if (grabNow) { g[0] += (grabNow[0] - g[0]) * Math.min(1, dt * 15); g[1] += (grabNow[1] - g[1]) * Math.min(1, dt * 15); g[2] += (grabNow[2] - g[2]) * Math.min(1, dt * 12) }
  else g[2] -= g[2] * Math.min(1, dt * 7)
}

function makeWish(x, y) {
  const now = S.t
  S.wishT = now; S.wish = { x, y, t: now }
  S.wishes.push({ x, y, t: now, seed: Math.random() }); S.wishes = S.wishes.slice(-P.Maxlotus); saveWishes()
  const lines = WISH_LINES.filter((l) => l !== S.wishLine); S.wishLine = lines[Math.floor(Math.random() * lines.length)]
  showWishLine(S.wishLine)
  S.events.push([x, y, 0.7, 1])
  sfx('wish_chime', 0.8, x)
  for (const f of S.fish) { f.react = now + rand(0, 0.35); f.mode = 'joy'; f.until = now + 7; f.happy = 0 }
  for (let i = 0; i < 26; i++) {            // gold sparkles off the coin
    const a = rand(0, 6.283), sp = rand(20, 90)
    S.sparkles.push({ x: (x - 0.5) * FW, y: (y - 0.5) * FH, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, t: now, life: rand(0.8, 1.6), s: rand(10, 22) })
  }
  document.getElementById('hint')?.classList.add('gone')
}

// ---------------------------------------------------------------- the koi
function koiStep(dt) {
  const now = S.t, n = S.fish.length
  S.fish.forEach((f, i) => {
    if (f.mode !== 'joy') for (const [ex, ey, s] of S.events) {
      const d = hypot((ex - f.x) * ASP, ey - f.y)
      if (s >= 0.8 && d < 0.55) { f.mode = 'shy'; f.until = now + rand(2.5, 4); f.fx = f.x - ex; f.fy = f.y - ey; f.v = Math.max(f.v, 0.22) }
      else if (s < 0.8 && d < 0.6 && f.mode !== 'shy' && Math.random() < 0.75) { f.mode = 'curious'; f.until = now + rand(4, 7); f.tx = ex + rand(-0.11, 0.11); f.ty = ey + rand(-0.11, 0.11) }
    }
    if (f.mode !== 'wander' && now > f.until) { f.mode = 'wander'; newTarget(f); f.react = 0; f.happy = 0 }
    const shy = f.mode === 'shy', joy = f.mode === 'joy' && S.wish && now >= (f.react || 0)
    let gx, gy, vt
    if (joy) {
      const W = S.wish, age = now - W.t, ang = age * 0.55 + i * 6.283 / Math.max(n, 1), rad = 0.15 + 0.02 * Math.sin(now * 0.9 + i)
      gx = (W.x + Math.cos(ang) * rad / ASP - f.x) * ASP; gy = W.y + Math.sin(ang) * rad - f.y; vt = 0.11
      f.happy = Math.max(0, 1 - age / 5) * 0.6
    } else if (shy) { gx = f.fx * ASP; gy = f.fy; vt = 0.14 }
    else {
      gx = (f.tx - f.x) * ASP; gy = f.ty - f.y
      if (hypot(gx, gy) < 0.07) { if (f.mode === 'wander') newTarget(f); vt = 0.045; if (f.mode === 'curious') newTargetNear(f) }
      else vt = f.mode === 'curious' ? 0.075 : 0.05
    }
    const g = hypot(gx, gy) || 1; let vx = gx / g, vy = gy / g
    const [d_, ex_, ey_] = pondEdge(f.x, f.y), m = 0.36
    if (d_ < m) { const k = 6 * ((m - d_) / m) ** 1.5; vx += ex_ * k; vy += ey_ * k }
    S.fish.forEach((o, j) => {
      if (j === i) return
      const ox = (f.x - o.x) * ASP, oy = f.y - o.y, od = hypot(ox, oy), sep = joy ? 0.12 : P.Koispacing
      if (od > 0 && od < sep) {
        const k3 = ((sep - od) / sep) ** 1.5 * 7; vx += ox / od * k3; vy += oy / od * k3
        if (od < sep * 0.55 && !joy) { const push = (sep * 0.55 - od) * dt * 1.6; f.x += ox / od * push / ASP; f.y += oy / od * push }
      }
    })
    if (!joy) for (const h of Object.values(S.hands)) {          // koi part around a moving hand
      const hx = (f.x - h.x) * ASP, hy = f.y - h.y, hd = hypot(hx, hy) + 1e-4
      if (hd < 0.24 && h.m > 0.12) { const k2 = (0.24 - hd) / 0.24 * 5 * h.m; vx += hx / hd * k2; vy += hy / hd * k2; f.v = Math.max(f.v, 0.05 + 0.06 * h.m * (0.24 - hd) / 0.24) }
    }
    let want = Math.atan2(vy, vx)
    if (!shy) want += (f.mode === 'wander' ? 0.5 : 0.15) * (Math.sin(now * 0.21 + f.seed) + 0.6 * Math.sin(now * 0.57 + f.seed * 1.7))
    const da = ((want - f.a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI
    const nearEdge = d_ < 0.3
    const maxw = shy ? 2.2 : joy ? 1.6 : nearEdge ? 1.6 : 0.8
    const wt = clamp(da * (shy ? 5 : joy ? 1.8 : 1.3), -maxw, maxw)
    f.w += (wt - f.w) * ease(dt, shy ? 0.12 : 0.7); f.a += f.w * dt
    // burst and glide
    const period = shy ? 1 : f.mode === 'curious' ? 2.2 : 3.4
    f.cyc = (f.cyc + dt / period) % 1
    const thrust = shy || joy || f.cyc < 0.38
    const vgoal = Math.max(0.03, vt * (thrust ? 1.2 : 0.7))
    f.v += (vgoal - f.v) * ease(dt, thrust ? 0.6 : 1.8)
    if (nearEdge) f.v *= Math.exp(-dt * 1.5 * (0.3 - d_) / 0.3)
    if (d_ < 0.34 && f.v > 0.035 && now - (f.bankT ?? -9) > 0.8) {
      f.bankT = now; S.impulses.push([f.x - ex_ * (d_ - 0.04) / ASP, f.y - ey_ * (d_ - 0.04), 0.16 + f.v * 1.2, 5])
    }
    if (d_ < 0.24) { f.x += ex_ * (0.24 - d_) * dt * 3 / ASP; f.y += ey_ * (0.24 - d_) * dt * 3 }
    f.x += Math.cos(f.a) * f.v * dt / ASP; f.y += Math.sin(f.a) * f.v * dt
    f.beat += ((thrust ? 1 : 0.25) - f.beat) * ease(dt, 0.3)
    f.phase = (f.phase + dt * (thrust ? (joy ? 2.4 : 1.2) + f.v * 14 : 0.45)) % 1000
    const dgoal = shy ? 0.95 : joy || f.mode === 'curious' ? 0 : 0.35 + 0.35 * Math.sin(now * 0.05 + f.seed * 3.1)
    f.dep += (dgoal - f.dep) * ease(dt, shy ? 0.8 : 2.5)
    f.bend += (clamp(-f.w * 0.9, -1, 1) - f.bend) * ease(dt, 0.25)
    // tail specks in the fish's own colour; gold while celebrating
    if (f.v > 0.02) {
      const s = P.Koisize * SIZES[i % 8], H = 480 * s, Wd = 320 * s, cx = (f.x - 0.5) * FW, cy = (f.y - 0.5) * FH
      const dx = Math.cos(f.a), dy = Math.sin(f.a), c = TRAIL_COL[i % 8], b = 1 - 0.5 * f.dep
      for (let q = 0; q < P.Koitrailcount; q++) {
        const kk = rand(0.45, 1), sd = rand(-0.12, 0.12) * Wd
        S.trail.push({ x: cx - dx * H * 0.4 * kk + dy * sd, y: cy - dy * H * 0.4 * kk - dx * sd, vx: rand(-5, 5), vy: rand(-5, 5), t: now, life: rand(1.6, 2.8), s: rand(2.5, 5), c, a: b * Math.min(1, 0.3 + f.v * 8) })
      }
      for (let q = 0; q < Math.floor(6 * f.happy * Math.random() * 0.5 + 0.3); q++) {
        const tt = rand(-0.45, 0.45) * H, sd = rand(-0.3, 0.3) * Wd
        S.trail.push({ x: cx + dx * tt + dy * sd, y: cy + dy * tt - dx * sd, vx: rand(-25, 25), vy: rand(-25, 25), t: now, life: rand(1, 1.8), s: rand(5, 9), c: [1, 0.8, 0.35], a: 0.9 })
      }
    }
  })
  // now and then a koi rises and kisses the surface
  for (const f of S.fish) {
    if (f.mode === 'wander' && f.dep < 0.25 && Math.random() < dt / 35 && now - S.bloopT > 6) {
      S.bloopT = now
      const mx = f.x + Math.cos(f.a) * 0.1 / ASP, my = f.y + Math.sin(f.a) * 0.1
      S.impulses.push([mx, my, 0.25, 4]); sfx('koi_bloop', 0.22, mx); break
    }
  }
}

// The koi body: 16 points along the spine, tail to nose (fish_mesh_data.py).
function spine(f, i) {
  const N = 16, s = P.Koisize * SIZES[i % 8], Hpx = 480 * s, Wpx = 320 * s
  const dx = Math.cos(f.a), dy = Math.sin(f.a), nx = dy, ny = -dx
  const cx = (f.x - 0.5) * FW, cy = (f.y - 0.5) * FH, hx = cx + dx * Hpx * 0.5, hy = cy + dy * Hpx * 0.5
  const h = f.hist
  if (!h.length || hypot(hx - h[h.length - 1][0], hy - h[h.length - 1][1]) > 1.5) h.push([hx, hy])
  const out = new Float32Array(N * 2)
  for (let v = 0; v < N; v++) {
    const u = v / (N - 1), back = (1 - u) * Hpx
    // walk back along the nose's trail
    let acc = 0, j = h.length - 1, px = hx, py = hy, found = false
    while (j > 0) {
      const sx = h[j - 1][0] - h[j][0], sy = h[j - 1][1] - h[j][1], seg = hypot(sx, sy)
      if (acc + seg >= back) { const t = (back - acc) / Math.max(seg, 1e-6); px = h[j][0] + sx * t; py = h[j][1] + sy * t; found = true; break }
      acc += seg; j--; px = h[j][0]; py = h[j][1]
    }
    if (!found) { px = h[0][0] - dx * (back - acc); py = h[0][1] - dy * (back - acc) }
    const sx = hx - dx * back, sy = hy - dy * back
    let x = sx + (px - sx) * P.Spinefollow, y = sy + (py - sy) * P.Spinefollow
    const w = (1 - u) ** 2 * P.Tailbeat * Wpx * 0.06 * (0.3 + 0.7 * f.beat), off = w * Math.sin(6.283 * (f.phase - u * 0.8))
    out[v * 2] = x + nx * off; out[v * 2 + 1] = y + ny * off
  }
  let total = 0
  for (let k = h.length - 1; k > 0; k--) { total += hypot(h[k][0] - h[k - 1][0], h[k][1] - h[k - 1][1]); if (total > Hpx * 1.5) { h.splice(0, k - 1); break } }
  return { pts: out, tex: i % 8, dep: f.dep, scale: s, bright: BRIGHT[i % 8] }
}

// ---------------------------------------------------------------- particles & leaves
function particlesStep(dt) {
  const now = S.t
  const age = (p) => now - p.t
  for (const arr of [S.trail, S.handSpecks, S.sparkles]) {
    for (const p of arr) { p.x += p.vx * dt; p.y += p.vy * dt }
  }
  for (const p of S.handSpecks) { const d = Math.exp(-dt * 1.8); p.vx *= d; p.vy *= d; const sw = 0.6 * dt, vx = p.vx; p.vx += -p.vy * sw; p.vy += vx * sw }
  for (const p of S.sparkles) { const d = Math.exp(-dt * 2.2); p.vx *= d; p.vy *= d }
  S.trail = S.trail.filter((p) => age(p) < p.life).slice(-1200)
  S.handSpecks = S.handSpecks.filter((p) => age(p) < p.life).slice(-900)
  S.sparkles = S.sparkles.filter((p) => age(p) < p.life)
  // leaves: a ripple arriving tips the leaf away and lifts it; it springs back slowly
  const imps = [...S.impulses, ...S.segments.map(([, , x1, y1, s, r]) => [x1, y1, s * 2, r])]
  LEAVES.forEach(([x, y, size], i) => {
    const sp = S.leafSpring[i]
    for (const [ix, iy, s] of imps) {
      const dx = (ix - 0.5) * FW - x, dy = (iy - 0.5) * FH - y, d = hypot(dx, dy) + 1
      if (d < size * 1.3) { const k = s * (1 - d / (size * 1.3)) * 60; sp.vx += -dy / d * k; sp.vy += dx / d * k; sp.vz += k * 0.4 }
    }
    for (const [a, v] of [['tx', 'vx'], ['ty', 'vy'], ['z', 'vz']]) {
      sp[v] = clamp(sp[v], -120, 120); sp[v] += (-sp[a] * 6 - sp[v] * 2.2) * dt; sp[a] += sp[v] * dt; sp[a] = clamp(sp[a], -30, 30)
    }
  })
}

// ---------------------------------------------------------------- one tick
let stepAcc = 0, ripAcc = 0
const RIPPLE_HZ = 40          // the installation's real frame rate, not the timeline's 60
const pending = { imps: [], segs: [] }
function step(dt) {
  S.t += dt
  S.impulses = []; S.segments = []; S.events = []
  handStep(dt)
  for (const [ex, ey, es, en] of S.events) if (es >= 0.3) S.impulses.push([ex, ey, es * 1.6, (P.Ripplemin + (P.Ripplemax - P.Ripplemin) * en) * 1.6])
  for (const e of S.events) if (e[2] >= 0.8) sfx('splash', Math.min(1, e[2] * (0.6 + 0.6 * e[3])) * 0.6, e[0])
  koiStep(dt)
  particlesStep(dt)
  pending.imps.push(...S.impulses); pending.segs.push(...S.segments)
  // swish while the water is being moved
  const moving = Math.max(0, ...Object.values(S.hands).map((h) => h.m))
  S.stir += (Math.min(1, moving * 1.2) - S.stir) * ease(dt, 0.25)
  if (S.stir > 0.12 && S.t - S.swishT > 1.1) { S.swishT = S.t; sfx('splash', (0.12 + 0.35 * S.stir) * 0.5) }
}

// ================================================================ WebGL
const canvas = document.getElementById('pond')
const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' })
const floatOK = gl && (gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'))
if (!gl || !floatOK) {
  document.getElementById('fallback').style.display = 'grid'
  document.getElementById('intro').remove()
  canvas.remove()
  throw new Error('WebGL2 with float render targets is not available')
}

const NOISE = `
vec3 m289(vec3 x){return x-floor(x*(1./289.))*289.;} vec4 m289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return m289(((x*34.)+1.)*x);} vec4 tis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=m289(i);
vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
vec4 norm=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`

function shader(type, src) {
  const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src.split('\n').map((l, i) => i + 1 + ': ' + l).join('\n'))
  return s
}
function program(vs, fs) {
  const p = gl.createProgram()
  gl.attachShader(p, shader(gl.VERTEX_SHADER, '#version 300 es\nprecision highp float;\n' + vs))
  gl.attachShader(p, shader(gl.FRAGMENT_SHADER, '#version 300 es\nprecision highp float;\n' + fs))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p))
  const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, info.name) }
  return { p, u }
}

const FULL_VS = `out vec2 vUV; void main(){ vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); vUV = p; gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`

// ripples: the damped wave equation, plus this frame's pushes
const ripplePrg = program(FULL_VS, `
in vec2 vUV; out vec4 o;
uniform sampler2D uState; uniform vec2 uPx; uniform float uDamp, uSpeed, uVisc;
uniform int uNI, uNS; uniform vec4 uImp[48]; uniform vec4 uSegA[24]; uniform vec2 uSegB[24];
float H(vec2 d){ return texture(uState, vUV + d).r; }
void main(){
  vec4 s = texture(uState, vUV);
  float edge = H(vec2(uPx.x,0.)) + H(vec2(-uPx.x,0.)) + H(vec2(0.,uPx.y)) + H(vec2(0.,-uPx.y));
  float diag = H(uPx) + H(-uPx) + H(vec2(uPx.x,-uPx.y)) + H(vec2(-uPx.x,uPx.y));
  float lap = (4.0*edge + diag - 20.0*s.r) / 6.0;
  float vel = s.r - s.g;
  float blur = (2.0*edge + diag + 4.0*s.r) / 16.0;
  float base = mix(s.r, blur, uVisc);
  float h = (base + vel*uDamp + uSpeed*lap) * uDamp;
  vec2 p = vUV * vec2(640.0, 360.0);
  float push = 0.0;
  for (int i = 0; i < 48; i++) { if (i >= uNI) break; vec4 m = uImp[i]; float d = length(p - m.xy) / m.z; push += m.w * (1.0 - smoothstep(0.0, 1.0, d)); }
  for (int i = 0; i < 24; i++) { if (i >= uNS) break; vec4 ab = uSegA[i]; vec2 pa = p - ab.xy, ba = ab.zw - ab.xy;
    float t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0); float d = length(pa - ba*t) / uSegB[i].x; push += uSegB[i].y * 0.7 * (1.0 - smoothstep(0.0, 1.0, d)); }
  h += push * 0.35 * 0.3;
  o = vec4(h, s.r, 0.0, 1.0);
}`)

// anime water (the floor build's colours)
const waterPrg = program(FULL_VS, NOISE + `
in vec2 vUV; out vec4 o;
uniform float uTime;
const vec3 SHALLOW = vec3(0.2, 0.62, 0.86), DEEP = vec3(0.05, 0.2, 0.48), LIGHT = vec3(0.55, 0.95, 1.0);
float steps(float v, float n){ float f = v*n; float w = max(fwidth(f), 1e-4); return (floor(f) + smoothstep(1.0-w, 1.0, fract(f))) / n; }
void main(){
  vec2 uv = vUV;
  float r = length((uv - vec2(0.5, 0.55)) * vec2(1.78, 1.0));
  vec3 col = mix(SHALLOW, DEEP, smoothstep(0.05, 1.05, r));
  float n = 0.62*snoise(vec3(uv*vec2(1.8,1.2), uTime*0.025)) + 0.3*snoise(vec3(uv*vec2(4.2,2.6)+7.0, uTime*0.04));
  float light = steps(clamp(n*0.5 + 0.5 - r*0.35, 0.0, 0.999), 4.0);
  col += LIGHT * light * ${F(P.Lightbands)};
  float s = 0.6*snoise(vec3(uv*vec2(3.0,2.0), uTime*0.03));
  float d = abs(fract(s*3.0) - 0.5) / max(fwidth(s*3.0), 1e-4);
  float streak = (1.0 - smoothstep(0.6, 1.6, d)) * smoothstep(-0.2, 0.4, snoise(vec3(uv*6.0, uTime*0.05)));
  col += LIGHT * streak * ${F(P.Streaks)} * (1.0 - smoothstep(0.4, 1.0, r));
  o = vec4(col, 1.0);
}`)

// koi: a grid bent along the spine (koi_mesh_vertex/pixel.glsl)
const koiPrg = program(`
in vec2 aT; uniform vec2 uSp[16]; uniform float uTex, uDep, uScl, uBright, uShadow, uTime, uFin, uId; uniform sampler2D uMask; uniform vec2 uView;
out vec2 vTc; out vec2 vN; out vec2 vTg; out float vDep; out float vBright; out float vBody;
void main(){
  vec2 t = aT; float fv = t.y * 15.0; int i0 = int(floor(fv)); int i1 = min(i0 + 1, 15); float fr = fv - float(i0);
  vec2 p0 = uSp[i0], p1 = uSp[i1], pa = uSp[max(i0-1,0)], pb = uSp[min(i1+1,15)];
  vec2 pos = mix(p0, p1, fr);
  vec2 T = normalize(mix(p1 - pa, pb - p0, fr) + vec2(1e-5, 0.0)); vec2 N = vec2(T.y, -T.x);
  float W = 320.0 * uScl;
  float col = mod(uTex, 4.0), row = floor(uTex / 4.0);
  vec2 tc = vec2((col + t.x) / 4.0, (1.0 - row + t.y) / 2.0);
  float body = textureLod(uMask, tc, 0.0).r;
  float s = t.x - 0.5; pos += N * s * W;
  float fin = (1.0 - body) * smoothstep(0.08, 0.4, abs(s) + (1.0 - t.y) * 0.25);
  pos += T * fin * uFin * W * 0.05 * sin(uTime*2.4 + t.y*6.0 + uId*1.7) * sign(s + 1e-4) + N * fin * uFin * W * 0.025 * sin(uTime*1.9 + t.y*4.0 + uId);
  if (uShadow > 0.5) pos += vec2(26.0, -34.0) * (1.0 - 0.7 * uDep);
  vTc = tc; vN = N; vTg = T; vDep = uDep; vBright = uBright; vBody = body;
  gl_Position = vec4(pos / vec2(640.0, 360.0), 0.0, 1.0);
}`, `
in vec2 vTc; in vec2 vN; in vec2 vTg; in float vDep; in float vBright; in float vBody; out vec4 o;
uniform sampler2D uAtlas, uMask; uniform float uShadow, uVolume, uShadowAlpha;
void main(){
  if (uShadow > 0.5) { float a = textureLod(uAtlas, vTc, 4.0).a; o = vec4(0.0, 0.0, 0.0, a * uShadowAlpha); return; }
  vec4 c = textureLod(uAtlas, vTc, vDep * 1.5);
  vec2 d = vec2(4.0/1280.0, 4.0/960.0);
  float gx = textureLod(uMask, vTc + vec2(d.x,0.), 2.0).r - textureLod(uMask, vTc - vec2(d.x,0.), 2.0).r;
  float gy = textureLod(uMask, vTc + vec2(0.,d.y), 2.0).r - textureLod(uMask, vTc - vec2(0.,d.y), 2.0).r;
  float m = textureLod(uMask, vTc, 1.0).r;
  vec2 g = -(gx * vN + gy * vTg) * 1.6;
  vec3 n = normalize(vec3(g, 0.55)); vec3 L = normalize(vec3(-0.55, 0.65, 0.9));
  float diff = max(dot(n, L), 0.0); float spec = pow(max(dot(n, normalize(L + vec3(0.,0.,1.))), 0.0), 30.0);
  vec3 lit = c.rgb * (0.68 + 0.45 * diff) + vec3(1.0, 0.97, 0.9) * spec * 0.35 * c.a;
  vec3 col = mix(c.rgb, lit, uVolume * m) * vBright;
  col *= vec3(1.0 - vDep*0.35, 1.0 - vDep*0.22, 1.0 - vDep*0.08);
  float fade = 1.0 - vDep * 0.25;
  o = vec4(col * fade, c.a * fade);
}`)

// sprites: leaves, coins, specks, sparkles, shadows (instanced quads)
const spritePrg = program(`
in vec2 aQ; in vec4 aPos; in vec4 aCol; in float aLod;
out vec2 vUv; out vec4 vCol; out float vLod;
void main(){
  vec2 q = aQ - 0.5; float c = cos(aPos.w), s = sin(aPos.w);
  vec2 sz = vec2(aPos.z, aPos.z * aLod);   // aLod doubles as the y scale (tilt)
  vec2 p = aPos.xy + mat2(c, s, -s, c) * (q * sz);
  vUv = aQ; vCol = aCol; vLod = 0.0;
  gl_Position = vec4(p / vec2(640.0, 360.0), 0.0, 1.0);
}`, `
in vec2 vUv; in vec4 vCol; in float vLod; out vec4 o;
uniform sampler2D uTex; uniform int uMode; uniform float uBias;
void main(){
  if (uMode == 3) { float d = length(vUv - 0.5) * 2.0; float a = exp(-d*d*3.2) * (1.0 - smoothstep(0.85, 1.0, d)) * vCol.a; o = vec4(vCol.rgb * a, a); return; }   // soft dot, over
  if (uMode == 1) { float d = length(vUv - 0.5) * 2.0; float a = exp(-d*d*3.2) * (1.0 - smoothstep(0.85, 1.0, d)); o = vec4(vCol.rgb * a * vCol.a, 0.0); return; }   // soft dot, additive
  vec4 t = texture(uTex, vUv, uBias);
  if (uMode == 2) { o = vec4(0.0, 0.0, 0.0, t.a * vCol.a); return; }        // shadow
  o = t * vCol;                                                              // premultiplied
}`)

// the surface: refraction, ring light, wave light, hand and wish lights
const surfacePrg = program(FULL_VS, `
in vec2 vUV; out vec4 o;
uniform sampler2D uUnder, uRip; uniform float uTime;
uniform vec4 uHand[3]; uniform vec4 uGrab; uniform vec4 uWish;
const vec3 RCOL = vec3(0.78, 0.95, 1.0);
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash2(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float Hh(vec2 uv){ return texture(uRip, uv).r; }
vec2 grad(vec2 uv){ vec2 e = 1.0 / vec2(640.0, 360.0); return vec2(Hh(uv + vec2(e.x,0.)) - Hh(uv - vec2(e.x,0.)), Hh(uv + vec2(0.,e.y)) - Hh(uv - vec2(0.,e.y))) * 0.5; }
float ring(vec2 uv){   // ink_enso_rings: contour lines of the surface height, in px at 640
  float h = Hh(uv); float g = length(grad(uv)) + 1e-6; float q = h / ${F(P.Inklevel)};
  float d = abs(fract(q + 0.5) - 0.5) * ${F(P.Inklevel)} / g;
  float w = ${F(P.Inkwidth)} * 0.78;
  float line = 1.0 - smoothstep(w*0.5, w*0.5 + 0.9, d);
  float rr = clamp(abs(q) - 0.5, 0.0, 3.0) / 3.0;
  float strength = smoothstep(${F(P.Inkminslope)}, ${F(P.Inkminslope * 4)}, g) * (0.45 + 0.55 * rr);
  float airy = smoothstep(3.0, 7.0, ${F(P.Inklevel)} / g);
  return line * strength * airy * 0.9;
}
void main(){
  vec2 uv = vUV;
  vec2 gr = grad(uv);
  vec3 nrm = normalize(vec3(-gr * 45.0, 1.0));
  vec3 col = texture(uUnder, uv + nrm.xy * 0.5 * ${F(P.Refraction)}).rgb;
  // ripple light: specks born on each ring, drifting out with the wave, over a faint line and glow
  vec2 px = uv * vec2(640.0, 360.0); vec2 wdir = normalize(nrm.xy + 1e-6); vec2 rc = floor(px / 2.0); vec3 rp = vec3(0.0);
  for (int k = 0; k < 3; k++) {
    vec2 h = hash2(rc + float(k) * 23.0);
    float life = fract(uTime * (0.25 + 0.25 * h.y) + h.x * 5.0);
    vec2 c = (rc + h) * 2.0;
    float r = ring((c - wdir * life * 8.0) / vec2(640.0, 360.0));
    float spk = 1.0 - smoothstep(0.35, 1.25, length(px - c));
    rp += RCOL * r * spk * (1.0 - life) * (1.0 - life) * (0.6 + 0.4 * hash(rc + float(k)));
  }
  float rl = ring(uv);
  col += rp * ${F(P.Rparticles)} + RCOL * rl * 0.5;
  col += vec3(0.55, 0.85, 1.0) * max(nrm.y, 0.0) * 0.3 * 0.35;                        // wave light
  vec2 f = (uv - 0.5) * vec2(1280.0, 720.0);
  for (int i = 0; i < 3; i++) { vec4 h = uHand[i]; if (h.w <= 0.0) continue;          // the hand's own light
    float d = length(f - h.xy); col += vec3(0.55, 0.85, 1.0) * h.w * 0.16 * exp(-pow(d / max(h.z, 1.0), 2.0)); }
  if (uGrab.z > 0.01) { float d = length(f - uGrab.xy);                                 // a closing fist: gold glow and a ring
    col += vec3(1.0, 0.82, 0.45) * uGrab.z * 0.35 * exp(-pow(d / 34.0, 2.0));
    float rr = 96.0 * (1.15 - 0.15 * uGrab.z); col += vec3(1.0, 0.85, 0.5) * uGrab.z * 0.5 * exp(-pow((d - rr) / 2.2, 2.0)); }
  if (uWish.z >= 0.0 && uWish.z < 6.0) { float d = length(f - uWish.xy); float R = 140.0 + uWish.z * 260.0;   // the wish's light
    col += vec3(1.0, 0.9, 0.62) * 0.22 * exp(-uWish.z * 0.9) * exp(-pow(d / R, 2.0));
  }
  o = vec4(col, 1.0);
}`)

// post: sunlight, colour, grain, vignette, and the bank (pond_edge.glsl)
const postPrg = program(FULL_VS, `
in vec2 vUV; out vec4 o;
uniform sampler2D uSurf, uRip; uniform float uTime; uniform vec4 uFit; uniform float uRot;   // fit: frame offset + scale in screen uv
void main(){
  vec2 sv = uRot > 0.5 ? vec2(vUV.y, 1.0 - vUV.x) : vUV;      // portrait: the pond turns to fill the screen
  vec2 uv = (sv - uFit.xy) / uFit.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) { o = vec4(0.0, 0.0, 0.0, 1.0); return; }
  vec2 res = vec2(1280.0, 720.0), px = uv * res, c = px - res * 0.5;
  float ang = atan(c.y, c.x); vec2 dirIn = -normalize(c + 1e-4);
  vec2 R = vec2(${F(BANK.rx)}, ${F(BANK.ry)});
  vec2 q = abs(c) / R; float fsh = pow(pow(q.x, ${F(BANK.n)}) + pow(q.y, ${F(BANK.n)}), 1.0 / ${F(BANK.n)});
  float lap = sin(ang * 2.0 + uTime * 0.22) * 0.55 + sin(ang * 3.0 - uTime * 0.17 + 1.3) * 0.45;
  vec2 su = (px + dirIn * 30.0) / res; vec2 e = vec2(11.0) / res; float h = 0.0;
  h += texture(uRip, su).r * 0.4 + (texture(uRip, su + vec2(e.x,0.)).r + texture(uRip, su - vec2(e.x,0.)).r + texture(uRip, su + vec2(0.,e.y)).r + texture(uRip, su - vec2(0.,e.y)).r) * 0.15;
  float shore = (1.0 - fsh) * min(R.x, R.y) + lap * ${F(P.Shorelap)} + ${F(P.Shorewave)} * tanh(h * 2.0);
  float near = 1.0 - smoothstep(0.0, ${F(P.Shoremeniscus)} * 2.5, shore);
  vec3 col = texture(uSurf, (px + dirIn * near * near * ${F(P.Shoremeniscus)}) / res).rgb;
  // sunlight from the upper left, colour, vignette
  col += vec3(0.5, 0.8, 1.0) * 0.178 * 0.5 * (1.0 - smoothstep(0.0, 0.55, length((uv - vec2(0.12, 0.9)) * vec2(1.78, 1.0)) / 1.78));
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722)); col = mix(vec3(l), col, ${F(P.Saturation)});
  float vr = length((uv - 0.5) * vec2(1.0, 1.0)); col *= mix(1.0 - ${F(P.Vignette)}, 1.0, 1.0 - smoothstep(0.25, 0.8, vr));
  float a = smoothstep(-2.0, 7.0, shore);
  col *= mix(0.78, 1.0, smoothstep(0.0, 14.0, shore));
  float rim = exp(-pow((shore - 2.5) / 2.2, 2.0));
  vec3 irid = 0.5 + 0.5 * cos(6.2832 * (ang / 6.2832 * 1.5 + uTime * 0.03 + vec3(0.0, 0.33, 0.67)));
  col += mix(vec3(0.8, 0.92, 1.0), irid, 0.45) * rim * ${F(P.Shoresheen)};
  float n = fract(sin(dot(gl_FragCoord.xy + fract(uTime) * 61.0, vec2(12.9898, 78.233))) * 43758.5453);
  col = col * a + (n - 0.5) * ${F(P.Grain)} * a + (n - 0.5) / 255.0 * 1.5;
  o = vec4(col, 1.0);
}`)

// ---------------------------------------------------------------- GPU resources
function tex(w, h, internal, format, type, filter = gl.LINEAR) {
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t)
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return t
}
function fbo(t) { const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); return f }
const RW = 640, RH = 360
const rip = [0, 1].map(() => { const t = tex(RW, RH, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT); return { t, f: fbo(t) } })
for (const r of rip) { gl.bindFramebuffer(gl.FRAMEBUFFER, r.f); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT) }
let ripI = 0
let FWpx = 0, FHpx = 0, under, surf
function sizeFrames() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr)
  const s = Math.max(Math.min(canvas.width / FW, canvas.height / FH), Math.min(canvas.height / FW, canvas.width / FH))
  const w = clamp(Math.round(FW * s), 640, 1600), h = Math.round(w * 9 / 16)
  document.body.classList.toggle('portrait', canvas.height > canvas.width * 1.1)
  if (w === FWpx) return
  FWpx = w; FHpx = h
  for (const r of [under, surf]) if (r) { gl.deleteTexture(r.t); gl.deleteFramebuffer(r.f) }
  under = (() => { const t = tex(w, h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE); return { t, f: fbo(t) } })()
  surf = (() => { const t = tex(w, h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE); return { t, f: fbo(t) } })()
}
sizeFrames(); addEventListener('resize', sizeFrames)

function loadImage(src, mips = true) {
  return new Promise((res, rej) => {
    const img = new Image(); img.onload = () => {
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      if (mips) gl.generateMipmap(gl.TEXTURE_2D)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      res(t)
    }
    img.onerror = rej; img.src = new URL(src, import.meta.url).href
  })
}
const T = {}
const ready = Promise.all([
  ['atlas', 'a/koi_atlas.webp'], ['mask', 'a/koi_mask.png'], ['leaf0', 'a/leaf_1.webp'], ['leaf1', 'a/leaf_2.webp'],
  ['leaf2', 'a/leaf_3.webp'], ['coin', 'a/coin.webp'], ['sparkle', 'a/sparkle.png'],
].map(async ([k, src]) => { T[k] = await loadImage(src) }))

// koi grid: 12 across, 48 along
const koiVao = gl.createVertexArray(); gl.bindVertexArray(koiVao)
const KX = 12, KY = 48, kv = [], ki = []
for (let y = 0; y <= KY; y++) for (let x = 0; x <= KX; x++) kv.push(x / KX, y / KY)
for (let y = 0; y < KY; y++) for (let x = 0; x < KX; x++) { const a = y * (KX + 1) + x, b = a + 1, c = a + KX + 1, d = c + 1; ki.push(a, b, d, a, d, c) }
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(kv), gl.STATIC_DRAW)
const kLoc = gl.getAttribLocation(koiPrg.p, 'aT'); gl.enableVertexAttribArray(kLoc); gl.vertexAttribPointer(kLoc, 2, gl.FLOAT, false, 0, 0)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ki), gl.STATIC_DRAW)

// sprite batch
const spVao = gl.createVertexArray(); gl.bindVertexArray(spVao)
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW)
const qLoc = gl.getAttribLocation(spritePrg.p, 'aQ'); gl.enableVertexAttribArray(qLoc); gl.vertexAttribPointer(qLoc, 2, gl.FLOAT, false, 0, 0)
const instBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, instBuf)
const STRIDE = 9 * 4
for (const [name, size, off] of [['aPos', 4, 0], ['aCol', 4, 16], ['aLod', 1, 32]]) {
  const l = gl.getAttribLocation(spritePrg.p, name); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, gl.FLOAT, false, STRIDE, off); gl.vertexAttribDivisor(l, 1)
}
let inst = new Float32Array(9 * 2048)
function drawSprites(list, texture, mode, blend, bias = 0) {
  if (!list.length) return
  if (list.length * 9 > inst.length) inst = new Float32Array(list.length * 9 * 2)
  list.forEach((s, i) => inst.set(s, i * 9))
  gl.useProgram(spritePrg.p); gl.bindVertexArray(spVao)
  gl.bindBuffer(gl.ARRAY_BUFFER, instBuf); gl.bufferData(gl.ARRAY_BUFFER, inst.subarray(0, list.length * 9), gl.DYNAMIC_DRAW)
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture || T.sparkle); gl.uniform1i(spritePrg.u.uTex, 0)
  gl.uniform1i(spritePrg.u.uMode, mode); gl.uniform1f(spritePrg.u.uBias, bias)
  gl.enable(gl.BLEND)
  if (blend === 'add') gl.blendFunc(gl.ONE, gl.ONE)
  else gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, list.length)
}
function fullscreen(prg) { gl.useProgram(prg.p); gl.bindVertexArray(null); gl.drawArrays(gl.TRIANGLES, 0, 3) }
function bind(prg, name, unit, t) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(prg.u[name], unit) }

// ---------------------------------------------------------------- render
function stepRipples() {
  const src = rip[ripI], dst = rip[1 - ripI]
  gl.bindFramebuffer(gl.FRAMEBUFFER, dst.f); gl.viewport(0, 0, RW, RH); gl.disable(gl.BLEND)
  gl.useProgram(ripplePrg.p); bind(ripplePrg, 'uState', 0, src.t)
  gl.uniform2f(ripplePrg.u.uPx, 1 / RW, 1 / RH)
  gl.uniform1f(ripplePrg.u.uDamp, P.Ripplelife); gl.uniform1f(ripplePrg.u.uSpeed, P.Ripplespeed); gl.uniform1f(ripplePrg.u.uVisc, P.Ripplevisc)
  const imps = pending.imps.slice(-48), segs = pending.segs.slice(-24)
  pending.imps = []; pending.segs = []
  const iv = new Float32Array(48 * 4), sa = new Float32Array(24 * 4), sb = new Float32Array(24 * 2)
  // a round push: a soft bump r*2.8 px wide at 640 (impulse_instances.py), once
  imps.forEach(([x, y, s, r], i) => iv.set([x * RW, y * RH, r * 2.8, s], i * 4))
  segs.forEach(([x0, y0, x1, y1, s, r], i) => { sa.set([x0 * RW, y0 * RH, x1 * RW, y1 * RH], i * 4); sb.set([r * 1.6, s], i * 2) })
  gl.uniform1i(ripplePrg.u.uNI, imps.length); gl.uniform1i(ripplePrg.u.uNS, segs.length)
  gl.uniform4fv(ripplePrg.u.uImp, iv); gl.uniform4fv(ripplePrg.u.uSegA, sa); gl.uniform2fv(ripplePrg.u.uSegB, sb)
  fullscreen(ripplePrg)
  ripI = 1 - ripI
}

function render() {
  const now = S.t
  // ---- under the water
  gl.bindFramebuffer(gl.FRAMEBUFFER, under.f); gl.viewport(0, 0, FWpx, FHpx); gl.disable(gl.BLEND)
  gl.useProgram(waterPrg.p); gl.uniform1f(waterPrg.u.uTime, now); fullscreen(waterPrg)
  // leaf shadows fall down-right onto the water
  const leafSprites = LEAVES.map(([x, y, size, rot, tx], i) => {
    const sp = S.leafSpring[i]
    const px = x + 34 * Math.sin(now * 0.05 + i * 2.1) + 10 * Math.sin(now * 0.16 + i) + sp.tx * 1.5
    const py = y + 24 * Math.cos(now * 0.045 + i * 1.3) + 8 * Math.sin(now * 0.2 + i * 3) + sp.ty * 1.5
    const rz = (rot + 16 * Math.sin(now * 0.035 + i * 1.9) + 4 * Math.sin(now * 0.12 + i)) * Math.PI / 180
    const tilt = Math.cos(clamp(sp.tx + 3 * Math.sin(now * 0.5 + i * 1.7), -14, 14) * Math.PI / 180)
    return { px, py, rz, size: size * (1 + sp.z * 0.004), tilt, tx }
  })
  for (let k = 0; k < 3; k++) drawSprites(leafSprites.filter((l) => l.tx === k).map((l) => [l.px + 26, l.py - 34, l.size, l.rz, 1, 1, 1, 0.3, l.tilt]), T['leaf' + k], 2, 'over', 3)
  // fish shadows, deepest first
  const order = S.fish.map((f, i) => [f, i]).sort((a, b) => b[0].dep - a[0].dep)
  const sp = order.map(([f, i]) => [spine(f, i), i])
  gl.useProgram(koiPrg.p); gl.bindVertexArray(koiVao)
  bind(koiPrg, 'uAtlas', 0, T.atlas); bind(koiPrg, 'uMask', 1, T.mask)
  gl.uniform1f(koiPrg.u.uTime, now); gl.uniform1f(koiPrg.u.uFin, P.Finflutter); gl.uniform1f(koiPrg.u.uVolume, P.Koivolume); gl.uniform1f(koiPrg.u.uShadowAlpha, P.Koishadow)
  gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  for (const pass of [1, 0]) {
    gl.uniform1f(koiPrg.u.uShadow, pass)
    if (pass === 0) {           // coins rest on the bed, under the koi
      const coins = S.wishes.map((w) => {
        const age = now - w.t, seed = w.seed, sink = 1 - Math.exp(-Math.max(age, 0) / 1.2)
        const x = (w.x - 0.5) * FW + Math.sin(seed * 50) * 30 * sink + 10 * Math.sin(age * 2.2) * (1 - sink)
        const y = (w.y - 0.5) * FH + Math.cos(seed * 70) * 20 * sink
        const spin = (age * 200 * Math.exp(-age) + seed * 360) * Math.PI / 180
        const tilt = age < 4 ? 0.45 + 0.55 * Math.abs(Math.cos(age * 6 * Math.exp(-age / 1.5) + seed * 9)) : 1
        const s = P.Coinsize * (1 - 0.5 * sink), a = Math.min(1, age / 0.1) * (1 - 0.5 * sink) * (0.92 + 0.08 * Math.sin(now * 0.8 + seed * 20))
        return [x, y, s, spin, a, a, a, a, tilt]
      })
      drawSprites(coins, T.coin, 0, 'over')
      gl.useProgram(koiPrg.p); gl.bindVertexArray(koiVao)
      bind(koiPrg, 'uAtlas', 0, T.atlas); bind(koiPrg, 'uMask', 1, T.mask)
      gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    }
    for (const [s, i] of sp) {
      gl.uniform2fv(koiPrg.u.uSp, s.pts); gl.uniform1f(koiPrg.u.uTex, s.tex); gl.uniform1f(koiPrg.u.uDep, s.dep)
      gl.uniform1f(koiPrg.u.uScl, s.scale); gl.uniform1f(koiPrg.u.uBright, s.bright); gl.uniform1f(koiPrg.u.uId, i)
      gl.drawElements(gl.TRIANGLES, ki.length, gl.UNSIGNED_SHORT, 0)
    }
  }
  // light around the koi, and slow motes deep in the water
  drawSprites(S.trail.map((p) => { const k = (now - p.t) / p.life; const a = Math.min(0.6, (1 - k) ** 1.5 * p.a * P.Kointrails * 2.2); return [p.x, p.y, p.s * (1 + 1.2 * k) * 1.6, 0, p.c[0], p.c[1], p.c[2], a, 1] }), null, 3, 'over')
  drawSprites(S.motes.map((m) => [m.x + Math.sin(now * 0.07 + m.ph) * 20, m.y + Math.cos(now * 0.05 + m.ph) * 14, m.s * 2.4, 0, 0.75, 0.9, 1, 0.16 + 0.08 * Math.sin(now * 0.6 + m.ph), 1]), null, 1, 'add')

  // ---- the surface
  gl.bindFramebuffer(gl.FRAMEBUFFER, surf.f); gl.viewport(0, 0, FWpx, FHpx); gl.disable(gl.BLEND)
  gl.useProgram(surfacePrg.p); bind(surfacePrg, 'uUnder', 0, under.t); bind(surfacePrg, 'uRip', 1, rip[ripI].t)
  gl.uniform1f(surfacePrg.u.uTime, now)
  const hv = new Float32Array(12)
  Object.values(S.hands).slice(0, 3).forEach((h, i) => hv.set([(h.x - 0.5) * FW, (h.y - 0.5) * FH, Math.max(h.span * 720 * 0.4, 20), 0.35 + h.m], i * 4))
  gl.uniform4fv(surfacePrg.u.uHand, hv)
  gl.uniform4f(surfacePrg.u.uGrab, (S.grab[0] - 0.5) * FW, (S.grab[1] - 0.5) * FH, S.grab[2], 0)
  gl.uniform4f(surfacePrg.u.uWish, S.wish ? (S.wish.x - 0.5) * FW : 0, S.wish ? (S.wish.y - 0.5) * FH : 0, S.wish ? now - S.wish.t : -1, 0)
  fullscreen(surfacePrg)
  // things on the surface: hand specks, leaves, the coin in a closing hand, sparkles
  drawSprites(S.handSpecks.map((p) => { const k = (now - p.t) / p.life; return [p.x, p.y, p.s * (1 + 0.6 * k) * 2.2, 0, 0.85, 0.95, 1, Math.min(1, k * 8) * (1 - k) ** 1.4 * P.Trailglow * 0.45, 1] }), null, 1, 'add')
  for (let k = 0; k < 3; k++) drawSprites(leafSprites.filter((l) => l.tx === k).map((l) => [l.px, l.py, l.size, l.rz, 1, 1, 1, 1, l.tilt]), T['leaf' + k], 0, 'over')
  if (S.grab[2] > 0.02) { const g = S.grab[2]; drawSprites([[(S.grab[0] - 0.5) * FW, (S.grab[1] - 0.5) * FH, P.Coinsize * (0.6 + 0.5 * g), now * 0.6, g, g, g, g, 1]], T.coin, 0, 'over') }
  drawSprites(S.sparkles.map((p) => { const k = (now - p.t) / p.life; const a = Math.sin(Math.PI * k) * 0.9; return [p.x, p.y, p.s, now * 2 + p.s, a, a * 0.86, a * 0.55, a, 1] }), T.sparkle, 0, 'add')

  // ---- to the screen
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); gl.disable(gl.BLEND)
  gl.useProgram(postPrg.p); bind(postPrg, 'uSurf', 0, surf.t); bind(postPrg, 'uRip', 1, rip[ripI].t)
  gl.uniform1f(postPrg.u.uTime, now)
  const fit = fitRect(); gl.uniform4f(postPrg.u.uFit, fit.x, fit.y, fit.w, fit.h); gl.uniform1f(postPrg.u.uRot, fit.rot ? 1 : 0)
  fullscreen(postPrg)
}
// the 16:9 frame, contained in the window (screen uv, y up)
// On a portrait screen the frame is turned 90 degrees (its top edge to the left).
function fitRect() {
  const rot = canvas.height > canvas.width * 1.1
  const cw = rot ? canvas.height : canvas.width, ch = rot ? canvas.width : canvas.height
  const s = Math.min(cw / FW, ch / FH) * (rot ? 1.04 : 1)
  const w = FW * s / cw, h = FH * s / ch
  return { x: (1 - w) / 2, y: (1 - h) / 2, w, h, rot }
}

// ---------------------------------------------------------------- the pointer is a hand
function toPond(e) {
  const f = fitRect(), r = canvas.getBoundingClientRect()
  let u = (e.clientX - r.left) / r.width, v = 1 - (e.clientY - r.top) / r.height
  if (f.rot) [u, v] = [v, 1 - u]
  document.body.classList.toggle('portrait', f.rot)
  return [(u - f.x) / f.w, (v - f.y) / f.h]
}
const ptr = { on: false, down: false, x: 0.5, y: 0.5, downAt: 0, travel: 0 }
function pointerHand() {
  if (!ptr.on) { hands.delete('ptr'); return }
  // a press that turns into a drag is a wake, not a wish
  const closed = ptr.down && ptr.travel < 0.08
  hands.set('ptr', { x: ptr.x, y: ptr.y, closed, near: 0.5, span: 0.14, pointer: true })
}
canvas.addEventListener('pointermove', (e) => {
  const [x, y] = toPond(e)
  if (ptr.down) ptr.travel += hypot((x - ptr.x) * ASP, y - ptr.y)
  ptr.x = x; ptr.y = y; ptr.on = x > 0 && x < 1 && y > 0 && y < 1
})
canvas.addEventListener('pointerdown', (e) => {
  const [x, y] = toPond(e); ptr.x = x; ptr.y = y; ptr.on = true; ptr.down = true; ptr.travel = 0
  canvas.setPointerCapture?.(e.pointerId); startAudio()
})
const up = () => { ptr.down = false }
canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up)
canvas.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { ptr.on = false; ptr.down = false } })
canvas.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') setTimeout(() => { if (!ptr.down) ptr.on = false }, 120) })

// ---------------------------------------------------------------- your hand (MediaPipe)
const camBtn = document.getElementById('hand'), camCanvas = document.getElementById('cam'), cctx = camCanvas.getContext('2d')
let cam = null
const BONES = [[0, 1, 2, 3, 4], [0, 5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [0, 17, 18, 19, 20], [5, 9, 13, 17]]
camBtn.addEventListener('click', async () => {
  if (cam) { stopCam(); return }
  camBtn.textContent = 'Starting camera…'
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360, facingMode: 'user' }, audio: false })
    const video = Object.assign(document.createElement('video'), { srcObject: stream, muted: true, playsInline: true })
    await video.play()
    const V = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs')
    const files = await V.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm')
    const lm = await V.HandLandmarker.createFromOptions(files, {
      baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate: 'GPU' },
      runningMode: 'VIDEO', numHands: 2,
    })
    cam = { stream, video, lm, last: -1, results: null }
    camBtn.textContent = 'Using your hand'; camBtn.setAttribute('aria-pressed', 'true'); camCanvas.classList.add('on')
    document.getElementById('hint').textContent = 'Hold your hand over the water. Close it around a wish, then open it.'
    document.getElementById('hint').classList.remove('gone')
    startAudio()
  } catch (err) {
    console.warn(err); camBtn.textContent = 'Camera unavailable'; setTimeout(() => { camBtn.textContent = 'Use your hand' }, 2500)
  }
})
function stopCam() {
  cam.stream.getTracks().forEach((t) => t.stop()); cam.lm.close(); cam = null
  for (const id of [...hands.keys()]) if (id.startsWith('cam')) hands.delete(id)
  camBtn.textContent = 'Use your hand'; camBtn.setAttribute('aria-pressed', 'false'); camCanvas.classList.remove('on')
}
function camHands(t) {
  for (const id of [...hands.keys()]) if (id.startsWith('cam')) hands.delete(id)
  if (!cam || cam.video.readyState < 2) return
  if (cam.video.currentTime !== cam.last) { cam.last = cam.video.currentTime; cam.results = cam.lm.detectForVideo(cam.video, t) }
  const res = cam.results, va = cam.video.videoWidth / cam.video.videoHeight || ASP
  cctx.save(); cctx.scale(-1, 1); cctx.drawImage(cam.video, -camCanvas.width, 0, camCanvas.width, camCanvas.height); cctx.restore()
  cctx.fillStyle = 'rgba(0,10,20,.35)'; cctx.fillRect(0, 0, camCanvas.width, camCanvas.height)
  ;(res?.landmarks || []).forEach((L, k) => {
    const X = (j) => L[j].x * va, Y = (j) => L[j].y
    const palm = (Math.hypot(X(9) - X(0), Y(9) - Y(0))) + 1e-4
    const open = [8, 12, 16, 20].reduce((s, j) => s + Math.hypot(X(j) - X(0), Y(j) - Y(0)), 0) / 4 / palm
    const far = (j) => Math.hypot(X(j) - X(0), Y(j) - Y(0))
    const straight = [[8, 6], [12, 10], [16, 14], [20, 18]].every(([tp, pp]) => far(tp) > far(pp) * 1.08)
    const id = 'cam' + k, prev = hands.get(id)
    // a fist below 1.3, an open palm above 1.55 with straight fingers; in between keeps the last state
    let closed = open < 1.3 ? true : open > 1.55 && straight ? false : (S.hands[id]?.since != null)
    const cx = [0, 5, 9, 13, 17].reduce((s, j) => s + L[j].x, 0) / 5, cy = [0, 5, 9, 13, 17].reduce((s, j) => s + L[j].y, 0) / 5
    const x = clamp(0.5 + ((1 - cx) - 0.5) * 1.3, 0, 1), y = clamp(0.5 + ((1 - cy) - 0.5) * 1.3, 0, 1)   // mirrored, a little magnified
    const span = Math.max(...[4, 8, 12, 16, 20, 5, 17, 0].flatMap((a) => [4, 8, 12, 16, 20, 5, 17, 0].map((b) => Math.hypot((L[a].x - L[b].x) * va, L[a].y - L[b].y))))
    hands.set(id, { x, y, closed, near: 0.5, span: span * 1.3 })
    cctx.strokeStyle = closed ? 'rgba(255,214,120,.95)' : 'rgba(170,225,255,.95)'; cctx.lineWidth = 2
    for (const b of BONES) { cctx.beginPath(); b.forEach((j, n) => { const px = (1 - L[j].x) * camCanvas.width, py = L[j].y * camCanvas.height; n ? cctx.lineTo(px, py) : cctx.moveTo(px, py) }); cctx.stroke() }
  })
}

// ---------------------------------------------------------------- sound
let actx = null, master = null
const buffers = {}
let soundOn = true
const soundBtn = document.getElementById('sound')
soundBtn.addEventListener('click', () => {
  soundOn = !soundOn; soundBtn.textContent = soundOn ? 'Sound on' : 'Sound off'; soundBtn.setAttribute('aria-pressed', String(soundOn))
  if (master) master.gain.setTargetAtTime(soundOn ? 1 : 0, actx.currentTime, 0.2)
  if (soundOn) startAudio()
})
async function startAudio() {
  if (actx || !soundOn) { if (actx?.state === 'suspended') actx.resume(); return }
  actx = new (window.AudioContext || window.webkitAudioContext)(); master = actx.createGain(); master.connect(actx.destination)
  const load = async (n) => { const r = await fetch(new URL(`a/${n}.m4a`, import.meta.url)); buffers[n] = await actx.decodeAudioData(await r.arrayBuffer()) }
  await Promise.all(['wish_chime', 'koi_bloop', 'splash'].map(load).concat(load('ambient').then(loopAmbient))).catch(() => {})
}
function loopAmbient() {     // two overlapping copies with long fades, so the loop has no seam
  const b = buffers.ambient; if (!b) return
  const fade = 4, len = b.duration
  const play = (at) => {
    const s = actx.createBufferSource(), g = actx.createGain(); s.buffer = b; s.connect(g); g.connect(master)
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(P.Ambient, at + fade)
    g.gain.setValueAtTime(P.Ambient, at + len - fade); g.gain.linearRampToValueAtTime(0, at + len)
    s.start(at); s.stop(at + len)
    setTimeout(() => play(at + len - fade), (at + len - fade - actx.currentTime - 1) * 1000)
  }
  play(actx.currentTime + 0.1)
}
function sfx(name, vol, x = 0.5) {
  if (!actx || !soundOn || !buffers[name]) return
  const s = actx.createBufferSource(), g = actx.createGain(), p = actx.createStereoPanner ? actx.createStereoPanner() : null
  s.buffer = buffers[name]; g.gain.value = clamp(vol, 0, 1) * P.Volume
  if (p) { p.pan.value = clamp((x - 0.5) * 1.4, -0.8, 0.8); s.connect(g); g.connect(p); p.connect(master) } else { s.connect(g); g.connect(master) }
  s.start()
}

// ---------------------------------------------------------------- the wish line, round the bank
const wishEl = document.getElementById('wishline'), wishPath = wishEl.querySelector('textPath')
let wishTimer = 0
function showWishLine(text) {
  clearTimeout(wishTimer)
  const cap = document.getElementById('wishcap')
  wishPath.textContent = text; cap.textContent = text
  wishEl.style.transition = 'opacity 1.2s ease'
  setTimeout(() => { wishEl.setAttribute('opacity', '1'); cap.style.opacity = '1' }, 1200)
  wishTimer = setTimeout(() => { wishEl.setAttribute('opacity', '0'); cap.style.opacity = '0' }, 1200 + P.Wishtexthold * 1000)
}

// ---------------------------------------------------------------- go
document.getElementById('enter').addEventListener('click', () => {
  document.getElementById('intro').classList.add('gone'); canvas.classList.remove('idle'); startAudio()
})
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
let last = performance.now()
await ready
function frame(t) {
  const dt = Math.min((t - last) / 1000, 0.1); last = t
  pointerHand(); camHands(t)
  // the simulation runs at the installation's 60 steps a second, whatever the display
  stepAcc += dt * (reduce ? 0.6 : 1)
  let n = 0
  while (stepAcc >= 1 / 60 && n < 3) {
    step(1 / 60); stepAcc -= 1 / 60; n++
    ripAcc += 1 / 60
    if (ripAcc >= 1 / RIPPLE_HZ) { ripAcc -= 1 / RIPPLE_HZ; stepRipples() }
  }
  if (n === 3) stepAcc = 0
  render()
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
window.__pond = { S, hands, P }    // for testing
