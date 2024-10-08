/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  // Build `/src/pages/example/index.tsx` to `out/example/index.html` instead of `out/example.html`
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
