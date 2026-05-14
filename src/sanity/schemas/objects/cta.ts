import { defineType, defineField } from 'sanity'

/**
 * A call-to-action button.
 *
 * Note: a CTA is **not** a navigation link. It is a button whose behaviour is
 * implemented in code via the action registry at `src/lib/cta-actions.ts`.
 * Editors pick a label, a visual variant, and the `actionId` of the desired
 * behaviour. Optionally they can pass a `customClass` to add CSS hooks.
 *
 * When a new behaviour is required, a developer adds it to both the
 * `actionId` list below and the registry. This keeps the editorial layer
 * decoupled from runtime side-effects (booking widgets, downloads, scroll
 * targets, etc.) and prevents editors from configuring URLs that may rot.
 */
export const cta = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Visual variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (filled green pill)', value: 'primary' },
          { title: 'Secondary (underlined text)', value: 'secondary' },
          { title: 'Ghost (plain text)', value: 'ghost' },
          { title: 'Inverse (white pill — for dark green backgrounds)', value: 'inverse' },
          { title: 'Lemon (lemon #E6FFA9 pill — for dark green backgrounds)', value: 'lemon' },
          { title: 'Red (filled red pill)', value: 'red' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'actionId',
      title: 'Action',
      description:
        'Picks which code-side behaviour fires on click. Ask a developer to add a new action if you need one that is not in this list.',
      type: 'string',
      options: {
        list: [
          { title: 'Book free trial', value: 'book-free-trial' },
          { title: 'Download menu PDF', value: 'download-menu' },
          { title: 'Scroll to features', value: 'scroll-to-features' },
          { title: 'Scroll to pricing', value: 'scroll-to-pricing' },
          { title: 'Scroll to FAQ', value: 'scroll-to-faq' },
          { title: 'Scroll to contact', value: 'scroll-to-contact' },
          { title: 'Open demo modal', value: 'open-demo-modal' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'customClass',
      title: 'Custom class (optional)',
      description: 'Extra CSS classes appended to the button. Use for ad-hoc styling or analytics hooks.',
      type: 'string',
    }),
  ],
  preview: {
    select: { label: 'label.en', variant: 'variant', actionId: 'actionId' },
    prepare({ label, variant, actionId }) {
      return {
        title: label || 'Untitled CTA',
        subtitle: [variant, actionId].filter(Boolean).join(' · '),
      }
    },
  },
})
