'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import GradientText from './components/gradient-text'
import LetterSwap from './components/letter-swap'
import Shipped from './components/shipped'
import ListeningCorner from './components/listening-corner'
import CraftBand from './components/exploration-band'
import CheckerStrip from './components/checker-strip'
import PhotoSlot from './components/photo-slot'
import EditedIntro from './components/edited-intro'
import PixelGlow from './components/pixel-glow'

// Live, client-run, and reachable by anyone — so these are shown, not listed.
const SHIPPED = [
  {
    name: 'Banyan Tree',
    kind: 'Website · Live',
    href: '/banyan',
    site: 'himanshugarg.in',
    url: 'https://www.himanshugarg.in/',
    shot: '/shipped/banyan.jpg',
    alt: 'The Banyan Tree homepage: twelve categories of symptom over a banyan canopy',
    what: 'A website for a functional-medicine practice. You move from a symptom down to its causes.',
    tags: ['Concept', 'Interface', 'Front end', 'Handover'],
  },
  {
    name: 'Hoychoy Cafe',
    kind: 'Service design · Live',
    href: '/case-study',
    live: true,
    site: 'hoychoycafe.com',
    url: 'https://www.hoychoycafe.com/',
    shot: '/shipped/hoychoy-card.jpg',
    alt: 'Three Hoychoy Cafe screens on yellow: the owner’s open/closed switch, the menu, and the checkout',
    what: (
      <>
        A café’s WhatsApp orders moved to a web ordering system. Handling time per order went from{' '}
        <GradientText>6–8 minutes to 2–3</GradientText>.
      </>
    ),
    facts: [
      ['Problem', 'Every WhatsApp order went through the owner. Half of the busy hours went on clarifying orders and matching payments.'],
      ['Role', 'Research, design, build (AI-assisted) and pilot'],
      ['Outcome', 'Payment mismatches went from about 8–10 a week to 1–2, by the owner’s figures from a two-week pilot'],
    ],
    tags: ['Research', 'Service design', 'Interface', 'Build'],
  },
]

// A campaign and maker platform: a static page of its own, so it opens as a
// plain link rather than through the case-study card transition.
const CAMPAIGN = [
  {
    name: 'Choose Assam',
    kind: 'Campaign and maker platform · Tata Tea Premium',
    href: '/choose-assam',
    static: true,
    site: 'M.Des project · Speculative',
    shot: '/choose-assam/card.jpg',
    alt: 'A gift box of six Tata Tea Premium packs, each with a pattern from one Assam craft community, and their story cards',
    what: 'After a flood, Tata Tea uses its packs and ads to send people to Assam’s makers, so they can buy from them instead of donating. Six community pack editions and a maker platform.',
    tags: ['Strategy', 'Packaging', 'Campaign', 'Platform'],
  },
]

// Case studies of work that is not live, so the right-hand slot names the
// evidence rather than a domain — but shown, not listed: the screens are the
// argument, and a hover-only preview hid them from every phone.
const RESEARCH = [
  {
    name: 'Koi Wishing Pond',
    kind: 'Interactive installation · Exhibited at UPES',
    href: '/koi-wishing-pond',
    play: '/koi-wishing-pond/pond',
    site: 'Exhibited at UPES',
    shot: '/research/koi-loop.jpg',
    video: '/research/koi-loop.mp4',
    alt: 'The koi pond from above: six koi, lily pads and coins on the water, with ripple rings',
    what: 'A koi pond projected on the floor that answers your hand. You can play it in your browser.',
    tags: ['Interaction', 'TouchDesigner', 'Hand tracking', 'Installation'],
  },
  {
    name: 'Kizuku',
    kind: 'iOS app · In development',
    href: '/kizuku',
    site: 'In development',
    shot: '/research/kizuku-loop.jpg',
    video: '/research/kizuku-loop.mp4',
    alt: 'A worry becomes one small action, the seed grows when it is done, then three Kizuku screens',
    // Selected work shows the worry and the action side by side; the archive keeps the loop.
    visual: 'kizuku',
    cardAlt: 'Two Kizuku screens: the app asks what future worry is on your mind, then gives one action for today',
    what: 'An iOS app for people who overthink the future. You give it one worry and get one small thing to do today.',
    facts: [
      ['Problem', 'The wellness apps I reviewed dealt with general stress or self-care. I focused on what to do when you’re stuck on a specific worry about the future.'],
      ['Role', 'Sole designer and developer'],
      ['Outcome', 'The loop runs end to end on a real iPhone. Not yet tested with users.'],
    ],
    tags: ['Brand', 'Design system', 'Interaction', 'iOS build'],
  },
  {
    name: 'Finding the right platform on the Delhi Metro',
    kind: 'System design · Wayfinding',
    href: '/signal',
    site: 'First sign, phone test: 45% → 80%',
    shot: '/signal/night/hero.jpg',
    // A still sign in a moving crowd; the view moves in toward the sign on hover.
    visual: 'signal',
    alt: 'Concept image: the redesigned black sign hanging still above a blurred crowd, platform 3 Tis Hazari · Inderlok to the left, platform 5 Mandi House · Lajpat Nagar straight ahead, platform 4 Shastri Park · Welcome to the right',
    what: 'For first-time and occasional riders. I redesigned the signs around the stations riders travel to, and tested the first version with 84 riders. Then I drew one system of signs, screens and tickets from the street to the exit.',
    facts: [
      ['Problem', 'Delhi Metro signs name a train by the last station on its line, which doesn’t help a rider who only knows where they’re going.'],
      ['Role', 'Solo: research, design, prototype'],
      ['Outcome', 'On the first sign, riders who picked the right platform first try: 45% → 80%, in a photo test'],
    ],
    tags: ['System design', 'Wayfinding', 'Research', 'Prototype'],
  },
]

