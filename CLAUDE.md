# CLAUDE.md

This file is loaded automatically by Claude Code agents working in this repository. Read it first.

## Project

Bella&Bona homepage — case study técnico para postular a un proyecto freelance.

**Stack real instalado:** Next.js 16 + React 19 + Tailwind **v4** + Sanity **v5** + next-sanity v12 + TypeScript 5.

> The brief originally asked for Next 14+ and Sanity v3 (written June 2025). We deviated to current majors for compatibility (next-sanity v12 requires Sanity v5 to support Next 16). Document the deviation in README.

**Important:** Tailwind v4 has no `tailwind.config.ts` — theme tokens live in `@theme` directives inside `src/app/globals.css`.

**Important:** Next.js 16 has API changes vs prior versions. Read `node_modules/next/dist/docs/01-app/` if in doubt. Key gotchas (verified from official docs):

### Next 16 gotchas vs Next 14 patterns in training data

1. **`params` and `searchParams` are now `Promise`s.** Must `await` them in every `page.tsx`, `layout.tsx`, and `generateMetadata` with dynamic segments:
   ```tsx
   export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
     const { locale } = await params
     // ...
   }
   ```

2. **`fetch()` is NOT cached by default.** Must opt in explicitly:
   ```tsx
   await fetch(url, { next: { revalidate: 60, tags: ['homepage'] } })
   // or { cache: 'force-cache' }
   ```
   This affects `next-sanity`'s `client.fetch()` too — pass `next: { tags, revalidate }` via the second arg.

3. **ISR still works the old way** at the route level: `export const revalidate = 60`. BUT `revalidateTag()` in Next 16 has a **mandatory second arg**: `revalidateTag(tag, profile | { expire: number })`. We pass `{ expire: 0 }` in `app/api/revalidate/route.ts` for immediate eviction. `revalidatePath()` still single-arg in practice.

4. **JSON-LD pattern unchanged.** Render `<script type="application/ld+json">` inside the page/layout. Use `JSON.stringify(...).replace(/</g, '\\u003c')` to sanitize.

5. **sitemap.ts, robots.ts, opengraph-image.tsx**: still file-based routes, signatures unchanged.

6. **next/image**: same API. Use `priority` for the LCP hero image; `placeholder="blur"` with `blurDataURL` from Sanity's `asset->metadata.lqip`.

7. **i18n**: still `app/[locale]/...` + `middleware.ts` (a.k.a. "Proxy" in new docs but the file is still called `middleware.ts`). No built-in i18n config field.

8. **`onLoadingComplete` is deprecated** on next/image — use `onLoad`.

### React 19 gotchas

- **`react-hooks/set-state-in-effect`** is enforced by the bundled ESLint config. Calling `setState()` synchronously inside a `useEffect` is a lint error (causes a double render). For external subscriptions (matchMedia, online status, etc.) use `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` — see `src/components/layout/NavDropdown.tsx` for the canonical pattern.

### Tailwind v4 gotchas

- No `tailwind.config.ts`. Theme tokens are CSS-native via `@theme { --color-... }` in `src/app/globals.css`.
- No `@tailwind base/components/utilities` — just `@import "tailwindcss";`.
- PostCSS plugin is `@tailwindcss/postcss` (already configured in `postcss.config.mjs`).

## Source of truth for status

**Always read [`doc/project_status.md`](doc/project_status.md) before starting work.** It contains:
- The current phase
- Open decisions blocking progress
- Operational checklists per phase
- Live log of in-flight notes

Full architecture plan (frozen): `/Users/maximilianosatragno/.claude/plans/tengo-como-objetivo-desarrollar-fizzy-yeti.md`

## Account context

- **GitHub remote (for Phase 7 deploy):** `github.com/maxsatragno/<repo-name>`. The user has a second corporate GitHub account; do NOT use it. Only `maxsatragno`.
- **Sanity project:** `finqjjyw` (org `olyoMyfZg`), dataset `production`. Credentials in `.env.local` only.

## Working norms

- Idioma de conversación con el usuario: **español**.
- Idioma del código y comentarios: **inglés** (es código de entrega para evaluadores de habla inglesa).
- Commit messages: inglés.
- Package manager: **pnpm**.
- TypeScript estricto.
- No instalar librerías de animación (framer-motion, GSAP). Animaciones solo con CSS + IntersectionObserver.
- No `useEffect` para fetch de contenido editorial — todo desde Server Components / GROQ.
- SEO fields siempre en grupo `seo` separado del content en Sanity schemas.
- Hreflang DE/EN + Organization JSON-LD son **obligatorios** desde el primer commit que toque layout.

## Directorios

- `doc/` → **local-only, gitignored.** PDFs originales, Figma SVG, y `project_status.md`.
- `src/` → código del proyecto Next.js.
- Sanity Studio embebido en `src/app/studio/[[...tool]]/page.tsx`.

## Updating status

Cuando completes un checkbox de `doc/project_status.md`:
1. Marcalo `[x]` inmediatamente.
2. Si tomaste una decisión no planeada, anotala en "Notas vivas".
3. Si descubrís un blocker, movelo a "Decisiones pendientes" y avisá al usuario.
