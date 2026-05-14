import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemas'
import { structure } from './src/sanity/structure'

/**
 * Sanity Studio configuration.
 *
 * The Studio is embedded into the Next.js app at /studio (see
 * `src/app/studio/[[...tool]]/page.tsx`). This keeps editing, hosting, and
 * the content layer in a single deploy.
 */
export default defineConfig({
  name: 'bellabona-studio',
  title: 'Bella&Bona',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
