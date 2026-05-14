import { defineType, defineField } from 'sanity'

/**
 * A polymorphic link: either internal (a reference to a Sanity `page` document)
 * or external (an absolute URL). The frontend resolves at render time.
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'internal',
      title: 'Internal page',
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.kind !== 'internal',
      validation: (r) =>
        r.custom((value, ctx) => {
          const parent = ctx.parent as { kind?: string } | undefined
          if (parent?.kind === 'internal' && !value) return 'Required for internal links.'
          return true
        }),
    }),
    defineField({
      name: 'href',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.kind !== 'external',
      validation: (r) =>
        r.uri({ allowRelative: false, scheme: ['http', 'https', 'mailto', 'tel'] }).custom((value, ctx) => {
          const parent = ctx.parent as { kind?: string } | undefined
          if (parent?.kind === 'external' && !value) return 'Required for external links.'
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
