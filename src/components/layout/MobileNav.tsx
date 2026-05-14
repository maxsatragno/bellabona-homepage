"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { type NavbarInput } from "@/components/layout/Navbar";
import { Button } from "@/components/primitives/Button";
import {
  SanityImage,
  type SanityImageSource,
} from "@/components/primitives/SanityImage";
import { supportedLocales, type SupportedLocale } from "@/i18n/config";
import { resolveHref } from "@/lib/links";
import { pickLocaleString } from "@/lib/locale-helpers";

export function MobileNav({
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
  dictionary: { common: { languageSwitcher: string } };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on navigation (back/forward + locale switch). Uses React 19's
  // "derive state from prop change" pattern instead of setState-in-effect so
  // we comply with `react-hooks/set-state-in-effect`. Most Link clicks also
  // call setIsOpen(false) explicitly via onClick — this is the fallback.
  const [trackedPath, setTrackedPath] = useState(pathname);
  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    if (isOpen) setIsOpen(false);
  }

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const items = nav?.items ?? [];
  const ctas = nav?.ctas ?? [];

  return (
    <div className="md:hidden flex items-center">
      <button
        type="button"
        className="p-2 -mr-2 text-ink hover:text-brand-700 focus:outline-none"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-50 flex flex-col bg-background transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-line/50">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 shrink-0"
              aria-label={siteName ?? "Bella&Bona"}
              onClick={() => setIsOpen(false)}
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
            <button
              type="button"
              className="p-2 -mr-2 text-ink hover:text-brand-700 focus:outline-none"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8">
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-6">
                {items.map((item, idx) => {
                  if (item._type === "navDropdown") {
                    const label = pickLocaleString(item.label, locale);
                    return (
                      <li key={item._key ?? `${item._type}-${idx}`} className="flex flex-col gap-3">
                        <span className="text-lg font-semibold text-brand-800">{label}</span>
                        <ul className="flex flex-col gap-3 pl-4 border-l-2 border-line/50">
                          {item.subItems?.map((subItem, subIdx) => {
                            const subHref = resolveHref(subItem.link, locale);
                            if (!subHref) return null;
                            const subLabel = pickLocaleString(subItem.label, locale);
                            return (
                              <li key={subItem._key ?? subIdx}>
                                <Link
                                  href={subHref}
                                  className="block text-base text-ink hover:text-brand-700"
                                >
                                  {subLabel}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
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
                        className="block text-lg font-semibold text-brand-800 hover:text-brand-700"
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex flex-col gap-4 mt-auto pt-8 border-t border-line/50">
              {ctas.map((cta, idx) => (
                <Button key={idx} cta={cta} locale={locale} className="w-full" />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-muted uppercase tracking-wider">
                {dictionary.common.languageSwitcher}
              </span>
              <div className="flex items-center gap-2">
                {supportedLocales.map((loc) => {
                  const isActive = loc === locale;
                  return (
                    <Link
                      key={loc}
                      href={`/${loc}`}
                      aria-current={isActive ? "true" : undefined}
                      className={
                        isActive
                          ? "rounded-full bg-brand-700 text-white px-4 py-2 text-sm font-medium shadow-sm"
                          : "rounded-full border border-line text-ink hover:border-brand-700 hover:text-brand-700 px-4 py-2 text-sm font-medium transition-colors"
                      }
                    >
                      {loc.toUpperCase()}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
