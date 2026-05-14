import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/url'

/**
 * robots.txt.
 *  - The site is fully indexable in production.
 *  - The embedded Sanity Studio (`/studio`) is disallowed: it's an editor
 *    surface, not user content, and we don't want it ranking.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  }
}
