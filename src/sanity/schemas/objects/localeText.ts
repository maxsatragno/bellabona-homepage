import { defineType, defineField } from 'sanity'

import { supportedLocales, defaultLocale } from '@/i18n/config'

/** Localized multi-line plain text (no rich formatting). */
export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true, collapsed: false } }],
  fields: supportedLocales.map((locale) =>
    defineField({
      name: locale,
      title: locale.toUpperCase(),
      type: 'text',
      rows: 3,
      fieldset: 'translations',
      validation: (rule) =>
        locale === defaultLocale
          ? rule.required().warning(`${locale.toUpperCase()} is the default and should be filled.`)
          : rule,
    })
  ),
})
