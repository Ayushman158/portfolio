import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata = {
  title: 'Ayushman Bharadwaj | Interaction Designer',
  description: 'Portfolio of Ayushman Bharadwaj',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
      </head>
      <body className="font-sans overflow-x-hidden cursor-none">
        {children}
      </body>
    </html>
  )
}
