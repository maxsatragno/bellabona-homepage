import { cache } from 'react'

import type { FooterInput } from '@/components/layout/Footer'
import type { NavbarInput } from '@/components/layout/Navbar'
import { type SupportedLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import type { OrganizationInput } from '@/lib/jsonld'
import { siteSettingsQuery } from '@/sanity/queries/siteSettings'
import { sanityFetch } from '@/sanity/sanity-fetch'
import type { SanityImageSource } from '@/components/primitives/SanityImage'

export type SiteSettingsShell = {
  siteName?: string
  logo?: SanityImageSource | null
  nav?: NavbarInput
  footer?: FooterInput
  organization?: OrganizationInput
} | null

export const getSiteSettingsCached = cache(async (): Promise<SiteSettingsShell> => {
  return sanityFetch<SiteSettingsShell>({
    query: siteSettingsQuery,
    tags: ['siteSettings'],
  })
})

export const getDictionaryCached = cache(async (locale: SupportedLocale) => getDictionary(locale))
