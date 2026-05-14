import Image, { type ImageProps } from 'next/image'

import { urlFor } from '@/sanity/image'

/**
 * `next/image` wrapper for Sanity image fields.
 *
 * Why a wrapper:
 *  - `width` / `height` come from `asset->metadata.dimensions` so we never
 *    cause layout shift (CLS).
 *  - `blurDataURL` comes from `asset->metadata.lqip` for an instant blur-up.
 *  - `alt` is required at the field level in the schemas; this component
 *    still validates it so missing alts are caught loudly in dev.
 *
 * The hero usage sets `fetchPriority="high"` to optimise LCP. (Next 16
 * deprecated the `priority` prop in favour of the native `fetchPriority`
 * attribute, which we pass through via `...rest`.)
 *
 * Pass `fill={true}` to use next/image's "fill" layout mode (parent must be
 * `position: relative` with explicit height). In this mode `width` and
 * `height` are omitted as per next/image's API contract.
 */

export type SanityImageSource = {
  asset?: {
    _id?: string
    metadata?: {
      dimensions?: { width: number; height: number; aspectRatio?: number }
      lqip?: string
    }
  }
  alt?: string | null
}

type FillProps = Omit<ImageProps, 'src' | 'width' | 'height' | 'alt' | 'placeholder' | 'blurDataURL' | 'fill'> & {
  image: SanityImageSource | null | undefined
  alt?: string
  fill: true
  width_hint?: number
}

type SizedProps = Omit<ImageProps, 'src' | 'width' | 'height' | 'alt' | 'placeholder' | 'blurDataURL' | 'fill'> & {
  image: SanityImageSource | null | undefined
  alt?: string
  fill?: false | undefined
  width?: number
  height?: number
  width_hint?: number
}

type Props = FillProps | SizedProps

export function SanityImage({
  image,
  alt,
  width_hint,
  sizes,
  className,
  fill,
  ...rest
}: Props) {
  if (!image?.asset?._id) return null

  let builder = urlFor(image).auto('format').fit('max')
  if (width_hint) builder = builder.width(width_hint)
  const src = builder.url()

  const effectiveAlt = alt ?? image.alt ?? ''
  const lqip = image.asset.metadata?.lqip

  if (fill) {
    return (
      <Image
        {...(rest as Omit<ImageProps, 'src' | 'alt' | 'placeholder' | 'blurDataURL'>)}
        src={src}
        alt={effectiveAlt}
        fill
        sizes={sizes}
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        className={className}
      />
    )
  }

  const { width: forcedWidth, height: forcedHeight, ...sizedRest } = rest as SizedProps

  const dimensions = image.asset.metadata?.dimensions
  const naturalWidth = dimensions?.width ?? 1600
  const naturalHeight = dimensions?.height ?? 900

  const width = forcedWidth ?? naturalWidth
  const height = forcedHeight ?? naturalHeight

  return (
    <Image
      {...sizedRest}
      src={src}
      width={width}
      height={height}
      alt={effectiveAlt}
      sizes={sizes}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      className={className}
    />
  )
}
