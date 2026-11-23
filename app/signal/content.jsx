'use client'

import { useEffect, useRef } from 'react'

import { Back, Subhead, Tradeoffs } from '../components/case-study'
import AnnotatedScreen from '../components/annotated-screen'
import { W } from './wayfinding'
import { StepVideo } from './demos'
import { Compare } from './compare'
import { MUKTA } from './font'
import { ColourVision, KeyDiagram, Mismatch, ReadingDistance, REFERENCES } from './system'
import { ArrowTurn, ForkConstruction, LiveScreen, NightZone, OutOf100, Pan, Stop, SwipeHint, Trip } from './motion'

/*
 * Signal: finding the right platform on the Delhi Metro.
 * The order matters. The 45% to 80% result was measured on the first, white
 * sign, in a phone test with 84 riders (Sheet read 1 Nov 2026). The black
 * "Night panel" system came after and is untested, so it follows the result
 * and is always labelled as a concept. Don't move the numbers next to it.
 * Iteration 4 lives on at /signal/v4.
 */
const N = '/signal/night'

export const CREDITS = [
  REFERENCES[0], // the colour-vision model cited by the first-sign diagram as [1]
  ['Order and W&CO. Digital Wayfinding Manual for WMATA.', 'https://segd.org/projects/wmata-digital-wayfinding-manual/'],
  ['Amit Patel. Metro Visual System for Glydways.', 'https://amitpateldesigns.com/glydways/metro-visual-system'],
  ['Bhave, San and Sharma (2023). MetroInSight: Innovating Accessibility in DMRC.', 'https://www.behance.net/gallery/184857911/MetroInSight-Innovating-Accessibility-In-DMRC'],
  ['Mathur, Maitra and Sharma (2023). Revamping DMRC Ticketing System.', 'https://www.behance.net/gallery/187484571/Revamping-DMRC-Ticketing-System'],
  ['AIGA and US DOT. Symbol Signs (public domain arrow).', 'https://www.aiga.org/resources/symbol-signs'],
  ['Ek Type. Mukta (SIL Open Font Licence).', 'https://fonts.google.com/specimen/Mukta'],
  ['OpenStreetMap contributors. Delhi Metro network and station gates (ODbL).', 'https://www.openstreetmap.org/copyright'],
]

const SAATHI_PINS = [
  { x: 68, y: 18.9, title: 'In the sign’s own words', body: 'The first line is the direction the station signs use, so the phone and the station never disagree.' },
  { x: 88, y: 51.2, title: 'The numbers to remember, on top', body: 'The platform and the exit, in the same badges as the signs. A rider reads them once at the board and puts the phone away.' },
  { x: 51, y: 77.5, title: 'The full route below', body: 'The stops fold into one line, and open to match the strip above the doors.' },
]

const BOARD_PINS = [
  { x: 16, y: 24, title: 'Starts with places', body: 'A visitor knows India Gate or Red Fort, so the board starts there.' },
  { x: 35, y: 34, title: 'The platform is the hand-off', body: 'The same large platform badge carries the rider from this board to the ticket, signs and train.' },
  { x: 84, y: 43, title: 'The exit is part of the route', body: 'Each common place ends with the station and gate nearest to it, rather than stopping at the train.' },
  { x: 54, y: 82, title: 'Useful without a phone', body: 'The printed board answers common trips directly. Scanning is only for somewhere that is not already listed.' },
]

/* Chapters share an editorial frame; the wayfinding system gets one sign-like pivot below. */
function Section({ id, title, lede, next, first = false, children }) {
  return (
    <section id={id} className={`sig-section scroll-mt-24 ${first ? '' : 'pt-24 sm:pt-36'}`}>
      <header className="grid gap-5 border-t border-rule pt-6 sm:grid-cols-[minmax(13rem,0.72fr)_minmax(0,1.28fr)] sm:gap-12 sm:pt-8">
        <h2 data-route="" className="headline text-ink" style={{ fontSize: 'clamp(2rem, 3.7vw, 3.75rem)', lineHeight: 1.03, letterSpacing: '-0.025em', textWrap: 'balance' }}>{title}</h2>
        {lede && <p className="text-ink max-w-[42rem]" style={{ fontSize: '1.12rem', lineHeight: 1.58 }}>{lede}</p>}
      </header>
      {children}
      {next && <p className="text-muted mt-20 sm:mt-24" style={{ fontSize: '1.2rem', lineHeight: 1.5, maxWidth: '36rem' }}>{next}</p>}
    </section>
  )
}

/* A part of a long section: a small label, then the visual, with room around it. */
const Part = ({ label, children }) => (
  <div className="pt-12 sm:pt-16">
    <Subhead>{label}</Subhead>
    {children}
  </div>
)

const Note = ({ children, className = 'mt-4' }) => <p className={`text-faint ${className}`} style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>{children}</p>

const Cap = ({ children }) => <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>{children}</figcaption>

