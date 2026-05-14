'use client'

import type { ReactNode } from 'react'

import { type SupportedLocale } from '@/i18n/config'
import { getCtaAction } from '@/lib/cta-actions'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

/**
 * Renders a CTA from the Sanity `cta` object. CTAs are buttons bound to a
 * code-side action (see `src/lib/cta-actions.ts`). They never carry a URL
 * destination — for navigation links, use `<Link>` directly with a Sanity
 * `link` object via the helpers in `src/lib/links.ts`.
 *
 * This file is marked `'use client'` because the click handler must run in
 * the browser. The component is intentionally tiny so the client bundle
 * footprint stays minimal.
 */

export type CtaInput = {
  label?: LocaleValue<string>
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse' | 'lemon' | 'red'
  actionId?: string
  customClass?: string
}

const VARIANT_CLASSES: Record<NonNullable<CtaInput['variant']>, string> = {
  primary:
    'inline-flex items-center justify-center rounded-full bg-brand-700 text-white px-6 py-3 text-base font-medium hover:bg-brand-800 transition-colors',
  // "Secondary" is a text button with an underline — matches the "Download
  // menu" treatment in the Figma. No padding, no fill; the weight sits on
  // the typography.
  secondary:
    'inline-flex items-center text-base font-medium text-brand-800 underline underline-offset-4 hover:no-underline transition-colors cursor-pointer',
  ghost:
    'inline-flex items-center justify-center px-2 py-1 text-base font-medium text-brand-800 hover:underline underline-offset-4',
  // "Inverse" — white fill on dark green backgrounds (hero left column, dark
  // banners). Use when the button sits on brand-700 or darker.
  inverse:
    'inline-flex items-center justify-center rounded-full bg-white text-brand-700 px-6 py-3 text-base font-medium hover:bg-light-green transition-colors',
  // "Lemon" — lemon accent fill on dark green backgrounds. Matches the hero
  // CTA in the Figma (#E6FFA9 bg + brand dark text).
  lemon:
    'inline-flex items-center justify-center rounded-full bg-lemon text-brand-800 px-6 py-3 text-base font-medium hover:bg-lemon-dim transition-colors',
  // "Red" — red fill for CTA Banners.
  red:
    'inline-flex items-center justify-center rounded-full bg-red text-white px-6 py-3 text-base font-medium hover:bg-brand-800 transition-colors',
}

export function Button({
  cta,
  locale,
  className,
  fallbackChildren,
}: {
  cta: CtaInput | null | undefined
  locale: SupportedLocale
  className?: string
  fallbackChildren?: ReactNode
}) {
  if (!cta) return null
  const label = pickLocaleString(cta.label, locale, '')
  const variant = cta.variant ?? 'primary'
  const handler = getCtaAction(cta.actionId)
  const classes = [VARIANT_CLASSES[variant], cta.customClass, className].filter(Boolean).join(' ')
  const content = label || fallbackChildren

  return (
    <button
      type="button"
      onClick={() => handler(locale)}
      className={classes}
      data-cta-action={cta.actionId ?? undefined}
    >
      {content}
    </button>
  )
}
