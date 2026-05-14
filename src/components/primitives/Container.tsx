import type { HTMLAttributes } from 'react'

/**
 * Centered max-width content container. Sections drop in <Container> to align
 * to the design grid without redeclaring max-width / horizontal padding.
 */
export function Container({
  className = '',
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const classes = ['mx-auto w-full max-w-[1280px] px-6 md:px-8 lg:px-12', className].filter(Boolean).join(' ')
  return <div className={classes} {...rest} />
}
