'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Cards, Decisions, Facts, Heading, Impact, Numbers, Overview, Rule, Shots, SkipTo, Subhead, Tradeoffs } from '../components/case-study'
import { Backbone, Blueprint, Chat, Funnel, Outcomes, StepChain } from './diagrams'

/*
 * Hoychoy, with the research, the service blueprint, the information
 * architecture and the Telegram backbone restored from the version before the
 * Sept 2 rewrite. That rewrite made the page match the site and cut it from
 * 554 lines to 150 — and the cut took the thinking with it. The words below are
 * Ayushman's from those versions; two claims were left behind on purpose:
 * "infinitely scalable" and an unsourced "reduced Time-To-Purchase by 4 minutes".
 */

// The whole project in four answers, readable before anything else.
const OVERVIEW = [
  ['Context', 'Hoychoy is a small café in Golaghat, Assam. Every order came in on WhatsApp: a PDF menu, an address typed into the chat, a UPI screenshot.'],
  ['Problem', 'The owner read each order, asked for what was missing, checked the payment and passed it to the kitchen, all by hand. One order took 6–8 minutes.'],
  ['Why it matters', 'About half of the busiest hours went on sorting out incomplete orders, and 8–10 payments a week couldn’t be matched to an order.'],
  ['What I did', 'Mapped how orders actually moved, then designed and built a web menu, a checkout that won’t accept an incomplete order, UPI payment and Telegram alerts for the kitchen.'],
]

// What I was up against, what I chose, and what that gave up.
const TRADEOFFS = [
  ['People order a ₹200 meal on mobile data, and WhatsApp needed no setup', 'No accounts and no login', 'No order history or saved address yet, so regulars type it again'],
  ['App stores mean review delays and upkeep for a small café', 'A mobile website, reached by QR code or link', 'Nobody finds it in an app store; the café has to hand out the QR code and link'],
  ['Customers were used to a WhatsApp confirmation', 'Kept WhatsApp, but only as a one-way receipt', 'Two channels to run instead of one'],
  ['WhatsApp had no reliable way to send business alerts', 'A Telegram bot posts each order to the kitchen group', 'Kitchen staff need a second app'],
  ['No budget for hosting', 'Free tiers for the site, backend and alerts', '$0 a month, but the backend sleeps when idle, so the first order after a quiet spell is slower'],
  ['Nobody had measured anything before', 'The owner’s estimates from their logs as the baseline', 'The before numbers are approximate, so they keep their tildes'],
]

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
  ['A checkout that won’t take an incomplete order', 'Cart, kitchen notes, GPS capture and a UPI deep link in one scrollable form. Required fields are enforced in the UI, so an incomplete order cannot reach the owner.'],
  ['Orders go straight to the kitchen', 'Orders land in a dashboard and fire a Telegram alert to the kitchen. The owner comes out of the relay chain entirely.'],
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
  ['A payment that always matches the order', 'A PhonePe deep link with the exact order total pre-filled. No amount to type, no screenshot to verify.'],
]

const DECISIONS = [
  ['No accounts, ever', 'WhatsApp needed zero setup, so any signup gate would have killed conversion outright. Account creation adds two to three minutes of friction to a ₹200 order. Sessions carry the cart instead.'],
  ['Web, not an app store', 'Installs add review delays and maintenance. Mobile web gives the same experience with no download barrier, on every phone that walks in, and updates without a release cycle.'],
  ['WhatsApp kept for confirmations only', 'Customers had built habits around a WhatsApp confirmation. Removing it entirely would have read as the order vanishing, so it stays as a one-way receipt while the ordering moves.'],
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
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}><Back /></motion.div>

      <motion.header {...rise(0.06)} className="mt-10 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Hoychoy Cafe · 2025 · Service design and build</p>
        <h1 className="display">Hoychoy Cafe: moving a café’s orders out of WhatsApp</h1>
      </motion.header>
      <motion.div {...rise(0.08)}><Overview items={OVERVIEW} /></motion.div>
      <motion.div {...rise(0.1)}>
        <Impact
          items={OUTCOMES.map(([label, before, after]) => [after, label, before])}
          note="The owner’s figures from a two-week pilot. The before numbers were estimated from their logs, not measured."
        />
      </motion.div>

      {/* Not faded in: the card on the index grows into this image. */}
      <figure data-case-hero className="track-full mt-12 overflow-hidden rounded-xl">
        <img
          src="/shipped/hoychoy-card.jpg"
          alt="Three Hoychoy Cafe screens on yellow: the owner’s open/closed switch, the menu, and the checkout"
          width={1600}
          height={900}
          className="block h-auto w-full rounded-xl"
          style={{ border: '1px solid var(--rule)' }}
        />
      </figure>
      <SkipTo target="shipped">skip to the product</SkipTo>

      <motion.div {...rise(0.12)}><Facts rows={FACTS} /></motion.div>
      <motion.p {...rise(0.14)} className="mt-6">
        I did the research, the design and the build (AI-assisted), and ran the pilot with the owner. It
        runs the café today at{' '}
        <a href="https://www.hoychoycafe.com/" target="_blank" rel="noopener noreferrer" className="prose-link">hoychoycafe.com</a>.
      </motion.p>

      <Rule />

      <section>
        <Heading n="01">The problem</Heading>
        <p className="mb-8">
          I read more than 50 of the café’s WhatsApp threads. Most of the owner’s busy hours went on
          finishing orders, not taking new ones.
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
              Quoted as sent. No names, numbers or addresses are reproduced.
            </p>
          </div>
          <p>Two things went wrong most: payments that couldn’t be matched to an order, and orders lost in the scroll.</p>
        </div>

        <Subhead>Where the time went</Subhead>
        <p className="mb-4">Every order passed through one person. Five of the six steps waited on the owner.</p>
        <StepChain rows={CHAIN} />
      </section>

      <Rule />

      <section id="shipped" tabIndex={-1} data-skip-target>
        <Heading n="02">The solution</Heading>
        <p className="mb-8">
          The fix was in the workflow, not just the screens, so I mapped the service first. Switch
          between before and after and watch the owner’s row empty out.
        </p>
        <Blueprint states={BLUEPRINT} />

        <Subhead>What shipped</Subhead>
        <figure className="track-wide mb-10">
          <img
            src="/assets/hoychoy-flow.webp"
            alt="The full ordering flow: menu, cart, checkout and confirmation"
            width={1200}
            height={738}
            loading="lazy"
            className="block h-auto w-full rounded-xl"
            style={{ border: '1px solid var(--rule)' }}
          />
        </figure>
        <Decisions items={SHIPPED} />
        <div className="mt-12">
          <Shots items={SHOTS} />
        </div>

        <Subhead>How an order reaches the kitchen</Subhead>
        <Backbone items={BACKBONE} />
      </section>

      <Rule />

      <section>
        <Heading n="03">Constraints and tradeoffs</Heading>
        <Tradeoffs items={TRADEOFFS} />
      </section>

      <Rule />

      <section>
        <Heading n="04">What I’d build next</Heading>
        <div className="track-wide">
          <Cards items={NEXT} cols="sm:grid-cols-3" />
        </div>
      </section>

      <section className="mt-16">
        <p>
          Back to <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/banyan" className="prose-link">Banyan Tree</Link> and{' '}
          <Link href="/signal" className="prose-link">Signal</Link>.
        </p>
      </section>
    </main>
  )
}
