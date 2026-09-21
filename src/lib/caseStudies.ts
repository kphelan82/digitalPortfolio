import { getCollection, type CollectionEntry } from 'astro:content';

export type CaseStudy = CollectionEntry<'case-studies'>;

/** Published case studies in display order. Drafts are included only in dev. */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const entries = await getCollection(
    'case-studies',
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  return entries.sort(
    (a, b) =>
      a.data.order - b.data.order ||
      b.data.year - a.data.year ||
      a.data.title.localeCompare(b.data.title),
  );
}
