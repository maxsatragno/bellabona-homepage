import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { isSupportedLocale, type SupportedLocale } from '@/i18n/config'
import { buildMetadata } from '@/lib/metadata'
import { pageBySlugQuery } from '@/sanity/queries/page'
import { sanityFetch } from '@/sanity/sanity-fetch'

/**
 * Homepage route — `/[locale]`.
 *
 * Site chrome (navbar, footer, modals) is rendered by `[locale]/layout.tsx`.
 */

export const revalidate = 60

type Params = { locale: string }

type SeoFromQuery = {
  metaTitle?: Record<string, string>
  metaDescription?: Record<string, string>
  ogImage?: { asset?: { _id?: string }; alt?: string }
  canonicalOverride?: string
  noIndex?: boolean
}

type PageDoc = {
  _id: string
  title?: string
  slug?: string
  isHome?: boolean
  seo?: SeoFromQuery
  sections?: Array<{ _type: string; _key?: string } & Record<string, unknown>>
} | null

async function getHomepage(): Promise<PageDoc> {
  return sanityFetch<PageDoc>({
    query: pageBySlugQuery,
    params: { slug: '/' },
    tags: ['page'],
  })
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params
  if (!isSupportedLocale(locale)) return {}

  const page = await getHomepage()
  return buildMetadata(page?.seo, {
    locale: locale as SupportedLocale,
    path: '/',
    fallbackTitle: 'Bella&Bona — Workplace meal solutions',
    fallbackDescription:
      'One contract, one invoice, one dashboard. Bella&Bona runs team lunches and office food programs in Munich, Berlin, and NRW.',
  })
}

export default async function HomePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params
  if (!isSupportedLocale(locale)) notFound()

  const page = await getHomepage()
  if (!page) notFound()

  return <SectionRenderer sections={page.sections ?? []} locale={locale as SupportedLocale} />
}
