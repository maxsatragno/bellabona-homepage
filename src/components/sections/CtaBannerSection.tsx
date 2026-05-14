import { RevealOnScroll } from "@/components/layout/RevealOnScroll";
import { Button, type CtaInput } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { PortableText } from "@/components/primitives/PortableText";
import {
  SanityImage,
  type SanityImageSource,
} from "@/components/primitives/SanityImage";
import { type SupportedLocale } from "@/i18n/config";
import { type LocaleValue } from "@/lib/locale-helpers";

import type { PortableTextBlock } from "@portabletext/react";

type CtaBannerSection = {
  _type: "section.ctaBanner";
  content?: LocaleValue<PortableTextBlock[]>;
  cta?: CtaInput;
  backgroundImage?: SanityImageSource;
  tone?: "green" | "red";
};

const TONE_CLASSES: Record<
  NonNullable<CtaBannerSection["tone"]>,
  { bg: string; text: string; imageBg: string; imageFit: string }
> = {
  green: {
    bg: "bg-light-green",
    text: "[&_h2]:text-brand-800 [&_h3]:text-brand-800 [&_p]:text-brand-800",
    imageBg: "",
    imageFit: "object-cover",
  },
  red: {
    bg: "bg-light-red",
    text: "[&_h2]:text-red [&_h3]:text-red [&_p]:text-red",
    imageBg: "bg-red",
    imageFit: "object-contain",
  },
};

export function CtaBannerSection({
  section,
  locale,
}: {
  section: CtaBannerSection;
  locale: SupportedLocale;
}) {
  const tone = section.tone ?? "green";
  const styles =
    TONE_CLASSES[tone as keyof typeof TONE_CLASSES] ?? TONE_CLASSES.green;

  return (
    <section className="py-12 md:py-20">
      <Container>
        <RevealOnScroll>
          <div className={`overflow-hidden rounded-3xl ${styles.bg}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch md:min-h-[380px]">
              <div className="flex flex-col justify-between p-4 md:p-6 lg:p-8">
                <div>
                  <PortableText
                    value={section.content}
                    locale={locale}
                    className={`${styles.text} [&_h2]:text-[30px] [&_h2]:md:text-[60px] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:leading-[1.1] [&_h2]:mt-0 [&_h2]:mb-4 [&_h3]:mt-0 [&_h3]:mb-3 [&_p:not(:first-child)]:mt-4 [&_p]:text-base [&_p]:md:text-[20px] [&_p]:leading-relaxed`}
                  />
                </div>
                {section.cta ? (
                  <div className="mt-10">
                    <Button
                      cta={section.cta}
                      locale={locale}
                      className="w-full md:w-auto"
                    />
                  </div>
                ) : null}
              </div>

              {section.backgroundImage ? (
                <div className="p-4 md:p-6 lg:p-8">
                  <div
                    className={`relative h-full min-h-[280px] md:min-h-full overflow-hidden rounded-2xl ${styles.imageBg}`}
                  >
                    <SanityImage
                      image={section.backgroundImage}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      width_hint={800}
                      className={styles.imageFit}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
