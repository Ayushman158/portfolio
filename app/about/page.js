'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/*
 * About, in Ayushman's own words from a voice note, then the background that
 * used to be the résumé page, kept verbatim. The résumé itself comes back
 * later as a download; /resume redirects here until then.
 */

const ROLES = [
  {
    org: 'Dopamine Ventures',
    title: 'Manager, Product & Websites',
    dates: 'June 2024 → July 2025',
    points: [
      'Led UX and system design for early-stage products, focusing on clarity in flows, interactions, and scalable architecture',
      'Designed complex scheduling systems handling availability logic, conflicts, manual overrides, and edge cases',
      'Conducted user research and developed personas to guide experience and feature strategy',
      'Defined end-to-end journeys across onboarding, scheduling, and client engagement ecosystems',
      'Translated UX decisions into structured PRDs and aligned design, engineering, and business for build-ready execution',
    ],
  },
  {
    org: 'Ernst & Young',
    title: 'Cybersecurity Analyst',
    dates: 'July 2022 → Aug 2023',
    points: [
      'Performed SAST/DAST and VAPT on web and mobile applications, identifying critical usability-impacting security risks.',
      'Conducted API and web application testing, strengthening understanding of system behavior, edge cases, and failure states.',
      'Reviewed firewall and OS configurations, reinforcing a mindset of defensive design and risk-aware systems thinking.',
    ],
  },
]

const EDUCATION = [
  { school: 'UPES, Dehradun', dates: '2025 → mid 2027 (expected)', detail: 'M.des — Interaction Design' },
  { school: 'SMIT, Sikkim', dates: 'June 2022', detail: 'B.Tech — Computer Science Engineering' },
  { school: 'Sai RNS Academy', dates: 'June 2018', detail: 'Class XII, Higher Secondary, PCM' },
  { school: 'Sangam Academy', dates: 'June 2016', detail: 'Class X, SSC' },
]

/* The shelf: one book per job and degree, over the same records as the
   entries below, so a book and its entry can point at each other. */
const BOOKS = [
  { id: 'dop', spine: 'Dopamine Ventures', w: 28, h: 158, hue: 60, kind: 'role', ref: ROLES[0] },
  { id: 'ey', spine: 'Ernst & Young', w: 24, h: 138, hue: 150, kind: 'role', ref: ROLES[1] },
  { id: 'upes', spine: 'M.Des · UPES', w: 30, h: 150, hue: 250, kind: 'edu', ref: EDUCATION[0] },
  { id: 'smit', spine: 'B.Tech · SMIT', w: 26, h: 128, hue: 25, kind: 'edu', ref: EDUCATION[1] },
]
const bookColor = (hue) => `oklch(0.62 0.07 ${hue})`

const SKILLS = ['Figma', 'Antigravity', 'Illustrator', 'After Effects', 'UX Research', 'Usability Design', 'Design Thinking']

