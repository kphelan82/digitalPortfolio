import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      year: z.number().int().min(1990).max(2100),
      role: z.string(),
      summary: z.string().max(240, 'Keep the summary under 240 characters'),
      // Path relative to the .md file, e.g. ../../assets/thumbnails/aarp.svg
      thumbnail: image(),
      // Lower numbers appear first on the home grid. Ties fall back to newest year.
      order: z.number().int().default(999),
      // Drafts are visible in `npm run dev` but excluded from production builds.
      draft: z.boolean().default(false),
    }),
});

export const collections = { 'case-studies': caseStudies };
