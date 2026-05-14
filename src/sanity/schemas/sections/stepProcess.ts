import { defineType, defineField } from 'sanity'

/** "How it works" — an ordered sequence of steps with optional imagery. */
export const stepProcessSection = defineType({
  name: 'section.stepProcess',
  title: 'Step process (how it works)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      validation: (r) => r.min(2).max(6),
      of: [
        {
          type: 'object',
          name: 'step',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'localeText' }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
            }),
          ],
          preview: { select: { title: 'title.en', media: 'image' } },
        },
      ],
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'cta' }),
  ],
  preview: { prepare: () => ({ title: 'How it works', subtitle: 'Step-by-step' }) },
})
