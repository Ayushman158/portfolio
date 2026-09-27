/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Choose Assam is a standalone static case study in public/choose-assam
  // (its own HTML, film and microsite), served at a clean URL.
  async rewrites() {
    return [{ source: '/choose-assam', destination: '/choose-assam/index.html' }]
  },
}

module.exports = nextConfig
