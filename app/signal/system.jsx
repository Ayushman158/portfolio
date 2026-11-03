/*
 * The sign system as documentation: the module, the type, the
 * line colours and their measured contrast. Values are the app's tokens
 * (signal-wayfinding/signal-build-kit/design-system/tokens.json); contrast is
 * computed here from them, not typed in, so the table can't drift from the colours.
 * Inside the specimens colour is content (it is the sign); the page around them
 * keeps to the site's tokens.
 */
import { Noto_Sans, Noto_Sans_Devanagari } from 'next/font/google'
import { W } from './wayfinding'
import { LINES, Mark as BaseMark } from './marks'

const latin = Noto_Sans({ subsets: ['latin'], weight: ['400', '600', '700', '800'], display: 'swap' })
const deva = Noto_Sans_Devanagari({ subsets: ['devanagari'], weight: ['400', '600', '700'], display: 'swap' })
const SIGN_FONT = `${latin.style.fontFamily}, ${deva.style.fontFamily}, system-ui, sans-serif`

const PANEL = '#1f2a6b'
const ON_LIGHT = '#ffffff'
const ON_DARK = '#242424'

/* WCAG 2 contrast from two hex colours. */
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

export { LINES }

export const Mark = (props) => <BaseMark font={SIGN_FONT} {...props} />

const Label = ({ children, className = '' }) => <p className={`text-faint ${className}`} style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{children}</p>
const Ref = ({ n }) => <a href={`#ref-${n}`} className="text-faint align-super" style={{ fontSize: '0.7em' }} aria-label={`Reference ${n}`}>[{n}]</a>

/* The work at a glance: a sign in place, the app, the badge and the line marks. */
export function Collage() {
  const tile = 'overflow-hidden rounded-xl'
  const violet = LINES.find((l) => l.id === 'violet')
  return (
    <div className="track-wide mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2" style={{ fontFamily: SIGN_FONT }}>
      <img src={`${W}/render-blade.jpg`} alt="Concept render: a violet platform 5 blade sign on a concrete wall in soft sunlight" className={`${tile} col-span-2 block aspect-square h-full w-full object-cover sm:row-span-2 sm:aspect-auto`} style={{ border: '1px solid var(--rule)' }} />
      <div className={`${tile} row-span-2 grid place-items-center p-3 sm:p-4`} style={{ background: '#e9e4f7' }}>
        <div className="w-full max-w-[12rem] overflow-hidden rounded-[1.6rem]" style={{ border: '5px solid #121212', background: '#121212' }}>
          <img src={`${W}/saathi-screen-platform.jpg`} alt="Saathi, the route finder: Platform 5, straight ahead, Violet Line" className="block w-full" />
        </div>
      </div>
      <div className={`${tile} grid aspect-square place-items-center`} style={{ background: PANEL }} role="img" aria-label="Platform badge: 5 on violet">
        <span className="grid h-[44%] w-[44%] place-items-center rounded-xl" style={{ background: violet.hex, border: '4px solid #fbfbf8', color: '#fbfbf8', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', fontWeight: 800 }}>5</span>
      </div>
      <div className={`${tile} grid aspect-square grid-cols-3 place-items-center gap-1 p-4`} style={{ background: '#fbfbf8' }} role="img" aria-label="Line marks: a shape and a letter for each line">
        {LINES.slice(0, 9).map((l) => <Mark key={l.id} line={l} size={30} />)}
      </div>
    </div>
  )
}

/* The two problems: a sign the rider can't read, and no help once they're lost. */
export function Mismatch() {
  return (
    <div className="track-wide mt-14 space-y-3" style={{ fontFamily: SIGN_FONT }}>
    <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
      <div className="rounded-xl p-6 sm:p-8" style={{ background: '#fbfbf8', color: ON_DARK }}>
        <Label className="!text-[#5c5c5c]">What the rider knows</Label>
        <p className="mt-6" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, lineHeight: 1.1 }}>Lajpat Nagar</p>
        <p className="mt-2" style={{ color: '#5c5c5c' }}>The place they’re going</p>
      </div>
      <div className="grid place-items-center py-2 text-faint" aria-hidden="true" style={{ fontSize: '2rem' }}>≠</div>
      <div className="rounded-xl p-6 sm:p-8" style={{ background: PANEL, color: '#fbfbf8' }}>
        <Label className="!text-[#c9cff0]">What the sign says</Label>
        <p className="mt-6" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 700, lineHeight: 1.15 }}>Towards Raja Nahar Singh (Ballabhgarh)</p>
        <p className="mt-2" style={{ color: '#c9cff0' }}>The last station of the line</p>
      </div>
    </div>
      <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl p-6 sm:p-8" style={{ background: '#fbfbf8', color: ON_DARK }}>
          <Label className="!text-[#5c5c5c]">When a new rider is lost</Label>
          <p className="mt-6" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 700, lineHeight: 1.15 }}>“Which way now?”</p>
          <p className="mt-2" style={{ color: '#5c5c5c' }}>Inside the station, below ground</p>
        </div>
        <div className="grid place-items-center py-2 text-faint" aria-hidden="true" style={{ fontSize: '2rem' }}>≠</div>
        <div className="rounded-xl p-6 sm:p-8" style={{ background: PANEL, color: '#fbfbf8' }}>
          <Label className="!text-[#c9cff0]">What there is to help</Label>
          <p className="mt-6" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 700, lineHeight: 1.15 }}>No signal for a map</p>
          <p className="mt-2" style={{ color: '#c9cff0' }}>And the sign above is the one that confused them</p>
        </div>
      </div>
    </div>
  )
}

