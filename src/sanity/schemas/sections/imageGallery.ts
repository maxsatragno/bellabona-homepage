import { defineType, defineField } from 'sanity'

/** Image showcase — food, offices, team. */
export const imageGallerySection = defineType({
  name: 'section.imageGallery',
  title: 'Image gallery',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Masonry', value: 'masonry' },
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      validation: (r) => r.min(2).max(20),
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Image gallery' }) },
})
