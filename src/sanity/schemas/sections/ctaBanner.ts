import { defineType, defineField } from 'sanity'

/** Final CTA banner. The "A final CTA section" listed in the test brief. */
export const ctaBannerSection = defineType({
  name: 'section.ctaBanner',
  title: 'CTA banner',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'localePortableText',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'cta', validation: (r) => r.required() }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image (optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          { title: 'Green', value: 'green' },
          { title: 'Red', value: 'red' },
        ],
        layout: 'radio',
      },
      initialValue: 'green',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'CTA banner', subtitle: 'Final call to action' }),
  },
})