/* The key as a still diagram: the real sign row, with its three parts called out. */
export function KeyDiagram() {
  const violet = LINES.find((l) => l.id === 'violet').hex
  const tile = 'clamp(3.4rem, 9vw, 5.5rem)'
  return (
    <figure className="track-wide mt-16" style={{ fontFamily: SIGN_FONT }}>
      <div className="flex items-center gap-3 rounded-xl p-5 sm:gap-5 sm:p-7" style={{ background: PANEL }} role="img" aria-label="A sign row: an arrow, platform 5 on violet, Violet Line, Mandi House and Lajpat Nagar">
        <span className="grid shrink-0 place-items-center rounded-lg" style={{ width: tile, height: tile, border: '3px solid #fbfbf8' }}>
          <svg viewBox="0 0 24 24" className="h-[64%] w-[64%]" aria-hidden="true"><path d="M12 20V4M5 11l7-7 7 7" fill="none" stroke="#fbfbf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <span className="grid shrink-0 place-items-center rounded-lg" style={{ width: tile, height: tile, background: violet, border: '3px solid #fbfbf8', color: '#fbfbf8', fontSize: 'clamp(1.8rem, 4.6vw, 3rem)', fontWeight: 800 }}>5</span>
        <span className="min-w-0" style={{ color: '#fbfbf8' }}>
          <span className="block truncate" style={{ fontSize: 'clamp(0.7rem, 1.6vw, 0.9rem)', color: '#c9cff0' }}>वायलेट लाइन · Violet Line</span>
          <span className="block truncate" style={{ fontSize: 'clamp(1rem, 3vw, 1.75rem)', fontWeight: 700 }}>मंडी हाउस · लाजपत नगर</span>
          <span className="block truncate" style={{ fontSize: 'clamp(1rem, 3vw, 1.75rem)', fontWeight: 700 }}>Mandi House · Lajpat Nagar</span>
        </span>
      </div>
      <ol className="mt-4 grid grid-cols-3 gap-3">
        {[['The number', 'The platform, carried from the ticket to the train'], ['The colour', 'The badge is the line’s colour'], ['The name', 'Two stations riders travel to']].map(([t, d], i) => (
          <li key={t} className="border-t border-rule pt-3">
            <Label>{String(i + 1).padStart(2, '0')} · {t}</Label>
            <p className="text-ink mt-1" style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{d}</p>
          </li>
        ))}
      </ol>
    </figure>
  )
}

