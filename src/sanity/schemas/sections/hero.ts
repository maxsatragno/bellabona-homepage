import { defineType, defineField } from 'sanity'

/**
 * Hero section — 2-column card: text (left, dark green bg) + photo (right).
 *
 * LCP element: the column `image` field (right column, `priority` in the
 * frontend). Mobile layout stacks: text first, image second, app links third.
 *
 * App store links and rating badge live in `appLinks[]` / `rating` — separate
 * from the CTA so they can be independently updated without touching the main
 * call-to-action.
 */
export const heroSection = defineType({
  name: 'section.hero',
  title: 'Hero',
  type: 'object',
  fields: [
    // --- Left column ---
    defineField({ name: 'eyebrow', title: 'Eyebrow chip', type: 'localeString' }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'localePortableText',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'localeText' }),
    defineField({
      name: 'cta',
      title: 'CTA button',
      description: 'Use the "Inverse" variant so the button reads on the dark green background.',
      type: 'cta',
      // Optional — hero still looks fine without a CTA (e.g. product-only pages).
    }),

    // --- Right column ---
    defineField({
      name: 'image',
      title: 'Column image',
      description: 'Photo displayed in the right column. This is the LCP element — keep it high-quality.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'appLinks',
      title: 'App store links',
      description: 'Displayed as pill badges below the image. Maximum 2 (one per platform).',
      type: 'array',
      validation: (r) => r.max(2),
      of: [
        {
          type: 'object',
          name: 'appLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Google Play', value: 'google-play' },
                  { title: 'App Store (Apple)', value: 'app-store' },
                ],
                layout: 'radio',
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'Store URL',
              type: 'url',
              validation: (r) => r.required().uri({ scheme: ['https'] }),
            }),
          ],
          preview: {
            select: { platform: 'platform', url: 'url' },
            prepare({ platform, url }) {
              return { title: platform === 'google-play' ? 'Google Play' : 'App Store', subtitle: url }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'rating',
      title: 'Rating badge (optional)',
      description: 'Shows a star rating badge next to the app links. Leave empty to hide.',
      type: 'object',
      fields: [
        defineField({
          name: 'score',
          title: 'Score (0–5)',
          type: 'number',
          validation: (r) => r.min(0).max(5),
        }),
        defineField({ name: 'reviewCount', title: 'Number of reviews', type: 'number' }),
        defineField({
          name: 'platform',
          title: 'Platform label',
          type: 'string',
          initialValue: 'Google',
        }),
      ],
    }),
  ],
  preview: {
    select: { media: 'image' },
    prepare({ media }) {
      return { title: 'Hero', subtitle: '2-column: text + image', media }
    },
  },
})
