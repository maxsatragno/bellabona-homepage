import { defineType, defineField } from 'sanity'

/**
 * SEO metadata, intentionally kept separate from page content.
 *
 * The `page` document exposes this as its own tab in the Studio UI so
 * editors don't conflate content authoring with metadata authoring.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      description: 'Recommended: 50–60 characters. Falls back to the page title if empty.',
      type: 'localeString',
      validation: (r) =>
        r.custom((value: Record<string, string | undefined> | undefined) => {
          if (!value) return true
          for (const [locale, text] of Object.entries(value)) {
            if (locale.startsWith('_')) continue
            if (text && text.length > 60) {
              return `Title for ${locale.toUpperCase()} is ${text.length} characters; keep ≤ 60.`
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      description: 'Recommended: 140–160 characters.',
      type: 'localeText',
      validation: (r) =>
        r.custom((value: Record<string, string | undefined> | undefined) => {
          if (!value) return true
          for (const [locale, text] of Object.entries(value)) {
            if (locale.startsWith('_')) continue
            if (text && text.length > 160) {
              return `Description for ${locale.toUpperCase()} is ${text.length} characters; keep ≤ 160.`
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      description: 'Recommended size 1200 × 630. Used for Twitter cards too.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'canonicalOverride',
      title: 'Canonical URL override',
      description: 'Only set if this page intentionally points its canonical to a different URL.',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      description: 'Adds a `noindex` robots directive. Use sparingly.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
