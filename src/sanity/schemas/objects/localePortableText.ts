import { defineType, defineField, defineArrayMember } from 'sanity'

import { supportedLocales, defaultLocale } from '@/i18n/config'

/**
 * Localized rich text using Sanity's Portable Text.
 *
 * The block schema is intentionally conservative: a single heading level (h2 / h3),
 * paragraphs, a couple of marks, and unordered lists. This keeps editors focused
 * on copy decisions and prevents inline-style sprawl that breaks design fidelity.
 */
const blockField = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Heading 2', value: 'h2' },
    { title: 'Heading 3', value: 'h3' },
  ],
  lists: [{ title: 'Bullet', value: 'bullet' }],
  marks: {
    decorators: [
      { title: 'Strong', value: 'strong' },
      { title: 'Emphasis', value: 'em' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'External link',
        fields: [
          { name: 'href', type: 'url', validation: (r) => r.required() },
          { name: 'openInNewTab', type: 'boolean', initialValue: false },
        ],
      },
    ],
  },
})

export const localePortableText = defineType({
  name: 'localePortableText',
  title: 'Localized rich text',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true, collapsed: false } }],
  fields: supportedLocales.map((locale) =>
    defineField({
      name: locale,
      title: locale.toUpperCase(),
      type: 'array',
      of: [blockField],
      fieldset: 'translations',
      validation: (rule) =>
        locale === defaultLocale
          ? rule.required().warning(`${locale.toUpperCase()} is the default and should be filled.`)
          : rule,
    })
  ),
})
