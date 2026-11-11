'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './pinboard.module.css'

/*
 * The Exploration page as a pinboard: every piece is a print taped to a dotted
 * board at a slight angle, labelled by hand. On a mouse or trackpad the pieces
 * can be dragged around, and "tidy up" puts them back. Videos play while they
 * are on screen; under Reduced Motion they rest on their posters.
 *
 * `kind`: 'page' opens a page of this site, 'static' a static page of this site
 * (a plain link), 'out' another site in a new tab.
 */
const PIECES = [
  { title: 'Koi Wishing Pond', note: 'installation · TouchDesigner', video: '/research/koi-loop.mp4', poster: '/research/koi-loop.jpg', href: '/koi-wishing-pond', kind: 'page', tilt: -3, lift: 0, tape: 'a' },
  { title: 'Gradient exploration', note: 'sketch · TouchDesigner', video: '/exploration/gradient.mp4', poster: '/exploration/gradient.jpg', href: 'https://www.instagram.com/p/Dd9XIzEylhx/', kind: 'out', tilt: 2.5, lift: 44, tape: 'b' },
  { title: 'ALBUM//ALIVE', note: 'experiment · WebAR', video: '/album-alive/scan.mp4', poster: '/album-alive/scan-poster.jpg', href: '/album-alive', kind: 'page', tilt: -1.5, lift: 12, tape: 'c' },
  { title: 'Gone or Still Here?', note: 'experiment · Teachable Machine', img: '/gone/home.jpg', href: '/gone-or-still-here', kind: 'page', tilt: 2, lift: -8, tape: 'b' },
  { title: 'Choose Assam', note: 'campaign · Tata Tea Premium', img: '/choose-assam/card.jpg', href: '/choose-assam', kind: 'static', tilt: -2.5, lift: 30, tape: 'a' },
  { title: 'Banyan Tree', note: 'client work · himanshugarg.in', img: '/shipped/banyan.jpg', href: '/banyan', kind: 'page', tilt: 1.5, lift: 4, tape: 'c' },
]

function Media({ piece, play }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return undefined
    const io = new IntersectionObserver(([e]) => {
      if (play && e.intersectionRatio >= 0.5) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.5 })
    io.observe(v)
    return () => { io.disconnect(); v.pause() }
  }, [play])
  if (piece.video) {
    return <video ref={ref} src={piece.video} poster={piece.poster} muted loop playsInline preload="none" aria-hidden="true" draggable={false} />
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={piece.img} alt="" loading="lazy" draggable={false} />
}

export default function Pinboard({ only }) {
  const pieces = only ? PIECES.filter((p) => only.includes(p.title)) : PIECES
  const [offsets, setOffsets] = useState({})
  const [order, setOrder] = useState(() => (only ? PIECES.filter((p) => only.includes(p.title)) : PIECES).map((p) => p.title))
  const [canDrag, setCanDrag] = useState(false)
  const [play, setPlay] = useState(false)
  const [playOverride, setPlayOverride] = useState(null)
  const playing = playOverride ?? play
  const drag = useRef(null)
  const moved = useRef(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => { setCanDrag(fine.matches); setPlay(!calm.matches) }
    set()
    fine.addEventListener('change', set)
    calm.addEventListener('change', set)
    return () => { fine.removeEventListener('change', set); calm.removeEventListener('change', set) }
  }, [])

  const onPointerDown = (title) => (e) => {
    if (!canDrag || e.pointerType !== 'mouse' || e.button !== 0) return
    const start = offsets[title] || { x: 0, y: 0 }
    drag.current = { title, sx: e.clientX - start.x, sy: e.clientY - start.y, ox: e.clientX, oy: e.clientY }
    moved.current = false
    setOrder((o) => [...o.filter((t) => t !== title), title])
    const move = (ev) => {
      const d = drag.current
      if (Math.abs(ev.clientX - d.ox) + Math.abs(ev.clientY - d.oy) > 5) moved.current = true
      if (!moved.current) return
      setOffsets((o) => ({ ...o, [d.title]: { x: ev.clientX - d.sx, y: ev.clientY - d.sy } }))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      drag.current = null
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // A drag ends on the piece; it should not also open it.
  const onClick = (e) => {
    if (moved.current) { e.preventDefault(); moved.current = false }
  }

  const untidy = Object.keys(offsets).length > 0

  return (
    <section className={styles.board} aria-label="Explorations">
      <div className={styles.top}>
        {canDrag && <p className={styles.hint}>drag things around</p>}
        <div className={styles.actions}>
          {untidy && <button type="button" className={styles.tidy} onClick={() => setOffsets({})}>tidy up</button>}
          <button type="button" className={`${styles.tidy} ${styles.playback}`} onClick={() => setPlayOverride(!playing)}>{playing ? 'Pause videos' : 'Play videos'}</button>
        </div>
      </div>
      <ul className={styles.grid}>
        {pieces.map((p) => {
          const o = offsets[p.title] || { x: 0, y: 0 }
          const inner = (
            <>
              <span className={styles.photo}><Media piece={p} play={playing} /></span>
              <span className={styles.caption}>
                <span className={styles.label}>{p.title}{p.kind === 'out' && <span aria-hidden="true"> ↗</span>}</span>
                <span className={styles.note}>{p.note}</span>
              </span>
            </>
          )
          const common = {
            className: styles.piece,
            'data-tape': p.tape,
            draggable: false,
            onPointerDown: onPointerDown(p.title),
            onClick,
          }
          return (
            <li
              key={p.title}
              className={styles.slot}
              style={{
                '--tilt': `${p.tilt}deg`,
                '--lift': `${p.lift}px`,
                '--x': `${o.x}px`,
                '--y': `${o.y}px`,
                zIndex: order.indexOf(p.title) + 1,
              }}
              data-dragging={drag.current?.title === p.title || undefined}
            >
              {p.kind === 'page' && <Link href={p.href} {...common}>{inner}</Link>}
              {p.kind === 'static' && <a href={p.href} {...common}>{inner}</a>}
              {p.kind === 'out' && <a href={p.href} target="_blank" rel="noopener noreferrer" {...common}>{inner}</a>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
