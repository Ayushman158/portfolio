import './globals.css'
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

export const metadata = {
  title: 'Ayushman Bharadwaj | Interaction Designer',
  description: 'I\'m an interaction designer bridging human behavior and robust technology.',
  openGraph: {
    title: 'Ayushman Bharadwaj | Interaction Designer',
    description: 'I\'m an interaction designer bridging human behavior and robust technology.',
    url: 'https://ayushmanbharadwaj.com',
    siteName: 'Ayushman Bharadwaj Portfolio',
    images: [
      {
        url: '/assets/avatar.png',
        width: 800,
        height: 800,
        alt: 'Ayushman Bharadwaj',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayushman Bharadwaj | Interaction Designer',
    description: 'I\'m an interaction designer bridging human behavior and robust technology.',
    images: ['/assets/avatar.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${reenieBeanie.variable} ${caveat.variable}`}>
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
      </head>
      <body className="font-sans overflow-x-hidden cursor-none">
        {children}
      </body>
    </html>
  )
}
