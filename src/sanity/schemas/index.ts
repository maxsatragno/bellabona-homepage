import type { SchemaTypeDefinition } from 'sanity'

import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'
import { localePortableText } from './objects/localePortableText'
import { link } from './objects/link'
import { cta } from './objects/cta'
import { seo } from './objects/seo'

import { heroSection } from './sections/hero'
import { logoCloudSection } from './sections/logoCloud'
import { featureGridSection } from './sections/featureGrid'
import { stepProcessSection } from './sections/stepProcess'
import { industryCardsSection } from './sections/industryCards'
import { imageGallerySection } from './sections/imageGallery'
import { testimonialsSection } from './sections/testimonials'
import { statsSection } from './sections/stats'
import { pricingTeaserSection } from './sections/pricingTeaser'
import { faqSection } from './sections/faq'
import { mediaMentionsSection } from './sections/mediaMentions'
import { blogTeaserSection } from './sections/blogTeaser'
import { ctaBannerSection } from './sections/ctaBanner'
import { richTextSection } from './sections/richText'

import { page } from './documents/page'
import { siteSettings } from './documents/siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Reusable primitives
  localeString,
  localeText,
  localePortableText,
  link,
  cta,
  seo,

  // Section objects (used inside page.sections)
  heroSection,
  logoCloudSection,
  featureGridSection,
  stepProcessSection,
  industryCardsSection,
  imageGallerySection,
  testimonialsSection,
  statsSection,
  pricingTeaserSection,
  faqSection,
  mediaMentionsSection,
  blogTeaserSection,
  ctaBannerSection,
  richTextSection,

  // Documents
  page,
  siteSettings,
]
