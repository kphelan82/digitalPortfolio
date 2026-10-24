import type { APIRoute } from 'astro';
import { getCaseStudies } from '../lib/caseStudies';
import { url } from '../lib/url';

// Lists the real pages only (not the redirect stubs for old URLs). Case studies come from
// getCaseStudies(), so drafts stay out. Trailing slashes match what the canonical links use.
export const GET: APIRoute = async ({ site }) => {
  const caseStudies = await getCaseStudies();
  const paths = ['/', '/bio', '/cv', '/gallery', ...caseStudies.map((entry) => `/work/${entry.id}`)];
  const loc = (path: string) => new URL(url(path === '/' ? '/' : `${path}/`), site).href;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${loc(path)}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
