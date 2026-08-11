---
title: "Building astro-content-hub, Part 3: Challenges and interesting experiences"
date: 2026-08-10
description: "The hard, weird, and fun parts of building astro-content-hub — sub-path i18n bugs, the three-round mobile search saga, the template-tax upgrade problem, and minimal interactive Markdown."
tags: ["astro-content-hub", "behind-the-scenes", "lessons-learned"]
author: "AwareRide"
source: "https://github.com/awareride/astro-content-hub"
---

Part 1 was the *why*, Part 2 was the *how*. This is the part I enjoy most: the
bits that didn't go smoothly, or turned out weirder than expected.

## The sub-path deploy trap

Early on I wanted the hub to deploy not just at a domain root, but under a
sub-path (e.g. `org.github.io/hub/`). That sounds trivial and isn't.

Two bugs bit me:

- **Locale detection broke under a sub-path.** The code that figured out the
  current locale assumed the first path segment was the locale, which is false
  when a base path sits in front of it. Fixed by accounting for `base` in the
  route parsing.
- **Canonical URLs pointed at the wrong place.** I had to restore `base` in the
  `site` config so canonical links, sitemap, and RSS all respected the deploy
  prefix.

Lesson: *any code that reads `Astro.url` or splits a path must know about
`base` from day one.* Sub-path deploys are a first-class requirement, not an
afterthought.

## The three-round mobile search saga

The search feature (Pagefind + a custom modal) looked perfect on desktop. On a
real phone it became a comedy of errors, each round revealing a deeper layer:

1. **Blank dropdown panels.** Nav dropdowns with children (Products, Community)
   showed as empty until you tapped them. Root cause: a CSS `align-items:
   stretch` on the mobile modal stretched the panel vertically even with no
   results — desktop kept `flex-start`, so it never showed there.
2. **Results hidden behind the keyboard.** On a real phone, the on-screen
   keyboard shrinks the *visual* viewport, but `position: fixed` + `vh` units
   measure the *layout* viewport. So the results list extended behind the
   keyboard. Desktop emulation has no real keyboard, which is why it never
   reproduced in DevTools.
3. **The Android home-indicator bar.** Even after fixing the keyboard, the
   results still overflowed the safe area — Chrome on full-screen Android phones
   reserves a bottom gesture bar. The fix was `env(safe-area-inset-bottom)`
   applied to the modal container, sized to the visual viewport.

The takeaway: **desktop device emulation lies about mobile.** If it involves
keyboards, safe areas, or `vh`, you must test on a real device.

## The "template tax" and the upgrade problem

The deepest design question wasn't technical — it was: *how does someone upgrade
this template without a painful migration?*

There is no zero-migration upgrade. The moment an adopter rebrands, they fork.
The goal is to shrink the *inevitably conflicting* surface to almost nothing and
concentrate it in a few predictable files. That's why `ARCHITECTURE.md` splits
the repo into three layers:

- **Machinery** should evolve (bug fixes, features) and the user shouldn't touch
  it.
- **Your site** inevitably forks (brand, products, styles) but new features
  sometimes touch its interface.
- **Extensions** are optional hooks you copy on demand, not things you must
  upgrade.

I even **proved the upgrade path with a throwaway git repo** before shipping it:
renaming a Machinery file (`index.astro` → `home.astro`) merges cleanly but
silently loses the upstream path — git can't detect that. So I built
`check:upstream`, a drift guard that catches exactly that class of silent break,
and wrote an upgrading guide.

Lesson: *a template's real product is its upgrade story, not its first-run
experience.*

## Minimal interactive Markdown — letting go of control

I wanted interactive docs: a button that changes something, a JS function that
renders an SVG chart. My first instinct was to ship a built-in component library
(`Counter`, `InteractiveChart`, `Tabs`, `Callout`).

Then a sharper question arrived: *external repos own their interactivity. Only
the content owner knows what interaction they need.* Shipping a fixed component
library both limits them and burdens the template with code most adopters won't
use.

So I **flipped the decision**: keep MDX support minimal (register `.mdx`, let
authors import *their own* components), and drop the bundled library. The
template stays lean; external repos stay independent and non-interfering. The
trade-off is documented openly in the authoring guide.

Lesson: *when the right owner of a capability is "someone else," don't build it
yourself — make it possible.*

## A happy accident: docs in the wrong directory

While building the interactive Markdown demo, I placed an `.mdx` file in
`src/content/docs/astro-content-hub/en/` — but the product's `base: './docs'`
means its docs actually live at the repo-root `docs/`. The file simply didn't
appear. Debugging that "missing page" surfaced the real content-resolution
rules and tightened the `doc-dirs` machinery. A bug that taught me the system
better than reading the code would have.

## What I'd tell past-me

- Treat `base` / sub-path as a day-one constraint.
- Test anything mobile on a real phone, not DevTools.
- Design the upgrade path before the features, not after.
- Prefer "make it possible" over "build it for them."

That's the whole story — why, how, and the rough edges. The project is MIT,
runs for free on GitHub Pages and Cloudflare Pages, and is meant to be forked
and upgraded.

*Previous: [Part 2 — How](./2026-08-10-building-astro-content-hub-part-2-how.md) ·
Start: [Part 1 — Why](./2026-08-10-building-astro-content-hub-part-1-why.md)*
