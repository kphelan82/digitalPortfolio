// Internal links go through url() so the site works both at the domain root (production,
// kevinphelandesign.com) and under a subpath (the GitHub Pages preview at
// <user>.github.io/digitalPortfolio). The base comes from astro.config.mjs, which reads the
// BASE_PATH environment variable; with it unset the base is "/" and url() returns the path unchanged.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an absolute site path ("/bio", "/work/aarp", "/favicon.svg") with the base. */
export function url(path: string): string {
  return base + (path.startsWith('/') ? path : `/${path}`);
}

/** The inverse, for comparing Astro.url.pathname against a site path. */
export function stripBase(pathname: string): string {
  return base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
}
