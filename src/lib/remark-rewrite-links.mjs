// Sätteri mdast plugin: rewrite relative `.md` links in markdown bodies to
// their site URLs at build time.
//
// Why: source files keep GitHub-friendly relative links (e.g. `./getting-started.md`
// or `../zh/getting-started.md`) so they resolve when browsing the repo on GitHub.
// On the hub, Astro's Markdown processor does NOT rewrite body markdown links, so
// a raw `./getting-started.md` would render as `href="./getting-started.md"` and
// 404. This plugin turns such links into the correct hub route
// (e.g. `/packscope/docs/getting-started`) at build time, with no source edits.
//
// Scope (what gets rewritten):
//   - Relative links whose target ends in `.md` (with optional `#anchor`).
//     Both inline `[t](./x.md)` and reference-style `[ref]: ./x.md`.
//   - The target must resolve to a file inside the hub content collections
//     (src/content/{posts,docs}); otherwise the link is left unchanged (safe
//     default - we never rewrite external/anchor/absolute links).
//
// How: at plugin init, scan src/content/**\/*.md once and build a
// Map<absolutePath, siteUrl>. For each rendered markdown file, resolve each
// relative `.md` link against the current file's path (from ctx.fileURL) and
// look it up. Mutations go through ctx.setProperty so Sätteri records them in
// its command buffer.
//
// This is a Sätteri-native mdast plugin (a visitor object), NOT a unified/
// remark plugin - Astro 7 defaults to Sätteri and its plugins use a visitor
// API keyed by node type, not the `(tree, file) => void` transformer shape.
//
// No new dependencies (pure Node stdlib). Keeps the single source of truth for
// locales/defaultLocale in src/lib/i18n.ts.

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales, defaultLocale } from './i18n';

const __dirname = dirname(fileURLToPath(import.meta.url));
// src/lib -> project root (two levels up).
const ROOT = resolve(__dirname, '..', '..');
const CONTENT = join(ROOT, 'src', 'content');

/** URL prefix for a locale: '' for the default locale, '/<locale>' otherwise. */
function localePrefix(locale) {
  return locale === defaultLocale ? '' : `/${locale}`;
}

/**
 * Compute the hub site URL for a content markdown file, given its path
 * relative to src/content/ (using OS separators). Returns null if the path
 * is not a recognized content file (so it is left unrewritten).
 *
 *   posts/<locale>/<slug>.md                  ->  [/<locale>]/posts/<slug>
 *   docs/<product>/<locale>/<slug>.md         ->  [/<locale>]/<product>/docs/<slug>
 *   docs/<product>/<locale>/index.md          ->  [/<locale>]/<product>/docs
 *
 * The `index` slug is special-cased for docs only: it is served by the
 * dedicated index route at the collection base (the docs catch-all excludes
 * it), so `index.md` maps to `/<product>/docs`, not `/<product>/docs/index`.
 * Posts have no index.md and their catch-all does not exclude it, so no
 * special-casing is applied there.
 */
function urlForContentPath(rel) {
  const p = rel.split(sep).join('/');
  let m = p.match(/^posts\/([^/]+)\/(.+)\.md$/);
  if (m) {
    const locale = m[1];
    if (!locales.includes(locale)) return null;
    return `${localePrefix(locale)}/posts/${m[2]}`;
  }
  m = p.match(/^docs\/([^/]+)\/([^/]+)\/(.+)\.md$/);
  if (m) {
    const product = m[1];
    const locale = m[2];
    if (!locales.includes(locale)) return null;
    const slug = m[3];
    if (slug === 'index') return `${localePrefix(locale)}/${product}/docs`;
    return `${localePrefix(locale)}/${product}/docs/${slug}`;
  }
  return null;
}

/** Recursively list .md files under `base`, returning paths relative to CONTENT. */
function listMdRel(base) {
  if (!existsSync(base)) return [];
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const s = statSync(p);
      if (s.isDirectory()) walk(p);
      else if (s.isFile() && name.endsWith('.md')) out.push(p);
    }
  };
  walk(base);
  return out.map((p) => relative(CONTENT, p));
}

/** Build a Map<absolute path, siteUrl> for every content markdown file. */
function buildUrlMap() {
  const map = new Map();
  for (const rel of listMdRel(CONTENT)) {
    const url = urlForContentPath(rel);
    if (!url) continue;
    map.set(resolve(CONTENT, rel), url);
  }
  return map;
}

let _urlMap;
function getUrlMap() {
  if (!_urlMap) _urlMap = buildUrlMap();
  return _urlMap;
}

/** True if a link URL is a relative `.md` link we should try to rewrite. */
function isRewritable(url) {
  if (typeof url !== 'string' || url === '') return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return false; // scheme: http(s):, mailto:, ...
  if (url.startsWith('#')) return false;               // same-page anchor
  if (url.startsWith('/')) return false;               // absolute site path
  return /\.md(?:[?#]|$)/i.test(url);                  // relative path ending in .md
}

/**
 * Rewrite one link/definition node's relative `.md` URL to its hub route.
 * Leaves the node untouched when the URL is not rewritable or the target is
 * not found in the content collections.
 */
function rewriteLinkNode(node, ctx) {
  const raw = node.url;
  if (!isRewritable(raw)) return;
  if (!ctx.fileURL) return; // no source path -> can't resolve; leave unchanged
  const baseDir = dirname(fileURLToPath(ctx.fileURL));
  const hashIdx = raw.indexOf('#');
  const pathPart = hashIdx === -1 ? raw : raw.slice(0, hashIdx);
  const hash = hashIdx === -1 ? '' : raw.slice(hashIdx);
  const target = resolve(baseDir, pathPart);
  const url = getUrlMap().get(target);
  if (url) {
    // Mutate through the context so Sätteri records it in its command buffer.
    ctx.setProperty(node, 'url', url + hash);
  }
}

/**
 * Sätteri mdast plugin definition. A visitor object keyed by node type; each
 * handler receives (node, ctx) and may mutate the node via ctx methods.
 */
export const rewriteRelativeMdLinks = {
  name: 'awareride-rewrite-relative-md-links',
  link(node, ctx) {
    rewriteLinkNode(node, ctx);
  },
  definition(node, ctx) {
    rewriteLinkNode(node, ctx);
  },
};
