'use client'

/*
 * Chapter IV as a scroll film: one rider's whole trip, Kashmere Gate to
 * Vinobapuri (Violet Line platform 5, change at Lajpat Nagar, Pink Line
 * platform 3). It is the trip printed on the redesigned ticket.
 *
 * How it works: a full-screen stage sticks to the top of the viewport while
 * the reader scrolls through one invisible "step" per shot. Whichever step is
 * in the middle of the screen sets the active shot; shots cross-fade, scenes
 * push in slowly, and a line of stops along the bottom shows where she is.
 * Tapping a stop scrolls to it. Reduced Motion: no push-in, quicker fades.
 *
 * Images: `neha` is the scene with Neha in it, once it exists in
 * public/signal/film/. Until then each shot falls back to `src`, the existing
 * artwork. To swap a scene in, drop the file in and set its `neha` path.
 */
import { useEffect, useRef, useState } from 'react'

const N = '/signal/night'
const W = '/signal/wayfinding'

// kind: 'scene' fills the frame; 'art' is flat sign artwork on the dark stage;
// 'paper' is a ticket, board or phone screen, shown upright in the middle.
export const SHOTS = [
  { place: 'Street · Kashmere Gate', q: 'Where is my station?', kind: 'scene', src: `${N}/mock-street.jpg`, neha: '/signal/film/shot-01.jpg', w: 1920, h: 1080, alt: 'Neha looks up at the Kashmere Gate street totem showing the station’s three lines and Gate 3.', cap: 'The totem names the station, its lines and the gate.', ai: true },
  { place: 'Ticket hall', q: 'Which platform do I need?', kind: 'scene', src: `${N}/hall-board.jpg`, neha: '/signal/film/shot-02.jpg', w: 1920, h: 1080, alt: 'Neha scans the ticket hall board with station names and starting platforms.', cap: 'The sample shows station names in Hindi order and A to Z, with a platform beside each.' },
  { place: 'Customer care', optional: true, q: 'Can I see the whole trip?', kind: 'scene', src: '/signal/gallery/board-inside.jpg', neha: '/signal/film/shot-03.jpg', w: 1920, h: 1080, alt: 'Neha scans the customer-care Saathi board showing major destinations with their platform, line and exit gate.', cap: 'A QR board hangs where riders already stop to ask staff. Scanning is optional.' },
  { place: 'Her phone', optional: true, q: 'What do I remember?', kind: 'scene', src: `${W}/saathi-route.jpg`, neha: '/signal/film/shot-04.jpg', w: 1920, h: 1080, alt: 'Neha checks Saathi’s saved route on her phone: platform 5, Violet Line, and the exit at Lajpat Nagar.', cap: 'Saathi shows the route once, in the signs’ own words, and it stays on the phone with no signal. This separate trip ends at Lajpat Nagar.' },
  { place: 'Ticket counter', q: 'Where do I go after the gates?', kind: 'scene', src: `${N}/ticket-new.jpg`, neha: '/signal/film/shot-05.jpg', w: 1920, h: 1080, alt: 'Neha receives the redesigned ticket showing platform 5, Violet Line, Lajpat Nagar, and platform 3.', cap: 'The ticket prints the same key: platform 5, Violet Line, change at Lajpat Nagar, platform 3. Sample, not valid.' },
  { place: 'The gate', q: 'Am I going the right way?', kind: 'scene', src: `${N}/fare-gate-qr.jpg`, neha: '/signal/film/shot-06.jpg', w: 1920, h: 1080, alt: 'Neha scans her ticket at the fare gate as its screen confirms platform 5 on the Violet Line.', cap: 'The gate reads her ticket and confirms platform 5.', ai: true },
  { place: 'The fork', q: 'Which way to platform 5?', kind: 'scene', src: `${N}/night-fork.jpg`, neha: '/signal/film/shot-07.jpg', w: 1920, h: 1080, alt: 'Neha looks up at the fork sign in a busy concourse: platforms 3, 1, 2, 5 and 4, with her 5 in violet.', cap: 'Her 5, in violet, with Mandi House and Lajpat Nagar. The first redesign was tested in a phone study.' },
  { place: 'Platform 5', q: 'Is this the right train?', kind: 'scene', src: '/signal/mockups/platform-totem-v2.png', neha: '/signal/film/shot-08.jpg', w: 1920, h: 1080, alt: 'Neha waits beside the platform 5 totem listing the Violet Line stations ahead as a train arrives.', cap: 'The totem lists the stops through Lajpat Nagar.', ai: true },
  { place: 'On the train', q: 'What’s the next stop?', kind: 'scene', src: '/signal/mockups/train-display.png', neha: '/signal/film/shot-09.jpg', w: 1920, h: 1080, alt: 'Neha looks up at the train display showing Mandi House next, doors on the left, and the following stops.', cap: 'Next station, door side and what comes after.', ai: true },
  { place: 'Lajpat Nagar', q: 'Where do I change?', kind: 'scene', src: `${N}/change-split.jpg`, neha: '/signal/film/shot-10.jpg', w: 1920, h: 1080, alt: 'Neha pauses beneath the interchange sign showing the Pink Line change to the left and the exit to the right.', cap: 'Changing and leaving share one panel. She follows the pink bar.' },
  { place: 'Pink Line stairs', q: 'Which platform goes to Vinobapuri?', kind: 'scene', src: `${N}/night-stair.jpg`, neha: '/signal/film/shot-11.jpg', w: 1920, h: 1080, alt: 'Neha looks at the stair sign directing platform 3 to Vinobapuri and platform 4 to South Extension.', cap: 'Platform 3, Vinobapuri: the same number her ticket printed.' },
  { place: 'Vinobapuri', q: 'How do I find my exit?', kind: 'scene', src: `${N}/exit-fork.jpg`, neha: '/signal/film/shot-12.jpg', w: 1920, h: 1080, alt: 'Neha walks toward daylight beneath the green exit sign for Gates 1, 2 and 3.', cap: 'Neha arrives at Vinobapuri. The proposed exit sign uses sample gate numbers.' },
]

