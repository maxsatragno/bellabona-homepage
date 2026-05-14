import { Container } from '@/components/primitives/Container'
import { RevealOnScroll } from '@/components/layout/RevealOnScroll'
import { PortableText } from '@/components/primitives/PortableText'
import { SanityImage, type SanityImageSource } from '@/components/primitives/SanityImage'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

import type { PortableTextBlock } from '@portabletext/react'

type FeatureGridSection = {
  _type: 'section.featureGrid'
  heading?: LocaleValue<string>
  intro?: LocaleValue<string>
  columns?: number
  items?: Array<{
    _key?: string
    icon?: SanityImageSource
    title?: LocaleValue<string>
    description?: LocaleValue<PortableTextBlock[]>
  }>
}

const COLUMN_CLASSES: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
}

export function FeatureGridSection({
  section,
  locale,
}: {
  section: FeatureGridSection
  locale: SupportedLocale
}) {
  const heading = pickLocaleString(section.heading, locale)
  const intro = pickLocaleString(section.intro, locale)
  const cols = section.columns ?? 3
  const gridClass = COLUMN_CLASSES[cols] ?? COLUMN_CLASSES[3]

  return (
    <section className="bg-background py-24 md:py-32">
      <Container>
        <RevealOnScroll>
          {(heading || intro) && (
            <header className="max-w-2xl mb-16">
              {heading ? (
                <h2 className="text-[30px] md:text-[60px] font-semibold tracking-tight leading-[1.1] text-brand-800">
                  {heading}
                </h2>
              ) : null}
              {intro ? (
                <p className="mt-4 text-base md:text-[20px] text-muted leading-relaxed">{intro}</p>
              ) : null}
            </header>
          )}

          <ul className={`grid grid-cols-1 ${gridClass} gap-x-8 gap-y-12`}>
            {(section.items ?? []).map((item, idx) => (
              <li key={item._key ?? idx} className="flex flex-col">
                {item.icon ? (
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                    <SanityImage
                      image={item.icon}
                      width_hint={64}
                      width={28}
                      height={28}
                      className="h-7 w-7"
                    />
                  </div>
                ) : null}
                <h3 className="text-xl font-semibold text-brand-800 tracking-tight">
                  {pickLocaleString(item.title, locale)}
                </h3>
                <PortableText
                  value={item.description}
                  locale={locale}
                  className="mt-2 text-base md:text-[20px] text-muted leading-relaxed"
                />
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
