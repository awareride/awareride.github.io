---
title: DevTools Overrides
description: Use Chrome DevTools Local Overrides for the fastest edit-and-reload loop.
order: 4
---

For the fastest edit-and-reload loop inside a real browser, use Chrome DevTools
**Local Overrides** together with the `--devtools` flag.

## Setup

```bash
npx packscope --devtools https://example.com/assets/index-CLHtNMqj.js ./out
```

With `--devtools`, the unpacked files land at the same paths as the original URLs:

```
out/example.com/assets/index-CLHtNMqj.js   # entry
out/example.com/assets/<chunk>.js          # each imported chunk
```

## Chrome Configuration

1. Open the page you want to debug (e.g. `https://example.com/chatPc`).
2. Open DevTools (F12) → **Sources** panel → left sidebar → **Overrides**.
3. Click **+ Select folder for overrides** and choose `./out` — the `out/` directory itself, **not** `out/example.com/`.
4. Click **Allow**, then enable **Enable Local Overrides**.
5. Reload the page.

## Edit and Reload

- **ES module bundles** (Vite / rollup / esbuild): edit any file under `out/example.com/assets/` and reload — the change is live, no rebuild needed.
- **webpack / rspack bundles**: edit `out/modules/<id>.js`, then regenerate the single bundle:

```bash
node out/rebuild.js
```

## Why This Works

- **No local server** — Chrome serves the overridden files straight from disk.
- **Single origin** — file paths match original URLs, so no mixed-content, CORS, or SSR hydration mismatch.
- **No parser-insertion race** — the swap happens at the network layer, so it works even for parser-inserted `<script type="module">` tags.
