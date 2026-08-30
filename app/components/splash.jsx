'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ThinkingOrb } from 'thinking-orbs'

const HOLD_MS = 1100   // how long the orb is held before it starts leaving
const FADE_MS = 260    // leaving is quicker than arriving

/**
 * First-load splash. The overlay itself is server-rendered in layout.js so the
 * page never flashes content before it, and the inline script in <head> tears
 * it out before paint when it should not run at all — a repeat visit in the
 * same session, or prefers-reduced-motion. This component only owns the orb,
 * the timer and the exit.
 *
 * It is skippable by click, key, scroll or touch: a splash the visitor cannot
 * dismiss is a toll booth, and this page is asking them for their attention,
 * not the other way round.
 */
export default function Splash() {
  const [present, setPresent] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)

  const dismiss = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setLeaving(true)
    try { sessionStorage.setItem('splashSeen', '1') } catch (e) {}
    setTimeout(() => {
      setPresent(false)
      document.documentElement.removeAttribute('data-splash')
    }, FADE_MS)
  }, [])

  useEffect(() => {
    // Never run twice in a session, and never against reduced motion.
    let seen = false
    try { seen = sessionStorage.getItem('splashSeen') === '1' } catch (e) {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doneRef.current = true
      setPresent(false)
      document.documentElement.removeAttribute('data-splash')
      return
    }

    document.documentElement.setAttribute('data-splash', 'on')
    const timer = setTimeout(dismiss, HOLD_MS)

    const skip = () => dismiss()
    window.addEventListener('pointerdown', skip, { once: true })
    window.addEventListener('keydown', skip, { once: true })
    window.addEventListener('wheel', skip, { once: true, passive: true })
    window.addEventListener('touchstart', skip, { once: true, passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchstart', skip)
    }
  }, [dismiss])

  if (!present) return null

  return (
    <div
      id="splash"
      data-leaving={leaving ? '' : undefined}
      // Decorative and transient: it carries no information a reader needs, and
      // the real content is already in the DOM underneath it.
      aria-hidden="true"
    >
      <ThinkingOrb state="breathing" size={64} theme="auto" />
    </div>
  )
}
