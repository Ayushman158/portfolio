'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Cards, Decisions, Facts, Heading, Numbers, Rule, Shots, SkipTo } from '../components/case-study'
import { Backbone, Blueprint, Chat, Funnel, Outcomes, StepChain } from './diagrams'

/*
 * Hoychoy, with the research, the service blueprint, the information
 * architecture and the Telegram backbone restored from the version before the
 * Sept 2 rewrite. That rewrite made the page match the site and cut it from
 * 554 lines to 150 — and the cut took the thinking with it. The words below are
 * Ayushman's from those versions; two claims were left behind on purpose:
 * "infinitely scalable" and an unsourced "reduced Time-To-Purchase by 4 minutes".
 */

const FACTS = [
  ['Role', 'UX lead and product owner'],
  ['Scope', 'Research, service design, interface, build'],
  ['Timeline', '6 weeks, then a 2-week pilot with the owner'],
  ['Status', 'Live at hoychoycafe.com'],
]

// The owner's own figures from the pilot, from the owner's logs and 50+ threads. The
// tildes were on the originals — those numbers were estimated, not instrumented.
const OUTCOMES = [
  ['Handling time per order', '6–8 min', '2–3 min'],
  ['Clarification messages at rush hour', '~12–15', '2–3'],
  ['Payment mismatches per week', '~8–10', '1–2'],
  ['Steps the owner relays by hand', '5', '1'],
]


// The owner's own account of where the time went: confirming in chat, telling
// the kitchen, then telling the customer back. Five steps needed them; one does.
const CHAIN = [
  {
    title: 'before', note: 'five steps wait on the owner',
    steps: [
      ['Customer sends the order in chat', 'customer'],
      ['Owner reads it and asks what’s missing', 'owner'],
      ['Owner matches the payment screenshot', 'owner'],
      ['Owner confirms the order', 'owner'],
      ['Owner tells the kitchen', 'owner'],
      ['Owner messages the customer back', 'owner'],
    ],
  },
  {
    title: 'after', note: 'one step waits on the owner',
    steps: [
      ['Customer orders on the web', 'customer'],
      ['Order lands in the dashboard', 'auto'],
      ['Telegram tells the kitchen', 'auto'],
      ['WhatsApp confirms to the customer', 'auto'],
      ['Owner glances at the dashboard', 'owner'],
    ],
  },
]

const SIGNALS = ['Bro payment sent check once', 'Address same as last time', 'Add extra gravy pls']

const BLUEPRINT = {
  before: {
    note: 'every order runs through the owner',
    stages: ['Menu discovery', 'Ordering & payment', 'Coordination'],
    backLabel: 'Backstage — owner',
    rows: {
      customer: [['Views a PDF menu'], ['Sends the order in chat, then a UPI screenshot'], ['Types the address by hand']],
      front: [['WhatsApp chat — the whole service', 3]],
      back: [['Reads, clarifies missing details, verifies payment screenshots', 2, 'pain'], ['Relays the order to the kitchen by hand', 1, 'pain']],
      support: [['PDF file'], ['UPI app, phone gallery'], ['Verbal instructions']],
    },
  },
  after: {
    note: 'the owner oversees; nothing waits on them',
    stages: ['Menu discovery', 'Checkout', 'Fulfilment'],
    backLabel: 'Backstage',
    rows: {
      customer: [['Scans the QR or opens the link, browses'], ['Adds to cart, pays by UPI'], ['Gets a WhatsApp confirmation']],
      front: [['Mobile web ordering, with an auto-formatted order summary', 2, 'win'], ['WhatsApp — confirmation only']],
      back: [['Nothing to do', 1, 'quiet'], ['Order stored in the dashboard', 1, 'win'], ['Telegram alert to the kitchen', 1, 'win']],
      support: [['Web app database'], ['PhonePe'], ['Telegram Bot API']],
    },
  },
}

const BACKBONE = [
  ['Next.js web app', 'Frontend', 'The menu, cart and checkout, on Vercel. Availability, the distance-based delivery fee and the order summary all happen here.'],
  ['Telegram bot', 'Order processing', 'On submit, the bot pushes the structured order to the kitchen staff group — persistent, readable at a glance, and there even when the owner is away from the counter.', true],
  ['WhatsApp', 'Trust', 'A one-way confirmation to the customer, where they already expected one. No longer the place the order is taken.'],
]

const SHIPPED = [
  ['Branded mobile ordering', 'A structured menu with real-time availability, reached by QR or link. No login, no download, nothing to install at the door.'],
  ['Checkout that enforces itself', 'Cart, kitchen notes, GPS capture and a UPI deep link in one scrollable form. Required fields are enforced in the UI, so an incomplete order cannot reach the owner.'],
  ['An automated relay', 'Orders land in a dashboard and fire a Telegram alert to the kitchen. The owner comes out of the relay chain entirely.'],
]

