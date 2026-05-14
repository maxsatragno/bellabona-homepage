import { siteUrl } from './url'

/**
 * Builders for schema.org JSON-LD objects.
 *
 * We render them as `<script type="application/ld+json">` inside the relevant
 * layout/page. Strings are HTML-escaped at render time (`escapeJsonLd`) to
 * prevent `</script>` from breaking out of the script tag.
 */

export type OrganizationInput = {
  legalName?: string
  addressLocality?: string
  addressCountry?: string
  contactEmail?: string
  contactPhone?: string
  sameAs?: string[]
}

export type OrganizationJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name?: string
  url: string
  logo?: string
  address?: {
    '@type': 'PostalAddress'
    addressLocality?: string
    addressCountry?: string
  }
  contactPoint?: Array<{
    '@type': 'ContactPoint'
    email?: string
    telephone?: string
    contactType: 'customer service'
  }>
  sameAs?: string[]
}

export function organizationJsonLd(input: {
  organization?: OrganizationInput
  logoUrl?: string
  siteName?: string
}): OrganizationJsonLd {
  const org = input.organization ?? {}
  const ld: OrganizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.legalName ?? input.siteName,
    url: siteUrl(),
  }
  if (input.logoUrl) ld.logo = input.logoUrl
  if (org.addressLocality || org.addressCountry) {
    ld.address = {
      '@type': 'PostalAddress',
      addressLocality: org.addressLocality,
      addressCountry: org.addressCountry,
    }
  }
  if (org.contactEmail || org.contactPhone) {
    ld.contactPoint = [
      {
        '@type': 'ContactPoint',
        email: org.contactEmail,
        telephone: org.contactPhone,
        contactType: 'customer service',
      },
    ]
  }
  if (org.sameAs && org.sameAs.length > 0) ld.sameAs = org.sameAs
  return ld
}

/** Serializes a JSON-LD object for safe embedding in an HTML `<script>` tag. */
export function escapeJsonLd(ld: object): string {
  return JSON.stringify(ld).replace(/</g, '\\u003c')
}
