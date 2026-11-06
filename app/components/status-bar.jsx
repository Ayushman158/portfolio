'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * A small instrument for the page: a ruler, a needle that follows the scroll,
 * and a readout naming the section you are in. It hangs from the top of the
 * window on wide screens and sits on the bottom edge below 1024px, because a
 * phone's nav leaves no room for it up top.
 *
 * Each long tick is a real section: an h2 marked data-route, placed where the
 * needle will be when that heading reaches the top quarter of the window. So
 * the gaps between ticks show how long each section is. Pages with fewer than
 * two sections show nothing.
 *
 * The needle is moved through a CSS variable, so scrolling never re-renders
 * this component unless the section changes.
 */
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function StatusBar() {
  const pathname = usePathname()
  const root = useRef(null)
  const [marks, setMarks] = useState([])
  const [current, setCurrent] = useState(-1)
  const [peek, setPeek] = useState(null)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    setCurrent(-1)
    setPercent(0)
    const heads = [...document.querySelectorAll('h2[data-route]')]
    if (heads.length < 2) {
      setMarks([])
      return
    }

    const names = heads.map((h) => h.dataset.route || (h.querySelector('.headline') || h).textContent.trim())
    heads.forEach((h, i) => {
      if (!h.id) h.id = slug(names[i])
      h.style.scrollMarginTop = '25vh'
    })

    let spots = []
    let frame = 0

    const read = () => {
      frame = 0
      const range = document.documentElement.scrollHeight - window.innerHeight
      const p = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0
      root.current?.style.setProperty('--p', p)
      setPercent(Math.round(p * 100))
      let at = -1
      spots.forEach((s, i) => { if (p >= s - 0.001) at = i })
      setCurrent(at)
    }

    const measure = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight
      spots = heads.map((h) => {
        const top = h.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25
        return range > 0 ? Math.min(1, Math.max(0, top / range)) : 0
      })
      setMarks(heads.map((h, i) => ({ id: h.id, name: names[i], at: spots[i] })))
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

  const shown = peek ?? current
  const label = shown < 0 ? 'start' : marks[shown].name

  return (
    <nav ref={root} className="status" aria-label="position on this page">
      <div className="status__ruler">
        {marks.map((m, i) => (
          <a
            key={m.id}
            href={`#${m.id}`}
            className="status__mark"
            style={{ left: `${m.at * 100}%` }}
            aria-label={m.name}
            aria-current={i === current ? 'location' : undefined}
            data-passed={i <= current || undefined}
            onClick={(e) => go(e, m.id)}
            onPointerEnter={() => setPeek(i)}
            onPointerLeave={() => setPeek(null)}
            onFocus={() => setPeek(i)}
            onBlur={() => setPeek(null)}
          />
        ))}
        <span aria-hidden="true" className="status__needle" />
      </div>
      <p aria-hidden="true" className="status__readout">
        <span className="status__index">{String(shown + 1).padStart(2, '0')}</span>
        <span className="status__name">{label}</span>
        <span className="tnum">{percent}%</span>
      </p>
    </nav>
  )
}
