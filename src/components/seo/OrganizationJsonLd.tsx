import { organizationJsonLd, escapeJsonLd, type OrganizationInput } from '@/lib/jsonld'

/**
 * Renders Organization schema.org JSON-LD as a `<script>` tag. Place once,
 * high in the tree (locale layout / homepage). Data comes from
 * `siteSettings.organization`.
 *
 * The script content is JSON.stringified with `<` escaped — see `escapeJsonLd`
 * — to prevent any user-supplied string from breaking out of the script tag.
 */
export function OrganizationJsonLd({
  organization,
  siteName,
  logoUrl,
}: {
  organization?: OrganizationInput
  siteName?: string
  logoUrl?: string
}) {
  const ld = organizationJsonLd({ organization, siteName, logoUrl })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(ld) }}
    />
  )
}