/* One image from the system. Signs are flat artwork, so they get a small radius and no border. */
function Fig({ src, alt, w, h, cap, side, className = 'mt-16', framed = false, wide = false }) {
  return (
    <figure className={`track-wide case-fig ${className}`} data-side={side}>
      {wide
        ? <Pan label={alt}><img src={src} alt={alt} width={w} height={h} loading="lazy" className="block h-auto w-full" /></Pan>
        : <img src={src} alt={alt} width={w} height={h} loading="lazy" className="block h-auto w-full rounded-lg" style={framed ? { border: '1px solid var(--rule)' } : undefined} />}
      {cap && <Cap>{wide && <SwipeHint />}{cap}</Cap>}
    </figure>
  )
}

export const SIGNAL_TEST_METHOD = '84 of 120 riders completed all eight tasks on their phones. Each rider saw the existing sign at one station and the first redesign at the other. I randomly assigned which station showed each version.'
export const SIGNAL_TEST_SAMPLE = 'Most participants rode weekly. Only seven had ridden the metro one to five times, so the study tells us less about the occasional riders I designed for.'
export const SIGNAL_NEXT_TEST = 'I’d test the black-panel system with first-time and occasional riders at Kashmere Gate. I’d watch whether they carry platform 5 from ticket to gate to fork, and record where they hesitate, take a wrong turn, or ask for help.'

/* Show both conditions up front so the result is attached to the tested artwork. */
function Hero() {
  return (
    <section id="overview" className="measure scroll-mt-24 pb-4 pt-[4.75rem] sm:pt-20">
      <div className="track-full">
        <div className="sig-hero-masthead">
          <Back />
          <span>Case study · 2026</span>
        </div>

        <header className="grid items-end gap-4 py-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
          <h1 className="sig-hero-title" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>Signal</h1>
          <div>
            <p className="text-ink" style={{ fontSize: 'clamp(1.04rem, 2vw, 1.3rem)', lineHeight: 1.35 }}>You’re at Kashmere Gate. Which way gets you to Lajpat Nagar?</p>
            <p className="text-faint mt-1 text-sm">Delhi Metro wayfinding · Solo research, design and prototyping · Student project</p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:gap-5" aria-label="Kashmere Gate sign comparison">
          {[
            ['Existing sign', 'kg-today', 'The existing Kashmere Gate fork sign gives directions using line termini.'],
            ['First redesign · as tested', 'kg-new', 'The first redesign gives each platform a row. Platform 5 is violet, with Mandi House and Lajpat Nagar listed.'],
          ].map(([label, file, alt]) => (
            <figure key={file} className="m-0 min-w-0">
              <a href={`${W}/${file}.jpg`} target="_blank" rel="noreferrer" className="block rounded-md" aria-label={`Open ${label.toLowerCase()} at full size`}>
                <img src={`${W}/${file}.jpg`} width={1250} height={780} alt={alt} className="block h-auto w-full rounded-md" />
              </a>
              <Cap>{label}</Cap>
            </figure>
          ))}
        </div>
        <p className="text-ink mt-5 max-w-[42rem]" style={{ lineHeight: 1.5 }}>
          I gave each platform its own row, with an arrow, the platform number in the line’s colour, and two stops along the way.
          First-attempt platform accuracy rose from <strong>45% to 80%</strong> in a phone study with 84 riders.
        </p>
        <Note>{SIGNAL_TEST_SAMPLE}</Note>
      </div>
    </section>
  )
}

/* The only sign-like chapter break: the same key the rider follows through every touchpoint. */
function SystemPivot() {
  return (
    <div className="sig-pivot" role="img" aria-label="Platform 5, Violet Line, Mandi House and Lajpat Nagar: one key carried everywhere">
      <div className="sig-pivot__key" style={{ fontFamily: MUKTA }}>
        <span className="sig-pivot__badge">5</span>
        <span>
          <span className="sig-pivot__line">Violet Line</span>
          <span className="sig-pivot__places">मंडी हाउस · लाजपत नगर<br />Mandi House · Lajpat Nagar</span>
        </span>
      </div>
      <p className="sig-pivot__claim headline">Platform, line and two stops, at every step.</p>
    </div>
  )
}

/* The ticket carries the whole trip. The gate and fork only need the next decision. */
function PlatformHandoff() {
  return (
    <ol className="mt-10 grid list-none gap-8 p-0 sm:grid-cols-3 sm:gap-5">
      {[
        ['Ticket', 'ticket-new', 928, 1446, 'The sample ticket prints platform 5 on the Violet Line and the change at Lajpat Nagar.', 'Prints platform 5 and the Violet Line, then where to change. Sample ticket.'],
        ['Fare gate', 'fare-gate-qr', 1262, 756, 'The proposed fare-gate screen shows a tick and violet platform 5.', 'Confirms platform 5 after a QR scan. AI-generated concept image.'],
        ['Fork sign', 'night-fork', 2400, 300, 'The original black-panel fork artwork directs platform 5 straight ahead with Mandi House and Lajpat Nagar as cues.', 'Shows where to walk using 5, violet, and station names. Later black-panel concept.'],
      ].map(([title, file, width, height, alt, description]) => (
        <li key={file} className="min-w-0 border-t border-rule pt-3">
          <h3 className="text-ink font-semibold">{title}</h3>
          <a href={`${N}/${file}.jpg`} target="_blank" rel="noreferrer" aria-label={`Open the ${title.toLowerCase()} at full size`} className="mt-3 block h-44 overflow-hidden rounded-md sm:h-48" style={{ background: '#151515' }}>
            <img src={`${N}/${file}.jpg`} width={width} height={height} loading="lazy" alt={alt} className="block h-full w-full object-contain" />
          </a>
          <p className="text-muted mt-3 text-sm">{description}</p>
        </li>
      ))}
    </ol>
  )
}

