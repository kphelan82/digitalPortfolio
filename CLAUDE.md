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

The résumé is at `/cv` (not `/resume`) because `/resume` is an old URL that redirects here.

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

## Contact: no form

There is deliberately no contact form. Contact is LinkedIn (from `site.socials`) plus a spam-resistant email link:

- Use `<ContactLinks />` for the full set, or `<EmailLink />` alone. Never write the address into a template or a `mailto:` href by hand.
- `EmailLink` base64-encodes `site.email` at build time and builds the `mailto:` link in the browser, so scrapers that don't run JS never see the address. Without JS, visitors see `name [at] domain [dot] com`.

## Gallery

`gallery.astro` reads every image in `src/assets/gallery/` via `import.meta.glob` (jpg, jpeg, png, webp, avif, gif, svg). Order is by filename (numeric-aware), so prefix files with `01-`, `02-`, … to control it. Alt text is generated from the filename with the number prefix and extension stripped, so name files descriptively (`04-packaging-redesign.jpg`).

## Styling

- All colors, fonts, type scale, widths, spacing and radius are CSS custom properties at the top of `src/styles/global.css`. Change the look there.
- Dark mode is a variable override in the `prefers-color-scheme: dark` block in the same file; delete the block to disable it.
- Fonts default to system stacks. For a web font, load it in `BaseLayout.astro` and update `--font-body` / `--font-heading`.
- Component-specific layout uses scoped `<style>` blocks but must reference the variables, never hard-coded colors or font names.
- Mobile-first and responsive with no JS: grids use `auto-fill`/`minmax`, the nav wraps, the gallery uses CSS columns.

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
