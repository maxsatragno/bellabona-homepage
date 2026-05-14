import { Container } from '@/components/primitives/Container'
import { RevealOnScroll } from '@/components/layout/RevealOnScroll'
import { PortableText } from '@/components/primitives/PortableText'
import { type SupportedLocale } from '@/i18n/config'
import type { LocaleValue } from '@/lib/locale-helpers'

import type { PortableTextBlock } from '@portabletext/react'

type RichTextSection = {
  _type: 'section.richText'
  content?: LocaleValue<PortableTextBlock[]>
  width?: 'narrow' | 'wide'
}

export function RichTextSection({
  section,
  locale,
}: {
  section: RichTextSection
  locale: SupportedLocale
}) {
  const inner = section.width === 'wide' ? 'max-w-4xl' : 'max-w-2xl'
  return (
    <section className="bg-background py-20 md:py-24">
      <Container>
        <RevealOnScroll>
          <PortableText
            value={section.content}
            locale={locale}
            className={`${inner} mx-auto prose-base text-ink`}
          />
        </RevealOnScroll>
      </Container>
    </section>
  )
}
