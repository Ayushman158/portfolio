const TITLE = 'Banyan Tree — an atlas of root-cause healing'
const DESCRIPTION =
  'A health practice whose one claim is that symptoms are not causes, so the navigation goes underground. Concept, interface, front end and handover. Live at himanshugarg.in.'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Share this route and the preview shows the work, not the site-wide card.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/shipped/banyan.jpg', width: 1600, height: 900, alt: 'The Banyan Tree homepage' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/shipped/banyan.jpg'] },
}

export default function BanyanLayout({ children }) {
  return children
}
