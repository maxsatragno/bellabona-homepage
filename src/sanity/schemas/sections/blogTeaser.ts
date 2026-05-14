import { defineType, defineField } from 'sanity'

/**
 * Blog teaser — a small set of featured posts.
 *
 * Posts reference is loose here since blog migration is out of scope for the test;
 * the schema is shaped so we can add a `blogPost` document later without breaking
 * existing pages.
 */
export const blogTeaserSection = defineType({
  name: 'section.blogTeaser',
  title: 'Blog teaser',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
    defineField({ name: 'intro', title: 'Intro', type: 'localeText' }),
    defineField({
      name: 'manualPosts',
      title: 'Featured posts (manual)',
      description: 'Used until the blog schema is migrated. Replace with references later.',
      type: 'array',
      validation: (r) => r.max(6),
      of: [
        {
          type: 'object',
          name: 'manualPost',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'excerpt', title: 'Excerpt', type: 'localeText' }),
            defineField({
              name: 'image',
              title: 'Cover',
              type: 'image',
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
            }),
            defineField({ name: 'href', title: 'URL', type: 'url', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'title.en', media: 'image' } },
        },
      ],
    }),
    defineField({ name: 'cta', title: 'CTA (e.g. View all)', type: 'cta' }),
  ],
  preview: { prepare: () => ({ title: 'Blog teaser' }) },
})
