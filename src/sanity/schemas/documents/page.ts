import { defineType, defineField } from 'sanity'

/**
 * Generic page document used for the homepage and any future landing/service page.
 *
 * Why one schema for all pages: the brief asks that "a new service page should
 * take 20 minutes to add, not two days". A single page-builder schema with a
 * polymorphic `sections` array lets editors compose any layout from approved
 * primitives. The homepage is just a `page` with `slug.current === '/'`.
 *
 * SEO and content live in separate field groups so editors aren't authoring
 * meta tags in the middle of editing a hero headline.
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      description: 'Used in the Studio sidebar only — not rendered on the site.',
      type: 'string',
      group: 'settings',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: {
        source: 'title',
        maxLength: 96,
        // Allow "/" as a valid slug for the homepage.
        slugify: (input) => (input === '/' ? '/' : input.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9/-]/g, '')),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'isHome',
      title: 'Use as homepage',
      description: 'Only one page should have this flag enabled.',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'content',
      of: [
        { type: 'section.hero' },
        { type: 'section.logoCloud' },
        { type: 'section.featureGrid' },
        { type: 'section.stepProcess' },
        { type: 'section.industryCards' },
        { type: 'section.imageGallery' },
        { type: 'section.testimonials' },
        { type: 'section.stats' },
        { type: 'section.pricingTeaser' },
        { type: 'section.faq' },
        { type: 'section.mediaMentions' },
        { type: 'section.blogTeaser' },
        { type: 'section.ctaBanner' },
        { type: 'section.richText' },
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', isHome: 'isHome' },
    prepare({ title, slug, isHome }) {
      return {
        title: title || 'Untitled page',
        subtitle: isHome ? `Homepage · ${slug}` : slug,
      }
    },
  },
})
