'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Cards, Facts, Figure, Heading, Overview, Rule, Shots, Tradeoffs } from '../components/case-study'

/*
 * Koi Wishing Pond. The words are Ayushman's, from his reflection on the
 * exhibition, lightly edited. Nothing here is measured, so nothing is
 * presented as a number: what happened on the day is said in his words.
 */

const A = '/koi-wishing-pond/assets/'
const FILM = 'https://www.youtube.com/watch?v=E0lpMtR87I0'
const PLAY = '/koi-wishing-pond/pond'

const OVERVIEW = [
  ['Context', 'An exhibition at UPES on 8 October 2026. I made it with Eifa: I built the pond, she built the set around it.'],
  ['What I wanted', 'A physical experience. Something that makes people stop for a moment, interact with something, and feel happy.'],
  ['What I made', 'A koi pond projected on the floor. Move your hand and the water ripples. Close your hand around a wish, let go, and the koi come to the coin.'],
  ['My part', 'The TouchDesigner build and the hand tracking, the poster, the signs and clues around college, and the film.'],
]

const FACTS = [
  ['Team', 'Me and Eifa'],
  ['Shown', 'UPES, 8 October 2026'],
  ['Built with', 'TouchDesigner · MediaPipe · an iPhone · a projector'],
]

const STEPS = [
  ['Move', 'Move your hand over the water. The ripples follow it and the koi swim over.'],
  ['Hold', 'Close your hand around a wish and hold it. A coin starts to glow.'],
  ['Let go', 'Open your hand. The coin drops and the koi gather round it.'],
]

const PEOPLE = [
  [A + 'kids_bench.jpg', 'Some sat and just watched.'],
  [A + 'visitor_kneel.jpg', 'Some got down close to the koi.'],
  [A + 'hand_reach.jpg', 'A hand in the water.'],
  [A + 'visitor_stand.jpg', 'The pond was the only light in the room.'],
]

// What I was up against, what I chose, and what that gave up.
const TRADEOFFS = [
  ['My first version, made of sand-like particles, didn’t read well on a floor', 'Painted, anime-style water', 'I set the particle version aside'],
  ['The Kinect wouldn’t run reliably on my Mac', 'An iPhone lying on the floor, with MediaPipe hand tracking', 'It has to be recalibrated every time it moves'],
  ['The free TouchDesigner licence caps images at 1280px', 'I repacked the koi artwork to fit', 'Each fish has less detail up close'],
]

export default function KoiWishingPond() {
  const reduceMotion = useReducedMotion()
  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <motion.div {...rise(0)}><Back /></motion.div>

      <motion.header {...rise(0.06)} className="mt-10 space-y-5">
        <p className="text-faint" style={{ fontSize: '0.95rem' }}>Koi Wishing Pond · 2026 · Interactive installation</p>
        <h1 className="display">Koi Wishing Pond: a pond you can touch</h1>
      </motion.header>
      <motion.div {...rise(0.08)}><Overview items={OVERVIEW} /></motion.div>

      <motion.p {...rise(0.1)} className="mt-10 border-l-2 pl-4" style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}>
        On the day, people stayed, played and came back for another go. A lot of them told us it was
        their favourite installation.
      </motion.p>

      {/* Not faded in: the card on the index grows into this image. */}
      <figure data-case-hero className="track-full mt-12 overflow-hidden rounded-xl" style={{ border: '1px solid var(--rule)' }}>
        <img src={A + 'cover_pond.jpg'} alt="The koi pond glowing blue on a dark floor at UPES, a candle lantern at its edge" width={1800} height={1013} className="block h-auto w-full" />
      </figure>

      <motion.div {...rise(0.12)}><Facts rows={FACTS} /></motion.div>
      <motion.div {...rise(0.14)} className="mt-8 flex flex-wrap items-center gap-3">
        <a href={PLAY} className="btn-primary">Play the pond in your browser</a>
        <a href={FILM} target="_blank" rel="noopener noreferrer" className="btn-quiet">Watch the film ↗</a>
      </motion.div>

      <Rule />

      <section>
        <Heading n="01">How it works</Heading>
        <p className="mb-8">
          No buttons and nothing to read. A small sign at the pond showed the two gestures, and that
          was enough.
        </p>
        <figure className="track-wide">
          <video
            src={A + 'pond_loop.mp4'}
            poster={A + 'pond_loop_poster.jpg'}
            muted loop playsInline autoPlay={!reduceMotion} preload="metadata"
            aria-label="The pond reacting to a hand: ripples, a closed fist, then the coin drops"
            className="block w-full rounded-xl"
            style={{ border: '1px solid var(--rule)', aspectRatio: '16 / 9', background: '#000' }}
          />
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>Recorded from the projection.</figcaption>
        </figure>
        <div className="mt-10"><Cards items={STEPS} cols="sm:grid-cols-3" /></div>
      </section>

      <Rule />

      <section>
        <Heading n="02">On the day</Heading>
        <p className="mb-8">
          People came in and watched the fish. Some sat and just looked. Others started playing with
          the koi, and you could hear them go “wow!” Some came back to do it again.
        </p>
        <Shots items={PEOPLE} cols="grid-cols-2 lg:grid-cols-4" />
      </section>

      <Rule />

      <section>
        <Heading n="03">Before the room, and the room</Heading>
        <p className="mb-8">
          The experience started much before people entered the room. I made a poster, signs and a
          trail of clues around college that led people there. Inside, Eifa built the pond’s edge with
          river stones, grass, a bench and candle lanterns, with music playing. The room was dark, so
          the pond was the only real light.
        </p>
        <div className="track-wide grid items-start gap-4 sm:grid-cols-[1fr_2fr]">
          <figure>
            <img src={A + 'poster.jpg'} alt="The Koi Wishing Pond poster: two koi in a swirl of deep teal and red on cream paper" loading="lazy" className="block h-auto w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>The poster.</figcaption>
          </figure>
          <figure>
            <img src={A + 'room_wide.jpg'} alt="The whole pond glowing in the dark room, the Make a Wish sign at its head" loading="lazy" className="block h-auto w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
            <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>The pond, with the sign at its head.</figcaption>
          </figure>
        </div>
      </section>

      <Rule />

      <section>
        <Heading n="04">How I built it</Heading>
        <p className="mb-8">
          An iPhone lies on the floor with its camera looking up. MediaPipe finds the hands and tells
          an open hand from a fist. TouchDesigner turns that into ripples, coins and koi, and a
          projector above puts it all on the floor.
        </p>
        <Figure src={A + 'td_network.jpg'} alt="The TouchDesigner network on a laptop screen with the pond running" caption="The TouchDesigner network." track="track-wide" />
        <div className="mt-12"><Tradeoffs items={TRADEOFFS} /></div>
      </section>

      <Rule />

      <section>
        <Heading n="05">What I learned</Heading>
        <p>
          What stayed with me most was seeing something we made put a smile on people’s faces, even
          for a few minutes. It also showed me the kind of work I want to do: experiences that go
          beyond a screen, that people can walk into, touch and feel something through. Visuals,
          sound, technology and space together.
        </p>
      </section>

      <section className="mt-16">
        <p>
          <a href={PLAY} className="prose-link">Play the pond</a> or{' '}
          <a href={FILM} target="_blank" rel="noopener noreferrer" className="prose-link">watch the film</a>. Back to{' '}
          <Link href="/#work" className="prose-link">the work index</Link>.
        </p>
      </section>
    </main>
  )
}