const SHOTS = [
  ['/assets/cs-menu-reopen.png', 'Real-time filtering and availability.'],
  ['/assets/cs-checkout-scroll.png', 'Structured capture ends the WhatsApp back-and-forth.'],
  ['/assets/cs-checkout-payment.png', 'Exact total pre-filled — no manual entry, no mismatch.', 'bottom'],
  ['/assets/cs-admin-panel.png', 'Open or closed, with a closing message, in one toggle.'],
  ['/assets/cs-admin-orders.png', 'Item availability and coupons — no developer needed.'],
]

const CHECKOUT = [
  ['Structured address, not a text field', 'GPS or a Google Maps link, plus kitchen notes, replace the ambiguous WhatsApp message. Every input is enforced in the UI.'],
  ['A payment that cannot mismatch', 'A PhonePe deep link with the exact order total pre-filled. No amount to type, no screenshot to verify.'],
]

const DECISIONS = [
  ['No accounts, ever', 'WhatsApp needed zero setup, so any signup gate would have killed conversion outright. Account creation adds two to three minutes of friction to a ₹200 order. Sessions carry the cart instead.'],
  ['Web, not an app store', 'Installs add review delays and maintenance. Mobile web gives the same experience with no download barrier, on every phone that walks in, and updates without a release cycle.'],
  ['WhatsApp kept as trust, not as the channel', 'Customers had built habits around a WhatsApp confirmation. Removing it entirely would have read as the order vanishing, so it stays as a one-way receipt while the ordering moves.'],
  ['Telegram for the kitchen, not WhatsApp', 'Business notifications get buried in personal chat noise, and WhatsApp offered no reliable API for this. Telegram’s bot API delivers structured, persistent, actionable alerts to the people cooking.'],
  ['One dashboard as the record', 'Without it the owner recalled orders from memory or scrolled back through chat. A central record made shift handoffs possible and gave the café a searchable order history for the first time.'],
  ['Minimal fields by default', 'People order on mobile data in a lunch break. Every field is a reason to abandon a ₹200 order, so every typing task became a tapping task wherever the data allowed.'],
]

