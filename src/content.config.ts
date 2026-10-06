import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: ({ image }) => {
    // A headline number with a label and a glyph, e.g. "4,000+" / "recruitment leads".
    // The glyph is just the icon; the hexagon behind it is drawn by the template.
    const stat = z.object({
      value: z.string(),
      label: z.string(),
      icon: image(),
    });

    // A screenshot with a short caption. Alt text defaults to empty (the caption names
    // it); add `alt` only if the image says something the caption doesn't.
    const feature = z.object({
      image: image(),
      caption: z.string(),
      alt: z.string().default(''),
    });

    // One card on the case study page. Every section has a title and optional
    // paragraphs; a section can also carry a bulleted list, a stats row and/or a
    // feature grid.
    const section = z.object({
      title: z.string(),
      paragraphs: z.array(z.string()).default([]),
      // Plain bullets. Handy as a stand-in for `features` until screenshots exist.
      list: z.array(z.string()).optional(),
      stats: z.array(stat).optional(),
      features: z.array(feature).optional(),
    });

    return z.object({
      title: z.string(),
      client: z.string(),
      year: z.number().int().min(1990).max(2100),
      role: z.string(),
      // Shown in the meta strip under the hero, e.g. "Interactive micro-site".
      product: z.string().optional(),
      summary: z.string().max(240, 'Keep the summary under 240 characters'),
      // Path relative to the .md file, e.g. ../../assets/thumbnails/aarp.svg
      // Also used as the hero image on the case study page.
      thumbnail: image(),
      // Lower numbers appear first on the home grid. Ties fall back to newest year.
      // The page's hexagon badge ("01") is the entry's position in that same order.
      order: z.number().int().default(999),
      // Drafts are visible in `npm run dev` but excluded from production builds.
      draft: z.boolean().default(false),
      // The cards below the hero, in order. When omitted, the page falls back to
      // rendering the Markdown body (the older layout) — used while case studies
      // are being moved onto the card template.
      sections: z.array(section).optional(),
    });
  },
});

export const collections = { 'case-studies': caseStudies };