/* The line marks under each colour-vision type (Machado 2009, full severity), side by side. */
const CVD = [
  ['Normal', null],
  ['Protanopia', '0.152286 1.052583 -0.204868 0 0  0.114503 0.786281 0.099216 0 0  -0.003882 -0.048116 1.051998 0 0  0 0 0 1 0'],
  ['Deuteranopia', '0.367322 0.860646 -0.227968 0 0  0.280085 0.672501 0.047413 0 0  -0.011820 0.042940 0.968881 0 0  0 0 0 1 0'],
  ['Tritanopia', '1.255528 -0.076749 -0.178779 0 0  -0.078411 0.930809 0.147602 0 0  0.004733 0.691367 0.303900 0 0  0 0 0 1 0'],
]
export function ColourVision() {
  return (
    <figure className="track-wide mt-10">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        {CVD.map(([n, m], i) => m && <filter key={n} id={`cvd-${i}`} colorInterpolationFilters="linearRGB"><feColorMatrix type="matrix" values={m} /></filter>)}
      </svg>
      <div className="space-y-2">
        {CVD.map(([n, m], i) => (
          <div key={n} className="grid grid-cols-[7rem_1fr] items-center gap-2 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <Label>{n}</Label>
            <div className="grid grid-cols-9 gap-1 rounded-lg p-2" style={{ background: '#fbfbf8', filter: m ? `url(#cvd-${i})` : 'none' }}>
              {LINES.map((l) => <span key={l.id} className="mx-auto block w-full max-w-[30px] [&>svg]:h-auto [&>svg]:w-full"><Mark line={l} size={30} /></span>)}
            </div>
          </div>
        ))}
      </div>
      <figcaption className="text-faint mt-3" style={{ fontSize: '0.82rem' }}>Colours merge for some riders; the shapes and letters never do.<Ref n={1} /></figcaption>
    </figure>
  )
}

/* How far each part of the sign reads, from its cap height (×150 in poor conditions to ×400 in good). */
export function ReadingDistance() {
  const rows = [['Platform number', 105, 16, 42], ['Station names', 60, 9, 24], ['Line name', 25, 4, 10]]
  const max = 42
  return (
    <div className="track-wide mt-10">
      {rows.map(([n, cap, lo, hi]) => (
        <div key={n} className="grid grid-cols-[8rem_1fr_5.5rem] items-center gap-4 border-t border-rule py-3 sm:grid-cols-[11rem_1fr_6rem]">
          <span><span className="text-ink block" style={{ fontSize: '0.95rem' }}>{n}</span><span className="text-faint block font-mono" style={{ fontSize: '0.75rem' }}>{cap} mm cap</span></span>
          <span className="relative h-2 rounded-full" style={{ background: 'var(--rule)' }}>
            <span className="absolute inset-y-0 rounded-full" style={{ left: `${(lo / max) * 100}%`, width: `${((hi - lo) / max) * 100}%`, background: 'var(--ink)' }} />
          </span>
          <span className="text-ink tnum text-right" style={{ fontSize: '0.9rem' }}>{lo}–{hi} m</span>
        </div>
      ))}
      <p className="text-faint border-t border-rule pt-3" style={{ fontSize: '0.82rem' }}>The number and arrow carry the decision from across the hall; the names confirm it closer in. Rule of thumb, to be measured on site.</p>
    </div>
  )
}

