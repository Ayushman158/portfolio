'use client'

import { useState } from 'react'

/**
 * The real app, framed on the page.
 *
 * Not a rebuild: this is the Kizuku React Native code exported for the web
 * (`npm run build:portfolio` in the app repo) and served from /kizuku/live.
 * The hero above is the loop to watch; this is the loop to use.
 *
 * A reviewer will never reach day thirty on their own, so the moments open the
 * app where it is worth seeing. They use the app's own jump parameters, which
 * never write to storage — a visitor's own garden, if they start one, is
 * untouched by skipping around.
 *
 * Laid out the way the page's "underserved market" section is: the intro in
 * the reading measure, then the wide track with an index of rows on the left
 * and the figure on the right, both hung from the top.
 *
 * On a phone the frame would be an app scrolling inside a page scrolling
 * inside a phone, so there the rows open the app full screen, which on a
 * phone is simply the app.
 */

const APP = '/kizuku/live/index.html'

// the app was laid out for a 402x874 phone; it renders at that size and the
// frame scales it, so the garden's positions stay exactly as designed
const NATIVE = { w: 402, h: 874 }
const FRAME_W = 330
const SCALE = FRAME_W / NATIVE.w

const MOMENTS = [
  { id: 'start', label: 'from the start', note: 'the letter, the promises, three questions', query: '?s=welcome' },
  { id: 'ritual', label: 'the daily ritual', note: 'one worry in, one action out', query: '?p=optimizer&n=2&s=worry&name=Cedar' },
  { id: 'growth', label: 'a stage change', note: 'the tree moves up, stage 3 to 4', query: '?p=planner&n=7&s=growth&name=Juniper' },
  { id: 'day30', label: 'day thirty', note: 'fully grown, and a real plant', query: '?p=seeker&n=30&s=thirty&name=Willow' },
]

export default function LiveApp() {
  // null is the visitor's own app: the welcome letter the first time, their
  // garden if they come back
  const [moment, setMoment] = useState(null)
  const [load, setLoad] = useState(0)
  const query = MOMENTS.find((m) => m.id === moment)?.query ?? ''

  const open = (id) => {
    setMoment(id)
    setLoad((n) => n + 1) // the same moment twice replays it
  }

  return (
    <>
      <p>
        Not a mockup and not a rebuild: the same React Native code that runs on the phone, exported
        for the web. It starts at the welcome letter. The moments below go straight to places you would
        otherwise need weeks of use to reach.
      </p>

      <div className="track-wide mt-8 md:grid md:grid-cols-[1fr_330px] md:gap-12 lg:gap-16 md:items-start">
        <div>
          <ul className="m-0 p-0 list-none" aria-label="Open the app at">
            {MOMENTS.map((m) => {
              const active = moment === m.id
              const row = (
                <>
                  <span style={{ color: active ? 'var(--ink)' : undefined }}>
                    {active ? '→ ' : ''}
                    {m.label}
                  </span>
                  <span className="text-faint" style={{ fontSize: '0.9rem' }}>
                    {m.note}
                  </span>
                </>
              )
              return (
                <li key={m.id}>
                  {/* wide screens: load the moment into the frame */}
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => open(m.id)}
                    className="index-row hidden md:grid w-full text-left"
                    style={{ cursor: 'pointer', background: 'none' }}
                  >
                    {row}
                  </button>
                  {/* phones: open the moment full screen */}
                  <a href={APP + m.query} className="index-row md:hidden">
                    {row}
                  </a>
                </li>
              )
            })}
          </ul>

          <p className="text-faint mt-4" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
            Haptics and the keyboard belong to the phone; everything else is the same build.{' '}
            <a href={APP + query} target="_blank" rel="noopener noreferrer" className="prose-link">
              Open it full screen
            </a>
            .
          </p>
        </div>

        <div
          className="hidden md:block overflow-hidden"
          style={{
            width: FRAME_W,
            height: NATIVE.h * SCALE,
            borderRadius: 38,
            border: '1px solid var(--rule)',
            boxShadow: '0 24px 60px -30px rgba(0,0,0,0.35)',
          }}
        >
          <iframe
            key={load}
            src={APP + query}
            title="Kizuku, running live"
            loading="lazy"
            width={NATIVE.w}
            height={NATIVE.h}
            style={{ border: 0, display: 'block', transform: `scale(${SCALE})`, transformOrigin: '0 0' }}
          />
        </div>
      </div>
    </>
  )
}
