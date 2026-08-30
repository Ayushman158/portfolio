'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import TextHighlighter from './components/text-highlighter'
import Letter3DSwap from './components/letter-3d-swap'
import WorkIndex from './components/work-index'

const PROJECTS = [
  { name: 'Kizuku', year: '2026', href: '/kizuku', img: '/kizuku/screens/Today action.png', w: 393, h: 852 },
  { name: 'Hoychoy Cafe', year: '2025', href: '/case-study', img: '/assets/hoychoy-hero-new.png', w: 1200, h: 800 },
]

const PLAYGROUND = [
  { name: 'FieldNote', year: '2026', href: '/experiments', img: '/assets/fieldnote-ss.png', w: 1200, h: 675 },
]

// No case studies yet, so these carry no link and raise no preview.
const ALSO = [
  { name: 'Signal — motion identity', year: '2025' },
  { name: 'Madi Things — editorial site', year: '2025' },
  { name: 'KL Hi-Tech — marketing site', year: '2025' },
]

function Greeting() {
  const [hour, setHour] = useState(null)
  useEffect(() => setHour(new Date().getHours()), [])

  const part = hour == null ? 'hello' : hour < 12 ? 'good morning' : hour < 17 ? 'good afternoon' : 'good evening'
  // Assamese and Hindi: he is from North Lakhimpur, Assam.
  return (
    <p className="text-faint">
      {part}, <span lang="as">নমস্কাৰ</span>, <span lang="hi">नमस्ते</span>
    </p>
  )
}

export default function Home() {
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
          src="/assets/avatar.png"
          alt="Ayushman Bharadwaj"
          width={80}
          height={80}
          sizes="44px"
          priority
          className="mb-10 h-11 w-11 rounded-full border border-rule object-contain object-bottom"
        />
      </motion.div>

      <motion.div {...rise(0.06)} className="space-y-5">
        <Greeting />

        <p>
          I’m{' '}
          <Letter3DSwap
            mainClassName="text-ink font-medium align-baseline"
            rotateDirection="right"
          >
            Ayushman
          </Letter3DSwap>
          , an interaction designer who ships the code.
        </p>

        <p>
          A year in security engineering before design, so I build for how systems actually fail.
          Finishing an MA now, and <span className="text-ink">available for remote roles</span>.
        </p>

        <p>
          Recent work includes{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link>, a wellness app for people who
          overthink the future, and{' '}
          <Link href="/case-study" className="prose-link">Hoychoy Cafe</Link>, where a rebuilt
          ordering flow took customers from{' '}
          <TextHighlighter
            className="text-ink font-medium px-1 -mx-1 rounded-[2px]"
            highlightColor="hsl(48, 96%, 76%)"
            transition={{ type: 'spring', duration: 0.6, bounce: 0, delay: 0.5 }}
            inViewOptions={{ once: true, amount: 0.6 }}
          >
            6–8 minutes to 2–3
          </TextHighlighter>.
        </p>
      </motion.div>

      <motion.div {...rise(0.12)}>
        <WorkIndex label="Projects" items={PROJECTS} />
        <WorkIndex label="Playground" items={PLAYGROUND} />
        <WorkIndex label="Also shipped" items={ALSO} />
      </motion.div>

      <motion.section {...rise(0.18)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">Connect</h2>
        <p>
          I’m looking for remote design-engineering work. The fastest way to reach me is{' '}
          <a href="mailto:ayushman15899@gmail.com" className="prose-link">email</a>. I’m also on{' '}
          <a href="https://www.linkedin.com/in/ayushman-bharadwaj-660759289/" target="_blank" rel="noopener noreferrer" className="prose-link">LinkedIn</a>{' '}
          and <a href="https://x.com/AyushmanBharad" target="_blank" rel="noopener noreferrer" className="prose-link">X</a>.
        </p>
      </motion.section>
    </main>
  )
}
