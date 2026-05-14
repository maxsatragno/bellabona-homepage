import type { MetadataRoute } from 'next'

import { defaultLocale, supportedLocales, xDefaultLocale } from '@/i18n/config'
import { absoluteUrl } from '@/lib/url'
import { sanityClient } from '@/sanity/client'

/**
 * Sitemap is generated at request time from Sanity's published `page` documents.
 *
 * Each page yields one entry per locale, plus locale alternates so Google can
 * de-duplicate translated pairs. The homepage gets priority 1.0; the rest 0.7.
 */

type PageRow = {
  slug: string
  isHome?: boolean
  _updatedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await sanityClient.fetch<PageRow[]>(
    /* groq */ `*[_type == "page" && defined(slug.current)]{
      "slug": slug.current,
      isHome,
      _updatedAt
    }`,
    {},
    { next: { tags: ['page'], revalidate: 300 } }
  )

  const entries: MetadataRoute.Sitemap = []
  for (const page of pages) {
    const path = page.isHome || page.slug === '/' ? '/' : page.slug.startsWith('/') ? page.slug : `/${page.slug}`
    for (const locale of supportedLocales) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: page._updatedAt,
        changeFrequency: page.isHome ? 'weekly' : 'monthly',
        priority: page.isHome ? 1.0 : 0.7,
        alternates: {
          languages: Object.fromEntries([
            ['x-default', absoluteUrl(xDefaultLocale, path)],
            ...supportedLocales.map((l) => [l, absoluteUrl(l, path)] as const),
          ]),
        },
      })
    }
  }

  // Fallback so the sitemap never ships empty during pre-launch / empty datasets.
  if (entries.length === 0) {
    entries.push({
      url: absoluteUrl(defaultLocale, '/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    })
  }

  return entries
}
