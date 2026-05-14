import { defineType, defineField } from 'sanity'

/**
 * Catch-all editorial block — used when no purpose-built section fits the
 * content (long-form copy, legal text, embedded notes).
 */
export const richTextSection = defineType({
  name: 'section.richText',
  title: 'Rich text',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'localePortableText',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'width',
      title: 'Container width',
      type: 'string',
      options: {
        list: [
          { title: 'Narrow (reading column)', value: 'narrow' },
          { title: 'Wide', value: 'wide' },
        ],
        layout: 'radio',
      },
      initialValue: 'narrow',
    }),
  ],
  preview: { prepare: () => ({ title: 'Rich text' }) },
})
