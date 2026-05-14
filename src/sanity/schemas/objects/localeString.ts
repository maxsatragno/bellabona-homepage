import { defineType, defineField } from 'sanity'

import { supportedLocales, defaultLocale } from '@/i18n/config'

/**
 * Field-level localization: a single short string with one value per supported locale.
 * Frontend reads `value[locale]` with fallback to the default locale.
 */
export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true, collapsed: false } }],
  fields: supportedLocales.map((locale) =>
    defineField({
      name: locale,
      title: locale.toUpperCase(),
      type: 'string',
      fieldset: 'translations',
      validation: (rule) =>
        locale === defaultLocale
          ? rule.required().warning(`${locale.toUpperCase()} is the default and should be filled.`)
          : rule,
    })
  ),
})
