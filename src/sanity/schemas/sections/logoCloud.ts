import { defineType, defineField } from 'sanity'

/** Social proof — a row/grid of customer or partner logos. */
export const logoCloudSection = defineType({
  name: 'section.logoCloud',
  title: 'Logo cloud (social proof)',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'localeString' }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      validation: (r) => r.min(2).max(20),
      of: [
        {
          type: 'object',
          name: 'logo',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'image',
              title: 'Logo',
              type: 'image',
              options: { hotspot: false },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
              validation: (r) => r.required(),
            }),
            defineField({ name: 'url', title: 'Link (optional)', type: 'url' }),
          ],
          preview: { select: { title: 'name', media: 'image' } },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Logo cloud', subtitle: 'Social proof' }
    },
  },
})
