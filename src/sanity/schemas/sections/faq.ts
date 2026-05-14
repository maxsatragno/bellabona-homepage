import { defineType, defineField } from 'sanity'

/**
 * FAQ section. Each item also feeds an FAQPage JSON-LD on the rendered page,
 * so question/answer copy should be plain language.
 */
export const faqSection = defineType({
  name: 'section.faq',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (r) => r.min(1).max(30),
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'localePortableText', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'question.en' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'FAQ' }) },
})
