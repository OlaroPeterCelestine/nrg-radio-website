/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    loader: 'default',
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-1a0cc46c23f84b8ebf3f69e9b90b4314.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['sharp'],
}

module.exports = nextConfig
