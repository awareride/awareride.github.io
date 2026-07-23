// i18n primitives — single source of truth for locales and UI strings.
// Adding a language: append to `locales` and `t`. Collection/route code
// is generic over these, so no per-language files are needed.

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

/** Capitalize the first letter — used to build collection names (e.g. `packscopeDocsZh`). */
export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Prefix a path with the locale segment, unless it is the default locale. */
export function localizePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

/** Build the alternates map for a page given its default-locale path.
 *  Every locale gets an entry (localized pages always exist, even as fallbacks). */
export function buildAlternates(defaultLocalePath: string): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const l of locales) {
    out[l] = localizePath(defaultLocalePath, l);
  }
  return out;
}

/** Infer the current locale from a URL pathname (default locale if no prefix matches). */
export function localeFromPath(pathname: string): Locale {
  const m = pathname.match(/^\/([a-z]{2})(?:\/|$)/i);
  if (m && isLocale(m[1])) return m[1];
  return defaultLocale;
}

/** Map a non-default locale back to its canonical code for display. */
export function localeLabel(locale: Locale): string {
  return locale === 'zh' ? '中文' : 'English';
}

/** BCP-47 locale code per locale, for `toLocaleDateString` and friends.
 *  Centralized so adding a locale doesn't require hunting down date calls. */
export const localeCode: Record<Locale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
};

/** UI strings per locale. `fallbackNotice` is shown when a page renders the default
 *  language content because no localized version exists. */
export const t = {
  en: {
    home: 'Home',
    posts: 'Posts',
    docs: 'Docs',
    breadcrumbDocs: 'Docs',
    projects: 'Projects',
    links: 'Links',
    connect: 'Connect',
    toggleMenu: 'Toggle menu',
    builtWith: 'Built with awareness.',
    footerTagline: 'Open source exploring human perception, spatial intelligence, and wellness.',
    noTranslation: 'No translation available',
    noPages: 'No pages yet.',
    fallbackNotice: '',
  },
  zh: {
    home: '首页',
    posts: '博客',
    docs: '文档',
    breadcrumbDocs: '文档',
    projects: '项目',
    links: '链接',
    connect: '联系',
    toggleMenu: '切换菜单',
    builtWith: '用心构建。',
    footerTagline: '开源探索人类感知、空间智能与身心健康。',
    noTranslation: '暂无中文翻译',
    noPages: '暂无页面。',
    fallbackNotice: '此页暂无中文翻译,以下显示英文原文。',
  },
} as const;

/** Landing page copy, per locale. Kept separate from `t` (small UI strings)
 *  because the landing page has a lot of long-form marketing text. */
export const home = {
  en: {
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
    projectsEyebrow: 'Projects',
    projectsTitle: 'Tools we are building',
    packscopeDesc: 'Unpack a single shipped JavaScript bundle — from webpack, rspack, rollup, esbuild, or Vite — into a navigable, executable project tree. Read, grep, edit, and rebuild modules with confidence.',
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
  },
  zh: {
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
    projectsEyebrow: '项目',
    projectsTitle: '我们正在构建的工具',
    packscopeDesc: '将单个已发布的 JavaScript bundle —— 来自 webpack、rspack、rollup、esbuild 或 Vite —— 解包为可浏览、可执行的项目树。自信地阅读、检索、编辑与重建模块。',
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
  },
} as const;