export default function About() {
  const reduceMotion = useReducedMotion()
  const [hover, setHover] = useState(null)
  const [selected, setSelected] = useState(null)
  const active = hover || selected

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <div className="track-wide flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <motion.div {...rise(0.06)} className="min-w-0 flex-1 space-y-5 [&>*]:max-w-[38rem]">
          <h1 className="display">About</h1>
          <p style={{ color: 'var(--ink)', fontSize: '1.1rem' }}>
            I’m Ayushman, a designer who likes figuring things out.
          </p>
          <p>
            I’m drawn to the space between people and technology: understanding how people think and
            feel, working within real-world constraints, and turning that into things that are useful,
            intuitive and visually considered.
          </p>
          <p>
            People tell me I’m calm, and I am. When something interests me I focus on it, a little
            obsessively. Outside design I’m fairly disciplined and I like working on myself. I care about
            my peace, my family, my dog, and staying curious about what’s going on around me.
          </p>
          <p>
            I care a lot about taste: in design, in music, in objects, in the choices people make. I want
            that to show up in my work without being pulled apart from function or purpose.
          </p>
          <p>
            My background is in technology, and it made me comfortable thinking past the interface: how
            things work, what’s technically possible, and how a design decision turns into something that
            can actually be built. I want to be a UX/UI designer or a design engineer who can take an idea
            from research and design all the way to development and shipping. Eventually I want a
            one-person studio, working closely with people, making things I believe in, and shipping
            products of my own.
          </p>
          <p className="text-[0.95rem]">
            <a href="mailto:ayushman15899@gmail.com" className="prose-link">ayushman15899@gmail.com</a>
            <span className="text-faint"> · </span>
            <a href="https://linkedin.com/in/ayushman-bharadwaj-660759289" target="_blank" rel="noopener noreferrer" className="prose-link">LinkedIn</a>
          </p>
        </motion.div>

        <motion.div {...rise(0.1)} className="flex-none">
          <Shelf active={active} setHover={setHover} selected={selected} setSelected={setSelected} />
        </motion.div>
      </div>

      {/* One entry per book. Hover either and the other three step back. */}
      <motion.section {...rise(0.14)} className="track-wide mt-20 grid gap-x-12 gap-y-10 lg:grid-cols-2" aria-label="Where I’ve worked and studied">
        {BOOKS.map((b) => {
          const r = b.ref
          const title = b.kind === 'role' ? `${r.org} — ${r.title}` : r.school
          const points = b.kind === 'role' ? r.points : [r.detail]
          return (
            <article
              key={b.id}
              onMouseEnter={() => setHover(b.id)}
              onMouseLeave={() => setHover(null)}
              className="transition-opacity duration-300"
              style={{ opacity: !active || active === b.id ? 1 : 0.35 }}
            >
              <h2 className="flex items-center gap-2.5 text-ink">
                <span aria-hidden="true" className="block h-2 w-2 flex-none rounded-[2px]" style={{ background: bookColor(b.hue) }} />
                {title}
              </h2>
              <p className="tnum text-faint mt-1 pl-[1.1rem] text-[0.9rem]">{r.dates}</p>
              <ul className="mt-2 space-y-1.5 pl-[1.1rem]">
                {points.map((pt, i) => (
                  <li key={i} className="text-[0.95rem]">{pt}</li>
                ))}
              </ul>
            </article>
          )
        })}
      </motion.section>

      <motion.p {...rise(0.16)} className="track-wide text-faint mt-10 text-[0.95rem]">
        Before that: {EDUCATION.slice(2).map((e) => `${e.school}, ${e.detail} (${e.dates})`).join(' · ')}
      </motion.p>

      <motion.section {...rise(0.2)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">Skills</h2>
        <p>{SKILLS.join(' · ')}</p>
      </motion.section>
    </main>
  )
}

/**
 * A small shelf of four books, one per job and degree. Hover lifts a book a
 * little; click (or Enter) takes it half out and keeps it there, and its entry
 * below stays lit. The lamp hangs beside it.
 */
function Shelf({ active, setHover, selected, setSelected }) {
  const pick = (id) => setSelected((cur) => (cur === id ? null : id))
  let x = 30
  return (
    <div data-lamp-target className="relative h-[250px] w-[260px]">
      <div className="shelf-wood absolute bottom-7 left-[22px] h-[52px] w-1.5 rounded-t-[1px]" />
      {BOOKS.map((b) => {
        const left = x
        x += b.w + 2
        const lift = selected === b.id ? -18 : active === b.id ? -6 : 0
        const label = b.kind === 'role' ? `${b.ref.org}, ${b.ref.dates}` : `${b.ref.school}, ${b.ref.detail}`
        return (
          <button
            key={b.id}
            type="button"
            aria-pressed={selected === b.id}
            aria-label={label}
            onClick={() => pick(b.id)}
            onMouseEnter={() => setHover(b.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(b.id)}
            onBlur={() => setHover(null)}
            className="book absolute bottom-7 flex items-center justify-center rounded-t-[2px] rounded-b-[1px]"
            style={{ left, width: b.w, height: b.h, background: bookColor(b.hue), transform: `translateY(${lift}px)` }}
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-[9px] h-0.5" style={{ background: 'rgba(255,240,200,.35)' }} />
            <span aria-hidden="true" className="absolute inset-x-0 top-[14px] h-px" style={{ background: 'rgba(255,240,200,.25)' }} />
            <span aria-hidden="true" className="absolute inset-x-0 bottom-3 h-0.5" style={{ background: 'rgba(255,240,200,.35)' }} />
            <span aria-hidden="true" className="book-spine">{b.spine}</span>
          </button>
        )
      })}
      <div className="shelf-wood shelf-board absolute bottom-5 left-2.5 h-2 w-[170px] rounded-[1px]" />
      <div className="shelf-wood absolute bottom-1.5 left-[30px] h-3.5 w-1" />
      <div className="shelf-wood absolute bottom-1.5 left-[156px] h-3.5 w-1" />
    </div>
  )
}
