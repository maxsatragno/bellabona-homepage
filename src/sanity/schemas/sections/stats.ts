import { defineType, defineField } from 'sanity'

/** Benefits section: stat cards + optional checklist with image. */
export const statsSection = defineType({
  name: 'section.stats',
  title: 'Stats / Benefits',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
    defineField({
      name: 'stats',
      title: 'Stat cards',
      type: 'array',
      validation: (r) => r.min(2).max(6),
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', title: 'Value (e.g. 30-40%, 7,50 €, 92%)', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'benefitTitle', title: 'Benefit title', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label', type: 'localeString' }),
          ],
          preview: {
            select: { value: 'value', title: 'benefitTitle.en' },
            prepare({ value, title }) {
              return { title: value || 'Stat', subtitle: title }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'checklistImage',
      title: 'Checklist image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'checklist',
      title: 'Checklist',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'checkItem',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: { hotspot: false },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
            }),
            defineField({ name: 'title', title: 'Title', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'body', title: 'Body', type: 'localeString' }),
          ],
          preview: {
            select: { title: 'title.en' },
            prepare({ title }) {
              return { title: title || 'Check item' }
            },
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Stats / Benefits' }) },
})