export function Principles() {
  return (
    <div className="mt-10 grid gap-x-8 gap-y-6 border-t border-rule pt-6 sm:grid-cols-3">
      {[
        ['Number first', 'The platform number is the largest thing everywhere.'],
        ['Real stations', 'Each direction names two stations riders go to.'],
        ['Never colour alone', 'Every colour carries a number, a name and a shape.'],
      ].map(([t, d]) => (
        <div key={t}>
          <p className="text-ink">{t}</p>
          <p className="mt-1" style={{ fontSize: '0.92rem' }}>{d}</p>
        </div>
      ))}
    </div>
  )
}

/* One sign row on the 50 mm module, with its dimensions. Units in the drawing are U × 10. */
export function GridSpec() {
  const U = 10
  const violet = LINES.find((l) => l.id === 'violet').hex
  const dim = { stroke: 'currentColor', strokeWidth: 0.6 }
  const tick = (x, y, h) => <line x1={x} y1={y - h} x2={x} y2={y + h} {...dim} />
  return (
    <figure className="track-wide mt-10 overflow-x-auto">
      {/* Below ~40rem the drawing would shrink past legibility, so it scrolls instead. */}
      <svg viewBox="-20 -40 480 150" className="block w-full min-w-[40rem] text-faint" role="img" aria-label="One sign row on the module: 6U high; arrow tile and platform badge are 4U squares one U apart; text starts at 11U; station names have 1.2U caps." style={{ fontFamily: SIGN_FONT }}>
        {/* the module grid */}
        <g opacity="0.35">
          {Array.from({ length: 41 }, (_, i) => <line key={`v${i}`} x1={i * U} y1="0" x2={i * U} y2={6 * U} stroke="currentColor" strokeWidth={i % 5 ? 0.15 : 0.35} />)}
          {Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * U} x2={40 * U} y2={i * U} stroke="currentColor" strokeWidth="0.15" />)}
        </g>
        <rect x="0" y="0" width={40 * U} height={6 * U} fill={PANEL} opacity="0.92" />
        {/* arrow tile and badge: 4U squares, one U apart */}
        <rect x={U} y={U} width={4 * U} height={4 * U} rx="2" fill="none" stroke="#fbfbf8" strokeWidth="1.2" />
        <path d="M30 42 V18 M21 27 L30 18 L39 27" fill="none" stroke="#fbfbf8" strokeWidth="4" strokeLinejoin="miter" />
        <rect x={6 * U} y={U} width={4 * U} height={4 * U} rx="2.5" fill={violet} stroke="#fbfbf8" strokeWidth="1.4" />
        <text x={8 * U} y={U + 31} textAnchor="middle" fontSize="28" fontWeight="800" fill="#fbfbf8">5</text>
        {/* text from 11U: line name, Hindi, English */}
        <text x={11 * U} y={U + 3} fontSize="5" fontWeight="600" fill="#c9cff0">Violet Line · वायलेट लाइन</text>
        <text x={11 * U} y={U + 17} fontSize="13" fontWeight="700" fill="#fbfbf8">मंडी हाउस · लाजपत नगर</text>
        <text x={11 * U} y={U + 33} fontSize="13" fontWeight="700" fill="#fbfbf8">Mandi House · Lajpat Nagar</text>
        {/* dimensions */}
        <g fontSize="6" fill="currentColor">
          <line x1={U} y1="-12" x2={5 * U} y2="-12" {...dim} />{tick(U, -12, 3)}{tick(5 * U, -12, 3)}
          <text x={3 * U} y="-17" textAnchor="middle">4U</text>
          <line x1={5 * U} y1="-12" x2={6 * U} y2="-12" {...dim} />{tick(6 * U, -12, 3)}
          <text x={5.5 * U} y="-17" textAnchor="middle">U</text>
          <line x1={6 * U} y1="-12" x2={10 * U} y2="-12" {...dim} />{tick(10 * U, -12, 3)}
          <text x={8 * U} y="-17" textAnchor="middle">4U</text>
          <line x1={11 * U} y1="-24" x2={11 * U} y2={-4} {...dim} strokeDasharray="1.5 1.5" />
          <text x={11 * U + 2} y="-26">text starts at 11U</text>
          <line x1={41 * U} y1="0" x2={41 * U} y2={6 * U} {...dim} />{tick(41 * U, 0, 3)}{tick(41 * U, 6 * U, 3)}
          <text x={41 * U + 4} y={3 * U + 2}>6U · 300 mm</text>
          <text x="0" y={6 * U + 16}>U = 50 mm. Station names 1.2U caps, Hindi above English at the same height. Line name 0.5U.</text>
        </g>
      </svg>
    </figure>
  )
}

