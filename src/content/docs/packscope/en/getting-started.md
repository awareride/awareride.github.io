---
title: Getting Started
description: Install Packscope and unpack your first bundle.
order: 2
---

## Prerequisites

- Node.js >= 14.0.0

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/awareride/packscope.git
cd packscope
npm install
```

## Your First Unpack

```bash
# Local bundle file
npx packscope ./dist/app.js ./out

# From a remote URL
npx packscope https://example.com/main-ABCD1234.js ./out
```

## Output Layout

### webpack / rspack bundles

```
out/
├── header.js
├── webpack-runtime.js
├── runtime.js
├── index.js
├── modules/<id>.js
├── manifest.json
├── rebuild.js
└── package.json
```

### ES module bundles (rollup / esbuild / Vite)

```
out/
├── <entry>.js
├── chunks/
├── sources/
├── index.html
├── manifest.json
└── package.json
```

## Running the Unpacked Tree

For webpack/rspack output:

```bash
node out/index.js --version
node out/index.js --help
```

For ES module output, serve with any static HTTP server:

```bash
cd out && python3 -m http.server 8080
# open http://localhost:8080/index.html
```
