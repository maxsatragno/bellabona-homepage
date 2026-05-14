import { type SupportedLocale } from '@/i18n/config'
import { OPEN_DEMO_MODAL_EVENT } from '@/lib/modal-events'

/**
 * Code-side action registry for CTA buttons.
 *
 * Each editorial CTA in Sanity carries an `actionId` (string). At runtime the
 * <Button> primitive looks the id up here and invokes the corresponding
 * handler. To add a new action:
 *   1. Add the option to `cta.actionId` in `src/sanity/schemas/objects/cta.ts`
 *   2. Add the handler below
 *   3. Document the new action's behaviour in the README (so editors and
 *      future developers know what it does)
 *
 * The locale is passed in so handlers can branch on language if needed (e.g.
 * different booking URLs per market).
 *
 * Handlers MUST be safe to invoke on the client only — they typically rely on
 * `window` or DOM APIs. The registry is consumed exclusively from `Button.tsx`
 * which is marked `'use client'`.
 */

export type CtaActionId =
  | 'book-free-trial'
  | 'download-menu'
  | 'scroll-to-features'
  | 'scroll-to-pricing'
  | 'scroll-to-faq'
  | 'scroll-to-contact'
  | 'open-demo-modal'

export type CtaActionHandler = (locale: SupportedLocale) => void

const NOOP: CtaActionHandler = (locale) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[cta-actions] No handler registered (locale="${locale}").`)
  }
}

function scrollToId(id: string): CtaActionHandler {
  return () => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[cta-actions] No element with id="${id}" found on the page.`)
    }
  }
}

export const ctaActions: Record<CtaActionId, CtaActionHandler> = {
  'book-free-trial': () => {
    // Replace this stub with the production booking flow (Calendly, HubSpot
    // forms, internal booking page, etc.) once integration details are known.
    window.open('https://calendly.com/bellabona/free-trial', '_blank', 'noopener,noreferrer')
  },
  'download-menu': () => {
    // Triggers a PDF download. The file is served from /public/downloads.
    // Editors can swap the asset by replacing the file on the same path.
    window.location.href = '/downloads/bellabona-weekly-menu.pdf'
  },
  'scroll-to-features': scrollToId('features'),
  'scroll-to-pricing': scrollToId('pricing'),
  'scroll-to-faq': scrollToId('faq'),
  'scroll-to-contact': scrollToId('contact'),
  'open-demo-modal': () => {
    window.dispatchEvent(new CustomEvent(OPEN_DEMO_MODAL_EVENT))
  },
}

export function getCtaAction(actionId: string | undefined | null): CtaActionHandler {
  if (!actionId) return NOOP
  return (ctaActions as Record<string, CtaActionHandler>)[actionId] ?? NOOP
}
