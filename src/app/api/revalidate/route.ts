import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

import { revalidateSecret } from '@/sanity/env'

/**
 * Webhook target for Sanity to call after editorial publishes.
 *
 * Configure in Sanity:
 *   URL:  https://<deployment>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *   Method: POST
 *   Body:   the default Sanity webhook payload is fine (we don't read it).
 *
 * The webhook fires for any change in the `production` dataset. We invalidate
 * both `page` and `siteSettings` tags conservatively — over-revalidating is
 * cheap compared with the editor confusion of stale data.
 */
export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const provided = url.searchParams.get('secret')
  if (!revalidateSecret || provided !== revalidateSecret) {
    return NextResponse.json({ ok: false, reason: 'Invalid or missing secret' }, { status: 401 })
  }

  // Next 16's `revalidateTag` takes a second arg specifying when the purge
  // takes effect. `{ expire: 0 }` evicts the cached entries immediately —
  // appropriate for an editorial publish where staleness is unacceptable.
  revalidateTag('page', { expire: 0 })
  revalidateTag('siteSettings', { expire: 0 })

  return NextResponse.json({ ok: true, revalidated: ['page', 'siteSettings'] })
}

export async function GET() {
  // Quick health-check endpoint for debugging configuration. Never trust it
  // for state — POST is the only revalidating operation.
  return NextResponse.json({ status: 'revalidate webhook ready' })
}
