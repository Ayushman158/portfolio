'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

/**
 * The machinery the looping case-study heroes share: a fixed stage scaled to
 * fit, a timed sequence driven by one stage integer, and the three phones the
 * sequence ends on. Each hero keeps its own beats and its own look; only the
 * plumbing lives here.
 */

export const WIDE = { w: 960, h: 540 }
export const TALL = { w: 400, h: 468 }

export const spring = { type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }
export const ease = [0.22, 1, 0.36, 1]

/**
 * Composed on fixed stages and scaled to fit, so the composition is identical
 * at every width and in the recording. Wide on desktop, tall on a phone.
 */
export function useFitStage(ref) {
  const [size, setSize] = useState({ scale: 1, tall: false })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      const w = el.clientWidth
      const tall = w < 560
      setSize({ scale: w / (tall ? TALL : WIDE).w, tall })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return { ...size, stage: size.tall ? TALL : WIDE }
}

/**
 * Runs `beats` (ms offsets; beat i sets stage i + 1) while the element is on
 * screen, fades out at `out`, and starts again at `restart`. Leaving the
 * viewport stops it; coming back starts from the top rather than mid-sentence.
 * Reduced motion gets `still` and no timers at all.
 */
export function useSequence(ref, { beats, out, restart, still }) {
  const reduce = useReducedMotion()
  const inView = useInView(ref, { amount: 0.4 })
  const [stage, setStage] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (reduce) { setStage(still); return }
    if (!inView) return
    setStage(0)
    setLeaving(false)
    const timers = beats.map((t, i) => setTimeout(() => setStage(i + 1), t))
    timers.push(setTimeout(() => setLeaving(true), out))
    timers.push(setTimeout(() => setRun((r) => r + 1), restart))
    return () => timers.forEach(clearTimeout)
    // beats is a module constant in every caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, run])

  return { stage, leaving, reduce, fade: (restart - out) / 1000 }
}

export const PHONE_LAYOUT = {
  wide: { heights: [380, 432, 380], gap: 32, dy: [28, 0, 28] },
  tall: { heights: [244, 282, 244], gap: 8, dy: [20, 0, 20] },
}

/**
 * The three screens the sequence hands over to. Always mounted, so the images
 * are decoded long before they are needed and nothing pops in half-loaded.
 */
export function Phones({ on, screens, stage, tall, ratio = 780 / 1688, shadow = 'rgba(0,0,0,0.35)' }) {
  const layout = PHONE_LAYOUT[tall ? 'tall' : 'wide']
  const bezel = 6
  const widths = layout.heights.map((h) => Math.round((h - bezel * 2) * ratio) + bezel * 2)
  const total = widths.reduce((a, b) => a + b, 0) + layout.gap * 2
  let x = (stage.w - total) / 2

  return screens.map((src, i) => {
    const h = layout.heights[i]
    const w = widths[i]
    const left = x
    x += w + layout.gap
    const top = (stage.h - layout.heights[1]) / 2 + layout.dy[i]
    // The phones wait for what came before to clear (0.35s), so nothing passes
    // through anything; then the middle arrives and the outer two follow, so
    // the composition opens from its centre.
    const delay = on ? 0.35 + [0.09, 0, 0.09][i] : 0
    return (
      <motion.div
        key={src}
        className="absolute overflow-hidden"
        style={{ left, top, width: w, height: h, padding: bezel, background: '#161616', borderRadius: w * 0.14, boxShadow: `0 24px 48px -18px ${shadow}` }}
        initial={false}
        animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ ...spring, delay }}
      >
        <img src={src} alt="" decoding="async" className="block h-full w-full object-cover" style={{ borderRadius: (w - bezel * 2) * 0.13 }} />
      </motion.div>
    )
  })
}
