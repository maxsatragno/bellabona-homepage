import { defineType, defineField } from 'sanity'

/** A grid of value props / features. */
export const featureGridSection = defineType({
  name: 'section.featureGrid',
  title: 'Feature grid',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
    defineField({ name: 'intro', title: 'Intro', type: 'localeText' }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 3,
    }),
    defineField({
      name: 'items',
      title: 'Features',
      type: 'array',
      validation: (r) => r.min(2).max(12),
      of: [
        {
          type: 'object',
          name: 'feature',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: { hotspot: false },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
            }),
            defineField({ name: 'title', title: 'Title', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'localePortableText' }),
          ],
          preview: {
            select: { title: 'title.en', media: 'icon' },
            prepare({ title, media }) {
              return { title: title || 'Feature', media }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { en: 'heading.en' },
    prepare({ en }) {
      return { title: 'Feature grid', subtitle: en || 'No heading' }
    },
  },
})
