---
tagline: "将 JavaScript bundle 解包为真实可运行的模块"
description: "Packscope 将来自 webpack、rspack、rollup、esbuild 与 Vite 的单体 JavaScript bundle 解包为可浏览、可执行的模块树。"
highlights:
  - label: "许可证"
    value: "MIT"
  - label: "技术栈"
    value: "Node CLI"
  - label: "构建器"
    value: "webpack"
  - label: "构建器"
    value: "rspack"
  - label: "构建器"
    value: "rollup"
  - label: "构建器"
    value: "esbuild"
  - label: "构建器"
    value: "Vite"
install: |
  git clone https://github.com/awareride/packscope.git
  cd packscope
  npm install

  # 解包本地 bundle
  npx packscope ./dist/app.js ./out

  # 或从 URL 解包
  npx packscope https://example.com/app.js ./out
features:
  - title: "每个模块一个文件"
    body: "每个 webpack/rspack 模块写入 modules/<id>.js。ES 模块分块放入 chunks/,原始源码放入 sources/。"
    icon:
      paths:
        - "M4 5h16M4 12h16M4 19h16"
  - title: "默认即可执行"
    body: "加载器用真实的 UMD 头与 webpack 运行时重建原始 bundle 形态,使解包后的树以相同方式运行。"
    icon:
      paths:
        - "M8 5l8 7-8 7V5z"
  - title: "编辑与重建"
    body: "修改任意模块,然后运行 node out/rebuild.js bundle-edited.js 重新生成单个可运行 bundle。"
    icon:
      paths:
        - "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
  - title: "从 URL 解包"
    body: "传入 http:// 或 https:// URL。Packscope 会下载 bundle、解析分块,并将导入重写为本地路径。"
    icon:
      paths:
        - "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"
  - title: "清单与依赖图"
    body: "manifest.json 包含模块 ID、体积、依赖边、推断名称与已下载资源,便于进一步分析。"
    icon:
      paths:
        - "M12 3v6M12 15v6M3 12h6M15 12h6"
        - "M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
  - title: "可选的美化与重命名"
    body: "使用 --beautify 与 --rename 获得可读输出。默认保留原始切片以保证可执行。"
    icon:
      paths:
        - "M4 12l4 4L20 6"
sections:
  - type: hero
  - type: highlights
  - type: install
  - type: features
    data:
      layout: grid
      eyebrow: "功能特性"
      title: "Packscope 带给你什么"
  - type: faq
    data:
      - q: "Packscope 支持哪些构建器?"
        a: "webpack、rspack、rollup、esbuild 与 Vite —— 两大主流 bundle 家族,一个模块一个文件或一个分块一个文件。"
      - q: "解包后的树真的能运行吗?"
        a: "能。加载器用真实的 UMD 头与 webpack 运行时逐字重建原始 bundle 形态,使解包后的树与原始 bundle 以相同方式运行。"
      - q: "我可以编辑模块并重建吗?"
        a: "可以。修改任意模块文件,然后运行 node out/rebuild.js bundle-edited.js 重新生成单个可运行 bundle。"
      - q: "我为什么要把 bundle 解包?"
        a: "审计实际发送给用户的内容、通过编辑模块调试线上问题、学习流行库的结构,或无需原始源码即可修补第三方 bundle。"
  - type: docs-preview
  - type: cta
    data:
      primary: { label: "阅读文档", href: "/packscope/docs" }
      secondary: { label: "查看源码", href: "https://github.com/awareride/packscope" }
---

**Packscope** 是一个 Node CLI,它把单个已发布的 JavaScript bundle 解包成可浏览、可执行的模块树。
生产环境的 bundle 是不透明的 —— 一个包含数千个压缩模块的 20 MB 文件。Packscope 为你提供
**一个模块一个文件**、**重建原始 bundle 形态的加载器**,以及一个**重建脚本**,把你的修改
拼接回单个可运行的 bundle。

它支持两大主流 bundle 家族:

- **webpack 风格**(webpack、rspack)—— 每个模块一个文件,位于 `modules/<id>.js`。
- **ES 模块**(rollup、esbuild、Vite)—— 每个分块一个文件,位于 `chunks/<name>.js`。

用它来审计实际发送给用户的内容、调试仅线上出现的问题、学习流行 CLI 工具与库的结构,或在没有
原始源码的情况下修补第三方 bundle。
