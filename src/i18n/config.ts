/**
 * Supported locales for the Bella&Bona site.
 *
 * The brief asks for DE + EN with DE as primary in production. For this test we
 * default to EN (the test instructions are English-only) but the routing and
 * schemas are bilingual from day one to demonstrate i18n awareness.
 */

export const supportedLocales = ['en', 'de'] as const
export type SupportedLocale = (typeof supportedLocales)[number]

export const defaultLocale: SupportedLocale = 'en'

/** Locale used as `x-default` in hreflang annotations (production primary market). */
export const xDefaultLocale: SupportedLocale = 'de'

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (supportedLocales as readonly string[]).includes(value)
}
