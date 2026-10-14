'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Room } from './room'
import { Back, Cards, Decisions, Facts, Figure, Heading, Overview, Rule, Shots, Tradeoffs } from '../components/case-study'

/*
 * Koi Wishing Pond. The words are Ayushman's, from his reflection on the
 * exhibition, lightly edited. Nothing here is measured, so nothing is
 * presented as a number: what happened on the day is said in his words.
 */

const A = '/koi-wishing-pond/assets/'
const FILM = 'https://www.youtube.com/watch?v=E0lpMtR87I0'

const OVERVIEW = [
  ['Context', 'An exhibition at UPES on 8 October 2026. I made it with Eifa: I built the pond, she built the set around it.'],
  ['What I wanted', 'I wanted to make something with sound; Eifa wanted something about health and a meditative space. We put them together: a zen space where people stop for a moment, play with something, and leave calmer.'],
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

// Why it works the way it does. His reasons, in his words.
const WHY = [
  ['On the floor, because that’s where a pond is', 'A pond can’t be on a wall or a table. I wanted it to feel as real as a pond, so it went on the floor, with a bench beside it so people could sit. One of the faculty came in and just watched the fish move. He found it really relaxing.'],
  ['A coin, not just water', 'Playing with the water is nice, but it isn’t much to do. Tossing a coin gives people one more thing to do, the way a wishing well does.'],
  ['Hold for three seconds, then let go', 'In the build, a fist held for 0.7 seconds was enough. For the installation I made it three. You hold on to your wish so it feels real, then you let it go, so making a wish is intentional. A longer, steadier fist is also easier for the camera to pick up.'],
  ['The coins stay for the day', 'They don’t disappear. The next person sees coins in the water, asks what they are, and finds out they can make a wish too. The coins teach the interaction, and show that other people have been here.'],
  ['A dark corner, a breeze, quiet music', 'The room is dark, like a studio, so we chose a corner to make it more immersive. The AC and the fan sent a breeze across the pond, so it was something you felt as well as saw. The music is soft and ambient, so it never pulls attention away from the pond.'],
]

const GESTURE = [
  [A + 'hand_fist.jpg', 'Hold on to your wish.'],
  [A + 'hand_open.jpg', 'Then let it go.'],
]

const PROTOTYPES = [
  [A + 'proto_1.jpg', 'The first tests ran on a table.'],
  [A + 'proto_2.jpg', 'Koi, coins and lily pads, before the floor.'],
]

const LOOKS = [
  [A + 'mood_anime.jpg', 'Painted, on blue water. This is the one on the floor.'],
  [A + 'mood_ink.jpg', 'Ink, on black.'],
]

const TRAIL = [
  [A + 'clue_poster.jpg', 'A clue: “A wish is waiting below.”'],
  [A + 'sign_wall.jpg', 'Arrows to the room.'],
  [A + 'lab_door.jpg', 'The door.'],
]

const PEOPLE = [
  [A + 'kids_bench.jpg', 'Some sat and just watched.'],
  [A + 'visitor_kneel.jpg', 'Some got down close to the koi.'],
  [A + 'hand_reach.jpg', 'A hand in the water.'],
  [A + 'visitor_stand.jpg', 'The pond was the only light in the room.'],
]

// Visitors wrote in a feedback book at the pond. Their words, spelling tidied.
const CARDS = [
  [A + 'feedback_1.jpg', '“The best of all. Hella fun, 100/10!”'],
  [A + 'feedback_2.jpg', '“It’s a wonderful experience. It’s so cool.”'],
  [A + 'feedback_3.jpg', '“Really cute and interactive, very soothing.”'],
]

// What I saw on the day, and what each one tells me to change.
const NOTICED = [
  ['People wanted to touch the water', 'They hovered their hands above the pond, and many tried to touch the floor itself. A depth sensor like the Kinect could have allowed that, but it would not run properly on my MacBook. Next time: a depth camera on a machine that supports it.'],
  ['The camera’s range was invisible', 'The tracking came from a phone on the floor, so I had to tell people where the camera was and where their hand would work. A marked area on the floor would tell them without me.'],
  ['The gesture could be found without help', 'One visitor, curious about the space, worked out the fist and the coin toss on his own before I explained anything.'],
  ['What visitors asked for', 'A brighter glow under the hand, so it is easier to follow. Movements with fingertips, not only the whole hand. Lily pads that react when you touch them. More depth and perspective in the pond.'],
]

// What I was up against, what I chose, and what that gave up.
const TRADEOFFS = [
  ['The camera needs a clear, steady fist to see a wish', 'A three-second hold before the coin drops', 'It takes a moment longer, and the first try often needs showing'],
  ['The Kinect wouldn’t run reliably on my Mac', 'An iPhone lying on the floor, with MediaPipe hand tracking', 'It has to be recalibrated every time it moves'],
  ['The free TouchDesigner licence caps images at 1280px', 'I repacked the koi artwork to fit', 'Each fish has less detail up close'],
]

/*
 * The pond itself is the first thing on the page, already running, the way the
 * room was: you walked in and the water was moving. It is the browser port in
 * an iframe (?embed drops its intro card). Your first wish there is answered
 * with "Your wish has been heard." and the page then carries you into the
 * story. Off screen, the pond stops drawing on its own. Reduced motion gets the photo.
 */
function PondHero({ reduceMotion, box }) {
  const frame = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (reduceMotion) return
    const f = frame.current
    // Fade the pond in once it has loaded (it may already have, before this page finished starting).
    const show = () => setTimeout(() => setLive(true), 300)
    if (f?.contentDocument?.readyState === 'complete' && f.contentWindow?.location.href !== 'about:blank') show()
    else f?.addEventListener('load', show, { once: true })
    // The first wish: let the line rise above the water, then go down into the story.
    let carry = 0
    const onMsg = (e) => {
      if (e.origin !== location.origin || e.source !== f?.contentWindow) return
      if (e.data?.type === 'koi-wish' && e.data.n === 1) {
        carry = setTimeout(() => {
          const story = document.getElementById('story')
          if (story && window.scrollY < box.current.offsetHeight * 0.5) story.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 5000)
      }
    }
    addEventListener('message', onMsg)
    return () => { f?.removeEventListener('load', show); removeEventListener('message', onMsg); clearTimeout(carry) }
  }, [reduceMotion])

  return (
    <section ref={box} data-case-hero className="relative z-[1] flex w-full flex-col overflow-hidden bg-black" style={{ height: 'clamp(34rem, 94svh, 64rem)' }}>
      {/* The words sit above the water, centred like the sign at the head of the pond. */}
      <header className="px-6 pt-20 text-center sm:pt-24" style={{ color: '#EEF3F8' }}>
        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Koi Wishing Pond · 2026 · Interactive installation</p>
        <h1 className="mt-1 font-serif" style={{ fontSize: 'clamp(2.4rem, 1.8rem + 2.6vw, 4.2rem)', lineHeight: 1.04, letterSpacing: '-0.012em' }}>Koi Wishing Pond</h1>
        <p className="mx-auto mt-2 max-w-[30rem]" style={{ fontSize: '1rem', lineHeight: 1.5, color: '#B9C6D2' }}>
          {reduceMotion ? 'An interactive koi pond, projected on the floor.' : 'Move over the water. Hold, then let go, to make a wish.'}
        </p>
      </header>
      <div className="relative min-h-0 flex-1">
        <img src={A + 'cover_pond.jpg'} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: live ? 0 : 0.8, transition: 'opacity 900ms ease' }} />
        {!reduceMotion && (
          <iframe
            ref={frame}
            src="/koi-wishing-pond/pond?embed"
            title="Koi Wishing Pond, live. Move over the water to make ripples; press and hold, then let go, to make a wish."
            allow="camera; autoplay"
            className="absolute inset-0 h-full w-full border-0"
            style={{ opacity: live ? 1 : 0, transition: 'opacity 900ms ease' }}
          />
        )}
        <a href="#story" className="absolute bottom-3 left-5 rounded-full px-4 py-2 text-[0.9rem] sm:left-8" style={{ color: '#EEF3F8', background: 'rgba(10,16,24,.55)', border: '1px solid rgba(255,255,255,.14)' }}>
          The story ↓
        </a>
      </div>
    </section>
  )
}

