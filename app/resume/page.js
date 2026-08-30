'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'

// Content preserved verbatim from the previous resume page.
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
  { school: 'UPES, Dehradun', dates: 'June 2024 → July 2025', detail: 'M.des — Interaction Design' },
  { school: 'SMIT, Sikkim', dates: 'June 2022', detail: 'B.Tech — Computer Science Engineering' },
  { school: 'Sai RNS Academy', dates: 'June 2018', detail: 'Class XII, Higher Secondary, PCM' },
  { school: 'Sangam Academy', dates: 'June 2016', detail: 'Class X, SSC' },
]

const SKILLS = ['Figma', 'Antigravity', 'Illustrator', 'After Effects', 'UX Research', 'Usability Design', 'Design Thinking']

export default function Resume() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-40 pt-20 sm:pt-28">
      <motion.div {...rise(0)}>
        <Image
          src="/assets/resume-photo.jpg"
          alt="Ayushman Bharadwaj"
          width={1024}
          height={1024}
          sizes="72px"
          priority
          className="mb-10 h-[72px] w-[72px] rounded-full border border-rule object-cover"
        />
      </motion.div>

      <motion.div {...rise(0.06)} className="space-y-5">
        <h1 className="text-faint text-[0.95rem]">Resume</h1>
        <p>
          <span className="text-ink font-medium">Ayushman Bharadwaj</span> — UX/UI designer. I turn
          complex problems into clear, build-ready systems, and align design, tech and business
          around what matters most: the user.
        </p>
        <p className="text-[0.95rem]">
          <a href="tel:+917002400184" className="prose-link">+91 7002400184</a>
          <span className="text-faint"> · </span>
          <a href="mailto:ayushman15899@gmail.com" className="prose-link">ayushman15899@gmail.com</a>
          <span className="text-faint"> · </span>
          <a href="https://linkedin.com/in/ayushman-bharadwaj-660759289" target="_blank" rel="noopener noreferrer" className="prose-link">LinkedIn</a>
        </p>
      </motion.div>

      <motion.section {...rise(0.12)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-2">Experience</h2>
        <div className="border-t border-rule">
          {ROLES.map((r) => (
            <article key={r.org} className="border-b border-rule py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-ink font-medium">
                  {r.org} <span className="text-muted font-normal">— {r.title}</span>
                </h3>
                <span className="tnum text-faint text-[0.9rem]">{r.dates}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {r.points.map((p, i) => (
                  <li key={i} className="grid grid-cols-[1.25rem_1fr]">
                    <span aria-hidden="true" className="text-faint">—</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section {...rise(0.16)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-2">Education</h2>
        <ul className="border-t border-rule">
          {EDUCATION.map((e) => (
            <li key={e.school} className="border-b border-rule py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="text-ink font-medium">{e.school}</span>
                <span className="tnum text-faint text-[0.9rem]">{e.dates}</span>
              </div>
              <p className="text-[0.95rem]">{e.detail}</p>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section {...rise(0.2)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">Skills</h2>
        <p>{SKILLS.join(' · ')}</p>
      </motion.section>
    </main>
  )
}
