import 'server-only'

import { sanityClient } from './client'

/**
 * Wrapper around `sanityClient.fetch` that:
 *  - registers Next.js cache tags so editorial publishes can invalidate via
 *    the `/api/revalidate` route, and
 *  - sets a baseline `revalidate` so the page is always served fresh within
 *    a minute even if no webhook fires.
 *
 * Next 16 changed `fetch()` to be uncached by default, so this opt-in is
 * required for ISR to work.
 */
export type CacheTag = 'page' | 'siteSettings'

export async function sanityFetch<T>({
  query,
  params,
  tags,
  revalidate = 60,
}: {
  query: string
  params?: Record<string, unknown>
  tags: CacheTag[]
  revalidate?: number | false
}): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {}, {
    next: {
      tags,
      revalidate: revalidate === false ? false : revalidate,
    },
  })
}
