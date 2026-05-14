import { Button, type CtaInput } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { PortableText } from "@/components/primitives/PortableText";
import {
  SanityImage,
  type SanityImageSource,
} from "@/components/primitives/SanityImage";
import { type SupportedLocale } from "@/i18n/config";
import { pickLocaleString, type LocaleValue } from "@/lib/locale-helpers";

import type { PortableTextBlock } from "@portabletext/react";

/**
 * Hero section — 2-column layout matching the Figma.
 *
 * The columns are visually SEPARATE (not a merged card): each has its own
 * rounded-3xl border-radius, and there is a ~33px gap between them.
 *
 * Performance contract:
 *  - Server Component: no client JS on the LCP path.
 *  - Column image uses `fill` + `priority` + `fetchPriority="high"`.
 *  - No entrance animation on this section.
 *
 * Typography: left column text uses lemon (#E6FFA9) per the Figma spec.
 * Mobile: columns stack — text first, image second, app links below image (24px gap).
 */

type AppLink = {
  _key?: string;
  platform?: "google-play" | "app-store";
  url?: string;
};

type Rating = {
  score?: number;
  reviewCount?: number;
  platform?: string;
};

type HeroSection = {
  _type: "section.hero";
  eyebrow?: LocaleValue<string>;
  headline?: LocaleValue<PortableTextBlock[]>;
  subheadline?: LocaleValue<string>;
  cta?: CtaInput;
  image?: SanityImageSource;
  appLinks?: AppLink[];
  rating?: Rating;
};

export function HeroSection({
  section,
  locale,
}: {
  section: HeroSection;
  locale: SupportedLocale;
}) {
  const eyebrow = pickLocaleString(section.eyebrow, locale);
  const subheadline = pickLocaleString(section.subheadline, locale);
  const appLinks = section.appLinks ?? [];
  const hasAppStrip = appLinks.length > 0 || Boolean(section.rating?.score);

  return (
    <section className="bg-background pt-6 md:py-10">
      <Container>
        {/* Two independent 50/50 columns with explicit gap — not a merged card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[33px] lg:min-h-[700px]">
          {/* ── Col 1: text content on dark green, lemon typography ──
               Headline anchored top, subheadline + CTA anchored bottom. */}
          <div className="bg-brand-700 rounded-3xl flex flex-col justify-between px-8 py-12 md:px-12 md:py-16 order-1">
            {/* Top group: eyebrow + headline */}
            <div className="flex flex-col gap-6">
              {eyebrow ? (
                <p className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-lemon">
                  {eyebrow}
                </p>
              ) : null}

              <PortableText
                value={section.headline}
                locale={locale}
                className="[&_p]:text-3xl [&_p]:sm:text-4xl [&_p]:xl:text-5xl [&_p]:font-semibold [&_p]:tracking-tight [&_p]:leading-[1.1] [&_p]:text-lemon"
              />
            </div>

            {/* Bottom group: subheadline + CTA */}
            <div className="flex flex-col gap-4 mt-8">
              {subheadline ? (
                <p className="text-base md:text-[20px] text-lemon/75 leading-relaxed max-w-sm">
                  {subheadline}
                </p>
              ) : null}
              {section.cta ? (
                <Button cta={section.cta} locale={locale} />
              ) : null}
            </div>
          </div>

          {/* ── Col 2: image; app links overlay (desktop) or below image (mobile) ── */}
          <div className="order-2 flex flex-col lg:h-full lg:min-h-0">
            <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-3xl sm:min-h-[320px] lg:min-h-0">
              {section.image ? (
                <SanityImage
                  image={section.image}
                  fill
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-line/30">
                  <span className="text-sm text-muted">
                    No image uploaded yet
                  </span>
                </div>
              )}

              {hasAppStrip ? (
                <HeroAppStrip
                  appLinks={appLinks}
                  rating={section.rating}
                  className="absolute bottom-0 left-0 right-0 hidden flex-wrap items-center gap-3 px-5 py-4 lg:flex"
                />
              ) : null}
            </div>

            {hasAppStrip ? (
              <HeroAppStrip
                appLinks={appLinks}
                rating={section.rating}
                className="mt-6 flex flex-wrap items-center gap-3 lg:hidden"
              />
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroAppStrip({
  appLinks,
  rating,
  className,
}: {
  appLinks: AppLink[];
  rating?: Rating;
  className?: string;
}) {
  return (
    <div className={className}>
      {appLinks.map((link, idx) => (
        <AppStoreBadge
          key={link._key ?? idx}
          platform={link.platform}
          url={link.url}
        />
      ))}
      {rating?.score ? <RatingBadge {...rating} /> : null}
    </div>
  );
}

/* ── App store badge ─────────────────────────────────────── */

function AppStoreBadge({
  platform,
  url,
}: {
  platform?: "google-play" | "app-store";
  url?: string;
}) {
  if (!url) return null;
  const isGoogle = platform === "google-play";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-4 py-2 text-xs font-medium hover:bg-ink/80 transition-colors"
      aria-label={
        isGoogle ? "Get it on Google Play" : "Download on the App Store"
      }
    >
      {isGoogle ? (
        <GooglePlayIcon className="h-4 w-4 shrink-0" />
      ) : (
        <AppStoreIcon className="h-4 w-4 shrink-0" />
      )}
      <span className="flex flex-col leading-none">
        <span className="text-[9px] font-normal opacity-75">
          {isGoogle ? "GET IT ON" : "Download on the"}
        </span>
        <span>{isGoogle ? "Google Play" : "App Store"}</span>
      </span>
    </a>
  );
}

/* ── Google rating badge ─────────────────────────────────── */

function RatingBadge({ score, reviewCount, platform = "Google" }: Rating) {
  if (!score) return null;
  const stars = Math.round(score);

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-medium text-ink"
      aria-label={`${platform} rating: ${score} out of 5${reviewCount ? `, ${reviewCount} reviews` : ""}`}
    >
      <span className="font-bold text-[#4285F4]" aria-hidden="true">
        G
      </span>
      <span className="flex text-amber-400" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < stars} className="h-3 w-3" />
        ))}
      </span>
      <span className="font-semibold">{score.toFixed(1)}</span>
      {reviewCount ? <span className="text-muted">({reviewCount})</span> : null}
    </div>
  );
}

/* ── SVG icons ───────────────────────────────────────────── */

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 20.5v-17c0-.83 1.01-1.3 1.71-.78l15.36 8.5a1 1 0 0 1 0 1.56L4.71 21.28C4.01 21.8 3 21.33 3 20.5z"
        fill="url(#gp-hero)"
      />
      <defs>
        <linearGradient
          id="gp-hero"
          x1="3"
          y1="12"
          x2="20"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00D2FF" />
          <stop offset="1" stopColor="#7B2FF7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AppStoreIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function StarIcon({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      aria-hidden="true"
    >
      <path d="M10 1.5l2.39 5.28 5.72.42-4.33 3.85 1.37 5.59L10 13.5l-5.15 3.14 1.37-5.59L1.89 7.2l5.72-.42L10 1.5z" />
    </svg>
  );
}
