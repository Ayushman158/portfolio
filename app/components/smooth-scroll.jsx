'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/*
 * Inertia scrolling: the wheel and trackpad glide to a stop instead of
 * stepping, which makes long pages feel weighted and calm. Lenis eases the
 * real window scroll, so everything that listens to scroll (the reveal on
 * scroll, the light gathering into the photo window, the tick bar) keeps
 * working as before.
 *
 * Kept gentle (LERP: each frame moves 10% of the way). Touch scrolling is left
 * native, since phones already have their own momentum. Reduced Motion: off,
 * plain scrolling.
 */
const LERP = 0.1

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const lenis = new Lenis({ lerp: LERP, smoothWheel: true, syncTouch: false })
    let raf = 0
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    // Dialogs (the image viewer) scroll on their own; let the page stand still.
    document.documentElement.classList.add('lenis')
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])
  return null
}
