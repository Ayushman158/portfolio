'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'

/*
 * A playground page, in the same shape as ALBUM//ALIVE: what it is, the real
 * thing, how it works, how to try it. The facts are from the game's own README
 * and the live build; the exhibition itself gets its own page once it opens.
 */

const LIVE = 'https://gone-or-still-alive.vercel.app/'
const SOURCE = 'https://github.com/Ayushman158/gone-or-still-alive'

export default function GoneOrStillHere() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28">
      <motion.div {...rise(0)} className="space-y-5">
        <h1 className="text-faint text-[0.95rem]">Gone or Still Here? · 2026</h1>
        <p>
          A webcam game for an exhibition about extinct animals, made for kids and young adults. An
          animal comes up on screen, and you answer by holding a printed card up to the camera:
          gone, or still here.
        </p>
        <p>
          The exhibition is built around extinct animals, but its point is the endangered ones. The
          game follows the same order the exhibition does: extinct, endangered, conserve.
        </p>
        <p>
          The exhibition is a group project. I built the game myself.
        </p>
        <p className="text-faint">
          The exhibition isn’t open yet. When it is, it gets its own page here.
        </p>
      </motion.div>

      <motion.figure {...rise(0.08)} className="track-wide mt-12">
        <img
          src="/gone/home.jpg"
          alt="The game's start screen: a woolly mammoth card labelled 'some are gone', a tiger card labelled 'but many are still here', and a Let's play button"
          width={1600}
          height={1000}
          className="block h-auto w-full rounded-xl"
          style={{ border: '1px solid var(--rule)' }}
        />
        <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
          The start screen: one animal we’ve lost, one we still have.
        </figcaption>
      </motion.figure>

      <motion.section {...rise(0.12)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">How it works</h2>
        <p>
          The camera reads the card with an image model trained in Google’s Teachable Machine: one
          class for each card, and one for nothing being held up.
        </p>
        <p className="mt-4">
          It only answers when it is at least 90% sure and the card has stayed steady for half a
          second. After an answer it waits for the card to be taken away, so one card can’t answer two
          questions. Kids never see a percentage. They see “let me see…”, then “got it!”, then “please
          remove card”, and the screen resets after 25 seconds without anyone playing, ready for the
          next visitor.
        </p>
        <p className="mt-4">
          A “gone” answer turns the animal into a thermal image with a fossil skeleton over it and an
          EXTINCT stamp. A “still here” answer gets a pulse, a glowing heart and a heartbeat line.
          Every sound is generated in the browser, with no audio files to load.
        </p>
      </motion.section>

      <motion.figure {...rise(0.14)} className="track-wide mt-12">
        <img
          src="/gone/how-to-play.jpg"
          alt="How to play, in three steps: see an animal, pick your card (gone or still here), show it to the camera"
          width={1600}
          height={1000}
          loading="lazy"
          className="block h-auto w-full rounded-xl"
          style={{ border: '1px solid var(--rule)' }}
        />
        <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
          Three steps: see the animal, pick your card, show it to the camera.
        </figcaption>
      </motion.figure>

      <motion.section {...rise(0.16)} className="mt-16">
        <h2 className="text-faint text-[0.95rem] mb-3">Try it</h2>
        <p>
          It is built for a kiosk with a webcam and the printed cards. Without them, press D for the
          organiser panel, then hold 1 for gone or 2 for still here.
        </p>
        <p className="mt-4">
          <a href={LIVE} target="_blank" rel="noopener noreferrer" className="prose-link">Play it</a>
          <span className="text-faint"> · </span>
          <a href={SOURCE} target="_blank" rel="noopener noreferrer" className="prose-link">Source on GitHub</a>
          <span className="text-faint"> · </span>
          <Link href="/" className="prose-link">Back to index</Link>
        </p>
      </motion.section>
    </main>
  )
}
