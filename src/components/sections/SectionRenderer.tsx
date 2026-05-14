import type { SupportedLocale } from '@/i18n/config'

import { BlogTeaserSection } from './BlogTeaserSection'
import { CtaBannerSection } from './CtaBannerSection'
import { FaqSection } from './FaqSection'
import { FeatureGridSection } from './FeatureGridSection'
import { HeroSection } from './HeroSection'
import { ImageGallerySection } from './ImageGallerySection'
import { IndustryCardsSection } from './IndustryCardsSection'
import { LogoCloudSection } from './LogoCloudSection'
import { MediaMentionsSection } from './MediaMentionsSection'
import { PricingTeaserSection } from './PricingTeaserSection'
import { RichTextSection } from './RichTextSection'
import { StatsSection } from './StatsSection'
import { StepProcessSection } from './StepProcessSection'
import { TestimonialsSection } from './TestimonialsSection'

/**
 * Polymorphic dispatcher for page-builder sections.
 *
 * Each section variant from Sanity (`section.hero`, `section.featureGrid`, …)
 * is rendered by a sibling component. To add a new section type:
 *   1. Add the schema in `src/sanity/schemas/sections/`.
 *   2. Add the GROQ projection in `src/sanity/queries/page.ts`.
 *   3. Add a case to the switch below + the corresponding component file.
 *
 * Unknown types render a placeholder in dev so we notice GROQ/component drift
 * (e.g. P1/P2 sections whose React component has not been written yet).
 */

type AnySection = { _type: string; _key?: string } & Record<string, unknown>

export function SectionRenderer({
  sections,
  locale,
}: {
  sections: AnySection[] | null | undefined
  locale: SupportedLocale
}) {
  if (!sections || sections.length === 0) return null

  return (
    <>
      {sections.map((section, index) => (
        <SectionDispatcher
          key={section._key ?? `${section._type}-${index}`}
          section={section}
          locale={locale}
          index={index}
        />
      ))}
    </>
  )
}

function SectionDispatcher({
  section,
  locale,
  index,
}: {
  section: AnySection
  locale: SupportedLocale
  index: number
}) {
  switch (section._type) {
    // P0 — mandatory per the test brief.
    case 'section.hero':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <HeroSection section={section} locale={locale} />
    case 'section.logoCloud':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <LogoCloudSection section={section} locale={locale} />
    case 'section.featureGrid':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <FeatureGridSection section={section} locale={locale} />
    case 'section.ctaBanner':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <CtaBannerSection section={section} locale={locale} />

    // P1 — high-visibility Figma sections.
    case 'section.stepProcess':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <StepProcessSection section={section} locale={locale} />
    case 'section.testimonials':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <TestimonialsSection section={section} locale={locale} />
    case 'section.stats':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <StatsSection section={section} locale={locale} />
    case 'section.industryCards':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <IndustryCardsSection section={section} locale={locale} />

    // P2 — schema-ready, now also rendered.
    case 'section.imageGallery':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <ImageGallerySection section={section} locale={locale} />
    case 'section.pricingTeaser':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <PricingTeaserSection section={section} locale={locale} />
    case 'section.faq':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <FaqSection section={section} locale={locale} />
    case 'section.mediaMentions':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <MediaMentionsSection section={section} locale={locale} />
    case 'section.blogTeaser':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <BlogTeaserSection section={section} locale={locale} />
    case 'section.richText':
      // @ts-expect-error: GROQ-shaped object → narrowed component prop type
      return <RichTextSection section={section} locale={locale} />

    default: {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[SectionRenderer] No component for "${section._type}" yet — placeholder rendered.`)
      }
      return (
        <section
          className="border border-dashed border-line py-12 px-6"
          aria-label={`Unrendered section ${section._type}`}
          data-section-placeholder={section._type}
        >
          <div className="max-w-3xl mx-auto text-center text-muted text-sm">
            <p className="font-mono">
              {String(index + 1).padStart(2, '0')} · <code>{section._type}</code>
            </p>
            <p className="mt-2">Schema present · component pending.</p>
            <p className="mt-1 text-xs">Locale: {locale}</p>
          </div>
        </section>
      )
    }
  }
}
