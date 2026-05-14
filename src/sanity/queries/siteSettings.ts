import { groq } from 'next-sanity'

/**
 * Single global doc with site-wide chrome (navbar, footer) + Organization data
 * for JSON-LD.
 */
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    logo {
      ...,
      alt,
      asset->{ _id, metadata { dimensions, lqip } }
    },
    nav {
      items[] {
        _type,
        _key,
        label,
        // navLink only -- null on navDropdown items
        link {
          kind, href, openInNewTab,
          internal->{ "slug": slug.current }
        },
        // navDropdown only -- null on navLink items. Aliased so the rendered
        // shape does not collide with the outer items[] selector.
        "subItems": items[] {
          _key, label,
          link {
            kind, href, openInNewTab,
            internal->{ "slug": slug.current }
          }
        }
      },
      ctas[] {
        _key, label, variant, actionId, customClass
      }
    },
    footer {
      socialBlock {
        title, caption, email,
        links[] {
          _key,
          icon {
            ...,
            alt,
            asset->{ _id, metadata { dimensions, lqip } }
          },
          url, openInNewTab
        }
      },
      columns[] {
        _key, heading,
        links[] {
          _key, label,
          link {
            kind, href, openInNewTab,
            internal->{ "slug": slug.current }
          }
        }
      },
      legal
    },
    organization {
      legalName, addressLocality, addressCountry,
      contactEmail, contactPhone, sameAs
    }
  }
`
