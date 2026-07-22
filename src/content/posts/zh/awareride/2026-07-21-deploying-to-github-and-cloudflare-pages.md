---
title: "用一个工作流同时部署到 GitHub Pages 与 Cloudflare Pages"
date: 2026-07-21
description: "一个 GitHub Actions 工作流只构建一次,同时发布到 GitHub Pages 与 Cloudflare Pages -- 以及为此踩过的 wrangler 坑。"
tags: ["ci-cd", "github-pages", "cloudflare"]
author: "AwareRide"
source: "https://github.com/awareride/awareride.github.io"
---

## 构建一次,发布两次

open.awareride.com 跑在两个 CDN 上。GitHub Pages 是免费默认项;Cloudflare Pages 是我实际把
域名指向、用以获得更好缓存与边缘行为的那个。我不想维护两条构建流水线,所以部署工作流只构建一次,
然后扇出。

它还是**手动的** -- `on: workflow_dispatch`,push 时不自动触发。一个坏掉的 `main` 不该悄悄把
站点带挂;我在准备好时从 Actions 标签页手动跑部署。

## 形态

```yaml
on:
  workflow_dispatch:

jobs:
  build:
    # npm ci -> npm run build -> 上传两个 artifact
    #   - 给 GitHub Pages 的 pages artifact
    #   - 给 Cloudflare 的 dist-cf artifact
  deploy-gh-pages:
    needs: build
    uses: actions/deploy-pages@v4
  deploy-cf-pages:
    needs: build
    # wrangler pages deploy
```

一个构建作业产出 `dist/` 并上传两次。两个下游作业依赖 `build` 并行部署 -- GitHub Pages 走官方的
`deploy-pages` action,Cloudflare 走 `wrangler pages deploy`。

## 那些坑(按顺序)

第一次什么都没跑通。每次失败都是一件小而可修的事:

1. **`npm ci` 需要锁文件。** 工作流以 "Dependencies lock file is not found" 中止。
   `package-lock.json` 必须提交 -- `npm ci` 没有它就不跑。

2. **Wrangler 要把 token 作为环境变量,而不只是 secret。** 把 `CLOUDFLARE_API_TOKEN` 存进仓库
   不够;非交互式 runner 里的 wrangler 只在它被传到步骤的 `env:` 时才看得到。我把
   `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID` 都放进一个 `cf-deploy` 环境,再暴露给部署
   步骤。

3. **Pages 项目不存在。** 第一次部署以 `The Pages project "awareride" does not exist` 失败。
   Cloudflare 的控制台如今连"Pages"创建标签都不显示了 -- 只有 "Create a worker" -- 所以我改用
   wrangler 创建项目,工作流里现在是防御性地跑:

   ```bash
   npx wrangler pages project create awareride --production-branch=main 2>/dev/null || true
   npx wrangler pages deploy dist --project-name=awareride --branch=main
   ```

4. **预览 URL 打不开。** `wrangler pages deploy` 终于成功、上传了文件之后,
   `https://<hash>.awareride.pages.dev` 在浏览器里仍然打不开,直到自定义域名和 DNS 接到
   `open.awareride.com`。"部署成功"和"站点能访问"是两件不同的事。

## CNAME

对 GitHub Pages 来说,`public/CNAME` 里写 `open.awareride.com` 告诉 Pages 服务哪个自定义域名。
Cloudflare Pages 在它那边配置同一个域名。两个目标响应同一个主机名;无论你打到哪个,拿到的都是同一份
构建好的 `dist/`。

整个东西就是一个工作流、一次构建、两次部署、一个手动按钮。这正是我想要的自动化程度 -- 不多不少。

---

*这是"构建 open.awareride.com"系列的一部分。上一篇:
[用 Astro 重建 open.awareride.com](/zh/posts/awareride/2026-07-21-rebuilding-open-awareride-on-astro/)。
下一篇:[带逐页回退的两种语言](/zh/posts/awareride/2026-07-22-two-locales-with-per-page-fallback/)。*