/*
 * Two lengths from one source. `/signal` is the story a recruiter reads in a
 * few minutes; `/signal/detail` (detail) is the full system, for interviews.
 * Parts wrapped in `detail &&` appear only in the full version.
 */

/*
 * The sign, then the sign in place: a 7-second loop built from the page's own
 * artwork (the construction grid draws across the fork sign, then a slow push
 * into the concourse). Plays while on screen; Reduced Motion gets the still.
 */
function SignClip() {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.4 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <figure className="track-wide case-fig mt-16">
      <video
        ref={ref}
        src="/signal/clips/sign-in-place.mp4"
        poster={`${N}/hero.jpg`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="The new fork sign on its construction grid, then hanging in a metro concourse while commuters blur past"
        className="block h-auto w-full rounded-lg"
        width={1280}
        height={720}
      />
      <Cap>The sign on its grid, then in place. AI-generated concept image.</Cap>
    </figure>
  )
}

const TRIP = [
  { label: 'Kashmere Gate · Street', question: 'Where is my station?', src: `${N}/mock-street.jpg`, w: 2000, h: 1333, alt: 'Kashmere Gate street totem with the metro symbol, three line names and Gate 3', cap: 'The totem names the station, its lines and the entrance. Concept image.' },
  { label: 'Ticket hall', question: 'How do I look up my platform?', wide: true, src: `${N}/hall-board.jpg`, w: 2400, h: 1200, alt: 'The ticket hall board, with station names in Hindi and English and a numbered platform circle beside each row', cap: 'This sample shows how riders look up a station in Hindi order or A to Z.' },
  { label: 'Ticket counter', question: 'What do I need to remember?', compact: true, src: `${N}/ticket-new.jpg`, w: 928, h: 1446, alt: 'Sample ticket to Vinobapuri showing Violet Line platform 5, a change at Lajpat Nagar, then Pink Line platform 3', cap: 'The ticket prints both legs: platform 5 on the Violet Line, then platform 3 on the Pink Line after changing at Lajpat Nagar.' },
  { label: 'Fare gate', question: 'Am I going the right way?', src: `${N}/fare-gate-qr.jpg`, w: 1262, h: 756, alt: 'A fare gate screen with a check mark, Violet Line platform 5, and Mandi House and Lajpat Nagar', cap: 'Her QR scan brings up platform 5 again. AI-generated concept image.' },
  { label: 'Concourse fork', question: 'Which way to platform 5?', wide: true, src: `${N}/night-fork.jpg`, w: 2400, h: 300, alt: 'Kashmere Gate fork sign: platform 3 left, platforms 1, 2 and 5 straight ahead, and platform 4 right', cap: 'One arrow per direction, one row per platform. Neha sees 5 in violet beside Mandi House and Lajpat Nagar, straight ahead. The first redesign was tested in a phone study.' },
  { label: 'Violet Line platform 5', question: 'Is this the right train?', src: '/signal/mockups/platform-totem-v2.png', w: 1536, h: 1024, alt: 'A platform 5 totem beside the track, listing Violet Line stops through Lajpat Nagar', cap: 'The totem confirms platform 5 and lists the stops through Lajpat Nagar. Concept image.' },
  { label: 'Platform wall', question: 'How many stops to the change?', wide: true, src: `${N}/wall-strip.jpg`, w: 2400, h: 1000, alt: 'Numbered Violet Line stations ahead, with line bars marking interchanges', cap: 'Neha can count 11 stops to Lajpat Nagar on the wall strip.' },
  { label: 'On the Violet Line', question: 'What’s the next stop?', src: '/signal/mockups/train-display.png', w: 1536, h: 1024, alt: 'Train display showing Mandi House next, doors on the left and the following stops', cap: 'The display names the next stop and the door side. AI-generated concept image.' },
  { label: 'Lajpat Nagar interchange', question: 'Where do I change?', wide: true, src: `${N}/change-split.jpg`, w: 1600, h: 300, alt: 'Interchange sign pointing left to the Pink Line and right to the exit', cap: 'Neha follows the Pink Line bar. The green panel points towards the exit.' },
  { label: 'Pink Line stairs', question: 'Which platform goes to Vinobapuri?', wide: true, src: `${N}/night-stair.jpg`, w: 1600, h: 300, alt: 'Pink Line stair sign showing platform 3 for Vinobapuri and Mayur Vihar-I, and platform 4 for South Extension and INA', cap: 'Vinobapuri is on the platform 3 row, matching the second leg printed on her ticket.' },
  { label: 'Vinobapuri · Exit', question: 'How do I find my exit?', wide: true, src: `${N}/exit-fork.jpg`, w: 1600, h: 300, alt: 'A green exit sign with arrows for Gates 1, 2 and 3', cap: 'Neha arrives at Vinobapuri. The green sign shows how the proposed exit system works, with sample gate numbers.' },
]

export const MANUAL_SCOPE = 'I tested the first sign redesign in a phone study. The standards manual proposes a broader system for future station testing.'

