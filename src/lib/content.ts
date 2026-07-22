// Shared, locale-aware helpers for localized docs collections.
// All product × locale collections follow the naming `<product>Docs<Locale>`
// (e.g. `packscopeDocsZh`), generated in content.config.ts. Route files stay
// thin by delegating path generation and fallback rendering to these helpers.

import { getCollection, render } from 'astro:content';
import { defaultLocale, cap, type Locale } from './i18n';
import { buildNav, type NavItem } from './docs';

/** Minimal entry shape consumed by helpers and route files. We use this instead of
 *  `CollectionEntry<string>` (which collapses `data` to `never`) because the
 *  collection names are built dynamically and cannot be typed as literals. */
export interface DocEntryLike {
  id: string;
  data: { title: string; description?: string; order: number };
  render(): Promise<{ Content: any }>;
}
export interface PostEntryLike {
  id: string;
  data: {
    title: string; date: Date; description: string; tags: string[];
    author?: string; source?: string; draft?: boolean;
  };
}

export interface LocalizedPathProps {
  slug: string;
  locale: Locale;
  isFallback: boolean;
  basePath: string;
  productName: string;
}

export interface RenderedPage {
  entry: DocEntryLike;
  Content: any;
  locale: Locale;
  isFallback: boolean;
  title: string;
  description?: string;
  navItems: NavItem[];
}

function collectionName(productName: string, locale: Locale): string {
  return `${productName}Docs${cap(locale)}`;
}

/**
 * Build static paths for a product's docs in one locale.
 *
 * - Default locale: every primary doc becomes a path.
 * - Non-default locale: every primary doc becomes a path, PLUS any default-locale
 *   doc that has no localized counterpart (rendered with `isFallback: true`).
 *
 *   The `index` doc is excluded — it is served by the dedicated `index.astro`
 *   route at the collection base, not by this catch-all, to avoid a duplicate
 *   `/.../docs/index/` URL alongside `/.../docs/`.
 *
 * This is the single place that owns fallback path generation.
 */
export async function getLocalizedPaths(
  productName: string,
  basePath: string,
  locale: Locale,
): Promise<{ params: { slug: string }; props: LocalizedPathProps }[]> {
  const primary: DocEntryLike[] = await getCollection(collectionName(productName, locale) as any);
  const primarySlugs = new Set(primary.map((d) => d.id));

  let source: { doc: DocEntryLike; isFallback: boolean }[];
  if (locale === defaultLocale) {
    source = primary.map((doc) => ({ doc, isFallback: false }));
  } else {
    const fallback: DocEntryLike[] = await getCollection(collectionName(productName, defaultLocale) as any);
    source = [
      ...primary.map((doc) => ({ doc, isFallback: false })),
      ...fallback
        .filter((d) => !primarySlugs.has(d.id))
        .map((doc) => ({ doc, isFallback: true })),
    ];
  }

  // Exclude the index doc — served by the dedicated index route.
  source = source.filter(({ doc }) => doc.id !== 'index');


  return source.map(({ doc, isFallback }) => ({
    params: { slug: doc.id },
    props: { slug: doc.id, locale, isFallback, basePath, productName },
  }));
}

/**
 * Render a single localized doc page. Looks up the primary (locale) collection
 * first; if missing and the locale is not the default, falls back to the
 * default-locale collection. Returns null when no matching doc exists.
 *
 * Sidebar nav is built from the primary collection for the page's language,
 * or from the default-locale collection when the page itself is a fallback
 * (so the nav matches the language of the surrounding shell, not the body).
 */
export async function renderLocalizedPage(
  productName: string,
  locale: Locale,
  slug: string,
  basePath: string,
): Promise<RenderedPage | null> {
  const primary: DocEntryLike[] = await getCollection(collectionName(productName, locale) as any);
  let entry = primary.find((d) => d.id === slug);
  let isFallback = false;

  if (!entry && locale !== defaultLocale) {
    const fallback: DocEntryLike[] = await getCollection(collectionName(productName, defaultLocale) as any);
    entry = fallback.find((d) => d.id === slug);
    isFallback = true;
  }
  if (!entry) return null;

  // Nav matches the rendered body's source language.
  const navSource: DocEntryLike[] = isFallback
    ? await getCollection(collectionName(productName, defaultLocale) as any)
    : primary;
  const navItems = buildNav(navSource, basePath);

  const { Content } = await render(entry as any);
  return {
    entry,
    Content,
    locale,
    isFallback,
    title: entry.data.title,
    description: entry.data.description,
    navItems,
  };
}

