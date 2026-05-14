# Bella&Bona — Homepage Case Study

A production-grade homepage for Bella&Bona built on **Next.js 16 (App Router) + Sanity v5 + Tailwind v4**, deployed on **Vercel**.

> Author: Maximiliano Satragno · [github.com/maxsatragno](https://github.com/maxsatragno)
> Submission for the Bella&Bona Frontend Developer technical test (June 2025 brief).

---

## Running locally

```bash
pnpm install
cp .env.example .env.local        # then fill in the Sanity variables
pnpm dev                          # http://localhost:3000
```

Requirements: Node 20+, pnpm 9+.

Routes:
- **`/`** → 308 redirects to `/en` (or `/de`, based on `Accept-Language`).
- **`/[locale]`** → the homepage in the requested locale.
- **`/studio`** → embedded Sanity Studio for editors.
- **`/api/revalidate`** → webhook target for Sanity publishes.
- **`/sitemap.xml`**, **`/robots.txt`** → standard SEO routes.

---

## Key technical decisions

### 1. Rendering: **ISR with tag-based revalidation** (not SSR, not SSG)
The homepage is fetched on the server inside a Server Component, never via `useEffect` on the client. Every Sanity query is registered with a Next cache tag (`page`, `siteSettings`) so the `/api/revalidate` webhook can purge instantly when an editor hits Publish:

```ts
// src/app/[locale]/page.tsx
export const revalidate = 60
// + sanityFetch({ query, tags: ['page'] }) on the data layer
```

```ts
// src/app/api/revalidate/route.ts
revalidateTag('page', { expire: 0 })
revalidateTag('siteSettings', { expire: 0 })
```

Why ISR over SSR: the homepage's TTFB sits on the **LCP** critical path. SSR would put Sanity's network latency in front of every paint. ISR caches at the edge, the webhook makes invalidation feel like SSR to the editor (sub-second freshness) without the latency tax for visitors. The 60-second baseline is a safety net for missed webhooks.

Why not pure SSG: a non-developer editor team needs the page to update without a redeploy.

### 2. LCP-optimised hero
- `<HeroSection>` is a Server Component (zero client JS in the LCP path).
- The background image uses `next/image` with `priority`, `fetchPriority="high"`, explicit `width`/`height` from `asset->metadata.dimensions`, and `placeholder="blur"` with `blurDataURL` from Sanity's `lqip`.
- **No entry animation on the hero** — animations are reserved for below-the-fold sections (`<RevealOnScroll>`, pure CSS + IntersectionObserver, ~30 lines of code, zero libraries).
- Fonts are loaded with `next/font` (`Geist`, `display: swap`).

### 3. Sanity schema — **page-builder with separated SEO**
One reusable `page` document (slug `/` = homepage; any other slug = a landing page) carries a polymorphic `sections[]` array of **14 section variants**. Adding a new landing page is a Studio operation, not a code change — matching the brief's "20 minutes to add, not two days" requirement.

SEO lives in its own field group on every `page`, exposed as a separate **SEO** tab in the Studio (not interleaved with content fields). Object shape:

```
seo:
  metaTitle (localeString, length validation)
  metaDescription (localeText, length validation)
  ogImage (image with hotspot)
  canonicalOverride (url, optional)
  noIndex (boolean)
```

Every localized field is `{ en: string, de: string }`. The brief asks for DE primary in production but EN-only for the test, so routing and dictionaries support both from day one (see §5).

### 4. SEO defaults — added without prompting
- **Organization JSON-LD** on every page, populated from `siteSettings.organization` (legalName, address, contactPoint, sameAs).
- **`generateMetadata`** builds: `title`, `description`, canonical, `openGraph` (incl. Sanity OG image), `twitter`, `robots`, and **hreflang `alternates.languages`** with `en`, `de`, and `x-default` → DE (production primary market).
- **`sitemap.ts`** enumerates published `page` documents from Sanity × locales, with per-entry hreflang language alternates.
- **`robots.ts`** allows `/`, disallows `/studio` and `/api/`, references the sitemap.
- **FAQ schema** (`FAQPage` JSON-LD) is auto-emitted by `<FaqSection>` so the section is rich-results-ready out of the box.

### 5. i18n architecture
- `/[locale]/page.tsx` with `generateStaticParams` returning `[{locale:'en'}, {locale:'de'}]`.
- `src/proxy.ts` (Next 16's renamed middleware) detects the locale, redirects bare `/` to the right prefix, and forwards an `x-locale` REQUEST header. The root `layout.tsx` reads it via `headers()` to set `<html lang>` correctly per request.
- **Field-level localization** in Sanity (`{en, de}` per field) is the pragmatic choice for an institutional homepage where most copy ships in both languages. If editorial later needs per-locale drafts, this migrates to `@sanity/document-internationalization` without breaking the rendered shape.
- UI chrome strings (skip-link, aria-labels) live in `src/i18n/dictionaries/{en,de}.json` — they're not editorial content and shouldn't be in Sanity.

### 6. Animations — CSS-only
A single `<RevealOnScroll>` client component using `IntersectionObserver` toggles `.is-visible` on enter, and the actual transition lives in `globals.css`. Respects `prefers-reduced-motion`. **No framer-motion, no GSAP** — the brief flagged animation libraries as a risk for LCP.

---

## Project layout

```
src/
  app/
    [locale]/        ← homepage and locale-aware shell
    api/revalidate/  ← Sanity webhook target
    studio/          ← embedded Studio (Client Component + server layout for metadata)
    sitemap.ts
    robots.ts
    layout.tsx       ← root layout, sets <html lang> from x-locale header
  components/
    sections/        ← 14 page-builder section components + dispatcher
    layout/          ← Navbar, Footer, RevealOnScroll
    primitives/      ← Button, Container, SanityImage, PortableText
    seo/             ← OrganizationJsonLd
  i18n/              ← config, dictionaries, getDictionary loader
  lib/               ← metadata builder, JSON-LD builders, URL helpers
  sanity/
    schemas/         ← objects/, documents/, sections/
    queries/         ← GROQ queries (page, siteSettings)
    client.ts, sanity-fetch.ts, image.ts, env.ts
    structure.ts     ← Studio sidebar (Site settings singleton + pinned Homepage)
  proxy.ts           ← locale routing + x-locale header forwarding
sanity.config.ts     ← Studio configuration (root level)
```

---

## Trade-offs and deviations

- **Stack version drift from the brief.** The brief (June 2025) specifies "Next.js 14+ + Sanity v3". I targeted current majors — **Next.js 16, Sanity v5, Tailwind v4** — because `next-sanity@12` (required for Next 16 support) requires Sanity v5. The schema authoring API is unchanged between Sanity v3 and v5 (`defineType` / `defineField`); the migration is purely peer-dep alignment. Documented for transparency.
- **Field-level i18n** instead of the `@sanity/document-internationalization` plugin. For a brand homepage where translations land together, this is cleaner; for a content-heavy migration where DE drafts need to ship before EN translations are ready, the plugin is the better choice. Either way the rendered shape stays the same.
- **Sanity write token in `.env.local`.** Saved per the user's flow, but at delivery time this should be rotated to a `Viewer`-scoped token (write permission is unnecessary for the public site).
- **No content seeding script.** The Studio is the source of truth; seed content is created via the embedded `/studio` UI. A `pnpm seed` script could be added in a follow-up PR.
- **Mobile menu deferred.** The Navbar collapses to a horizontal layout that stays functional on small viewports. A proper slide-out menu (client component) is a small follow-up.

---

## What I'd do differently with more time

1. **Sanity Live Preview** (`@sanity/visual-editing` + `defineLive`) so editors see drafts in-place.
2. **Playwright e2e** covering the editor publish → ISR invalidation loop end-to-end.
3. **Lighthouse CI** wired into the GitHub Actions PR check.
4. **Real Figma typography tokens.** I derived Tailwind tokens from the SVG export only (color `#024930`); a proper integration with the live Figma file would replace approximations with exact values.
5. **Per-section visual regression tests** with a tool like Chromatic to catch unintended drift.
6. **Blog migration prep**: an `Article` schema + `Article` JSON-LD on post pages, as the wider brief outlines.

---

## Verification

| Check | Where |
|---|---|
| No `useEffect` fetch on content | `grep -r "useEffect" src/` — only `<RevealOnScroll>` (animation, not fetch) |
| Hero image `priority` + `fetchPriority="high"` | `src/components/sections/HeroSection.tsx:33-40` |
| ISR + revalidateTag | `src/app/[locale]/page.tsx:14`, `src/app/api/revalidate/route.ts` |
| SEO group separated in schema | `src/sanity/schemas/documents/page.ts:7-12` |
| Organization JSON-LD | `src/components/seo/OrganizationJsonLd.tsx`, used in `src/app/[locale]/page.tsx` |
| Hreflang DE/EN/x-default | `src/lib/metadata.ts:55-60` |
| Sitemap + locale alternates | `src/app/sitemap.ts` |
| Robots blocks `/studio` | `src/app/robots.ts` |

---

## License

UNLICENSED — submitted as a coding sample for Bella&Bona's hiring process.
