# Technical Debt Register

Last updated: 2026-11-22 (Next.js 16.4.6 security update deployed to production). Owner review required before any item is scheduled.

These issues are **recorded, not fixed**. Stages 2–3 deliberately left them in place so the public site's behaviour didn't change. Evidence for issues 1–10 is in [tests/baseline/FUNCTIONALITY.md](../tests/baseline/FUNCTIONALITY.md) and `tests/baseline/snapshots/`.

**Severity:** Critical (exploitable or business-critical now) · High (real user, security or data risk) · Medium (degrades quality, SEO or robustness) · Low (cosmetic or housekeeping).

**Priority:**
- **P0:** fix in a dedicated change as soon as approved, independent of the admin roadmap.
- **P1:** must be fixed **before production database integration** (roadmap stage 7, the enquiries module).
- **P2:** fix in a planned repair phase.
- **P3:** opportunistic.

## Summary

| # | Issue | Severity | Priority | Area |
| --- | --- | --- | --- | --- |
| 11 | `next@16.3.0` has published critical security advisories | **Critical** | **Resolved**: deployed 2026-11-22 (PR #1, `3b873c6`) | Dependencies |
| 8 | Contact rate limit is per-instance, in memory, and trusts `x-forwarded-for` | High | **P1** | Contact form |
| 7 | Server doesn't validate the enquiry type | Medium | **P1** | Contact form |
| 1 | Tawk.to chat blocked by the CSP on every page | High | P2 | Integrations |
| 2 | Google Analytics never renders (unreachable code) | High | P2 | Integrations |
| 3 | No canonical URL or og:image on 14 pages | Medium | P2 | SEO |
| 4 | Overlong meta descriptions on 5 project pages | Medium | P2 | SEO |
| 5 | Unknown project/insight slugs: 404 uses the default title and no server-rendered heading | Low | P3 | SEO / routing |
| 9 | Sitemap `lastmod` changes on every build for static and project pages | Low | P2 | SEO |
| 6 | `/favicon.ico` returns 404 | Low | P3 | Assets |
| 10 | Large and duplicate images in `public/images` | Medium | P2 | Performance |
| 12 | Remaining dependency advisories, development lint tooling only (typescript-eslint, minimatch, brace-expansion, js-yaml, zod) | Medium | P2 | Dependencies |
| 13 | 404 pages import Next's built-in 404 body from an internal path | Low | P3 | Framework coupling |
| 14 | Windows Application Control blocks some native npm binaries on the dev machine | Low | P3 | Dev environment |
| 15 | Small differences between Vercel and the local `next start` (404 title order, `/index`, charset casing) | Low | P3 | Hosting |
| 16 | `prisma` CLI pulls in `effect` 3.20.0 (GHSA-7589-6fvf-x4pw, ReDoS) | Medium | P2 | Dependencies |
| 17 | Neon on the Free plan: no protected branches, 6-hour restore window | Medium | P2 (before production data) | Database |

## Details and recommended corrections

### 11. `next@16.3.0` security advisories (Critical · P0) *(found in Stage 3)*

- **Evidence:** `npm audit --omit=dev` reports 19 advisories for `next` 16.0.0–16.4.4. They include remote code execution in the image optimisation API, `next/og`, and `use cache`; SSRF in image optimisation; and cache poisoning. The production site runs 16.3.0, so this was **already present on `main`** before the admin work.
- **Impact:** Several advisories apply to features this site uses (`next/image` optimisation on every page, `ImageResponse` for icons).
- **Correction:** upgrade `next` and `eslint-config-next` to **16.4.6 or later** (a non-breaking minor upgrade per npm). Run the full regression suite (`npm run build`, `npm run baseline:check`, `npm run test:interactive`, `npm test`) and deploy through the normal preview → production flow. This should be its own small, separately approved change and shouldn't wait for the admin roadmap.
- **Status (2026-11-22): resolved and deployed.** The security-only branch `security/next-16.4.6-production` (based on `main`) was merged in PR #1 (`3b873c6`). Vercel's production deployment of that commit is Ready, and the live client runtime reports `version:"16.4.6"`. That branch also updated `source-map-js` 1.2.1 → 1.2.4 (GHSA-68fv-2mgg-jv7q), a version this branch already had. `main` was then merged back into `feature/admin-dashboard`. The original change was made on branch `security/next-16.4.6`. `next` and `eslint-config-next` are now 16.4.6, and `sharp` 0.35.3 → 0.35.5 came with them. `react` and `react-dom` stay at 19.2.8 because they aren't affected.
  - **Audit:** `npm audit --omit=dev` reports 0 vulnerabilities, and the GitHub advisory database lists no advisories for `next@16.4.6`.
  - **React Server Components:** the RSC advisory GHSA-xqc2-xf4c-x3h3 (CVE-2026-126187) covers `react-server-dom-*`, which this project doesn't install. Next.js uses its own bundled copy, and it patched that copy for the same typed-array issue in 16.4.1 (GHSA-673q-mjm6-r5xr, commit `a4cea6a`).
  - **Regression suite:** passes with no snapshot changes.
  - **Live check after deployment:** all 24 pages match the baseline snapshots on cynthiamueni.com: SEO metadata, JSON-LD, content and desktop and mobile layout. The sitemap, images, icons, redirects, mobile menu and contact form rendering also match. No new console errors. For the small hosting differences, see item 15.

### 8. Contact-form rate limiting (High · P1)

- **Evidence:** `app/api/contact/route.ts` keeps a `Map` in server memory (5 requests per 10 minutes per IP). On Vercel each serverless instance has its own memory and loses it on a cold start, so the limit doesn't hold across instances. The client IP comes from the first `x-forwarded-for` value.
- **Impact:** Spam or abuse can bypass the limit. Once enquiries are written to the database, each accepted request also creates a row, so this becomes a storage and abuse risk.
- **Correction (before production DB integration):**
  - Use a shared limiter: either the planned `RateLimitBucket` table in Postgres or a managed KV store.
  - Key it on a salted hash of the client IP as Vercel reports it.
  - Keep the current limits and response codes (`429 rate_limited`).
  - Add duplicate-submission detection (the planned `dedupeHash`).
  - Add unit tests and keep the interactive tests passing.

### 7. Server-side enquiry-type validation (Medium · P1)

- **Evidence:** The browser form requires an enquiry type, but the API accepts a missing or unknown value and labels it "General" (`functionality.json → contactApi.emptyPayload`).
- **Impact:** Direct API calls can store meaningless service values, and the planned `requestedService` column would receive unvalidated data.
- **Correction (before production DB integration):**
  - Move validation to one shared schema (zod, as planned) that both the route and future server actions use.
  - Accept only the known keys (`osh`, `ehs-systems`, `digital-communication`, `professional-opportunity`, `collaboration`, `other`).
  - Return the existing `400 validation` shape with a field message that matches the browser's ("Please select an enquiry type.").
  - Update the baseline snapshot intentionally and document the behaviour change.

### 1. Tawk.to blocked by the CSP (High · P2)

- **Evidence:** The browser logs a CSP violation for `https://embed.tawk.to/...` on all 24 pages. The script now lives in `components/layout/SiteChrome.tsx`; it moved unchanged from the root layout.
- **Correction:** Decide whether live chat is wanted. If it is, add the documented Tawk.to origins to `script-src`, `connect-src` (including `wss:`), `frame-src`, `img-src` and `font-src` in `next.config.ts` (a production change that needs approval), then verify in a preview deployment. If not, remove the script.

### 2. Google Analytics never renders (High · P2)

- **Evidence:** `<GoogleAnalytics gaId="G-T5KTXNBKG5" />` is inside a second `return` block after the first `return` in `app/layout.tsx`, so it never runs, and the ID doesn't appear in the served HTML. This was left untouched in Stage 3 as instructed.
- **Correction:**
  - Render `<GoogleAnalytics>` inside the root layout's `<body>` (or in `SiteChrome` if analytics should stay off `/admin`), and delete the dead block.
  - Confirm the CSP allows the GA origins (it already lists them).
  - Check consent and privacy requirements, then verify in a preview deployment with GA's realtime view.

### 3. Missing canonical URLs and og:image (Medium · P2)

- **Pages affected:** `/`, `/about`, `/contact`, `/expertise`, `/services`, `/projects` and all 8 `/projects/*` pages.
- **Correction:** Add `alternates.canonical` and an Open Graph image to these pages, using the insights pages as the model. For projects, use the project image or a default social image. Update the baseline intentionally.

### 4. Overlong project meta descriptions (Medium · P2)

- **Evidence:** Five project pages reuse the full project description (397–490 characters).
- **Correction:** Add an optional `seoDescription` per project (already in the planned `Project` model), aiming for about 150–160 characters, with a trimmed fallback.

### 5. Dynamic 404 metadata (Low · P3)

- **Evidence:** Unknown `/projects/*` and `/insights/*` slugs return 404 with `noindex`, but the server HTML carries the site's default title and the 404 body is only rendered after hydration. Unmatched URLs get the full 404 in the server HTML. This behaviour is unchanged by Stage 3 (verified).
- **Correction:** Optional. Low SEO impact because these responses are already `noindex`.

### 9. Sitemap `lastmod` churn (Low · P2)

- **Evidence:** `app/sitemap.ts` uses `new Date()` for static and project entries.
- **Correction:** Use real modification dates. Once content is in the database, use each record's `updatedAt`. Until then, omit `lastModified` for those entries.

### 6. `/favicon.ico` 404 (Low · P3)

- **Correction:** Add `app/favicon.ico` (or a redirect to `/icon`). The icons linked in `<head>` already work.

### 10. Image weight and duplicates (Medium · P2)

- **Evidence:**
  - PNGs of 2.4 MB, 1.8 MB and 1.5 MB in `public/images/insights/`.
  - `*.webp.webp` duplicates in `public/images/home/`.
  - Identical files saved under several names.
- **Correction:** Convert the large PNGs to WebP or AVIF at an appropriate resolution and update their references. Remove duplicates only after confirming they aren't referenced (the baseline's image check lists every referenced path).

