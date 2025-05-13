/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'img.youtube.com',
      'i.vimeocdn.com',
      'www.dailymotion.com',
      'i.pinimg.com',
      'odysee.com'
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  // Add headers configuration
  async headers() {
    return [
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ]
  },
}

export default nextConfig
