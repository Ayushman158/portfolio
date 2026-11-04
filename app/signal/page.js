'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Back, Facts, Heading, Impact, Subhead, Tradeoffs } from '../components/case-study'
import { Compare, W } from './wayfinding'
import { StepVideo } from './demos'
import { LiveActivity } from './device'
import { SIGN_FONT } from './font'
import { BeforeAfter, Collage, ColourVision, Gallery, Journey, GridSpec, KeyDiagram, LineTable, Mismatch, ReadingDistance, References, TypeSpecimen } from './system'

/*
 * Signal: finding the right platform on the Delhi Metro (iteration 5).
 * Delhi Metro signs name a train by its last station, so a rider going
 * somewhere in between has to know the network already. The redesign puts
 * the platform number, line colour and two real stations together, and was
 * tested on riders' phones. Results are the 84 riders who finished all eight
 * trips (Sheet read 1 Nov 2026). Iteration 4 lives on at /signal/v4.
 * Written for a recruiter's first pass: result first, then the problem, the
 * work as pictures, and honest limits. Colour lives only in the images.
 */
// Outcome-led: the problem and the impact, then the work. Research and the test write-up live in the deck.
const GROUPS = [
  ['Intro', [['overview', 'Overview'], ['problem', 'The problem'], ['result', 'The impact']]],
  ['The work', [['idea', 'The idea'], ['signs', 'The signs'], ['spec', 'The sign system'], ['system', 'The ticket and QR board'], ['saathi', 'Saathi'], ['journey', 'The journey']]],
  ['Wrap up', [['limits', 'Trade-offs'], ['outcome', 'What’s next']]],
]
const IDS = GROUPS.flatMap(([, items]) => items.map(([id]) => id))

function useActive(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' },
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [ids])
  return active
}

