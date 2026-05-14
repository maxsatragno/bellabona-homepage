import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Pin the workspace root so Next ignores any stray lockfile in parent dirs
  // (e.g. a leftover `~/package-lock.json` in the developer's home directory).
  turbopack: {
    root: path.resolve('.'),
  },

  // Allow next/image to serve from the Sanity CDN.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
    ],
  },
}

export default nextConfig
