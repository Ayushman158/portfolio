'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/**
 * The drawn parts of the Hoychoy case study, restored from the version before
 * the Sept 2 rewrite and redrawn in the site's tokens. The content is
 * Ayushman's; only the drawing changed.
 */

const small = { fontSize: '0.8rem', lineHeight: 1.35 }
const eyebrow = { fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }

/** Real messages from the threads, as the owner saw them. */
export function Chat({ messages, reply }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl p-4 sm:p-5" style={{ background: 'var(--raised)', border: '1px solid var(--rule)' }}>
      {messages.map((m) => (
        <p
          key={m}
          className="max-w-[85%] self-start rounded-2xl rounded-tl-sm px-3.5 py-2"
          style={{ background: 'var(--ground)', color: 'var(--ink)', border: '1px solid var(--rule)', fontSize: '0.95rem' }}
        >
          {m}
        </p>
      ))}
      <p className="mt-2 max-w-[85%] self-end rounded-2xl rounded-tr-sm px-3.5 py-2 text-faint italic" style={{ border: '1px dashed var(--rule)', fontSize: '0.9rem' }}>
        {reply}
      </p>
    </div>
  )
}

/**
 * A service blueprint, before and after, on one set of lanes. Keeping the
 * lanes fixed and switching the contents is the point: the owner's row goes
 * from the two loudest cells on the board to nothing at all.
 */
const LANES = [
  ['customer', 'Customer'],
  ['front', 'Frontstage'],
  ['back', 'Backstage'],
  ['support', 'Support'],
]

function Cell({ text, span = 1, tone }) {
  const tones = {
    pain: { background: 'color-mix(in srgb, var(--warm-a) 55%, transparent)', border: '1px solid var(--warm-b)', color: 'var(--ink)' },
    win: { background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 45%, transparent)', color: 'var(--ink)' },
    quiet: { border: '1px dashed var(--rule)', color: 'var(--faint)', fontStyle: 'italic' },
  }
  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{ gridColumn: `span ${span}`, border: '1px solid var(--rule)', background: 'var(--ground)', ...small, ...(tones[tone] || {}) }}
    >
      {text}
    </div>
  )
}