// Ordered for a recruiter: live work with measured results, then tested research, then
// the product being built, then the speculative campaign, then the installation.
const byName = Object.fromEntries([...CAMPAIGN, ...SHIPPED, ...RESEARCH].map((p) => [p.name, p]))
const SELECTED = ['Finding the right platform on the Delhi Metro', 'Kizuku', 'Hoychoy Cafe'].map((n) => byName[n])


// Brand and communication work: a different discipline from the product case
// studies, so it gets its own short index rather than a card among them.
// The case study is a standalone static page, opened in a new tab.

// Madi Things and KL Hi-Tech are not live yet, so they are held back
// rather than listed as work a visitor cannot reach.
export default function Home() {
  const reduceMotion = useReducedMotion()
  // Coming back from a case study, the page is already here: a card is about
  // to shrink into place, and a page fading in underneath would swallow it.
  const [returning] = useState(() => typeof window !== 'undefined' && window.__caseReturn === true)
  useEffect(() => { window.__caseReturn = false }, [])

  const rise = (delay) => returning ? { initial: false } : ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <>
    {/* The lamp's light in pixels, gathering into the photo window on scroll. */}
    <PixelGlow target=".photo-slot--hero" clear="#hero-copy" clearText="#hero-copy .hero-title, #hero-copy .hero__intro" />
    {/* data-wall: the home page is a cream wall the work hangs on (globals.css). */}
    <main data-wall className="measure min-h-screen pb-8 pt-20 sm:pb-12 sm:pt-28 lg:pt-36">
      <div className="hero track-wide">
        <div id="hero-copy" className="hero__copy">
          <h1 className="hero-title" aria-label="I make the next step clear.">
            <LetterSwap>I make the</LetterSwap>{' '}
            <PhotoSlot className="photo-slot--hero" />{' '}
            <span className="hero-title__end">next step clear.</span>
          </h1>
          <div className="hero__intro">
            <p>I’m Ayushman, a designer.</p>
            <EditedIntro skip={returning} mode="mark" className="" />
            {/* No "Selected work ↓" link here any more: he chose no scroll cue
                (Nov 2026); the work starts right under the first screen. */}
            <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <Link href="/about" className="prose-link">More about me</Link>
            </div>
          </div>
        </div>
      </div>

      <motion.div id="work" tabIndex={-1} className="scroll-mt-24" {...rise(0.12)}>
        {/* Only work with a full case study, strongest first, one per row. */}
        <Shipped label="selected work" items={SELECTED} rows />
      </motion.div>
      <div className="track-wide">
        {/* Craft: the experiments and smaller work. The title sits on the
            checkered strip (Hazel lives behind it), then every piece in one
            drifting band seen through a curved lens (exploration-band.jsx).
            This replaced the separate Exploration page; /archive now comes here. */}
        <section id="craft" aria-labelledby="home-craft" className="mt-24 scroll-mt-24 sm:mt-28">
          {/* The heading is a plain sentence in his voice; the typed note on the
              right says what kind of work sits in the band. */}
          <CheckerStrip
            id="home-craft"
            title="I explore a lot."
            aside={<span className="text-[0.78rem] tracking-[0.02em] text-faint" style={{ fontFamily: "'Geist Mono', ui-monospace, monospace" }}>experiments · sketches · small tools</span>}
          />
          {/* Newest first: Seat View, then the older pieces. */}
          <CraftBand only={['Seat View', 'Koi Wishing Pond', 'Gradient exploration', 'ALBUM//ALIVE', 'Gone or Still Here?', 'Choose Assam', 'Banyan Tree']} />
        </section>
      </div>

    </main>
    <ListeningCorner />
    </>
  )
}
