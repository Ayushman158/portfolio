'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// A 1200px WebP. The hover highlights in globals.css read the same file, so it
// downloads once.
const roomArtwork = '/about/listening-corner-plants.webp'

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function MusicNotes({ source }) {
  return (
    <span className={`lc__effect lc__notes lc__notes--${source}`} aria-hidden="true">
      <span>♪</span><span>♫</span><span>♪</span>
    </span>
  )
}

export default function ListeningCorner() {
  const [needleDown, setNeedleDown] = useState(false)
  const [lampOn, setLampOn] = useState(true)
  const [effects, setEffects] = useState({ plant: 0, guitar: 0, moka: 0, record: 0 })
  const [status, setStatus] = useState('')
  const [intro, setIntro] = useState(false)
  const [doors, setDoors] = useState({ left: false, right: false })
  const [sweep, setSweep] = useState(0)
  const [dust, setDust] = useState(null) // { n, x, y } in % of the scene
  const scene = useRef(null)
  const doorTimers = useRef({})

  // A door slides a little along its track, shows the dark inside, and slides shut.
  function nudgeDoor(side) {
    clearTimeout(doorTimers.current[side])
    setDoors((d) => ({ ...d, [side]: true }))
    doorTimers.current[side] = setTimeout(() => setDoors((d) => ({ ...d, [side]: false })), 1500)
  }

  // A small puff of dust rises from wherever the rug was tapped.
  function shakeRug(e) {
    const r = scene.current.getBoundingClientRect()
    const x = e.clientX ? ((e.clientX - r.left) / r.width) * 100 : 45
    const y = e.clientY ? ((e.clientY - r.top) / r.height) * 100 : 92
    setDust((d) => ({ n: (d?.n || 0) + 1, x, y }))
  }

  useEffect(() => () => Object.values(doorTimers.current).forEach(clearTimeout), [])

  // The two prints hang crooked, and straighten as the room scrolls up into
  // view: --tilt-left runs from 1 (as hung) to 0 (straight). Reduced Motion
  // leaves them as hung.
  useEffect(() => {
    const el = scene.current
    if (!el || reduced()) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.45)))
      el.style.setProperty('--tilt-left', (1 - p).toFixed(3))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // The plant's note says thank you for a moment after each watering.
  const [thanked, setThanked] = useState(false)
  const thanksTimer = useRef(null)
  useEffect(() => () => clearTimeout(thanksTimer.current), [])

  function playEffect(object) {
    setEffects((current) => ({ ...current, [object]: current[object] + 1 }))
  }

  // The first time the room scrolls into view, each object lights up once in
  // turn, so a visitor sees that they are things to press, not just a picture.
  useEffect(() => {
    const el = scene.current
    if (!el || reduced()) return
    let seen = false
    try { seen = sessionStorage.getItem('lc-intro') === '1' } catch {}
    if (seen) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      try { sessionStorage.setItem('lc-intro', '1') } catch {}
      setIntro(true)
      setTimeout(() => setIntro(false), 2000)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // While the record plays, notes keep rising from it.
  useEffect(() => {
    if (!needleDown || reduced()) return
    const id = setInterval(() => setEffects((c) => ({ ...c, record: c.record + 1 })), 1400)
    return () => clearInterval(id)
  }, [needleDown])

  return (
    <footer className="lc" id="footer">
      <div className="lc__links">
        <a className="lc__email" href="mailto:ayushman15899@gmail.com">Email me <span aria-hidden="true">↗</span></a>
        <nav className="lc__nav" aria-label="Social profiles">
          <a href="https://www.linkedin.com/in/ayushman-bharadwaj-660759289/">LinkedIn</a>
          <a href="https://x.com/AyushmanBharad">X</a>
          <a href="https://github.com/Ayushman158">GitHub</a>
        </nav>
        <nav className="lc__nav" aria-label="Footer navigation">
          <Link href="/">Index</Link>
          <Link href="/archive">Exploration</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>

      <div
        ref={scene}
        className="lc__scene"
        data-lamp-on={lampOn}
        data-needle-down={needleDown}
        data-intro={intro || undefined}
        style={{ '--room-artwork': `url(${roomArtwork})` }}
      >
        <span className="lc__glow" aria-hidden="true" />
        <Image
          className="lc__art"
          src={roomArtwork}
          alt="A walnut record console with two potted plants, a moka pot, an orange lamp and a yellow guitar on a woven rug."
          width={1200}
          height={800}
          sizes="(max-width: 760px) 92vw, 600px"
          unoptimized
        />

        {/* The console itself: two sliding doors, the records between them, and
            the rug. Placed first, so the objects on top of the console win. */}
        {['left', 'right'].map((side, k) => (
          <button
            key={side}
            className={`lc__control lc__door lc__door--${side}`}
            type="button"
            aria-label={`Slide the ${side} door`}
            data-open={doors[side] || undefined}
            style={{ '--i': k ? 7 : 5 }}
            onClick={() => nudgeDoor(side)}
          >
            <span className="lc__door-face" aria-hidden="true" />
          </button>
        ))}
        <button
          className="lc__control lc__records"
          type="button"
          aria-label="Flick through the records"
          style={{ '--i': 6 }}
          onClick={() => setSweep((n) => n + 1)}
        >
          {sweep > 0 && <span key={sweep} className="lc__sweep" aria-hidden="true" />}
        </button>
        <button
          className="lc__control lc__mat"
          type="button"
          aria-label="Shake out the rug"
          style={{ '--i': 8 }}
          onClick={shakeRug}
        />
        {dust && (
          <svg key={`dust-${dust.n}`} className="lc__effect lc__dust" viewBox="0 0 40 40" style={{ left: `${dust.x}%`, top: `${dust.y}%` }} aria-hidden="true">
            <circle cx="12" cy="30" r="1.6" /><circle cx="20" cy="33" r="1.2" /><circle cx="27" cy="29" r="1.8" />
            <circle cx="16" cy="25" r="1" /><circle cx="24" cy="24" r="1.1" />
          </svg>
        )}

        <div className="lc__prints">
          <Link className="lc__print lc__print--koi" href="/koi-wishing-pond" aria-label="Koi Wishing Pond case study">
            <Image src="/koi-wishing-pond/assets/poster.jpg" alt="" fill sizes="(max-width: 760px) 14vw, 86px" />
          </Link>
          <div className="lc__print lc__print--bauhaus" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>

        <button
          className="lc__control lc__turntable"
          type="button"
          aria-label={needleDown ? 'Lift the needle' : 'Drop the needle'}
          aria-pressed={needleDown}
          style={{ '--i': 1 }}
          onClick={() => {
            if (!needleDown) playEffect('record')
            setStatus(needleDown ? 'Record stopped' : 'Record playing')
            setNeedleDown(!needleDown)
          }}
        />
        <span className="lc__record" aria-hidden="true"><span /></span>
        {needleDown && effects.record > 0 && <MusicNotes key={`record-${effects.record}`} source="record" />}

        <button
          className="lc__control lc__lamp"
          type="button"
          aria-label="Desk lamp"
          aria-pressed={lampOn}
          style={{ '--i': 3 }}
          onClick={() => {
            setStatus(lampOn ? 'Lamp off' : 'Lamp on')
            setLampOn((value) => !value)
          }}
        />

        <button
          className="lc__control lc__plant"
          type="button"
          aria-label="Water the plants"
          style={{ '--i': 0 }}
          onClick={() => {
            playEffect('plant')
            setThanked(true)
            clearTimeout(thanksTimer.current)
            thanksTimer.current = setTimeout(() => setThanked(false), 2400)
          }}
        />
        {/* A small paper tag by the plant. */}
        <span className="lc__plant-note" data-thanked={thanked || undefined} aria-hidden="true">
          {thanked ? 'thank you!' : 'water me'}
          <svg viewBox="0 0 10 13" className="lc__plant-drop"><path d="M5 1C3.2 4 1.5 6 1.5 8.3A3.5 3.5 0 0 0 8.5 8.3C8.5 6 6.8 4 5 1Z" /></svg>
        </span>
        {effects.plant > 0 && (
          <svg key={`plant-${effects.plant}`} className="lc__effect lc__watering" viewBox="0 0 100 100" aria-hidden="true">
            <g className="lc__can">
              <path d="M20 42C1 46 3 22 20 26M22 23C19 2 48 0 48 21" fill="none" stroke="#345847" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M49 35c9 1 15-5 24-6l3 8c-10 2-17 12-25 13Z" fill="#537957" />
              <ellipse cx="76" cy="33" rx="4.5" ry="7" transform="rotate(-19 76 33)" fill="#345847" />
              <path d="M75 30h.1m2.7 2h.1m-2.1 2.4h.1m2.5 2h.1" stroke="#e9dbc0" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M18 23c11 4 24 4 36-1l-2 28c-1 9-28 11-32 2Z" fill="#719466" />
              <ellipse cx="36" cy="23" rx="18" ry="4.7" transform="rotate(-2 36 23)" fill="#345847" />
              <path d="M23 47c8 3 18 3 26-1m-24 5c6 3 16 3 23-1" fill="none" stroke="#b9c69a" strokeWidth="1.1" strokeLinecap="round" />
              <path d="M34 34c-2-5 5-6 5-1 5-2 7 4 2 5 3 4-3 7-5 3-4 4-8-1-4-4-5-2-2-6 2-3Z" fill="#e2aa62" />
              <circle cx="37" cy="37" r="1.7" fill="#f6e6c7" />
            </g>
            <g className="lc__drops" fill="currentColor">
              <path d="M71 53q-4 5-2 7c2 2 5-1 2-7Z" />
              <path d="M75 53q-3 5-1 7c2 2 5-1 1-7Z" />
              <path d="M78 53q-2 5 0 7c3 1 5-2 0-7Z" />
            </g>
          </svg>
        )}

        <button
          className="lc__control lc__guitar"
          type="button"
          aria-label="Strum the guitar"
          style={{ '--i': 4 }}
          onClick={() => playEffect('guitar')}
        />
        {effects.guitar > 0 && <MusicNotes key={`guitar-${effects.guitar}`} source="guitar" />}

        <button
          className="lc__control lc__moka"
          type="button"
          aria-label="Make coffee"
          style={{ '--i': 2 }}
          onClick={() => playEffect('moka')}
        />
        {effects.moka > 0 && (
          <svg key={`moka-${effects.moka}`} className="lc__effect lc__steam" viewBox="0 0 28 32" aria-hidden="true">
            <path d="M9 29c-9-9 9-10 0-19m10 15c-9-9 9-10 0-19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}

        <p className="sr-only" aria-live="polite">{status}</p>
      </div>
      <div className="lc__meta">
        <small>© {new Date().getFullYear()} Ayushman Bharadwaj</small>
        <span className="lc__thanks">thanks for rolling by</span>
        <a href="#">Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  )
}
