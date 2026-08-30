'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import Letter3DSwap from './letter-3d-swap'

/**
 * Hairline index of work: number, name, year. The one authored moment on the
 * page — hovering a row raises a preview that trails the cursor with spring
 * momentum, so the page reads spare at rest and becomes image-led on intent.
 *
 * Tying the card directly to mouse position feels mechanical, so the position
 * runs through a spring. It is decorative, which is exactly when that is right.
 */
export default function WorkIndex({ label, items }) {
  const [active, setActive] = useState(null)
  const [canHover, setCanHover] = useState(false)
  const reduceMotion = useReducedMotion()
  const listRef = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 30, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 180, damping: 30, mass: 0.5 })

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setCanHover(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const showPreview = canHover && !reduceMotion

  const onMove = (e) => {
    if (!showPreview) return
    x.set(e.clientX + 24)
    y.set(e.clientY - 90)
  }

  const found = items.find((i) => i.name === active)
  const activeItem = found && { ...found, media: Boolean(found.video || found.img) }

  return (
    <section className="mt-16" onMouseMove={onMove}>
      <h2 className="text-faint text-[0.95rem] mb-2">{label}</h2>

      <ul ref={listRef} className="border-t border-rule">
        {items.map((item, i) => {
          const Row = (
            <>
              <span className="flex items-baseline gap-3 min-w-0">
                <span className="tnum text-faint text-[0.8rem] tabular-nums shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Letter3DSwap rotateDirection="right" staggerDuration={0.03}>
                  {item.name}
                </Letter3DSwap>
              </span>
              <span className="tnum text-faint text-[0.9rem] shrink-0">{item.year}</span>
            </>
          )

          return (
            <li key={item.name}>
              {item.href && item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="index-row"
                  onMouseEnter={() => setActive(item.name)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(item.name)}
                  onBlur={() => setActive(null)}
                >
                  {Row}
                </a>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="index-row"
                  onMouseEnter={() => setActive(item.name)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(item.name)}
                  onBlur={() => setActive(null)}
                >
                  {Row}
                </Link>
              ) : (
                <div
                  className="index-row cursor-default"
                  onMouseEnter={() => setActive(item.name)}
                  onMouseLeave={() => setActive(null)}
                >
                  {Row}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {showPreview && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
          style={{ x: sx, y: sy }}
          initial={false}
          animate={{
            opacity: activeItem?.media ? 1 : 0,
            scale: activeItem?.media ? 1 : 0.97,
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeItem?.media && (
            <div className="w-[280px] aspect-[4/3] overflow-hidden rounded-lg border border-rule bg-raised shadow-[0_18px_50px_-20px_rgba(0,0,0,0.45)]">
              {activeItem.video ? (
                <video
                  key={activeItem.video}
                  src={activeItem.video}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                />
              ) : (
                <Image
                  src={activeItem.img}
                  alt=""
                  width={activeItem.w}
                  height={activeItem.h}
                  sizes="280px"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          )}
        </motion.div>
      )}
    </section>
  )
}
