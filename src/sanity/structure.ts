import type { StructureResolver } from 'sanity/structure'

/**
 * Studio structure tree.
 *
 * - `siteSettings` is rendered as a singleton document at a fixed id so editors
 *   can't accidentally create duplicates.
 * - The homepage (page with `slug.current == '/'`) is pinned at the top so
 *   editors find it without scrolling. Other pages fall under "All pages".
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings')
        ),
      S.divider(),
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .icon(() => '🏠')
        .child(
          S.documentList()
            .title('Homepage')
            .schemaType('page')
            .filter('_type == "page" && slug.current == "/"')
            .apiVersion('2025-05-01')
            .canHandleIntent(() => false)
        ),
      S.listItem()
        .title('All pages')
        .id('all-pages')
        .icon(() => '📄')
        .child(
          S.documentList()
            .title('Pages')
            .schemaType('page')
            .filter('_type == "page"')
            .apiVersion('2025-05-01')
        ),
    ])
