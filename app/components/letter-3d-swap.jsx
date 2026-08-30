'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useAnimate, useReducedMotion } from 'motion/react'

/**
 * Hover a word and each letter flips on a 3D box to a second face showing the
 * same letter. Ported to JSX from fancycomponents.dev (danielpetho/fancy, MIT).
 *
 * Changes from upstream:
 *  - transform-3d / backface-hidden / inline-box are Tailwind v4 utilities and
 *    this project is on v3, so those are inline styles here instead. Without
 *    that swap the letters render flat and both faces show at once.
 *  - Dropped the `cn` helper; nothing else in this codebase uses it.
 *  - Honours prefers-reduced-motion by rendering plain text. The effect is
 *    decorative, so there is nothing to preserve when motion is turned down.
 *  - The visible letters are user-select:none. Each character renders twice (one
 *    face per side), so without this, copying the heading yields "KKiizzuukkuu".
 *    The sr-only copy stays selectable, so a copy gets the clean string.
 */

const splitIntoCharacters = (text) => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
    return Array.from(segmenter.segment(text), ({ segment }) => segment)
  }
  return Array.from(text)
}

const extractText = (children) => {
  if (children == null) return ''
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(extractText).join('')
  if (React.isValidElement(children)) return extractText(children.props?.children)
  return ''
}

const ROTATION = { top: 'rotateX(90deg)', right: 'rotateY(90deg)', bottom: 'rotateX(-90deg)', left: 'rotateY(90deg)' }

function CharBox({ char, rotateDirection, frontClassName = '', secondClassName = '' }) {
  const vertical = rotateDirection === 'top' || rotateDirection === 'bottom'

  const secondFaceTransform = vertical
    ? `rotateX(${rotateDirection === 'top' ? '-90deg' : '90deg'}) translateZ(0.5lh)`
    : rotateDirection === 'left'
      ? 'rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(50%) rotateY(-90deg) translateX(50%)'
      : 'rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)'

  const frontFaceTransform = vertical
    ? 'translateZ(0.5lh)'
    : rotateDirection === 'left'
      ? 'rotateY(90deg) translateX(50%) rotateY(-90deg)'
      : 'rotateY(-90deg) translateX(50%) rotateY(90deg)'

  return (
    <span
      className="letter-3d-swap-char-box-item"
      style={{
        display: 'inline-block',
        transformStyle: 'preserve-3d',
        transform: vertical
          ? 'translateZ(-0.5lh)'
          : 'rotateY(90deg) translateX(50%) rotateY(-90deg)',
      }}
    >
      <span
        className={frontClassName}
        style={{ position: 'relative', backfaceVisibility: 'hidden', height: '1lh', transform: frontFaceTransform }}
      >
        {char}
      </span>
      <span
        className={secondClassName}
        style={{ position: 'absolute', top: 0, left: 0, backfaceVisibility: 'hidden', height: '1lh', transform: secondFaceTransform }}
      >
        {char}
      </span>
    </span>
  )
}

export default function Letter3DSwap({
  children,
  as: ElementTag = 'span',
  mainClassName = '',
  frontFaceClassName = '',
  secondFaceClassName = '',
  staggerDuration = 0.04,
  staggerFrom = 'first',
  transition = { type: 'spring', damping: 30, stiffness: 300 },
  rotateDirection = 'right',
  ...props
}) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [scope, animate] = useAnimate()
  const reduceMotion = useReducedMotion()

  const text = useMemo(() => extractText(children), [children])

  const words = useMemo(() => {
    const parts = text.split(' ')
    return parts.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== parts.length - 1,
    }))
  }, [text])

  const staggerDelay = useCallback(
    (index, total) => {
      if (staggerFrom === 'first') return index * staggerDuration
      if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration
      if (staggerFrom === 'center') return Math.abs(Math.floor(total / 2) - index) * staggerDuration
      if (staggerFrom === 'random') return Math.abs(Math.floor(Math.random() * total) - index) * staggerDuration
      return Math.abs(staggerFrom - index) * staggerDuration
    },
    [staggerFrom, staggerDuration]
  )

  const handleHoverStart = useCallback(async () => {
    if (isAnimating || reduceMotion) return
    setIsAnimating(true)

    const total = words.reduce((sum, w) => sum + w.characters.length, 0)
    const delays = Array.from({ length: total }, (_, i) => staggerDelay(i, total))

    await animate('.letter-3d-swap-char-box-item', { transform: ROTATION[rotateDirection] ?? ROTATION.right }, { ...transition, delay: (i) => delays[i] })
    await animate('.letter-3d-swap-char-box-item', { transform: 'rotateX(0deg) rotateY(0deg)' }, { duration: 0 })

    setIsAnimating(false)
  }, [isAnimating, reduceMotion, words, transition, staggerDelay, rotateDirection, animate])

  // Decorative only: with reduced motion there is nothing worth preserving.
  if (reduceMotion) {
    return <ElementTag className={mainClassName} {...props}>{text}</ElementTag>
  }

  return (
    <ElementTag
      className={`relative ${mainClassName}`.trim()}
      style={{ display: 'inline-flex', flexWrap: 'wrap' }}
      onMouseEnter={handleHoverStart}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex" aria-hidden="true" style={{ userSelect: 'none' }}>
          {word.characters.map((char, charIndex) => (
            <CharBox
              key={charIndex}
              char={char}
              rotateDirection={rotateDirection}
              frontClassName={frontFaceClassName}
              secondClassName={secondFaceClassName}
            />
          ))}
          {word.needsSpace && <span className="whitespace-pre"> </span>}
        </span>
      ))}
    </ElementTag>
  )
}
