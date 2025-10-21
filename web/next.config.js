/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports for GitHub Pages
  basePath: '/Power-T', // Match your repo name
  images: {
    unoptimized: true // Required for static export
  }
}

module.exports = nextConfig