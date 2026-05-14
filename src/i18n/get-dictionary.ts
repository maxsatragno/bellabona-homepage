import 'server-only'

import type { SupportedLocale } from './config'

/**
 * Loader for UI strings that are NOT editorial copy — things like aria-labels,
 * skip-link text, and other interface chrome that the editor shouldn't have to
 * translate inside Sanity.
 *
 * Editorial copy (hero headlines, feature descriptions, etc.) lives in Sanity
 * as `localeString` / `localeText` / `localePortableText`. This loader is only
 * for the residual UI strings around it.
 *
 * Dictionaries are loaded with dynamic `import()` so each locale ships only
 * what's needed for the current request.
 */
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  de: () => import('./dictionaries/de.json').then((m) => m.default),
} as const

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)[SupportedLocale]>>

export async function getDictionary(locale: SupportedLocale): Promise<Dictionary> {
  return dictionaries[locale]()
}
