'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, BeforeAfter, Decisions, Facts, Heading, Rule, Shots } from '../components/case-study'

const FACTS = [
  ['Role', 'UX lead and product owner'],
  ['Scope', 'Research, service design, interface, build'],
  ['Timeline', '6 weeks'],
  ['Status', 'Live at hoychoycafe.com'],
]

// The owner's own figures, from 50+ threads and his log. The tildes were on
// the originals — those numbers were estimated, not instrumented.
const RESULTS = [
  ['Handling time per order', '6–8 min', '2–3 min'],
  ['Clarification messages at rush hour', '~12–15', '2–3'],
  ['Payment mismatches per week', '~8–10', '1–2'],
  ['Steps the owner relays by hand', '5', '1'],
  ['Order visibility', 'Fragmented', 'Centralised'],
]

const SIGNALS = [
  '“Bro payment sent check once”',
  '“Address same as last time”',
  '“Add extra gravy pls”',
]

const SHIPPED = [
  ['Branded mobile ordering', 'A structured menu with real-time availability, reached by QR or link. No login, no download, nothing to install at the door.'],
  ['Checkout that enforces itself', 'Cart, kitchen notes, GPS capture and a UPI deep link in one scrollable form. Required fields are enforced in the UI, so an incomplete order cannot reach the owner.'],
  ['An automated relay', 'Orders land in a dashboard and fire a Telegram alert to the kitchen. The owner comes out of the relay chain entirely.'],
]

const DECISIONS = [
  ['No accounts, ever', 'WhatsApp needed zero setup, so any signup gate would have killed conversion outright. Account creation adds two to three minutes of friction to a ₹200 order. Sessions carry the cart instead.'],
  ['Web, not an app store', 'Installs add review delays and maintenance. Mobile web gives the same experience with no download barrier, on every phone that walks in.'],
  ['WhatsApp kept as trust, not as the channel', 'Customers had built habits around a WhatsApp confirmation. Removing it entirely would have read as the order vanishing, so it stays as a one-way receipt while the ordering moves.'],
  ['Telegram for the kitchen, not WhatsApp', 'Business notifications get buried in personal chat noise and the API is unreliable. Telegram delivers structured, persistent, actionable alerts to the people cooking.'],
  ['One dashboard as the record', 'Without it the owner recalled orders from memory or scrolled back through chat. A central record made shift handoffs possible for the first time.'],
  ['Minimal fields by default', 'Every field earns its place, because each one is a reason to abandon a ₹200 order on a phone in a queue.'],
]

const SHOTS = [
  ['/assets/cs-menu-reopen.png', 'the menu, with real-time availability'],
  ['/assets/cs-checkout-scroll.png', 'one scrollable checkout'],
  ['/assets/cs-checkout-payment.png', 'UPI deep link, no screenshot to send', 'bottom'],
  ['/assets/cs-admin-orders.png', 'orders in one place'],
  ['/assets/cs-admin-panel.png', 'the dashboard the owner actually runs'],
]

export default function Hoychoy() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-40 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}><Back /></motion.div>

      <motion.header {...rise(0.06)} className="mt-10 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Hoychoy Cafe · 2025</p>

        <h1 style={{ color: 'var(--ink)', fontSize: '2rem', lineHeight: 1.2, fontWeight: 500, letterSpacing: '-0.02em' }}>
          A café was taking orders in WhatsApp. Ordering took 6–8 minutes.
        </h1>

        <p>
          It now takes two to three. I rebuilt the ordering as a service rather than a screen: a mobile web
          menu, a checkout that refuses to produce an incomplete order, and an automated relay that takes
          the owner out of the middle.
        </p>

        <p>
          This was not a UI redesign. The interface was never the problem — the workflow was.
        </p>
      </motion.header>

      <motion.div {...rise(0.1)}><Facts rows={FACTS} /></motion.div>

      <motion.p {...rise(0.14)} className="mt-8">
        <a href="https://www.hoychoycafe.com/" target="_blank" rel="noopener noreferrer" className="prose-link">
          hoychoycafe.com
        </a>
      </motion.p>

      <Rule />

      {/* the outcome, before anything else */}
      <motion.section {...rise(0.18)}>
        <Heading>What changed.</Heading>
        <p>
          The owner's figures, from his own logs and 50+ order threads. The before column was estimated
          rather than instrumented, which is why it carries tildes — I have kept them.
        </p>
        <BeforeAfter rows={RESULTS} />
      </motion.section>

      <Rule />

      {/* the problem */}
      <motion.section {...rise(0.2)}>
        <Heading>Half of peak hours went on clarifying orders.</Heading>
        <p className="mb-4">
          Not taking new ones — clarifying incomplete ones. I read more than fifty WhatsApp threads from
          service and two failure modes dominated: payments that could not be matched to an order, and
          orders lost in the scroll.
        </p>

        <div className="my-8">
          {SIGNALS.map((s) => (
            <p key={s} className="index-row" style={{ gridTemplateColumns: '1fr', color: 'var(--ink)' }}>{s}</p>
          ))}
        </div>

        <p>
          Each of those is a message the owner has to answer while six more arrive, matching payment
          screenshots to addresses from memory, then relaying the result to the kitchen by voice.
        </p>
      </motion.section>

      <Rule />

      {/* what shipped */}
      <motion.section {...rise(0.22)}>
        <Heading>What shipped.</Heading>
        <Decisions items={SHIPPED} />

        <div className="mt-12">
          <Shots items={SHOTS} />
        </div>
      </motion.section>

      <Rule />

      {/* the arguments */}
      <motion.section {...rise(0.24)}>
        <Heading>Six decisions I would defend.</Heading>
        <Decisions items={DECISIONS} />
      </motion.section>

      <motion.section {...rise(0.26)} className="mt-14">
        <p>
          The café runs on it today at{' '}
          <a href="https://www.hoychoycafe.com/" target="_blank" rel="noopener noreferrer" className="prose-link">hoychoycafe.com</a>.
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/banyan" className="prose-link">Banyan Tree</Link> and{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link>.
        </p>
      </motion.section>
    </main>
  )
}
