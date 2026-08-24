// Instance copy - the strings and names that make this site "your site".
// Rebrand by editing THIS file: site name, UI strings, landing copy, and
// product-page copy. The i18n machinery around it lives in src/lib/i18n.ts,
// which re-exports everything here so existing imports keep working.
//
// Adding a language: append the locale to `locales` in src/lib/i18n.ts, then
// add a matching block to every table below. Every table is typed
// `Record<Locale, …>` seeded from the `en` entry, so a missing locale (or a
// key that drifts from the `en` seed) is a compile error.

import type { Locale } from '../lib/i18n';

/** Site name - set this to your project's name. Used in <title>, nav, footer. */
export const siteName = 'AwareRide';

/** UI strings per locale. `t.en` is the canonical shape; every other locale must
 *  match it exactly. `fallbackNotice` is shown when a page renders the default
 *  language content because no localized version exists. */
const tEn = {
  home: 'Home',
  posts: 'Posts',
  docs: 'Docs',
  breadcrumbDocs: 'Docs',
  products: 'Products',
  ctaGitHub: 'GitHub',
  productsPageEyebrow: 'Catalog',
  productsPageTitle: 'Products',
  productsPageLead: 'Every project that ships docs and posts in this hub.',
  viewAllProducts: 'All products',
  toggleMenu: 'Toggle menu',
  builtWith: 'Built with awareness.',
  footerTagline: 'Open source exploring human perception, spatial intelligence, and wellness.',
  noTranslation: 'No translation available',
  noPages: 'No pages yet.',
  fallbackNotice: '',
  postsListEyebrow: 'Blog',
  postsListTitle: 'Posts',
  postsListLead:
    'Thoughts on developer tooling, bundle analysis, perception, and building with awareness.',
  postsDescription:
    'Technical articles from the content hub — guides, notes, and announcements.',
  noPosts: 'No posts yet. Check back soon.',
  allPostsBack: '← All Posts',
  relatedPosts: 'Related posts',
  byAuthor: 'by {author}',
  viewSource: 'View source →',
  tagEyebrow: 'Tag',
  tagLead: '{n} post{s}',
  tagDescription: 'Posts tagged {label}',
  previous: '← Previous',
  next: 'Next →',
  searchOpen: 'Open search',
  searchClose: 'Close search',
  searchPlaceholder: 'Search…',
  searchScopeAll: 'All',
  searchScopePosts: 'Posts',
  searchScopeDocs: 'Docs',
  searchScopeProducts: 'Products',
  searchNoResults: 'No results found',
  searchLoading: 'Searching…',
  searchResultsFor: 'Results for {query}',
  searchError: 'Search is unavailable right now. Try again later.',
  searchHint: 'Search docs, posts, and products across the hub',
  searchMatchCount: '{n} result',
  searchMatchCountPlural: '{n} results',
};
export type UIStrings = typeof tEn;
export const t: Record<Locale, UIStrings> = {
  en: tEn,
  'zh-Hans': {
    home: '首页',
    posts: '博客',
    docs: '文档',
    breadcrumbDocs: '文档',
    products: '产品',
    ctaGitHub: 'GitHub',
    productsPageEyebrow: '目录',
    productsPageTitle: '产品',
    productsPageLead: '本中心收录了所有提供文档与文章的项目。',
    viewAllProducts: '全部产品',
    toggleMenu: '切换菜单',
    builtWith: '用心构建。',
    footerTagline: '开源探索人类感知、空间智能与身心健康。',
    noTranslation: '暂无中文翻译',
    noPages: '暂无页面。',
    fallbackNotice: '此页暂无中文翻译,以下显示英文原文。',
    postsListEyebrow: '博客',
    postsListTitle: '文章',
    postsListLead:
      '关于开发工具、bundle 分析、感知,以及以觉察之心构建的思考。',
    postsDescription: '内容中心的技术文章 —— 指南、笔记与公告。',
    noPosts: '暂无文章,敬请期待。',
    allPostsBack: '← 全部文章',
    relatedPosts: '相关文章',
    byAuthor: '作者:{author}',
    viewSource: '查看源码 →',
    tagEyebrow: '标签',
    tagLead: '共 {n} 篇文章',
    tagDescription: '标签为 {label} 的文章',
    previous: '← 上一篇',
    next: '下一篇 →',
    searchOpen: '打开搜索',
    searchClose: '关闭搜索',
    searchPlaceholder: '搜索…',
    searchScopeAll: '全部',
    searchScopePosts: '博客',
    searchScopeDocs: '文档',
    searchScopeProducts: '产品',
    searchNoResults: '未找到结果',
    searchLoading: '搜索中…',
    searchResultsFor: '“{query}” 的搜索结果',
    searchError: '搜索暂不可用,请稍后重试。',
    searchHint: '搜索整个中心的文档、博客与产品',
    searchMatchCount: '{n} 条结果',
    searchMatchCountPlural: '{n} 条结果',
  },
};

