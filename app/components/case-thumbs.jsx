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

/* The concept render at the fork: the sign over the three ways. On hover the view moves in a little
   and Saathi, the route finder the QR boards open, rises from the bottom edge with the same trip. */
export function SignalThumb({ alt }) {
  const move = 'transition-transform duration-700 ease-out motion-reduce:transition-none'
  return (
    <div role="img" aria-label={alt} className="relative aspect-video w-full overflow-hidden">
      <Image
        src="/signal/wayfinding/render-fork.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 60rem) 560px, 100vw"
        className={`object-cover ${move} group-hover:scale-[1.03] group-focus-within:scale-[1.03]`}
        style={{ transformOrigin: '50% 22%' }}
      />
      <div
        className={`absolute bottom-0 right-[7%] w-[22%] translate-y-full overflow-hidden rounded-t-[0.9rem] ${move} group-hover:translate-y-[6%] group-focus-within:translate-y-[6%]`}
        style={{ aspectRatio: '9 / 15', boxShadow: '0 0 0 1px rgba(23,22,20,.12), 0 -12px 36px -12px rgba(0,0,0,.45)' }}
      >
        <Image src="/signal/wayfinding/saathi-route.jpg" alt="" fill sizes="160px" className="object-cover object-top" />
      </div>
      <Label>Concept render</Label>
    </div>
  )
}

/* Kizuku's loop in two screens: the worry, then the one action. On hover the action gives way to the tree it grows.
   The app is pale blue, so the ground is a warm cream: light, and far enough from blue that the screens stand off it. */
export function KizukuThumb({ alt }) {
  const A = '/kizuku/app'
  const screen = 'block h-auto w-full rounded-[0.9rem]'
  const frame = { boxShadow: '0 0 0 1px rgba(45,82,41,.12), 0 16px 36px -18px rgba(45,60,40,.45)', borderRadius: '0.9rem' }
  return (
    <div
      role="img"
      aria-label={alt}
      className="relative flex aspect-video w-full items-start justify-center gap-[4%] overflow-hidden pt-[6%]"
      style={{ background: 'linear-gradient(160deg, #fbf8f1 0%, #f3ede0 55%, #e9ead9 100%)' }}
    >
      <div className="w-[27%]" style={frame}>
        <Image src={`${A}/worry.jpg`} alt="" width={620} height={1348} sizes="160px" className={screen} />
      </div>
      <span aria-hidden="true" className="self-center text-[clamp(1rem,2.4vw,1.6rem)]" style={{ color: '#2d5229', opacity: 0.7 }}>→</span>
      <div className="relative w-[27%]" style={frame}>
        <Image src={`${A}/action.jpg`} alt="" width={620} height={1348} sizes="160px" className={screen} />
        <Image src={`${A}/growth.jpg`} alt="" width={620} height={1348} sizes="160px" className={`${screen} absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 ${fade}`} />
      </div>
    </div>
  )
}
