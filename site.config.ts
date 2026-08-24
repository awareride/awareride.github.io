// site.config.ts - instance-level site configuration, kept at the repo root
// so rebranding / adding products never requires touching `src/` machinery.
//
// This file holds the `site` block (git host, customizable nav links and
// footer columns) and the `products` registry (the single place to add a
// product that ships a localized docs collection and a landing card). It sits
// next to astro.config.mjs (build/deploy config) on purpose: `site`/`products`
// are your site's data, astro.config.mjs is Astro's build configuration.
//
// This repo is the AwareRide open-source hub (open.awareride.com), rebuilt on
// the astro-content-hub template: universal `[locale]` routes, a data-driven
// product registry, per-product landing pages, site search, llms.txt, RSS and
// a sitemap. Products are registered here; everything else is generated.
//
// `slug`     URL segment (/<slug>/docs).
// `github`   repo URL (used by the landing card and product page).
// `badges`   labels shown on the landing card.
// `base`     (optional) override the docs directory - a path relative to the
//            repo root, e.g. './docs' => ./docs/<locale>/, used by content
//            synced in from an external repo. Defaults to
//            ./src/content/docs/<slug>/<locale>/.
// `description`  one-line summary shown in the nav dropdown and catalog page
//            (per locale, matching the copy.ts Record pattern).
// `featured` show in the top-nav "Products" dropdown. Every product still
//            appears on the /products catalog, in the footer, and on the
//            landing grid regardless of this flag.
//
// NOTE: skills/site-content/scripts/validate-hub-content.mjs parses this file
// with a line-based regex (slug/base string literals). Keep `slug: '...'`
// and `base: '...'` as single-quoted literals.

import type { Locale } from './src/lib/i18n';

export interface Product {
  slug: string;
  name: string;
  github: string;
  badges: string[];
  /** Optional product logo for the landing grid card. Accepts the media
   *  model shape (src | github | fallback+gradient); when absent the card
   *  renders a first-letter gradient chip derived from the product name. */
  logo?: string | { src?: string; github?: string; fallback?: string; gradient?: string };
  base?: string;
  description: Record<Locale, string>;
  featured: boolean;
}

/** A single customizable entry in the top-nav, appended after the built-in
 *  Posts / Products links (the built-in skeleton always renders first).
 *
 *  Plain link: set `href` (+ optional `external` / `activePrefix`).
 *  Dropdown: leave `href` undefined and provide `children`; the trigger then
 *  expands a panel of child links, styled and behaving like the Products
 *  dropdown. `href` may be internal ('/docs', '/about') or an absolute
 *  external URL (then set `external: true` to open in a new tab).
 *  `activePrefix` is an optional list of path segments that light this item
 *  up — any current path containing one of them highlights the link. */
export interface NavLink {
  label: Record<Locale, string>;
  href?: string;
  external?: boolean;
  activePrefix?: string[];
  children?: NavLink[];
}

/** A single footer link. `href` may be internal ('/about') or an absolute
 *  external URL (then set `external: true` to open in a new tab). */
export interface FooterLink {
  label: Record<Locale, string>;
  href: string;
  external?: boolean;
}

/** One column in the footer, rendered after the brand block in array order.
 *  - custom column (default): a titled list of links.
 *  - Products column ({ type: 'products' }): auto-generated from the products
 *    registry, titled with the localized `products` UI string. Include it in
 *    `footer.links` where you want it (position = array order), or omit it. */
export type FooterColumn =
  | {
      type?: 'custom';
      title: Record<Locale, string>;
      items: FooterLink[];
    }
  | {
      type: 'products';
      /** Which products this column lists. Defaults to featured-only, matching
       *  the nav Products dropdown. Set `all: true` to list every product.
       *  `limit` caps how many render (featured or all); when products exceed
       *  the limit a trailing "All products" link to the /products catalog is
       *  shown. */
      all?: boolean;
      limit?: number;
    };

export const site = {
  // Git host / org used for the GitHub CTA in the nav and the footer links.
  orgUrl: 'https://github.com/awareride',
  // Custom nav entries, appended after the built-in Posts / Products links
  // and before the GitHub CTA. Leave `links: []` for a stock navigation.
  nav: {
    links: [
      {
        label: { en: 'Docs', 'zh-Hans': '文档' },
        href: '/packscope/docs',
        activePrefix: ['docs'],
      },
      {
        label: { en: 'Community', 'zh-Hans': '社区' },
        children: [
          { label: { en: 'GitHub', 'zh-Hans': 'GitHub' }, href: 'https://github.com/awareride', external: true, activePrefix: ['github'] },
          { label: { en: 'Contact', 'zh-Hans': '联系' }, href: 'https://github.com/awareride/awareride.github.io/issues', external: true },
        ],
      },
    ] as NavLink[],
  },
  // Footer columns. Each renders as one column after the brand block.
  // A custom column is a titled list of links; { type: 'products' } renders
  // the auto-generated Products column (featured products by default,
  // `all: true` for every product). Omit it to hide the Products column.
  footer: {
    links: [
      {
        title: { en: 'Links', 'zh-Hans': '链接' },
        items: [
          { label: { en: 'Home', 'zh-Hans': '首页' }, href: '/' },
          { label: { en: 'Packscope', 'zh-Hans': 'Packscope' }, href: '/packscope' },
          { label: { en: 'Docs', 'zh-Hans': '文档' }, href: '/packscope/docs' },
        ],
      },
      {
        title: { en: 'Connect', 'zh-Hans': '联系' },
        items: [
          { label: { en: 'GitHub', 'zh-Hans': 'GitHub' }, href: 'https://github.com/awareride', external: true },
        ],
      },
      { type: 'products', limit: 5 },
    ] as FooterColumn[],
  },
};

export const products: Product[] = [
  {
    slug: 'packscope',
    name: 'Packscope',
    github: 'https://github.com/awareride/packscope',
    badges: ['CLI', 'JavaScript', 'Bundle'],
    logo: { github: 'awareride' },
    featured: true,
    description: {
      en: 'Unpack mono JavaScript bundles from webpack, rspack, rollup, esbuild, and Vite into navigable, executable module trees.',
      'zh-Hans': '把 webpack、rspack、rollup、esbuild 与 Vite 的单体 JavaScript bundle 解包成可浏览、可执行的模块树。',
    },
  },
];
