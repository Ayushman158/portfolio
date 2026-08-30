'use client'

import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

/**
 * Marker-pen highlight that draws across the text when it scrolls into view.
 * Ported to JSX from fancycomponents.dev (danielpetho/fancy, MIT).
 *
 * Two deliberate changes from the original:
 *  - useInView is called unconditionally. The original calls it inside a ternary,
 *    which is a conditional hook call and only works because triggerType never
 *    changes at runtime.
 *  - It respects prefers-reduced-motion: the highlight still appears (it carries
 *    the emphasis) but arrives fully drawn instead of sweeping across.
 */
const SIZES = {
  ltr: { from: '0% 100%', to: '100% 100%', position: '0% 0%' },
  rtl: { from: '0% 100%', to: '100% 100%', position: '100% 0%' },
  ttb: { from: '100% 0%', to: '100% 100%', position: '0% 0%' },
  btt: { from: '100% 0%', to: '100% 100%', position: '0% 100%' },
}

const TextHighlighter = forwardRef(function TextHighlighter(
  {
    children,
    as: ElementTag = 'span',
    triggerType = 'inView',
    transition = { type: 'spring', duration: 0.6, bounce: 0 },
    inViewOptions = { once: true, amount: 0.6 },
    className = '',
    highlightColor = 'hsl(48, 96%, 76%)',
    direction = 'ltr',
    ...props
  },
  ref
) {
  const componentRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const reduceMotion = useReducedMotion()

  const inView = useInView(componentRef, inViewOptions)

  useImperativeHandle(ref, () => ({
    animate: () => setIsAnimating(true),
    reset: () => setIsAnimating(false),
  }))

  const shouldAnimate =
    triggerType === 'hover' ? isHovered
      : triggerType === 'inView' ? inView
        : triggerType === 'ref' ? isAnimating
          : triggerType === 'auto'

  const { from, to, position } = SIZES[direction] ?? SIZES.ltr

  return (
    <ElementTag
      ref={componentRef}
      onMouseEnter={() => triggerType === 'hover' && setIsHovered(true)}
      onMouseLeave={() => triggerType === 'hover' && setIsHovered(false)}
      {...props}
    >
      <motion.span
        className={`inline ${className}`.trim()}
        style={{
          backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: position,
          boxDecorationBreak: 'clone',
          WebkitBoxDecorationBreak: 'clone',
        }}
        initial={{ backgroundSize: reduceMotion ? to : from }}
        animate={{ backgroundSize: shouldAnimate ? to : from }}
        transition={reduceMotion ? { duration: 0 } : transition}
      >
        {children}
      </motion.span>
    </ElementTag>
  )
})

export default TextHighlighter
