import { Button, type CtaInput } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { RevealOnScroll } from '@/components/layout/RevealOnScroll'
import { SanityImage, type SanityImageSource } from '@/components/primitives/SanityImage'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

type StepProcessSection = {
  _type: 'section.stepProcess'
  heading?: LocaleValue<string>
  steps?: Array<{
    _key?: string
    title?: LocaleValue<string>
    description?: LocaleValue<string>
    image?: SanityImageSource
  }>
  cta?: CtaInput
}

export function StepProcessSection({
  section,
  locale,
}: {
  section: StepProcessSection
  locale: SupportedLocale
}) {
  const heading = pickLocaleString(section.heading, locale)
  const steps = section.steps ?? []

  return (
    <section className="py-24 md:py-32">
      <Container>
        <RevealOnScroll>
          {heading ? (
            <header className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-[30px] md:text-[60px] font-semibold tracking-tight leading-[1.1] text-brand-800">
                {heading}
              </h2>
            </header>
          ) : null}

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-[32px]">
            {steps.map((step, idx) => (
              <li key={step._key ?? idx} className="flex flex-col">
                {step.image ? (
                  <div className="relative min-h-[260px] overflow-hidden rounded-2xl md:min-h-[416px]">
                    <SanityImage
                      image={step.image}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <span className="mt-6 inline-block self-start rounded-full border border-lemon-dim bg-lemon px-4 py-1 text-sm font-medium text-brand-800">
                  Step {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="mt-4 flex flex-col gap-2">
                  <h3 className="text-xl font-semibold tracking-tight text-brand-800">
                    {pickLocaleString(step.title, locale)}
                  </h3>
                  <p className="text-base md:text-[20px] text-muted leading-relaxed">
                    {pickLocaleString(step.description, locale)}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {section.cta ? (
            <div className="mt-12 flex justify-center">
              <Button cta={section.cta} locale={locale} />
            </div>
          ) : null}
        </RevealOnScroll>
      </Container>
    </section>
  )
}
