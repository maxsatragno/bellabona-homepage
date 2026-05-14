import { notFound } from 'next/navigation'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SiteModals } from '@/components/layout/SiteModals'
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd'
import { supportedLocales, isSupportedLocale, type SupportedLocale } from '@/i18n/config'
import { getDictionaryCached, getSiteSettingsCached } from '@/lib/site-shell'
import { urlFor } from '@/sanity/image'

/**
 * Locale-aware layout. Renders shared site chrome (navbar, footer, modals)
 * so all pages under `/[locale]` stay consistent.
 */
export const revalidate = 60

type LocaleParams = { locale: string }

export function generateStaticParams(): LocaleParams[] {
  return supportedLocales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<LocaleParams>
}) {
  const { locale: raw } = await params
  if (!isSupportedLocale(raw)) notFound()

  const locale = raw as SupportedLocale

  const [settings, dictionary] = await Promise.all([
    getSiteSettingsCached(),
    getDictionaryCached(locale),
  ])

  const logoUrl = settings?.logo?.asset?._id
    ? urlFor(settings.logo).width(512).auto('format').url()
    : undefined

  return (
    <>
      <OrganizationJsonLd
        organization={settings?.organization}
        siteName={settings?.siteName}
        logoUrl={logoUrl}
      />
      <Navbar
        nav={settings?.nav}
        logo={settings?.logo}
        siteName={settings?.siteName}
        locale={locale}
        dictionary={dictionary}
      />
      <main id="main" data-skip-target className="flex-1">
        {children}
      </main>
      <Footer
        footer={settings?.footer}
        siteName={settings?.siteName}
        locale={locale}
        dictionary={dictionary}
      />
      <SiteModals
        demoTitle={dictionary.common.demoModalTitle}
        demoBody={dictionary.common.demoModalBody}
        closeLabel={dictionary.common.closeDialog}
      />
    </>
  )
}

export type { SupportedLocale }
