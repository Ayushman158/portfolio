'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ThinkingOrb } from 'thinking-orbs'
import VerticalCutReveal from './vertical-cut-reveal'

const HOLD_MS = 1250   // mount → the lift begins
const EXIT_MS = 420    // the lift itself; leaving is quicker than arriving

/**
 * First-load splash.
 *
 * It carries the claim, not a loading indicator. The redesign traded the big
 * hero headline for quiet prose, so "I design products, then I ship the code"
 * no longer appears anywhere at size. A visitor who reads the first screen and
 * leaves would never meet it. Spending the first 1.25s stating it is the only
 * thing that earns a splash on a page whose job is to land in seconds.
 *
 * The overlay is server-rendered in layout.js so the page never flashes content
 * before it, and the inline script in <head> tears it out before paint when it
 * should not run at all — a repeat visit in the same session, or reduced
 * motion. This component owns the type, the timer and the exit.
 *
 * It is skippable by click, key, scroll or touch. A splash the visitor cannot
 * dismiss is a toll booth, and this page is asking for their attention, not the
 * other way round.
 */
export default function Splash() {
  const [present, setPresent] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [started, setStarted] = useState(false)
  const doneRef = useRef(false)

  const dismiss = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setLeaving(true)
    try { sessionStorage.setItem('splashSeen', '1') } catch (e) {}
    setTimeout(() => {
      setPresent(false)
      document.documentElement.removeAttribute('data-splash')
    }, EXIT_MS)
  }, [])

  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('splashSeen') === '1' } catch (e) {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doneRef.current = true
      setPresent(false)
      document.documentElement.removeAttribute('data-splash')
      return
    }

    document.documentElement.setAttribute('data-splash', 'on')
    setStarted(true)
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
      // Decorative and transient. The same claim is restated conversationally
      // in the first paragraph underneath, which is what a reader gets.
      aria-hidden="true"
    >
      <div className="splash-inner">
        {/* Subordinate mark: small enough to read as an identifier rather than
            as a loading state, which is what it is sold as upstream. */}
        <span className="splash-mark">
          <ThinkingOrb state="breathing" size={20} theme="auto" />
        </span>

        <p className="splash-claim">
          <VerticalCutReveal start={started} delay={0.06} staggerDuration={0.045}>
            I design products, then I ship the code
          </VerticalCutReveal>
        </p>
      </div>
    </div>
  )
}
