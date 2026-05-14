import { groq } from 'next-sanity'

/**
 * Projects an image with the metadata we need at render time:
 *  - the asset reference (so `urlFor` can build URLs)
 *  - dimensions (for `next/image` width/height)
 *  - lqip (low-quality placeholder used as `blurDataURL`)
 *  - alt text (a11y + SEO)
 */
const imageProjection = groq`
  ...,
  alt,
  asset->{
    _id,
    metadata { dimensions, lqip }
  }
`

// CTAs are code-side actions, not links. The frontend resolves `actionId`
// via the registry in `src/lib/cta-actions.ts`; the optional `customClass`
// passes through as an extra CSS hook on the rendered <button>.
const ctaProjection = groq`
  label,
  variant,
  actionId,
  customClass
`

const linkProjection = groq`
  kind,
  href,
  openInNewTab,
  internal->{ "slug": slug.current }
`

/**
 * Section-level projection. We discriminate on `_type` and pull only the
 * fields each section component actually uses on the page. Adding a new
 * section means adding both:
 *   1. A new entry under the `_type == 'section.foo' =>` branch here, and
 *   2. A matching case in `<SectionRenderer>` on the frontend.
 */
const sectionProjection = groq`
  _type,
  _key,
  _type == 'section.hero' => {
    eyebrow,
    headline,
    subheadline,
    cta { ${ctaProjection} },
    image { ${imageProjection} },
    appLinks[] { _key, platform, url },
    rating { score, reviewCount, platform }
  },
  _type == 'section.logoCloud' => {
    eyebrow,
    logos[] {
      _key, name, url,
      image { ${imageProjection} }
    }
  },
  _type == 'section.featureGrid' => {
    heading, intro, columns,
    items[] {
      _key, title, description,
      icon { ${imageProjection} }
    }
  },
  _type == 'section.stepProcess' => {
    heading,
    steps[] {
      _key, title, description,
      image { ${imageProjection} }
    },
    cta { ${ctaProjection} }
  },
  _type == 'section.industryCards' => {
    heading, intro,
    cards[] {
      _key, title, description,
      image { ${imageProjection} },
      link { ${linkProjection} }
    }
  },
  _type == 'section.imageGallery' => {
    heading, layout,
    images[] { ${imageProjection} }
  },
  _type == 'section.testimonials' => {
    heading,
    quotes[] {
      _key, quote, author, role, company,
      avatar { ${imageProjection} }
    }
  },
  _type == 'section.stats' => {
    heading,
    stats[] { _key, value, benefitTitle, label },
    checklist[] {
      _key, title, body,
      icon { ${imageProjection} }
    },
    checklistImage { ${imageProjection} }
  },
  _type == 'section.pricingTeaser' => {
    heading, intro,
    tiers[] {
      _key, name, price, priceCaption, features, highlighted,
      cta { ${ctaProjection} }
    }
  },
  _type == 'section.faq' => {
    heading,
    items[] { _key, question, answer }
  },
  _type == 'section.mediaMentions' => {
    heading, quote,
    logos[] {
      _key, name, url,
      image { ${imageProjection} }
    }
  },
  _type == 'section.blogTeaser' => {
    heading, intro,
    manualPosts[] {
      _key, title, excerpt, href,
      image { ${imageProjection} }
    },
    cta { ${ctaProjection} }
  },
  _type == 'section.ctaBanner' => {
    content, tone,
    cta { ${ctaProjection} },
    backgroundImage { ${imageProjection} }
  },
  _type == 'section.richText' => {
    content, width
  }
`

/** Page lookup by slug. Returns null if no page exists for the slug. */
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    isHome,
    seo,
    sections[] { ${sectionProjection} }
  }
`
