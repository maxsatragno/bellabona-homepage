import { defineType, defineField } from 'sanity'

export const testimonialsSection = defineType({
  name: 'section.testimonials',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
    defineField({
      name: 'quotes',
      title: 'Quotes',
      type: 'array',
      validation: (r) => r.min(1).max(12),
      of: [
        {
          type: 'object',
          name: 'quote',
          fields: [
            defineField({ name: 'quote', title: 'Quote', type: 'localeText', validation: (r) => r.required() }),
            defineField({ name: 'author', title: 'Author', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'role', title: 'Role', type: 'localeString' }),
            defineField({ name: 'company', title: 'Company', type: 'string' }),
            defineField({
              name: 'avatar',
              title: 'Avatar',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
            }),
          ],
          preview: { select: { title: 'author', subtitle: 'company', media: 'avatar' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Testimonials' }) },
})