export function Blueprint({ states }) {
  const [which, setWhich] = useState('before')
  const reduceMotion = useReducedMotion()
  const s = states[which]

  return (
    <figure className="track-wide">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="inline-flex rounded-full p-1" style={{ border: '1px solid var(--rule)' }} role="group" aria-label="Service blueprint">
          {Object.keys(states).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={which === k}
              onClick={() => setWhich(k)}
              className="rounded-full px-4 py-1.5 capitalize transition-colors duration-150"
              style={{ fontSize: '0.9rem', background: which === k ? 'var(--ink)' : 'transparent', color: which === k ? 'var(--ground)' : 'var(--muted)' }}
            >
              {k}
            </button>
          ))}
        </div>
        <p className="text-faint text-right" style={small}>{s.note}</p>
      </div>

      <div className="overflow-x-auto rounded-xl p-4 sm:p-5" style={{ border: '1px solid var(--rule)', background: 'var(--raised)' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={which}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="grid min-w-[40rem] gap-2"
            style={{ gridTemplateColumns: '6.5rem repeat(3, minmax(0, 1fr))' }}
          >
            <span />
            {s.stages.map((st) => (
              <span key={st} className="text-faint pb-1" style={eyebrow}>{st}</span>
            ))}

            {LANES.map(([key, name], i) => (
              <div key={key} className="contents">
                {/* The two lines a blueprint is read by: what the customer can
                    see, and what they touch. */}
                {i === 1 && <Divider label="line of interaction" />}
                {i === 2 && <Divider label="line of visibility" />}
                <span className="text-faint self-center" style={eyebrow}>{key === 'back' ? s.backLabel : name}</span>
                {s.rows[key].map(([text, span, tone], j) => (
                  <Cell key={j} text={text} span={span} tone={tone} />
                ))}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <figcaption className="text-faint mt-3 flex flex-wrap gap-x-4 gap-y-1" style={small}>
        <span className="flex items-center gap-1.5"><Swatch tone="pain" /> the owner, by hand</span>
        <span className="flex items-center gap-1.5"><Swatch tone="win" /> the system, automatically</span>
        <span className="sm:hidden">· swipe for all three stages</span>
      </figcaption>
    </figure>
  )
}

function Divider({ label }) {
  return (
    <div className="col-span-4 flex items-center gap-2 py-0.5">
      <span className="h-px flex-1" style={{ backgroundImage: 'linear-gradient(90deg, var(--faint) 50%, transparent 0)', backgroundSize: '6px 1px', opacity: 0.6 }} />
      <span className="text-faint" style={{ fontSize: '0.78rem' }}>{label}</span>
      <span className="h-px w-6" style={{ backgroundImage: 'linear-gradient(90deg, var(--faint) 50%, transparent 0)', backgroundSize: '6px 1px', opacity: 0.6 }} />
    </div>
  )
}

function Swatch({ tone }) {
  const bg = tone === 'pain'
    ? { background: 'color-mix(in srgb, var(--warm-a) 55%, transparent)', border: '1px solid var(--warm-b)' }
    : { background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 45%, transparent)' }
  return <span aria-hidden="true" className="inline-block h-3 w-4 rounded-sm" style={bg} />
}

/**
 * The ordering funnel. Flat and linear on purpose: two ways in, one page, one
 * way out. Drawn as boxes and hairlines rather than a picture of a diagram.
 */
function Node({ children, strong, sub }) {
  return (
    <div
      className="rounded-xl px-4 py-3 text-center"
      style={{
        border: `1px solid ${strong ? 'var(--ink)' : 'var(--rule)'}`,
        background: strong ? 'var(--ink)' : 'var(--ground)',
        color: strong ? 'var(--ground)' : 'var(--ink)',
        fontSize: '0.92rem',
        lineHeight: 1.3,
      }}
    >
      {children}
      {sub && <span className="mt-1 block" style={small}>{sub}</span>}
    </div>
  )
}

function Down() {
  return <span aria-hidden="true" className="mx-auto block h-6 w-px" style={{ background: 'var(--faint)', opacity: 0.5 }} />
}

export function Funnel() {
  return (
    <figure className="track-wide">
      <div className="rounded-xl px-4 py-8 sm:px-8" style={{ background: 'var(--raised)', border: '1px solid var(--rule)' }}>
        <ol className="mx-auto flex max-w-[34rem] flex-col p-0" aria-label="Ordering flow">
          <li className="grid list-none grid-cols-2 gap-3">
            <Node sub="entry">Table QR code</Node>
            <Node sub="entry">Instagram bio link</Node>
          </li>
          <li className="list-none"><Down /></li>
          <li className="list-none">
            <Node strong>Menu — one page</Node>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {['Category filters', 'Search', 'Product modal'].map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </li>
          <li className="list-none"><Down /></li>
          <li className="list-none"><Node>Slide-out cart</Node></li>
          <li className="list-none"><Down /></li>
          <li className="list-none">
            <div className="rounded-xl px-4 py-3" style={{ border: '1px solid var(--ink)', background: 'var(--ground)' }}>
              <p className="text-center" style={{ color: 'var(--ink)', fontSize: '0.92rem' }}>Checkout</p>
              <ul className="mt-2 grid gap-1 p-0 sm:grid-cols-3">
                {['Contact and address', 'Delivery or pickup', 'Kitchen notes'].map((t) => (
                  <li key={t} className="list-none text-center text-faint" style={small}>✓ {t}</li>
                ))}
              </ul>
            </div>
          </li>
          <li className="list-none"><Down /></li>
          <li className="grid list-none grid-cols-2 gap-3">
            <Node sub="customer pays the exact total">UPI deep link</Node>
            <Node sub="kitchen is told">Telegram alert</Node>
          </li>
          <li className="list-none"><Down /></li>
          <li className="list-none"><Node strong>WhatsApp confirmation</Node></li>
        </ol>
      </div>
      <figcaption className="text-faint mt-3" style={small}>
        Two ways in, one page, one way out. No accounts and no dead ends.
      </figcaption>
    </figure>
  )
}

/**
 * The backbone: three services chained on free tiers, each doing the one job
 * it is best at. The Telegram leg is the part the kitchen actually sees.
 */
export function Backbone({ items }) {
  return (
    <div className="track-wide grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
      {items.map(([name, role, body, hot], i) => (
        <div key={name} className="contents">
          {i > 0 && (
            <span aria-hidden="true" className="self-center text-center text-faint sm:px-1" style={{ fontSize: '1.1rem' }}>
              <span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span>
            </span>
          )}
          <div
            className="rounded-xl p-5"
            style={{
              border: `1px solid ${hot ? '#229ED9' : 'var(--rule)'}`,
              background: hot ? 'color-mix(in srgb, #229ED9 8%, var(--ground))' : 'var(--ground)',
            }}
          >
            <p style={{ ...eyebrow, color: hot ? 'var(--telegram-text)' : 'var(--faint)' }}>{role}</p>
            <p className="mt-2" style={{ color: 'var(--ink)', fontSize: '1.05rem', fontWeight: 500 }}>{name}</p>
            <p className="text-faint mt-2" style={{ fontSize: '0.88rem', lineHeight: 1.45 }}>{body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Before → after, as tiles. The tildes stay: those were estimates. */
export function Outcomes({ items }) {
  return (
    <div className="track-wide grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(([label, before, after]) => (
        <div key={label} className="rounded-xl p-4 sm:p-5" style={{ border: '1px solid var(--rule)' }}>
          <p className="text-faint tnum line-through" style={{ fontSize: '0.95rem', textDecorationColor: 'var(--faint)' }}>{before}</p>
          <p className="font-serif mt-1" style={{ color: 'var(--ink)', fontSize: '2.4rem', lineHeight: 1.05 }}>{after}</p>
          <p className="text-faint mt-3" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{label}</p>
        </div>
      ))}
    </div>
  )
}

/**
 * Where the minutes went. The pilot table says handling time fell and the
 * owner's manual steps went from five to one; this is that sentence drawn —
 * every step in the chain, and who had to be present for it. No per-step
 * stopwatch, because nobody held one: the claim is the chain, not the clock.
 */
export function StepChain({ rows }) {
  const tones = {
    owner: { background: 'color-mix(in srgb, var(--warm-a) 55%, transparent)', border: '1px solid var(--warm-b)' },
    auto: { background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 45%, transparent)' },
    customer: { border: '1px solid var(--rule)' },
  }
  return (
    <figure className="track-wide">
      {rows.map(({ title, note, steps }) => (
        <div key={title} className="mt-6 first:mt-0">
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <p className="text-faint" style={eyebrow}>{title}</p>
            <p className="text-faint" style={small}>{note}</p>
          </div>
          <ol className="flex flex-wrap items-stretch gap-1.5 p-0">
            {steps.map(([label, who], i) => (
              <li key={label} className="flex list-none items-center gap-1.5">
                {i > 0 && <span aria-hidden="true" className="text-faint">→</span>}
                <span className="rounded-lg px-3 py-2" style={{ ...small, color: 'var(--ink)', ...tones[who] }}>{label}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <figcaption className="text-faint mt-4 flex flex-wrap items-center gap-x-4 gap-y-1" style={small}>
        <span className="flex items-center gap-1.5"><Swatch tone="pain" /> waits on the owner</span>
        <span className="flex items-center gap-1.5"><Swatch tone="win" /> happens without anyone</span>
      </figcaption>
    </figure>
  )
}

/**
 * Where the café is. Assam's outline (GADM state boundary, simplified),
 * with Hoychoy at Sarupathar and Guwahati for scale. Straight-line distances
 * from the coordinates: Delhi 1,665 km, Guwahati 213 km.
 */
const ASSAM = { w: 800, h: 541.6, sar: [527.5, 251.3], guw: [258.2, 258.3], d: 'M791.3 5.0 L791.7 7.1 L789.6 10.4 L787.9 10.8 L788.2 12.7 L787.4 12.2 L786.5 14.5 L785.5 14.1 L785.6 15.3 L784.1 15.5 L781.7 19.1 L778.7 20.2 L775.0 23.7 L769.6 30.9 L770.5 33.2 L766.8 35.3 L768.3 36.3 L768.8 39.6 L771.6 40.8 L769.6 42.0 L769.3 43.8 L772.2 46.3 L770.2 49.3 L771.8 52.1 L775.1 52.8 L774.7 55.8 L777.1 57.9 L778.7 58.0 L779.9 59.9 L782.3 59.8 L782.0 64.5 L783.4 66.4 L782.1 67.4 L781.7 71.4 L779.8 72.0 L780.1 74.0 L778.3 77.1 L780.6 79.0 L780.3 77.3 L783.3 75.2 L783.8 80.5 L786.8 75.3 L791.0 75.0 L792.4 77.3 L793.2 76.2 L793.3 78.0 L794.5 76.4 L794.8 78.3 L796.2 78.6 L799.7 85.9 L797.0 86.5 L796.6 88.2 L793.6 90.3 L795.4 90.6 L793.4 91.0 L792.7 93.1 L785.5 96.6 L783.9 100.7 L781.2 100.1 L779.7 96.3 L773.4 98.2 L772.9 96.6 L762.1 101.4 L757.4 101.5 L751.5 104.4 L745.5 105.4 L743.5 102.4 L741.2 101.9 L738.5 99.6 L735.5 100.2 L729.0 107.7 L730.2 110.9 L728.8 118.6 L724.0 119.3 L718.6 123.4 L717.2 121.8 L715.0 123.0 L710.5 125.5 L702.3 133.5 L700.1 131.3 L697.9 133.0 L696.0 131.5 L689.8 137.8 L685.7 140.1 L684.8 142.4 L673.6 148.3 L670.0 148.2 L669.1 149.3 L665.5 145.7 L662.5 146.4 L661.8 144.5 L657.5 146.6 L648.3 158.3 L647.3 162.5 L645.2 163.3 L645.9 165.1 L642.2 166.7 L640.1 169.8 L638.7 168.5 L637.6 170.5 L631.3 175.4 L627.1 176.7 L623.2 177.3 L620.8 174.5 L619.5 176.4 L620.9 177.6 L619.8 177.5 L619.4 179.6 L618.1 179.2 L617.1 181.3 L615.6 181.4 L615.7 179.0 L613.4 178.5 L610.5 179.4 L607.4 183.7 L603.6 184.3 L602.4 186.3 L602.9 189.1 L601.9 188.6 L596.0 192.1 L596.9 196.5 L594.9 203.7 L592.3 204.7 L592.2 206.4 L588.8 207.0 L589.0 208.8 L585.4 211.1 L584.5 213.4 L581.6 210.9 L580.5 202.5 L581.1 199.2 L579.4 199.9 L568.0 213.8 L566.4 219.4 L566.6 226.3 L565.2 227.9 L565.6 228.9 L567.2 228.8 L566.6 230.2 L559.5 231.7 L560.7 233.1 L558.1 232.7 L557.4 235.2 L554.1 238.5 L553.3 242.0 L550.6 243.4 L549.0 250.1 L545.0 254.3 L545.1 258.7 L543.3 259.8 L544.2 260.2 L543.3 262.0 L544.7 263.0 L542.7 266.2 L543.3 268.5 L540.1 272.7 L538.7 277.7 L538.9 282.3 L540.5 284.2 L541.8 290.0 L533.8 294.5 L529.6 300.4 L524.5 298.1 L522.2 300.2 L521.5 303.2 L518.6 304.9 L516.6 300.4 L518.9 291.4 L517.8 285.4 L515.7 283.5 L513.1 287.7 L504.9 291.5 L507.2 300.0 L506.9 299.3 L505.3 300.2 L503.7 302.8 L499.0 304.4 L496.7 309.7 L494.9 310.1 L494.6 311.5 L492.4 311.4 L491.8 312.8 L490.5 312.4 L489.5 315.1 L487.1 316.1 L486.7 320.7 L485.1 322.0 L484.5 321.0 L481.2 327.1 L475.8 329.3 L476.4 330.4 L474.5 329.6 L472.0 330.6 L469.5 333.7 L469.4 335.6 L467.3 335.8 L466.6 338.2 L464.2 339.3 L464.0 340.6 L462.0 340.3 L459.9 342.6 L461.0 343.9 L462.5 343.9 L465.0 349.0 L466.8 350.1 L468.0 354.2 L470.7 355.8 L473.0 355.5 L476.4 358.4 L478.4 366.1 L475.1 371.1 L476.4 372.2 L475.7 373.8 L477.9 376.0 L476.1 378.1 L471.9 380.0 L471.2 382.1 L469.0 382.6 L467.1 385.0 L466.6 387.8 L462.6 394.0 L462.1 402.0 L460.4 406.1 L457.5 408.6 L456.5 412.9 L451.9 412.6 L450.6 416.6 L449.4 417.0 L449.2 419.1 L451.3 419.0 L450.3 419.3 L449.8 422.3 L451.3 424.4 L451.2 426.5 L449.5 426.0 L450.1 427.7 L448.3 428.3 L449.4 428.1 L448.7 429.3 L450.0 431.1 L448.2 431.6 L448.8 433.2 L447.1 434.4 L446.9 436.9 L444.4 439.9 L442.9 439.9 L443.5 441.6 L442.6 441.6 L443.5 442.2 L442.4 442.7 L442.2 444.6 L442.9 446.2 L440.6 448.4 L440.0 447.3 L437.3 449.3 L435.3 446.3 L433.3 446.6 L433.5 445.0 L431.9 446.5 L430.4 455.7 L431.5 456.0 L429.2 460.6 L427.6 460.5 L429.8 463.6 L429.6 465.0 L431.2 465.4 L430.1 468.6 L428.7 469.3 L429.3 472.1 L428.0 473.0 L428.9 474.4 L427.5 476.5 L431.5 478.3 L429.0 480.1 L425.7 479.6 L427.2 481.5 L426.3 483.4 L425.7 482.4 L424.6 483.8 L424.7 487.3 L423.2 488.0 L422.5 490.5 L424.1 493.6 L422.0 500.1 L422.9 502.6 L420.0 503.8 L418.8 502.5 L417.7 504.0 L415.5 502.8 L413.0 504.8 L411.8 503.5 L409.8 504.8 L406.8 502.4 L406.0 505.0 L404.2 503.9 L400.6 504.3 L398.3 507.0 L396.3 507.3 L396.6 504.1 L392.8 501.5 L388.3 487.2 L378.9 510.6 L374.7 512.2 L373.6 514.2 L370.5 513.7 L368.9 524.9 L365.9 526.1 L361.1 525.9 L358.5 535.9 L356.7 535.8 L356.4 537.7 L353.0 537.7 L352.3 540.7 L350.4 541.6 L346.7 539.1 L346.4 535.0 L344.5 533.2 L344.9 524.9 L318.4 525.4 L325.9 507.4 L323.9 499.1 L320.7 495.7 L320.6 492.9 L321.8 491.5 L320.7 489.5 L321.1 481.4 L324.3 464.6 L329.2 456.8 L327.6 455.8 L328.7 453.1 L327.8 452.1 L328.6 449.3 L327.5 448.5 L326.9 443.9 L323.7 443.0 L324.0 442.0 L322.4 440.9 L321.9 437.9 L323.2 436.6 L321.9 433.8 L323.8 431.8 L324.1 432.8 L328.0 432.9 L329.2 430.9 L331.9 434.5 L333.9 434.7 L334.9 436.9 L335.5 434.6 L336.5 436.5 L337.7 436.3 L340.1 438.4 L341.0 440.8 L341.5 440.0 L343.3 440.6 L344.2 439.0 L346.2 440.5 L346.3 439.4 L348.0 439.0 L348.3 436.9 L353.7 437.4 L354.8 436.2 L354.1 433.7 L355.3 433.1 L353.6 430.6 L353.4 426.1 L352.1 427.7 L349.2 427.2 L349.1 425.5 L351.1 425.8 L351.1 424.7 L349.8 423.0 L346.5 424.4 L345.1 420.2 L346.3 415.7 L345.4 415.1 L348.0 413.7 L350.1 414.4 L349.7 411.9 L351.5 409.7 L352.8 404.4 L360.2 405.6 L357.9 401.9 L357.9 399.9 L370.5 402.9 L375.9 394.7 L379.3 394.1 L386.0 390.4 L390.1 391.0 L393.1 389.0 L389.2 386.8 L388.2 384.5 L389.7 382.9 L388.9 381.7 L391.7 379.4 L390.7 372.8 L389.2 371.8 L387.7 372.4 L384.7 365.9 L382.3 366.8 L376.7 360.8 L375.0 361.8 L374.3 358.3 L372.7 360.5 L371.1 358.4 L371.0 359.7 L368.5 360.9 L367.2 353.2 L363.3 353.7 L364.3 350.5 L373.0 343.9 L375.0 337.2 L373.5 336.1 L371.0 339.4 L365.8 341.7 L362.5 338.7 L362.0 333.4 L355.0 331.8 L350.4 323.4 L346.2 322.2 L345.5 319.5 L347.4 318.0 L346.3 316.5 L344.2 316.8 L343.5 314.9 L340.4 314.9 L340.2 313.4 L333.7 317.4 L330.5 317.3 L325.7 319.4 L321.5 319.8 L320.5 318.7 L313.1 325.6 L311.8 324.9 L311.9 321.5 L310.4 318.9 L312.4 316.1 L310.6 309.2 L310.9 305.1 L314.4 299.6 L314.3 297.0 L320.0 291.8 L316.9 291.6 L316.4 290.2 L314.4 291.6 L312.2 291.1 L311.3 286.5 L312.7 283.2 L319.5 278.9 L329.7 267.9 L322.0 269.9 L318.3 268.7 L314.3 269.0 L314.1 267.5 L308.3 272.2 L303.3 271.9 L298.2 274.1 L290.4 272.9 L288.8 275.0 L283.2 276.6 L281.7 278.8 L281.0 275.7 L276.7 274.5 L275.1 271.3 L275.8 264.9 L268.7 262.0 L265.0 266.4 L263.5 265.8 L261.1 268.6 L257.5 270.3 L256.1 285.2 L249.7 292.0 L247.4 291.7 L242.3 287.2 L244.7 286.5 L245.7 283.6 L244.1 280.7 L245.0 275.5 L243.5 274.9 L240.6 276.3 L237.9 274.0 L234.8 282.2 L230.6 284.6 L230.8 287.0 L228.7 290.8 L232.8 288.0 L232.2 289.4 L229.4 291.4 L228.7 293.9 L226.2 294.0 L225.1 296.8 L229.3 297.4 L232.0 294.2 L231.5 296.6 L224.3 298.6 L221.3 301.1 L218.0 299.2 L207.2 301.4 L199.9 314.4 L197.3 314.2 L193.4 317.7 L189.3 316.8 L189.0 312.0 L187.8 310.2 L190.7 301.2 L189.9 298.6 L187.7 300.9 L184.4 299.8 L180.3 302.5 L175.3 302.7 L173.1 304.0 L171.4 302.8 L174.3 301.5 L175.0 299.5 L171.3 300.0 L167.7 303.7 L165.2 303.7 L166.7 298.8 L168.4 297.5 L168.7 294.5 L160.9 294.6 L160.1 288.9 L157.8 286.1 L156.5 287.2 L154.4 286.7 L154.8 290.9 L150.3 285.5 L149.0 286.7 L145.2 286.5 L144.4 287.4 L144.3 286.1 L141.0 285.4 L137.0 291.6 L134.4 291.2 L134.6 289.7 L132.2 290.6 L133.8 288.0 L132.7 288.2 L132.2 287.0 L133.1 284.7 L130.3 285.9 L129.4 285.1 L125.3 285.6 L124.0 287.6 L117.9 290.4 L117.6 292.9 L116.3 292.9 L115.3 291.1 L118.1 287.5 L112.2 284.4 L110.8 287.3 L103.4 293.3 L106.1 287.7 L106.2 284.6 L102.5 279.3 L98.9 276.5 L92.8 280.2 L88.7 276.7 L84.7 277.2 L81.5 279.1 L79.6 282.3 L67.3 285.0 L65.5 285.2 L65.0 284.1 L61.7 286.5 L60.9 284.7 L58.0 283.7 L56.3 284.6 L53.6 284.2 L51.9 286.9 L49.7 287.7 L50.2 288.7 L46.6 290.6 L43.9 294.1 L41.3 293.7 L39.2 295.8 L41.4 297.6 L39.6 300.3 L38.6 300.0 L38.8 300.9 L34.5 303.2 L31.6 303.4 L32.9 310.5 L30.2 314.7 L28.7 315.5 L25.4 314.8 L25.0 316.0 L28.6 321.8 L30.6 322.9 L31.9 326.8 L36.1 329.8 L36.5 331.3 L39.2 331.7 L40.8 334.8 L38.9 337.3 L36.0 336.4 L34.3 339.1 L24.2 341.0 L22.2 342.9 L24.1 330.9 L20.0 322.7 L20.3 320.0 L18.1 319.3 L17.3 317.5 L18.8 311.4 L17.1 305.8 L15.1 304.5 L17.2 301.6 L17.2 299.4 L18.3 299.0 L18.1 297.0 L23.6 290.1 L24.7 287.1 L19.1 287.7 L16.9 286.6 L17.5 285.5 L19.8 286.2 L18.5 283.8 L22.4 283.0 L22.8 282.1 L20.0 280.4 L18.3 277.2 L18.3 281.4 L16.2 280.8 L15.5 279.8 L16.6 277.4 L15.0 272.8 L12.2 276.2 L13.9 273.4 L10.5 273.7 L12.3 272.2 L11.8 271.0 L13.8 270.3 L13.0 266.5 L11.5 267.0 L11.9 264.2 L8.1 263.3 L9.6 260.7 L6.8 256.5 L3.5 256.9 L3.0 255.3 L5.0 254.0 L1.5 254.3 L0.0 252.0 L2.4 252.0 L2.1 250.1 L4.7 248.8 L0.3 248.1 L1.9 247.8 L4.3 245.1 L2.6 244.0 L2.6 242.5 L0.8 242.2 L1.3 240.7 L3.8 242.3 L5.4 240.5 L2.8 237.4 L2.9 235.6 L3.6 237.2 L8.1 237.9 L7.0 233.4 L8.5 234.0 L10.9 232.1 L11.0 228.9 L15.9 226.5 L14.8 228.2 L15.8 229.3 L16.5 225.2 L20.5 224.5 L19.2 221.9 L18.4 223.6 L16.7 222.8 L17.5 220.6 L19.6 220.3 L22.2 213.9 L20.0 209.9 L21.5 201.4 L21.1 197.2 L23.1 196.3 L23.1 192.3 L21.1 192.0 L20.5 190.8 L23.0 187.2 L21.9 186.1 L22.3 182.4 L20.5 179.5 L20.7 175.6 L21.2 174.8 L24.6 176.6 L28.6 176.8 L36.7 176.3 L38.9 175.2 L45.6 175.9 L54.8 173.1 L62.5 170.1 L61.9 164.6 L65.8 158.4 L69.5 157.8 L76.7 159.1 L82.3 155.2 L83.5 152.4 L90.4 151.6 L109.4 165.8 L118.3 167.1 L120.7 169.6 L124.5 168.7 L127.1 170.4 L130.0 170.5 L132.3 169.5 L164.5 167.6 L171.9 168.8 L177.3 163.1 L181.5 164.7 L198.2 165.2 L202.4 168.0 L207.6 168.8 L213.1 165.7 L215.9 161.0 L227.4 167.4 L239.8 165.3 L243.9 162.9 L251.0 165.3 L257.0 164.2 L268.4 157.0 L273.5 149.9 L278.5 149.6 L285.7 153.6 L289.7 157.7 L298.5 159.2 L302.8 157.3 L305.2 152.7 L316.2 153.1 L323.7 150.1 L326.5 151.5 L329.9 150.5 L329.8 148.4 L336.2 146.8 L342.1 148.1 L343.6 145.6 L345.4 145.7 L349.6 142.9 L365.5 143.1 L373.1 139.5 L372.3 135.1 L374.8 132.3 L381.8 134.1 L388.8 133.1 L401.8 136.7 L407.4 139.9 L407.6 142.8 L420.4 149.5 L426.7 148.4 L429.6 149.7 L431.8 148.0 L446.1 144.9 L462.0 142.9 L474.6 144.2 L477.2 146.4 L479.9 146.4 L500.8 142.5 L503.4 141.8 L508.9 135.0 L515.2 131.7 L515.7 129.0 L516.4 130.3 L517.0 128.3 L518.0 130.1 L518.8 127.8 L519.8 129.1 L520.8 127.8 L521.5 128.6 L523.6 127.2 L522.4 120.9 L518.9 118.6 L519.9 118.3 L520.2 116.4 L527.7 109.7 L531.9 103.7 L544.4 90.6 L552.1 86.5 L555.4 80.7 L564.7 72.0 L564.3 70.4 L577.2 64.1 L576.9 59.2 L573.1 56.6 L572.9 53.4 L571.1 51.7 L571.9 51.9 L574.2 48.6 L576.3 47.4 L578.2 49.3 L576.6 51.3 L579.3 54.1 L580.8 54.3 L582.1 52.6 L583.9 54.6 L590.9 56.5 L598.9 52.8 L599.6 55.4 L602.6 59.1 L605.0 56.4 L607.7 56.4 L611.0 53.8 L617.0 52.2 L619.2 50.0 L624.7 49.1 L626.4 47.3 L630.7 46.2 L631.6 43.7 L634.6 44.7 L635.6 43.3 L640.0 43.8 L645.0 39.4 L648.3 39.6 L650.6 38.6 L652.4 34.6 L654.0 34.0 L653.3 33.5 L670.6 28.3 L674.8 28.6 L677.4 26.4 L710.9 15.0 L719.5 19.1 L736.1 13.5 L737.4 11.2 L739.6 10.6 L739.7 9.0 L742.4 7.7 L743.1 4.9 L745.3 5.0 L747.6 2.8 L775.3 0.0 L794.5 1.3 L791.3 5.0Z' }

export function AssamMap() {
  const [sx, sy] = ASSAM.sar, [gx, gy] = ASSAM.guw
  return (
    <figure className="track-wide">
      <div className="relative overflow-hidden rounded-xl" style={{ border: '1px solid var(--rule)', background: 'var(--raised)' }}>
        <svg viewBox={`-20 -30 ${ASSAM.w + 40} ${ASSAM.h + 60}`} className="block h-auto w-full" role="img" aria-label="Map of Assam with Hoychoy Café marked at Sarupathar, in the east of the state, and Guwahati marked in the west">
          <path d={ASSAM.d} fill="var(--ground)" stroke="var(--ink)" strokeOpacity="0.55" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx={gx} cy={gy} r="4.5" fill="var(--ink)" />
          <circle cx={sx} cy={sy} r="16" fill="#F5C518" opacity="0.35" />
          <circle cx={sx} cy={sy} r="7" fill="#F5C518" stroke="var(--ink)" strokeWidth="1.5" />
        </svg>
        {/* Labels are HTML over the map, so they stay readable however small the map gets. */}
        {[
          [gx, gy, 'Guwahati', 'text-faint', 'translate(-50%, -150%)'],
          [sx, sy, 'Hoychoy Café, Sarupathar', 'text-ink map-label-cafe', ''],
        ].map(([x, y, label, cls, tf]) => (
          <span key={label} className={`absolute whitespace-nowrap ${cls}`} style={{ left: `${((x + 20) / (ASSAM.w + 40)) * 100}%`, top: `${((y + 30) / (ASSAM.h + 60)) * 100}%`, transform: tf || undefined, fontSize: 'clamp(0.75rem, 1.6vw, 1rem)', fontWeight: 500 }}>
            {label}
          </span>
        ))}
        <span className="text-faint absolute left-[6%] top-[7%]" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>ASSAM</span>
      </div>
      <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
        About 213 km from Guwahati and 1,665 km from Delhi, in a straight line.
      </figcaption>
    </figure>
  )
}
