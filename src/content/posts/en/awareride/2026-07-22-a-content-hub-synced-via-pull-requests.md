---
title: "A content hub synced from many repos via pull requests"
date: 2026-07-22
description: "How external projects contribute posts and docs to open.awareride.com through a GitHub Action that opens a PR instead of pushing to main."
tags: ["content-sync", "github-actions", "astro"]
author: "AwareRide"
source: "https://github.com/awareride/awareride.github.io"
---

## The hub idea

open.awareride.com is one rendered surface for content that lives in many repos. The blog you are
reading is authored in a separate `Posts` repo. Packscope's docs are authored in the `packscope`
repo. The hub - `awareride/awareride.github.io` - just builds and renders them.

The question was how to move content from N external repos into the hub's `src/content/` without
turning the hub into a merge conflict zone, and without ever letting an external push land on `main`
unreviewed.

## The contract

Each external repo mirrors the hub's locale layout and lets a GitHub Action copy its `posts/` and
`docs/` in:

| External repo | Hub |
|---------------|-----|
| `posts/` | `src/content/posts/` |
| `docs/` | `src/content/docs/${PRODUCT}/` |

The `${PRODUCT}` segment is the interesting part. An external repo's docs are flat by locale -
`docs/en/getting-started.md`, not `docs/packscope/en/getting-started.md`. The product is injected at
sync time from a `PRODUCT` env var in the workflow. That keeps relative Markdown links working when
you browse the repo on GitHub: they resolve against `docs/`, not `docs/packscope/`.

## Sync opens a PR, never pushes to main

The sync workflow does not push to `main`. It clones the hub, copies content with `rsync`, commits
to a dedicated branch, and opens a pull request:

```bash
rsync -a posts/ "$CLONE_DIR/src/content/posts/"
git checkout -b "sync-posts-${SRC}-${RUN_ID}"
git commit -m "posts: sync from ${SOURCE_REPO}"
git push -u origin "$BRANCH"
gh pr create --repo awareride/awareride.github.io --base main --head "$BRANCH" \
  --title "posts: sync from ${SOURCE_REPO}"
```

`rsync -a posts/ dest/` (note the trailing slash) means "the contents of `posts/`", so it never
creates `posts/posts/` regardless of whether the destination already exists - a bug that bit me
with a `cp -R` based action earlier. A human reviews the PR and merges. Nothing lands unattended.

Auth is a fine-grained PAT stored as `DOCS_CENTRAL_HUB_TOKEN` in the external repo, with Contents and
Pull-requests write on the hub.

## The skill, not copy-paste

Rather than ask every external repo to reinvent this, the whole thing is packaged as a skill:
`awareride-content-sync`. An external repo copies it into `.agents/skills/awareride-content-sync/`
and gets the workflow templates, a validation script, and the docs in one drop.

The validator runs before sync and gates it - pure Node stdlib, no dependencies:

```bash
node .agents/skills/awareride-content-sync/scripts/validate.mjs
```

It enforces frontmatter conformance and the **slug contract**: a file's slug is its path relative to
the locale dir, and it must be byte-identical across locales. `en/getting-started.md` pairs with
`zh/getting-started.md` - never `zh/Getting-Started.md` - or per-page fallback breaks.

## Retiring content

The `rsync` copy only adds and overwrites; it never deletes, so content from one project can't wipe
another project's pages. That means removing a file locally does not remove it from the hub.

The opt-in answer is `sync-delete.list` at the repo root - one path per line, a trailing slash for a
whole directory. After the copy, `apply-delete-list.mjs` removes exactly those paths, and the
deletion ships in the same reviewable PR as the additions:

```text
posts/en/old-post.md
docs/en/legacy/
```

## Links that work in two places

Source Markdown keeps GitHub-friendly relative links - `./getting-started.md`, `../zh/architecture.md`.
On the hub, Astro's Markdown processor does not rewrite body links, so a raw `./getting-started.md`
would render as `href="./getting-started.md"` and 404. A small Sätteri mdast plugin fixes that at
build time: it scans `src/content/**/*.md` once, builds a map of file paths to site URLs, and
rewrites relative `.md` links to their hub routes - `./getting-started.md` becomes
`/packscope/docs/getting-started`. No source edits, links work on GitHub and on the site.

## What it adds up to

An external repo writes Markdown in a flat, GitHub-readable layout. On push to `main`, a workflow
validates it, copies it into the hub on a branch, and opens a PR. The hub reviews, merges, and a
manual deploy ships it. The content lives where it is maintained; the hub only renders.

---

*Part of the series on building open.awareride.com. Previous:
[two locales with per-page fallback](/posts/awareride/2026-07-22-two-locales-with-per-page-fallback/).
Next: [A mobile nav that does not vanish](/posts/awareride/2026-07-22-a-mobile-nav-that-does-not-vanish/).*
