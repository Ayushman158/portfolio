'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { LINES, Mark } from '../signal/marks'

const W = '/signal/wayfinding'
const VIOLET = LINES.find((l) => l.id === 'violet')
const EASE = [0.22, 1, 0.36, 1]

/**
 * The Signal card's media: the case study's collage, assembled as it comes
 * into view. The sign lands first, then the app rises beside it, then the
 * badge, then the line marks one by one.
 *
 * On hover the marks dim to the Violet Line alone, the line platform 5 is on,
 * so the sign, the app, the badge and the mark read as one route.
 * On a phone only the sign and the app fit, so the other two tiles drop out.
 */
export default function SignalCard({ alt }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, amount: 0.35 })
  const reduce = useReducedMotion()

  const tile = (delay, y = 14) => reduce
    ? {}
    : { initial: { opacity: 0, y }, animate: seen ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.6, delay, ease: EASE } }

  return (
    <div
      ref={ref}
      role="img"
      aria-label={alt}
      className="grid aspect-video w-full grid-cols-[3fr_2fr] grid-rows-2 gap-1.5 p-1.5 sm:grid-cols-[2fr_1fr_1fr]"
      style={{ background: 'var(--ground)' }}
    >
      <motion.div {...tile(0, 0)} className="relative row-span-2 overflow-hidden rounded-lg">
        <Image
          src={`${W}/render-blade.jpg`}
          alt=""
          fill
          sizes="(min-width: 60rem) 320px, 60vw"
          className={`object-cover${reduce ? '' : ' transition-transform duration-700 ease-out group-hover:scale-[1.04]'}`}
        />
      </motion.div>

      <motion.div {...tile(0.08)} className="row-span-2 flex items-center justify-center overflow-hidden rounded-lg py-[7%]" style={{ background: '#e9e4f7' }}>
        <motion.div
          {...(reduce ? {} : { initial: { y: 40 }, animate: seen ? { y: 0 } : {}, transition: { duration: 0.8, delay: 0.18, ease: EASE } })}
          className="h-full"
        >
          <div
            className={`h-full overflow-hidden rounded-[1.1rem]${reduce ? '' : ' transition-transform duration-500 ease-out group-hover:-translate-y-1.5'}`}
            style={{ aspectRatio: '780 / 1688', border: '4px solid #121212', background: '#121212' }}
          >
            <Image src={`${W}/saathi-screen-platform.jpg`} alt="" width={780} height={1688} sizes="140px" className="block h-full w-full object-cover" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div {...tile(0.16)} className="hidden place-items-center rounded-lg sm:grid" style={{ background: '#1f2a6b' }}>
        <span
          className="grid aspect-square w-[46%] place-items-center rounded-lg font-bold"
          style={{ background: VIOLET.hex, border: '3px solid #fbfbf8', color: '#fbfbf8', fontSize: 'clamp(1.4rem, 2.6vw, 2.4rem)' }}
        >
          5
        </span>
      </motion.div>

      <motion.div {...tile(0.24)} className="hidden grid-cols-3 place-items-center gap-0.5 rounded-lg p-3 sm:grid" style={{ background: '#fbfbf8' }}>
        {LINES.map((l, k) => (
          <motion.span
            key={l.id}
            {...(reduce ? {} : { initial: { opacity: 0, scale: 0.5 }, animate: seen ? { opacity: 1, scale: 1 } : {}, transition: { duration: 0.4, delay: 0.4 + k * 0.05, ease: EASE } })}
            className="block w-[72%] max-w-[30px]"
          >
            <span className={`block transition-opacity duration-300 [&>svg]:h-auto [&>svg]:w-full${l.id === VIOLET.id ? '' : ' group-hover:opacity-20'}`}>
              <Mark line={l} size={30} />
            </span>
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
