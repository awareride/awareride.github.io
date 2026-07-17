---
title: CLI Reference
description: Complete reference for the Packscope CLI options.
order: 3
---

## Syntax

```bash
npx packscope <bundle.js|URL> <outDir> [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--beautify` | Pretty-print the output. For webpack/rspack: regenerates module bodies via escodegen. For ES module bundles: pretty-prints chunks with js-beautify. Best-effort. |
| `--decompose` | For ES module bundles, extract top-level classes, services, functions, and CommonJS wrappers into a `decomposed/` tree. Read-only, not executable. |
| `--rename` | Rename the 3 wrapper params to `module`/`exports`/`require`. Only applies with `--beautify` for webpack/rspack. |
| `--fetch-assets` | Auto-download referenced source maps and asset URLs (default ON for URL inputs, OFF for local files). |
| `--no-fetch-assets` | Skip downloading referenced assets. |
| `--entry <N>` | Force entry module ID (auto-detected otherwise). |
| `--devtools` | Mirror original URL paths into `<outDir>` for Chrome DevTools Local Overrides. |

## Examples

```bash
# Basic local unpack
npx packscope ./examples/node_large_example.js ./out

# From URL with beautify
npx packscope https://example.com/app.js ./out --beautify

# ES module bundle with decomposition
npx packscope https://example.com/main-ABCD1234.js ./out --decompose

# DevTools overrides mode
npx packscope --devtools https://example.com/assets/index-CLHtNMqj.js ./out
```
