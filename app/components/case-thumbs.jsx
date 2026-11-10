'use client'

import Image from 'next/image'

/**
 * Homepage card thumbnails: one picture per project that says what the work
 * is, and a second state on hover or keyboard focus (the card is a `group`).
 * The resting state is always the work itself, so a phone, which never
 * hovers, still sees it.
 */

const fade = 'transition-opacity duration-300 ease-out motion-reduce:transition-none'

/* Signal as a small Delhi paper world: the route stays fixed while one train
   carries the rider through it. */
export function SignalThumb({ alt }) {
  return (
    <div role="img" aria-label={alt} className="signal-paper-thumb relative aspect-video w-full overflow-hidden">
      <Image
        src="/signal/thumbnail/paper-city.png"
        alt=""
        fill
        priority
        sizes="(min-width: 60rem) 560px, 100vw"
        className="signal-paper-thumb__scene object-cover"
      />
      <div aria-hidden="true" className="signal-paper-thumb__title absolute">
        <span>Delhi Metro · wayfinding</span>
        <strong>Signal</strong>
        <small>One key, carried everywhere.</small>
      </div>
      <div aria-hidden="true" className="signal-paper-thumb__key absolute">
        <b>5</b>
        <span>Violet Line<br /><strong>Mandi House · Lajpat Nagar</strong></span>
      </div>
      <Image
        src="/signal/thumbnail/paper-train.png"
        alt=""
        width={2172}
        height={724}
        sizes="420px"
        className="signal-paper-thumb__train absolute h-auto"
      />
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