/* Plain text menu, fixed in the left margin on wide screens only. */
function SectionMenu({ active }) {
  return (
    <nav aria-label="Sections" className="sig-map fixed left-6 top-40 z-10 w-44">
      {GROUPS.map(([group, items]) => (
        <div key={group}>
          <p className="sig-group">{group}</p>
          <ul className="space-y-0.5">
            {items.map(([id, name]) => {
              const on = id === active
              return (
                <li key={id}>
                  <a href={`#${id}`} aria-current={on ? 'location' : undefined} className="block py-1 transition-colors duration-200" style={{ fontSize: '0.92rem', color: on ? 'var(--ink)' : 'var(--faint)' }}>
                    {name}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function Section({ id, n, title, lede, children }) {
  return (
    <section id={id} className="scroll-mt-24 pt-32 sm:pt-48">
      <Heading n={n}>{title}</Heading>
      {lede && <p className="text-ink" style={{ fontSize: '1.2rem', lineHeight: 1.5, maxWidth: '36rem' }}>{lede}</p>}
      {children}
    </section>
  )
}

/* A part of a long section: a small label, then the visual, with room around it. */
const Part = ({ label, children }) => (
  <div className="pt-20 sm:pt-28">
    <Subhead>{label}</Subhead>
    {children}
  </div>
)

const Note = ({ children, className = 'mt-4' }) => <p className={`text-faint ${className}`} style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>{children}</p>

/*
 * The project in one statement, read as you scroll: each word fills from faint to ink as it
 * reaches the middle of the screen, so the eye is led through it once (after Glydways' Metro
 * page). The badge inline is the one thing a rider has to remember. Reduce Motion: plain text.
 */
const STATEMENT = 'Delhi Metro signs name each train by the last station on its line, so riders have to know the network to pick a platform. I redesigned the signs around the stations riders travel to, like {chip}, and added QR boards that open a route finder for riders who get lost. With the new signs, 80% of riders picked the right platform first try, up from 45%.'

const Chip = () => (
  // Concentric corners: the box's radius is the badge's radius plus the gap around it.
  <span className="inline-flex translate-y-[-0.12em] items-center gap-[0.55em] align-middle" style={{ padding: '0.3em 0.75em 0.3em 0.3em', borderRadius: '0.75em', border: '1px solid var(--rule)', background: 'var(--ground)', fontFamily: SIGN_FONT, fontSize: '0.5em', lineHeight: 1, fontWeight: 700, color: 'var(--ink)' }}>
    <span className="grid h-[1.9em] w-[1.9em] place-items-center" style={{ borderRadius: '0.45em', background: '#7b3fe0', color: '#fff' }}>5</span>
    Lajpat Nagar
  </span>
)

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return <motion.span style={{ opacity }}>{children}</motion.span>
}

function Statement() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = STATEMENT.split(' ')
  return (
    <p ref={ref} className="sig-statement headline mt-24 sm:mt-32" style={{ fontSize: 'clamp(1.6rem, 1.15rem + 1.5vw, 2.2rem)', lineHeight: 1.28, textWrap: 'pretty' }}>
      {words.map((w, i) => {
        const node = w.startsWith('{chip}') ? <><Chip />{w.slice(6)}</> : w
        const tail = i < words.length - 1 ? ' ' : ''
        if (reduce) return <span key={i}>{node}{tail}</span> // also forced in CSS: this hook can miss the setting on load
        const a = i / words.length
        return <Word key={i} progress={scrollYProgress} range={[a, a + 1.6 / words.length]}>{node}{tail}</Word>
      })}
    </p>
  )
}

export default function Signal() {
  const reduceMotion = useReducedMotion()
  const active = useActive(IDS)
  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <SectionMenu active={active} />
      <motion.div {...rise(0)}><Back /></motion.div>

      {/* ---------- Overview ---------- */}
      <section id="overview" className="scroll-mt-24">
        <motion.header {...rise(0.06)} className="mt-10 space-y-5">
          <h1 className="display">Helping Delhi Metro riders find their way: new signs and a QR route finder</h1>
        </motion.header>

        <motion.div {...rise(0.12)}>
          <Collage />
        </motion.div>


        <Facts rows={[
          ['Project', 'Signal, for the Delhi Metro'],
          ['Role', 'Solo: research, design, prototype'],
          ['Scope', <span key="scope" className="block leading-relaxed">Signage and wayfinding<br />Type and colour system<br />Paper ticket<br />QR boards<br />Saathi, a route finder</span>],
          ['Context', 'M.Des Interaction Design, UPES'],
          ['Year', '2026'],
        ]} />

        <Statement />

        <Impact
          label="Impact"
          items={[
            ['80%', 'picked the right platform first try', '45%'],
            ['56 of 66', 'riders who changed did better'],
            ['10%', 'said “Not sure”', '26%'],
            ['84', 'riders on their own phones'],
          ]}
        />

      </section>

      {/* ---------- The problem ---------- */}
      <Section id="problem" n="01" title="The problem" lede="New riders get confused in two ways. At a fork, signs name each platform by the last station on its line, which means nothing to someone who knows only where they’re going. And once they’re lost inside the station, there’s nothing to ask: maps need signal, and underground there often isn’t any.">
        <Mismatch />
      </Section>

      {/* ---------- The impact ---------- */}
      <Section id="result" n="02" title="The impact" lede="Riders picked the right platform almost twice as often, most of all where their stop was printed on the sign.">
        <div className="mt-16">
          <Compare rows={[
            ['Stop printed on the new sign', 48, 91],
            ['Stop not printed', 39, 60],
          ]} />
        </div>
        <Note className="mt-8">A phone test with photos of the two stations: each rider saw today’s sign at one and the redesign at the other. 84 riders finished; p &lt; 0.001. Testing on site is next.</Note>
      </Section>

      {/* ---------- The idea ---------- */}
      <Section id="idea" n="03" title="The idea" lede="Every sign, ticket and screen shows the platform number, the line colour and two stations together, so remembering any one of them is enough.">
        <KeyDiagram />
      </Section>

      {/* ---------- The signs ---------- */}
      <Section id="signs" n="04" title="The signs" lede="Each platform gets one row: an arrow, the number in the line’s colour, and two stations on the way.">
        <BeforeAfter />
        <figure className="track-wide mt-20">
          <img src={`${W}/render-fork.jpg`} alt="Concept render: the redesigned Kashmere Gate sign hanging where the concourse splits three ways, each arrow over its path" className="block aspect-[3/1] w-full rounded-xl object-cover" style={{ objectPosition: '50% 8%', border: '1px solid var(--rule)' }} />
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>At the fork, hung where the concourse splits three ways.</figcaption>
        </figure>
        <figure className="track-wide mt-6">
          <img src={`${W}/render-totem.jpg`} alt="Concept render: a platform totem for platform 5, Violet Line, listing the next five stops" loading="lazy" className="block aspect-[16/10] w-full rounded-xl object-cover" style={{ objectPosition: '50% 50%', border: '1px solid var(--rule)' }} />
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>On the platform, a totem with the next five stops. Both are concept renders; the sign faces are the real artwork.</figcaption>
        </figure>
      </Section>

      {/* ---------- The sign system ---------- */}
      <Section id="spec" n="05" title="The sign system" lede="The grid, type and colours are set once and used on every sign, ticket and screen.">
        <Part label="One module, U = 50 mm"><GridSpec /></Part>
        <Part label="Two scripts at one size"><TypeSpecimen /></Part>
        <Part label="Colour identifies a line, and only that"><LineTable /></Part>
        <Part label="Every line reads without colour"><ColourVision /></Part>
        <Part label="Read from across the hall"><ReadingDistance /></Part>
      </Section>

      {/* ---------- The ticket and QR board ---------- */}
      <Section id="system" n="06" title="The ticket and QR board" lede="The same key is on the paper ticket, and a QR board at the entrance opens Saathi for riders who get lost.">
        <div className="track-wide mt-16 grid items-start gap-4 sm:grid-cols-[1fr_2fr]">
          <figure className="mx-auto w-full max-w-[280px] sm:max-w-none">
            <img src={`${W}/ticket.jpg`} alt="The redesigned paper ticket: platform 5, Violet Line, Mandi House · Lajpat Nagar, printed in black on the existing thermal printer" loading="lazy" className="block w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>The same thermal printer, in black only.</figcaption>
          </figure>
          <figure>
            <img src={`${W}/render-entrance.jpg`} alt="Concept render: the entrance board on a pillar by the stairs, a phone showing the Saathi page it opens" loading="lazy" className="block w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>Scan above ground; the route stays on the phone below.</figcaption>
          </figure>
        </div>
      </Section>

      {/* ---------- Demo: Saathi ---------- */}
      <Section id="saathi" n="07" title="Saathi, the route finder" lede="A rider reads the route once at the board and puts the phone away, so Saathi shows the whole trip on one screen: the numbers to remember on top, the full route below.">
        <StepVideo className="track-wide mt-16" name="saathi-trip" label="Saathi recording: a trip from Kashmere Gate to Lajpat Nagar Central Market" />
        <Part label="Concept: Saathi as an app">
          <div className="track-wide mt-6 grid items-center gap-10 sm:grid-cols-[minmax(0,16.5rem)_1fr] sm:gap-12">
            <LiveActivity className="mx-auto max-w-[16.5rem]" />
            <div className="space-y-4" style={{ maxWidth: '26rem' }}>
              <p className="text-ink" style={{ fontSize: '1.05rem', lineHeight: 1.55 }}>As an app, the trip could stay on the lock screen with no signal. The Dynamic Island opens to the step that matters now, in the sign’s own words; the lock screen keeps the whole route.</p>
              <p className="text-faint" style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>Not built. A website can’t reach the island or the lock screen. Tap the island to open or close it.</p>
            </div>
          </div>
        </Part>
        <p className="mt-10" style={{ fontSize: '0.95rem' }}>
          Live at <a className="prose-link" href="https://saathi-delhi-metro.vercel.app" target="_blank" rel="noreferrer">saathi-delhi-metro.vercel.app</a>.
        </p>
      </Section>

      {/* ---------- The journey ---------- */}
      <Section id="journey" n="08" title="The journey, before and after" lede="One trip asks a new rider six questions. Before, most of them had no answer in the station.">
        <Journey />
      </Section>

      <Gallery />

      {/* ---------- Trade-offs ---------- */}
      <Section id="limits" n="09" title="Trade-offs" lede="What each constraint made me choose, and what it cost.">
        <div className="mt-16">
          <Tradeoffs items={[
            ['Signs have to fit today’s frames', 'One row per platform, inside the existing panel', 'No room for maps or long station lists'],
            ['Some riders have no smartphone', 'Every step works on signs and the ticket alone', 'The phone can only add, never fix a bad sign'],
            ['No signal underground', 'Plan at the entrance; the route saves on the phone', 'It needs one scan above ground'],
          ]} />
        </div>
      </Section>

      {/* ---------- Outcome ---------- */}
      <section id="outcome" className="scroll-mt-24 pt-32 sm:pt-48">
        <p className="headline" style={{ lineHeight: 1.2 }}>So far the signs are tested in photos. On 7 November I take them to Kashmere Gate, to see where riders decide at the fork and to try Saathi with riders there.</p>
        <Subhead>References</Subhead>
        <References />
      </section>

      <footer className="mt-20 space-y-3 border-t border-rule pt-6 text-faint" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
        <p>This is the fifth idea in the project. The fourth is written up too: <a className="prose-link" href="/signal/v4">when to stop waiting during a delay</a>.</p>
        <p>Network data from OpenStreetMap; only Kashmere Gate and Lajpat Nagar are checked on site. A student proposal, not made with or for DMRC.</p>
      </footer>
    </main>
  )
}
