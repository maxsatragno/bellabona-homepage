import { defineType, defineField } from 'sanity'

/** Use cases by industry/segment — image + title + description + optional link. */
export const industryCardsSection = defineType({
  name: 'section.industryCards',
  title: 'Industry cards',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
    defineField({ name: 'intro', title: 'Intro', type: 'localeText' }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      validation: (r) => r.min(2).max(8),
      of: [
        {
          type: 'object',
          name: 'industryCard',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
              validation: (r) => r.required(),
            }),
            defineField({ name: 'title', title: 'Title', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'localeText' }),
            defineField({ name: 'link', title: 'Link', type: 'link' }),
          ],
          preview: { select: { title: 'title.en', media: 'image' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Industry cards', subtitle: 'Use cases by segment' }) },
})
