import Link from 'next/link'

import { Container } from '@/components/primitives/Container'
import { RevealOnScroll } from '@/components/layout/RevealOnScroll'
import { resolveHref, type LinkInput } from '@/lib/links'
import { SanityImage, type SanityImageSource } from '@/components/primitives/SanityImage'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

type IndustryCardsSection = {
  _type: 'section.industryCards'
  heading?: LocaleValue<string>
  intro?: LocaleValue<string>
  cards?: Array<{
    _key?: string
    title?: LocaleValue<string>
    description?: LocaleValue<string>
    image?: SanityImageSource
    link?: LinkInput
  }>
}

export function IndustryCardsSection({
  section,
  locale,
}: {
  section: IndustryCardsSection
  locale: SupportedLocale
}) {
  const heading = pickLocaleString(section.heading, locale)
  const intro = pickLocaleString(section.intro, locale)
  const cards = section.cards ?? []
  if (cards.length === 0) return null

  return (
    <section className="bg-light-green py-24 md:py-32">
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

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => {
              const href = card.link ? resolveHref(card.link, locale) : null
              const Wrapper = ({ children }: { children: React.ReactNode }) =>
                href ? (
                  <Link href={href} className="group block h-full">
                    {children}
                  </Link>
                ) : (
                  <div className="h-full">{children}</div>
                )

              return (
                <li key={card._key ?? idx} className="h-full">
                  <Wrapper>
                    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-background border border-line transition-transform duration-300 group-hover:-translate-y-1">
                      {card.image ? (
                        <div className="aspect-[4/3] overflow-hidden bg-line/30">
                          <SanityImage
                            image={card.image}
                            width_hint={1000}
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col p-6 md:p-7">
                        <h3 className="text-xl font-semibold tracking-tight text-brand-800">
                          {pickLocaleString(card.title, locale)}
                        </h3>
                        <p className="mt-2 flex-1 text-base md:text-[20px] text-muted leading-relaxed">
                          {pickLocaleString(card.description, locale)}
                        </p>
                        {href ? (
                          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 group-hover:underline underline-offset-4">
                            Learn more
                            <span aria-hidden="true">→</span>
                          </span>
                        ) : null}
                      </div>
                    </article>
                  </Wrapper>
                </li>
              )
            })}
          </ul>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
