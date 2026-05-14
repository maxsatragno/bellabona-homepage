import { RevealOnScroll } from "@/components/layout/RevealOnScroll";
import { Container } from "@/components/primitives/Container";
import { FaqAccordionItem } from "@/components/sections/FaqAccordionItem";
import { defaultLocale, type SupportedLocale } from "@/i18n/config";
import { escapeJsonLd } from "@/lib/jsonld";
import { pickLocaleString, type LocaleValue } from "@/lib/locale-helpers";

import type { PortableTextBlock } from "@portabletext/react";

type FaqItem = {
  _key?: string;
  question?: LocaleValue<string>;
  answer?: LocaleValue<PortableTextBlock[]>;
};

type FaqSection = {
  _type: "section.faq";
  heading?: LocaleValue<string>;
  items?: FaqItem[];
};

/**
 * FAQ — emits `FAQPage` JSON-LD for rich results. Each row uses a lightweight
 * client accordion so height/opacity transitions work (native `<details>` hides
 * the body from layout, which blocks CSS animation).
 */
export function FaqSection({
  section,
  locale,
}: {
  section: FaqSection;
  locale: SupportedLocale;
}) {
  const heading = pickLocaleString(section.heading, locale);
  const items = section.items ?? [];
  if (items.length === 0) return null;

  const ld = {
    "@context": "https://schema.org" as const,
    "@type": "FAQPage" as const,
    mainEntity: items
      .map((item) => {
        const q = pickLocaleString(item.question, locale);
        const a = portableTextToPlain(
          item.answer?.[locale] ?? item.answer?.[defaultLocale],
        );
        if (!q || !a) return null;
        return {
          "@type": "Question" as const,
          name: q,
          acceptedAnswer: { "@type": "Answer" as const, text: a },
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null),
  };

  return (
    <section className="bg-background py-24 md:py-32">
      <Container>
        <RevealOnScroll>
          {heading ? (
            <h2 className="text-[30px] md:text-[60px] font-semibold tracking-tight leading-[1.1] text-brand-800 max-w-3xl mb-12">
              {heading}
            </h2>
          ) : null}

          <ul>
            {items.map((item, idx) => (
              <FaqAccordionItem
                key={item._key ?? idx}
                question={pickLocaleString(item.question, locale)}
                answer={item.answer}
                locale={locale}
              />
            ))}
          </ul>
        </RevealOnScroll>
      </Container>

      {ld.mainEntity.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escapeJsonLd(ld) }}
        />
      ) : null}
    </section>
  );
}

/** Tiny PortableText→plain converter for JSON-LD answer.text (no rich markup). */
function portableTextToPlain(blocks?: PortableTextBlock[]): string {
  if (!blocks || blocks.length === 0) return "";
  return blocks
    .map((block) => {
      if (block._type !== "block" || !("children" in block)) return "";
      const children = block.children as Array<{
        _type: string;
        text?: string;
      }>;
      return children
        .map((c) => (c._type === "span" ? (c.text ?? "") : ""))
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}
