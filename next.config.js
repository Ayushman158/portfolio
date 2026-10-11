/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Choose Assam and Koi Wishing Pond are standalone static case studies in
  // public/ (their own HTML and media), served at clean URLs.
  async rewrites() {
    return [
      { source: '/choose-assam', destination: '/choose-assam/index.html' },
      { source: '/koi-wishing-pond', destination: '/koi-wishing-pond/index.html' },
    ]
  },
}

module.exports = nextConfig
