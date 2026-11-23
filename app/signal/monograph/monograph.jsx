'use client'

/*
 * Signal as a design monograph (trial layout).
 *
 * Read it like a book on a transit identity: the flat sign artwork is the
 * hero, shown as numbered plates, with the story set as chapters around it.
 *
 * One rule for this version: every image appears once.
 *   - The cover is a grid of the system's parts (HeroGrid); the photo tile is the fork sign in place.
 *   - The key shows six real platforms, so it varies instead of repeating "5, Violet, Mandi House".
 *   - Chapter III shows only the foundations (key, type, colour, arrow, pictograms).
 *   - Every sign from street to exit appears once, in chapter IV, the trip.
 *   - Today's ticket is evidence in chapter I; chapter V is the live screen, wall strip and manual.
 *
 * Chapter IV is a scroll film of one rider's whole trip (film.jsx). The
 * images it shows (new ticket, gate, Saathi) appear nowhere else.
 *
 * Copy and numbers come from /signal (content.jsx). The order rule holds:
 * the 45% to 80% result belongs to the first, white sign, so it stays in
 * chapter II, and every black sign after it says it is untested.
 *
 * Plate numbers are counted by CSS (monograph.css), so plates can be moved freely.
 */
import { Fragment } from 'react'
import './monograph.css'
import { Back, Tradeoffs } from '../../components/case-study'
import { Compare } from '../compare'
import { W } from '../wayfinding'
import { MUKTA } from '../font'
import { LINES } from '../marks'
import { CREDITS, MANUAL_PREVIEW, MANUAL_SCOPE, SIGNAL_NEXT_TEST, SIGNAL_TEST_METHOD, SIGNAL_TEST_SAMPLE } from '../content'
import Film from './film'
import { Phone } from '../device'

const N = '/signal/night'

/*
 * One panel for every plate, after ericsin.com: the same dark colour, corner
 * radius and padding everywhere, so the page reads as one system and only the
 * work inside changes. A typed label sits top left, the plate number top right
 * (counted by CSS), and one plain caption goes under the panel.
 *   fill: the content lays itself out (specimens) instead of being centred.
 */
function Panel({ label, fill = false, className = '', children }) {
  return (
    <div className={`mg-panel ${className}`}>
      <div className="mg-panel__head">
        <span>{label}</span>
        <span className="mg-plateno">Plate</span>
      </div>
      <div className={`mg-panel__body ${fill ? 'mg-panel__body--fill' : ''}`}>{children}</div>
    </div>
  )
}

/* A numbered plate: one image in a panel, then its caption.
   tall: tickets and screens, capped at most of a screen and centred. */
function Plate({ src, alt, w, h, label, cap, span = 'full', tall = false, className = '' }) {
  return (
    <figure className={`mg-plate mg-span-${span} ${className}`}>
      <Panel label={label} className={tall ? 'mg-panel--tall' : ''}>
        <img src={src} alt={alt} width={w} height={h} loading="lazy" />
      </Panel>
      <PlateCap num={false}>{cap}</PlateCap>
    </figure>
  )
}

/* The caption. num: show "Plate N" in front (only the cover photo, which has no panel). */
const PlateCap = ({ children, num = true, className = '' }) => (
  <figcaption className={`mg-cap ${className}`}>
    {num && <span className="mg-plateno">Plate</span>}
    <span>{children}</span>
  </figcaption>
)

/*
 * A construction sheet: the artwork on a faint grid with numbered callouts,
 * like a technical drawing, and a legend underneath that stays readable on a
 * phone. Used only where the details are the point (the fork sign, the ticket).
 *
 * Coordinates are in the artwork's own pixels. The sheet adds a margin of
 * `pad` = [x, y] pixels around the artwork for the number tags, so the whole
 * drawing is (w + 2x) by (h + 2y) units. Each point: x, y on the artwork;
 * tx, ty for its tag on the sheet; label for the legend.
 */
