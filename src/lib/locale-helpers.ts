import { defaultLocale, type SupportedLocale } from '@/i18n/config'

/**
 * Helpers for the field-level localization pattern used in Sanity. Each
 * `localeString` / `localeText` document field is shaped as
 * `{ en: '...', de: '...' }`. These helpers extract the right value for the
 * current locale, falling back to the default locale, then to an empty value.
 */

export type LocaleValue<T> = Partial<Record<SupportedLocale, T>> & {
  _type?: string
}

export function pickLocale<T>(
  value: LocaleValue<T> | null | undefined,
  locale: SupportedLocale
): T | undefined {
  if (!value) return undefined
  return value[locale] ?? value[defaultLocale]
}

export function pickLocaleString(
  value: LocaleValue<string> | null | undefined,
  locale: SupportedLocale,
  fallback: string = ''
): string {
  return pickLocale(value, locale) ?? fallback
}
