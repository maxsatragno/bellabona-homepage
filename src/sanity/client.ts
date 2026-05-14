import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from './env'

/**
 * Sanity client used by Server Components and Route Handlers.
 *
 * `useCdn` is disabled so we always read the latest published data — combined with
 * Next.js's request-level cache (`{ next: { tags, revalidate } }`) this gives us
 * ISR with on-demand invalidation via webhooks, instead of stale-edge data.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
})
