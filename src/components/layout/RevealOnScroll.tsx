'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Minimal CSS-driven reveal-on-scroll. Toggles `.is-visible` on the wrapping
 * element when it enters the viewport; the actual animation lives in
 * `globals.css` (`.reveal` and `.reveal.is-visible`).
 *
 * Why not framer-motion or GSAP? The brief explicitly forbids heavy animation
 * libraries on LCP-critical pages, and we want the animation to remain pure
 * CSS so it degrades gracefully when JS is delayed.
 */

type Props = {
  children: ReactNode
  /** Optional className applied to the wrapper (combined with `.reveal`). */
  className?: string
  /** How much of the element should be visible before revealing (default 10%). */
  threshold?: number
  /** Disable on a per-instance basis (e.g. for the hero). */
  disabled?: boolean
  as?: 'div' | 'section'
}

export function RevealOnScroll({
  children,
  className,
  threshold = 0.1,
  disabled,
  as = 'div',
}: Props) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (disabled) return
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [disabled, threshold])

  const Tag = as
  const classes = ['reveal', className].filter(Boolean).join(' ')

  // @ts-expect-error — dynamic tag with a ref is fine in this constrained set.
  return <Tag ref={ref} className={disabled ? className : classes}>{children}</Tag>
}
