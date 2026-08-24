# awareride.github.io

The AwareRide open-source hub, served at **https://open.awareride.com** and
deployed to GitHub Pages and Cloudflare Pages from `main`.

AwareRide explores human perception, spatial intelligence, and wellness
through thoughtfully crafted open-source tools. This site is built on the
[astro-content-hub](https://github.com/awareride/astro-content-hub) template:
universal `[locale]` routes (en + zh-Hans with per-page fallback), a
data-driven product registry in [`site.config.ts`](./site.config.ts), and a
single Markdown content tree under [`src/content/`](./src/content).

## Content

- **Posts** — `src/content/posts/<locale>/` (nested dirs become path segments).
- **Docs** — `src/content/docs/<product>/<locale>/`; content synced from
  external repos via pull requests (see
  [`awareride-content-sync/`](./awareride-content-sync/SKILL.md)).
- **Product landings** — `src/content/product-info/<locale>/<slug>.md`.
- **Products** — registered in `site.config.ts`; adding an entry wires the
  docs collections, landing card, Products dropdown/catalog/footer, and routes
  automatically.

## Development

- `npm run dev` — local dev server.
- `npm run validate:content` — cross-file content gate.
- `npm test` — unit suite.
- `npm run build` — `astro check` + build + Pagefind search index.
- Deploy is a manual `workflow_dispatch` on `main`
  (`.github/workflows/deploy.yml`); it publishes `dist/` to GitHub Pages and
  Cloudflare Pages.

## Projects

- **[packscope](https://github.com/awareride/packscope)** — a Node CLI that
  unpacks mono JavaScript bundles from webpack, rspack, rollup, esbuild, and
  Vite into navigable, executable module trees.
  [Docs](https://open.awareride.com/packscope/docs)

## License

Content and design are released under the MIT License unless otherwise noted.
