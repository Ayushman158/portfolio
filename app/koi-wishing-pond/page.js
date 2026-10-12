'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Back, Cards, Facts, Figure, Heading, Impact, Overview, Rule, Shots, Subhead, Tradeoffs } from '../components/case-study'

/*
 * Koi Wishing Pond, in the same shape as the other case studies. It used to
 * be a standalone horizontal-scroll page; the words and photos are the same,
 * the playable version lives at /koi-wishing-pond/pond.
 */

const A = '/koi-wishing-pond/assets/'
const FILM = 'https://www.youtube.com/watch?v=E0lpMtR87I0'
const PLAY = '/koi-wishing-pond/pond'

const OVERVIEW = [
  ['Context', 'An installation for a college exhibition at UPES, made with Eifa. I built the interactive pond; Eifa built the physical set around it.'],
  ['Problem', 'I wanted a physical experience that makes people stop for a moment, interact with something, and feel happy, with nothing to read first.'],
  ['Why it matters', 'People move through an exhibition quickly. If a piece needs explaining, most of them walk past it.'],
  ['What I did', 'A koi pond projected on the floor, built in TouchDesigner. Move your hand and the water ripples; close it around a wish and let go, and the koi gather round the coin. I also made the poster, the signs and the film.'],
]

const IMPACT = [
  ['1 day', 'at UPES, 8 October 2026, 11:00 to 17:00'],
  ['2 gestures', 'to learn: move your hand, then close and open it'],
  ['6 koi', 'each swimming on its own: curious, shy, or circling a wish'],
  ['Playable', 'the same pond runs in your browser, linked below'],
]

const FACTS = [
  ['Role', 'Interaction design, TouchDesigner build, hand tracking, poster, film'],
  ['Team', 'With Eifa, who built the set: pond, stones, grass, bench, lighting'],
  ['Shown', 'UPES, 8 October 2026'],
  ['Built with', 'TouchDesigner · MediaPipe · an iPhone · a projector'],
]

const STEPS = [
  ['Move', 'Move your hand over the water. Ripples follow it and the koi drift towards you.'],
  ['Hold', 'Close your hand around a wish and hold it for a moment. A coin starts to glow.'],
  ['Let go', 'Open your hand. The coin drops, the koi gather around it, and the pond answers: your wish has been heard.'],
]

const PEOPLE = [
  [A + 'kids_bench.jpg', 'Some sat and just watched.'],
  [A + 'visitor_kneel.jpg', 'Others knelt down to reach the koi.'],
  [A + 'hand_reach.jpg', 'A hand in the water.'],
  [A + 'visitor_stand.jpg', 'The pond is the only light in the room.'],
]

const PIPELINE = [
  ['Phone on the floor', 'An iPhone lies on the floor, its camera looking up at people’s hands.'],
  ['MediaPipe', 'Finds 21 points on each hand and tells an open hand from a fist.'],
  ['TouchDesigner', 'Turns the hand into ripples, the wish gesture, coins and koi. Coins stay for the rest of the day.'],
  ['Projector', 'Mounted overhead. The image is turned 180° and masked to the pond’s shape.'],
  ['The pond', 'Water, koi and sound respond in real time, under your hand.'],
]