/** Landing page copy, per locale. Kept separate from `t` (small UI strings)
 *  because the landing page has a lot of long-form marketing text. */
const homeEn = {
  title: 'AwareRide',
  description: 'AwareRide explores human perception, spatial intelligence, and wellness through thoughtfully crafted open-source tools.',
  eyebrow: 'Open Source Software',
  heroTitleA: 'Technology that sees the world',
  heroTitleB: 'the way people do.',
  heroLead: 'AwareRide explores human perception, spatial intelligence, and wellness through thoughtfully crafted open-source tools. We build software that helps developers understand complexity and helps people feel more aware in their environments.',
  ctaGithub: 'Explore on GitHub',
  ctaProjects: 'View Projects',
  latestEyebrow: 'Latest',
  latestTitle: 'From the blog',
  allPosts: 'All Posts →',
  focusEyebrow: 'Our Focus',
  focusTitle: 'Perception, space, and wellbeing',
  focusLead: 'We believe the best tools are built with awareness — of context, of people, and of the systems we all share. Our work sits at the intersection of cognitive science, spatial computing, and developer experience.',
  card1Title: 'Human Perception',
  card1Body: 'Interfaces and algorithms shaped by how we actually see, hear, and process the world around us.',
  card2Title: 'Spatial Intelligence',
  card2Body: 'Software that understands relationships between objects, environments, and the people moving through them.',
  card3Title: 'Wellness',
  card3Body: 'Tools designed to reduce friction, restore attention, and support healthier relationships with technology.',
  productsEyebrow: 'Projects',
  productsTitle: 'Tools we are building',
  learnMore: 'Learn More',
  principlesEyebrow: 'Principles',
  principlesTitle: 'How we build',
  principle1Title: 'Open by default',
  principle1Body: 'Source code, decisions, and roadmaps are shared with the community.',
  principle2Title: 'Human-first',
  principle2Body: 'We optimize for clarity, accessibility, and calm over novelty for its own sake.',
  principle3Title: 'Interdisciplinary',
  principle3Body: 'We draw from design, cognitive science, and systems engineering.',
  principle4Title: 'Carefully measured',
  principle4Body: 'From bundle sizes to cognitive load, we believe in understanding before optimizing.',
  ctaTitle: 'Join the ride',
  ctaBody: 'AwareRide is just getting started. Follow our progress, open an issue, contribute to one of our projects on GitHub, or reach out by email.',
  ctaGithubOrg: 'Visit GitHub Organization',
  homeStatsEyebrow: 'By the numbers',
  homeStatsTitle: 'Small, fast, focused',
  homeStatsProducts: 'Products',
  homeStatsLocales: 'Locales',
  homeStatsPages: 'Pages built',
};
export type HomeCopy = typeof homeEn;
export const home: Record<Locale, HomeCopy> = {
  en: homeEn,
  'zh-Hans': {
    title: 'AwareRide',
    description: 'AwareRide 通过精心打磨的开源工具,探索人类感知、空间智能与身心健康。',
    eyebrow: '开源软件',
    heroTitleA: '让技术像人一样',
    heroTitleB: '感知这个世界。',
    heroLead: 'AwareRide 通过精心打磨的开源工具,探索人类感知、空间智能与身心健康。我们构建帮助开发者理解复杂性、帮助人们在所处环境中更有觉察的软件。',
    ctaGithub: '在 GitHub 上探索',
    ctaProjects: '查看项目',
    latestEyebrow: '最新',
    latestTitle: '来自博客',
    allPosts: '全部文章 →',
    focusEyebrow: '我们的方向',
    focusTitle: '感知、空间与身心健康',
    focusLead: '我们相信最好的工具都带着觉察而构建 —— 对上下文、对人、对我们共享的系统。我们的工作位于认知科学、空间计算与开发者体验的交汇处。',
    card1Title: '人类感知',
    card1Body: '依据我们真实观看、聆听与处理世界的方式塑造的界面与算法。',
    card2Title: '空间智能',
    card2Body: '理解物体、环境与在其中活动之人关系的软件。',
    card3Title: '身心健康',
    card3Body: '旨在减少摩擦、恢复注意力、支持与技术更健康关系的工具。',
    productsEyebrow: '项目',
    productsTitle: '我们正在构建的工具',
    learnMore: '了解更多',
    principlesEyebrow: '原则',
    principlesTitle: '我们如何构建',
    principle1Title: '默认开放',
    principle1Body: '源代码、决策与路线图都与社区共享。',
    principle2Title: '以人为本',
    principle2Body: '我们优先追求清晰、可访问与从容,而非为新颖而新颖。',
    principle3Title: '跨学科',
    principle3Body: '我们从设计、认知科学与系统工程中汲取营养。',
    principle4Title: '审慎度量',
    principle4Body: '从 bundle 体积到认知负荷,我们相信先理解再优化。',
    ctaTitle: '加入我们',
    ctaBody: 'AwareRide 刚刚起步。关注我们的进展、提一个 issue、在 GitHub 上为我们的项目贡献,或通过邮件联系。',
    ctaGithubOrg: '访问 GitHub 组织',
    homeStatsEyebrow: '数据一览',
    homeStatsTitle: '小巧、快速、专注',
    homeStatsProducts: '产品数',
    homeStatsLocales: '语言数',
    homeStatsPages: '构建页数',
  },
};

