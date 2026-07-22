---
title: "Deploying to GitHub Pages and Cloudflare Pages from one workflow"
date: 2026-07-21
description: "One GitHub Actions workflow builds once and ships to both GitHub Pages and Cloudflare Pages - and the wrangler gotchas it took to get there."
tags: ["ci-cd", "github-pages", "cloudflare"]
author: "AwareRide"
source: "https://github.com/awareride/awareride.github.io"
---

## Build once, ship twice

open.awareride.com runs on two CDNs. GitHub Pages is the free default; Cloudflare Pages is the one
I actually point the domain at for better caching and edge behavior. I did not want to maintain two
build pipelines, so the deploy workflow builds exactly once and fans out.

It is also **manual** - `on: workflow_dispatch`, nothing automatic on push. A broken `main` should
never silently take the site down; I run the deploy from the Actions tab when I am ready.

## The shape

```yaml
on:
  workflow_dispatch:

jobs:
  build:
    # npm ci -> npm run build -> upload two artifacts
    #   - pages artifact for GitHub Pages
    #   - dist-cf artifact for Cloudflare
  deploy-gh-pages:
    needs: build
    uses: actions/deploy-pages@v4
  deploy-cf-pages:
    needs: build
    # wrangler pages deploy
```

One build job produces `dist/` and uploads it twice. Two downstream jobs depend on `build` and
deploy in parallel - GitHub Pages via the official `deploy-pages` action, Cloudflare via
`wrangler pages deploy`.

## The gotchas (in order)

None of it worked the first time. Each failure was a small, fixable thing:

1. **`npm ci` needs a lock file.** The workflow aborted with "Dependencies lock file is not found".
   `package-lock.json` had to be committed - `npm ci` refuses to run without it.

2. **Wrangler needs the token as an env var, not just a secret.** Storing
   `CLOUDFLARE_API_TOKEN` in the repo was not enough; wrangler in a non-interactive runner only
   sees it when it is passed to the step's `env:`. I put both `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID` behind a `cf-deploy` environment and expose them to the deploy step.

3. **The Pages project does not exist.** The first deploy failed with
   `The Pages project "awareride" does not exist`. Cloudflare's dashboard no longer even shows a
   "Pages" creation tab - only "Create a worker" - so I create the project from wrangler instead,
   and the workflow now does it defensively:

   ```bash
   npx wrangler pages project create awareride --production-branch=main 2>/dev/null || true
   npx wrangler pages deploy dist --project-name=awareride --branch=main
   ```

4. **The preview URL was unreachable.** After `wrangler pages deploy` finally succeeded and uploaded
   the files, `https://<hash>.awareride.pages.dev` still would not load in a browser until the custom
   domain and DNS were wired up to `open.awareride.com`. The deploy succeeding and the site being
   reachable are two different things.

## The CNAME

For GitHub Pages, a `public/CNAME` containing `open.awareride.com` tells Pages which custom domain
to serve. Cloudflare Pages gets the same domain configured on its side. Both targets answer for one
hostname; whichever you hit, you get the same built `dist/`.

The whole thing is one workflow, one build, two deploys, and a manual button. That is exactly the
amount of automation I wanted - no more, no less.

---

*Part of the series on building open.awareride.com. Previous:
[Rebuilding open.awareride.com on Astro](/posts/awareride/2026-07-21-rebuilding-open-awareride-on-astro/).
Next: [two locales with per-page fallback](/posts/awareride/2026-07-22-two-locales-with-per-page-fallback/).*
