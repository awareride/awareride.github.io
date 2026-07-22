# AGENTS.md

This file gives coding agents the ground rules for working in this repository.
Read it before making any changes.

## Working with a human

You are collaborating with a **real human developer**, not running unattended.
Treat every change as if a teammate will review it on Monday morning.

- Prefer small, focused, reviewable changes over large sweeps.
- Explain your reasoning and trade-offs, not just the result.
- When something is ambiguous, **ask first** instead of guessing. State your
  assumption explicitly and let the human correct it before proceeding.
- Keep the human in the loop at every non-trivial step: what you are about to
  do, what you did, and what to verify next.

## Language policy

- **All artifacts written into the repo must be in English**, regardless of the
  language used in conversation. This includes source code, comments, commit
  messages, documentation (`.md`), content collection files, and config.
- You may converse with the human in whatever language they use, but never let
  that leak into committed files.
- The only exception is files explicitly marked for another locale, e.g.
  `README.zh.md`, `getting-started.zh.md`. If a file is not clearly scoped to a
  non-English locale, write English.

## Git & deployment boundaries

- You **may** stage and commit locally (`git add`, `git commit`) to group
  logical work.
- You **must not** run `git push`, `git push --force`, or any command that
  writes to the remote (`origin`) on your own. Pushing to remote is initiated
  by the human developer. When work is ready, tell the human and let them push.
- Never amend, rebase, or rewrite history that has already been pushed.
- The `main` branch is protected. The deploy workflow
  (`.github/workflows/deploy.yml`) is triggered manually (workflow_dispatch)
  and publishes to GitHub Pages and Cloudflare Pages. Do not push to `main`
  yourself.

## Dangerous actions require authorization

Before performing any potentially destructive operation, **stop and get
explicit authorization from the human**. This includes, but is not limited to:

- `git push`, `git push --force`, `git reset --hard`, `git rebase`, history
  rewriting, deleting branches or tags.
- Deleting or overwriting files outside the scope of the current task.
- Mass find-and-replace or refactors that touch many files at once.
- Modifying CI/deploy workflows, secrets, or permissions.
- Installing, removing, or upgrading dependencies (`npm install`, changing
  `package.json` / `package-lock.json`).
- Destructive shell commands (`rm -rf`, `chmod`, `sudo`, etc.).
- Anything that changes how the site builds or deploys.

When in doubt, ask. "I think this is safe" is not authorization.

## Project architecture

AwareRide's website is a static site built with **Astro 7** (static output),
deployed to GitHub Pages and Cloudflare Pages from `main` via GitHub Actions.

### Tech stack
- **Framework**: Astro (`output: 'static'`), TypeScript, no UI framework.
- **Styling**: a single global stylesheet `src/styles/global.css` using CSS
  custom properties. No CSS-in-JS, no Tailwind. Component-specific styles live
  in scoped `<style>` blocks, but shared typography (e.g. `.prose`) lives in
  `global.css` so it reliably applies to Astro `<Content />` output.
- **Markdown**: Shiki with the `css-variables` theme.
- **Node**: 22 (see deploy workflow). Use `npm`, not `pnpm`/`yarn`.

### Directory layout
```
src/
  components/      Astro components (Layout, Nav, Footer, DocsLayout, PostCard)
  content/         Markdown collections (see "Content collections" below)
  content.config.ts  Collection schemas (zod) + glob loaders
  lib/             Shared helpers (e.g. docs.ts — sidebar nav builder)
  pages/           File-based routes (.astro)
  styles/global.css
.astro/            Generated types (do not edit)
.github/workflows/ CI: build + deploy to GH Pages & Cloudflare Pages
awareride-content-sync/  Content-sync skill for external projects; sync
                         workflow templates live in its templates/
public/            Static assets served as-is (favicon, images, CNAME)
```

### Pages & routing
- `/` — landing page (`src/pages/index.astro`).
- `/posts`, `/posts/[...slug]` — blog listing + catch-all article route.
- `/packscope` — product page.
- `/packscope/docs`, `/packscope/docs/[...slug]` — docs index + catch-all route
  rendering Markdown from the `packscopeDocs` collection.

### Layout composition
- `Layout.astro` owns the document shell (`<html>/<head>/<body>`, fonts, meta,
  OG tags). Every page should compose it — do **not** hand-write a second
  document shell.
- `Nav.astro` (sticky header) and `Footer.astro` are composed inside `Layout`
  by pages that need them.
- `DocsLayout.astro` is a content-region layout: it composes `Layout` +
  `Nav` + `Footer` and adds a sidebar + `.prose` content area. Do not duplicate
  the document shell inside it.

### Content collections
Defined in `src/content.config.ts` with zod schemas:
- `posts` — `src/content/posts/**/*.md`. Schema: `title`, `date`, `description`,
  `tags`, `author?`, `source?`, `draft?`. Nested dirs are supported (id is the
  path relative to the collection base).
- `packscopeDocs` — `src/content/docs/packscope/**/*.md`. Schema: `title`,
  `description?`, `order` (controls sidebar sort, `index` always first).

Markdown is rendered via `render(entry)` from `astro:content`; pages pass
`<Content />` into a `.prose` container so shared typography applies.

### Prose / Markdown styling
- The `.prose` class in `global.css` is the single source of truth for Markdown
  typography (headings, code blocks, blockquotes, lists, tables, links, images,
  hr). It is global (not component-scoped) so it applies to `<Content />`.
- Article pages use `class="article-body prose"`; docs use `class="prose"`.
- When adding new Markdown-rendering pages, wrap `<Content />` in `.prose`
  rather than writing fresh scoped styles.

### Build & deploy
- `npm run dev` — local dev server.
- `npm run build` — runs `astro check` (type check) then builds to `dist/`.
- `.github/workflows/deploy.yml` is triggered manually (workflow_dispatch):
  it builds, then deploys `dist/` to GitHub Pages and (via wrangler) Cloudflare
  Pages. It no longer runs automatically on push to `main`.
- The site domain is `open.awareride.com` (`public/CNAME`).

## Coding conventions
- Keep components small and composable; prefer passing props over globals.
- Use the CSS custom properties from `global.css` (`--color-*`, `--radius-*`,
  `--shadow-*`, `--transition`) instead of hard-coded values.
- TypeScript is `strict`; do not introduce `any` without reason.
- Imports: prefer relative paths for app code; the `@/*` alias maps to `src/*`.
- Keep `<head>` concerns in `Layout.astro`; pages should not duplicate meta
  tags or font links.

## Verifying your work
Before declaring a task done:
1. Run `npm run build` and confirm it passes with no errors.
2. Check the affected route's rendered HTML in `dist/` if behavior is uncertain.
3. Summarize what changed, what to review, and any follow-ups for the human.
