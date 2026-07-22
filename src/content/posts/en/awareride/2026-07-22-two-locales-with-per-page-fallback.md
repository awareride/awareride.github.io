---
title: "Two locales with per-page fallback, without Starlight"
date: 2026-07-22
description: "Adding English + Chinese to an Astro site with content-level fallback instead of redirects - and no per-locale boilerplate."
tags: ["i18n", "astro", "awareride"]
author: "AwareRide"
source: "https://github.com/awareride/awareride.github.io"
---

## Starlight, or not

The obvious move for a multilingual docs site is [Starlight](https://starlight.astro.build). I
seriously considered it. The trade-off came down to flexibility: I wanted one shell that served a
marketing landing page, a product page, product docs, and a blog - across multiple products, with a
locale prefix - and I wanted fallback that was content-level rather than a redirect.

Starlight is opinionated about docs; I had a site that was mostly not docs. So I built the i18n
myself. It is less than 200 lines of helpers.

## Locale in front

The URL decision: `/zh/packscope/docs/` or `/packscope/docs/zh/`? I went with the locale in front.
`en` is the default locale and gets no prefix; every other locale lives under `/<locale>/...`:

- `https://open.awareride.com/packscope/docs/getting-started` - English
- `https://open.awareride.com/zh/packscope/docs/getting-started` - Chinese

The whole site mirrors that: `/zh/`, `/zh/packscope/`, `/zh/posts/`. One rule, applied everywhere.

## Fallback that is not a redirect

The important part. A missing translation should never 404. But a blanket redirect to English is
wrong too - the reader asked for Chinese, and silently dumping them into an English page is
disorienting.

So fallback is **per-page and content-level**. A `zh` URL always exists. If there is a Chinese page
for it, it renders the Chinese body in a Chinese shell (`<html lang="zh">`, Chinese nav, Chinese
breadcrumbs). If there is not, that same URL renders the English body - still inside the Chinese
shell, with a visible notice:

> 此页暂无中文翻译,以下显示英文原文。

You can ship English first and translate incrementally. The site never breaks; it just shows English
with a notice where Chinese is missing. Post cards on `/zh/posts/` even carry an `EN` badge on
fallback entries so readers know before they click.

## No per-locale boilerplate

The trap with "one collection per locale" is that every new language means a new `defineCollection`,
a new set of route files, and a new place to forget something. I refused to write
`src/lib/doc-route-zh.ts`.

Instead, collections and routes are generated from a single source of truth:

```ts
// i18n.ts - the only place locales live
export const locales = ['en', 'zh'] as const;
export const defaultLocale = 'en';
```

```ts
// content.config.ts - one product × one locale = one collection, auto-generated
for (const product of products) {
  for (const locale of locales) {
    out[`${product}Docs${cap(locale)}`] = defineCollection({
      loader: glob({ pattern: '**/*.md', base: `./src/content/docs/${product}/${locale}` }),
      schema: docSchema,
    });
  }
}
```

Adding a language is appending to `locales` and to a `t` object of UI strings. The collection
loop, the path helpers, the fallback logic, and the routes all stay generic over `locales`. There
are no `*-zh.ts` files to forget.

## The small things that matter

- **The `index` doc is special.** It is served by a dedicated `index.astro` route at the collection
  base (`/packscope/docs`), never a duplicate `/packscope/docs/index/`. The catch-all excludes it.
- **The sidebar matches the body, not the shell.** When a page is a fallback (English body in a
  Chinese shell), the nav is built from the English collection - so the links you see match the
  language of the text you are reading.
- **`zh`, not `zh-CN`.** Simpler. Regional variants can come later if they ever matter.

The result is a site that is fully localized where translations exist, gracefully English
everywhere else, and maintained by editing exactly one array to add a language.

---

*Part of the series on building open.awareride.com. Previous:
[Deploying to GitHub Pages and Cloudflare Pages](/posts/awareride/2026-07-21-deploying-to-github-and-cloudflare-pages/).
Next: [a content hub synced via pull requests](/posts/awareride/2026-07-22-a-content-hub-synced-via-pull-requests/).*
