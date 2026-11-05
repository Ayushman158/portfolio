'use client'

import Image from 'next/image'

/**
 * Homepage card thumbnails: one picture per project that says what the work
 * is, and a second state on hover or keyboard focus (the card is a `group`).
 * The resting state is always the work itself, so a phone, which never
 * hovers, still sees it.
 */

const fade = 'transition-opacity duration-300 ease-out motion-reduce:transition-none'

function Label({ children, className = '' }) {
  return (
    <span
      className={`absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 ${fade} ${className}`}
      style={{ background: 'rgba(20,19,17,.72)', color: '#f3efe6', fontSize: '0.78rem', lineHeight: 1.3, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      {children}
    </span>
  )
}

/* The same Kashmere Gate photo: the redesigned sign at rest, today's sign on hover. */
export function SignalThumb({ alt }) {
  const W = '/signal/wayfinding'
  return (
    <div role="img" aria-label={alt} className="relative aspect-video w-full">
      <Image src={`${W}/kg-new.jpg`} alt="" fill priority sizes="(min-width: 60rem) 560px, 100vw" className="object-cover" />
      <Image src={`${W}/kg-today.jpg`} alt="" fill sizes="(min-width: 60rem) 560px, 100vw" className={`object-cover opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 ${fade}`} />
      <Label className="group-hover:opacity-0 group-focus-within:opacity-0">Redesign</Label>
      <Label className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">Today’s sign</Label>
    </div>
  )
}

/* Kizuku's loop in two screens: the worry, then the one action. On hover the action gives way to the tree it grows. */
export function KizukuThumb({ alt }) {
  const A = '/kizuku/app'
  const screen = 'block h-auto w-full rounded-[0.9rem]'
  const shadow = { boxShadow: '0 10px 30px -12px rgba(23,40,60,.45)' }
  return (
    <div
      role="img"
      aria-label={alt}
      className="relative flex aspect-video w-full items-start justify-center gap-[4%] overflow-hidden pt-[6%]"
      style={{ background: 'linear-gradient(180deg, #a6c8de 0%, #8fb4cf 100%)' }}
    >
      <div className="w-[27%]" style={shadow}>
        <Image src={`${A}/worry.jpg`} alt="" width={620} height={1348} sizes="160px" className={screen} />
      </div>
      <span aria-hidden="true" className="self-center text-[clamp(1rem,2.4vw,1.6rem)]" style={{ color: '#2d5229' }}>→</span>
      <div className="relative w-[27%]" style={shadow}>
        <Image src={`${A}/action.jpg`} alt="" width={620} height={1348} sizes="160px" className={screen} />
        <Image src={`${A}/growth.jpg`} alt="" width={620} height={1348} sizes="160px" className={`${screen} absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 ${fade}`} />
      </div>
    </div>
  )
}
