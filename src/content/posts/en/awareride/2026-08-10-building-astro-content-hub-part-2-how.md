---
title: "Building astro-content-hub, Part 2: How I built it, phase by phase"
date: 2026-08-10
description: "A chronological walk through how astro-content-hub was built — from neutralizing an org site into a template, to SEO, theming, i18n, landing pages, search, and upgrade tooling."
tags: ["astro-content-hub", "behind-the-scenes", "astro", "architecture"]
author: "AwareRide"
source: "https://github.com/awareride/astro-content-hub"
---

This is the "how," told in roughly the order it actually happened. The git
history of the project maps almost one-to-one onto this timeline, which is
convenient because it keeps the story honest.

## Phase 0 — Start from a real, working site (Jul 23)

I didn't start from a blank Astro project. I started from the org site that
already worked (`awareride.github.io`). The first commits did two things:

1. **Initial commit** of that site as the base.
2. **Neutralize the brand** — strip every `AwareRide` / `packscope` /
   `open.awareride.com` string into placeholders, so what remained was a generic
   skeleton.

A small but telling decision early on: the plan and the authoring skill lived
under `.agents/`, which was git-ignored. Rather than fight `.gitignore`, I
**moved the plan to `docs/plan.md` and the skill to `skills/`** so they'd be
version-controlled. The plan itself became a tracked artifact — "keep the plan
under version control" was a real commit message.

Then I implemented the template: example repos (`my-posts`, `vite-docs`,
`astro-docs`, `json-server-docs`), the docs, the content-sync skill, and the
deploy workflow.

## Phase 1 — Make the template runnable and self-hosting (Jul 23–24)

The template had to run directly and deploy itself, so I:

- Made the template **self-host its own docs** as a product (`astro-content-hub`
  itself becomes one of the products in the hub).
- Added **base-path support** so it can deploy under a sub-path (not just a
  domain root) — and fixed locale detection under sub-path deploys.
- Wrote the README with a real product overview, architecture diagram, and logo.

The first SEO pass came right after: **canonical URLs, sitemap, RSS,
robots.txt, and a 404 page**. Static-site hygiene, but it had to be there.

## Phase 2 — Reading UX and theming (Jul 24)

With content rendering, I polished the *reading* experience:

- **Dark mode** with system preference + a manual toggle.
- **Docs UX**: heading anchors, a table of contents, copy-code buttons, and
  prev/next navigation.
- A mobile-header fix (hide the wordmark, tighten controls).

Then theming got serious. I **isolated brand tokens into `theme.css`** with a
`THEMING.md`, and shipped an **OpenAI-inspired sample theme** under `themes/`
to prove the token system was real and copyable.

## Phase 3 — i18n refactor and product landings (Jul 24)

This was a bigger architectural move. I:

- **Locale-agnosticized** shared code, then renamed `zh` → `zh-Hans` and made
  routes universal (`[locale]`), so adding a third language later is boring.
- Added **per-product landing page overrides** so each product can customize its
  front page.

A few days later (Aug 4) this expanded into a full landing system:
- **Per-product color themes** via a `data-product` axis.
- **Auto-generated product landings** from a `product-info` collection.
- A **sync mechanism** to pull optional product landing info from external repos.

## Phase 4 — Content governance and the "agent-facing" layer (Aug 4)

I treated the template as if a coding agent (like the one writing this post)
would maintain it, and added:

- **`llms.txt` + `llms-full.txt`** — a machine-readable corpus of the site.
- **`validate:content`** — a cross-file content gate that runs in CI.
- An **examples-consistency** tool: a canonical skill tree plus a drift guard,
  so the example repos can't silently fall out of sync with the template.

## Phase 5 — Config-driven nav/footer and the section system (Aug 4)

I moved the products registry into the root `site.config.ts` and added a
`/products` catalog. Nav and footer became **data-driven** (custom links,
dropdowns, active states, a built-in Products column).

Then the **landing section system**: markdown declares *data*, a registry maps
it to *components*. Social-proof sections (stats row + testimonials), a docs
preview, FAQ, and CTA overrides all snapped in. A visual design pass followed.

## Phase 6 — Search (Aug 5)

I wired **Pagefind** (build-time index) into build *and* dev, then built a
**custom search modal** with scoped results — GitHub-style scope chips that
auto-select based on the current page. The mobile search box needed three
separate rounds of fixes (more on that in Part 3).

## Phase 7 — Hardening, upgrades, and vision (Aug 5)

- Added a **unit test suite** for pure logic and i18n fallback, and fixed npm
  audit via overrides.
- Gated the examples drift check on pull requests.
- Added **`check:upstream`** — a machinery drift guard — plus an **upgrading
  guide** (en + zh-Hans) so adopters can `git merge` new versions with minimal
  conflict.
- Published a **vision & product philosophy** page and an **optimization
  roadmap**.

## Phase 8 — Interactive Markdown and final polish (Aug 5, Aug 10)

I explored interactive docs (a button that changes something, a JS function
rendering an SVG chart). The interesting twist: external repos *own* their
interactivity, so I **kept MDX minimal** — the template registers `.mdx` but
ships no component library. Authors import their own components. Then a final
mobile testimonial-layout fix closed out the series.

## The shape it settled into

By the end, the repo had a clear three-layer contract — **Machinery / Your site
/ Extensions** — documented in `ARCHITECTURE.md`, with products as pure data and
content governed by PRs. That contract is what makes the "why" from Part 1
actually deliverable.

*Previous: [Part 1 — Why](./2026-08-10-building-astro-content-hub-part-1-why.md) ·
Next: [Part 3 — Challenges & interesting experiences](./2026-08-10-building-astro-content-hub-part-3-challenges.md)*
