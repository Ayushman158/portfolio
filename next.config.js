/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Choose Assam is a standalone static case study, and the playable koi pond a
  // static page, both in public/ and served at clean URLs.
  // /resume opens the public résumé PDF (no phone number) straight from the
  // server. Rebuild the PDF from ~/Downloads/resume-v2/variants/resume-public.html if it changes.
  async redirects() {
    return [
      { source: '/resume', destination: '/Ayushman_Bharadwaj_Resume.pdf', permanent: false },
    ]
  },
  async rewrites() {
    return [
      { source: '/choose-assam', destination: '/choose-assam/index.html' },
      { source: '/koi-wishing-pond/pond', destination: '/koi-wishing-pond/pond/index.html' },
    ]
  },
}

module.exports = nextConfig
