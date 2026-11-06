'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * A scale of bare ticks on the right edge of a case study, showing where you
 * are in the page. The tick nearest your position is the accent colour and
 * longest, and the ticks around it fall away in a wave.
 *
 * Nothing animates frame by frame. Scrolling only picks the active tick; each
 * tick then eases to its new length and colour through its CSS transition,
 * and that is what makes the wave look fluid.
 *
 * Ticks at a section start rest a little longer and jump to that section.
 */
const CASE_STUDIES = ['/case-study', '/kizuku', '/signal', '/signal/v4', '/banyan', '/koi-wishing-pond']
const TICKS = 33
const PEAK = 2.6 // the active tick reaches 1 + PEAK times its resting length
const FALLOFF = 0.9
const SECTION_REST = 1.8

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const scale = Array.from({ length: TICKS }, (_, i) => i)

export default function StatusBar() {
  const pathname = usePathname()
  const root = useRef(null)
  const [marks, setMarks] = useState([]) // one per section: id, name, tick
  const [active, setActive] = useState(0)
  const [peek, setPeek] = useState(null)

  useEffect(() => {
    setActive(0)
    setMarks([])
    if (!CASE_STUDIES.includes(pathname)) return
    const heads = [...document.querySelectorAll('h2[data-route]')]
    if (heads.length < 2) return

    const names = heads.map((h) => (h.querySelector('.headline') || h).textContent.trim())
    heads.forEach((h, i) => {
      if (!h.id) h.id = slug(names[i])
      h.style.scrollMarginTop = '25vh'
    })

    let frame = 0
    const read = () => {
      frame = 0
      const range = document.documentElement.scrollHeight - window.innerHeight
      const p = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0
      setActive(Math.round(p * (TICKS - 1)))
    }
    const measure = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight
      setMarks(heads.map((h, i) => {
        const top = h.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25
        const p = range > 0 ? Math.min(1, Math.max(0, top / range)) : 0
        return { id: h.id, name: names[i], tick: Math.round(p * (TICKS - 1)) }
      }))
      read()
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }

    measure()
    const sizes = new ResizeObserver(measure)
    sizes.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      sizes.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [pathname])

  if (!marks.length) return null

  const go = (e, id) => {
    e.preventDefault()
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: still ? 'auto' : 'smooth' })
  }

  let current = -1
  marks.forEach((m, i) => { if (active >= m.tick) current = i })
  const label = peek ?? (current < 0 ? null : marks[current].name)
  const sections = new Set(marks.map((m) => m.tick))

  return (
    <nav ref={root} className="status" aria-label="position on this page">
      {scale.map((i) => {
        const wave = Math.exp(-FALLOFF * Math.abs(i - active))
        const length = Math.max(1 + PEAK * wave, sections.has(i) ? SECTION_REST : 1)
        return (
          <i
            key={i}
            className="status__tick"
            data-on={i === active || undefined}
            style={{ '--t': i / (TICKS - 1), '--s': length, '--w': wave }}
          />
        )
      })}
      {marks.map((m, i) => (
        <a
          key={m.id}
          href={`#${m.id}`}
          className="status__mark"
          style={{ '--t': m.tick / (TICKS - 1) }}
          aria-label={m.name}
          aria-current={i === current ? 'location' : undefined}
          onClick={(e) => go(e, m.id)}
          onPointerEnter={() => setPeek(m.name)}
          onPointerLeave={() => setPeek(null)}
          onFocus={() => setPeek(m.name)}
          onBlur={() => setPeek(null)}
        />
      ))}
      {label && <span key={label} aria-hidden="true" className="status__label">{label}</span>}
    </nav>
  )
}
