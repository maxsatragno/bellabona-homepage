/**
 * Server-only segment config for the embedded Studio route.
 *
 * Sanity Studio itself is a Client Component (uses React Context); the page
 * file is marked `"use client"`. This layout stays a Server Component so we
 * can still export route metadata / viewport / `dynamic` (those are not
 * allowed in client modules).
 */

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children
}