### 12. Other pre-existing dependency advisories (Medium · P2)

- **Evidence:** Present on `main` before Stage 3:
  - `sharp` (via next): high.
  - `@typescript-eslint/*`, `minimatch`: moderate.
  - `brace-expansion`, `js-yaml`, `zod` (via eslint-config-next): high.

  All except `sharp` are development or lint tooling. Stage 3 added no new advisories; Vitest was installed at 4.1.12 specifically to avoid the advisories in 3.x.
- **Correction:** Most resolve with the `next`/`eslint-config-next` upgrade in item 11 and `npm audit fix` (non-breaking). Re-audit afterwards.
- **Status after the item 11 upgrade:** the `sharp` advisories are fixed (0.35.5). Ten advisories remain (3 high, 7 moderate), all development or lint tooling and none in the production dependency tree (`npm audit --omit=dev`: 0):
  - `typescript-eslint` and `@typescript-eslint/*` 8.66.0: moderate.
  - `minimatch`: moderate.
  - `brace-expansion`, `js-yaml`, `zod` (via `eslint-config-next`): high.

  They are ReDoS and resource-exhaustion issues reachable only when lint runs over trusted repository files. `npm audit fix` resolves them without `--force`, but they were left out of the security change to keep it limited to the required production fix. Schedule them as a separate tooling change.

