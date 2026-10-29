'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Facts, Figure, Heading, Impact, Overview, Subhead, Tradeoffs } from '../components/case-study'
import { Compare, Pair, Phones, W } from './wayfinding'

/*
 * Signal: finding the right platform on the Delhi Metro (iteration 5).
 * Delhi Metro signs name a train by its last station, so a rider going
 * somewhere in between has to know the network already. The redesign puts
 * the platform number, line colour and two real stations together, and was
 * tested on riders' phones. Results are the 56 riders who finished all eight
 * trips (Sheet read 28 Oct 2026). Iteration 4 lives on at /signal/v4.
 * Written for a recruiter's first pass: result first, then the problem, the
 * work as pictures, and honest limits. Colour lives only in the images.
 */
const STATIONS = [
  ['overview', 'Overview'], ['problem', 'The problem'], ['who', 'Who it’s for'], ['idea', 'The idea'],
  ['signs', 'The signs'], ['system', 'Beyond the sign'], ['result', 'The result'], ['limits', 'Limits and next'],
]
const IDS = STATIONS.map(([id]) => id)

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
      <ul className="space-y-0.5">
        {STATIONS.map(([id, name]) => {
          const on = id === active
          return (
            <li key={id}>
              <a href={`#${id}`} aria-current={on ? 'location' : undefined} className="block py-1.5 transition-colors duration-200" style={{ fontSize: '0.92rem', color: on ? 'var(--ink)' : 'var(--faint)' }}>
                {name}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Section({ id, n, title, lede, children }) {
  return (
    <section id={id} className="scroll-mt-24 pt-24">
      <Heading n={n}>{title}</Heading>
      {lede && <p className="text-ink" style={{ fontSize: '1.2rem', lineHeight: 1.5 }}>{lede}</p>}
      {children}
    </section>
  )
}

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
          <h1 className="display">Finding the right platform on the Delhi Metro</h1>
          <p className="text-ink" style={{ fontSize: '1.3rem', lineHeight: 1.45 }}>
            Delhi Metro signs name a train by its last station. I redesigned them around where riders actually go, and tested them with 56 riders.
          </p>
        </motion.header>

        <motion.div {...rise(0.12)}>
          <Figure className="mt-12" src={`${W}/sign-hang.jpg`} alt="Concept render of the redesigned Kashmere Gate sign: three rows, platforms 3, 5 and 4, each with an arrow, a coloured number, the line name and two stations" caption="The redesigned Kashmere Gate sign. Concept render; the artwork is the tested design." />
        </motion.div>

        <Impact
          items={[
            ['80%', 'picked the right platform first try with the new signs', '45%'],
            ['37 of 44', 'riders whose score changed did better with the new sign'],
            ['10%', 'answered “Not sure”', '26%'],
            ['56', 'riders, on their own phones'],
          ]}
          note="Each rider saw today’s sign at one station and the redesign at the other, at random."
        />

        <Facts rows={[
          ['Role', 'Solo: research, sign design, prototype'],
          ['Context', 'M.Des Interaction Design, UPES'],
          ['Timeline', 'October to November 2026'],
          ['Built', 'Signs, a ticket, a Lost? board, a route finder'],
        ]} />

        <Overview items={[
          ['The problem', 'A sign says “Towards Raja Nahar Singh”. The rider wants Lajpat Nagar. They have to know the network to pick a side.'],
          ['Why it matters', '2 of my 6 rides went the wrong way, and 3 of 5 occasional riders I asked get confused too. A wrong side means riding back.'],
          ['What I did', 'One key on every sign: the platform number, the line colour and two stations riders actually go to.'],
          ['Status', 'Signs tested with 56 riders. Ticket, board and route finder are built and live, not yet tested on site.'],
        ]} />
      </section>

      {/* ---------- The problem ---------- */}
      <Section id="problem" n="01" title="The problem" lede="At Kashmere Gate, Lajpat Nagar is platform 5. The sign doesn’t say so.">
        <Pair items={[
          ['kg-today', 'Kashmere Gate: every platform is named by its last station.', 'Kashmere Gate concourse sign today: platforms named by last stations, a middle panel of small print'],
          ['pink-today', 'Lajpat Nagar, Pink Line: a ring has no last station, so a small − or + decides.', 'Lajpat Nagar Pink Line sign today: Pink Line Circular with a minus or plus for each direction'],
        ]} />
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl sm:grid-cols-3" style={{ background: 'var(--rule)', border: '1px solid var(--rule)' }}>
          {[['2 of 6', 'of my own rides went the wrong way'], ['3 of 5', 'occasional riders I asked get confused about direction'], ['4', 'people on r/DelhiMetro raised it without being asked']].map(([v, t]) => (
            <div key={t} className="p-5" style={{ background: 'var(--ground)' }}>
              <p className="font-serif text-ink" style={{ fontSize: '2.4rem', lineHeight: 1 }}>{v}</p>
              <p className="text-faint mt-2" style={{ fontSize: '0.88rem' }}>{t}</p>
            </div>
          ))}
        </div>
        <Note>Field photos from Kashmere Gate, Lajpat Nagar and Rajiv Chowk, 25–26 October. I asked the five riders about direction directly, so the question may have led them.</Note>
      </Section>

      {/* ---------- Who it's for ---------- */}
      <Section id="who" n="02" title="Who it’s for" lede="Design for the first-time rider. Never leave out the one without a smartphone.">
        <div className="mt-8 grid gap-x-10 gap-y-6 border-t border-rule pt-6 sm:grid-cols-2">
          {[['Neha', 'First time on this route. Has a phone. Knows the place, not the station.'], ['Mohan-ji', 'Uses his phone for calls, not maps. Trusts signs and staff.']].map(([n, d]) => (
            <div key={n}>
              <p className="font-serif text-ink" style={{ fontSize: '2rem', lineHeight: 1 }}>{n}</p>
              <p className="mt-3" style={{ fontSize: '0.98rem' }}>{d}</p>
            </div>
          ))}
        </div>
        <p className="text-ink mt-8 border-l-2 pl-4" style={{ borderColor: 'var(--ink)' }}>The rule: every step has to work with no phone.</p>
      </Section>

      {/* ---------- The idea ---------- */}
      <Section id="idea" n="03" title="The idea" lede="Number, colour and name, always together. Remember any one, and the other two confirm it.">
        <Figure className="mt-10" track="track-wide" src={`${W}/sign-art.jpg`} alt="The sign artwork: for each platform an arrow, the platform number in the line’s colour, the line name in Hindi and English, and two stations the train goes to" />
        <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {[
            ['The platform number', 'In the line’s colour. It’s the one thing a rider can carry from the ticket to the train.'],
            ['Two real stations', 'Places riders go to, not where the line ends.'],
            ['Both scripts', 'Hindi above English, the same size.'],
            ['Never colour alone', 'Every line also has a shape, for colour-blind riders.'],
          ].map(([t, d]) => (
            <li key={t} className="border-t border-rule pt-3">
              <p className="text-ink">{t}</p>
              <p style={{ fontSize: '0.95rem' }}>{d}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- The signs ---------- */}
      <Section id="signs" n="04" title="The signs" lede="The same two spots as the photos above, redesigned.">
        <Pair items={[
          ['kg-new', 'Kashmere Gate: one row per platform', 'The redesign at Kashmere Gate: each platform as a coloured number with two stations it goes to'],
          ['pink-new', 'Lajpat Nagar: stations instead of − and +', 'The redesign at Lajpat Nagar: platforms 3 and 4 with the stations each direction goes to'],
        ]} />

        <Subhead>One key, four kinds of sign</Subhead>
        <Pair className="mt-4" items={[
          ['sign-hang', 'Hanging, at the fork', 'Concept render of the hanging fork sign'],
          ['sign-stair', 'At the top of the stairs', 'Concept render of the Pink Line stair-head sign with a pink band'],
          ['sign-totem', 'On the platform', 'Concept render of a platform totem: platform 5, Violet Line, and the next stops on a line'],
          ['sign-pillar', 'Wrapped round a pillar, for new stations', 'Concept render of a pillar wrapped with three platform bands'],
        ]} />
        <Note>Concept renders. The sign artwork is the real design; the pillar wrap is a proposal for new stations and isn’t tested.</Note>
      </Section>

      {/* ---------- Beyond the sign ---------- */}
      <Section id="system" n="05" title="Beyond the sign" lede="The same key on the ticket, on a board at the entrance, and on the phone.">
        <div className="track-wide mt-10 grid items-start gap-4 sm:grid-cols-[1fr_2fr]">
          <figure className="mx-auto w-full max-w-[280px] sm:max-w-none">
            <img src={`${W}/ticket.jpg`} alt="The redesigned paper ticket: platform 5, Violet Line, Mandi House · Lajpat Nagar, printed in black on the existing thermal printer" loading="lazy" className="block w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>The ticket prints your platform. Same printer, black only.</figcaption>
          </figure>
          <figure>
            <img src={`${W}/scan.jpg`} alt="Concept render: a rider scans the Lost? board at a station entrance; her phone shows where to go" loading="lazy" className="block w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>The Lost? board, at the entrance where there’s signal. Scan it, plan the trip, and the route stays on the phone underground. Concept render.</figcaption>
          </figure>
        </div>

        <Subhead>The route finder</Subhead>
        <p style={{ fontSize: '0.98rem' }}>It answers in the station’s own words, then stops. It gives directions, not a ride-along.</p>
        <div className="mt-8">
          <Phones items={[
            ['go-where', 'Where to?', 'Type a place, or say it', 'Where are you going? Search with station and place results'],
            ['go-platform', 'Platform first', 'Then which way the train goes', 'Platform 5, Violet Line, and a line map towards Raja Nahar Singh'],
            ['go-change', 'Changes', 'Each one with its platform', 'A trip with a change at Lajpat Nagar to Pink Line platform 3'],
            ['go-exit', 'The exit', 'Nearest gate, then the walk', 'Exit gate 5 and an 8-minute walk to the market'],
          ]} />
        </div>
        <p className="mt-8" style={{ fontSize: '0.95rem' }}>
          Live at <a className="prose-link" href="https://signal-wayfinding.vercel.app/go/kashmere-gate" target="_blank" rel="noreferrer">signal-wayfinding.vercel.app</a>. No app, no login.
        </p>
      </Section>

      {/* ---------- The result ---------- */}
      <Section id="result" n="06" title="The result" lede="Almost twice as many riders picked the right platform. The gain is biggest where the rider’s stop is printed on the sign.">
        <div className="mt-10">
          <Compare rows={[
            ['Right platform, first try', 45, 80],
            ['Stop printed on the new sign', 48, 90],
            ['Stop not printed', 40, 60],
          ]} />
        </div>
        <Note className="mt-6">56 of 79 riders finished all eight trips. Sign test p &lt; 0.001. On the Pink Line, riders who got it right were slower with the new sign (3.4 s against 2.0 s): there’s more to read.</Note>
      </Section>

      {/* ---------- Limits and next ---------- */}
      <Section id="limits" n="07" title="Limits and next" lede="What the test doesn’t prove yet, and the trade-offs I chose.">
        <ul className="mt-8 space-y-3">
          {[
            ['Mostly regular riders', '43 of the 56 ride weekly. The 13 occasional riders went from 37% to 63% right: the same direction, too few to prove it.'],
            ['A photo, not a busy hall', 'Riders chose from a photo on their phone, with no map. Next is the real thing, on site at Kashmere Gate and Lajpat Nagar.'],
          ].map(([t, d]) => (
            <li key={t} className="border-t border-rule pt-3">
              <div className="text-ink">{t}</div>
              <div style={{ fontSize: '0.95rem' }}>{d}</div>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <Tradeoffs items={[
            ['Signs have to fit today’s frames', 'One row per platform, inside the existing panel', 'No room for maps or long station lists'],
            ['Some riders have no smartphone', 'Every step works on signs and the ticket alone', 'The phone can only add, never fix a bad sign'],
            ['No signal underground', 'Plan at the entrance; the route saves on the phone', 'It needs one scan above ground'],
          ]} />
        </div>
      </Section>

      <footer className="mt-20 space-y-3 border-t border-rule pt-6 text-faint" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
        <p>This is the fifth idea in the project. The fourth is written up too: <a className="prose-link" href="/signal/v4">when to stop waiting during a delay</a>.</p>
        <p>Network data from OpenStreetMap; only Kashmere Gate and Lajpat Nagar are checked on site. A student proposal, not made with or for DMRC.</p>
      </footer>
    </main>
  )
}
