---
tagline: "Unpack JavaScript bundles into real, runnable modules"
description: "Packscope unpacks mono JavaScript bundles from webpack, rspack, rollup, esbuild, and Vite into navigable, executable module trees."
highlights:
  - label: "License"
    value: "MIT"
  - label: "Stack"
    value: "Node CLI"
  - label: "Bundler"
    value: "webpack"
  - label: "Bundler"
    value: "rspack"
  - label: "Bundler"
    value: "rollup"
  - label: "Bundler"
    value: "esbuild"
  - label: "Bundler"
    value: "Vite"
install: |
  git clone https://github.com/awareride/packscope.git
  cd packscope
  npm install

  # Unpack a local bundle
  npx packscope ./dist/app.js ./out

  # Or from a URL
  npx packscope https://example.com/app.js ./out
features:
  - title: "One file per module"
    body: "Each webpack/rspack module is written to modules/<id>.js. ES-module chunks go to chunks/ and original sources to sources/."
    icon:
      paths:
        - "M4 5h16M4 12h16M4 19h16"
  - title: "Executable by default"
    body: "The loader reconstructs the original bundle shape using the real UMD header and webpack runtime, so the unpacked tree runs identically."
    icon:
      paths:
        - "M8 5l8 7-8 7V5z"
  - title: "Edit & rebuild"
    body: "Modify any module, then run node out/rebuild.js bundle-edited.js to regenerate a single runnable bundle."
    icon:
      paths:
        - "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
  - title: "Unpack from URLs"
    body: "Pass an http:// or https:// URL. Packscope downloads the bundle, resolves chunks, and rewrites imports to local paths."
    icon:
      paths:
        - "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"
  - title: "Manifest & dependency graph"
    body: "manifest.json contains IDs, sizes, dependency edges, inferred names, and downloaded assets for further analysis."
    icon:
      paths:
        - "M12 3v6M12 15v6M3 12h6M15 12h6"
        - "M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
  - title: "Optional beautify & rename"
    body: "Use --beautify and --rename for readable output. Defaults keep original slices for guaranteed execution."
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
      eyebrow: "Features"
      title: "What Packscope gives you"
  - type: faq
    data:
      - q: "Which bundlers does Packscope support?"
        a: "webpack, rspack, rollup, esbuild, and Vite — the two major bundle families, one file per module or one file per chunk."
      - q: "Does the unpacked tree actually run?"
        a: "Yes. The loader reconstructs the original bundle shape using the real UMD header and webpack runtime verbatim, so the unpacked tree runs identically to the original bundle."
      - q: "Can I edit modules and rebuild?"
        a: "Modify any module file, then run node out/rebuild.js bundle-edited.js to regenerate a single runnable bundle."
      - q: "Why would I want to unpack a bundle at all?"
        a: "To audit what actually ships to users, debug production-only issues by editing modules, learn how popular libraries are structured, or patch third-party bundles without the original source."
  - type: docs-preview
  - type: cta
    data:
      primary: { label: "Read the Docs", href: "/packscope/docs" }
      secondary: { label: "View Source", href: "https://github.com/awareride/packscope" }
---

**Packscope** is a Node CLI that unpacks a single ("mono") JavaScript bundle into a navigable,
executable project tree. Production bundles are opaque — a single 20 MB file with thousands of
minified modules. Packscope gives you **one file per module**, a **loader that reconstructs the
original bundle shape**, and a **rebuild script** that stitches your edits back into a single
runnable bundle.

It handles the two major bundle families:

- **webpack-style** (webpack, rspack) — one file per module in `modules/<id>.js`.
- **ES module** (rollup, esbuild, Vite) — one file per chunk in `chunks/<name>.js`.

Use it to audit what's actually shipped to users, debug production-only issues, learn how popular
CLI tools and libraries are structured, or patch third-party bundles without access to the original
source.
