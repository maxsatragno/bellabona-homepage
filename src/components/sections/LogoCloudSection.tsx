import { RevealOnScroll } from "@/components/layout/RevealOnScroll";
import { Container } from "@/components/primitives/Container";
import {
  SanityImage,
  type SanityImageSource,
} from "@/components/primitives/SanityImage";
import { type SupportedLocale } from "@/i18n/config";
import { pickLocaleString, type LocaleValue } from "@/lib/locale-helpers";

/**
 * Social proof / logo bar.
 *
 * 2-column layout (lg+):
 *   Left  — eyebrow/caption text (Figtree 400, 40px, right-aligned).
 *   Right — client logos in a flex row, 32px tall, gap 80px.
 *
 * Mobile: caption centered at 32px; logo row centered; logos 24px tall (width auto), gap 60px.
 *
 * Logos are grayscale at rest, full-colour on hover.
 */

type LogoCloudSection = {
  _type: "section.logoCloud";
  eyebrow?: LocaleValue<string>;
  logos?: Array<{
    _key?: string;
    name?: string;
    url?: string | null;
    image?: SanityImageSource;
  }>;
};

export function LogoCloudSection({
  section,
  locale,
}: {
  section: LogoCloudSection;
  locale: SupportedLocale;
}) {
  const caption = pickLocaleString(section.eyebrow, locale);
  const logos = section.logos ?? [];
  if (!caption && logos.length === 0) return null;

  return (
    <section className="bg-background py-16 md:py-20">
      <Container>
        <RevealOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
            {/* Left: caption */}
            {caption ? (
              <p
                className="text-ink text-center lg:text-right text-[32px] lg:text-[40px] font-normal leading-none tracking-[-0.02em]"
              >
                {caption}
              </p>
            ) : (
              <div />
            )}

            {/* Right: logos row */}
            {logos.length > 0 ? (
              <ul className="flex flex-wrap items-center justify-center gap-[60px] lg:justify-start lg:gap-[80px] pl-0 lg:pl-4">
                {logos.map((logo, idx) => {
                  if (!logo.image) return null;
                  const inner = (
                    <SanityImage
                      image={logo.image}
                      alt={logo.name ?? ""}
                      width_hint={400}
                      sizes="(min-width: 1024px) 160px, 120px"
                      className="h-6 w-auto max-w-none object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 lg:h-8"
                    />
                  );
                  return (
                    <li key={logo._key ?? idx} className="flex-shrink-0">
                      {logo.url ? (
                        <a
                          href={logo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={logo.name}
                        >
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