export default function KoiWishingPond() {
  const reduceMotion = useReducedMotion()
  const hero = useRef(null)
  const column = useRef(null)
  const rise = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <>
    <Room column={column} hero={hero} reduceMotion={reduceMotion} />
    <PondHero reduceMotion={reduceMotion} box={hero} />
    <main ref={column} id="story" className="relative z-[1] measure min-h-screen pb-28 pt-16 sm:pt-20" style={{ scrollMarginTop: '0px' }}>
      <motion.div {...rise(0)}><Back /></motion.div>

      <motion.div {...rise(0.08)}><Overview items={OVERVIEW} /></motion.div>

      <motion.p {...rise(0.1)} className="mt-10 border-l-2 pl-4" style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}>
        On the day, people stayed, played and came back for another go. A lot of them told us it was
        their favourite installation.
      </motion.p>

      <motion.div {...rise(0.12)}><Facts rows={FACTS} /></motion.div>
      <motion.div {...rise(0.14)} className="mt-8 flex flex-wrap items-center gap-3">
        <a href={FILM} target="_blank" rel="noopener noreferrer" className="btn-quiet">Watch the film ↗</a>
      </motion.div>

      <Rule />

      <section>
        <Heading n="01">Where the idea came from</Heading>
        <div className="space-y-5">
          <p>
            It started as two ideas. I wanted to make something with sound. Eifa, my partner on this,
            wanted to build something about health and a meditative space. We put them together, and I
            suggested a zen experience.
          </p>
          <p>
            The koi came from my feed. I had been watching people make water in TouchDesigner on YouTube
            and Instagram, and then I saw a reel where someone had made a wishing well. I wanted to build
            an experience like that, and make it better with koi.
          </p>
          <p>
            It is personal too. Where I come from, in Assam, there are ponds everywhere, and I like
            sitting by a river or a pond to switch off. I wanted people to be able to do that indoors.
          </p>
          <p>
            I didn’t make it for one age group. I pictured an office: people under stress walk into this
            room, sit by the pond, watch the fish and let their minds settle. At college, that meant
            faculty and students.
          </p>
        </div>
      </section>

      <Rule />

      <section>
        <Heading n="02">How it works</Heading>
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
        <Heading n="03">Why it works this way</Heading>
        <p className="mb-8">Every part of the interaction has a reason behind it.</p>
        <Shots items={GESTURE} cols="grid-cols-2" />
        <Decisions items={WHY} />
      </section>

      <Rule />

      <section>
        <Heading n="04">From a table to the floor</Heading>
        <p className="mb-8">
          I tested it before the exhibition: in class with Eifa, with my friends and with my teacher.
          The first version ran on a table, where I could try the koi, the coins and the lily pads.
        </p>
        {/* Portrait phone photos: kept to the text column so they don't tower over the page. */}
        <div className="grid grid-cols-2 gap-4">
          {PROTOTYPES.map(([src, caption]) => (
            <figure key={src}>
              <img src={src} alt={caption} loading="lazy" className="block h-auto w-full rounded-xl" style={{ border: '1px solid var(--rule)' }} />
              <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem' }}>{caption}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mb-8 mt-12">I tried two looks for the koi and the lily pads.</p>
        <Shots items={LOOKS} cols="grid-cols-1 sm:grid-cols-2" />
        <div className="mt-12">
          <Figure
            src={A + 'room_plan.jpg'}
            alt="Floor plan of a zen room: the pond in the middle, a bamboo corner, a leaf path from the entrance, a zen garden wall and meditation cushions"
            caption="The first plan was a whole zen room: a bamboo corner with a shishi-odoshi, a leaf path, a raked-sand wall that ripples when a wish is made, and cushions facing it. On the day, we built the pond and its edge in one corner."
            track="track-wide"
          />
        </div>
        <p className="mt-10">
          Testing also showed me something the exhibition confirmed. People put their hands right over
          the pond, not where the camera could see them. That is the first thing I would fix.
        </p>
      </section>

      <Rule />

      <section>
        <Heading n="05">Before the room, and the room</Heading>
        <p className="mb-8">
          The experience started much before people entered the room. I made a poster, signs and a
          trail of clues around college that led people there. Inside, Eifa built the pond’s edge with
          river stones, grass, a bench and candle lanterns, with music playing. The room was dark, so
          the pond was the only real light.
        </p>
        <div className="mb-10"><Shots items={TRAIL} cols="grid-cols-3" /></div>
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
        <Heading n="06">On the day</Heading>
        <p className="mb-8">
          People came in and watched the fish. Some sat and just looked. Others started playing with
          the koi, and you could hear them go “wow!” Some came back to do it again.
        </p>
        <Shots items={PEOPLE} cols="grid-cols-2 lg:grid-cols-4" />
      </section>

      <Rule />

      <section>
        <Heading n="07">How I built it</Heading>
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
        <Heading n="08">What people said, and what I’d change</Heading>
        <p className="mb-8">
          Visitors left notes in a feedback book at the pond. What they liked most was the space
          around the projection: the stones and pebbles, the leaves, the bench, the fan and the low
          light. That was the part we cared about most.
        </p>
        <Shots items={CARDS} cols="grid-cols-1 sm:grid-cols-3" />
        <Decisions items={NOTICED} />
      </section>

      <Rule />

      <section>
        <Heading n="09">What I learned</Heading>
        <p>
          What stayed with me most was seeing something we made put a smile on people’s faces, even
          for a few minutes. It also showed me the kind of work I want to do: experiences that go
          beyond a screen, that people can walk into, touch and feel something through. Visuals,
          sound, technology and space together.
        </p>
      </section>

      <section className="mt-16">
        <p>
          <a href={FILM} target="_blank" rel="noopener noreferrer" className="prose-link">Watch the film</a>, or go back to{' '}
          <Link href="/#work" className="prose-link">the work index</Link>.
        </p>
      </section>
    </main>
    </>
  )
}
