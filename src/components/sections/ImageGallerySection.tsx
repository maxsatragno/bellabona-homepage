import { Container } from '@/components/primitives/Container'
import { RevealOnScroll } from '@/components/layout/RevealOnScroll'
import { SanityImage, type SanityImageSource } from '@/components/primitives/SanityImage'
import { type SupportedLocale } from '@/i18n/config'
import { pickLocaleString, type LocaleValue } from '@/lib/locale-helpers'

type ImageGallerySection = {
  _type: 'section.imageGallery'
  heading?: LocaleValue<string>
  layout?: 'masonry' | 'grid' | 'carousel'
  images?: Array<SanityImageSource & { _key?: string }>
}

export function ImageGallerySection({
  section,
  locale,
}: {
  section: ImageGallerySection
  locale: SupportedLocale
}) {
  const heading = pickLocaleString(section.heading, locale)
  const images = section.images ?? []
  if (images.length === 0) return null

  // Masonry on desktop via CSS columns; falls back gracefully to a single column on small screens.
  const isMasonry = section.layout === 'masonry'
  const isCarousel = section.layout === 'carousel'

  return (
    <section className="bg-background py-24 md:py-32">
      <Container>
        <RevealOnScroll>
          {heading ? (
            <h2 className="text-[30px] md:text-[60px] font-semibold tracking-tight leading-[1.1] text-brand-800 max-w-3xl mb-16">
              {heading}
            </h2>
          ) : null}

          {isMasonry ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid">
              {images.map((img, idx) => (
                <SanityImage
                  key={img._key ?? idx}
                  image={img}
                  width_hint={900}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full rounded-2xl"
                />
              ))}
            </div>
          ) : isCarousel ? (
            <ul className="-mx-6 px-6 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
              {images.map((img, idx) => (
                <li key={img._key ?? idx} className="snap-start shrink-0 w-[80vw] sm:w-[50vw] lg:w-[33vw]">
                  <SanityImage
                    image={img}
                    width_hint={900}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 80vw"
                    className="w-full rounded-2xl object-cover aspect-[4/3]"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <li key={img._key ?? idx}>
                  <SanityImage
                    image={img}
                    width_hint={700}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="w-full rounded-xl object-cover aspect-square"
                  />
                </li>
              ))}
            </ul>
          )}
        </RevealOnScroll>
      </Container>
    </section>
  )
}
