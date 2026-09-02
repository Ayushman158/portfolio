'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Text that scrambles into place. Ported to JSX from fancycomponents.dev
 * (danielpetho/fancy, MIT).
 *
 * Changes from upstream:
 *  - Upstream scrambles on hover only. This also plays once on its own, which
 *    is what it is here for: the labels should arrive rather than just sit
 *    there. It fires the first time the element is scrolled into view, so a
 *    label four screens down is not spent while nobody is looking at it —
 *    above the fold that is page load, which is the same thing.
 *  - The real string is rendered for assistive tech and the scrambling glyphs
 *    are aria-hidden. Upstream animates the only copy of the text, so a screen
 *    reader landing mid-run reads whatever noise is on screen.
 *  - Whitespace is never scrambled, so word shapes hold and the line cannot
 *    reflow while it runs. With useOriginalCharsOnly the character count is
 *    constant too, which is why this is safe to put in a flex row.
 *  - Honours prefers-reduced-motion by rendering plain text and never
 *    scheduling a timer.
 */

const DEFAULT_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'

/** Which index is revealed on each tick, for the three reveal directions. */
function revealOrder(length, direction) {
  const indices = Array.from({ length }, (_, i) => i)
  if (direction === 'end') return indices.reverse()
  if (direction === 'center') {
    const out = []
    let lo = Math.floor((length - 1) / 2)
    let hi = lo + 1
    while (out.length < length) {
      if (lo >= 0) out.push(lo--)
      if (hi < length && out.length < length) out.push(hi++)
    }
    return out
  }
  return indices
}

export default function ScrambleText({
  children,
  as: Tag = 'span',
  className = '',
  scrambleSpeed = 42,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = true,
  characters = DEFAULT_POOL,
  delay = 0,
  ...props
}) {
  const text = typeof children === 'string' ? children : String(children ?? '')
  const [display, setDisplay] = useState(text)
  const reduceMotion = useReducedMotion()
  const hostRef = useRef(null)
  const timerRef = useRef(null)

  const pool = useMemo(() => {
    const source = useOriginalCharsOnly ? text.replace(/\s/g, '') : characters
    const unique = Array.from(new Set(Array.from(source)))
    return unique.length ? unique : Array.from(DEFAULT_POOL)
  }, [text, characters, useOriginalCharsOnly])

  const order = useMemo(
    () => revealOrder(text.length, revealDirection),
    [text.length, revealDirection]
  )

  const run = useCallback(() => {
    if (reduceMotion || !text) return
    clearInterval(timerRef.current)

    const chars = Array.from(text)
    const noise = () => pool[Math.floor(Math.random() * pool.length)]
    let tick = 0

    timerRef.current = setInterval(() => {
      tick += 1

      if (sequential) {
        const settled = new Set(order.slice(0, tick))
        setDisplay(chars.map((c, i) => (/\s/.test(c) || settled.has(i) ? c : noise())).join(''))
        if (tick >= chars.length) {
          clearInterval(timerRef.current)
          setDisplay(text)
        }
        return
      }

      if (tick > maxIterations) {
        clearInterval(timerRef.current)
        setDisplay(text)
        return
      }
      setDisplay(chars.map((c) => (/\s/.test(c) ? c : noise())).join(''))
    }, scrambleSpeed)
  }, [reduceMotion, text, pool, order, sequential, maxIterations, scrambleSpeed])

  // Play once, the first time it is actually on screen.
  useEffect(() => {
    if (reduceMotion) return
    const el = hostRef.current
    if (!el) return

    let started = false
    const start = () => {
      if (started) return
      started = true
      timerRef.current = setTimeout(run, delay)
    }

    if (typeof IntersectionObserver === 'undefined') {
      start()
      return () => clearTimeout(timerRef.current)
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start()
          obs.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    obs.observe(el)

    return () => {
      obs.disconnect()
      clearTimeout(timerRef.current)
      clearInterval(timerRef.current)
    }
  }, [run, delay, reduceMotion])

  useEffect(() => () => clearInterval(timerRef.current), [])

  if (reduceMotion) {
    return <Tag className={className} {...props}>{text}</Tag>
  }

  return (
    <Tag ref={hostRef} className={className} onPointerEnter={run} {...props}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </Tag>
  )
}
