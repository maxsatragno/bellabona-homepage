import { defineType, defineField } from 'sanity'

export const pricingTeaserSection = defineType({
  name: 'section.pricingTeaser',
  title: 'Pricing teaser',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
    defineField({ name: 'intro', title: 'Intro', type: 'localeText' }),
    defineField({
      name: 'tiers',
      title: 'Tiers',
      type: 'array',
      validation: (r) => r.min(1).max(4),
      of: [
        {
          type: 'object',
          name: 'tier',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'price', title: 'Price (display string)', type: 'localeString' }),
            defineField({ name: 'priceCaption', title: 'Price caption', type: 'localeString' }),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{ type: 'localeString' }],
            }),
            defineField({ name: 'highlighted', title: 'Highlight this tier', type: 'boolean', initialValue: false }),
            defineField({ name: 'cta', title: 'CTA', type: 'cta' }),
          ],
          preview: { select: { title: 'name.en', subtitle: 'price.en' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Pricing teaser' }) },
})
