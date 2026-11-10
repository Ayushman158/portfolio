// The Saathi and sign typeface (Noto Sans with its Devanagari partner), shared by the
// specimens and the device mockups so it loads once.
import { Mukta, Noto_Sans, Noto_Sans_Devanagari } from 'next/font/google'

export const latin = Noto_Sans({ subsets: ['latin'], weight: ['400', '600', '700', '800'], display: 'swap' })
export const deva = Noto_Sans_Devanagari({ subsets: ['devanagari'], weight: ['400', '600', '700'], display: 'swap' })
export const SIGN_FONT = `${latin.style.fontFamily}, ${deva.style.fontFamily}, system-ui, sans-serif`

// The redesigned system's own typeface, for sign rows and live screens.
export const mukta = Mukta({ subsets: ['latin', 'devanagari'], weight: ['500', '700', '800'], display: 'swap' })
export const MUKTA = mukta.style.fontFamily
