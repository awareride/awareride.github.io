---
title: "为什么我做了 Packscope"
date: 2026-07-20
description: "Packscope 背后的故事 —— 一个把 JavaScript bundle 解包成可运行模块树的工具。"
tags: ["packscope", "javascript", "tooling"]
author: "AwareRide"
source: "https://github.com/awareride/packscope"
---

## 问题

你有没有盯着一个压缩后的 21 MB webpack bundle,想过"这里面到底是什么?"
我有过。很多次。

现代 JavaScript 打包器 —— webpack、rspack、rollup、esbuild、Vite —— 都产出"单体 bundle":
单个文件里塞进成千上万个模块。它们在生产环境运行良好,但完全无法检视。

## Packscope 做什么

Packscope 接收那个单体 bundle,把它炸开成一个可浏览的项目树:

- **每个模块一个文件** —— 每个 webpack 模块都有自己的文件
- **默认即可执行** —— 解包后的树与原始 bundle 运行方式相同
- **编辑并重建** —— 修改任意模块,然后重新生成 bundle

## 困难之处

最棘手的部分是保留执行语义。生产环境的 bundle 有脆弱的循环依赖时序与 TDZ 模式。即使是 AST 忠实的代码生成器,也可能因改变语句顺序而破坏运行。

解决方案:默认原样保留压缩后的函数体切片。不做转换,就没有意外。可选的 `--beautify` 供你想要漂亮代码阅读时使用。

## 试试看

```bash
git clone https://github.com/awareride/packscope.git
cd packscope && npm install
npx packscope ./dist/app.js ./out
node out/index.js --version
```
