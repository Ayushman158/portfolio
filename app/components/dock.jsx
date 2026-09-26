'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LocalClock } from './theme'

const LINKS = [
  { href: '/', label: 'Index' },
  { href: '/about', label: 'About' },
]

/**
 * Persistent chrome: navigation, theme, local time. It used to float at the
 * bottom of the window, where it sat on top of the project cards. It now lives
 * at the top, on the same edges as the content, and gets out of the way while
 * someone reads down the page: it slides up on a scroll down and comes back
 * on a scroll up, or at the top of the page.
 */
export default function Dock() {
  const pathname = usePathname()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      // A few pixels of slack, so a trackpad's jitter does not flicker it.
      if (Math.abs(y - last) < 6) return
      setHidden(y > last && y > 120)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keyboard users always get it back: focusing anything inside shows it.
  return (
    <header
      className="dock fixed inset-x-0 top-0 z-50"
      data-hidden={hidden || undefined}
      data-scrolled={scrolled || undefined}
      onFocusCapture={() => setHidden(false)}
    >
      <nav aria-label="Primary" className="chrome-track flex items-center py-2">
        {LINKS.map((l, i) => {
          const current = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current ? 'page' : undefined}
              className={`inline-flex min-h-[44px] items-center text-[0.9rem] transition-colors duration-150 ease-out ${
                i === 0 ? 'pr-3' : 'px-3'
              } ${current ? 'text-ink' : 'text-faint hover:text-ink'}`}
            >
              {l.label}
            </Link>
          )
        })}

        <div className="ml-auto flex items-center">
          <LocalClock className="hidden pr-3 text-[0.8rem] text-faint sm:inline" />
          {/* The lamp hangs through this slot from the top of the page (see Lamp). */}
          <span aria-hidden="true" className="-mr-3 inline-block h-11 w-11" />
        </div>
      </nav>
    </header>
  )
}
