'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ theme: 'light', toggle: () => {}, themable: false })
export const useTheme = () => useContext(ThemeContext)

/**
 * Runs before first paint to stop a light flash on a dark-preferring machine.
 * Kept as a string so it can be inlined in <head> ahead of hydration.
 */
export const themeInitScript = `
(function(){try{
  var s=localStorage.getItem('theme');
  var d=s?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.dataset.theme=d;
  var seen=sessionStorage.getItem('splashSeen')==='1';
  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(seen||still)document.documentElement.dataset.splashSkip='true';
}catch(e){}})();
`

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  // Every route follows the token system. /kizuku used to be exempt because it
  // was authored as the product's green brand world on a fixed light ground;
  // it is now written in the site's tokens like everything else, so the
  // exemption went with it.
  const themable = true

  useEffect(() => {
    const stored = typeof localStorage !== 'undefined' && localStorage.getItem('theme')
    const initial = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  useEffect(() => {
    delete document.documentElement.dataset.lightOnly
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      try { localStorage.setItem('theme', next) } catch (e) {}
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggle, themable }}>{children}</ThemeContext.Provider>
  )
}

export function ThemeToggle({ className = '' }) {
  const { theme, toggle, themable } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!themable) return null

  const isDark = mounted && theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-faint hover:text-ink transition-[color,transform] duration-150 ease-out active:scale-[0.94] ${className}`}
    >
      {/* Half-filled disc: the fill tracks the active theme. */}
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path d="M8 1a7 7 0 010 14z" fill="currentColor" opacity={isDark ? 1 : 0.35} />
      </svg>
    </button>
  )
}

/**
 * Live local time. Note this is the only location signal left on the site — the
 * copy no longer states where Ayushman is or what arrangement he wants, so the
 * dock's IST readout is what tells a visitor his timezone.
 */
export function LocalClock({ className = '' }) {
  const [now, setNow] = useState(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Render nothing server-side; a clock cannot be prerendered without mismatching.
  if (!now) return <span className={className} aria-hidden="true" />

  const time = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  })

  return (
    <span className={`tnum ${className}`.trim()}>
      <span className="sr-only">Local time in India: </span>
      IST {time}
    </span>
  )
}
