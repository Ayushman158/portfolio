import './globals.css'
import './phosphor.css'
import { ThemeProvider, themeInitScript } from './components/theme'
import Dock from './components/dock'
import { Inter, Reenie_Beanie, Caveat } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const reenieBeanie = Reenie_Beanie({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-reenie-beanie'
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat'
})

// One positioning line, everywhere. It matches the home h1 and the Connect
// section rather than offering a third phrasing to anyone reading the preview.
const TITLE = 'Ayushman Bharadwaj — interaction designer who ships the code'
const DESCRIPTION =
  'Interaction designer who ships the code. A year in security engineering before design; I build products from research to interface to production.'

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
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'An interaction designer who ships the code.' }],
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
    <html lang="en" className={`${inter.variable} ${reenieBeanie.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        {/* Sets the theme before first paint so a dark-preferring machine never flashes light. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans overflow-x-hidden">
        <ThemeProvider>
          {children}
          <Dock />
        </ThemeProvider>
      </body>
    </html>
  )
}
