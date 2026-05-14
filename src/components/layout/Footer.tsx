import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/primitives/Container'
import { PortableText } from '@/components/primitives/PortableText'
import { SanityImage, type SanityImageSource } from '@/components/primitives/SanityImage'
import { type LinkInput, resolveHref } from '@/lib/links'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

import type { PortableTextBlock } from '@portabletext/react'

type SocialMediaLink = {
  _key?: string
  icon?: SanityImageSource
  url?: string
  openInNewTab?: boolean
}

type SocialBlock = {
  title?: LocaleValue<string>
  caption?: LocaleValue<string>
  email?: string
  links?: SocialMediaLink[]
}

type FooterColumn = {
  _key?: string
  heading?: LocaleValue<string>
  links?: Array<{
    _key?: string
    label?: LocaleValue<string>
    link?: LinkInput
  }>
}

export type FooterInput = {
  socialBlock?: SocialBlock
  columns?: FooterColumn[]
  legal?: LocaleValue<PortableTextBlock[]>
}

export function Footer({
  footer,
  locale,
  dictionary,
}: {
  footer: FooterInput | null | undefined
  siteName: string | undefined
  locale: SupportedLocale
  dictionary: { footer: { copyright: string; socialAriaLabel: string } }
}) {
  const social = footer?.socialBlock
  const columns = footer?.columns ?? []
  // suppress unused-var for dictionary kept for API compat
  void dictionary

  return (
    <footer className="mt-24 bg-brand-700 pt-16 text-white md:pt-40">
      <Container className="pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Social block — first column */}
          {social ? (
            <div>
              {pickLocaleString(social.title, locale) ? (
                <h3 className="text-2xl font-bold">{pickLocaleString(social.title, locale)}</h3>
              ) : null}
              {pickLocaleString(social.caption, locale) ? (
                <p className="mt-3 text-lg text-white/75">
                  {pickLocaleString(social.caption, locale)}
                </p>
              ) : null}
              {social.email ? (
                <a
                  href={`mailto:${social.email}`}
                  className="mt-4 flex items-center gap-2 text-lg text-white/75 hover:underline underline-offset-2"
                >
                  <MailIcon />
                  {social.email}
                </a>
              ) : null}
              {social.links && social.links.length > 0 ? (
                <ul className="mt-6 flex items-center gap-4">
                  {social.links.map((s, idx) => {
                    if (!s.url) return null
                    return (
                      <li key={s._key ?? idx}>
                        <a
                          href={s.url}
                          target={s.openInNewTab ? '_blank' : undefined}
                          rel={s.openInNewTab ? 'noopener noreferrer' : undefined}
                          className="inline-block text-white/75 hover:text-white transition-colors"
                        >
                          {s.icon?.asset?._id ? (
                            <SanityImage
                              image={s.icon}
                              width_hint={48}
                              width={24}
                              height={24}
                              className="h-6 w-auto"
                            />
                          ) : null}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>
          ) : null}

          {/* Nav columns */}
          {columns.map((column, idx) => (
            <div key={column._key ?? idx}>
              <h3 className="text-2xl font-bold">
                {pickLocaleString(column.heading, locale)}
              </h3>
              <ul className="mt-6 space-y-6">
                {(column.links ?? []).map((entry, j) => {
                  const href = resolveHref(entry.link, locale)
                  if (!href) return null
                  const label = pickLocaleString(entry.label, locale)
                  return (
                    <li key={entry._key ?? j}>
                      <Link
                        href={href}
                        className="text-lg text-white/75 hover:underline underline-offset-2"
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* Full-width logo */}
      <div className="w-full overflow-hidden">
        <Image
          src="/bellabona_logo_footer.svg"
          alt="Bella&Bona"
          width={1920}
          height={300}
          className="w-full h-auto"
          priority={false}
        />
      </div>

      {/* Divider + legal — 64px below full-width logo */}
      <Container className="mt-16 pb-10">
        <div className="border-t border-lemon pt-8">
          <PortableText
            value={footer?.legal}
            locale={locale}
            className="text-center text-sm text-white/75 [&_p]:text-sm"
          />
        </div>
      </Container>
    </footer>
  )
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
    </svg>
  )
}
