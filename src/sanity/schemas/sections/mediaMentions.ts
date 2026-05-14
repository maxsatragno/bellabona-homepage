import { defineType, defineField } from 'sanity'

/** Press / media mentions — logos with an optional pull-quote. */
export const mediaMentionsSection = defineType({
  name: 'section.mediaMentions',
  title: 'Media mentions',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
    defineField({ name: 'quote', title: 'Featured pull-quote', type: 'localeText' }),
    defineField({
      name: 'logos',
      title: 'Media logos',
      type: 'array',
      validation: (r) => r.min(2).max(12),
      of: [
        {
          type: 'object',
          name: 'mediaLogo',
          fields: [
            defineField({ name: 'name', title: 'Outlet', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'image',
              title: 'Logo',
              type: 'image',
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
              validation: (r) => r.required(),
            }),
            defineField({ name: 'url', title: 'Link to article', type: 'url' }),
          ],
          preview: { select: { title: 'name', media: 'image' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Media mentions' }) },
})
