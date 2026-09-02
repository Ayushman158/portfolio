'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * Words rise into view from behind a cut. Ported to JSX from
 * fancycomponents.dev (danielpetho/fancy, MIT).
 *
 * Splits by word only, deliberately. The upstream component can split by
 * character, which breaks Assamese and Devanagari: those scripts carry
 * combining marks and conjuncts, and putting each code point in its own
 * inline-block stops the shaper joining them. Word units keep every run whole.
 *
 * Accepts `segments` — [{ text, lang }] — so a multilingual line keeps a lang
 * attribute per script while still sharing one continuous stagger. Screen
 * readers need those to pronounce each run correctly.
 *
 * Other changes from upstream: staggerDuration defaults to 60ms rather than
 * 200ms, which at four words was 600ms of stagger alone; motion runs on a
 * transform string rather than the `y` shorthand; reduced motion renders plain
 * text; and `start` lets the caller hold the reveal until its cue arrives.
 */
export default function VerticalCutReveal({
  children,
  segments,
  className = '',
  staggerDuration = 0.06,
  delay = 0,
  start = true,
  transition = { type: 'spring', stiffness: 190, damping: 24 },
}) {
  const reduceMotion = useReducedMotion()

  const source = useMemo(
    () => segments ?? [{ text: typeof children === 'string' ? children : String(children ?? '') }],
    [segments, children]
  )

  // Flatten to words, carrying each word's language with it.
  const words = useMemo(
    () =>
      source.flatMap((seg) =>
        seg.text.split(' ').filter(Boolean).map((word) => ({ word, lang: seg.lang }))
      ),
    [source]
  )

  const Readable = (
    <>
      {source.map((seg, i) => (
        <span key={i} lang={seg.lang}>
          {seg.text}
          {i !== source.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )

  if (reduceMotion) return <span className={className}>{Readable}</span>

  return (
    <span className={`inline-flex flex-wrap whitespace-pre-wrap ${className}`.trim()}>
      <span className="sr-only">{Readable}</span>
      {words.map(({ word, lang }, i) => (
        <span key={i} aria-hidden="true" className="inline-flex overflow-hidden">
          <motion.span
            lang={lang}
            className="inline-block"
            initial={{ transform: 'translateY(100%)' }}
            animate={start ? { transform: 'translateY(0%)' } : { transform: 'translateY(100%)' }}
            transition={{ ...transition, delay: delay + i * staggerDuration }}
          >
            {word}
            {i !== words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

