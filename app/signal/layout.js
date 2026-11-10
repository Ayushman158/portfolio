export const metadata = {
  title: 'Finding the right platform on the Delhi Metro',
  description: 'Delhi Metro signs name a train by the last station on its line. I redesigned them around the stations riders travel to. In a phone test of the first version with 84 riders, the right platform on the first try went from 45% to 80%. I then built one concept system of signs, screens and tickets from the street to the exit.',
  openGraph: { images: [{ url: '/signal/og.jpg', width: 1200, height: 630, alt: 'Concept image: a black metro sign hanging still above a blurred crowd' }] },
  twitter: { card: 'summary_large_image', images: ['/signal/og.jpg'] },
};

export default function SignalLayout({ children }) {
  return children;
}
