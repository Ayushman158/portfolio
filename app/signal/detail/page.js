import SignalContent from '../content'

/* The full system, for interviews: every section of the case study. */
export const metadata = {
  title: 'Signal — the full system',
  description: 'The full Signal case study: the visual system, every sign from the street to the exit, station and in-train screens, the ticket and gate, the standards manual and Saathi.',
  robots: { index: false },
}

export default function SignalDetail() {
  return <SignalContent detail />
}