const NEXT = [
  ['Real-time order tracking', 'A three-state tracker: received, preparing, out for delivery. It answers “where’s my order?”, the most common message after ordering.'],
  ['Estimated delivery time', 'The fee is already calculated by distance; the time is not shown. An ETA from kitchen queue depth plus distance would answer the anxiety before it becomes a message.'],
  ['Reorder and saved preferences', 'Many customers order the same thing every week. “Reorder last” with a saved address would take checkout to two taps for the café’s most valuable customers.'],
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
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Hoychoy Cafe · 2025 · Service design</p>

        <h1 style={{ color: 'var(--ink)', fontSize: '2rem', lineHeight: 1.2, fontWeight: 500, letterSpacing: '-0.02em' }}>
          A café was taking orders in WhatsApp. Ordering took 6–8 minutes.
        </h1>

        <p>
          It now takes two to three. Hoychoy is a hyperlocal café in Golaghat, Assam. I rebuilt its
          ordering as a service rather than a screen: a mobile web menu, a checkout that refuses to produce
          an incomplete order, and a Telegram relay that takes the owner out of the middle.
        </p>
      </motion.header>

      <motion.figure {...rise(0.1)} className="track-full mt-12">
        <img
          src="/shipped/hoychoy.jpg"
          alt="The Hoychoy Cafe menu, with live availability and prices"
          width={1600}
          height={900}
          className="block h-auto w-full rounded-xl"
          style={{ border: '1px solid var(--rule)' }}
        />
      </motion.figure>
      <SkipTo target="shipped">just here for the product?</SkipTo>

      <motion.div {...rise(0.12)}><Facts rows={FACTS} /></motion.div>

      <motion.p {...rise(0.14)} className="mt-6">
        I owned it end to end — problem framing, service and interface design, and the build, done
        AI-assisted. I managed the client, ran the two-week pilot with the owner, and shipped it to
        production.{' '}
        <a href="https://www.hoychoycafe.com/" target="_blank" rel="noopener noreferrer" className="prose-link">hoychoycafe.com</a>
      </motion.p>

      <Rule />

      {/* before / after first: the outcome is the strongest thing on the page */}
      <section>
        <Heading>What changed in a two-week pilot.</Heading>
        <p className="mb-8">
          The owner’s own figures, from their logs. The before column was estimated rather than
          instrumented, which is why it carries tildes — I have kept them.
        </p>
        <Outcomes items={OUTCOMES} />

        <p className="mt-12 mb-4">
          The handling time fell because the steps did. Ordering used to be a relay: confirm it in
          chat, carry it to the kitchen, then carry the answer back to the customer — and every leg of
          that waited on one person.
        </p>
        <StepChain rows={CHAIN} />
      </section>

      <Rule />

      <section>
        <Heading>Half of peak hours went on clarifying orders.</Heading>
        <p className="mb-8">
          Not taking new ones — clarifying incomplete ones. Customers browsed a PDF, typed their address
          and sent a UPI screenshot; the owner decoded, clarified, verified and relayed each order to the
          kitchen, alone, with a dozen threads open at rush hour.
        </p>
        <Numbers
          cols="grid-cols-2"
          items={[
            ['50+', 'WhatsApp threads read from real service'],
            ['50%', 'of peak time spent clarifying, not taking orders'],
          ]}
        />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:items-center">
          <div>
          <Chat messages={SIGNALS} reply="Owner: matching screenshots to addresses while six more messages arrive." />
          <p className="text-faint mt-3" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
            Quoted as sent, from the café’s own threads. No customer names, numbers or addresses are
            reproduced.
          </p>
        </div>
          <div>
            <p>
              Two failure modes dominated the threads: payments that could not be matched to an order,
              and orders lost in the scroll.
            </p>
            <p className="mt-4" style={{ color: 'var(--ink)' }}>
              The problem wasn’t WhatsApp. It was the absence of any system behind it. Fix the system,
              not the channel.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <Heading>The service, before and after.</Heading>
        <p className="mb-8">
          This wasn’t a UI problem; it was a workflow problem, so I mapped it as a service blueprint.
          Switch between the two and watch the owner’s row.
        </p>
        <Blueprint states={BLUEPRINT} />
      </section>

      <Rule />

      <section>
        <Heading>One page, one funnel.</Heading>
        <p className="mb-8">
          A flat, linear architecture built for speed: no navigation tree to learn, a straight line from
          the menu to payment to confirmation.
        </p>
        <Funnel />
      </section>

      <section className="mt-16">
        <Heading>The kitchen gets a Telegram bot, not another chat.</Heading>
        <p className="mb-8">
          WhatsApp was where orders got lost, and it lacks a reliable API for business alerts. Telegram’s bot API does — so the kitchen gets every order as a
          structured message in a staff group, and the owner stops being the relay.
        </p>
        <Backbone items={BACKBONE} />
        <p className="mt-6">
          Chaining free tiers together meant no hosting bill to pass on: the café pays{' '}
          <span style={{ color: 'var(--ink)' }}>$0 a month in server fees</span>.
        </p>
      </section>

      <Rule />

      <section id="shipped" tabIndex={-1} data-skip-target>
        <Heading>What shipped.</Heading>
        <figure className="track-wide mb-12">
          <img
            src="/assets/hoychoy-flow.webp"
            alt="The full ordering flow: menu, cart, checkout and confirmation"
            width={1200}
            height={738}
            loading="lazy"
            className="block h-auto w-full rounded-xl"
            style={{ border: '1px solid var(--rule)' }}
          />
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>
            The whole order, from menu to checkout, in one take.
          </figcaption>
        </figure>
        <Decisions items={SHIPPED} />
        <div className="mt-12">
          <Shots items={SHOTS} />
        </div>
      </section>

      <section className="mt-16">
        <Heading>The checkout, in two moves.</Heading>
        <Cards items={CHECKOUT} />
        <p className="mt-6">
          Turning a typing task into a tapping task removed the owner’s slowest verification step and
          the largest single source of wrong orders.
        </p>
      </section>

      <Rule />

      <section>
        <Heading>Six calls I would make again.</Heading>
        <Decisions items={DECISIONS} />
      </section>

      <section className="mt-16">
        <Heading>What I’d build next.</Heading>
        <p className="mb-6">
          The current system solves the core ordering problem. None of these were in scope; each would
          compound it.
        </p>
        <div className="track-wide">
          <Cards items={NEXT} cols="sm:grid-cols-3" />
        </div>
      </section>

      <section className="mt-14">
        <p>
          The café runs on it today at{' '}
          <a href="https://www.hoychoycafe.com/" target="_blank" rel="noopener noreferrer" className="prose-link">hoychoycafe.com</a>.
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/banyan" className="prose-link">Banyan Tree</Link> and{' '}
          <Link href="/signal" className="prose-link">Signal</Link>.
        </p>
      </section>
    </main>
  )
}
