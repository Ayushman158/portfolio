'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { fieldNotes } from '../../content/field-notes'

// Column placement at 768px and up, repeating: 7, 4, 5 and 5 columns wide.
const SLOTS = ['1 / span 7', '9 / span 4', '2 / span 5', '8 / span 5']

export default function FieldNotes() {
  const list = useRef(null)

  // The mask wipe, once per image. The CSS only hides images while data-wipe
  // is set, so with no script or under Reduce Motion they simply show.
  useEffect(() => {
    if (!list.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const frames = [...list.current.querySelectorAll('.field-note__frame')]
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.dataset.wipe = 'done'
        seen.unobserve(e.target)
      })
    }, { rootMargin: '0px 0px -10% 0px' })
    frames.forEach((f) => {
      f.dataset.wipe = 'waiting'
      seen.observe(f)
    })
    return () => seen.disconnect()
  }, [])

  if (!fieldNotes.length) return null

  return (
    <section className="track-wide mt-24">
      <h2 className="section-n" style={{ marginBottom: '2rem' }}>field notes</h2>
      <div ref={list} className="field-notes">
        {fieldNotes.map((n, i) => {
          const [w, h] = n.ratio === '4:5' ? [1600, 2000] : [1600, 1067]
          return (
            <figure key={n.src} className="field-note" style={{ '--slot': SLOTS[i % SLOTS.length] }} data-low={i % 2 === 1 || undefined}>
              <p className="field-note__meta">FIG. {String(i + 1).padStart(2, '0')}</p>
              <div className="field-note__frame">
                <Image src={n.src} alt={n.alt} width={w} height={h} quality={80} sizes="(min-width: 768px) 60vw, 100vw" className="block h-auto w-full" />
              </div>
              <figcaption className="field-note__meta">{n.place} · {n.month} · {n.time}</figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}
