import { Container } from '@/components/primitives/Container'
import { RevealOnScroll } from '@/components/layout/RevealOnScroll'
import { SanityImage, type SanityImageSource } from '@/components/primitives/SanityImage'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

type TestimonialsSection = {
  _type: 'section.testimonials'
  heading?: LocaleValue<string>
  quotes?: Array<{
    _key?: string
    quote?: LocaleValue<string>
    author?: string
    role?: LocaleValue<string>
    company?: string
    avatar?: SanityImageSource
  }>
}

export function TestimonialsSection({
  section,
  locale,
}: {
  section: TestimonialsSection
  locale: SupportedLocale
}) {
  const heading = pickLocaleString(section.heading, locale)
  const quotes = section.quotes ?? []
  if (quotes.length === 0) return null

  return (
    <section className="bg-background py-24 md:py-32">
      <Container>
        <RevealOnScroll>
          {heading ? (
            <h2 className="text-[30px] md:text-[60px] font-semibold tracking-tight leading-[1.1] text-brand-800 max-w-3xl mb-16">
              {heading}
            </h2>
          ) : null}

          <div className={`grid gap-8 ${quotes.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {quotes.map((q, idx) => (
              <figure
                key={q._key ?? idx}
                className="flex flex-col bg-light-green rounded-3xl p-8 lg:p-10"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 32 32"
                  className="h-8 w-8 text-brand-200 mb-6"
                  fill="currentColor"
                >
                  <path d="M9.7 8.4c-3.2 1.5-4.7 4-4.7 7.4v8.6h7.4v-8.6h-3.4c0-2 1-3.6 3-4.9l-2.3-2.5zm14 0c-3.2 1.5-4.7 4-4.7 7.4v8.6h7.4v-8.6h-3.4c0-2 1-3.6 3-4.9l-2.3-2.5z" />
                </svg>
                <blockquote className="text-base md:text-[20px] leading-relaxed text-ink flex-1">
                  &ldquo;{pickLocaleString(q.quote, locale)}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {q.avatar ? (
                    <SanityImage
                      image={q.avatar}
                      width_hint={96}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : null}
                  <div>
                    <p className="font-semibold text-brand-800 text-sm">{q.author}</p>
                    {(q.role || q.company) && (
                      <p className="text-sm text-muted">
                        {pickLocaleString(q.role, locale)}
                        {q.role && q.company ? ' · ' : ''}
                        {q.company}
                      </p>
                    )}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
