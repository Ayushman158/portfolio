const TITLE = 'Hoychoy Cafe Case Study | Ayushman Bharadwaj'
const DESCRIPTION = 'Rebuilding a café’s WhatsApp ordering as a service: 6–8 minutes per order down to 2–3.'

export const metadata = {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        images: [{ url: '/shipped/hoychoy.jpg', width: 1600, height: 900, alt: 'The Hoychoy Cafe menu' }],
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/shipped/hoychoy.jpg'] },
}

// No background or text colour here. The page reads from the site's tokens so
// it follows the theme — pinning a light panel is what made the dark theme
// unreadable on this route.
export default function CaseStudyLayout({ children }) {
    return children
}
