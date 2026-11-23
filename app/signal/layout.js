export const metadata = {
  title: 'Finding the right platform on the Delhi Metro',
  description: 'I redesigned Delhi Metro fork signs around the stops riders travel to. In a phone study with 84 riders, first-attempt platform accuracy was 45% with existing signs and 80% with the first redesign. I then carried the same platform cue across a proposed ticket, fare gate and fork sign.',
  openGraph: { images: [{ url: '/signal/og.jpg', width: 1200, height: 630, alt: 'Concept image: a black metro sign hanging still above a blurred crowd' }] },
  twitter: { card: 'summary_large_image', images: ['/signal/og.jpg'] },
};

export default function SignalLayout({ children }) {
  return children;
}
