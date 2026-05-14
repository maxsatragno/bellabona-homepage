'use client'

import { useId, useState } from 'react'

import { PortableText } from '@/components/primitives/PortableText'
import { type SupportedLocale } from '@/i18n/config'
import { type LocaleValue } from '@/lib/locale-helpers'

import type { PortableTextBlock } from '@portabletext/react'

type Props = {
  question: string
  answer?: LocaleValue<PortableTextBlock[]>
  locale: SupportedLocale
}

/**
 * Client accordion row: native `<details>` hides body with `display: none`,
 * which prevents CSS from transitioning height/opacity. This pattern keeps
 * content in the flow (clipped via grid 0fr/1fr) so Tailwind transitions run.
 */
export function FaqAccordionItem({ question, answer, locale }: Props) {
  const [open, setOpen] = useState(false)
  const headingId = useId()
  const panelId = useId()

  return (
    <li className="border-b border-line">
      <div className="py-6">
        <button
          type="button"
          id={headingId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer items-start justify-between gap-6 text-left text-base md:text-[20px] font-medium text-brand-800"
        >
          <span>{question}</span>
          {open ? (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-800 text-brand-800">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" strokeLinecap="round" />
              </svg>
            </span>
          ) : (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-800 text-brand-800">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </span>
          )}
        </button>
        <div
          id={panelId}
          role="region"
          aria-labelledby={headingId}
          className={
            open
              ? 'grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0'
              : 'grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0'
          }
        >
          <div className="min-h-0 overflow-hidden">
            <div
              inert={!open ? true : undefined}
              className={
                open
                  ? 'origin-top translate-y-0 opacity-100 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none'
                  : 'origin-top -translate-y-1 opacity-0 transition-[opacity,transform] duration-300 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'
              }
            >
              <PortableText
                value={answer}
                locale={locale}
                className="max-w-2xl pt-4 text-base md:text-[20px] leading-relaxed text-muted"
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
