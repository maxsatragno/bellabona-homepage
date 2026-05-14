import {
  PortableText as BasePortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from '@portabletext/react'
import Link from 'next/link'

import { defaultLocale, isSupportedLocale, type SupportedLocale } from '@/i18n/config'

import type { LocaleValue } from '@/lib/locale-helpers'

/**
 * Renderer for Sanity Portable Text inside the localized schema we use
 * (`localePortableText` → `{ en: PortableTextBlock[], de: ... }`).
 *
 * Components for h2/h3/links/lists are styled with Tailwind utilities; if a
 * project needs richer marks (footnotes, embeds), extend the `components`
 * object below.
 */

type Props = {
  value: LocaleValue<PortableTextBlock[]> | null | undefined
  locale: SupportedLocale
  className?: string
}

export function PortableText({ value, locale, className }: Props) {
  if (!value) return null
  const blocks = value[locale] ?? value[defaultLocale]
  if (!blocks || blocks.length === 0) return null

  return (
    <div className={className}>
      <BasePortableText value={blocks} components={components} />
    </div>
  )
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-base md:text-[20px] leading-relaxed">{children}</p>,
    h2: ({ children }) => <h2 className="text-[30px] md:text-[60px] font-semibold tracking-tight leading-[1.1] mt-12 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold tracking-tight mt-8 mb-3">{children}</h3>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href ?? '#'
      const openInNewTab = (value as { openInNewTab?: boolean })?.openInNewTab ?? false
      // Internal links (relative paths) → next/link for client routing.
      if (href.startsWith('/')) {
        return <Link href={href} className="underline underline-offset-2 hover:no-underline">{children}</Link>
      }
      return (
        <a
          href={href}
          className="underline underline-offset-2 hover:no-underline"
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-1 my-4">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
}

// Re-export for clarity in callers that only need to know what a locale code is.
export { isSupportedLocale }
