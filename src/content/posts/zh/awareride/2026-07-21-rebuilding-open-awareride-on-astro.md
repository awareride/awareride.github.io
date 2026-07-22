---
title: "用 Astro 重建 open.awareride.com"
date: 2026-07-21
description: "一个单页静态站点如何成长为带落地页、产品文档与博客的 Astro 静态站点。"
tags: ["astro", "awareride", "web"]
author: "AwareRide"
source: "https://github.com/awareride/awareride.github.io"
---

## 它起初只是一个 HTML 文件

open.awareride.com 最初只是一个静态 HTML 页面 -- 一个 logo、一句标语、一个试了好几次才弄对的
favicon,以及一个把 GitHub Pages 指向自定义域名的 `CNAME`。它撑过一个下午,但撑不了多久。

计划很简单:为 [AwareRide](https://github.com/awareride) 及其项目建一个真正的家 -- 一个像产品
的落地页、从各项目自身仓库拉取的产品文档,以及一个写工程文章的博客。我不想要一个"兼职当首页
的文档站",我想要一个"顺带发布文档的首页"。

我选了 [Astro](https://astro.build) 的 `output: 'static'` 模式,再没回头。

## 四条路由,一个外壳

一切都挂在四条路由上:

- `/` -- 落地页
- `/packscope` -- 产品页
- `/packscope/docs` -- 文档,以 Markdown 形式写在 packscope 仓库里
- `/posts` -- 这个博客

一个 `Layout.astro` 拥有文档外壳(`<html>`、字体、meta、OG 标签)。产品页和文档页组合它,而不是
重新造一个 `<head>`。`DocsLayout.astro` 组合 `Layout` + `Nav` + `Footer`,并加上侧边栏和 `.prose`
内容区。代码库里没有任何第二个文档外壳 -- 仅这一条规则就消灭了一整类"为什么这页长得不一样"的 bug。

## 内容即数据,而非文件

Astro 的内容集合(content collections)把"文档放哪儿"变成了一个有类型的问题。`src/content.config.ts`
为每个集合定义一个 zod schema 和一个 glob 加载器,所以一个错误的 frontmatter 字段会让构建失败,
而不是悄悄上线:

```ts
const postSchema = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
  source: z.string().optional(),
  draft: z.boolean().default(false),
});
```

文档来自 `src/content/docs/packscope/**`,文章来自 `src/content/posts/**`。每条路由都是一个瘦瘦的
`[...slug].astro` catch-all,调用 `render(entry)` 并把 `<Content />` 包进 `.prose` 容器。

## 刻意只用一个样式表

没有 Tailwind,没有 CSS-in-JS。一个 `src/styles/global.css` 满是 CSS 自定义属性
(`--color-*`、`--radius-*`、`--shadow-*`),文件头注释至今写着 `Anthropic-inspired: clean, bold,
minimal`。代码高亮用 Shiki 的 `css-variables` 主题,所以语法配色遵循同一套调色板,而不是互相打架。

`.prose` 类是 Markdown 排版的唯一真相来源,而且它住在 `global.css` 里,而不是某个组件的
scoped `<style>` 里。这是让它可靠地作用于 Astro `<Content />` 输出的唯一办法 -- 一个小细节,
省下了大量"为什么我的列表样式没了"的时间。

## 把构建跑绿

`npm run build` 先跑 `astro check` 再构建到 `dist/`。大部分打磨都在追那些显而易见的问题:一个
继承了深色背景的页脚、一个配色与页面冲突的终端示例、三张加载不出图片的特性卡片。一个一个,变绿。

整个迁移落在一个提交里 -- `feat: migrate to Astro static site` -- 主页终于像个主页了。

---

*这是"构建 open.awareride.com"系列的一部分。下一篇:
[部署到 GitHub Pages 与 Cloudflare Pages](/zh/posts/awareride/2026-07-21-deploying-to-github-and-cloudflare-pages/),
接着是[带逐页回退的两种语言](/zh/posts/awareride/2026-07-22-two-locales-with-per-page-fallback/),
最后是[通过 Pull Request 同步的内容中心](/zh/posts/awareride/2026-07-22-a-content-hub-synced-via-pull-requests/)。*
