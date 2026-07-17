---
title: Overview
description: Inspect, analyze, and debug JavaScript bundles from webpack, rspack, rollup, esbuild, and Vite.
order: 1
---

**Packscope** is a Node CLI that unpacks a single ("mono") JavaScript bundle into:

- **One file per module** (`modules/<id>.js`) for webpack/rspack, or **one file per chunk** (`chunks/<name>.js`) for ES-module bundles.
- **A loader** (`runtime.js` + `index.js`) that reconstructs the original bundle shape, so the unpacked tree **runs identically** to the original.
- **A manifest** (`manifest.json`) with module/chunk IDs, sizes, dependency edges, and inferred names.
- **A rebuild script** (`rebuild.js`) that re-concatenates edited module files back into a single runnable bundle.

## Quick Start

```bash
# Install
npm install

# Unpack a local bundle
npx packscope ./dist/app.js ./out

# Or from a URL
npx packscope https://example.com/app.js ./out

# Run the unpacked tree
node out/index.js --version
```

## Supported Bundlers

- webpack
- rspack
- rollup
- esbuild
- Vite
