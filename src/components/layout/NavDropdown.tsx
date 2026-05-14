'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { resolveHref, type LinkInput } from '@/lib/links'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

/**
 * Hybrid hover/click navbar dropdown.
 *
 * Why hybrid:
 *  - On hover-capable devices (desktop with mouse) hover-to-open feels snappier.
 *  - On touch devices a hover handler that auto-closes would fight the user;
 *    we fall back to click-to-toggle.
 *
 * `matchMedia('(hover: hover) and (pointer: fine)')` distinguishes the two at
 * mount time. Click always toggles (works on every device), Escape and outside
 * clicks always close.
 *
 * Accessibility: the trigger is a `<button aria-haspopup="menu"
 * aria-expanded>`, the menu is `<ul role="menu">` with `<li role="none">`
 * wrappers around `<a role="menuitem">`. Keyboard users can tab through items
 * naturally; Escape returns focus to the trigger.
 */

const CLOSE_DEBOUNCE_MS = 200

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

function subscribeHoverMQ(callback: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mq = window.matchMedia(HOVER_QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getHoverMQSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(HOVER_QUERY).matches
}

function getHoverMQServerSnapshot(): boolean {
  // On the server we assume "no hover" so the initial paint matches touch
  // devices. Desktop hydration upgrades to hover semantics after mount.
  return false
}

export type NavDropdownItem = {
  _key?: string
  label?: LocaleValue<string>
  link?: LinkInput
}

export function NavDropdown({
  label,
  items,
  locale,
}: {
  label: string
  items: NavDropdownItem[]
  locale: SupportedLocale
}) {
  const [open, setOpen] = useState(false)
  // Subscribe to the hover/pointer media query through useSyncExternalStore so
  // the value is read synchronously on render (no second-pass setState in an
  // effect) and stays in sync if the user docks/undocks an external mouse.
  const isHoverDevice = useSyncExternalStore(subscribeHoverMQ, getHoverMQSnapshot, getHoverMQServerSnapshot)
  const wrapperRef = useRef<HTMLLIElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(close, CLOSE_DEBOUNCE_MS)
  }, [clearCloseTimer, close])

  // Outside click / Escape close.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) close()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  // Cleanup pending timers on unmount.
  useEffect(() => clearCloseTimer, [clearCloseTimer])

  const handleMouseEnter = isHoverDevice
    ? () => {
        clearCloseTimer()
        setOpen(true)
      }
    : undefined

  const handleMouseLeave = isHoverDevice ? scheduleClose : undefined

  return (
    <li
      ref={wrapperRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-brand-700 transition-colors"
      >
        <span>{label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <ul
        role="menu"
        aria-label={label}
        className={`absolute left-0 top-full mt-3 min-w-[200px] rounded-xl border border-line bg-background py-2 shadow-lg ring-1 ring-black/5 transition-all duration-150 ${
          open ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-1'
        }`}
      >
        {items.map((item, idx) => {
          const href = resolveHref(item.link, locale)
          if (!href) return null
          const itemLabel = pickLocaleString(item.label, locale)
          const openInNewTab = item.link?.openInNewTab
          const isExternal = item.link?.kind === 'external'

          const className =
            'block px-4 py-2 text-sm font-medium text-ink hover:bg-light-green hover:text-brand-700 transition-colors'

          return (
            <li key={item._key ?? idx} role="none">
              {isExternal ? (
                <a
                  href={href}
                  role="menuitem"
                  className={className}
                  target={openInNewTab ? '_blank' : undefined}
                  rel={openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {itemLabel}
                </a>
              ) : (
                <Link
                  href={href}
                  role="menuitem"
                  className={className}
                  target={openInNewTab ? '_blank' : undefined}
                  rel={openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {itemLabel}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </li>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  )
}