const FILM_SHOTS = SHOTS.filter((shot) => !shot.optional)

const pad = (i) => String(i + 1).padStart(2, '0')

export default function Film() {
  const [at, setAt] = useState(0)
  const steps = useRef([])

  // The step crossing the middle of the screen is the active shot.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setAt(Number(e.target.dataset.i)) })
    }, { rootMargin: '-50% 0px -50% 0px' })
    steps.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const jump = (i) => steps.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  const s = FILM_SHOTS[at]

  return (
    <div className="mg-film" style={{ '--shots': FILM_SHOTS.length }}>
      <div className="mg-film__stage">
        {/* data-reveal opts out of the site-wide scroll reveal, which would force every shot visible. */}
        {FILM_SHOTS.map((t, i) => (
          <figure key={t.place} className={`mg-film__shot mg-film__shot--${t.kind}`} data-reveal="off" data-on={i === at} aria-hidden={i !== at}>
            <img src={t.neha || t.src} alt={t.alt} width={t.w} height={t.h} loading={i < 2 ? 'eager' : 'lazy'} />
          </figure>
        ))}

        {/* Subtitle: shot number and place, her question, one line of caption. */}
        <div className="mg-film__sub" aria-live="polite">
          <p className="mg-film__meta">Shot {pad(at)} / {FILM_SHOTS.length} · {s.place}</p>
          <p className="mg-film__q headline">“{s.q}”</p>
          <p className="mg-film__cap">{s.cap}{(s.ai || s.neha) ? ' AI-generated concept image.' : ''}</p>
        </div>

        {/* The line: one stop per shot. Tap a stop to go there. */}
        <ol className="mg-film__line" aria-label="Stops on Neha’s trip">
          {FILM_SHOTS.map((t, i) => (
            <li key={t.place}>
              <button type="button" data-on={i === at} data-past={i < at} aria-current={i === at ? 'step' : undefined} onClick={() => jump(i)} aria-label={`Shot ${pad(i)}: ${t.place}`} />
            </li>
          ))}
        </ol>
        {at === 0 && <p className="mg-film__hint" aria-hidden="true">Scroll to follow Neha ↓</p>}
      </div>

      {/* Invisible scroll steps, one per shot, that drive the stage. */}
      <div className="mg-film__steps" aria-hidden="true">
        {FILM_SHOTS.map((t, i) => <div key={t.place} ref={(el) => { steps.current[i] = el }} data-i={i} className="mg-film__step" />)}
      </div>
    </div>
  )
}
