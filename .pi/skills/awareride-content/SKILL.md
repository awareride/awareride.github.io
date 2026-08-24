---
name: awareride-content
description: Add or localize blog posts, product docs, and product landings in the AwareRide hub (awareride.github.io, open.awareride.com), rebuilt on the astro-content-hub template. Use when creating/editing markdown content under src/content/, adding a new product, or adding a new language. Covers the en-default + zh-Hans i18n pattern, slug contracts, fallback behavior, and build verification.
---

# AwareRide Content Integration

AwareRide's site is an Astro 7 static site (`output: 'static'`) rebuilt on the
[astro-content-hub](https://github.com/awareride/astro-content-hub) template,
deployed to GitHub Pages and Cloudflare Pages from `main`. Content is markdown
in `src/content/`, served by **universal `[locale]` routes** (no per-locale
route files), and localized with a locale-prefix scheme: default `en` has no
prefix, other locales live under `/<locale>/...` (currently `zh-Hans`).

All artifacts written into the repo must be **English** in source comments
and code; locale-specific content (markdown body, UI strings) is the only
exception. See `AGENTS.md`.

## Before changing anything

1. Read `AGENTS.md` for repo conduct (no `git push`, no dep installs without
   authorization, small focused changes).
2. Read `site.config.ts` (products registry + nav/footer), `src/config/copy.ts`
   (UI/landing/org copy), and `src/content.config.ts` (collection generation)
   to see the current shape.
3. Run `npm run validate:content` and `npm test` to confirm a clean baseline.

## The i18n model (read this once)

- `site.config.ts` (repo root) is the single source of truth for **products**
  and the nav/footer `site` block. Adding a product there auto-wires the docs
  collections, the landing card, the Products dropdown/catalog/footer, and the
  docs routes — no route files.
- `src/config/copy.ts` holds the localized strings: `siteName`, `t` (small UI
  strings), `home` (landing copy), `org` (organization block), `productCopy`
  (generic product-page labels). `src/lib/i18n.ts` re-exports these and owns
  the locale primitives (`locales`, `defaultLocale`, `localizePath`).
- `src/content.config.ts` auto-generates collections from `site.config.ts`
  products × locales for docs, and locales for posts/product-info.
- `src/lib/content.ts` owns path generation + fallback rendering for docs,
  posts, and product-info. Route files are thin and delegate to it.
- **Slug contract**: a doc/post's `id` is its path relative to the collection
  base. `en/getting-started.md` and `zh-Hans/getting-started.md` both have
  `id = "getting-started"`. Fallback matches on this id, so **keep filenames
  identical across locales** (only the body differs).
- **Fallback** is per-page, content-level (not a redirect): a missing
  `zh-Hans` page renders the `en` body inside a `zh-Hans` shell
  (nav/breadcrumb/`lang` stay `zh-Hans`), with a visible "此页暂无中文翻译"
  notice. The URL stays `/zh-Hans/...`.

## Task: add or edit a blog post

Posts live in `src/content/posts/<locale>/`. Nested dirs are supported and
become part of the slug (e.g. `posts/en/packscope/foo.md` ->
`/posts/packscope/foo/`).

**Frontmatter schema** (`postSchema` in `content.config.ts`):

```yaml
---
title: "Post Title"          # required
date: 2025-07-21             # required, YYYY-MM-DD
description: "One-line summary."  # required
tags: ["announcement"]       # optional, defaults to []
author: "AwareRide"          # optional
source: "https://github.com/awareride/packscope"  # optional, link to source
draft: false                 # optional, defaults to false; drafts are excluded
---
```

Steps:
1. Create `src/content/posts/en/<slug>.md` with the frontmatter + body.
2. For a Chinese version, create `src/content/posts/zh-Hans/<slug>.md` (same
   path under `zh-Hans/`). If you omit it, the `en` post still appears on
   `/zh-Hans/posts/` with an `EN` badge and renders the English body on
   `/zh-Hans/posts/<slug>/`.
3. Internal links inside a `zh-Hans` post should target `/zh-Hans/...` paths.
4. Run `npm run validate:content` and `npm run build`. No route file changes
   needed - the universal routes at `src/pages/posts/[...slug].astro` and
   `src/pages/[locale]/posts/[...slug].astro` already serve every locale.

## Task: add a doc page to an existing product

Docs live in `src/content/docs/<product>/<locale>/`. The current product is
`packscope` (see `products` in `site.config.ts`).

**Frontmatter schema** (`docSchema`):

```yaml
---
title: "Page Title"          # required
description: "Short summary" # optional
order: 2                     # optional, defaults to 0; controls sidebar sort
---
```

- `index.md` is the product's docs landing page (served at `/.../docs/`, not
  `/.../docs/index/`). It is always sorted first in the sidebar regardless of
  `order`; `order` controls the rest.
- Other pages are sorted by `order`, then by `title` (locale-aware).

Steps:
1. Create `src/content/docs/<product>/en/<slug>.md`.
2. For Chinese, create `src/content/docs/<product>/zh-Hans/<slug>.md` (same
   slug). Missing `zh-Hans` pages fall back to `en` body + notice.
3. Internal links in a `zh-Hans` doc should target `/zh-Hans/<product>/docs/...`.
4. Run `npm run validate:content` and `npm run build`. No route changes - the
   universal docs catch-alls (`[product]/docs/[...slug]` and
   `[locale]/[product]/docs/[...slug]`) pick it up automatically.

## Task: add a product landing (product-info)

A product's landing page is **data, not code**: a structured markdown file at
`src/content/product-info/<locale>/<slug>.md` drives it (tagline, features,
highlights, install, FAQ/CTA sections). The generic landing card renders even
without one; add the file to give the product a real landing. Schema:

```yaml
---
tagline: "Short hero line"
description: "One-liner for cards and llms.txt"
highlights:
  - label: "License"
    value: "MIT"
install: |
  git clone https://github.com/awareride/<repo>.git
  npm install
features:
  - title: "A feature"
    body: "What it does."
    icon:
      paths: ["M4 5h16M4 12h16M4 19h16"]
links:
  - label: "View Source"
    href: "https://github.com/awareride/<repo>"
sections:
  - type: hero
  - type: highlights
  - type: features
  - type: faq
  - type: cta
---
```

Registered section types: `hero`, `highlights`, `install`, `features`,
`stats`, `docs-preview`, `testimonials`, `faq`, `cta` (see
`src/components/landing-sections/`). Unknown types are skipped, never a build
error. `npm run validate:content` warns on unregistered types.

## Task: add a new product

The hub is data-driven - this is mostly content + one registry entry.

1. **Register the product** - edit `site.config.ts` (repo root) `products`:
   ```ts
   { slug: 'mytool', name: 'MyTool', github: 'https://github.com/awareride/mytool',
     badges: ['...'], logo: { github: 'awareride' }, featured: true,
     description: { en: '...', 'zh-Hans': '...' } }
   ```
   This auto-generates the docs collections, landing card, Products dropdown,
   catalog, footer column, and docs routes. **No route files** - the universal
   `[product]` / `[locale]/[product]` routes serve every registered product.

2. **Add docs**:
   ```
   src/content/docs/mytool/en/index.md
   src/content/docs/mytool/en/getting-started.md
   src/content/docs/mytool/zh-Hans/index.md      # optional; falls back to en
   ```

3. **(Optional) landing**: add `src/content/product-info/<locale>/mytool.md`
   (see "add a product landing").

4. Run `npm run validate:content` and `npm run build`, then verify
   `/mytool/`, `/mytool/docs/`, and `/zh-Hans/mytool/docs/` render.

## Task: add a new language

The `[locale]` routes are universal, so adding a locale touches i18n
primitives + copy tables + content dirs - **no route mirroring**. Suppose
adding `ja`.

1. **`src/lib/i18n.ts`**: append `'ja'` to `locales`; update `localeLabel`,
   `localeCode`.
2. **`src/config/copy.ts`**: add a `ja` block to every table (`t`, `home`,
   `org`, `productCopy`). Every table is typed `Record<Locale, …>` seeded from
   `en`, so a missing locale is a compile error.
3. **`site.config.ts`**: add `ja` to each product's `description` and to any
   nav/footer labels (`Record<Locale, string>`).
4. **Content dirs**: create `src/content/posts/ja/`,
   `src/content/docs/<product>/ja/`.
5. Run `npm run build`; the locale switcher and hreflang pick up `ja`
   automatically.

## Verification (always run before declaring done)

```bash
npm run validate:content   # 0 errors, 0 warnings
npm test                   # full unit suite passes
npm run build              # astro check + build + pagefind index, 0 errors
```

Then spot-check `dist/`:

```bash
# A localized page has the right lang and hreflang alternates
grep -o '<html lang="[^"]*"' dist/zh-Hans/packscope/docs/getting-started/index.html
grep -c 'rel="alternate"' dist/zh-Hans/packscope/docs/getting-started/index.html  # expect 3

# A fallback page shows the notice but keeps zh-Hans lang
grep -c '此页暂无中文翻译' dist/zh-Hans/packscope/docs/<some-en-only-slug>/index.html
```

## Common pitfalls

- **Slug mismatch across locales**: `en/foo.md` and `zh-Hans/Foo.md` produce
  different ids and break fallback. Keep filenames byte-identical.
- **Products live in `site.config.ts`, not `content.config.ts`**. The
  validation script (`validate-hub-content.mjs`) parses `site.config.ts` with a
  line-based regex - keep `slug:` / `base:` as single-quoted literals.
- **Linking to `/packscope/docs/...` from a `zh-Hans` page**: use
  `/zh-Hans/packscope/docs/...` so users stay in the Chinese shell. Inside
  markdown, write the localized prefix explicitly.
- **Forgetting `order`**: the sidebar sorts by `order` then title. New docs
  with default `order: 0` cluster together; set explicit values for a stable
  order.
- **The `index` slug is special**: never link to `/.../docs/index/`; it does
  not exist. The sidebar maps the index doc to the base path (`/.../docs/`)
  automatically.
- **Relative `.md` links**: keep GitHub-friendly relative links
  (`./getting-started.md`, `../zh-Hans/architecture.md`) - the build-time
  Sätteri plugin rewrites them to hub routes. Absolute `/zh-Hans/...` links in
  prose are written explicitly.

## Reference: where things live

```
site.config.ts             products[] + site{} (nav/footer) - repo root
src/lib/i18n.ts            locales, locale primitives; re-exports copy.ts
src/config/copy.ts         siteName, t, home, org, productCopy
src/lib/content.ts         localized path + render helpers (docs, posts, product-info)
src/lib/docs.ts            sidebar nav (index -> base path, sort by order)
src/content.config.ts      collection generation (from site.config.ts products)
src/components/            Layout, Nav/Footer (URL-inferred), DocsLayout, PostCard,
                           SearchModal, landing-sections/*, product-landing/*
src/pages/                 universal routes: [locale]/*, [product]/*, posts/*,
                           products, llms.txt, rss.xml, sitemap, 404
src/content/docs/<prod>/<locale>/   docs markdown
src/content/posts/<locale>/         posts markdown (nested dirs ok)
src/content/product-info/<locale>/  product landing data (<slug>.md)
skills/site-content/       hub-side validator (npm run validate:content)
awareride-content-sync/    external content-sync skill (packscope + friends)
```