export function TypeSpecimen() {
  return (
    <div className="track-wide mt-10 grid gap-8 sm:grid-cols-[1.4fr_1fr]">
      <div className="rounded-xl p-6" style={{ background: '#fbfbf8', color: ON_DARK, fontFamily: SIGN_FONT }}>
        <Label className="!text-[#5c5c5c]">Hindi above English, matched by eye</Label>
        <p className="mt-4" style={{ fontFamily: deva.style.fontFamily, fontSize: 'clamp(2.6rem, 7vw, 4.6rem)', fontWeight: 700, lineHeight: 1.15 }}>मंडी हाउस</p>
        <p style={{ fontSize: 'clamp(2.4rem, 6.6vw, 4.3rem)', fontWeight: 700, lineHeight: 1.1 }}>Mandi House</p>
      </div>
      <ul className="space-y-4">
        {[
          ['Bold 700 · station names', '', 700, 'Lajpat Nagar'],
          ['Semibold 600 · line name', '', 600, 'Violet Line · वायलेट लाइन'],
          ['Regular 400 · official term', '', 400, 'Pink Line Circular (−)'],
        ].map(([w, d, fw, sample]) => (
          <li key={w} className="border-t border-rule pt-3">
            <Label>{w}</Label>
            <p className="text-ink mt-1" style={{ fontFamily: SIGN_FONT, fontWeight: fw, fontSize: '1.35rem' }}>{sample}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Every line, its mark, and the text contrast on it, measured from the tokens. */
export function LineTable() {
  const rows = [...LINES, { id: 'exit', en: 'Exit', hi: 'निकास', hex: '#1e7b3a', letter: '', shape: null }]
  return (
    <div className="track-wide mt-10 overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left" style={{ fontSize: '0.88rem' }}>
        <thead>
          <tr className="text-faint" style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <th className="py-2 pr-3 font-normal">Mark</th>
            <th className="py-2 pr-3 font-normal">Line</th>
            <th className="py-2 pr-3 font-normal">Token</th>
            <th className="py-2 pr-3 font-normal">Text on it</th>
            <th className="py-2 text-right font-normal">Contrast</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => {
            const text = l.dark ? ON_DARK : ON_LIGHT
            const r = contrast(l.hex, text)
            return (
              <tr key={l.id} className="border-t border-rule">
                <td className="py-2.5 pr-3">{l.shape ? <Mark line={l} size={30} /> : <span className="grid h-[30px] w-[30px] place-items-center rounded" style={{ background: l.hex, color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>EXIT</span>}</td>
                <td className="py-2.5 pr-3"><span className="text-ink block">{l.en}</span><span className="text-faint block" style={{ fontSize: '0.8rem' }}>{l.hi}</span></td>
                <td className="py-2.5 pr-3"><span className="text-ink block font-mono" style={{ fontSize: '0.8rem' }}>{l.hex.toUpperCase()}</span><span className="text-faint block font-mono" style={{ fontSize: '0.75rem' }}>{l.id === 'exit' ? '--exit' : `--line-${l.id}`}</span></td>
                <td className="py-2.5 pr-3"><span className="inline-block rounded px-2 py-0.5" style={{ background: l.hex, color: text, fontFamily: SIGN_FONT, fontWeight: 700 }}>Aa</span> <span className="text-faint font-mono" style={{ fontSize: '0.75rem' }}>{text.toUpperCase()}</span></td>
                <td className="py-2.5 text-right"><span className="text-ink tnum">{r.toFixed(2)}</span> <span className="ml-1 rounded px-1.5 py-0.5" style={{ fontSize: '0.7rem', border: '1px solid var(--rule)', color: r >= 4.5 ? 'var(--ink)' : 'var(--faint)' }}>{r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'Fail'}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-faint mt-3" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
        WCAG 2.2 contrast, computed from the tokens.<Ref n={2} /> Yellow and the Airport line carry dark text.
      </p>
    </div>
  )
}

/* More of the system, drifting past: only pieces that appear nowhere else on the page. */
const GALLERY = [
  ['screen-train', 'phone', 'Saathi on the train: your stop, Lajpat Nagar, and the stops to count'],
  ['board-inside', 'board', 'The inside board: a printed table of places from Kashmere Gate, each with its platform and gate'],
  ['screen-change', 'phone', 'Saathi with a change: change at Lajpat Nagar to platform 3, Pink Line'],
  ['screen-platform-hi', 'phone', 'Saathi in Hindi: platform 5, straight ahead'],
  ['board-entrance', 'board', 'The entrance board: where are you going, with the QR code that opens Saathi'],
  ['screen-exit', 'phone', 'Saathi on arrival: the exit gate and the walk'],
  ['screen-landing-hi', 'phone', 'Saathi’s first screen in Hindi'],
]
export function Gallery() {
  const h = 'h-[18rem] sm:h-[24rem]'
  const item = ([src, kind, alt], i, hidden) => (
    <img key={`${src}-${i}`} src={`/signal/gallery/${src}.jpg`} alt={hidden ? '' : alt} aria-hidden={hidden || undefined} loading="lazy"
      className={`${h} block w-auto shrink-0 object-contain ${kind === 'phone' ? 'rounded-[1.6rem]' : 'rounded-xl'}`}
      style={{ border: kind === 'phone' ? '6px solid #121212' : '1px solid var(--rule)', background: '#fbfbf8' }} />
  )
  return (
    <figure className="sig-gallery mt-24 sm:mt-32" aria-label="More screens and signs">
      <div className="sig-gallery__track flex w-max gap-4">
        {GALLERY.map((g, i) => item(g, i, false))}
        {GALLERY.map((g, i) => item(g, i + GALLERY.length, true))}
      </div>
    </figure>
  )
}

/* Today's sign and the redesign, at the same two spots. */
export function BeforeAfter() {
  const rows = [
    ['Kashmere Gate fork', 'kg-today', 'kg-new', 'Today: three platforms named only by the last station of each line', 'Redesign: one row per platform, each with its number in the line colour and two stations'],
  ]
  return (
    <div className="track-wide mt-16 space-y-12">
      {rows.map(([place, a, b, altA, altB]) => (
        <figure key={place}>
          <Label>{place}</Label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[[a, 'Today', altA], [b, 'Redesign', altB]].map(([src, tag, alt]) => (
              <div key={src} className="relative">
                <img src={`${W}/${src}.jpg`} alt={alt} loading="lazy" className="block aspect-[4/3] w-full rounded-xl object-cover" style={{ border: '1px solid var(--rule)' }} />
                <span className="absolute left-3 top-3 rounded-full px-3 py-1" style={{ background: tag === 'Today' ? 'rgba(18,18,18,.72)' : '#fbfbf8', color: tag === 'Today' ? '#fbfbf8' : '#242424', fontSize: '0.78rem', fontWeight: 600 }}>{tag}</span>
              </div>
            ))}
          </div>
        </figure>
      ))}
    </div>
  )
}

/* One trip, step by step: what a new rider had to go on, and what they have now. */
const JOURNEY = [
  ['Street', 'Which way to my train?', 'A map app, if there’s signal', 'A QR board opens Saathi; the route stays offline', 'Built · untested'],
  ['Ticket counter', 'Where do I go after the gates?', 'The fare printed largest', 'The ticket prints platform 5 · Violet Line', 'Built · 1 tester'],
  ['The fork', 'Which of three platforms?', 'One arrow, last stations only', 'One row per platform: Mandi House · Lajpat Nagar', 'Tested with 84 riders'],
  ['Top of the stairs', 'Is this my side?', 'The last station again, nothing to confirm it', 'The same violet 5 confirms it', 'Same key as the fork'],
  ['On the train', 'When do I get off?', 'Count the stations yourself', 'Saathi shows your stop and the stops to count', 'Built · untested'],
  ['Exit', 'Which gate?', 'Guess', 'Gate 5, nearest the market', 'Built · untested'],
]
export function Journey() {
  return (
    <div className="track-wide mt-16">
      <ol className="grid gap-x-6 gap-y-12 sm:grid-cols-3">
        {JOURNEY.map(([place, q, before, after, status], i) => {
          const tested = status.startsWith('Tested')
          return (
            <li key={place} className="flex flex-col">
              <img src={`/signal/journey/step-${i + 1}.jpg`} alt="" loading="lazy" className="block aspect-[535/450] w-full rounded-xl object-cover" style={{ border: '1px solid var(--rule)' }} />
              <div className="mt-4 flex items-center gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full tnum" style={{ background: 'var(--ink)', color: 'var(--ground)', fontSize: '0.72rem' }}>{i + 1}</span>
                <Label>{place}</Label>
              </div>
              <p className="text-ink mt-2" style={{ fontSize: '1.05rem', lineHeight: 1.35 }}>{q}</p>
              <p className="mt-3" style={{ fontSize: '0.9rem', lineHeight: 1.45 }}><span className="text-faint">Before: {before}.</span></p>
              <p className="text-ink mt-1" style={{ fontSize: '0.9rem', lineHeight: 1.45 }}>Now: {after}.</p>
              <span className="mt-3 self-start rounded-full px-2.5 py-0.5" style={{ fontSize: '0.72rem', border: '1px solid var(--rule)', color: tested ? 'var(--ink)' : 'var(--faint)', background: tested ? 'var(--rule)' : 'transparent' }}>{status}</span>
            </li>
          )
        })}
      </ol>
      <p className="text-faint mt-8" style={{ fontSize: '0.82rem' }}>One trip, Kashmere Gate to Lajpat Nagar Central Market, drawn as a concept storyboard. On this trip, only the fork sign has been tested with riders so far.</p>
    </div>
  )
}

export const REFERENCES = [
  ['Machado, Oliveira & Fernandes (2009). A physiologically-based model for simulation of color vision deficiency. IEEE TVCG.', 'https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html'],
  ['W3C. WCAG 2.2, Success Criteria 1.4.3 and 1.4.11.', 'https://www.w3.org/TR/WCAG22/#contrast-minimum'],
  ['Google. Material Symbols, Rounded (Apache 2.0).', 'https://fonts.google.com/icons'],
  ['Google. Noto Sans and Noto Sans Devanagari (SIL Open Font Licence).', 'https://fonts.google.com/noto'],
  ['OpenStreetMap contributors. Delhi Metro network and station gates (ODbL).', 'https://www.openstreetmap.org/copyright'],
]

export function References() {
  return (
    <ol className="mt-6 space-y-2" style={{ fontSize: '0.85rem' }}>
      {REFERENCES.map(([t, href], i) => (
        <li key={t} id={`ref-${i + 1}`} className="grid scroll-mt-24 grid-cols-[2rem_1fr] border-t border-rule pt-2">
          <span className="text-faint tnum">[{i + 1}]</span>
          <a className="prose-link" href={href} target="_blank" rel="noreferrer">{t}</a>
        </li>
      ))}
    </ol>
  )
}

export { Ref }
