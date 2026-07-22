---
title: "Why I Built Packscope"
date: 2025-07-20
description: "The story behind Packscope — a tool to unpack JavaScript bundles into runnable module trees."
tags: ["packscope", "javascript", "tooling"]
author: "AwareRide"
source: "https://github.com/awareride/packscope"
---

## The Problem

Have you ever stared at a minified 21 MB webpack bundle and wondered "what's actually in here?"
I have. Many times.

Modern JavaScript bundlers — webpack, rspack, rollup, esbuild, Vite — all produce "mono bundles":
single files containing thousands of modules smashed together. They work great in production,
but they're completely opaque to inspection.

## What Packscope Does

Packscope takes that single bundle and explodes it into a navigable project tree:

- **One file per module** — every webpack module gets its own file
- **Executable by default** — the unpacked tree runs identically to the original
- **Edit and rebuild** — modify any module, then regenerate the bundle

## The Hard Part

The trickiest part was preserving execution semantics. Production bundles have fragile
circular-dependency timings and TDZ patterns. Even AST-faithful code generators can shift
statement order enough to break things.

The solution: keep the original minified body slices verbatim by default. No transformation,
no surprises. Optional `--beautify` for when you want pretty code for reading.

## Try It

```bash
git clone https://github.com/awareride/packscope.git
cd packscope && npm install
npx packscope ./dist/app.js ./out
node out/index.js --version
```