export const MANUAL_PREVIEW = [
  { label: 'Page 13 · Paper ticket', src: `${N}/standards-page-13.jpg`, alt: 'Three sample paper tickets at actual size, including the two-leg trip to Vinobapuri', cap: 'One row per ride, with the change printed between them.' },
  { label: 'Page 14 · Gate screen', src: `${N}/standards-page-14.jpg`, alt: 'Three fare gate states: ask for help, QR scan with platform 5 and card tap with a check mark', cap: 'A QR scan confirms the first platform. The other states cover card taps and help.' },
  { label: 'Page 15 · Fork sign', src: `${N}/standards-page-15.jpg`, alt: 'The static Kashmere Gate fork sign, showing five platforms grouped into three directions', cap: 'Platform 5 carries into the concourse with the line colour and two stops.' },
  { label: 'Page 31 · Missing times and recovery', src: `${N}/standards-page-31.jpg`, alt: 'Two platform screens showing a missing arrival time and a service recovery message', cap: 'When live times are missing, the platform and stops stay visible.' },
].map((page) => ({ ...page, w: 1680, h: 1188 }))

// The short version's "What the system covers": one frame per part, each
// opening the full set of images the detail version shows for it.
export const SYSTEM = [
  {
    label: 'Station and train screens', note: 'Live times added to the same signs. A proposal.', src: '/signal/mockups/train-display.png', w: 1536, h: 1024,
    alt: 'Concept image of an in-train display showing the next station and the door side',
    slides: [
      { label: 'The fork, live', src: `${N}/digital-fork.jpg`, w: 2400, h: 300, alt: 'The fork as a live screen, with minutes to the next train beside each platform', cap: 'The fork sign with minutes added. Stations don’t have screens at forks yet, so this part is a proposal; the printed signs stay.' },
      { label: 'Above the train doors', src: '/signal/mockups/train-display.png', w: 1536, h: 1024, alt: 'Concept image of an in-train display showing Mandi House as the next station, doors opening on the left, and the following Violet Line stops', cap: 'Next station, door side and what comes after. AI-generated concept image.' },
      { label: 'At an interchange', src: `${N}/train-interchange.jpg`, w: 1920, h: 360, alt: 'Display above the train doors showing an interchange coming up', cap: 'The same display at an interchange.' },
      { label: 'Arriving', src: `${N}/train-arriving.jpg`, w: 1920, h: 360, alt: 'Display above the train doors on arrival at the station', cap: 'The same display on arrival.' },
      { label: 'Station finder kiosk', src: `${N}/kiosk-home.jpg`, w: 1080, h: 1920, alt: 'Station finder kiosk start screen asking Where are you going, with common trips listed', cap: 'A kiosk asks where you’re going and offers common trips first…' },
      { label: 'The kiosk’s answer', src: `${N}/kiosk-answer.jpg`, w: 1080, h: 1920, alt: 'Station finder kiosk answer: Lajpat Nagar, a large arrow and platform 5', cap: '…then gives one big answer.' },
    ],
  },
  {
    label: 'The ticket', note: 'Same paper roll, with platform, line and change.', src: `${N}/ticket-new.jpg`, w: 928, h: 1446, pos: 'top',
    alt: 'The redesigned paper ticket: platform 5 on the Violet Line, Change at Lajpat Nagar, then platform 3 on the Pink Line',
    slides: [
      { label: 'Today’s ticket', src: `${N}/ticket-today.jpg`, w: 928, h: 1446, alt: 'Today’s ticket for Kashmere Gate to Vinobapuri: a QR code, the fare as the largest text, station names in Hindi only, then an app advert', cap: 'The fare is the largest text, station names are in Hindi only, and nothing says which platform. Sample ticket, not valid.' },
      { label: 'The redesign', src: `${N}/ticket-new.jpg`, w: 928, h: 1446, alt: 'The redesigned ticket for the same trip: QR beside the destination, platform 5 on the Violet Line, Change at Lajpat Nagar, then platform 3 on the Pink Line', cap: 'The same two-ride trip on the same 58 mm roll: one row per ride, both stations in both scripts. About 6 mm longer. Sample ticket, not valid.' },
    ],
  },
  {
    label: 'The gate', note: 'Confirms the platform. A card tap shows only a tick, so nobody sees the balance.', src: `${N}/fare-gate-qr.jpg`, w: 1262, h: 756,
    alt: 'Concept image of a fare gate screen showing a tick and platform 5, Violet Line, Mandi House and Lajpat Nagar',
    slides: [
      { label: 'A QR ticket at the gate', src: `${N}/fare-gate-qr.jpg`, w: 1262, h: 756, alt: 'Concept image of a fare gate screen showing a tick and platform 5, Violet Line, Mandi House and Lajpat Nagar', cap: 'A QR scan confirms the first platform. A smart card tap shows only a tick, so nobody sees a balance. AI-generated concept image.' },
      { label: 'A problem at the gate', src: `${N}/gate-problem.jpg`, w: 1600, h: 1200, alt: 'Gate screen with a yellow block reading Please ask for help, and an arrow to Customer Care', cap: 'The screen points to Customer Care, and staff give the reason in private.' },
    ],
  },
  {
    label: 'One arrow, 24 pictograms', note: 'Drawn on one grid. Not tested yet.', src: `${N}/picto-set.jpg`, w: 1600, h: 1200,
    alt: 'A black sheet of 24 white pictograms with Hindi and English labels',
    slides: [
      { label: '24 pictograms', src: `${N}/picto-set.jpg`, w: 1600, h: 1200, alt: 'A black sheet of 24 white pictograms including train, change trains, walkway, stairs, escalator, lift, exit, tickets, toilets, accessible route, bus, auto-rickshaw, taxi, railway station and airport, each with Hindi and English labels', cap: 'Drawn on the arrow’s grid, each labelled in Hindi and English. Comprehension is not tested yet.' },
      { label: 'The arrow', src: `${N}/manual-05.jpg`, w: 1400, h: 990, alt: 'Manual page on the arrow, with eight directions and three rules', cap: 'One arrow, turned in 45° steps, with three rules for using it.' },
    ],
  },
  {
    ...MANUAL_PREVIEW[0],
    label: 'The standards manual', note: 'The ticket, gate, fork and missing-times examples from the proposed manual.',
    slides: MANUAL_PREVIEW,
  },
  {
    label: 'Saathi, a route finder', note: 'A QR board opens the whole trip on one screen.', src: `${W}/saathi-route.jpg`, w: 780, h: 1720, pos: 'top',
    alt: 'Saathi route screen: platform 5, Violet Line, at Kashmere Gate, and the exit at Lajpat Nagar',
    slides: [
      { label: 'The QR board', src: '/signal/gallery/board-inside.jpg', w: 780, h: 1100, alt: 'A printed Saathi board listing major places from Kashmere Gate, the platform and line to take, and the station and exit gate nearest each place', cap: 'Boards hang where riders already ask for help. Routes and gates come from OpenStreetMap; only Kashmere Gate and Lajpat Nagar were checked on site.' },
      { label: 'The route', src: `${W}/saathi-route.jpg`, w: 780, h: 1720, alt: 'Saathi’s route to Lajpat Nagar: platform 5, Violet Line, at Kashmere Gate and the exit at Lajpat Nagar, with 11 stops folded into one line', cap: 'The whole trip on one screen, so riders can read it once and put the phone away. An unofficial student prototype, live at saathi-delhi-metro.vercel.app.' },
    ],
  },
]

