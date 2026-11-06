'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * A map of the page down its left edge, at 1024px and up (the CSS hides it
 * below that). One tick per h2 marked data-route, placed at the point where
 * that section sits in the document. The current section's tick is filled and
 * longer, sections already passed stay ink.
 *
 * Nothing listens to scroll. An IntersectionObserver reports each heading
 * crossing the top quarter of the window, and a ResizeObserver re-measures
 * when lazy images change the page's height.
 */
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function RouteLine() {
  const pathname = usePathname()
  const [ticks, setTicks] = useState([])
  const [current, setCurrent] = useState(-1)

  useEffect(() => {
    const heads = [...document.querySelectorAll('h2[data-route]')]
    setCurrent(-1)
    if (heads.length < 2) {
      setTicks([])
      return
    }

    const names = heads.map((h) => (h.querySelector('.headline') || h).textContent.trim())
    heads.forEach((h, i) => {
      if (!h.id) h.id = slug(names[i])
      h.style.scrollMarginTop = '6rem'
    })

    const measure = () => {
      const page = document.documentElement.scrollHeight
      setTicks(heads.map((h, i) => ({
        id: h.id,
        name: names[i],
        top: ((h.getBoundingClientRect().top + window.scrollY) / page) * 100,
      })))
    }
    measure()
    const sizes = new ResizeObserver(measure)
    sizes.observe(document.body)

    const passed = new Set()
    const crossing = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const i = heads.indexOf(e.target)
        if (e.isIntersecting || e.boundingClientRect.top < 0) passed.add(i)
        else passed.delete(i)
      })
      setCurrent(passed.size ? Math.max(...passed) : -1)
    }, { rootMargin: '0px 0px -75% 0px' })
    heads.forEach((h) => crossing.observe(h))

    return () => {
      sizes.disconnect()
      crossing.disconnect()
    }
  }, [pathname])

  if (!ticks.length) return null

  const go = (e, id) => {
    e.preventDefault()
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: still ? 'auto' : 'smooth' })
  }

  return (
    <nav className="route" aria-label="sections">
      {ticks.map((t, i) => (
        <a
          key={t.id}
          href={`#${t.id}`}
          onClick={(e) => go(e, t.id)}
          className="route__tick"
          style={{ top: `${t.top}%` }}
          aria-current={i === current ? 'location' : undefined}
          data-state={i === current ? 'current' : i < current ? 'passed' : undefined}
        >
          <span className="route__label">{t.name}</span>
        </a>
      ))}
    </nav>
  )
}
