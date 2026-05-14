import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, supportedLocales, type SupportedLocale } from './i18n/config'

/**
 * Locale-aware redirect (Next 16 "proxy", formerly "middleware").
 *
 *  - Requests with no locale prefix (`/`, `/pricing`, …) are redirected to the
 *    preferred locale based on the `Accept-Language` header, falling back to
 *    `defaultLocale`.
 *  - The Studio route (`/studio/...`) and Next internals are excluded.
 *  - On already-localised paths we forward an `x-locale` REQUEST header so the
 *    root layout can read it via `headers()` and emit `<html lang>` correctly.
 */

const PUBLIC_FILE = /\.(.*)$/

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip Next internals, API routes, the embedded Studio, and static files.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  // If the path already begins with a supported locale segment, forward an
  // `x-locale` REQUEST header so the root layout can set <html lang> via
  // `headers()`. Response headers are not visible to server components.
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && (supportedLocales as readonly string[]).includes(segments[0]!)) {
    const forwarded = new Headers(request.headers)
    forwarded.set('x-locale', segments[0]!)
    return NextResponse.next({ request: { headers: forwarded } })
  }

  const preferred = pickLocale(request.headers.get('accept-language'))
  const target = new URL(`/${preferred}${pathname === '/' ? '' : pathname}`, request.url)
  // Preserve query string
  target.search = request.nextUrl.search

  return NextResponse.redirect(target, { status: 308 })
}

function pickLocale(acceptLanguage: string | null): SupportedLocale {
  if (!acceptLanguage) return defaultLocale
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tagRaw, qRaw] = part.trim().split(';q=')
      const tag = tagRaw?.toLowerCase().split('-')[0] ?? ''
      const q = qRaw ? Number.parseFloat(qRaw) : 1
      return { tag, q }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    if ((supportedLocales as readonly string[]).includes(tag)) {
      return tag as SupportedLocale
    }
  }
  return defaultLocale
}

export const config = {
  // Run on everything except static / internals — the function above narrows further.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
