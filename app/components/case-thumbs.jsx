'use client'

import Image from 'next/image'

/**
 * Homepage card thumbnails: one picture per project that says what the work
 * is, and a second state on hover or keyboard focus (the card is a `group`).
 * The resting state is always the work itself, so a phone, which never
 * hovers, still sees it.
 */

const fade = 'transition-opacity duration-300 ease-out motion-reduce:transition-none'

/* Signal's core idea in one loop: uncertainty at a fork resolves into one stable
   platform answer, then the route carries that key forward. */
export function SignalThumb({ alt }) {
  return (
    <div role="img" aria-label={alt} className="signal-thumb relative aspect-video w-full overflow-hidden">
      <Image
        src="/signal/mockups/stair-landing.png"
        alt=""
        fill
        priority
        sizes="(min-width: 60rem) 560px, 100vw"
        className="signal-thumb__scene object-cover"
        style={{ objectPosition: '50% 46%' }}
      />
      <span aria-hidden="true" className="signal-thumb__veil absolute inset-0" />

      <div aria-hidden="true" className="signal-thumb__question absolute">
        <span>At the fork</span>
        <strong>Which way is my train?</strong>
      </div>

      <div aria-hidden="true" className="signal-thumb__answer absolute">
        <div className="signal-thumb__eyebrow"><span>Signal</span><span>One key, everywhere</span></div>
        <div className="signal-thumb__sign">
          <svg viewBox="0 0 24 24"><path d="M12 20V4M5 11l7-7 7 7" /></svg>
          <span className="signal-thumb__badge">5</span>
          <span className="signal-thumb__destinations">
            <small>Violet Line</small>
            <b>Mandi House · Lajpat Nagar</b>
          </span>
        </div>
        <div className="signal-thumb__route">
          <i className="signal-thumb__rail" />
          <i className="signal-thumb__progress" />
          <span><i />Kashmere Gate</span>
          <span><i />Mandi House</span>
          <span><i />Lajpat Nagar</span>
        </div>
      </div>
      <span className="signal-thumb__caption absolute">System design · Wayfinding</span>
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
