'use client'

/**
 * Embedded Sanity Studio mounted at /studio.
 *
 * Marked as a Client Component because Studio internals rely on React Context
 * (`createContext`). Route-level metadata / `dynamic` config lives in the
 * sibling `layout.tsx` (which stays a Server Component).
 */

import { NextStudio } from 'next-sanity/studio'

import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