/** Packscope product page copy, per locale. */
export const packscope = {
  en: {
    title: 'Packscope',
    description: 'Packscope unpacks mono JavaScript bundles from webpack, rspack, rollup, esbuild, and Vite into navigable, executable module trees.',
    heroBadge: 'Open source Node CLI',
    heroTitle: 'Unpack JavaScript bundles into real, runnable modules',
    heroLead: 'Packscope turns a single shipped bundle — from webpack, rspack, rollup, esbuild, or Vite — into a navigable project tree that you can read, grep, edit, and run.',
    starGithub: 'Star on GitHub',
    documentation: 'Documentation',
    featuresEyebrow: 'Features',
    featuresTitle: 'What Packscope gives you',
    f1Title: 'One file per module',
    f1Body: 'Each webpack/rspack module is written to modules/<id>.js. ES-module chunks go to chunks/ and original sources to sources/.',
    f2Title: 'Executable by default',
    f2Body: 'The loader reconstructs the original bundle shape using the real UMD header and webpack runtime, so the unpacked tree runs identically.',
    f3Title: 'Edit & rebuild',
    f3Body: 'Modify any module, then run node out/rebuild.js bundle-edited.js to regenerate a single runnable bundle.',
    f4Title: 'Unpack from URLs',
    f4Body: 'Pass an http:// or https:// URL. Packscope downloads the bundle, resolves chunks, and rewrites imports to local paths.',
    f5Title: 'Manifest & dependency graph',
    f5Body: 'manifest.json contains IDs, sizes, dependency edges, inferred names, and downloaded assets for further analysis.',
    f6Title: 'Optional beautify & rename',
    f6Body: 'Use --beautify and --rename for readable output. Defaults keep original slices for guaranteed execution.',
    internalsEyebrow: 'Internals',
    internalsTitle: 'How it works',
    s1Title: 'Parse the bundle',
    s1Body: 'Acorn locates the webpack modules dictionary and maps every module boundary.',
    s2Title: 'Extract faithful bodies',
    s2Body: 'Each module body is sliced verbatim from the bundle. No AST rewrite means no statement-order surprises.',
    s3Title: 'Reconstruct the loader',
    s3Body: 'runtime.js rebuilds the original expression: header + delegator-filled modules + original runtime.',
    s4Title: 'Wire externals',
    s4Body: 'Externals like chokidar are detected from shim patterns and wired through the same UMD path as the original.',
    quickStartEyebrow: 'Quick Start',
    quickStartTitle: 'Usage',
    install: 'Install',
    unpackLocal: 'Unpack a local bundle',
    unpackUrl: 'Unpack from a URL',
    runTree: 'Run the unpacked tree',
    options: 'Options',
    rebuildAfter: 'Rebuild after editing',
    ctaTitle: 'Ready to inspect your bundle?',
    ctaBody: 'Clone the repo and unpack your first mono bundle in seconds.',
    readDocs: 'Read the Docs',
  },
  zh: {
    title: 'Packscope',
    description: 'Packscope 将来自 webpack、rspack、rollup、esbuild 与 Vite 的单体 JavaScript bundle 解包为可浏览、可执行的模块树。',
    heroBadge: '开源 Node CLI',
    heroTitle: '将 JavaScript bundle 解包为真实可运行的模块',
    heroLead: 'Packscope 把单个已发布的 bundle —— 来自 webpack、rspack、rollup、esbuild 或 Vite —— 转换成可浏览的项目树,让你能阅读、检索、编辑与运行。',
    starGithub: '在 GitHub 上 Star',
    documentation: '文档',
    featuresEyebrow: '功能特性',
    featuresTitle: 'Packscope 带给你什么',
    f1Title: '每个模块一个文件',
    f1Body: '每个 webpack/rspack 模块写入 modules/<id>.js。ES 模块分块放入 chunks/,原始源码放入 sources/。',
    f2Title: '默认即可执行',
    f2Body: '加载器用真实的 UMD 头与 webpack 运行时重建原始 bundle 形态,使解包后的树以相同方式运行。',
    f3Title: '编辑与重建',
    f3Body: '修改任意模块,然后运行 node out/rebuild.js bundle-edited.js 重新生成单个可运行 bundle。',
    f4Title: '从 URL 解包',
    f4Body: '传入 http:// 或 https:// URL。Packscope 会下载 bundle、解析分块,并将导入重写为本地路径。',
    f5Title: '清单与依赖图',
    f5Body: 'manifest.json 包含模块 ID、体积、依赖边、推断名称与已下载资源,便于进一步分析。',
    f6Title: '可选的美化与重命名',
    f6Body: '使用 --beautify 与 --rename 获得可读输出。默认保留原始切片以保证可执行。',
    internalsEyebrow: '内部原理',
    internalsTitle: '工作原理',
    s1Title: '解析 bundle',
    s1Body: 'Acorn 定位 webpack 模块字典,并映射每个模块边界。',
    s2Title: '忠实提取函数体',
    s2Body: '每个模块体从 bundle 中原样切片。不做 AST 改写,避免语句顺序意外。',
    s3Title: '重建加载器',
    s3Body: 'runtime.js 重建原始表达式:头 + 填充了委托的模块 + 原始运行时。',
    s4Title: '连接外部依赖',
    s4Body: 'chokidar 等外部依赖从 shim 模式中识别,并经由与原始相同的 UMD 路径接入。',
    quickStartEyebrow: '快速开始',
    quickStartTitle: '用法',
    install: '安装',
    unpackLocal: '解包本地 bundle',
    unpackUrl: '从 URL 解包',
    runTree: '运行解包后的树',
    options: '选项',
    rebuildAfter: '编辑后重建',
    ctaTitle: '准备好检视你的 bundle 了吗?',
    ctaBody: '克隆仓库,几秒钟内解包你的第一个单体 bundle。',
    readDocs: '阅读文档',
  },
} as const;
