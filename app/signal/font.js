// The Saathi and sign typeface (Noto Sans with its Devanagari partner), shared by the
// specimens and the device mockups so it loads once.
import { Noto_Sans, Noto_Sans_Devanagari } from 'next/font/google'

export const latin = Noto_Sans({ subsets: ['latin'], weight: ['400', '600', '700', '800'], display: 'swap' })
export const deva = Noto_Sans_Devanagari({ subsets: ['devanagari'], weight: ['400', '600', '700'], display: 'swap' })
export const SIGN_FONT = `${latin.style.fontFamily}, ${deva.style.fontFamily}, system-ui, sans-serif`
