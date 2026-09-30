# Designer portfolio (Astro)

Static portfolio site. All content is currently **placeholder** — names, copy, images and the LinkedIn/email values need replacing.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321 (drafts are visible)
npm run build    # static output to dist/ (drafts excluded)
npm run preview  # serve dist/
```

Node 20.3+ (or 22+). The only dependency is `astro`. Don't add integrations, UI frameworks, or CSS frameworks without a clear need; there is no `@astrojs/check` or TypeScript devDependency on purpose.

## Structure

```
astro.config.mjs            site URL + redirects
src/content.config.ts       case study collection + Zod schema
src/content/case-studies/   one .md file per case study (filename = URL slug)
src/data/site.ts            name, email, socials, footer text, nav
src/data/resume.ts          résumé content (rendered by pages/cv.astro)
src/lib/caseStudies.ts      getCaseStudies(): draft filtering + sort order
src/assets/thumbnails/      case study thumbnails
src/assets/gallery/         gallery images (auto-read)
src/components/             Header, Footer, ContactLinks, EmailLink, CaseStudyCard
src/layouts/BaseLayout.astro
src/pages/                  index, bio, cv, gallery, work/[slug], 404
src/styles/global.css       design tokens + base styles
public/                     favicon and other files served as-is
```

## Routes

| URL | File |
| --- | --- |
| `/` | `src/pages/index.astro` (intro + case study grid) |
| `/work/<slug>` | `src/pages/work/[slug].astro` |
| `/gallery` | `src/pages/gallery.astro` |
| `/bio` | `src/pages/bio.astro` |
| `/cv` | `src/pages/cv.astro` (résumé) |

The résumé is at `/cv` (not `/resume`) because `/resume` is an old URL that redirects here. Edit its content in `src/data/resume.ts`, not in the page. The bio text is written directly in `src/pages/bio.astro`.

## Case studies

Each case study is a Markdown file in `src/content/case-studies/`. The filename becomes the slug (`aarp.md` → `/work/aarp`). Frontmatter is validated by the Zod schema in `src/content.config.ts`; a build fails with a clear error if a field is missing or the wrong type.

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | |
| `client` | string | |
| `year` | integer | e.g. `2024` |
| `role` | string | |
| `summary` | string | max 240 chars; shown on the card and as the meta description |
| `thumbnail` | image path | relative to the .md file, e.g. `../../assets/thumbnails/aarp.svg`; must exist |
| `order` | integer | lower first; default `999`; ties sort newest `year` first |
| `draft` | boolean | default `false`; drafts show (with a badge) in `npm run dev`, are omitted from builds |

- To add a field: edit the schema in `src/content.config.ts`, then use it in `CaseStudyCard.astro` / `work/[slug].astro`.
- Always load case studies through `getCaseStudies()` (`src/lib/caseStudies.ts`), never `getCollection` directly, so drafts and ordering stay consistent.
- Images inside a case study body: put the file in `src/assets/` and reference it relatively (`![Alt](../../assets/foo.png)`); Astro optimizes it.
- Renaming or deleting a case study slug changes its URL. Add a redirect for the old URL (below).

## Site data (`src/data/site.ts`)

The single place for name, tagline, description, email, social links, footer text, nav items, and the optional résumé PDF path. Components read from it; don't hard-code these values elsewhere. Add another social link by appending `{ label, url }` to `socials`.

`tagline` is the homepage H1; `brandTagline` is a separate, shorter field for the small line under the name in the header logo lockup ("digital experience & visual design") — don't conflate the two.

## Header logo lockup

The header's brand block (`Header.astro`) is a logo lockup, not a nav link styled like the others: the name renders large, bold, and in the fixed `--header-brand-red` token (lowercase via `text-transform`, not by editing `site.name`, which stays properly cased for page titles/footer/meta), so it reads as part of the mark rather than "just another link". The whole lockup (icon + name) still links home — that's deliberate, since clicking a logo to go home is a standard, expected convention; only the visual treatment changes.

`brandTagline` only renders once there's room (a `min-width: 52rem` media query on `.brand-tagline`), and drops on narrower viewports along with the larger logo size — there's no fixed breakpoint tying this to the header's own wrap point, so check both independently after changing either.

## Contact: no form

There is deliberately no contact form. Contact is LinkedIn (from `site.socials`) plus a spam-resistant email link:

- Use `<ContactLinks />` for the full set, or `<EmailLink />` alone. Never write the address into a template or a `mailto:` href by hand.
- `EmailLink` base64-encodes `site.email` at build time and builds the `mailto:` link in the browser, so scrapers that don't run JS never see the address. Without JS, visitors see `name [at] domain [dot] com`.

## Gallery

`gallery.astro` reads every image in `src/assets/gallery/` via `import.meta.glob` (jpg, jpeg, png, webp, avif, gif, svg). Order is by filename (numeric-aware), so prefix files with `01-`, `02-`, … to control it. Alt text is generated from the filename with the number prefix and extension stripped, so name files descriptively (`04-packaging-redesign.jpg`).

## Styling

- All colors, fonts, type scale, widths, spacing and radius are CSS custom properties at the top of `src/styles/global.css`. Change the look there.
- **Dark is the default theme** (brand-driven, not system-driven) — the base `:root` block holds the dark palette. A `prefers-color-scheme: light` override further down supplies the light alternate for visitors whose systems request it. This is inverted from Astro's usual pattern (light default + dark override), so don't "fix" it back the normal way.
- `--color-accent` is **not** the same hex in both themes: the brand blue (`#4a93ba`) reads fine on the dark background but fails text contrast (~2.3:1) against the light background's `#d3d3d3`, so the light override uses a darkened same-hue shade (`#2e607a`) instead. If the brand blue ever changes, recheck contrast against both theme backgrounds before swapping the light-mode value too.
- `--color-badge-bg` / `--color-badge-text` (brand red + white) are fixed in both themes — used only as a filled chip (the "Draft" badge), never as text color directly on the page background, so they don't need a light/dark variant.
- `--color-heading-accent` is the brand red used as **text** (currently only the résumé's section headings, `src/pages/cv.astro`), so — unlike the badge — it does need a per-theme value: the literal brand red (`#b81b1b`) is only ~2.5:1 against the dark background, under the 3:1 large-text minimum, so the dark theme uses a lightened same-hue shade (`#e35b5b`, ~4.7:1) while the light theme uses the literal brand red unchanged (it already clears ~4.4:1 there). This is the mirror image of `--color-accent`'s situation — that one needed adjusting for light mode instead. Keep both in mind as separate cases if the brand colors ever change.
- **A visitor can override the theme** with the toggle in the header (`components/ThemeToggle.astro`), regardless of their OS setting. The choice is written to `localStorage` (key `theme`) and re-applied as `data-theme="light"|"dark"` on `<html>` by a blocking inline script in `BaseLayout.astro`'s `<head>`, before first paint, so there's no flash of the wrong theme. The CSS variable blocks in `global.css` are guarded to respect this: the `prefers-color-scheme: light` block only applies when `data-theme` isn't explicitly `"dark"`, and a separate `:root[data-theme="light"]` block applies regardless of the OS setting. Keep those two light-value blocks in sync if the palette changes.
- **The header itself doesn't follow the toggle.** It's locked to the dark palette at all times — a fixed brand element, by design — while the toggle switches everything else. It uses its own fixed `--header-*` tokens (`global.css`), not the theme-reactive `--color-*` ones; `Header.astro` and `ThemeToggle.astro` (which renders inside the header) are the only files that should ever reference `--header-*`. If the header ever needs to follow the theme instead, swap those references back to `--color-*` in both files rather than changing the token values themselves.
- The typeface is **Urbanist** (matches the Figma designs), loaded from Google Fonts via `<link>` tags in `BaseLayout.astro`'s `<head>` (weights 400/500/600/700). `--font-body` / `--font-heading` in `global.css` list it first, with the system stack as a fallback while it loads or if the request fails — not a design default anymore. To change the typeface, swap both the Google Fonts `<link>` (or remove it, to go back to system fonts only) and the font name in `global.css`.
- Component-specific layout uses scoped `<style>` blocks but must reference the variables, never hard-coded colors or font names.
- Mobile-first and responsive with no JS for layout: grids use `auto-fill`/`minmax`, the nav wraps, the gallery uses CSS columns. Two small inline scripts are intentional progressive-enhancement exceptions: `EmailLink` (address deobfuscation) and `ThemeToggle` (theme override) — both degrade gracefully with JS off (plain "name [at] domain" text; toggle button hidden via `<noscript>`).

## Branding

- The logo lives in `src/assets/logo/` (`KPD-logo.svg`, plus `KPD-favicon_32x32.png` and `KPD-favicon_180x180.png` — square, padded exports for the favicon sizes) and renders next to the site name in `Header.astro` via `astro:assets`' `Image`.
- Favicons in `public/` (not imported, since `public/` is served as-is) are copies of those same PNGs/SVG: `favicon.svg` (primary), `favicon-32.png` and `apple-touch-icon.png`. If the logo changes, re-export square, padded PNGs at 32×32 and 180×180 into `src/assets/logo/`, then re-copy all three into `public/` under their existing names — `public/` files don't get Astro's image processing, so this is a manual step, not automatic.

## Redirects

Old URLs are listed in `redirects` in `astro.config.mjs`. Add or edit entries there (`'/old-path': '/new-path'`). In a static build Astro emits a meta-refresh HTML page for each. GitHub Pages can't send real 301s, so these are meta-refresh only (browsers follow them; search engines treat them as weaker signals).

Current map: `/case-study-aarp|roar|canvashack|bydureon|latuda|ihop` → `/work/<name>`, `/bio-1` → `/bio`, `/resume` → `/cv`; `/case-study_01` and `/new-page` → `/` (targets unconfirmed).

## Hosting and deploys

Hosted on GitHub Pages. Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with `withastro/action` and publishes `dist/`. In the GitHub repo, Settings → Pages → Source must be set to **GitHub Actions** (one-time).

- The site assumes it is served from the **domain root** (custom domain, or a `<user>.github.io` user site). Internal links are root-relative (`/bio`). If it is ever served from a project subpath (`<user>.github.io/<repo>`), set `base` in `astro.config.mjs` **and** make internal links base-aware, or every link will break.
- Production domain is `kevinphelandesign.com` (bare domain is canonical; `www` redirects to it). `site` in `astro.config.mjs` must match. Because deploys use a GitHub Actions workflow, the custom domain is set in GitHub → Settings → Pages; a `public/CNAME` file is ignored, so don't add one.
- Commit directly to `main` for small content edits; use a branch + PR for larger changes. `node_modules/`, `dist/` and `.astro/` are git-ignored.

## Conventions

- Internal links have no trailing slash (`/work/aarp`, `/bio`).
- Every page uses `BaseLayout` and passes a `title` (the site name is appended automatically).
- Decorative images use `alt=""`; meaningful images need real alt text.
- Set `site` in `astro.config.mjs` to the production URL (used for canonical links).
