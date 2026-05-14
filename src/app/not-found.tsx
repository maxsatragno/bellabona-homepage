import Link from 'next/link'
import { headers } from 'next/headers'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SiteModals } from '@/components/layout/SiteModals'
import { Container } from '@/components/primitives/Container'
import { defaultLocale, isSupportedLocale, type SupportedLocale } from '@/i18n/config'
import { getDictionaryCached, getSiteSettingsCached } from '@/lib/site-shell'

/**
 * Global 404 — same navbar and footer as locale pages so users can navigate out.
 * `x-locale` is set by `proxy.ts` on locale-prefixed requests.
 */
export default async function NotFound() {
  const headerList = await headers()
  const raw = headerList.get('x-locale')
  const locale: SupportedLocale =
    raw && isSupportedLocale(raw) ? (raw as SupportedLocale) : defaultLocale

  const [settings, dictionary] = await Promise.all([
    getSiteSettingsCached(),
    getDictionaryCached(locale),
  ])

  return (
    <>
      <Navbar
        nav={settings?.nav}
        logo={settings?.logo}
        siteName={settings?.siteName}
        locale={locale}
        dictionary={dictionary}
      />
      <main id="main" data-skip-target className="flex-1">
        <Container className="py-24 md:py-32">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-800">
            {dictionary.common.notFoundTitle}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted leading-relaxed">
            {dictionary.common.notFoundDescription}
          </p>
          <Link
            href={`/${locale}`}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-700 px-6 py-3 text-base font-medium text-white hover:bg-brand-800 transition-colors"
          >
            {dictionary.common.notFoundBackHome}
          </Link>
        </Container>
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