/** Generic copy for a product detail page. Product-specific fields (name,
 *  github, badges) come from the `products` array in `site.config.ts` (repo root);
 *  this supplies the surrounding labels, which are identical across products. */
const productCopyEn = {
  metaDescription: '{name} — open-source project documentation and posts.',
  heroBadge: 'Open Source',
  documentation: 'Documentation',
  viewSource: 'View Source',
  learnMore: 'Learn More',
  docsEyebrow: 'Documentation',
  docsTitle: 'Docs',
  readDocs: 'Read the Docs',
  ctaTitle: 'Explore the project',
  ctaBody: 'Read the documentation or browse the source on GitHub.',
  ctaPrimary: 'View on GitHub',
  ctaSecondary: 'Read the Docs',
};
export type ProductCopy = typeof productCopyEn;
export const productCopy: Record<Locale, ProductCopy> = {
  en: productCopyEn,
  'zh-Hans': {
    metaDescription: '{name} —— 开源项目文档与文章。',
    heroBadge: '开源',
    documentation: '文档',
    viewSource: '查看源码',
    learnMore: '了解更多',
    docsEyebrow: '文档',
    docsTitle: '文档',
    readDocs: '阅读文档',
    ctaTitle: '深入了解项目',
    ctaBody: '阅读文档,或在 GitHub 上浏览源码。',
    ctaPrimary: '在 GitHub 上查看',
    ctaSecondary: '阅读文档',
  },
};

/** Organization copy - the front door of the hub. This is the *organization's*
 *  story (who you are, what you build, how to reach you), shown on the landing
 *  page's mission section and available to any page that wants an org intro.
 *  Rebrand by editing THIS block; per-locale like every other copy table. */
const orgEn = {
  eyebrow: 'The Organization',
  title: 'Who we are',
  mission:
    'AwareRide explores human perception, spatial intelligence, and wellness through thoughtfully crafted open-source tools. We build at the intersection of cognitive science, spatial computing, and developer experience — always with awareness of context, of people, and of the systems we share.',
  linksLabel: 'Connect',
  links: [
    { label: 'GitHub', href: 'https://github.com/awareride' },
    { label: 'Contact', href: 'https://github.com/awareride/awareride.github.io/issues' },
  ],
};
export type OrgCopy = typeof orgEn;
export const org: Record<Locale, OrgCopy> = {
  en: orgEn,
  'zh-Hans': {
    eyebrow: '组织',
    title: '我们是谁',
    mission:
      'AwareRide 通过精心打磨的开源工具,探索人类感知、空间智能与身心健康。我们在认知科学、空间计算与开发者体验的交汇处构建 —— 始终带着对上下文、对人、对我们共享系统的觉察。',
    linksLabel: '联系我们',
    links: [
      { label: 'GitHub', href: 'https://github.com/awareride' },
      { label: '联系我们', href: 'https://github.com/awareride/awareride.github.io/issues' },
    ],
  },
};
