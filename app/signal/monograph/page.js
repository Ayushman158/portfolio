import Monograph from './monograph'

/*
 * A trial layout of the Signal case study, built as a design monograph:
 * the sign artwork shown as numbered plates, with the story set around it.
 * It lives beside /signal (which is unchanged) so the two can be compared.
 * Not indexed until he picks it.
 */
export const metadata = {
  title: 'Signal — monograph layout (trial)',
  robots: { index: false },
}

export default function SignalMonograph() {
  return <Monograph />
}
