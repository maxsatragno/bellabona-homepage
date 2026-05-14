import { Container } from '@/components/primitives/Container'
import { RevealOnScroll } from '@/components/layout/RevealOnScroll'
import { SanityImage, type SanityImageSource } from '@/components/primitives/SanityImage'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

type CheckItem = {
  _key?: string
  icon?: SanityImageSource
  title?: LocaleValue<string>
  body?: LocaleValue<string>
}

type StatsSection = {
  _type: 'section.stats'
  heading?: LocaleValue<string>
  stats?: Array<{
    _key?: string
    value?: string
    benefitTitle?: LocaleValue<string>
    label?: LocaleValue<string>
  }>
  checklistImage?: SanityImageSource
  checklist?: CheckItem[]
}

export function StatsSection({
  section,
  locale,
}: {
  section: StatsSection
  locale: SupportedLocale
}) {
  const heading = pickLocaleString(section.heading, locale)
  const stats = section.stats ?? []
  const checklist = section.checklist ?? []

  return (
    <section className="py-24 md:py-32">
      <Container>
        <RevealOnScroll>
          {heading ? (
            <h2 className="text-center text-[30px] md:text-[60px] font-semibold tracking-tight leading-[1.1] text-brand-800 mb-12 md:mb-16">
              {heading}
            </h2>
          ) : null}

          {stats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {stats.map((s, idx) => {
                const labelText = pickLocaleString(s.label, locale)
                return (
                  <div
                    key={s._key ?? idx}
                    className="flex flex-col bg-brand-700 text-white rounded-2xl p-8 md:p-10 md:min-h-[400px]"
                  >
                    <div>
                      <p className="text-4xl md:text-5xl font-semibold tracking-tight leading-none">
                        {s.value}
                      </p>
                      <p className="mt-3 text-base md:text-[20px] font-semibold">
                        {pickLocaleString(s.benefitTitle, locale)}
                      </p>
                    </div>
                    {labelText ? (
                      <p className="mt-auto pt-6 text-base md:text-[20px] text-white/75">{labelText}</p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : null}

          {(checklist.length > 0 || section.checklistImage) ? (
            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:items-stretch">
              {section.checklistImage ? (
                <div className="relative min-h-[280px] w-full overflow-hidden rounded-2xl md:min-h-0 md:h-full">
                  <SanityImage
                    image={section.checklistImage}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    width_hint={800}
                    className="object-cover"
                  />
                </div>
              ) : null}

              {checklist.length > 0 ? (
                <div className="flex h-full min-h-[280px] flex-col gap-8 rounded-2xl bg-[#F8F7F6] p-8 md:p-10">
                  {checklist.map((item, idx) => (
                    <div key={item._key ?? idx} className="flex gap-4">
                      <div className="mt-1 flex-shrink-0">
                        {item.icon?.asset?._id ? (
                          <SanityImage
                            image={item.icon}
                            width_hint={48}
                            width={32}
                            height={32}
                            className="h-8 w-8"
                          />
                        ) : (
                          <CheckCircleSvg />
                        )}
                      </div>
                      <div>
                        <p className="text-base md:text-[20px] font-semibold text-brand-800">
                          {pickLocaleString(item.title, locale)}
                        </p>
                        {pickLocaleString(item.body, locale) ? (
                          <p className="mt-1 text-base md:text-[20px] text-muted leading-relaxed">
                            {pickLocaleString(item.body, locale)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </RevealOnScroll>
      </Container>
    </section>
  )
}

function CheckCircleSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-8 w-8 text-brand-700"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
