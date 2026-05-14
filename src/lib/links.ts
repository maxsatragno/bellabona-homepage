import { type SupportedLocale } from '@/i18n/config'

/**
 * Link-resolution helpers shared by the navbar, footer, dropdown menus, and
 * any section that renders a navigation link.
 *
 * **CTAs do NOT live here.** A CTA is a button bound to a code-side action
 * (see `src/lib/cta-actions.ts`), not a link with a URL destination.
 */

export type LinkInput = {
  kind?: 'internal' | 'external'
  href?: string
  openInNewTab?: boolean
  internal?: { slug?: string }
}

/**
 * Resolves a Sanity `link` object into a renderable URL.
 *
 *  - For external links, returns the configured `href`.
 *  - For internal links, returns the locale-prefixed slug.
 *  - Returns `null` if the link is missing or malformed, so the caller can
 *    omit the anchor entirely instead of rendering a broken one.
 */
export function resolveHref(link: LinkInput | undefined, locale: SupportedLocale): string | null {
  if (!link) return null
  if (link.kind === 'external') return link.href ?? null
  const slug = link.internal?.slug
  if (!slug) return null
  if (slug === '/') return `/${locale}`
  const cleaned = slug.startsWith('/') ? slug : `/${slug}`
  return `/${locale}${cleaned}`
}
