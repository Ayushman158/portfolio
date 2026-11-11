'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/*
 * One scroll motion for the whole site: figures and headings rise once as
 * they arrive. Scrolling itself stays native everywhere.
 *
 * Only things below the fold when a page opens are hidden and then raised, so
 * nothing on the first screen ever waits on script, and a visitor without
 * script (or with Reduced Motion) sees every page as it is.
 */
const SELECTOR = [
  'main figure',
  'main .case-fig',
  'main h2',
  'main .sig-section > header',
].join(',')

// Never hidden: the case-study hero (the card-to-page morph lands on it) and
// the homepage cards (the morph returns to them).
const SKIP = '[data-case-hero], [data-case-card], .work-frame, footer'

export default function PageReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      })
    }, { rootMargin: '0px 0px -12% 0px' })

    // Run once the new page has rendered, and again for anything that mounts late.
    const scan = () => {
      const fold = window.innerHeight * 0.92
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.dataset.reveal || el.closest(SKIP)) return
        el.dataset.reveal = ''
        if (el.getBoundingClientRect().top < fold) return
        el.classList.add('reveal')
        io.observe(el)
      })
    }
    const timers = [setTimeout(scan, 60), setTimeout(scan, 700)]

    return () => {
      timers.forEach(clearTimeout)
      io.disconnect()
      // Anything still waiting is shown, so going back never finds it hidden.
      document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => el.classList.add('is-in'))
    }
  }, [pathname])

  return null
}