### 13. Internal import for the 404 body (Low · P3) *(introduced in Stage 3, deliberately)*

- **Evidence:** `app/not-found.tsx` and `app/(site)/not-found.tsx` import `next/dist/client/components/builtin/not-found`, so the 404 pages stay identical after the `(site)` route-group move.
- **Risk:** A future Next.js upgrade could move this file. The build would then fail with a clear error; nothing would fail silently.
- **Correction:** When convenient, replace it with a site-designed 404 page (a deliberate visual change that needs design approval), or re-check the path during each Next.js upgrade.
- **Checked for 16.4.6:** `builtin/not-found.js` and `.d.ts`, plus the `error-fallback` component they render, are byte-identical to 16.3.0. The build and the baseline's 404 checks pass, so no replacement was needed.

### 15. Vercel vs local `next start` differences (Low · P3) *(found during the production check, 2026-11-22)*

- **Evidence** (live site compared with the baseline, which was captured with `next start`):
  - **Unmatched URLs:** both servers return 404 with `noindex` and render the same 404 page. Next.js emits two `<title>` elements in that HTML, its 404 title and the root layout's default title. Locally the 404 title comes first. Vercel's `/404` output puts the default site title first, so a tool that reads the first title sees the site title. It isn't known whether Vercel ordered them the same way before the 16.4.6 upgrade, because the previous production deployment couldn't be inspected.
  - **`/index`:** Vercel serves the home page with 200. Locally it returns 404.
  - **Content type:** `robots.txt` and the Google verification file differ only in the `charset` casing or parameter in `Content-Type`.
