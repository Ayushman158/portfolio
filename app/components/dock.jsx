'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle, LocalClock } from './theme'

const LINKS = [
  { href: '/', label: 'Index' },
  { href: '/experiments', label: 'Experiments' },
  { href: '/resume', label: 'Resume' },
]

/**
 * Persistent chrome: navigation, theme, local time. Fixed to the bottom so the
 * page above it stays a single uninterrupted column.
 */
export default function Dock() {
  const pathname = usePathname()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:pb-6">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-rule bg-raised/90 px-1.5 py-1 shadow-[0_10px_40px_-16px_rgba(0,0,0,0.4)] backdrop-blur-md"
      >
        {LINKS.map((l) => {
          const current = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current ? 'page' : undefined}
              className={`inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[0.9rem] transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.97] ${
                current ? 'text-ink' : 'text-faint hover:text-ink'
              }`}
            >
              {l.label}
            </Link>
          )
        })}

        <span className="mx-1 h-4 w-px bg-rule" aria-hidden="true" />
        <ThemeToggle />
        <LocalClock className="hidden pr-2 text-[0.8rem] text-faint sm:inline" />
      </nav>
    </div>
  )
}
