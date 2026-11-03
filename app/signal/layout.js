export const metadata = {
  title: 'Helping Delhi Metro riders find their way: new signs and a QR route finder',
  description: 'Delhi Metro signs name a train by the last station on its line. I redesigned them around the stations riders travel to, added QR boards that open a route finder for riders who get lost, and tested the signs with 84 riders: the right platform on the first try went from 45% to 80%.',
  openGraph: { images: [{ url: '/signal/og.jpg', width: 1200, height: 630, alt: 'A violet platform 5 sign with the arrow tile' }] },
  twitter: { card: 'summary_large_image', images: ['/signal/og.jpg'] },
};

export default function SignalLayout({ children }) {
  return children;
}
