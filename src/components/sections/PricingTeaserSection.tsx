import { Button, type CtaInput } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { RevealOnScroll } from '@/components/layout/RevealOnScroll'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

type PricingTeaserSection = {
  _type: 'section.pricingTeaser'
  heading?: LocaleValue<string>
  intro?: LocaleValue<string>
  tiers?: Array<{
    _key?: string
    name?: LocaleValue<string>
    price?: LocaleValue<string>
    priceCaption?: LocaleValue<string>
    features?: Array<LocaleValue<string>>
    highlighted?: boolean
    cta?: CtaInput
  }>
}

export function PricingTeaserSection({
  section,
  locale,
}: {
  section: PricingTeaserSection
  locale: SupportedLocale
}) {
  const heading = pickLocaleString(section.heading, locale)
  const intro = pickLocaleString(section.intro, locale)
  const tiers = section.tiers ?? []
  if (tiers.length === 0) return null

  const cols =
    tiers.length === 1 ? 'md:grid-cols-1'
    : tiers.length === 2 ? 'md:grid-cols-2'
    : 'md:grid-cols-3'

  return (
    <section className="bg-background py-24 md:py-32">
      <Container>
        <RevealOnScroll>
          {(heading || intro) && (
            <header className="max-w-2xl mx-auto text-center mb-16">
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

          <div className={`grid grid-cols-1 ${cols} gap-6`}>
            {tiers.map((tier, idx) => {
              const isHighlight = tier.highlighted
              return (
                <article
                  key={tier._key ?? idx}
                  className={`flex flex-col rounded-3xl p-8 lg:p-10 ${
                    isHighlight
                      ? 'bg-brand-700 text-white ring-2 ring-brand-700'
                      : 'bg-light-green text-brand-800'
                  }`}
                >
                  <h3 className="text-xl font-semibold tracking-tight">
                    {pickLocaleString(tier.name, locale)}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold">
                      {pickLocaleString(tier.price, locale)}
                    </span>
                    {tier.priceCaption ? (
                      <span className={`text-sm ${isHighlight ? 'text-white/75' : 'text-muted'}`}>
                        {pickLocaleString(tier.priceCaption, locale)}
                      </span>
                    ) : null}
                  </div>
                  <ul className="mt-6 space-y-3 flex-1">
                    {(tier.features ?? []).map((f, j) => (
                      <li key={j} className={`flex items-start gap-2 text-sm ${isHighlight ? 'text-white/75' : 'text-muted'}`}>
                        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0 mt-0.5" fill="currentColor">
                          <path d="M16.7 5.3a1 1 0 0 0-1.4 0L8 12.6 4.7 9.3a1 1 0 1 0-1.4 1.4l4 4a1 1 0 0 0 1.4 0l8-8a1 1 0 0 0 0-1.4z" />
                        </svg>
                        <span>{pickLocaleString(f, locale)}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.cta ? (
                    <div className="mt-8">
                      <Button
                        cta={{ ...tier.cta, variant: isHighlight ? 'secondary' : 'primary' }}
                        locale={locale}
                        className="w-full"
                      />
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
