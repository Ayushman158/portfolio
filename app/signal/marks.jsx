/*
 * The line marks on their own, without the sign fonts, so the home page can
 * show them without loading Noto. system.jsx wraps Mark with the sign face.
 */
const ON_LIGHT = '#ffffff'
const ON_DARK = '#242424'

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

export function Mark({ line, size = 40, font }) {
  const ring = line.shape === 'ring'
  const text = ring ? line.hex : line.dark ? ON_DARK : ON_LIGHT
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      {ring ? <circle cx="50" cy="50" r="38" fill="#fff" stroke={line.hex} strokeWidth="14" /> : <g fill={line.hex}>{SHAPES[line.shape]}</g>}
      <text x="50" y={line.shape === 'triangle' ? 74 : 64} textAnchor="middle" fontSize={line.letter.length > 1 ? 34 : 40} fontWeight="700" fill={text} fontFamily={font}>{line.letter}</text>
    </svg>
  )
}

