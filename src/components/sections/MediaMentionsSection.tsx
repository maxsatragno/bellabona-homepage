import { Container } from '@/components/primitives/Container'
import { RevealOnScroll } from '@/components/layout/RevealOnScroll'
import { SanityImage, type SanityImageSource } from '@/components/primitives/SanityImage'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

type MediaMentionsSection = {
  _type: 'section.mediaMentions'
  heading?: LocaleValue<string>
  quote?: LocaleValue<string>
  logos?: Array<{
    _key?: string
    name?: string
    url?: string | null
    image?: SanityImageSource
  }>
}

export function MediaMentionsSection({
  section,
  locale,
}: {
  section: MediaMentionsSection
  locale: SupportedLocale
}) {
  const heading = pickLocaleString(section.heading, locale)
  const quote = pickLocaleString(section.quote, locale)
  const logos = section.logos ?? []
  if (logos.length === 0 && !quote) return null

  return (
    <section className="bg-light-green py-20 md:py-24">
      <Container>
        <RevealOnScroll>
          {heading ? (
            <p className="text-center text-sm font-medium uppercase tracking-widest text-muted mb-8">
              {heading}
            </p>
          ) : null}
          {quote ? (
            <blockquote className="mx-auto max-w-3xl text-center text-2xl md:text-3xl font-medium tracking-tight text-brand-800 leading-snug mb-12">
              &ldquo;{quote}&rdquo;
            </blockquote>
          ) : null}
          {logos.length > 0 ? (
            <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {logos.map((logo, idx) => {
                if (!logo.image) return null
                const inner = (
                  <SanityImage
                    image={logo.image}
                    alt={logo.name ?? ''}
                    width_hint={300}
                    sizes="120px"
                    className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity"
                  />
                )
                return (
                  <li key={logo._key ?? idx}>
                    {logo.url ? (
                      <a href={logo.url} target="_blank" rel="noopener noreferrer" aria-label={logo.name}>
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                )
              })}
            </ul>
          ) : null}
        </RevealOnScroll>
      </Container>
    </section>
  )
}
