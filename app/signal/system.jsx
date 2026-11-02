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

/* Every line: colour, mark shape, letter, the text that sits on it. */
export const LINES = [
  { id: 'red', en: 'Red Line', hi: 'लाल लाइन', hex: '#d32f2f', letter: 'R', shape: 'square' },
  { id: 'yellow', en: 'Yellow Line', hi: 'पीली लाइन', hex: '#d4ac14', letter: 'Y', shape: 'diamond', dark: true },
  { id: 'blue', en: 'Blue Line', hi: 'नीली लाइन', hex: '#1f5bc4', letter: 'B', shape: 'circle' },
  { id: 'green', en: 'Green Line', hi: 'हरी लाइन', hex: '#1f7a33', letter: 'G', shape: 'triangle' },
  { id: 'violet', en: 'Violet Line', hi: 'वायलेट लाइन', hex: '#7b3fe0', letter: 'V', shape: 'hexagon' },
  { id: 'pink', en: 'Pink Line', hi: 'पिंक लाइन', hex: '#c2185b', letter: 'P', shape: 'ring' },
  { id: 'magenta', en: 'Magenta Line', hi: 'मैजेंटा लाइन', hex: '#9b1b8e', letter: 'M', shape: 'octagon' },
  { id: 'grey', en: 'Grey Line', hi: 'ग्रे लाइन', hex: '#646464', letter: 'Gy', shape: 'pill' },
  { id: 'orange', en: 'Airport Express', hi: 'एयरपोर्ट एक्सप्रेस', hex: '#e8742a', letter: 'A', shape: 'pentagon', dark: true },
]

const SHAPES = {
  square: <rect x="10" y="10" width="80" height="80" rx="6" />,
  diamond: <polygon points="50,2 98,50 50,98 2,50" />,
  circle: <circle cx="50" cy="50" r="45" />,
  triangle: <polygon points="50,6 96,90 4,90" />,
  hexagon: <polygon points="50,3 90.7,26.5 90.7,73.5 50,97 9.3,73.5 9.3,26.5" />,
  octagon: <polygon points="68.4,5.7 94.3,31.6 94.3,68.4 68.4,94.3 31.6,94.3 5.7,68.4 5.7,31.6 31.6,5.7" />,
  pill: <rect x="2" y="24" width="96" height="52" rx="26" />,
  pentagon: <polygon points="50,6 95.7,39.2 78.2,92.8 21.8,92.8 4.3,39.2" />,
}

export function Mark({ line, size = 40 }) {
  const ring = line.shape === 'ring'
  const text = ring ? line.hex : line.dark ? ON_DARK : ON_LIGHT
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      {ring ? <circle cx="50" cy="50" r="38" fill="#fff" stroke={line.hex} strokeWidth="14" /> : <g fill={line.hex}>{SHAPES[line.shape]}</g>}
      <text x="50" y={line.shape === 'triangle' ? 74 : 64} textAnchor="middle" fontSize={line.letter.length > 1 ? 34 : 40} fontWeight="700" fill={text} fontFamily={SIGN_FONT}>{line.letter}</text>
    </svg>
  )
}

const Label = ({ children, className = '' }) => <p className={`text-faint ${className}`} style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{children}</p>
const Ref = ({ n }) => <a href={`#ref-${n}`} className="text-faint align-super" style={{ fontSize: '0.7em' }} aria-label={`Reference ${n}`}>[{n}]</a>

/* The system at a glance: the parts before any explanation. */
export function Collage() {
  const tile = 'overflow-hidden rounded-xl'
  const violet = LINES.find((l) => l.id === 'violet')
  return (
    <div className="track-wide mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4" style={{ fontFamily: SIGN_FONT }}>
      <img src={`${W}/render-totem.jpg`} alt="Concept render: a platform totem for platform 5, Violet Line, listing the next five stops" className={`${tile} col-span-2 row-span-2 block h-full w-full object-cover`} style={{ border: '1px solid var(--rule)' }} />
      <div className={`${tile} grid aspect-square place-items-center`} style={{ background: PANEL }} role="img" aria-label="Platform badge: 5 on violet">
        <span className="grid h-[44%] w-[44%] place-items-center rounded-xl" style={{ background: violet.hex, border: '4px solid #fbfbf8', color: '#fbfbf8', fontSize: 'clamp(2rem, 5vw, 3.6rem)', fontWeight: 800 }}>5</span>
      </div>
      <div className={`${tile} flex aspect-square flex-col justify-between p-4`} style={{ background: '#fbfbf8', color: ON_DARK }}>
        <span style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5c5c5c' }}>Noto Sans · Devanagari</span>
        <span style={{ lineHeight: 1.1 }}>
          <span className="block" style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2.1rem)', fontWeight: 700 }}>मंडी हाउस</span>
          <span className="block" style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2.1rem)', fontWeight: 700 }}>Mandi House</span>
        </span>
      </div>
      <div className={`${tile} grid aspect-square grid-cols-3 place-items-center gap-1 p-4`} style={{ background: '#fbfbf8' }} role="img" aria-label="Line marks: a shape and a letter for each line">
        {LINES.slice(0, 9).map((l) => <Mark key={l.id} line={l} size={34} />)}
      </div>
      <div className={`${tile} grid aspect-square place-items-center`} style={{ background: '#fbfbf8' }} role="img" aria-label="The arrow tile: a square outline with an arrow, the same size as the platform badge">
        <span className="grid h-[44%] w-[44%] place-items-center rounded-xl" style={{ border: '4px solid #1f2a6b' }}>
          <svg viewBox="0 0 100 100" className="h-[70%] w-[70%]" aria-hidden="true"><g transform="rotate(-135 50 50)"><path d="M12 50 H82 M54 22 L82 50 L54 78" fill="none" stroke="#1f2a6b" strokeWidth="16" /></g></svg>
        </span>
      </div>
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

/* The system in place: concept renders whose sign faces are the real artwork. */
export function Applications() {
  return (
    <figure className="track-wide mt-12">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['render-fork', 'The arrow points to the path', 'Concept render: the Kashmere Gate fork sign, with the left, straight and right paths below arrows 3, 5 and 4'],
          ['render-totem', 'The number decides', 'Concept render: a platform totem for platform 5, Violet Line, with the next five stops'],
          ['render-entrance', 'The board opens the route', 'Concept render: the entrance board on a pillar by the stairs, a phone showing the Saathi page it opens'],
        ].map(([src, cap, alt]) => (
          <div key={src}>
            <img src={`${W}/${src}.jpg`} alt={alt} loading="lazy" className="block aspect-[4/3] w-full rounded-xl object-cover" style={{ border: '1px solid var(--rule)' }} />
            <Label className="mt-2">{cap}</Label>
          </div>
        ))}
      </div>
      <figcaption className="text-faint mt-3" style={{ fontSize: '0.82rem' }}>Concept renders; the sign faces, poster and screen are the real designs.</figcaption>
    </figure>
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
