---
title: "一个通过 Pull Request 从多个仓库同步的内容中心"
date: 2026-07-22
description: "外部项目如何通过一个开 PR 而非直推 main 的 GitHub Action,向 open.awareride.com 贡献文章与文档。"
tags: ["content-sync", "github-actions", "astro"]
author: "AwareRide"
source: "https://github.com/awareride/awareride.github.io"
---

## 中心的想法

open.awareride.com 是一个为散落在多个仓库里的内容而存在的渲染面。你正在读的博客写在一个单独的
`Posts` 仓库里。Packscope 的文档写在 `packscope` 仓库里。中心仓库 --
`awareride/awareride.github.io` -- 只负责构建与渲染。

问题是:如何把内容从 N 个外部仓库搬进中心的 `src/content/`,既不让中心变成合并冲突的重灾区,
又绝不让外部推送未经评审就落到 `main`。

## 契约

每个外部仓库镜像中心的语言布局,并让一个 GitHub Action 把它的 `posts/` 和 `docs/` 拷进去:

| 外部仓库 | 中心 |
|----------|------|
| `posts/` | `src/content/posts/` |
| `docs/` | `src/content/docs/${PRODUCT}/` |

`${PRODUCT}` 这一段是有意思的部分。外部仓库的文档按语言扁平存放 -- `docs/en/getting-started.md`,
而不是 `docs/packscope/en/getting-started.md`。产品维度在同步时由工作流里的 `PRODUCT` 环境变量注入。
这让相对 Markdown 链接在 GitHub 上浏览仓库时仍然有效:它们相对 `docs/` 解析,而不是 `docs/packscope/`。

## 同步开 PR,绝不直推 main

同步工作流不推 `main`。它克隆中心、用 `rsync` 拷贝内容、提交到一个专属分支,并开一个 pull request:

```bash
rsync -a posts/ "$CLONE_DIR/src/content/posts/"
git checkout -b "sync-posts-${SRC}-${RUN_ID}"
git commit -m "posts: sync from ${SOURCE_REPO}"
git push -u origin "$BRANCH"
gh pr create --repo awareride/awareride.github.io --base main --head "$BRANCH" \
  --title "posts: sync from ${SOURCE_REPO}"
```

`rsync -a posts/ dest/`(注意末尾斜杠)的意思是"`posts/` 的内容",所以无论目标目录是否已存在,
它都不会造出 `posts/posts/` -- 这正是我早先用基于 `cp -R` 的 action 时踩到的坑。人工评审 PR 并合并。
没有任何东西在无人值守时落地。

鉴权用一个存为 `DOCS_CENTRAL_HUB_TOKEN` 的细粒度 PAT,放在外部仓库里,对中心有 Contents 与
Pull-requests 写权限。

## 是技能,不是复制粘贴

与其让每个外部仓库各自重造,整套东西被打包成一个技能:`awareride-content-sync`。外部仓库把它拷进
`.agents/skills/awareride-content-sync/`,一次性拿到工作流模板、校验脚本和文档。

校验器在同步前运行并作为门禁 -- 纯 Node 标准库,零依赖:

```bash
node .agents/skills/awareride-content-sync/scripts/validate.mjs
```

它强制 frontmatter 合规,以及 **slug 契约**:一个文件的 slug 是它相对语言目录的路径,且在各语言
间必须逐字节一致。`en/getting-started.md` 配 `zh/getting-started.md` -- 绝不是
`zh/Getting-Started.md` -- 否则逐页回退会坏。

## 退役内容

`rsync` 拷贝只增改、不删除,这样一个项目的内容不会被另一个项目的页面误删。这也意味着在本地删掉
一个文件,并不会把它从中心删掉。

可选的答案是仓库根上的 `sync-delete.list` -- 每行一条路径,末尾带斜杠表示整个目录。拷贝之后,
`apply-delete-list.mjs` 精确移除这些路径,删除与新增一起出现在同一个可评审的 PR 里:

```text
posts/en/old-post.md
docs/en/legacy/
```

## 在两个地方都能用的链接

源 Markdown 保留对 GitHub 友好的相对链接 -- `./getting-started.md`、`../zh/architecture.md`。
在中心上,Astro 的 Markdown 处理器不重写正文链接,所以一个裸的 `./getting-started.md` 会渲染成
`href="./getting-started.md"` 然后 404。一个小的 Sätteri mdast 插件在构建时修复了它:它扫描一次
`src/content/**/*.md`,建一张"文件路径 -> 站点 URL"的映射,并把相对 `.md` 链接改写成中心路由 --
`./getting-started.md` 变成 `/packscope/docs/getting-started`。无需改源文件,链接在 GitHub 上和站点上
都能用。

## 加起来是什么

一个外部仓库用扁平、GitHub 可读的布局写 Markdown。推到 `main` 时,工作流校验它、把它拷进中心
的一个分支、并开一个 PR。中心评审、合并,一次手动部署把它上线。内容留在它被维护的地方;中心只负责
渲染。

---

*这是"构建 open.awareride.com"系列的一部分。上一篇:
[不用 Starlight,做带逐页回退的两种语言](/zh/posts/awareride/2026-07-22-two-locales-with-per-page-fallback/)。
下一篇:[一个不会消失的移动端导航](/zh/posts/awareride/2026-07-22-a-mobile-nav-that-does-not-vanish/)。*
