/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  poweredByHeader: false,
  output: 'standalone',
}

module.exports = nextConfig
