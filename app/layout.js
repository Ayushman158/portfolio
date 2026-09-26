import './globals.css'
import './phosphor.css'
import { ThemeProvider, themeInitScript, Lamp } from './components/theme'
import Dock from './components/dock'
import { Inter, Instrument_Sans, Instrument_Serif, Reenie_Beanie } from 'next/font/google'

// The site's two faces: Instrument Sans for everything read, Instrument Serif
// for the few lines that speak up (page titles, section headings, big numbers).
const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  adjustFontFallback: false
})

const serif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  adjustFontFallback: false
})

// Inter stays only because Signal's prototype is set in it: the hero recreates
// that product, so its screens keep the product's face. Not preloaded, since
// the page text never uses it.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  preload: false
})

const reenieBeanie = Reenie_Beanie({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-reenie-beanie'
})

// One positioning line, everywhere. It matches the home h1 and the Connect
// section rather than offering a third phrasing to anyone reading the preview.
const TITLE = 'Ayushman Bharadwaj — a designer who likes figuring things out'
const DESCRIPTION =
  'A designer who likes figuring things out, drawn to the space between people and technology. I take ideas from research through design to shipping.'

export const metadata = {
  // Absolute base so social/OG images resolve against the live site rather than
  // localhost. `.com` is not pointed yet; the vercel domain is what serves.
  metadataBase: new URL('https://ayushman-bharadwaj.vercel.app'),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    siteName: 'Ayushman Bharadwaj',
    // The work, not the avatar: a card in the site's own palette carrying the
    // one line the whole page is built to deliver.
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Ayushman Bharadwaj, a designer who likes figuring things out.' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${inter.variable} ${reenieBeanie.variable}`} suppressHydrationWarning>
      <head>
        {/* Sets the theme before first paint so a dark-preferring machine never flashes light. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Without scripts nothing runs the entrance, so show what it reveals. */}
        <noscript><style>{'.magnet-drop{opacity:1!important}'}</style></noscript>
      </head>
      <body className="font-sans overflow-x-hidden">
        <ThemeProvider>
          {/* First in the document, so the nav is the first thing a keyboard reaches. */}
          <Dock />
          <Lamp />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