// What I was up against, what I chose, and what that gave up.
const TRADEOFFS = [
  ['The sand-particle look I built first didn’t read well projected on a floor', 'Painted, anime-style water', 'The particle version was set aside'],
  ['The Kinect v2 wouldn’t run reliably on macOS', 'An iPhone on the floor, with MediaPipe hand tracking', 'It has to be recalibrated whenever it moves'],
  ['TouchDesigner’s free licence caps textures at 1280px', 'Repacked the koi to fit', 'Each fish has less detail up close'],
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
        <h1 className="display">Koi Wishing Pond: a pond that answers your hand</h1>
      </motion.header>
      <motion.div {...rise(0.08)}><Overview items={OVERVIEW} /></motion.div>
      <motion.div {...rise(0.1)}>
        <Impact items={IMPACT} note="We didn’t count visitors. People stayed, played and came back for another go, and many told us it was their favourite installation." />
      </motion.div>

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
        <Heading n="01">How you use it</Heading>
        <p className="mb-8">
          No buttons and nothing to read first. A small sign at the pond shows the only two gestures you
          need.
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
          <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>Recorded live from the projection.</figcaption>
        </figure>
        <div className="mt-10"><Cards items={STEPS} cols="sm:grid-cols-3" /></div>

        <Subhead>What the camera sees</Subhead>
        <div className="track-wide grid gap-4 sm:grid-cols-3">
          {[['hand_open.jpg', 'An open hand.'], ['hand_fist.jpg', 'A closed fist: the wish.'], ['int_gather.jpg', 'The koi gather round the coin.']].map(([src, cap]) => (
            <figure key={src}>
              <img src={A + src} alt={cap} loading="lazy" className="block h-auto w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
              <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>{cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Rule />

      <section>
        <Heading n="02">How people responded</Heading>
        <p className="mb-8">
          People came in and watched the fish. Some sat and just looked. Others started playing with the
          koi, and you could hear them go “wow!” Some came back to do it again. The faculty and senior
          management liked it, and a lot of people told us it was their favourite installation.
        </p>
        <Shots items={PEOPLE} cols="grid-cols-2 lg:grid-cols-4" />
      </section>

      <Rule />

      <section>
        <Heading n="03">Getting people there, and the space</Heading>
        <p className="mb-8">
          I designed the poster, plus signs and a trail of clues around college that led people to the
          room. There, we built a space around the projection: the pond, river stones, artificial grass,
          a bench, candle lanterns and music. The room was already dark, so the pond became its only real
          light.
        </p>
        <div className="track-wide grid items-start gap-4 sm:grid-cols-[1fr_2fr]">
          <figure>
            <img src={A + 'poster.jpg'} alt="The Koi Wishing Pond poster: two koi in a swirl of deep teal and a red sun on cream paper" loading="lazy" className="block h-auto w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
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
        <Heading n="04">How it’s built</Heading>
        <p className="mb-8">A camera on the floor, the light from above.</p>
        <Figure src={A + 'td_network.jpg'} alt="The TouchDesigner network on a laptop screen with the pond running" caption="The TouchDesigner network." track="track-wide" />
        <div className="track-wide mt-8"><Cards items={PIPELINE} cols="sm:grid-cols-2 lg:grid-cols-5" /></div>
      </section>

      <Rule />

      <section>
        <Heading n="05">Constraints and tradeoffs</Heading>
        <p className="mb-8">It went from a laptop to a table to the floor. Three decisions shaped it, and each gave something up.</p>
        <Tradeoffs items={TRADEOFFS} />
      </section>

      <Rule />

      <section>
        <Heading n="06">The film</Heading>
        <p className="mb-8">Real footage from the day first, then concept renders of where the pond could go next. I edited it and made the music.</p>
        <a href={FILM} target="_blank" rel="noopener noreferrer" className="track-wide group relative block overflow-hidden rounded-xl" style={{ border: '1px solid var(--rule)' }}>
          <img src={A + 'film_title.jpg'} alt="Opening frame of the film: KOI WISHING POND over a hand drifting above the glowing koi" loading="lazy" className="block h-auto w-full" />
          <span className="btn-primary absolute bottom-4 left-4">Watch on YouTube ↗</span>
        </a>
      </section>

      <Rule />

      <section>
        <Heading n="07">What I learned</Heading>
        <p>
          What stayed with me most was seeing something we made put a smile on people’s faces, even for a
          few minutes. It also showed me the kind of work I want to do: experiences that go beyond a
          screen, that people can walk into, touch and feel something through. Visuals, sound, technology
          and physical space together.
        </p>
      </section>

      <section className="mt-16">
        <p>
          <a href={PLAY} className="prose-link">Play the pond</a>. Back to{' '}
          <Link href="/#work" className="prose-link">the work index</Link>, or read{' '}
          <Link href="/signal" className="prose-link">Signal</Link> and{' '}
          <Link href="/kizuku" className="prose-link">Kizuku</Link>.
        </p>
      </section>
    </main>
  )
}
