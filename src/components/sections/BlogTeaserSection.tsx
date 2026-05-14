import Link from 'next/link'

import { Button, type CtaInput } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { RevealOnScroll } from '@/components/layout/RevealOnScroll'
import { SanityImage, type SanityImageSource } from '@/components/primitives/SanityImage'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

type BlogTeaserSection = {
  _type: 'section.blogTeaser'
  heading?: LocaleValue<string>
  intro?: LocaleValue<string>
  manualPosts?: Array<{
    _key?: string
    title?: LocaleValue<string>
    excerpt?: LocaleValue<string>
    href?: string
    image?: SanityImageSource
  }>
  cta?: CtaInput
}

export function BlogTeaserSection({
  section,
  locale,
}: {
  section: BlogTeaserSection
  locale: SupportedLocale
}) {
  const heading = pickLocaleString(section.heading, locale)
  const intro = pickLocaleString(section.intro, locale)
  const posts = section.manualPosts ?? []
  if (posts.length === 0) return null

  return (
    <section className="bg-background py-24 md:py-32">
      <Container>
        <RevealOnScroll>
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              {heading ? (
                <h2 className="text-[30px] md:text-[60px] font-semibold tracking-tight leading-[1.1] text-brand-800">
                  {heading}
                </h2>
              ) : null}
              {intro ? (
                <p className="mt-4 text-base md:text-[20px] text-muted leading-relaxed">{intro}</p>
              ) : null}
            </div>
            {section.cta ? <Button cta={section.cta} locale={locale} /> : null}
          </header>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => {
              const title = pickLocaleString(post.title, locale)
              const excerpt = pickLocaleString(post.excerpt, locale)
              const href = post.href ?? '#'
              return (
                <li key={post._key ?? idx}>
                  <Link href={href} className="group block">
                    {post.image ? (
                      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-line/30 mb-5">
                        <SanityImage
                          image={post.image}
                          width_hint={900}
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <h3 className="text-xl font-semibold tracking-tight text-brand-800 group-hover:underline underline-offset-4">
                      {title}
                    </h3>
                    {excerpt ? (
                      <p className="mt-2 text-base md:text-[20px] text-muted leading-relaxed line-clamp-3">{excerpt}</p>
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