- **Impact:** negligible for SEO. The 404 responses are `noindex`, and `/index` isn't linked anywhere.
- **Correction:** optional. A site-designed 404 page with its own `metadata` (see item 13) would give a single title. The baseline is a local regression check and isn't expected to reproduce platform routing.

### 16. `effect` advisory via the Prisma CLI (Medium · P2) *(Stage 4)*

- **Evidence:** `prisma@7.10.1` → `@prisma/config@7.10.1` pins `effect@3.20.0` exactly. GHSA-7589-6fvf-x4pw is a ReDoS in `Schema.TemplateLiteral`. `npm audit --omit=dev` lists it as 3 high-severity entries because `@prisma/client` declares `prisma` as a peer dependency.
- **Impact:** the code only runs in the Prisma CLI and config loader, against the repository's own trusted config. The build contains no Prisma or `effect` code in `.next/static` or `.next/server`, and the runtime client doesn't depend on `@prisma/config`.
- **Correction:** upgrade to the first stable Prisma 7.x release that ships a fixed `effect`. Don't use `npm audit fix --force`: it downgrades Prisma to 6.12. Re-check whenever Prisma is upgraded.

### 17. Neon Free plan limits (Medium · P2, before production holds real data) *(Stage 4)*

- **Evidence:** project `red-forest-05302661` is on the Free plan. Protected branches aren't available, and the restore window is 6 hours.
- **Mitigation in place:** production is protected by:
  - separate per-branch passwords (the development password is rejected by production);
  - the `DATABASE_ENVIRONMENT` guard in the app and the CLI;
  - the approval rule for migrations.
- **Correction:** before enquiries are stored in production, decide whether to upgrade for protected branches and a longer restore window. Take a named snapshot before each production migration.

### 14. Application Control and native binaries (Low · P3) *(development machine only)*

- **Evidence:** Windows Application Control blocked:
  - the MSYS2 `git` libcurl DLL, so pushes use `C:\Program Files\Git\cmd\git.exe`;
  - Rollup's native `rollup.win32-x64-msvc.node`, after initially allowing it.
- **Mitigation in place:** `package.json` overrides `rollup` with the official `@rollup/wasm-node` build, and `vite` is pinned to 7 (Vitest only; Next.js doesn't use Rollup). Production isn't affected.
- **Correction:** Remove the override if the policy is relaxed, or keep it. It's harmless.
