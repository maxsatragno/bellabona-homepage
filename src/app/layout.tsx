import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import { headers } from 'next/headers'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { defaultLocale, isSupportedLocale } from '@/i18n/config'

import './globals.css'

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
})

/**
 * Root metadata — actual per-page meta is overridden by `generateMetadata` in
 * `[locale]/page.tsx`. These act as defaults if a route forgets to set its own.
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Bella&Bona', template: '%s · Bella&Bona' },
  description:
    'Bella&Bona — workplace meal solutions for offices in Munich, Berlin, and NRW. One contract, one invoice, one dashboard.',
  applicationName: 'Bella&Bona',
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Middleware forwards `x-locale` as a request header on every locale-prefixed
  // page request. Studio and API routes skip the middleware, so they fall back
  // to the default locale, which is fine — they aren't user-facing pages.
  const headerList = await headers()
  const headerLocale = headerList.get('x-locale')
  const lang = headerLocale && isSupportedLocale(headerLocale) ? headerLocale : defaultLocale

  return (
    <html
      lang={lang}
      className={`${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Vercel Analytics + Speed Insights — collect Core Web Vitals in
            production. The scripts are gated by the deployment platform; in
            local dev they're effectively no-ops. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
