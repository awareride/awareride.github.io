---
title: "Rebuilding open.awareride.com on Astro"
date: 2026-07-21
description: "How a one-page static site grew into an Astro static site with a landing page, product docs, and a blog."
tags: ["astro", "awareride", "web"]
author: "AwareRide"
source: "https://github.com/awareride/awareride.github.io"
---

## It started as one HTML file

open.awareride.com began life as a single static HTML page - a logo, a tagline, a favicon I could not
get right for several tries, and a `CNAME` pointing GitHub Pages at a custom domain. It did the job
for an afternoon. It was never going to do the job for long.

The plan was simple: a real home for [AwareRide](https://github.com/awareride) and its projects, with
a landing page that felt like a product, product docs pulled in from each project's own repo, and a
blog for the engineering writing. I did not want a docs site that doubled as a homepage - I wanted a
homepage that happened to ship docs.

I picked [Astro](https://astro.build) in `output: 'static'` mode and never looked back.

## Four routes, one shell

Everything hangs off four routes:

- `/` - the landing page
- `/packscope` - a product page
- `/packscope/docs` - docs, authored as Markdown in the packscope repo
- `/posts` - this blog

One `Layout.astro` owns the document shell (`<html>`, fonts, meta, OG tags). Product pages and docs
compose it instead of reinventing a `<head>`. `DocsLayout.astro` composes `Layout` + `Nav` + `Footer`
and adds a sidebar and a `.prose` content region. There is no second document shell anywhere in the
codebase - that rule alone removed an entire class of "why does this page look different" bugs.

## Content as data, not files

Astro content collections turned "where do docs live" into a typed question. `src/content.config.ts`
defines a zod schema per collection and a glob loader, so a bad frontmatter field fails the build
instead of shipping silently:

```ts
const postSchema = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
  source: z.string().optional(),
  draft: z.boolean().default(false),
});
```

Docs come from `src/content/docs/packscope/**`, posts from `src/content/posts/**`. Each route is a
thin `[...slug].astro` catch-all that calls `render(entry)` and wraps `<Content />` in a `.prose`
container.

## One stylesheet, on purpose

No Tailwind, no CSS-in-JS. A single `src/styles/global.css` full of CSS custom properties
(`--color-*`, `--radius-*`, `--shadow-*`), with a header comment that still reads
`Anthropic-inspired: clean, bold, minimal`. Code highlighting is Shiki with the `css-variables`
theme, so syntax colors respect the same palette instead of fighting it.

The `.prose` class is the single source of truth for Markdown typography, and it lives in
`global.css` rather than a scoped `<style>`. That is the only way it reliably applies to Astro's
`<Content />` output - a small detail that saves a lot of "why are my list styles missing" hours.

## Getting it green

`npm run build` runs `astro check` then builds to `dist/`. Most of the polish was chasing the
obvious: a footer that had inherited a dark background, a terminal demo whose colors fought the
page, three feature cards whose images would not load. One by one, green.

The whole migration landed in a single commit - `feat: migrate to Astro static site` - and the
homepage finally looked like a homepage.

---

*This post is part of a series on building open.awareride.com. Next:
[Deploying to GitHub Pages and Cloudflare Pages](/posts/awareride/2026-07-21-deploying-to-github-and-cloudflare-pages/),
then [two locales with per-page fallback](/posts/awareride/2026-07-22-two-locales-with-per-page-fallback/),
and finally [a content hub synced via pull requests](/posts/awareride/2026-07-22-a-content-hub-synced-via-pull-requests/).*
