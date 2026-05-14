import { defaultLocale, type SupportedLocale } from '@/i18n/config'

/**
 * Returns the canonical absolute base URL of the deployment, e.g.
 * `https://bellabona.com`. Falls back to localhost in dev so previews work.
 */
export function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (env) return env
  return 'http://localhost:3000'
}

/**
 * Builds an absolute URL for a given locale + path. The home of each locale is
 * `/{locale}` (the test does not serve a non-localised root); other pages are
 * `/{locale}/{slug}`.
 */
export function absoluteUrl(locale: SupportedLocale, path: string = '/'): string {
  const cleaned = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `${siteUrl()}/${locale}${cleaned}`
}

/** Convenience for the default locale. */
export function defaultAbsoluteUrl(path: string = '/'): string {
  return absoluteUrl(defaultLocale, path)
}
