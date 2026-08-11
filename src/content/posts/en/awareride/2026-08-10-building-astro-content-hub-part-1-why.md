---
title: "Building astro-content-hub, Part 1: Why I turned one org's site into a reusable template"
date: 2026-08-10
description: "The origin story of astro-content-hub — how an open-source organization's need for a shared content home grew into a reusable, upgradeable static-site template."
tags: ["astro-content-hub", "behind-the-scenes", "open-source"]
author: "AwareRide"
source: "https://github.com/awareride/astro-content-hub"
---

## The problem I actually had

I was about to start an open-source organization. Like most people starting one,
I needed a place for the org to *land* — a homepage that says who we are and what
we build. But I also knew that every project under that org would need its own
docs and product-intro pages.

At first those intro pages lived in separate GitHub Pages sites, one per project.
That got messy fast:

- The same org's products were scattered across N different URLs.
- Every project had to solve the same "how do I publish a decent page?" problem
  from scratch.
- There was no shared identity, no shared search, no shared localization story.

So I built a single `site` repository for the organization, and had the other
projects sync their `docs/` into it automatically. Suddenly all the org's
products lived in one place, and the site's core became **the org and product
introductions** — docs were just one slice of it.

That site worked well enough that I started asking a different question:
*what if other people want this too?*

## The leap from "my site" to "a template"

The realization was simple but important. Most small teams and solo open-source
authors hit the exact same wall I did:

> I want my projects to have a nice public face — docs, posts, a product page —
> without every project reinventing the wheel.

So I took that org site and **abstracted it into a template** called
`astro-content-hub`. The shift in thinking was:

- **Before:** "This is *my* site, with *my* brand and *my* products."
- **After:** "This is a neutral skeleton. Add your brand and your products, and
  you get a functioning hub. Each external project just focuses on its own
  business and writes a little docs — and it gets a decent public page for free."

That's the whole "why." I wasn't trying to build yet another documentation
framework. I was trying to give a multi-repo org a content home that:

1. **Aggregates** docs and posts from many repositories into one site.
2. **Governs** content through pull requests, so nothing ships to `main`
   unreviewed.
3. **Localizes** with per-page fallback, so a missing translation never 404s.
4. **Deploys for free** to GitHub Pages and Cloudflare Pages.
5. **Stays upgradeable**, so adopters aren't trapped on the version they forked.

## What "a content hub" means here

The one-liner I eventually landed on:

> *One hub, many source repos.* External projects author `posts/` and `docs/`.
> A GitHub Action validates the content and opens a PR. A human reviews it. The
> hub builds and deploys.

Three ideas make that line actually work, and they're worth calling out because
they shaped everything that followed:

- **Content ships through PRs, not pushes.** Every external contribution is
  reviewed by a human before it lands on `main`. This is the single biggest
  difference from "build-time auto-fetch" aggregators.
- **Products are data, not files.** You register a product with one line in
  `site.config.ts`, and routes, sidebars, cards, and nav all come from that.
- **The template is layered.** Machinery (the engine), Your site (your brand and
  content), and Extensions (optional hooks) are kept deliberately separate — so
  upgrading later doesn't mean a giant conflict.

In [Part 2](./2026-08-10-building-astro-content-hub-part-2-how.md) I'll walk
through how I actually built it, phase by phase, in roughly chronological order.
In [Part 3](./2026-08-10-building-astro-content-hub-part-3-challenges.md) I'll
cover the challenges and the weird, fun bits — like a search box that overflowed
behind the Android home-indicator bar.

*Next: [Part 2 — How I built it](./2026-08-10-building-astro-content-hub-part-2-how.md)*