function Construction({ src, w, h, alt, label, cap, pad, points, maxWidth }) {
  const [px, py] = pad
  const VW = w + 2 * px
  const VH = h + 2 * py
  const pct = (v, total) => `${(v / total) * 100}%`
  return (
    <figure className="mg-plate mg-span-full">
      <Panel label={label} className="mg-panel--sheet" fill>
        <div className="mg-sheet" style={{ aspectRatio: `${VW} / ${VH}`, maxWidth }}>
          <img src={src} alt={alt} width={w} height={h} loading="lazy" style={{ left: pct(px, VW), top: pct(py, VH), width: pct(w, VW) }} />
          {/* Leader lines. non-scaling-stroke keeps them a hairline at any size. */}
          <svg viewBox={`0 0 ${VW} ${VH}`} aria-hidden="true">
            {points.map((p, i) => (
              <line key={i} x1={px + p.x} y1={py + p.y} x2={p.tx} y2={p.ty} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          {points.map((p, i) => (
            <Fragment key={i}>
              <span className="mg-sheet__dot" style={{ left: pct(px + p.x, VW), top: pct(py + p.y, VH) }} aria-hidden="true" />
              <span className="mg-sheet__tag" style={{ left: pct(p.tx, VW), top: pct(p.ty, VH) }} aria-hidden="true">{i + 1}</span>
            </Fragment>
          ))}
        </div>
        <ol className="mg-legend">
          {points.map((p, i) => <li key={i}><span className="mg-legend__n">{i + 1}</span>{p.label}</li>)}
        </ol>
      </Panel>
      <PlateCap num={false}>{cap}</PlateCap>
    </figure>
  )
}

/* A chapter opener: the roman numeral and title on the left, the lede on the right. */
function Chapter({ id, num, title, lede, aside, children }) {
  return (
    <section id={id} className="mg-chapter scroll-mt-24">
      <header className="mg-chapter__head">
        <p className="mg-num" aria-hidden="true">{num}</p>
        <h2 className="headline text-ink mg-title">{title}</h2>
        <div>
          {lede && <p className="text-ink mg-lede">{lede}</p>}
          {aside}
        </div>
      </header>
      {children}
    </section>
  )
}

/* Small uppercase label, used for specimen and colophon headings. */
const Label = ({ children, className = '' }) => <p className={`mg-label ${className}`}>{children}</p>

const CONTENTS = [
  ['problem', 'I', 'The problem'],
  ['test', 'II', 'What I tested'],
  ['system', 'III', 'The foundations'],
  ['trip', 'IV', 'One trip, street to exit'],
  ['beyond', 'V', 'Behind the signs'],
  ['limits', 'VI', 'Limits and next'],
]

/* ---------- Chapter I: the mismatch as one plate ---------- */
/* Today's sign colours (DMRC blue) against what the rider has in their head. */
function MismatchPlate() {
  return (
    <figure className="mg-plate mg-span-full">
      <Panel label="The mismatch" fill>
      <div className="mg-mismatch" style={{ fontFamily: MUKTA }}>
        <div className="mg-mismatch__rider">
          <Label>What the rider knows</Label>
          <p className="mg-mismatch__big">Lajpat Nagar</p>
          <p>The place they’re going</p>
        </div>
        <p className="mg-mismatch__ne" aria-label="does not match">≠</p>
        <div className="mg-mismatch__sign">
          <Label className="mg-label--on-dark">What the sign says</Label>
          <p className="mg-mismatch__big">Towards Raja Nahar Singh (Ballabhgarh)</p>
          <p>The last station of the line</p>
        </div>
      </div>
      </Panel>
      <PlateCap num={false}>The gap the project starts from. Riders know a place; signs name the end of a line.</PlateCap>
    </figure>
  )
}

/* ---------- Chapter III: the foundations ---------- */

/* The key every sign carries, drawn live in the sign typeface: the real
   platforms from the Kashmere Gate fork and the Lajpat Nagar Pink Line stairs,
   so the plate shows the key varying, not one example repeated. */
const KEYS = [
  ['1', 'पीली लाइन · Yellow Line', '#d4ac14', true, 'चांदनी चौक · राजीव चौक', 'Chandni Chowk · Rajiv Chowk'],
  ['2', 'पीली लाइन · Yellow Line', '#d4ac14', true, 'सिविल लाइन्स · विश्वविद्यालय', 'Civil Lines · Vishwavidyalaya'],
  ['3', 'लाल लाइन · Red Line', '#d32f2f', false, 'तीस हज़ारी · इंद्रलोक', 'Tis Hazari · Inderlok'],
  ['4', 'लाल लाइन · Red Line', '#d32f2f', false, 'शास्त्री पार्क · वेलकम', 'Shastri Park · Welcome'],
  ['3', 'पिंक लाइन · Pink Line', '#c2185b', false, 'विनोबापुरी · मयूर विहार-I', 'Vinobapuri · Mayur Vihar-I'],
  ['4', 'पिंक लाइन · Pink Line', '#c2185b', false, 'साउथ एक्सटेंशन · आईएनए', 'South Extension · INA'],
]
function KeyPlate() {
  return (
    <figure className="mg-plate mg-span-full">
      <Panel label="The key · six platforms" fill>
      <div className="mg-key" style={{ fontFamily: MUKTA }}>
        {/* Every platform on the fork and stair signs, in the same three parts. */}
        <ul className="mg-keys">
          {KEYS.map(([n, line, hex, dark, hi, en]) => (
            <li key={line + n} className="mg-key__row">
              <span className="mg-key__badge" style={{ background: hex, color: dark ? '#242424' : '#fff' }}>{n}</span>
              <span>
                <span className="mg-key__line">{line}</span>
                <span className="mg-key__places">{hi}</span>
                <span className="mg-key__places mg-key__places--en">{en}</span>
              </span>
            </li>
          ))}
        </ul>
        <ol className="mg-key__parts">
          <li><span>01</span> The number: the platform, carried from the ticket to the train</li>
          <li><span>02</span> The colour: the badge is the line’s colour</li>
          <li><span>03</span> The name: two stations riders travel to</li>
        </ol>
      </div>
      </Panel>
      <PlateCap num={false}>The key, on six real platforms. Every sign, screen and ticket repeats these three things, and nothing else is needed to pick a platform.</PlateCap>
    </figure>
  )
}

/* The type specimen: Mukta in both scripts at sign weights. */
function TypePlate() {
  return (
    <figure className="mg-plate mg-span-full">
      <Panel label="Typeface" fill>
      <div className="mg-type" style={{ fontFamily: MUKTA }}>
        <div>
          <Label className="mg-label--on-dark">Mukta · Ek Type</Label>
          <p className="mg-type__big">विश्वविद्यालय</p>
          <p className="mg-type__big">Vishwavidyalaya</p>
        </div>
        <ul className="mg-type__weights">
          {[['800', 'Platform numbers', '1 2 3 4 5'], ['700', 'Station names', 'Shastri Park · शास्त्री पार्क'], ['500', 'Line names', 'Pink Line · पिंक लाइन']].map(([wt, use, s]) => (
            <li key={wt}>
              <Label className="mg-label--on-dark">{wt} · {use}</Label>
              <p style={{ fontWeight: Number(wt) }}>{s}</p>
            </li>
          ))}
        </ul>
      </div>
      </Panel>
      <PlateCap num={false}>One typeface for every sign and screen, Hindi and English at equal size. Shown with one of the longest names on the network.</PlateCap>
    </figure>
  )
}

/* The line colours as chips. Each keeps its letter, so colour is never the only cue. */
function ColourPlate() {
  return (
    <figure className="mg-plate mg-span-full">
      <Panel label="Line colours" fill>
      <div className="mg-colours" style={{ fontFamily: MUKTA }}>
        {LINES.map((l) => (
          <div key={l.id} className="mg-chip" style={{ background: l.hex, color: l.dark ? '#242424' : '#ffffff' }}>
            <span className="mg-chip__letter">{l.letter}</span>
            <span className="mg-chip__name">{l.hi}<br />{l.en}</span>
          </div>
        ))}
      </div>
      </Panel>
      <PlateCap num={false}>Colour only for platforms and lines. Each line keeps a letter, because colours merge for some riders and letters don’t.</PlateCap>
    </figure>
  )
}

/* The sign family: one template, varied. The same strip turns into a
   stair sign, an interchange sign and the green exit; the hall board is the
   same key at its largest. Each is shown once here, flat. */
function FamilyPlate() {
  const strips = [
    ['night-stair.jpg', 'Stair head · Pink Line', 'The stair head sign: platform 3 to Vinobapuri and Mayur Vihar-I, platform 4 to South Extension and INA'],
    ['change-split.jpg', 'Interchange · Lajpat Nagar', 'Interchange sign: change to the Pink Line on the left, the exit on a green panel on the right'],
    ['exit-fork.jpg', 'Exit · the only green panel', 'A green exit sign listing Gate 1, Gate 2 and Gate 3, each with its arrow'],
  ]
  return (
    <figure className="mg-plate mg-span-full">
      <Panel label="The family · one template, four jobs" fill>
        <div className="mg-family-strips">
          {strips.map(([f, l, alt]) => (
            <div key={f}>
              <p className="mg-label">{l}</p>
              <img src={`${N}/${f}`} alt={alt} width={1600} height={300} loading="lazy" />
            </div>
          ))}
          <div className="mg-family-strips__wide">
            <p className="mg-label">Ticket hall board · the same key at its largest</p>
            <img src={`${N}/hall-board.jpg`} alt="The ticket hall board: every station in Hindi order and A to Z, each with its platform circle" width={2400} height={1200} loading="lazy" />
          </div>
        </div>
      </Panel>
      <PlateCap num={false}>The strip is one template. Only its job changes: which way, where to change, where to leave, or every station at once.</PlateCap>
    </figure>
  )
}

/* The size of the system, in counts taken from the work itself. */
const SCALE = [
  ['9', 'line colours, each with a letter'],
  ['24', 'pictograms in both scripts'],
  ['12', 'moments from street to exit'],
  ['33', 'pages in the standards manual'],
]

/* ---------- Chapter IV: the trip as a scroll film ---------- */
function TripChapter() {
  return (
    <section id="trip" className="mg-chapter scroll-mt-24">
      <header className="mg-chapter__head">
        <p className="mg-num" aria-hidden="true">IV</p>
        <h2 className="headline text-ink mg-title">One trip, street to exit</h2>
        <div>
          <p className="text-ink mg-lede">Neha is going from Kashmere Gate to Vinobapuri: Violet Line from platform 5, a change at Lajpat Nagar, then Pink Line platform 3. Each shot is one question she has on the way, and the sign that answers it.</p>
          <p className="mg-note">The film follows the proposed signs and paper ticket. <a className="prose-link" href="/signal/detail#signs">Inspect the designs in trip order</a>, or see <a className="prose-link" href="/signal/detail#saathi">Saathi on a separate trip to Lajpat Nagar</a>.</p>
        </div>
      </header>
      <Film />
    </section>
  )
}

/*
 * The cover, after amitpateldesigns.com/glydways: a grid of tiles, each one
 * part of the system (colour, platform badge, pictograms, the arrow, type,
 * Saathi, a sign in place), so the first screen shows the range of the work
 * before any words. Tiles are dark in both themes; layout is in monograph.css.
 */
const HERO_LINES = ['red', 'yellow', 'blue', 'violet', 'pink'].map((id) => LINES.find((l) => l.id === id))

function HeroGrid() {
  return (
    <div className="mg-wrap mg-bento" aria-label="Parts of the Signal system">
      {/* Line colours with their values */}
      <div className="mg-tile mg-tile--swatches">
        {HERO_LINES.map((l) => (
          <div key={l.id} style={{ background: l.hex, color: l.dark ? '#242424' : '#fff' }}>
            <span style={{ fontFamily: MUKTA }}>{l.letter} · {l.en}</span><span>{l.hex.toUpperCase()}</span>
          </div>
        ))}
      </div>
      {/* The sign in place */}
      <figure className="mg-tile mg-tile--photo">
        <img src={`${N}/hero.jpg`} alt="Concept image: the new black fork sign hanging above a blurred crowd in a metro concourse" width={2400} height={1351} />
        <span className="mg-tile__pill">Signal · Delhi Metro</span>
      </figure>
      {/* A platform badge */}
      <div className="mg-tile mg-tile--badge" style={{ fontFamily: MUKTA }}>
        <span className="mg-tile__badge">3</span>
        <span className="mg-tile__cap">पिंक लाइन · Pink Line</span>
      </div>
      {/* Pictograms */}
      <div className="mg-tile mg-tile--picto"><img src="/signal/monograph/picto-lift.png" alt="Lift pictogram" width={352} height={352} /><span className="mg-tile__cap">लिफ़्ट · Lift</span></div>
      <div className="mg-tile mg-tile--picto"><img src="/signal/monograph/picto-accessible.png" alt="Accessible pictogram" width={352} height={352} /><span className="mg-tile__cap">दिव्यांगजन सुविधा · Accessible</span></div>
      {/* The arrow */}
      <div className="mg-tile mg-tile--arrow">
        <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 50 H84 M56 22 L84 50 L56 78" /></svg>
        <span className="mg-tile__cap">One arrow, turned in 45° steps</span>
      </div>
      {/* Type */}
      <div className="mg-tile mg-tile--type" style={{ fontFamily: MUKTA }}>
        <p className="mg-tile__aa">Aa अ</p>
        <dl>
          <div><dt>Typeface</dt><dd>Mukta</dd></div>
          <div><dt>Foundry</dt><dd>Ek Type</dd></div>
          <div><dt>Weights</dt><dd><span style={{ fontWeight: 500 }}>500</span> <span style={{ fontWeight: 700 }}>700</span> <span style={{ fontWeight: 800 }}>800</span></dd></div>
        </dl>
      </div>
      {/* Saathi on the phone */}
      <figure className="mg-tile mg-tile--phone">
        {/* The site's own iPhone frame (device.jsx), with the status bar above the screenshot. */}
        <Phone bar="#f4f4f4"><img src={`${W}/saathi-route.jpg`} alt="Saathi’s route screen on an iPhone: platform 5, Violet Line" width={780} height={1720} loading="lazy" /></Phone>
      </figure>
      {/* The exit: the only green panel */}
      <div className="mg-tile mg-tile--exit">
        <img src="/signal/monograph/picto-exit.png" alt="Exit pictogram" width={352} height={352} />
        <span className="mg-tile__cap" style={{ fontFamily: MUKTA }}>निकास · Exit</span>
      </div>
    </div>
  )
}

export default function Monograph() {
  return (
    <main className="mg sig-page">
      {/* ---------- Cover ---------- */}
      <header className="mg-cover">
        <div className="mg-wrap mg-masthead">
          <Back />
          <span>Case study · 2026 · trial layout</span>
        </div>
        <HeroGrid />
        <div className="mg-wrap mg-cover__title">
          <h1 className="display text-ink mg-h1">Signal</h1>
          <div className="mg-cover__deck">
            <p className="text-ink" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.6rem)', lineHeight: 1.3 }}>New signs, screens and a paper ticket for the Delhi Metro.</p>
            <dl className="mg-colophon">
              <div><dt>Role</dt><dd>Solo: research, design, prototype</dd></div>
              <div><dt>Outcome</dt><dd>45% → 80% first-attempt accuracy, existing signs to first redesign, phone study with 84 riders</dd></div>
              <div><dt>Context</dt><dd>M.Des Interaction Design, UPES</dd></div>
            </dl>
          </div>
        </div>
        <p className="mg-wrap mg-cover__note">The photo tile is an AI-generated concept scene with the real sign artwork.</p>

        <nav className="mg-wrap mg-contents" aria-label="Contents">
          <Label>Contents</Label>
          <ol>
            {CONTENTS.map(([id, n, t]) => (
              <li key={id}><a href={`#${id}`}><span className="mg-contents__n">{n}</span><span>{t}</span></a></li>
            ))}
          </ol>
        </nav>
      </header>

      <div className="mg-wrap">
        {/* ---------- I. The problem ---------- */}
        <Chapter id="problem" num="I" title="The problem" lede="Signs name each platform by the last station on its line, which doesn’t help someone who knows only where they’re going. Once lost underground, there’s often no signal for a map.">
          <div className="mg-grid">
            <MismatchPlate />
          </div>

          <p className="text-ink mg-para">It happened to me first. On every ride I was unsure which way to go and which gate to leave by.</p>
          <dl className="mg-pulls">
            {[
              ['2 of 6', 'of my own rides went the wrong way'],
              ['3 of 5', 'occasional riders I know in Delhi said direction confuses them'],
              ['4', 'people on r/DelhiMetro brought up wrong-direction trips without being asked'],
            ].map(([n, d]) => (
              <div key={n}><dt className="headline text-ink tnum">{n}</dt><dd>{d}</dd></div>
            ))}
          </dl>
          <p className="mg-note">I asked my friends about direction directly, so their answers were prompted. The Reddit thread asked about signs and exits in general.</p>

          <div className="mg-grid mg-grid--ticket">
            <Plate tall label="Today’s ticket" src={`${N}/ticket-today.jpg`} w={928} h={1446} alt="Today’s ticket: a QR code, the fare as the largest text, station names in Hindi only, then an app advert" cap="Today’s ticket. The fare is the largest text, station names are in Hindi only, and nothing says which platform. Sample, not valid." />
            <p className="text-ink mg-para mg-ticket-note">Even the ticket, the one thing every rider holds, doesn’t say where to go after the gates.</p>
          </div>

          <div className="mg-personas">
            {[
              ['Neha', '/signal/personas/neha.png', 'Minimal illustrated portrait of Neha, a fictional first-time Delhi Metro rider', 'First time on this route. She has a phone. She knows the place, not the station.'],
              ['Mohan-ji', '/signal/personas/mohan-ji.png', 'Minimal illustrated portrait of Mohan-ji, a fictional older Delhi Metro rider', 'He uses his phone for calls, not maps. He trusts signs and staff.'],
            ].map(([n, src, alt, d]) => (
              <article key={n} className="mg-persona">
                <img src={src} width={1122} height={1402} loading="lazy" alt={alt} />
                <div>
                  <h3 className="headline text-ink" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', lineHeight: 1.05 }}>{n}</h3>
                  <p className="text-ink mt-2" style={{ lineHeight: 1.5 }}>{d}</p>
                </div>
              </article>
            ))}
            <div className="mg-persona__rule">
              <p className="headline text-ink" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.1rem)', lineHeight: 1.2 }}>Every step has to work with no phone.</p>
              <p className="mg-note">First-time and occasional riders, who know where they’re going but not how the network is laid out. Neha and Mohan-ji are personas. Most of the 84 people in the test ride weekly, and only 7 had ridden 1 to 5 times, so riders like these two are under-represented in the result.</p>
            </div>
          </div>
        </Chapter>

        {/* ---------- II. The test ---------- */}
        <Chapter id="test" num="II" title="What I tested" lede="I changed what the signs say. Each platform got its own row, with an arrow, the platform number in the line’s colour and two stations on the way.">
          <figure className="mg-plate mg-span-full mt-12">
            <Panel label="Kashmere Gate fork · today and as tested" fill>
            <Compare before={{ src: `${W}/kg-today.jpg`, alt: 'Today: three platforms named only by the last station of each line' }} after={{ src: `${W}/kg-new.jpg`, alt: 'Redesign: one row per platform, each with its number in the line colour and two stations' }} />
            </Panel>
            <PlateCap num={false}>The Kashmere Gate fork, today and as tested. Drag across the photo to compare.</PlateCap>
          </figure>

          <div className="mg-result">
            <div>
              <p className="mg-result__n headline tnum">45%</p>
              <p className="mg-label">Existing signs · correct first attempts</p>
            </div>
            <p className="mg-result__arrow" aria-hidden="true">→</p>
            <div>
              <p className="mg-result__n headline tnum mg-result__n--after">80%</p>
              <p className="mg-label">First redesign · correct first attempts</p>
            </div>
          </div>

          <div className="mg-twocol">
            <dl className="mg-table">
              {[
                ['Right first try, when the sign named their stop', '48% → 91%'],
                ['Right first try, when it didn’t', '39% → 60%'],
                ['Answered “not sure”', '26% → 10%'],
              ].map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd className="tnum">{v}</dd></div>
              ))}
            </dl>
            <div>
              <p className="text-ink" style={{ lineHeight: 1.55 }}>Across the task set, 56 riders scored higher with the first redesign, 18 tied, and 10 scored lower.</p>
              <p className="mg-note">{SIGNAL_TEST_METHOD} {SIGNAL_TEST_SAMPLE}</p>
            </div>
          </div>
        </Chapter>

        {/* ---------- III. The foundations ---------- */}
        <Chapter id="system" num="III" title="The foundations" lede="The tested signs worked, but they looked like app screens, and each piece had been designed alone. So I set one system for everything: near-black panels, colour only for platforms and lines, one arrow and one typeface. The information hasn’t changed, only the look, so the test result doesn’t apply to it yet.">
          {/* The size of the system, before its parts. */}
          <dl className="mg-scale">
            {SCALE.map(([n, d]) => <div key={n}><dt className="headline text-ink tnum">{n}</dt><dd>{d}</dd></div>)}
          </dl>
          <div className="mg-grid">
            <KeyPlate />
            {/* Construction sheets: the two pieces where the details carry the idea. */}
            <Construction
              label="Fork sign · construction"
              src={`${N}/night-fork.jpg`} w={2400} h={300}
              alt="The Kashmere Gate fork sign with numbered callouts: platforms 3, 1, 2, 5 and 4, each with its arrow, line colour and two stations"
              pad={[60, 260]}
              points={[
                { x: 240, y: 150, tx: 300, ty: 110, label: 'Platform number in the line colour' },
                { x: 720, y: 150, tx: 780, ty: 110, label: 'One arrow for the platforms that go the same way' },
                { x: 840, y: 240, tx: 900, ty: 710, label: 'Each platform keeps its own row: number, line name, stations' },
                { x: 1290, y: 255, tx: 1500, ty: 710, label: 'Two stations on the way, Hindi above English' },
              ]}
              cap="How the fork sign is built. The information is what was tested with 84 riders; this black design is not tested yet."
            />
            <Construction
              label="Ticket · construction"
              src={`${N}/ticket-new.jpg`} w={928} h={1446}
              alt="The redesigned ticket with numbered callouts: destination, platform 5 on the Violet Line, change at Lajpat Nagar, platform 3 on the Pink Line, and the fare in small print"
              pad={[420, 60]}
              maxWidth="42rem"
              points={[
                { x: 790, y: 440, tx: 1588, ty: 500, label: 'Destination at the top, in both scripts' },
                { x: 155, y: 745, tx: 180, ty: 805, label: 'Platform 5, Violet Line, two stations: the same key as the signs' },
                { x: 560, y: 910, tx: 1588, ty: 970, label: 'Where to change' },
                { x: 155, y: 1070, tx: 180, ty: 1130, label: 'The second ride, in the same key' },
                { x: 80, y: 1322, tx: 180, ty: 1382, label: 'Fare and date move to the small print' },
              ]}
              cap="The redesigned ticket prints the route in the signs’ own key. Sample, not valid."
            />
            <TypePlate />
            <ColourPlate />
            <FamilyPlate />
            <Plate span="half" label="The arrow" src={`${N}/manual-05.jpg`} w={1400} h={990} alt="Manual page on the arrow, with eight directions and three rules" cap="One arrow, the public-domain AIGA and US DOT symbol, turned in 45° steps." />
            <Plate span="half" label="Pictograms" src={`${N}/picto-set.jpg`} w={1600} h={1200} alt="A black sheet of 24 white pictograms, each with Hindi and English labels" cap="24 pictograms on the arrow’s grid, labelled in both scripts. Comprehension is not tested yet." />
          </div>
        </Chapter>

        {/* ---------- IV. One trip (three trial layouts) ---------- */}
        <TripChapter />

        {/* ---------- V. Behind the signs: what the film doesn't show ---------- */}
        <Chapter id="beyond" num="V" title="Behind the signs" lede="The proposed manual shows how the platform cue carries from paper to signs, including when live times go missing.">
          <div className="mg-grid">
            <Plate label="Platform screen" src={`${N}/digital-platform.jpg`} w={1920} h={1080} alt="Platform screen: platform 5, Violet Line, Mandi House and Lajpat Nagar, 3 minutes, and the stations ahead" cap="Station screens add live minutes to the same key. A proposal." />
            <Plate label="Platform wall strip" src={`${N}/wall-strip.jpg`} w={2400} h={1000} alt="The platform wall strip: all stations ahead on the Violet Line in three rows, numbered, with line bars at interchanges" cap="The platform wall: every station ahead, with interchanges marked." />
            <p className="mg-note mg-span-full">{MANUAL_SCOPE}</p>
            {MANUAL_PREVIEW.map((page) => <Plate key={page.src} span="half" {...page} />)}
          </div>
          <p className="mt-10" style={{ fontSize: '0.95rem' }}>
            <a className="prose-link" href="/signal/Delhi-Metro-Standards-Manual.pdf">Read the manual (PDF)</a> · <a className="prose-link" href="https://saathi-delhi-metro.vercel.app" target="_blank" rel="noreferrer">Try Saathi ↗</a>
          </p>
        </Chapter>

        {/* ---------- VI. Limits ---------- */}
        <Chapter id="limits" num="VI" title="Limits and next" lede="What each constraint made me choose, and what it cost.">
          <div className="mt-12">
            <Tradeoffs items={[
              ['The black signs are new', 'Kept the tested arrow, platform, line name and two stops, and changed only the look', 'I can’t claim the 45% to 80% result for them until I re-test'],
              ['Some riders have no smartphone', 'Every step works on signs and the ticket alone', 'The phone can only add, never fix a bad sign'],
              ['No signal underground', 'Boards where riders already stop to ask for help; once opened, the route stays on the phone', 'The first scan needs signal where the board hangs'],
              ['Hindi station names on the ticket', 'One row per ride, with both stations in both scripts', 'The ticket is about 6 mm longer than today’s for a two-ride trip'],
            ]} />
          </div>
          <p className="text-ink mg-para">{SIGNAL_NEXT_TEST}</p>
          <p className="mg-note">The black panels are a proposal. Blind and low-vision riders need their own research.</p>

          <div className="mg-refs">
            <Label>References</Label>
            <ol>
              {CREDITS.map(([t, href]) => (
                <li key={t}><a className="prose-link" href={href} target="_blank" rel="noreferrer">{t}</a></li>
              ))}
            </ol>
          </div>
          <p className="mg-note mt-12">This is the fifth idea in the project. The fourth is <a className="prose-link" href="/signal/v4">written up too</a>. Network data from OpenStreetMap; only Kashmere Gate and Lajpat Nagar are checked on site. A student proposal, not made with or for DMRC.</p>
        </Chapter>
      </div>
    </main>
  )
}