export default function SignalContent({ detail = false }) {
  return (
    <main className="sig-page">
      {detail && (
        <p className="measure pt-24 text-faint" style={{ fontSize: '0.9rem' }}>
          The full system, for interviews. The short version is at <a className="prose-link" href="/signal">/signal</a>.
        </p>
      )}
      <Hero />
      {/* One column and one left edge for the whole page: tracks are neutralised inside .sig-flow. */}
      <div className="measure pt-12 sm:pt-20"><div className="track-full sig-flow">

        {detail && <>
        <dl className="sig-project-meta" aria-label="Project scope and context">
          <div className="sig-project-meta__scope">
            <dt>Scope</dt>
            <dd>
              {['Signs and station screens', 'Type, colour and pictograms', 'Paper ticket and gate', 'Standards manual', 'Saathi, a route finder'].map((item, i) => (
                <span key={item}>{i > 0 && <i aria-hidden="true">·</i>}{item}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Context</dt>
            <dd>M.Des Interaction Design, UPES</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>2026</dd>
          </div>
        </dl>

        {/* ---------- The problem ---------- */}
        <Section id="problem" title="The problem" next="I focused on the riders with the least to fall back on." lede="Signs name each platform by the last station on its line, which doesn’t help someone who knows only where they’re going. Once lost underground, there’s often no signal for a map.">
          <Mismatch />
          <p className="text-ink mt-16" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.45rem)', lineHeight: 1.35, maxWidth: '34rem', textWrap: 'balance' }}>
            It happened to me first. On every ride I was unsure which way to go and which gate to leave by.
          </p>
          <dl className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-10">
            {[
              ['2 of 6', 'of my own rides went the wrong way'],
              ['3 of 5', 'occasional riders I know in Delhi said direction confuses them'],
              ['4', 'people on r/DelhiMetro brought up wrong-direction trips without being asked'],
            ].map(([n, d]) => (
              <div key={n} className="m-0">
                <dt className="headline text-ink tnum" style={{ fontSize: 'clamp(2.2rem, 3.6vw, 3.25rem)', lineHeight: 1 }}>{n}</dt>
                <dd className="text-ink mt-3 ml-0" style={{ fontSize: '1.02rem', lineHeight: 1.45, maxWidth: '18rem' }}>{d}</dd>
              </div>
            ))}
          </dl>
          <Note className="mt-6 max-w-[38rem]">I asked my friends about direction directly, so their answers were prompted. The Reddit thread asked about signs and exits in general.</Note>
        </Section>

        {/* ---------- Who it's for ---------- */}
        <Section id="who" title="Who it’s for" next="So I started with the sign itself." lede="First-time and occasional riders, who know where they’re going but not how the network is laid out. I designed around two personas.">
          <div className="sig-personas">
            {[
              ['Neha', '/signal/personas/neha.png', 'Minimal illustrated portrait of Neha, a fictional first-time Delhi Metro rider', 'First time on this route. She has a phone. She knows the place, not the station.'],
              ['Mohan-ji', '/signal/personas/mohan-ji.png', 'Minimal illustrated portrait of Mohan-ji, a fictional older Delhi Metro rider', 'He uses his phone for calls, not maps. He trusts signs and staff.'],
            ].map(([n, src, alt, d]) => (
              <article key={n} className="sig-persona">
                <figure className="sig-persona__portrait">
                  <img src={src} width={1122} height={1402} loading="lazy" alt={alt} />
                </figure>
                <div>
                  <h3 className="headline text-ink" style={{ fontSize: 'clamp(2.2rem, 3.6vw, 3.25rem)', lineHeight: 1.05 }}>{n}</h3>
                  <p className="text-ink mt-3" style={{ fontSize: '1.08rem', lineHeight: 1.5, maxWidth: '26rem' }}>{d}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="headline text-ink mt-10" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.1rem)', lineHeight: 1.2 }}>Every step has to work with no phone.</p>
          <Note className="mt-6 max-w-[38rem]">Neha and Mohan-ji are personas. Most of the 84 people in the test ride weekly, and only 7 had ridden 1 to 5 times, so riders like these two are under-represented in the result.</Note>
        </Section>

        </>}

        {/* ---------- The test ---------- */}
        <Section id="result" title="What I tested" first={!detail} lede={SIGNAL_TEST_METHOD}>
          <div className={detail ? 'mt-8 grid items-start gap-6 sm:grid-cols-2 sm:gap-12' : 'mt-6 max-w-[42rem]'}>
            <div>
              <p className="text-ink" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.45rem)', lineHeight: 1.35, maxWidth: '34rem', textWrap: 'balance' }}>
                The biggest gain was for destinations printed on the sign. First-attempt accuracy rose from 48% to 91% for those destinations and from 39% to 60% for the others.
              </p>
              {detail && <OutOf100 before={45} after={80} />}
            </div>
            {detail && <div style={{ fontSize: '0.98rem', lineHeight: 1.5 }}>
              <p className="text-faint mb-3" style={{ fontSize: '0.85rem' }}>Share of attempts, existing signs → first redesign</p>
              <dl className="space-y-3">
                {[
                  ['Right first try, when the sign named their stop', '48% → 91%'],
                  ['Right first try, when it didn’t', '39% → 60%'],
                  ['Answered “not sure”', '26% → 10%'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-t border-rule pt-2">
                    <dt className="text-ink">{k}</dt>
                    <dd className="tnum m-0 shrink-0">{v}</dd>
                  </div>
                ))}
              </dl>
              <Note>The test measured platform choices on a phone using station photos.</Note>
              <p className="text-ink mt-4">Across the task set, 56 riders scored higher with the first redesign, 18 tied, and 10 scored lower.</p>
            </div>}
          </div>
          {detail && <>
            <Part label="What riders needed to remember"><KeyDiagram /></Part>
            <Part label="How far the first sign reads"><ReadingDistance /></Part>
            <Part label="In the first sign, colour is never the only cue"><ColourVision /></Part>
          </>}
        </Section>

      </div></div>

      {/* The story turns here, so the whole page does too: it changes colour as this section arrives. */}
      <NightZone><div className="measure pb-28 pt-24 sm:pt-32"><div className="track-full sig-flow">

        {detail ? <>
        <SystemPivot />

        {/* ---------- The system ---------- */}
        <Section id="system" first title="One visual system" next="Here it is across one trip." lede="The tested signs worked, but they looked like app screens, and each piece had been designed alone. So I set one system for everything: near-black panels, colour only for platforms and lines, one arrow and one typeface.">
          <SignClip />
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-end gap-6 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8 [&_figure]:mt-0">
            <figure className="case-fig max-w-[13rem] sm:max-w-none"><img src={`${W}/kg-new.jpg`} width={1250} height={780} loading="lazy" alt="The first redesign of the Kashmere Gate sign, as tested: a panel with platform numbers, arrows and station names" className="block h-auto w-full rounded-lg" /><Cap>Before: the sign I tested.</Cap></figure>
            <div className="min-w-0"><ForkConstruction alt="The same Kashmere Gate fork on the black panel: platform 3 to the left, platforms 1, 2 and 5 straight ahead, platform 4 to the right, each with two stations in Hindi and English" cap="The same sign in the new system. The information hasn’t changed, only the look, so the test result doesn’t apply to it yet. The grid unit is 40 mm." /></div>
          </div>
          {detail && (
            <>
              <Part label="One arrow, turned in 45° steps"><ArrowTurn /></Part>
              <Part label="24 pictograms drawn on the arrow’s grid">
                <Fig src={`${N}/picto-set.jpg`} w={1600} h={1200} className="mt-8" alt="A black sheet of 24 white pictograms including train, change trains, walkway, stairs, escalator, lift, exit, tickets, toilets, accessible route, bus, auto-rickshaw, taxi, railway station and airport, each with Hindi and English labels" cap="Comprehension is not tested yet." />
              </Part>
            </>
          )}
        </Section>

        {/* ---------- Street to exit ---------- */}
        <Section id="signs" title="Kashmere Gate to Vinobapuri" next="Screens build on the same signs." lede="Neha starts on Violet Line platform 5, changes at Lajpat Nagar, then takes Pink Line platform 3 to Vinobapuri. This trip uses the proposed signs and paper ticket.">
          <Trip>
            {TRIP.map((stop) => <Stop key={stop.label} {...stop} />)}
          </Trip>
          <p className="mt-10 text-sm text-muted">See <a className="prose-link" href="#saathi">Saathi for a separate trip ending at Lajpat Nagar</a>.</p>
        </Section>
        </> : (
          <Section id="system" first title="Platform 5, from ticket to fork" lede="I kept the platform number consistent so riders could recognise it at each decision. The later black-panel system is a proposal and still needs a station test.">
            <PlatformHandoff />
            <ul className="mt-8 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-sm" aria-label="Explore the rest of Signal">
              <li><a className="prose-link" href="/signal/detail#signs">Follow the full journey</a></li>
              <li><a className="prose-link" href="/signal/detail#saathi">Explore Saathi</a></li>
              <li><a className="prose-link" href="/signal/detail#manual">Explore the standards manual</a></li>
            </ul>
          </Section>
        )}

        {detail && (<>
        {/* ---------- Screens ---------- */}
        <Section id="screens" title="Station and in-train screens" next="The paper ticket and the gate use the same information." lede="Stations don’t have these screens at forks yet, so this part is a proposal. Screens add live times, and the printed signs stay.">
          <Fig wide src={`${N}/digital-fork.jpg`} w={2400} h={300} alt="The fork as a live screen: the same layout as the static sign, with minutes to the next train beside each platform" cap="The fork sign with minutes added." />
          <LiveScreen cap="The next train, then arriving, then a service change." />
          <Fig src="/signal/mockups/train-display.png" w={1536} h={1024} className="mt-16" alt="Concept image of an in-train display above the doors showing Mandi House as the next station, doors opening on the left, and the following Violet Line stops" cap="Next station, door side and what comes after. AI-generated concept image." />
          <div className="track-wide case-fig mt-8 grid gap-2">
            {[['train-interchange', 'an interchange coming up'], ['train-arriving', 'arriving at the station']].map(([n, t]) => (
              <img key={n} src={`${N}/${n}.jpg`} width={1920} height={360} loading="lazy" alt={`Display above the train doors showing ${t}`} className="block h-auto w-full rounded-lg" />
            ))}
            <Cap>The same display at an interchange and on arrival.</Cap>
          </div>
          <div className="track-wide mt-16 grid grid-cols-2 items-end gap-4 sm:grid-cols-[1fr_1fr_2fr]">
            <figure className="case-fig"><img src={`${N}/kiosk-home.jpg`} width={1080} height={1920} loading="lazy" alt="Station finder kiosk start screen asking Where are you going, with common trips listed" className="block h-auto w-full rounded-lg" /></figure>
            <figure className="case-fig"><img src={`${N}/kiosk-answer.jpg`} width={1080} height={1920} loading="lazy" alt="Station finder kiosk answer: Lajpat Nagar, a large arrow and platform 5" className="block h-auto w-full rounded-lg" /></figure>
            <p className="col-span-2 text-ink sm:col-span-1 sm:pl-6" style={{ fontSize: '1.05rem', lineHeight: 1.5 }}>A station finder kiosk asks where you’re going, offers common trips first, then gives one big answer.</p>
          </div>
        </Section>

        {/* ---------- Ticket and gate ---------- */}
        <Section id="ticket" title="The ticket and the gate" next="These rules are written down so someone else could build this." lede="The ticket carries the same information, in black on today’s 58 mm roll. If there’s a problem at the gate, the screen points to Customer Care, and staff give the reason in private.">
          <Fig src={`${N}/fare-gate-qr.jpg`} w={1262} h={756} className="mt-16" alt="Concept image of a metro fare gate screen showing a tick and platform 5, Violet Line, Mandi House and Lajpat Nagar" cap="A QR scan confirms the first platform. A smart card tap shows only a tick, so nobody sees a balance. AI-generated concept image." />
          <div className="track-wide mt-8 grid items-start gap-4 sm:grid-cols-[minmax(0,19rem)_minmax(0,32rem)]">
            <figure className="case-fig">
              <Compare
                aspect="928 / 1446"
                before={{ src: `${N}/ticket-today.jpg`, alt: 'Today’s ticket for Kashmere Gate to Vinobapuri: a QR code, the fare as the largest text, station names in Hindi only, then a carbon message and an app advert' }}
                after={{ src: `${N}/ticket-new.jpg`, alt: 'The redesigned ticket for the same trip: QR beside the destination, platform 5 on the Violet Line, a line reading Change at Lajpat Nagar, then platform 3 on the Pink Line' }}
              />
              <Cap>The same two-ride trip, on the same paper roll. Drag to compare. Sample tickets, not valid.</Cap>
            </figure>
            <div className="grid gap-4">
              <figure className="case-fig"><img src={`${N}/gate-problem.jpg`} width={1600} height={1200} loading="lazy" alt="Gate screen with a yellow block reading Please ask for help, and an arrow to Customer Care" className="block h-auto w-full rounded-lg" /><Cap>A problem, and where to get help.</Cap></figure>
                          </div>
          </div>
        </Section>

        {/* ---------- Manual ---------- */}
        <Section id="manual" title="The standards manual" lede="The manual follows the rider through the station, from the paper ticket to the signs and live screens.">
          <p className="mt-5 text-sm text-muted">{MANUAL_SCOPE}</p>
          <div className="track-wide mt-10 grid gap-x-5 gap-y-8 sm:grid-cols-2">
            {MANUAL_PREVIEW.map(({ label, src, alt, w, h, cap }) => (
              <figure key={src} className="case-fig">
                <a href={src} aria-label={`Open ${label.toLowerCase()} at full size`}>
                  <img src={src} width={w} height={h} loading="lazy" alt={alt} className="block h-auto w-full rounded-lg border border-rule" />
                </a>
                <figcaption className="mt-3">
                  <p className="text-sm text-ink">{label}</p>
                  <p className="mt-1 text-sm text-faint">{cap}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-10" style={{ fontSize: '0.95rem' }}>
            <a className="prose-link" href="/signal/Delhi-Metro-Standards-Manual.pdf" target="_blank" rel="noreferrer">Read the manual (PDF, 1 MB)</a>
          </p>
        </Section>

        {/* ---------- Saathi ---------- */}
        <Section id="saathi" title="Saathi, the route finder" next="These are the limits I know about." lede="In this separate trip to Lajpat Nagar Central Market, riders scan a QR board and see the route and exit on one screen.">
          <AnnotatedScreen
            src="/signal/gallery/board-inside.jpg"
            width={780}
            height={1100}
            maxW="31rem"
            alt="A printed Saathi board listing major places from Kashmere Gate, the platform and line to take, and the station and exit gate nearest each place"
            pins={BOARD_PINS}
            caption="Printed-board prototype. Routes and gates come from OpenStreetMap; only Kashmere Gate and Lajpat Nagar were checked on site."
          />
          <StepVideo className="track-wide mt-16" name="saathi-trip" label="Saathi recording: a trip from Kashmere Gate to Lajpat Nagar Central Market" />
          <AnnotatedScreen
            src={`${W}/saathi-route.jpg`}
            width={780}
            height={1720}
            maxW="16.5rem"
            alt="Saathi's route to Lajpat Nagar: Take the train towards Raja Nahar Singh (Ballabhgarh); a summary card with platform 5, Violet Line, at Kashmere Gate and the exit at Lajpat Nagar; below it the full route, with 11 stops folded into one line and the exit"
            pins={SAATHI_PINS}
            caption="Saathi is an unofficial student prototype, not made with or for DMRC. It still uses the first sign style."
          />
          <p className="mt-10" style={{ fontSize: '0.95rem' }}>
            Live at <a className="prose-link" href="https://saathi-delhi-metro.vercel.app" target="_blank" rel="noreferrer">saathi-delhi-metro.vercel.app</a>.
          </p>
        </Section>

        </>)}

        {/* ---------- Limits ---------- */}
        <Section id="limits" title="What I’d test next" lede={SIGNAL_NEXT_TEST}>
          {detail && <>
          <div className="mt-16">
            <Tradeoffs items={[
              ['The black signs are new', 'Kept the tested arrow, platform, line name and two stops, and changed only the look', 'I can’t claim the 45% to 80% result for them until I re-test'],
              ['Some riders have no smartphone', 'Every step works on signs and the ticket alone', 'The phone can only add, never fix a bad sign'],
              ['No signal underground', 'Boards where riders already stop to ask for help; once opened, the route stays on the phone', 'The first scan needs signal where the board hangs'],
              ['Hindi station names on the ticket', 'One row per ride, with both stations in both scripts', 'The ticket is about 6 mm longer than today’s for a two-ride trip'],
            ]} />
          </div>
          <p className="mt-12 max-w-[36rem]" style={{ fontSize: '1.05rem', lineHeight: 1.55 }}>Apart from the phone test of the first sign, none of this has been tested with riders or built in a station. This work only helps people who find their way by sight. Blind and low-vision riders need their own research, and <a className="prose-link" href="https://www.behance.net/gallery/184857911/MetroInSight-Innovating-Accessibility-In-DMRC" target="_blank" rel="noreferrer">MetroInSight</a> is a student project on that for the Delhi Metro.</p>
          <Subhead>References</Subhead>
          <ol className="mt-6 space-y-2" style={{ fontSize: '0.85rem' }}>
            {CREDITS.map(([t, href], i) => (
              <li key={t} id={`ref-${i + 1}`} className="grid scroll-mt-24 grid-cols-[2rem_1fr] border-t border-rule pt-2">
                <span className="text-faint tnum">[{i + 1}]</span>
                <a className="prose-link" href={href} target="_blank" rel="noreferrer">{t}</a>
              </li>
            ))}
          </ol>
          </>}
        </Section>

        <footer className="mt-20 space-y-3 border-t border-rule pt-6 text-faint" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
          <p>This is the fifth idea in the project. The fourth is written up too: <a className="prose-link" href="/signal/v4">when to stop waiting during a delay</a>.</p>
          <p>Network data from OpenStreetMap; only Kashmere Gate and Lajpat Nagar are checked on site. A student proposal, not made with or for DMRC.</p>
        </footer>
      </div></div></NightZone>
    </main>
  )
}