/**
 * Resolve the `index` doc for a product + locale, with default-locale fallback.
 * Returns the entry, its rendered Content, and the sidebar nav for the page's
 * source language. Used by the dedicated docs index routes.
 */
export async function getLocalizedDocIndex(
  productName: string,
  locale: Locale,
  basePath: string,
): Promise<RenderedPage | null> {
  const primary: DocEntryLike[] = await getCollection(collectionName(productName, locale) as any);
  let entry = primary.find((d) => d.id === 'index');
  let isFallback = false;

  if (!entry && locale !== defaultLocale) {
    const fallback: DocEntryLike[] = await getCollection(collectionName(productName, defaultLocale) as any);
    entry = fallback.find((d) => d.id === 'index');
    isFallback = true;
  }
  if (!entry) return null;

  const navSource: DocEntryLike[] = isFallback
    ? await getCollection(collectionName(productName, defaultLocale) as any)
    : primary;
  const navItems = buildNav(navSource, basePath);

  const { Content } = await render(entry as any);
  return {
    entry,
    Content,
    locale,
    isFallback,
    title: entry.data.title,
    description: entry.data.description,
    navItems,
  };
}

// ---------------------------------------------------------------------------
// Posts — same fallback pattern as docs, but collections are named
// `posts<Locale>` (no product prefix) and drafts are filtered out.
// ---------------------------------------------------------------------------

function postsCollectionName(locale: Locale): string {
  return `posts${cap(locale)}`;
}

export interface LocalizedPostPathProps {
  slug: string;
  locale: Locale;
  isFallback: boolean;
}

export interface RenderedPost {
  entry: PostEntryLike;
  Content: any;
  locale: Locale;
  isFallback: boolean;
  data: PostEntryLike['data'];
}

/** Non-draft filter, applied to every locale's post collection. */
function isPublished(entry: { data: { draft?: boolean } }): boolean {
  return !entry.data.draft;
}

/**
 * Build static paths for posts in one locale, with default-locale fallback
 * for posts that have no localized version. Drafts are excluded.
 */
export async function getPostLocalizedPaths(
  locale: Locale,
): Promise<{ params: { slug: string }; props: LocalizedPostPathProps }[]> {
  const primary = (await getCollection(postsCollectionName(locale) as any) as PostEntryLike[]).filter(isPublished);
  const primarySlugs = new Set(primary.map((d) => d.id));

  let source: { doc: PostEntryLike; isFallback: boolean }[];
  if (locale === defaultLocale) {
    source = primary.map((doc) => ({ doc, isFallback: false }));
  } else {
    const fallback = (await getCollection(postsCollectionName(defaultLocale) as any) as PostEntryLike[]).filter(isPublished);
    source = [
      ...primary.map((doc) => ({ doc, isFallback: false })),
      ...fallback
        .filter((d) => !primarySlugs.has(d.id))
        .map((doc) => ({ doc, isFallback: true })),
    ];
  }

  return source.map(({ doc, isFallback }) => ({
    params: { slug: doc.id },
    props: { slug: doc.id, locale, isFallback },
  }));
}

/** All published posts for a locale, with fallback entries from the default locale. */
export async function getLocalizedPosts(locale: Locale): Promise<{ entry: PostEntryLike; isFallback: boolean }[]> {
  const primary = (await getCollection(postsCollectionName(locale) as any) as PostEntryLike[]).filter(isPublished);
  if (locale === defaultLocale) {
    return primary.map((entry) => ({ entry, isFallback: false }));
  }
  const fallback = (await getCollection(postsCollectionName(defaultLocale) as any) as PostEntryLike[]).filter(isPublished);
  const primarySlugs = new Set(primary.map((d) => d.id));
  return [
    ...primary.map((entry) => ({ entry, isFallback: false })),
    ...fallback.filter((d) => !primarySlugs.has(d.id)).map((entry) => ({ entry, isFallback: true })),
  ];
}

/** Render a single localized post, falling back to the default locale. */
export async function renderLocalizedPost(
  locale: Locale,
  slug: string,
): Promise<RenderedPost | null> {
  const primary = (await getCollection(postsCollectionName(locale) as any) as PostEntryLike[]).filter(isPublished);
  let entry = primary.find((d) => d.id === slug);
  let isFallback = false;

  if (!entry && locale !== defaultLocale) {
    const fallback = (await getCollection(postsCollectionName(defaultLocale) as any) as PostEntryLike[]).filter(isPublished);
    entry = fallback.find((d) => d.id === slug);
    isFallback = true;
  }
  if (!entry) return null;

  const { Content } = await render(entry as any);
  return { entry, Content, locale, isFallback, data: entry.data };
}
