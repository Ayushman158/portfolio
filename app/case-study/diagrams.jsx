'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/**
 * The drawn parts of the Hoychoy case study, restored from the version before
 * the Sept 2 rewrite and redrawn in the site's tokens. The content is
 * Ayushman's; only the drawing changed.
 */

const small = { fontSize: '0.8rem', lineHeight: 1.35 }
const eyebrow = { fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }

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
      <span className="text-faint" style={{ fontSize: '0.7rem' }}>{label}</span>
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
      {sub && <span className="mt-1 block" style={{ ...small, opacity: 0.7 }}>{sub}</span>}
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
            <p style={{ ...eyebrow, color: hot ? '#229ED9' : 'var(--faint)' }}>{role}</p>
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
          <p className="tnum mt-1" style={{ color: 'var(--ink)', fontSize: '1.9rem', fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.03em' }}>{after}</p>
          <p className="text-faint mt-3" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{label}</p>
        </div>
      ))}
    </div>
  )
}
