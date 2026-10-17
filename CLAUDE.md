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
src/components/             Header, Footer, ContactLinks, EmailLink, CaseStudyCard, Lightbox
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

The résumé is at `/cv` (not `/resume`) because `/resume` is an old URL that redirects here. Edit its content in `src/data/resume.ts`, not in the page. The bio text is written directly in `src/pages/bio.astro`. The bio is a stack of cards in the same style as the résumé (56rem wide, red headings). Photos are optional and live in `src/assets/bio/`: `portrait.<ext>` appears beside the first paragraph (4:5 on tablet and up, square on phones), and any files named `interests-<n>-<description>.<ext>` become a square photo grid under the interests list, in filename order. The description becomes the alt text, and each photo opens in the lightbox. With no files the cards are text only.

Education/Certifications/Affiliations render as three cards above the experience section, each with an icon from `src/assets/icons/` (`education_icon.svg`, `certifications_icon.svg`, `affiliations_icon.svg`). Those icons are fixed-color assets — a dark hexagon badge (matching the logo's hexagon motif) with a light glyph, `fill` baked into the SVG paths, not `currentColor` — so like the logo, they don't adapt to the theme toggle. The hexagon's fill (`#0b1220`) is the exact same hex as the dark theme's page background, so the cards deliberately sit on `--color-surface` rather than the raw page background — on the page background directly, the badge would visually disappear.

## Case studies

Each case study is a Markdown file in `src/content/case-studies/`. The filename becomes the slug (`aarp.md` → `/work/aarp`). Frontmatter is validated by the Zod schema in `src/content.config.ts`; a build fails with a clear error if a field is missing or the wrong type.

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | |
| `client` | string | |
| `year` | integer | e.g. `2024` |
| `role` | string | |
| `summary` | string | max 240 chars; shown on the card and as the meta description |
| `product` | string, optional | shown in the meta strip under the hero, e.g. `Interactive micro-site` |
| `thumbnail` | image path | relative to the .md file, e.g. `../../assets/thumbnails/aarp.svg`; must exist. Also the hero image on the case study page |
| `order` | integer | lower first; default `999`; ties sort newest `year` first. The hexagon badge ("01") on the case study page is the entry's position in this same order |
| `draft` | boolean | default `false`; drafts show (with a badge) in `npm run dev`, are omitted from builds |
| `sections` | array, optional | the cards under the hero, in order — see below |

### The card template (`sections`)

When a case study has `sections`, `work/[slug].astro` renders the Figma card layout: title and summary, hero with the hexagon badge, a Client/Year/Role/Product strip, then one card per section. See `usaf-switching-seats.md` for a complete example (it has stats and a feature grid); the others show the plainer text-and-list cards. Each section is `{ title, paragraphs?, list?, stats?, features? }`:

- `paragraphs`: a list of strings, one `<p>` each.
- `list`: plain bullets. Not used by any case study right now; handy for a card that has a list but no screenshots.
- `stats`: `{ value, label, icon }` entries, drawn as a hexagon icon, a big red number and a label. Any number works: each takes a quarter of the row on wide screens, a half on tablet and the full width on phones, and a short or odd last row is centered. `icon` is just the glyph SVG (e.g. `../../assets/icons/stats/people.svg`); the template draws the hexagon behind it, in the theme's page-background color, via a CSS mask. Only add stats a project actually has results for.
- `features`: `{ image, caption, alt?, wide? }` entries, a grid of screenshots with captions (3 / 2 / 1 across). Tiles are 300px squares by default; `alt` defaults to empty because the caption names the image. It works on any card, not only "Project features" (Bydureon uses one tile in its role card for a sketch).
  - `wide: true` makes a tile span two columns: 16:9 on tablet (a full row) and phones (full width). Use it for screenshots a square would crop badly, such as full-width layouts or anything about the edges of a page. AARP's Tab-based navigation and Tile edges are the examples.
  - **Staggered rows (desktop, 3 across).** A wide tile shares its row with one square and is sized to the same height (aspect ≈ 2.08:1, which crops a 16:9 source by about 14%) so the captions line up. The wide tile alternates sides: the 1st wide tile in a card is on the left, the 2nd on the right, the 3rd on the left, and so on (the template adds a `flip` class to every second one). That's the whole layout rule; a case study only picks which tiles are `wide` and the order of the list. Don't add per-project layouts.
  - **Ordering.** Square tiles backfill around wide ones (`grid-auto-flow: dense`), so mixed lists don't leave gaps, but a wide tile needs a square beside it: keep about one square per wide tile, and list them in the order you want them read, which is also the visual order at every width. A wide tile with no square left just takes its own row.
  - Source images for wide tiles should be roughly 16:9 and at least ~1400px wide (shown up to ~700px, with a 2× variant). Trim any transparent margin or drop shadow from window screenshots first. At 3 across, square tiles are ~325px (equal columns), so square sources should be at least that.

**Results vs. scope.** Keep the two kinds of number apart. Real results (engagement, traffic, leads) go in a stat row on "The impact" card. When there are no results, don't invent any: use an "At a glance" card (placed after "The solution") with the same stat component for facts about the scope of the work (e.g. "3 audience pathways", "4 reusable components"). Every fact must come from the case study's own copy, and a trivial one ("1 designer") isn't worth a tile. The card title is what tells the reader these are scope, not outcomes.

**Qualitative tiles.** A stat's `value` is optional and can be words, not a number ("Spotlight Cards" with the label "Offers arranged by brand"): a value with no digit, or longer than 8 characters ("3 bike models"), renders in the same red but smaller, so words fit a quarter-width tile. Use it for "At a glance" tiles. Leave `value` out entirely for an icon-and-label tile.

**Placeholders.** Missing screenshots use the shared tile `src/assets/placeholders/screenshot.svg`; missing stats use obvious dummy values (`00%`, `metric label`). Each is marked with a `# PLACEHOLDER` comment in the frontmatter. **Before flipping a case study to `draft: false`, search its file for `PLACEHOLDER`** and replace or delete every one; the template doesn't distinguish placeholders from real content.

**Order = newest to oldest.** The home grid is chronological, so `order` is set by project year, newest first (Mobile deals 1, PLAYERS 2, Front door 3 … AARP 10); `order` also sets the numbered badge. Give every new case study a unique `order` and renumber the others to slot it in; where two share a year, the later launch goes first (Latuda before Bydureon, both 2019).

A section can have any combination, so case studies can use different card sets (add an Audience card, drop Lessons, and so on). Card colors are the same tokens the résumé cards use (`--color-surface`, `--color-border`); headline text (stat numbers, section headings) uses `--color-heading-accent` (orange), which clears contrast on `--color-surface` in both themes.

All seven case studies now have `sections`, so the Markdown body is unused (the files are frontmatter only). Case studies **without** `sections` would still fall back to rendering their Markdown body in the older layout, but nothing uses that now — it can be deleted (the `legacy-*` branch in `work/[slug].astro`) once the new layout is signed off. Order of cards on the migrated pages follows the Figma frames: role, problem, audience, solution, impact, features, lessons (the old pages had features before the outcome).

**Lightbox on feature tiles.** A feature tile opens in the lightbox only if its source image is at least 1000px wide (`ZOOM_MIN_WIDTH` in `work/[slug].astro`); smaller or softer sources stay plain tiles instead of enlarging into a blur. The lightbox shows the whole uncropped image with its caption, and steps through the tiles of the same card with the arrow buttons or keys. So there's no per-tile setting: export a bigger image and it becomes clickable. Without JS a zoomable tile is a plain link to the full image.

- To add a field: edit the schema in `src/content.config.ts`, then use it in `CaseStudyCard.astro` / `work/[slug].astro`.
- Always load case studies through `getCaseStudies()` (`src/lib/caseStudies.ts`), never `getCollection` directly, so drafts and ordering stay consistent.
- Images inside a case study body: put the file in `src/assets/` and reference it relatively (`![Alt](../../assets/foo.png)`); Astro optimizes it.
- Renaming or deleting a case study slug changes its URL. Add a redirect for the old URL (below).

## Site data (`src/data/site.ts`)

The single place for name, tagline, description, email, social links, footer text, nav items, and the optional résumé PDF path. Components read from it; don't hard-code these values elsewhere. Add another social link by appending `{ label, url }` to `socials`.

`tagline` is the homepage H1; `brandTagline` is a separate, shorter field for the small line under the name in the header logo lockup ("digital experience & visual design") — don't conflate the two.

## Header logo lockup

The header's brand block (`Header.astro`) is a logo lockup, not a nav link styled like the others: the name renders large, bold, and in the fixed `--header-brand` token (lowercase via `text-transform`, not by editing `site.name`, which stays properly cased for page titles/footer/meta), so it reads as part of the mark rather than "just another link". The whole lockup (icon + name) still links home — that's deliberate, since clicking a logo to go home is a standard, expected convention; only the visual treatment changes.

`brandTagline` only renders once there's room (a `min-width: 52rem` media query on `.brand-tagline`), and drops on narrower viewports along with the larger logo size — there's no fixed breakpoint tying this to the header's own wrap point, so check both independently after changing either.

## Contact: no form

There is deliberately no contact form. Contact is LinkedIn (from `site.socials`) plus a spam-resistant email link:

- Use `<ContactLinks />` for the full set, or `<EmailLink />` alone. Never write the address into a template or a `mailto:` href by hand.
- `EmailLink` base64-encodes `site.email` at build time and builds the `mailto:` link in the browser, so scrapers that don't run JS never see the address. Without JS, visitors see `name [at] domain [dot] com`.

## Gallery

`gallery.astro` reads every image in `src/assets/gallery/` via `import.meta.glob` (jpg, jpeg, png, webp, avif, gif, svg). Order is by filename (numeric-aware), so prefix files with `01-`, `02-`, … to control it. Alt text is generated from the filename with the number prefix and extension stripped, so name files descriptively (`04-packaging-redesign.jpg`).

Use three-digit prefixes (`010-`, `020-`) so a new piece can be slotted in (`015-`) without renaming. Logos with transparent backgrounds should be flattened onto white before they go in (the page is dark by default, and navy or black artwork disappears). Remove people's names and avatars from social-post screenshots before adding them.

Every gallery image opens in the lightbox (`components/Lightbox.astro`), at its original width capped at 2000px — a small source is never upscaled.

## Styling

- All colors, fonts, type scale, widths, spacing and radius are CSS custom properties at the top of `src/styles/global.css`. Change the look there.
- **Dark is the default theme** (brand-driven, not system-driven) — the base `:root` block holds the dark palette. A `prefers-color-scheme: light` override further down supplies the light alternate for visitors whose systems request it. This is inverted from Astro's usual pattern (light default + dark override), so don't "fix" it back the normal way.
- **The palette** (`global.css`): deep navy page `#0b1220`, cards `#141d31`; orange `#FF8552` (`--color-heading-accent`: section headings, stat numbers, the site name), light blue `#B4C5E4` (`--color-secondary`: text accents), bright blue `#2176FF` (`--color-accent`: icons, filled buttons, underlines, focus rings; also `--color-title`: page and case study titles). The brights don't have enough contrast on the light theme (blue 3.5:1, orange 2:1), so light mode uses darkened same-hue shades (`#1658CC`, `#3F5F96`, `#B8421A`). Recheck contrast in both themes whenever a color changes: the dev-only palette switcher's read-out does that (see below).
- `--color-accent` is for graphics and filled buttons (4.5:1 on the page but 4.1:1 on cards); small text uses `--color-secondary`. `--color-badge-bg` / `--color-badge-text` (a fixed warning red + white) are only for the "Draft" chip, which appears in dev only.
- `--badge-hex-text` is the numeral on the case study hero's hexagon badge. That badge sits over a photo with a dark fill baked into its SVG, so it doesn't follow the theme: the numeral has to be the light (dark-mode) orange in both themes.
- **A visitor can override the theme** with the toggle in the header (`components/ThemeToggle.astro`), regardless of their OS setting. The choice is written to `localStorage` (key `theme`) and re-applied as `data-theme="light"|"dark"` on `<html>` by a blocking inline script in `BaseLayout.astro`'s `<head>`, before first paint, so there's no flash of the wrong theme. The CSS variable blocks in `global.css` are guarded to respect this: the `prefers-color-scheme: light` block only applies when `data-theme` isn't explicitly `"dark"`, and a separate `:root[data-theme="light"]` block applies regardless of the OS setting. Keep those two light-value blocks in sync if the palette changes.
- **The header itself doesn't follow the toggle.** It's locked to the dark palette at all times — a fixed brand element, by design — while the toggle switches everything else. It uses its own fixed `--header-*` tokens (`global.css`), not the theme-reactive `--color-*` ones; `Header.astro` and `ThemeToggle.astro` (which renders inside the header) are the only files that should ever reference `--header-*`. If the header ever needs to follow the theme instead, swap those references back to `--color-*` in both files rather than changing the token values themselves.
- The typeface is **Urbanist** (matches the Figma designs), loaded from Google Fonts via `<link>` tags in `BaseLayout.astro`'s `<head>` (weights 400/500/600/700, plus 800 for the case study stat numbers and hexagon badge). `--font-body` / `--font-heading` in `global.css` list it first, with the system stack as a fallback while it loads or if the request fails — not a design default anymore. To change the typeface, swap both the Google Fonts `<link>` (or remove it, to go back to system fonts only) and the font name in `global.css`.
- **Palette comparison (dev only).** `src/styles/palettes.css` holds alternate palettes (including "Previous (red & blue)", the original look), each a block of the same tokens selected by `<html data-palette="id">`; `src/data/palettes.ts` lists them for the dropdown. The floating "Palette" button (bottom left, `components/PaletteSwitcher.astro`) is rendered only under `npm run dev`: it switches palettes, remembers the choice and shows the WCAG contrast ratio of the key text/background pairs for the active palette and theme. None of it ships. To add a palette, copy a block in `palettes.css` and add an entry to `palettes.ts`; to adopt one, copy its values into the `:root` blocks in `global.css` (and update the comments there). Palettes don't recolor the logo and favicons (red/blue baked into the SVGs), the résumé card icons, or the hexagon badge's dark fill.
- **`--color-secondary` / `--header-secondary`** are the text-safe companion to the accent: link hover, résumé job titles and labels, the case study card hover title, the Email button's text and the header tagline use the secondary; icons, buttons, underlines and focus rings use the accent. Both default to the accent (`var(--color-accent)`), so a palette only sets a secondary when its accent works for graphics but is too dark or saturated for small text (the "Orange + light blue + blue" palette: bright blue accent, light blue secondary).
- **`--color-title`** colors page titles (bio, gallery, résumé, case study titles) and defaults to the text color; the "Orange + light blue + blue" palette sets it to the accent blue so titles match the buttons.
- Stat tile glyphs (`src/assets/icons/stats/*.svg`) are used as a CSS mask over `--color-accent`, so they follow the theme and palettes; the fill baked into those SVGs doesn't matter.
- Component-specific layout uses scoped `<style>` blocks but must reference the variables, never hard-coded colors or font names.
- Mobile-first and responsive with no JS for layout: grids use `auto-fill`/`minmax`, the nav wraps, the gallery uses CSS columns. Two small inline scripts are intentional progressive-enhancement exceptions: `EmailLink` (address deobfuscation) and `ThemeToggle` (theme override) — both degrade gracefully with JS off (plain "name [at] domain" text; toggle button hidden via `<noscript>`).

## Branding

- The logo lives in `src/assets/logo/` (`KPD-logo.svg`, plus `KPD-favicon_32x32.png` and `KPD-favicon_180x180.png`) and renders next to the site name in `Header.astro` via `astro:assets`' `Image`. Its colors are baked into the SVG (orange `#FF8552` for the "p" and left hexagon, light blue `#B4C5E4` for the "d" and right side), so recolor by editing the `fill` attributes, not CSS.
- Favicons in `public/` (not imported, since `public/` is served as-is): `favicon.svg` is the logo on a rounded navy (`#0B1220`) square (the light blue is nearly invisible on a white tab strip), and `favicon-32.png` and `apple-touch-icon.png` are copies of the two PNGs in `src/assets/logo/` (square, logo padded on the same navy). If the logo changes, regenerate all of them: `favicon.svg` is the logo paths inside a 1000×1000 navy rect (logo scaled to 760px tall, centered), and the PNGs can be rendered from that (Quick Look `qlmanage -t -s 1000` then downscale). `public/` files don't get Astro's image processing, so this is a manual step.
- Other colors baked into asset files, which a palette change doesn't touch: the dark hexagon fill (`#0B1220`) in `icons/hexagon-badge.svg` and the three résumé card icons (`education_icon.svg` etc., glyph `#E3E3E3`). Keep those hexagon fills equal to the dark theme's `--color-bg`.

## Redirects

Old URLs are listed in `redirects` in `astro.config.mjs`. Add or edit entries there (`'/old-path': '/new-path'`). In a static build Astro emits a meta-refresh HTML page for each. GitHub Pages can't send real 301s, so these are meta-refresh only (browsers follow them; search engines treat them as weaker signals).

Current map: `/case-study-aarp|roar|canvashack|bydureon|latuda|ihop` → `/work/<name>`, `/bio-1` → `/bio`, `/resume` → `/cv`; `/case-study_01` and `/new-page` → `/` (targets unconfirmed).

## Hosting and deploys

Hosted on GitHub Pages. Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with `withastro/action` and publishes `dist/`. In the GitHub repo, Settings → Pages → Source must be set to **GitHub Actions** (one-time).

- The real site is served from the **domain root** (`kevinphelandesign.com`). Until the DNS cutover, the deploy is a **preview under a subpath** at `kphelan82.github.io/digitalPortfolio`: the workflow sets `BASE_PATH: /digitalPortfolio`, which `astro.config.mjs` turns into `base` (and prefixes the redirect targets with). Every internal link, favicon and public file goes through `url()` in `src/lib/url.ts` (never write a bare `/bio`), so it works at both. **When the custom domain points at GitHub Pages, delete the `BASE_PATH` line from `.github/workflows/deploy.yml`** and the site builds for the root again; with `BASE_PATH` unset (local dev, `npm run build`) nothing changes.
- Production domain is `kevinphelandesign.com` (bare domain is canonical; `www` redirects to it). `site` in `astro.config.mjs` must match. Because deploys use a GitHub Actions workflow, the custom domain is set in GitHub → Settings → Pages; a `public/CNAME` file is ignored, so don't add one.
- Commit directly to `main` for small content edits; use a branch + PR for larger changes. `node_modules/`, `dist/` and `.astro/` are git-ignored.

## Conventions

- Internal links have no trailing slash (`/work/aarp`, `/bio`).
- Every page uses `BaseLayout` and passes a `title` (the site name is appended automatically).
- Decorative images use `alt=""`; meaningful images need real alt text.
- Set `site` in `astro.config.mjs` to the production URL (used for canonical links).
