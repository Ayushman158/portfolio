'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Facts, Figure, Heading, Impact, Overview, Subhead, Tradeoffs } from '../components/case-study'
import { Compare, Pair, W } from './wayfinding'
import { Clip, ColourBlind, Distance, KeyBuild, StepVideo, TryTheSign } from './demos'
import { Applications, Collage, GridSpec, LineTable, Principles, References, TypeSpecimen } from './system'

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
// Problem and impact first, then the work, then how I got there, then the limits.
const GROUPS = [
  ['Intro', [['overview', 'Overview'], ['problem', 'The problem'], ['result', 'The impact']]],
  ['The work', [['idea', 'The idea'], ['signs', 'The signs'], ['system', 'The ticket and QR board'], ['saathi', 'Saathi']]],
  ['How I got there', [['who', 'Who it’s for'], ['test', 'The sign test'], ['spec', 'The sign system'], ['details', 'Details']]],
  ['Wrap up', [['limits', 'Limits and next'], ['outcome', 'Outcome']]],
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
            Delhi Metro signs name each train by the last station on its line, so riders have to know the network to pick a platform. I redesigned the signs around the stations riders travel to, and added QR boards that open Saathi, a route finder, for riders who get lost in the station. I tested the signs with 84 riders.
          </p>
        </motion.header>

        <motion.div {...rise(0.12)}>
          <Collage />
        </motion.div>

        <Impact
          items={[
            ['80%', 'picked the right platform first try with the new signs', '45%'],
            ['56 of 66', 'riders whose score changed did better with the new sign'],
            ['10%', 'answered “Not sure”', '26%'],
            ['84', 'riders, on their own phones'],
          ]}
          note="Each rider saw today’s sign at one station and the redesign at the other, at random."
        />

        <Facts rows={[
          ['Role', 'Solo: research, sign design, prototype'],
          ['Context', 'M.Des Interaction Design, UPES'],
          ['Timeline', 'October to November 2026'],
          ['Built', 'Signs, a paper ticket, an entrance board and Saathi, a route finder'],
        ]} />

        <Overview items={[
          ['The problem', 'At the Kashmere Gate fork, the way to Lajpat Nagar is signed only “Towards Raja Nahar Singh”.'],
          ['Why it matters', 'The wrong platform means riding the wrong way and back, which happened on 2 of my own 6 rides.'],
          ['What I did', 'I put one key on every sign and ticket, and added QR boards that open a route finder for riders who are lost.'],
          ['Status', 'The signs were tested with 84 riders; the ticket, board and Saathi are live but not yet tested in a station.'],
        ]} />
      </section>

      {/* ---------- The problem ---------- */}
      <Section id="problem" n="01" title="The problem" lede="At Kashmere Gate, Lajpat Nagar is platform 5, but the sign names only the last station of each line. Try picking the platform.">
        <TryTheSign />
        <Pair className="mt-16" items={[
          ['kg-today', 'Kashmere Gate: each platform is named by its last station.', 'Kashmere Gate concourse sign today: platforms named by last stations, a middle panel of small print'],
          ['pink-today', 'Lajpat Nagar: the Pink Line is a ring, so a small − or + decides.', 'Lajpat Nagar Pink Line sign today: Pink Line Circular with a minus or plus for each direction'],
        ]} />
      </Section>

      {/* ---------- The impact ---------- */}
      <Section id="result" n="02" title="The impact" lede="In a phone test with 84 riders, almost twice as many picked the right platform with the new signs, most of all where their stop was on the sign.">
        <div className="mt-16">
          <Compare rows={[
            ['Right platform, first try', 45, 80],
            ['Stop printed on the new sign', 48, 91],
            ['Stop not printed', 39, 60],
          ]} />
        </div>
        <Note className="mt-8">84 of 120 riders finished all eight trips. Sign test p &lt; 0.001.</Note>
      </Section>

      {/* ---------- The idea ---------- */}
      <Section id="idea" n="03" title="The idea" lede="Every sign, ticket and screen shows the platform number, the line colour and two stations together, so remembering any one of them is enough.">
        <KeyBuild />
        <Figure className="mt-16" track="track-wide" src={`${W}/sign-art.jpg`} alt="The sign artwork: for each platform an arrow, the platform number in the line’s colour, the line name in Hindi and English, and two stations the train goes to" />
      </Section>

      {/* ---------- The signs ---------- */}
      <Section id="signs" n="04" title="The signs" lede="These are the two places from the problem, redesigned.">
        <Pair items={[
          ['kg-new', 'Kashmere Gate: one row per platform', 'The redesign at Kashmere Gate: each platform as a coloured number with two stations it goes to'],
          ['pink-new', 'Lajpat Nagar: stations instead of − and +', 'The redesign at Lajpat Nagar: platforms 3 and 4 with the stations each direction goes to'],
        ]} />

        <Part label="One key, four kinds of sign">
        <Pair className="mt-4" items={[
          ['render-fork-busy', 'Hanging, at the fork', 'Concept render of the hanging fork sign over a busy concourse'],
          ['sign-stair', 'At the top of the stairs', 'Concept render of the Pink Line stair-head sign with a pink band'],
          ['sign-totem', 'On the platform', 'Concept render of a platform totem: platform 5, Violet Line, and the next stops on a line'],
          ['sign-pillar', 'Wrapped round a pillar, for new stations', 'Concept render of a pillar wrapped with three platform bands'],
        ]} />
        <Note>Concept renders. The pillar wrap is an untested proposal for new stations.</Note>
        </Part>
      </Section>

      {/* ---------- Beyond the sign ---------- */}
      <Section id="system" n="05" title="The ticket and QR board" lede="The same key is on the paper ticket, and a QR board at the entrance opens Saathi for riders who get lost.">
        <div className="track-wide mt-10 grid items-start gap-4 sm:grid-cols-[1fr_2fr]">
          <figure className="mx-auto w-full max-w-[280px] sm:max-w-none">
            <img src={`${W}/ticket.jpg`} alt="The redesigned paper ticket: platform 5, Violet Line, Mandi House · Lajpat Nagar, printed in black on the existing thermal printer" loading="lazy" className="block w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>The same thermal printer, in black only.</figcaption>
          </figure>
          <figure>
            <img src={`${W}/saathi-04-entrance.jpg`} alt="The A3 entrance board beside the Saathi landing screen it opens" loading="lazy" className="block w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>Scan above ground; the route stays on the phone below.</figcaption>
          </figure>
        </div>
      </Section>

      {/* ---------- Demo: Saathi ---------- */}
      <Section id="saathi" n="06" title="Saathi, the route finder" lede="Saathi answers like a person would, one thing at a time: the platform, then the stop, then the gate.">
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

      {/* ---------- Who it's for ---------- */}
      <Section id="who" n="07" title="Who it’s for" lede="I designed for two riders: one who knows the place but not the station, and one with no smartphone.">
        <div className="mt-14 grid gap-x-10 gap-y-8 border-t border-rule pt-8 sm:grid-cols-2">
          {[['Neha', 'First time on this route. Has a phone. Knows the place, not the station.'], ['Mohan-ji', 'Uses his phone for calls, not maps. Trusts signs and staff.']].map(([n, d]) => (
            <div key={n}>
              <p className="font-serif text-ink" style={{ fontSize: '2rem', lineHeight: 1 }}>{n}</p>
              <p className="mt-3" style={{ fontSize: '0.98rem' }}>{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Demo: the sign test ---------- */}
      <Section id="test" n="08" title="The sign test" lede="On their own phones, each rider saw today’s sign at one station and the redesign at the other.">
        <div className="track-wide mt-16 grid gap-10 sm:grid-cols-2">
          {[['test-today', 'Today’s sign'], ['test-redesign', 'The redesign']].map(([name, title]) => (
            <div key={name}>
              <p className="text-ink mb-3">{title}</p>
              <StepVideo name={name} shape="land" label={`Sign test recording, ${title.toLowerCase()}`} />
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- The sign system ---------- */}
      <Section id="spec" n="09" title="The sign system" lede="The grid, type and colours are set once and used on every sign, ticket and screen.">
        <Principles />
        <Part label="One module, U = 50 mm"><GridSpec /></Part>
        <Part label="Two scripts at one size"><TypeSpecimen /></Part>
        <Part label="Colour identifies a line, and only that"><LineTable /></Part>
        <Part label="In place"><Applications /></Part>
      </Section>

      {/* ---------- Details ---------- */}
      <Section id="details" n="10" title="Details" lede="These small decisions keep it working underground, in a crowd, in Hindi and for colour-blind riders.">
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

      {/* ---------- Limits and next ---------- */}
      <Section id="limits" n="11" title="Limits and next" lede="What the test doesn’t prove yet, and what I chose to give up.">
        <ul className="mt-8 space-y-3">
          {[
            ['Mostly regular riders', '66 of the 84 ride weekly. The 18 occasional riders improved too (39% to 68%), but they are too few to prove it.'],
            ['A photo, not a busy hall', 'Riders answered from a photo; the next test is on site at Kashmere Gate.'],
            ['More to read', 'On the Pink Line, right answers took longer with the new sign (3.4 s against 2.1 s).'],
          ].map(([t, d]) => (
            <li key={t} className="border-t border-rule pt-3">
              <div className="text-ink">{t}</div>
              <div style={{ fontSize: '0.95rem' }}>{d}</div>
            </li>
          ))}
        </ul>
        <div className="mt-20">
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
