import { defineConfig } from 'astro/config';

const basePath = (process.env.BASE_PATH || '').replace(/\/$/, '');

// Redirect targets aren't prefixed with `base` automatically, so add it here.
const redirects = {
  '/case-study_01': '/work/usaf-switching-seats',
  '/case-study-aarp': '/work/aarp',
  '/case-study_roar': '/work/roar',
  '/case-study-canvashack': '/work/canvashack',
  '/case-study-bydureon': '/work/bydureon',
  '/case-study-latuda': '/work/latuda',
  '/case-study-ihop': '/work/ihop',
  '/bio-1': '/bio',
  '/resume': '/cv', // the new résumé page lives at /cv so this old path can redirect
  '/new-page': '/gallery', // the old gallery page
  // The old work listings and a duplicate of the old home page all become the new home grid.
  '/work-1': '/',
  '/case-studies': '/',
  '/case-studies-index': '/',
  '/home-five': '/',
};

// https://astro.build/config
export default defineConfig({
  // Subpath for the GitHub Pages preview (BASE_PATH=/digitalPortfolio in the deploy workflow).
  // Leave BASE_PATH unset for the real domain, where the site lives at the root.
  base: process.env.BASE_PATH || '/',

  // Production URL (used for canonical links).
  site: 'https://kevinphelandesign.com',

  // Old URLs -> new URLs. In a static build Astro emits a small HTML page with a
  // meta-refresh for each entry. If the host supports real 301s (Netlify
  // `_redirects`, Vercel `vercel.json`, Cloudflare `_redirects`), mirror these there.
  redirects: Object.fromEntries(Object.entries(redirects).map(([from, to]) => [from, basePath + to])),
});
