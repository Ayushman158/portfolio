'use client'

import { Back, Subhead, Tradeoffs } from '../components/case-study'
import AnnotatedScreen from '../components/annotated-screen'
import { W } from './wayfinding'
import { StepVideo } from './demos'
import { Compare } from './compare'
import { MUKTA } from './font'
import { BeforeAfter, ColourVision, KeyDiagram, Mismatch, ReadingDistance, REFERENCES } from './system'
import { ArrowTurn, ForkConstruction, LiveScreen, NightZone, OutOf100, Pan, Stop, SwipeHint, Trip } from './motion'

/*
 * Signal: finding the right platform on the Delhi Metro.
 * The order matters. The 45% to 80% result was measured on the first, white
 * sign, in a phone test with 84 riders (Sheet read 1 Nov 2026). The black
 * "Night panel" system came after and is untested, so it follows the result
 * and is always labelled as a concept. Don't move the numbers next to it.
 * Iteration 4 lives on at /signal/v4.
 */
const N = '/signal/night'

const CREDITS = [
  REFERENCES[0], // the colour-vision model cited by the first-sign diagram as [1]
  ['Order and W&CO. Digital Wayfinding Manual for WMATA.', 'https://segd.org/projects/wmata-digital-wayfinding-manual/'],
  ['Amit Patel. Metro Visual System for Glydways.', 'https://amitpateldesigns.com/glydways/metro-visual-system'],
  ['Bhave, San and Sharma (2023). MetroInSight: Innovating Accessibility in DMRC.', 'https://www.behance.net/gallery/184857911/MetroInSight-Innovating-Accessibility-In-DMRC'],
  ['Mathur, Maitra and Sharma (2023). Revamping DMRC Ticketing System.', 'https://www.behance.net/gallery/187484571/Revamping-DMRC-Ticketing-System'],
  ['AIGA and US DOT. Symbol Signs (public domain arrow).', 'https://www.aiga.org/resources/symbol-signs'],
  ['Ek Type. Mukta (SIL Open Font Licence).', 'https://fonts.google.com/specimen/Mukta'],
  ['OpenStreetMap contributors. Delhi Metro network and station gates (ODbL).', 'https://www.openstreetmap.org/copyright'],
]

const SAATHI_PINS = [
  { x: 68, y: 18.9, title: 'In the sign’s own words', body: 'The first line is the direction the station signs use, so the phone and the station never disagree.' },
  { x: 88, y: 51.2, title: 'The numbers to remember, on top', body: 'The platform and the exit, in the same badges as the signs. A rider reads them once at the board and puts the phone away.' },
  { x: 51, y: 77.5, title: 'The full route below', body: 'The stops fold into one line, and open to match the strip above the doors.' },
]

const BOARD_PINS = [
  { x: 16, y: 24, title: 'Starts with places', body: 'A visitor knows India Gate or Red Fort, so the board starts there.' },
  { x: 35, y: 34, title: 'The platform is the hand-off', body: 'The same large platform badge carries the rider from this board to the ticket, signs and train.' },
  { x: 84, y: 43, title: 'The exit is part of the route', body: 'Each common place ends with the station and gate nearest to it, rather than stopping at the train.' },
  { x: 54, y: 82, title: 'Useful without a phone', body: 'The printed board answers common trips directly. Scanning is only for somewhere that is not already listed.' },
]

/* Chapters share an editorial frame; the wayfinding system gets one sign-like pivot below. */
function Section({ id, title, lede, next, first = false, children }) {
  return (
    <section id={id} className={`sig-section scroll-mt-24 ${first ? '' : 'pt-24 sm:pt-36'}`}>
      <header className="grid gap-5 border-t border-rule pt-6 sm:grid-cols-[minmax(13rem,0.72fr)_minmax(0,1.28fr)] sm:gap-12 sm:pt-8">
        <h2 data-route="" className="headline text-ink" style={{ fontSize: 'clamp(2rem, 3.7vw, 3.75rem)', lineHeight: 1.03, letterSpacing: '-0.025em', textWrap: 'balance' }}>{title}</h2>
        {lede && <p className="text-ink max-w-[42rem]" style={{ fontSize: '1.12rem', lineHeight: 1.58 }}>{lede}</p>}
      </header>
      {children}
      {next && <p className="text-muted mt-20 sm:mt-24" style={{ fontSize: '1.2rem', lineHeight: 1.5, maxWidth: '36rem' }}>{next}</p>}
    </section>
  )
}

