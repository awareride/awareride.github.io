---
title: "不用 Starlight,做带逐页回退的两种语言"
date: 2026-07-22
description: "为 Astro 站点加上中英双语,用内容级回退而非重定向 -- 而且没有按语言重复的样板代码。"
tags: ["i18n", "astro", "awareride"]
author: "AwareRide"
source: "https://github.com/awareride/awareride.github.io"
---

## Starlight,还是不用

多语言文档站的显而易见之选是 [Starlight](https://starlight.astro.build)。我认真考虑过。权衡最终
落在灵活性:我想要一个外壳,同时服务营销落地页、产品页、产品文档和博客 -- 横跨多个产品、带语言
前缀 -- 而且我要的是内容级回退,不是重定向。

Starlight 对文档很有主见;而我的站点大部分并不是文档。于是我自己写了 i18n。不到 200 行辅助函数。

## 语言在前

URL 的抉择:`/zh/packscope/docs/` 还是 `/packscope/docs/zh/`?我选了语言在前。`en` 是默认语言,
没有前缀;其它语言都活在 `/<locale>/...` 下:

- `https://open.awareride.com/packscope/docs/getting-started` -- 英文
- `https://open.awareride.com/zh/packscope/docs/getting-started` -- 中文

整站都照此镜像:`/zh/`、`/zh/packscope/`、`/zh/posts/`。一条规则,到处适用。

## 不是重定向的回退

关键的部分。缺失的翻译不该 404。但无差别地重定向到英文也不对 -- 读者要的是中文,把他们悄悄扔到
英文页面上会很迷茫。

所以回退是**逐页、内容级**的。一个 `zh` URL 永远存在。如果有中文页面,就在中文外壳里
(`<html lang="zh">`、中文导航、中文面包屑)渲染中文正文。如果没有,同一个 URL 渲染英文正文 --
仍然在中文外壳里,并带一条可见提示:

> 此页暂无中文翻译,以下显示英文原文。

你可以先发英文,再增量翻译。站点永远不会坏,只是在缺中文的地方显示英文加一条提示。`/zh/posts/`
上的文章卡片甚至在回退条目上带一个 `EN` 徽章,让读者点击前就知道。

## 没有按语言的样板代码

"每种语言一个集合"的陷阱在于:每加一种语言,就要一个新的 `defineCollection`、一组新的路由文件、
一个新的容易遗忘的地方。我拒绝写 `src/lib/doc-route-zh.ts`。

相反,集合和路由都从单一真相来源生成:

```ts
// i18n.ts -- 语言唯一存在的地方
export const locales = ['en', 'zh'] as const;
export const defaultLocale = 'en';
```

```ts
// content.config.ts -- 一个产品 × 一个语言 = 一个集合,自动生成
for (const product of products) {
  for (const locale of locales) {
    out[`${product}Docs${cap(locale)}`] = defineCollection({
      loader: glob({ pattern: '**/*.md', base: `./src/content/docs/${product}/${locale}` }),
      schema: docSchema,
    });
  }
}
```

加一种语言就是往 `locales` 和一个 UI 字符串的 `t` 对象里追加一项。集合循环、路径辅助、回退逻辑、
路由全都对 `locales` 保持泛化。没有会被遗忘的 `*-zh.ts` 文件。

## 那些要紧的小事

- **`index` 文档是特殊的。** 它由集合根上的专属 `index.astro` 路由服务(`/packscope/docs`),
  绝不是重复的 `/packscope/docs/index/`。catch-all 排除它。
- **侧边栏匹配正文,而不是外壳。** 当一个页面是回退(中文外壳里的英文正文)时,导航从英文集合
  构建 -- 这样你看到的链接与你正在读的正文语言一致。
- **`zh`,不是 `zh-CN`。** 更简单。万一将来需要,区域变体以后再加。

结果是一个站:有翻译的地方完全本地化,其余地方优雅地显示英文,而维护它只需编辑一个数组就能加
一种语言。

---

*这是"构建 open.awareride.com"系列的一部分。上一篇:
[用一个工作流同时部署到 GitHub Pages 与 Cloudflare Pages](/zh/posts/awareride/2026-07-21-deploying-to-github-and-cloudflare-pages/)。
下一篇:[通过 Pull Request 同步的内容中心](/zh/posts/awareride/2026-07-22-a-content-hub-synced-via-pull-requests/)。*
