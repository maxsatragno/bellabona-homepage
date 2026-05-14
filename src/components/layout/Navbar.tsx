import Link from "next/link";

import { MobileNav } from "@/components/layout/MobileNav";
import {
  NavDropdown,
  type NavDropdownItem,
} from "@/components/layout/NavDropdown";
import { Button, type CtaInput } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import {
  SanityImage,
  type SanityImageSource,
} from "@/components/primitives/SanityImage";
import { supportedLocales, type SupportedLocale } from "@/i18n/config";
import { resolveHref, type LinkInput } from "@/lib/links";
import { pickLocaleString, type LocaleValue } from "@/lib/locale-helpers";

/**
 * Site-wide navigation bar.
 *
 * Two sub-containers (`justify-between`):
 *   • Left: logo + nav items (links and dropdowns).
 *     gap-16 (64px) between logo and nav.
 *     gap-3 (12px) between nav items.
 *   • Right: CTAs + language switcher.
 *     gap-6 (24px) between CTAs and the switcher.
 *
 * Nav items are polymorphic: a `navLink` is a single anchor; a `navDropdown`
 * opens a sub-menu (hover on desktop, click on touch — see `<NavDropdown>`).
 *
 * Mobile (`< md`) shows a burger menu that opens a full-screen drawer with
 * vertical navigation, CTAs, and language selection.
 */

export type NavbarInput = {
  items?: Array<
    | {
        _type: "navLink";
        _key?: string;
        label?: LocaleValue<string>;
        link?: LinkInput;
      }
    | {
        _type: "navDropdown";
        _key?: string;
        label?: LocaleValue<string>;
        subItems?: NavDropdownItem[];
      }
  >;
  ctas?: CtaInput[];
};

export function Navbar({
  nav,
  logo,
  siteName,
  locale,
  dictionary,
}: {
  nav: NavbarInput | null | undefined;
  logo: SanityImageSource | null | undefined;
  siteName: string | undefined;
  locale: SupportedLocale;
  dictionary: { common: { skipToContent: string; languageSwitcher: string } };
}) {
  const items = nav?.items ?? [];
  const ctas = nav?.ctas ?? [];

  return (
    <header className="bg-background sticky top-0 z-40">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-brand-700 focus:text-white focus:px-3 focus:py-2"
      >
        {dictionary.common.skipToContent}
      </a>
      <Container className="flex items-center justify-between py-4">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-16">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 shrink-0"
            aria-label={siteName ?? "Bella&Bona"}
          >
            {logo ? (
              <SanityImage
                image={logo}
                alt={siteName ?? "Bella&Bona"}
                className="h-8 w-auto"
                width_hint={256}
                sizes="160px"
              />
            ) : (
              <span className="text-lg font-semibold tracking-tight">
                {siteName ?? "Bella&Bona"}
              </span>
            )}
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-3">
              {items.map((item, idx) => {
                if (item._type === "navDropdown") {
                  return (
                    <NavDropdown
                      key={item._key ?? `${item._type}-${idx}`}
                      label={pickLocaleString(item.label, locale)}
                      items={item.subItems ?? []}
                      locale={locale}
                    />
                  );
                }
                // navLink
                const href = resolveHref(item.link, locale);
                if (!href) return null;
                const label = pickLocaleString(item.label, locale);
                return (
                  <li key={item._key ?? `${item._type}-${idx}`}>
                    <Link
                      href={href}
                      className="inline-flex items-center px-2 py-1 text-sm font-medium text-ink hover:text-brand-700 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Right: CTAs + language switcher (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {ctas.map((cta, idx) => (
            // We can't get a stable key from CtaInput at render time without
            // touching the schema; use index — order is stable per publish.
            <Button key={idx} cta={cta} locale={locale} />
          ))}
          <LanguageSwitcher
            locale={locale}
            label={dictionary.common.languageSwitcher}
          />
        </div>

        {/* Right: Burger Menu (Mobile) */}
        <MobileNav
          nav={nav}
          logo={logo}
          siteName={siteName}
          locale={locale}
          dictionary={dictionary}
        />
      </Container>
    </header>
  );
}

/**
 * "Segmented control" style locale picker. The active locale has a white
 * background + soft shadow inside a pill-shaped container; inactive locales
 * are muted text. The full path is preserved on switch (we only rewrite the
 * leading `[locale]` segment).
 */
function LanguageSwitcher({
  locale,
  label,
}: {
  locale: SupportedLocale;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-full border border-line p-0.5 text-xs font-semibold uppercase tracking-wider"
    >
      {supportedLocales.map((loc) => {
        const isActive = loc === locale;
        return (
          <Link
            key={loc}
            href={`/${loc}`}
            aria-current={isActive ? "true" : undefined}
            className={
              isActive
                ? "rounded-full bg-background text-brand-800 px-3 py-1 shadow-sm"
                : "rounded-full text-muted hover:text-brand-700 px-3 py-1 transition-colors"
            }
          >
            {loc}
          </Link>
        );
      })}
    </div>
  );
}
