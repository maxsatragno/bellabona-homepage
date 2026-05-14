import { defineType, defineField } from 'sanity'

/**
 * Global site configuration: navbar, footer, organization details for JSON-LD.
 * Singleton — exactly one instance, pinned in the Studio structure builder.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'nav', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'organization', title: 'Organization (JSON-LD)' },
  ],
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'identity',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      group: 'identity',
      initialValue: 'Bella&Bona',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nav',
      title: 'Navigation bar',
      type: 'object',
      group: 'nav',
      fields: [
        defineField({
          name: 'items',
          title: 'Nav items (links + dropdown menus)',
          description:
            'Each item is either a single link (rendered as plain anchor) or a dropdown that opens a sub-menu of links.',
          type: 'array',
          of: [
            // Plain top-level link.
            {
              type: 'object',
              name: 'navLink',
              title: 'Link',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'localeString', validation: (r) => r.required() }),
                defineField({ name: 'link', title: 'Link', type: 'link', validation: (r) => r.required() }),
              ],
              preview: {
                select: { title: 'label.en' },
                prepare: ({ title }) => ({ title: title || 'Untitled link', subtitle: 'Link' }),
              },
            },
            // Dropdown that opens a sub-menu of links (no own destination).
            {
              type: 'object',
              name: 'navDropdown',
              title: 'Dropdown menu',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'localeString', validation: (r) => r.required() }),
                defineField({
                  name: 'items',
                  title: 'Sub-items',
                  type: 'array',
                  validation: (r) => r.min(1).max(8),
                  of: [
                    {
                      // Unique inline name to avoid colliding with the top-level `navLink`.
                      type: 'object',
                      name: 'navDropdownLink',
                      title: 'Sub-link',
                      fields: [
                        defineField({ name: 'label', title: 'Label', type: 'localeString', validation: (r) => r.required() }),
                        defineField({ name: 'link', title: 'Link', type: 'link', validation: (r) => r.required() }),
                      ],
                      preview: { select: { title: 'label.en' } },
                    },
                  ],
                }),
              ],
              preview: {
                select: { title: 'label.en' },
                prepare: ({ title }) => ({ title: title || 'Untitled dropdown', subtitle: 'Dropdown menu' }),
              },
            },
          ],
        }),
        defineField({
          name: 'ctas',
          title: 'CTA buttons',
          description: 'Up to 3 CTA buttons rendered on the right side of the navbar.',
          type: 'array',
          validation: (r) => r.max(3),
          of: [{ type: 'cta' }],
        }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({
          name: 'socialBlock',
          title: 'Social block',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'localeString' }),
            defineField({ name: 'caption', title: 'Caption', type: 'localeText' }),
            defineField({ name: 'email', title: 'Contact email', type: 'string' }),
            defineField({
              name: 'links',
              title: 'Social media links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'socialMediaLink',
                  fields: [
                    defineField({
                      name: 'icon',
                      title: 'Icon',
                      type: 'image',
                      options: { hotspot: false },
                      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
                    }),
                    defineField({
                      name: 'url',
                      title: 'URL',
                      type: 'url',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'openInNewTab',
                      title: 'Open in new tab',
                      type: 'boolean',
                      initialValue: true,
                    }),
                  ],
                  preview: {
                    select: { subtitle: 'url', media: 'icon' },
                    prepare({ subtitle, media }) {
                      return { title: 'Social link', subtitle, media }
                    },
                  },
                },
              ],
            }),
          ],
        }),
        defineField({
          name: 'columns',
          title: 'Columns',
          type: 'array',
          validation: (r) => r.max(5),
          of: [
            {
              type: 'object',
              name: 'footerColumn',
              fields: [
                defineField({ name: 'heading', title: 'Heading', type: 'localeString', validation: (r) => r.required() }),
                defineField({
                  name: 'links',
                  title: 'Links',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      name: 'footerLink',
                      fields: [
                        defineField({ name: 'label', title: 'Label', type: 'localeString', validation: (r) => r.required() }),
                        defineField({ name: 'link', title: 'Link', type: 'link', validation: (r) => r.required() }),
                      ],
                      preview: { select: { title: 'label.en' } },
                    },
                  ],
                }),
              ],
              preview: { select: { title: 'heading.en' } },
            },
          ],
        }),
        defineField({ name: 'legal', title: 'Legal / fine print', type: 'localePortableText' }),
      ],
    }),
    defineField({
      name: 'organization',
      title: 'Organization info (used for Organization JSON-LD)',
      type: 'object',
      group: 'organization',
      fields: [
        defineField({ name: 'legalName', title: 'Legal name', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'addressLocality', title: 'City', type: 'string' }),
        defineField({ name: 'addressCountry', title: 'Country (ISO-3166)', type: 'string', initialValue: 'DE' }),
        defineField({ name: 'contactEmail', title: 'Contact email', type: 'string' }),
        defineField({ name: 'contactPhone', title: 'Contact phone (E.164)', type: 'string' }),
        defineField({
          name: 'sameAs',
          title: 'sameAs URLs (LinkedIn, Crunchbase, Wikipedia, etc.)',
          description: 'Listed under schema.org Organization.sameAs to disambiguate the entity.',
          type: 'array',
          of: [{ type: 'url' }],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