/* A part of a long section: a small label, then the visual, with room around it. */
const Part = ({ label, children }) => (
  <div className="pt-12 sm:pt-16">
    <Subhead>{label}</Subhead>
    {children}
  </div>
)

const Note = ({ children, className = 'mt-4' }) => <p className={`text-faint ${className}`} style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>{children}</p>

const Cap = ({ children }) => <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>{children}</figcaption>

/* One image from the system. Signs are flat artwork, so they get a small radius and no border. */
function Fig({ src, alt, w, h, cap, side, className = 'mt-16', framed = false, wide = false }) {
  return (
    <figure className={`track-wide case-fig ${className}`} data-side={side}>
      {wide
        ? <Pan label={alt}><img src={src} alt={alt} width={w} height={h} loading="lazy" className="block h-auto w-full" /></Pan>
        : <img src={src} alt={alt} width={w} height={h} loading="lazy" className="block h-auto w-full rounded-lg" style={framed ? { border: '1px solid var(--rule)' } : undefined} />}
      {cap && <Cap>{wide && <SwipeHint />}{cap}</Cap>}
    </figure>
  )
}

/* One screen: title and insight beside the image, the facts along the bottom. */
function Hero() {
  return (
    <section id="overview" className="measure scroll-mt-24 pb-4 pt-[4.75rem] sm:pt-20">
      <div className="track-full">
        <div className="sig-hero-masthead">
          <Back />
          <span>Case study · 2026</span>
        </div>

        <div className="sig-hero-grid">
          <header className="sig-hero-copy">
            <div>
              <h1 className="sig-hero-title">Signal</h1>
              <p className="sig-hero-deck">New signs, screens and a paper ticket for the Delhi Metro.</p>
            </div>
            <p className="sig-hero-insight">Delhi Metro signs assume you already know the network. On today’s signs, even weekly riders picked the right platform 46% of the time.</p>
          </header>

          <figure className="sig-hero-window">
            <img
              src="/signal/mockups/stair-landing.png"
              width={1536}
              height={1024}
              fetchPriority="high"
              alt="Concept image of the new signs installed above a Delhi Metro staircase, directing riders toward platforms 3 and 4"
            />
          </figure>
        </div>

        <dl className="sig-hero-facts">
          <div>
            <dt>Role</dt>
            <dd>Solo: research, design, prototype</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd><strong>80%</strong> chose correctly on the first sign, in a phone test</dd>
          </div>
          <div>
            <dt>Image</dt>
            <dd>AI-generated concept scene with the real sign artwork</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

/* The only sign-like chapter break: the same key the rider follows through every touchpoint. */
function SystemPivot() {
  return (
    <div className="sig-pivot" role="img" aria-label="Platform 5, Violet Line, Mandi House and Lajpat Nagar: one key carried everywhere">
      <div className="sig-pivot__key" style={{ fontFamily: MUKTA }}>
        <span className="sig-pivot__badge">5</span>
        <span>
          <span className="sig-pivot__line">Violet Line</span>
          <span className="sig-pivot__places">मंडी हाउस · लाजपत नगर<br />Mandi House · Lajpat Nagar</span>
        </span>
      </div>
      <p className="sig-pivot__claim headline">Platform, line and two stops, at every step.</p>
    </div>
  )
}

export default function Signal() {
  return (
    <main className="sig-page">
      <Hero />
      {/* One column and one left edge for the whole page: tracks are neutralised inside .sig-flow. */}
      <div className="measure pt-12 sm:pt-20"><div className="track-full sig-flow">

        <dl className="sig-project-meta" aria-label="Project scope and context">
          <div className="sig-project-meta__scope">
            <dt>Scope</dt>
            <dd>
              {['Signs and station screens', 'Type, colour and pictograms', 'Paper ticket and gate', 'Standards manual', 'Saathi, a route finder'].map((item, i) => (
                <span key={item}>{i > 0 && <i aria-hidden="true">·</i>}{item}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Context</dt>
            <dd>M.Des Interaction Design, UPES</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>2026</dd>
          </div>
        </dl>

        {/* ---------- The problem ---------- */}
        <Section id="problem" title="The problem" next="I focused on the riders with the least to fall back on." lede="Signs name each platform by the last station on its line, which doesn’t help someone who knows only where they’re going. Once lost underground, there’s often no signal for a map.">
          <Mismatch />
        </Section>

        {/* ---------- Who it's for ---------- */}
        <Section id="who" title="Who it’s for" next="I tested one change first: what the signs say." lede="First-time and occasional riders, who know where they’re going but not how the network is laid out. I designed around two people.">
          <div className="sig-personas">
            {[
              ['Neha', '/signal/personas/neha.png', 'Minimal illustrated portrait of Neha, a fictional first-time Delhi Metro rider', 'First time on this route. She has a phone. She knows the place, not the station.'],
              ['Mohan-ji', '/signal/personas/mohan-ji.png', 'Minimal illustrated portrait of Mohan-ji, a fictional older Delhi Metro rider', 'He uses his phone for calls, not maps. He trusts signs and staff.'],
            ].map(([n, src, alt, d]) => (
              <article key={n} className="sig-persona">
                <figure className="sig-persona__portrait">
                  <img src={src} width={1122} height={1402} loading="lazy" alt={alt} />
                </figure>
                <div>
                  <h3 className="headline text-ink" style={{ fontSize: 'clamp(2.2rem, 3.6vw, 3.25rem)', lineHeight: 1.05 }}>{n}</h3>
                  <p className="text-ink mt-3" style={{ fontSize: '1.08rem', lineHeight: 1.5, maxWidth: '26rem' }}>{d}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="headline text-ink mt-10" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.1rem)', lineHeight: 1.2 }}>Every step has to work with no phone.</p>
          <Note className="mt-6 max-w-[38rem]">Neha and Mohan-ji are personas. Most of the 84 people in the test ride weekly, and only 7 had ridden 1 to 5 times, so riders like these two are under-represented in the result.</Note>
        </Section>

        {/* ---------- The test ---------- */}
        <Section id="result" title="What I tested" next="The information worked. The signs still needed to look and work as one family." lede="I changed what the signs say. Each platform got its own row, with an arrow, a number in the line’s colour and two stations on the way.">
          <BeforeAfter />
          <div className="mt-16 grid items-end gap-10 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:gap-16">
            <div>
              <Subhead>Out of every 100 tries, how many reached the right platform first</Subhead>
              <OutOf100 before={45} after={80} />
            </div>
            <div className="space-y-3" style={{ fontSize: '1.02rem', lineHeight: 1.55 }}>
              <p className="text-ink">It helped most when the rider’s stop was on the sign: 48% to 91%. When it wasn’t, 39% to 60%.</p>
              <p className="text-ink">“Not sure” answers fell from 26% to 10%. Of 84 riders, 56 did better, 18 stayed the same and 10 did worse.</p>
              <Note className="">A phone test with photos of two stations. Each rider saw today’s sign at one and the redesign at the other. p &lt; 0.001. It has not been tested inside a station.</Note>
            </div>
          </div>
          <Part label="What riders needed to remember"><KeyDiagram /></Part>
          <Part label="How far the first sign reads"><ReadingDistance /></Part>
          <Part label="In the first sign, colour is never the only cue"><ColourVision /></Part>
        </Section>

      </div></div>

      {/* The story turns here, so the whole page does too: it changes colour as this section arrives. */}
      <NightZone><div className="measure pb-28 pt-24 sm:pt-32"><div className="track-full sig-flow">

        <SystemPivot />

        {/* ---------- The system ---------- */}
        <Section id="system" first title="One visual system" next="Here it is across one trip." lede="The tested signs worked, but they looked like app screens, and each piece had been designed alone. So I set one system for everything: near-black panels, colour only for platforms and lines, one arrow and one typeface.">
          <Fig src={`${N}/hero.jpg`} w={2400} h={1351} alt="Concept image: the new black fork sign hanging still above a metro concourse while commuters blur into streaks of light" cap="The new sign, in place. AI-generated concept image." />
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-end gap-6 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8 [&_figure]:mt-0">
            <figure className="case-fig max-w-[13rem] sm:max-w-none"><img src={`${W}/kg-new.jpg`} width={1250} height={780} loading="lazy" alt="The first redesign of the Kashmere Gate sign, as tested: a light panel with platform numbers, arrows and station names" className="block h-auto w-full rounded-lg" /><Cap>Before: the sign I tested.</Cap></figure>
            <div className="min-w-0"><ForkConstruction alt="The same Kashmere Gate fork on the black panel: platform 3 to the left, platforms 1, 2 and 5 straight ahead, platform 4 to the right, each with two stations in Hindi and English" cap="The same sign in the new system. The information hasn’t changed, only the look, so the test result doesn’t apply to it yet. The grid unit is 40 mm." /></div>
          </div>
          <Part label="One arrow, turned in 45° steps"><ArrowTurn /></Part>
          <Part label="24 pictograms drawn on the arrow’s grid">
            <Fig src={`${N}/picto-set.jpg`} w={1600} h={1200} className="mt-8" alt="A black sheet of 24 white pictograms including train, change trains, walkway, stairs, escalator, lift, exit, tickets, toilets, accessible route, bus, auto-rickshaw, taxi, railway station and airport, each with Hindi and English labels" cap="Comprehension is not tested yet." />
          </Part>
        </Section>

        {/* ---------- Street to exit ---------- */}
        <Section id="signs" title="One trip, from the street to the exit" next="Screens build on the same signs." lede="Each sign answers one question. The signs are real artwork. The places are AI-generated concept images, and nothing here is installed.">
          <Trip>
            <Stop label="Street" question="Where is my station?" status="Concept · untested" src={`${N}/mock-street.jpg`} w={2000} h={1333} alt="Concept image: a tall black totem on a Delhi pavement at dusk showing the metro symbol, Kashmere Gate, its three lines and Gate 3, with auto-rickshaws passing behind" cap="Station name, lines and gate." />
            <Stop wide label="Ticket hall" question="Which platform do I need?" status="Drawn · untested" src={`${N}/hall-board.jpg`} w={2400} h={1200} alt="The ticket hall board: a black wall of stations in two lists, Hindi order and A to Z, each with its platform circle" cap="Every station, in Hindi order and A to Z, with its platform." />
            <Stop label="The fork" question="Which of three platforms?" status="Information tested · 84 riders" tested src="/signal/mockups/concourse-fork-v2.png" w={1536} h={1024} alt="Concept image: the Kashmere Gate fork sign suspended in a working metro concourse, directing riders toward platforms 3, 1, 2, 5 and 4" cap="One arrow and one platform for each direction. The information was tested. This black design was not." />
            <Stop wide label="Top of the stairs" question="Is this my side?" status="Same key as the fork" src={`${N}/night-stair.jpg`} w={1600} h={300} alt="The stair head sign for the Pink Line: platform 3 to Vinobapuri and Mayur Vihar-I, platform 4 to South Extension and INA" cap="The two platforms, split by direction." />
            <Stop label="Platform" question="Is this the right train?" status="Concept · untested" src="/signal/mockups/platform-totem-v2.png" w={1536} h={1024} alt="Concept image: a tall black platform 5 totem on a working elevated metro platform, listing the Violet Line stations ahead as a train arrives" cap="The platform first, then every station ahead." />
            <Stop wide label="Platform wall" question="How many stops remain?" status="Drawn · untested" src={`${N}/wall-strip.jpg`} w={2400} h={1000} alt="The platform wall strip: all stations ahead on the Violet Line in three rows, numbered, with line bars at interchanges" cap="All the stations ahead, with interchanges marked." />
            <Stop wide label="Interchange" question="Where do I change?" status="Drawn · untested" src={`${N}/change-split.jpg`} w={1600} h={300} alt="Interchange sign: to the left, change to the Pink Line, marked with a pink bar; to the right on a green panel, the exit" cap="Changing and leaving share one panel." />
            <Stop wide label="Exit" question="Which gate?" status="Needs a site check" src={`${N}/exit-fork.jpg`} w={1600} h={300} alt="A green exit sign listing Gate 1, Gate 2 and Gate 3, each with its arrow" cap="The only green panel." />
          </Trip>
        </Section>

        {/* ---------- Screens ---------- */}
        <Section id="screens" title="Station and in-train screens" next="The paper ticket and the gate use the same information." lede="Stations don’t have these screens at forks yet, so this part is a proposal. Screens add live times, and the printed signs stay.">
          <Fig wide src={`${N}/digital-fork.jpg`} w={2400} h={300} alt="The fork as a live screen: the same layout as the static sign, with minutes to the next train beside each platform" cap="The fork sign with minutes added." />
          <LiveScreen cap="The next train, then arriving, then a service change." />
          <Fig src="/signal/mockups/train-display.png" w={1536} h={1024} className="mt-16" alt="Concept image of an in-train display above the doors showing Mandi House as the next station, doors opening on the left, and the following Violet Line stops" cap="Next station, door side and what comes after. AI-generated concept image." />
          <div className="track-wide case-fig mt-8 grid gap-2">
            {[['train-interchange', 'an interchange coming up'], ['train-arriving', 'arriving at the station']].map(([n, t]) => (
              <img key={n} src={`${N}/${n}.jpg`} width={1920} height={360} loading="lazy" alt={`Display above the train doors showing ${t}`} className="block h-auto w-full rounded-lg" />
            ))}
            <Cap>The same display at an interchange and on arrival.</Cap>
          </div>
          <div className="track-wide mt-16 grid grid-cols-2 items-end gap-4 sm:grid-cols-[1fr_1fr_2fr]">
            <figure className="case-fig"><img src={`${N}/kiosk-home.jpg`} width={1080} height={1920} loading="lazy" alt="Station finder kiosk start screen asking Where are you going, with common trips listed" className="block h-auto w-full rounded-lg" /></figure>
            <figure className="case-fig"><img src={`${N}/kiosk-answer.jpg`} width={1080} height={1920} loading="lazy" alt="Station finder kiosk answer: Lajpat Nagar, a large arrow and platform 5" className="block h-auto w-full rounded-lg" /></figure>
            <p className="col-span-2 text-ink sm:col-span-1 sm:pl-6" style={{ fontSize: '1.05rem', lineHeight: 1.5 }}>A station finder kiosk asks where you’re going, offers common trips first, then gives one big answer.</p>
          </div>
        </Section>

        {/* ---------- Ticket and gate ---------- */}
        <Section id="ticket" title="The ticket and the gate" next="These rules are written down so someone else could build this." lede="The ticket carries the same information, in black on today’s 58 mm roll. If there’s a problem at the gate, the screen points to Customer Care, and staff give the reason in private.">
          <Fig src={`${N}/fare-gate-qr.jpg`} w={1262} h={756} className="mt-16" alt="Concept image of a metro fare gate screen showing a tick and platform 5, Violet Line, Mandi House and Lajpat Nagar" cap="A QR scan confirms the first platform. A smart card tap shows only a tick, so nobody sees a balance. AI-generated concept image." />
          <div className="track-wide mt-8 grid items-start gap-4 sm:grid-cols-[minmax(0,19rem)_minmax(0,32rem)]">
            <figure className="case-fig">
              <Compare
                aspect="928 / 1446"
                before={{ src: `${N}/ticket-today.jpg`, alt: 'Today’s ticket for Kashmere Gate to Vinobapuri: a QR code, the fare as the largest text, station names in Hindi only, then a carbon message and an app advert' }}
                after={{ src: `${N}/ticket-new.jpg`, alt: 'The redesigned ticket for the same trip: QR beside the destination, platform 5 on the Violet Line, a line reading Change at Lajpat Nagar, then platform 3 on the Pink Line' }}
              />
              <Cap>The same two-ride trip, on the same paper roll. Drag to compare. Sample tickets, not valid.</Cap>
            </figure>
            <div className="grid gap-4">
              <figure className="case-fig"><img src={`${N}/gate-problem.jpg`} width={1600} height={1200} loading="lazy" alt="Gate screen with a yellow block reading Please ask for help, and an arrow to Customer Care" className="block h-auto w-full rounded-lg" /><Cap>A problem, and where to get help.</Cap></figure>
                          </div>
          </div>
        </Section>

        {/* ---------- Manual ---------- */}
        <Section id="manual" title="The standards manual" next="Signs won’t reach everyone, so there is also a route finder." lede="A 34-page manual covers every sign and screen in trip order, and flags each number I still need to check on site.">
          <div className="track-wide mt-16 grid gap-4 sm:grid-cols-2">
            {[['01', 'Manual cover: Delhi Metro signs and screens, with a large white arrow on black'], ['05', 'Manual page on the arrow, with eight directions and three rules'], ['13', 'Manual page showing the paper ticket at actual size'], ['18', 'Manual page on the platform totem with its rules']].map(([n, a]) => (
              <img key={n} src={`${N}/manual-${n}.jpg`} width={1400} height={990} loading="lazy" alt={a} className="case-fig block h-auto w-full rounded-lg" style={{ border: '1px solid var(--rule)' }} />
            ))}
          </div>
          <p className="mt-10" style={{ fontSize: '0.95rem' }}>
            <a className="prose-link" href="/signal/Delhi-Metro-Standards-Manual.pdf" target="_blank" rel="noreferrer">Read the manual (PDF, 1 MB)</a>
          </p>
        </Section>

        {/* ---------- Saathi ---------- */}
        <Section id="saathi" title="Saathi, the route finder" next="These are the limits I know about." lede="QR boards open a route finder for people who get lost. It shows the whole trip on one screen, so they can read it once and put the phone away.">
          <AnnotatedScreen
            src="/signal/gallery/board-inside.jpg"
            width={780}
            height={1100}
            maxW="31rem"
            alt="A printed Saathi board listing major places from Kashmere Gate, the platform and line to take, and the station and exit gate nearest each place"
            pins={BOARD_PINS}
            caption="Printed-board prototype. Routes and gates come from OpenStreetMap; only Kashmere Gate and Lajpat Nagar were checked on site."
          />
          <StepVideo className="track-wide mt-16" name="saathi-trip" label="Saathi recording: a trip from Kashmere Gate to Lajpat Nagar Central Market" />
          <AnnotatedScreen
            src={`${W}/saathi-route.jpg`}
            width={780}
            height={1720}
            maxW="16.5rem"
            alt="Saathi's route to Lajpat Nagar: Take the train towards Raja Nahar Singh (Ballabhgarh); a summary card with platform 5, Violet Line, at Kashmere Gate and the exit at Lajpat Nagar; below it the full route, with 11 stops folded into one line and the exit"
            pins={SAATHI_PINS}
            caption="Saathi is an unofficial student prototype, not made with or for DMRC. It still uses the first sign style."
          />
          <p className="mt-10" style={{ fontSize: '0.95rem' }}>
            Live at <a className="prose-link" href="https://saathi-delhi-metro.vercel.app" target="_blank" rel="noreferrer">saathi-delhi-metro.vercel.app</a>.
          </p>
        </Section>

        {/* ---------- Limits ---------- */}
        <Section id="limits" title="Limits and next" lede="What each constraint made me choose, and what it cost.">
          <div className="mt-16">
            <Tradeoffs items={[
              ['The black signs are new', 'Kept the tested arrow, platform, line name and two stops, and changed only the look', 'I can’t claim the 45% to 80% result for them until I re-test'],
              ['Some riders have no smartphone', 'Every step works on signs and the ticket alone', 'The phone can only add, never fix a bad sign'],
              ['No signal underground', 'Boards where riders already ask; once opened, the route stays on the phone', 'The first scan needs signal where the board hangs'],
              ['Hindi station names on the ticket', 'One row per ride, with both stations in both scripts', 'The ticket is about 6 mm longer than today’s for a two-ride trip'],
            ]} />
          </div>
          <p className="mt-12 max-w-[36rem]" style={{ fontSize: '1.05rem', lineHeight: 1.55 }}>Apart from the phone test of the first sign, none of this has been tested with riders or built in a station. Next I’d re-test the black signs against today’s. This work only helps people who find their way by sight. Blind and low-vision riders need their own research, and <a className="prose-link" href="https://www.behance.net/gallery/184857911/MetroInSight-Innovating-Accessibility-In-DMRC" target="_blank" rel="noreferrer">MetroInSight</a> is a student project on that for the Delhi Metro.</p>
          <Subhead>References</Subhead>
          <ol className="mt-6 space-y-2" style={{ fontSize: '0.85rem' }}>
            {CREDITS.map(([t, href], i) => (
              <li key={t} id={`ref-${i + 1}`} className="grid scroll-mt-24 grid-cols-[2rem_1fr] border-t border-rule pt-2">
                <span className="text-faint tnum">[{i + 1}]</span>
                <a className="prose-link" href={href} target="_blank" rel="noreferrer">{t}</a>
              </li>
            ))}
          </ol>
        </Section>

        <footer className="mt-20 space-y-3 border-t border-rule pt-6 text-faint" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
          <p>This is the fifth idea in the project. The fourth is written up too: <a className="prose-link" href="/signal/v4">when to stop waiting during a delay</a>.</p>
          <p>Network data from OpenStreetMap; only Kashmere Gate and Lajpat Nagar are checked on site. A student proposal, not made with or for DMRC.</p>
        </footer>
      </div></div></NightZone>
    </main>
  )
}
