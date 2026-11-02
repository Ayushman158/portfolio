'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Facts, Heading, Impact, Subhead, Tradeoffs } from '../components/case-study'
import { Compare, W } from './wayfinding'
import { Clip, ColourBlind, Distance, KeyBuild, StepVideo } from './demos'
import { Collage, GridSpec, LineTable, Mismatch, Principles, References, TypeSpecimen } from './system'

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
  ['The work', [['idea', 'The idea'], ['signs', 'The signs'], ['spec', 'The sign system'], ['system', 'The ticket and QR board'], ['saathi', 'Saathi'], ['details', 'Details']]],
  ['Wrap up', [['limits', 'Trade-offs'], ['outcome', 'Outcome']]],
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
          <p className="text-ink" style={{ fontSize: '1.3rem', lineHeight: 1.45 }}>
            Delhi Metro signs name each train by the last station on its line, so riders have to know the network to pick a platform. I redesigned the signs around the stations riders travel to, and added QR boards that open a route finder for riders who get lost. With the new signs, 80% of riders picked the right platform first try, up from 45%.
          </p>
        </motion.header>

        <motion.div {...rise(0.12)}>
          <Collage />
        </motion.div>

        <Impact
          label="Impact"
          items={[
            ['80%', 'picked the right platform first try', '45%'],
            ['56 of 66', 'riders who changed did better'],
            ['10%', 'said “Not sure”', '26%'],
            ['84', 'riders on their own phones'],
          ]}
        />

        <Facts rows={[
          ['Role', 'Solo: research, sign design, prototype'],
          ['Context', 'M.Des Interaction Design, UPES'],
          ['Timeline', 'October to November 2026'],
          ['Built', 'Signs, a paper ticket, an entrance board and Saathi, a route finder'],
        ]} />

      </section>

      {/* ---------- The problem ---------- */}
      <Section id="problem" n="01" title="The problem" lede="At a fork, Delhi Metro signs name each platform by the last station on its line. Riders know only where they’re going.">
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
        <KeyBuild />
      </Section>

      {/* ---------- The signs ---------- */}
      <Section id="signs" n="04" title="The signs" lede="Each platform gets one row: an arrow, the number in the line’s colour, and two stations on the way.">
        <figure className="track-wide mt-16">
          <img src={`${W}/render-fork.jpg`} alt="Concept render: the redesigned Kashmere Gate sign hanging where the concourse splits three ways, each arrow over its path" className="block aspect-[3/1] w-full rounded-xl object-cover" style={{ objectPosition: '50% 8%', border: '1px solid var(--rule)' }} />
        </figure>
        <figure className="track-wide mt-6">
          <img src={`${W}/render-totem.jpg`} alt="Concept render: a platform totem for platform 5, Violet Line, listing the next five stops" loading="lazy" className="block aspect-[16/10] w-full rounded-xl object-cover" style={{ objectPosition: '50% 50%', border: '1px solid var(--rule)' }} />
        </figure>
        <Note className="mt-4">Concept renders. The sign faces are the real artwork.</Note>
      </Section>

      {/* ---------- The sign system ---------- */}
      <Section id="spec" n="05" title="The sign system" lede="The grid, type and colours are set once and used on every sign, ticket and screen.">
        <Principles />
        <Part label="One module, U = 50 mm"><GridSpec /></Part>
        <Part label="Two scripts at one size"><TypeSpecimen /></Part>
        <Part label="Colour identifies a line, and only that"><LineTable /></Part>
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
      <Section id="saathi" n="07" title="Saathi, the route finder" lede="Saathi answers like a person would, one thing at a time: the platform, then the stop, then the gate.">
        <StepVideo className="track-wide mt-16" name="saathi-trip" label="Saathi recording: a trip from Kashmere Gate to Lajpat Nagar Central Market" />
        <div className="track-wide mt-24 grid gap-12 sm:grid-cols-2">
          <div>
            <p className="text-ink mb-4">A trip with a change</p>
            <StepVideo name="saathi-change" label="Saathi recording: a trip with a change at Lajpat Nagar" />
          </div>
          <div>
            <p className="text-ink mb-4">One language at a time</p>
            <StepVideo name="saathi-language" label="Saathi recording: switching to Hindi, then Listen" />
          </div>
        </div>
        <p className="mt-10" style={{ fontSize: '0.95rem' }}>
          Live at <a className="prose-link" href="https://saathi-delhi-metro.vercel.app" target="_blank" rel="noreferrer">saathi-delhi-metro.vercel.app</a>.
        </p>
      </Section>

      {/* ---------- Details ---------- */}
      <Section id="details" n="08" title="Details" lede="These small decisions keep it working underground, in a crowd, in Hindi and for colour-blind riders.">
        <div className="track-wide mt-16 grid gap-x-12 gap-y-24 sm:grid-cols-2">
          {[
            ['The answer types in', 'The line types in like speech; screen readers get the whole sentence at once.', <div key="v" className="mx-auto max-w-[15rem]"><Clip name="detail-typed" label="Saathi’s question typing in" /></div>],
            ['Stages change in place', 'The card reshapes between stages, so the eye stays in one place.', <div key="v" className="mx-auto max-w-[15rem]"><Clip name="detail-morph" label="The platform card reshaping into the train card" /></div>],
            ['Colour is never alone', 'Switch the simulation: every line keeps its shape and letter.', <ColourBlind key="v" />],
            ['It reads from across the hall', 'Drag the distance: names fade first, the number and arrow last.', <Distance key="v" />],
          ].map(([t, d, v]) => (
            <div key={t}>
              {v}
              <p className="text-ink mt-5">{t}</p>
              <p className="mt-1" style={{ fontSize: '0.95rem' }}>{d}</p>
            </div>
          ))}
        </div>
        <div className="track-wide mt-24 grid items-center gap-10 sm:grid-cols-[1fr_1.2fr]">
          <img src={`${W}/saathi-entrance.svg`} alt="Saathi waving beside a metro entrance" className="block w-full" />
          <div>
            <p className="text-ink">A person, not a robot</p>
            <p className="mt-1" style={{ fontSize: '0.95rem' }}>People trust asking someone, so the guide is a person. He waves once, then waits.</p>
          </div>
        </div>
      </Section>

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
        <p className="headline" style={{ lineHeight: 1.2 }}>One module, two scripts, a mark for every line, and every text colour measured against AA. A rider who knows only where they’re going can still find the platform.</p>
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
