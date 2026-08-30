'use client'

import { useCallback, useMemo, useState } from 'react'
import { useAnimate, stagger, useReducedMotion } from 'motion/react'

/**
 * Letters roll up and a second copy rolls in beneath them. Ported to JSX from
 * fancycomponents.dev (danielpetho/fancy, MIT).
 *
 * Changes from upstream:
 *  - The secondary letter animated `top`, a layout property. Both copies now
 *    move on transform, so the roll is composited.
 *  - Container was `flex justify-center items-center`, which breaks inline flow
 *    when the component sits inside a sentence. It is inline-flex here.
 *  - Honours prefers-reduced-motion by rendering plain text.
 *  - user-select:none on the duplicated glyphs so copying gives one clean
 *    string rather than every letter twice.
 *  - Letters are clipped with clip-path, not overflow:hidden, and keep their
 *    natural height, so the inline baseline is the real one rather than one
 *    synthesised from the box edge. Verified level with the surrounding text.
 */
export default function LetterSwap({
  children,
  as: Tag = 'span',
  className = '',
  staggerDuration = 0.025,
  staggerFrom = 'first',
  transition = { duration: 0.32, ease: [0.23, 1, 0.32, 1] },
  reverse = false,
  ...props
}) {
  const [scope, animate] = useAnimate()
  const [busy, setBusy] = useState(false)
  const reduceMotion = useReducedMotion()

  const text = typeof children === 'string' ? children : String(children ?? '')
  const letters = useMemo(() => Array.from(text), [text])

  const onHover = useCallback(() => {
    if (busy || reduceMotion) return
    setBusy(true)

    const delay = stagger(staggerDuration, { from: staggerFrom })
    const out = reverse ? '100%' : '-100%'
    const from = reverse ? '-100%' : '100%'

    Promise.all([
      animate('.ls-primary', { transform: `translateY(${out})` }, { ...transition, delay }),
      animate('.ls-secondary', { transform: 'translateY(0%)' }, { ...transition, delay }),
    ]).then(() =>
      Promise.all([
        animate('.ls-primary', { transform: 'translateY(0%)' }, { duration: 0 }),
        animate('.ls-secondary', { transform: `translateY(${from})` }, { duration: 0 }),
      ]).then(() => setBusy(false))
    )
  }, [busy, reduceMotion, animate, transition, staggerDuration, staggerFrom, reverse])

  if (reduceMotion) {
    return <Tag className={className} {...props}>{text}</Tag>
  }

  return (
    <Tag
      ref={scope}
      onMouseEnter={onHover}
      className={`relative inline-flex align-baseline ${className}`.trim()}
      {...props}
    >
      <span className="sr-only">{text}</span>

      {letters.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="relative inline-block"
          style={{
            userSelect: 'none',
            // clip-path rather than overflow:hidden: overflow makes the browser
            // synthesise the inline baseline from the box edge, so this keeps a
            // real one. Height is left natural for the same reason.
            // translateY(100%) parks the second copy exactly one glyph-height
            // down, which the clip hides until hover.
            clipPath: 'inset(0)',
          }}
        >
          <span className="ls-primary inline-block" style={{ whiteSpace: 'pre' }}>{char}</span>
          <span
            className="ls-secondary absolute left-0 top-0 inline-block"
            style={{ transform: 'translateY(100%)', whiteSpace: 'pre' }}
          >
            {char}
          </span>
        </span>
      ))}
    </Tag>
  )
}
