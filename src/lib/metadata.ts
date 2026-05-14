import type { Metadata } from 'next'

import { defaultLocale, supportedLocales, xDefaultLocale, type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'
import { absoluteUrl } from '@/lib/url'
import { urlFor } from '@/sanity/image'

export type SeoInput = {
  metaTitle?: LocaleValue<string>
  metaDescription?: LocaleValue<string>
  ogImage?: { asset?: { _id?: string }; alt?: string }
  canonicalOverride?: string
  noIndex?: boolean
} | null | undefined

export type PageMetadataContext = {
  locale: SupportedLocale
  /** Path within the locale, leading slash, e.g. `/` or `/pricing`. */
  path?: string
  /** Fallback title used when `seo.metaTitle` is empty. */
  fallbackTitle?: string
  /** Fallback description used when `seo.metaDescription` is empty. */
  fallbackDescription?: string
}

/**
 * Builds a Next `Metadata` object from a Sanity `seo` field group.
 *
 * Highlights:
 *  - `alternates.languages` populates hreflang (DE + EN + x-default).
 *  - `alternates.canonical` is per-locale by default; editors can override.
 *  - `openGraph.images` uses the Sanity image with `urlFor`.
 *  - `robots: { noindex }` honours the editorial toggle.
 */
export function buildMetadata(seo: SeoInput, ctx: PageMetadataContext): Metadata {
  const { locale, path = '/', fallbackTitle, fallbackDescription } = ctx

  const title = pickLocaleString(seo?.metaTitle, locale, fallbackTitle ?? '')
  const description = pickLocaleString(seo?.metaDescription, locale, fallbackDescription ?? '')

  const canonical = seo?.canonicalOverride ?? absoluteUrl(locale, path)

  const languages: Record<string, string> = {
    'x-default': absoluteUrl(xDefaultLocale, path),
  }
  for (const loc of supportedLocales) {
    languages[loc] = absoluteUrl(loc, path)
  }

  const ogImage =
    seo?.ogImage?.asset?._id
      ? [
          {
            url: urlFor(seo.ogImage).width(1200).height(630).fit('crop').auto('format').url(),
            width: 1200,
            height: 630,
            alt: seo.ogImage.alt ?? title,
          },
        ]
      : undefined

  return {
    title: title || undefined,
    description: description || undefined,
    alternates: { canonical, languages },
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      url: canonical,
      siteName: 'Bella&Bona',
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: title || undefined,
      description: description || undefined,
      images: ogImage?.map((i) => i.url),
    },
    robots: seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

export { defaultLocale }
