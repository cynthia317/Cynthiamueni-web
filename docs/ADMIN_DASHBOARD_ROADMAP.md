# Admin Dashboard: Roadmap

Status: **Proposal, not yet implemented**. Companion to [ADMIN_DASHBOARD_ARCHITECTURE.md](./ADMIN_DASHBOARD_ARCHITECTURE.md) and [ADMIN_DATABASE_PLAN.md](./ADMIN_DATABASE_PLAN.md).

Each step ships as its own reviewable commit or PR. **Every step must leave the public site rendering the same as before** (checked with a before/after visual and HTML comparison of all public routes).

---

## Agreed delivery sequence (confirmed 2026-11-21)

All work happens on the `feature/admin-dashboard` branch, never directly on `main`. Hosting is Vercel. Roles, enquiry statuses and other decisions are recorded in [Architecture §2.11](./ADMIN_DASHBOARD_ARCHITECTURE.md#211-confirmed-decisions-2026-11-21).

| Stage | Work | Detailed steps below | Status |
| --- | --- | --- | --- |
| 1 | Feature branch and clean Git checkpoint; planning docs updated with the confirmed decisions | — | **Done** (2026-11-21) |
| 2 | Record a baseline of the public website (routes, content, SEO metadata, structured data, key UI elements) | 0.1 | **Done** (2026-11-21): `tests/baseline/` |
| 3 | Content abstraction (`lib/content`), then the `(site)` folder restructuring, each verified against the baseline | 0.2–0.4 | **Done** (2026-11-22): see notes below |
| 4 | **Verify the existing Neon setup** (project, branches, variable names in Vercel, existing tables) before any database change | 1.1 | **In progress.** The repository audit and planning review are done (Database Plan §7–§9). Neon and Vercel access isn't available from the development environment, so the owner must complete the dashboard checklist (§7.1). S1–S14 and the Architecture §2.12 safeguards were approved in principle on 2026-11-22. **Pending until the real database environment is verified.** |
| 5 | Secure authentication and OWNER/ADMIN/EDITOR role-based access, using an external provider with MFA and roles keyed by the provider's subject ID (Architecture §2.12 item 1) | 1.2–1.4 (enquiry/auth tables only), 2.x | Not started |
| 6 | Admin layout | 3 | Not started |
| 7 | Enquiries module. **Gate:** debt #7 and #8 (validation, trusted-IP rate limiting) must be done before public submissions are persisted (Architecture §2.12 item 3). | 4 | Not started |
| 8 | Integration testing and deployment preparation | 9 (enquiries scope) | Not started |

Content modules (services, projects, insights, settings: steps 5–8 below) follow after stage 8.

**Stage 3 notes (as implemented):**
- `lib/content` covers projects, featured-project slots, insights, services and FAQs (Architecture §2.6). **Site settings** (`lib/constants.ts`, used by 21 files including client components) are deliberately **not** abstracted yet. That moves with the Settings step (step 8), so Footer, ContactForm and the WhatsApp button still import constants directly.
- The `server-only` guard is deferred to step 1.2, because the static data is safe on the client and adding it now would add a dependency with no effect.
- Regression tooling now consists of `npm run baseline:check` (29 snapshot files), `npm run test:interactive` (21 browser checks with mocked contact submissions) and `npm test` (Vitest unit tests for `lib/content`). All of them must pass at every later stage.
- Known issues and their priorities live in [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md). The contact-form rate limit and server-side validation (items 8 and 7) must be fixed before production database integration. The `next` security upgrade (item 11) is P0 and independent of this roadmap.

**Mandatory review stops.** Work pauses for the owner's review and explicit approval:
- before generating or applying any **database migration** (migrations are created with `--create-only` against the development branch and reviewed as SQL first),
- before **deploying authentication** to any shared environment,
- before **any production change** (production migrations, Vercel environment variables, `next.config.ts` headers, DNS or Brevo configuration).

Stage 1 doesn't make Neon, authentication or any admin feature available. Those remain unimplemented until their stage is completed and reviewed.

---

## MVP scope

1. Dashboard overview
2. Projects management
3. Insights (blog) management
4. Services management
5. Contact enquiries
6. Settings (site settings + account)

Out of the MVP (phase 2): testimonials, media library and uploads, SEO overrides, FAQs, audit-log viewer, 2FA, revisions, scheduled publishing, redirects.

---

## Implementation sequence

### Step 0: Pre-work (no new dependencies, no behaviour change)

| # | Task | Done when |
| --- | --- | --- |
| 0.1 | Capture a **baseline**: `next build` output, HTML snapshots and screenshots of every public route (light + dark) | Baseline artefacts stored outside `public/` |
| 0.2 | **Content repository layer over the static data**: add `lib/content/{projects,insights,services,faqs,settings}.ts` returning the existing types from `lib/data/*` / `lib/constants.ts` | Functions exist and are unit-checked against the arrays |
| 0.3 | **Switch every consumer** to the repository: pages and `sitemap.ts` `await` the functions. `InsightsGrid`, `InsightsFaq`, `Footer`, `ContactForm`, and the WhatsApp button get data via props from a server parent. Module-level constants (`FEATURED_INSIGHT`, `SAFETY_SYSTEM`, …) move inside async components. | HTML diff against the baseline is empty. A side benefit is that article bodies no longer ship to the browser. |
| 0.4 | **Route-group split**: move public pages into `app/(site)/` and move Header, Footer, WhatsApp, and Tawk into `app/(site)/layout.tsx`. The root layout keeps `<html>`, `<body>`, fonts, and the theme. | Same URLs, HTML diff against the baseline is empty |

> Step 0 is where most of the regression risk sits, and it can be done and verified before any infrastructure decision is final.

### Step 1: Database infrastructure

| # | Task |
| --- | --- |
| 1.1 | **Verify the existing Neon configuration** (project, region, branches, variable names set in Vercel, any existing tables) without exposing credentials. Then set up separate production, preview (schema-only/sanitized) and development branches. The owner places the development connection string in `.env.local`. Document the variable names (placeholders only) in `.env.example`. Never create a replacement production database or overwrite existing tables. |
| 1.2 | Install `prisma`, the Prisma client plus driver adapter, `zod`, and `server-only`. Add `lib/db.ts`. |
| 1.3 | Write `prisma/schema.prisma` from the DB plan, plus the initial migration and the raw-SQL constraints |
| 1.4 | Add `lib/validation/*` zod schemas, including the `InsightContentBlock` discriminated union |
| 1.5 | Write `prisma/seed.ts` (idempotent, imports `lib/data/*`, validates with zod) and run it against dev |
| 1.6 | Write a parity script: render all public routes from the static source vs. the DB source and diff them |

### Step 2: Authentication

| # | Task |
| --- | --- |
| 2.1 | Select a maintained Next.js-compatible auth integration and OIDC/OAuth provider with MFA support; confirm the provider's supported session and Prisma-adapter schema. |
| 2.2 | Provision/allowlist the owner account at the identity provider. No public sign-up route and no application-owned password/reset implementation. |
| 2.3 | Add `/admin/login`, the provider callback/sign-out flow and a server-side `requireAdmin()` authorization helper. |
| 2.4 | `proxy.ts` (matcher `/admin/:path*`, excluding `/admin/login`): optimistic redirect only; never treat it as the authorization check |
| 2.5 | `app/admin/(dashboard)/layout.tsx` calls `requireAdmin()`. Add a shared `requireAdmin()` to every page/action/handler. |
| 2.6 | noindex metadata on `/admin`, `disallow: /admin` in `robots.ts`, and an `X-Robots-Tag` + `no-store` header for `/admin/*` (*config change, needs approval*) |
| 2.7 | `AuditLog` writes for login success and failure |

### Step 3: Admin shell and overview (MVP item 1)

- Sidebar nav, top bar (user, sign out), a responsive layout, and light/dark modes reusing the Tailwind tokens and lucide icons. No new UI library.
- Shared admin components: `DataTable`, `FormField`, `StatusBadge`, `ConfirmDialog`, `Toast`, `EmptyState`, `TagInput`, `SortableList`.
- `/admin` overview: counts (published/draft) per content type, new enquiries (with a failed-email badge), the last 10 audit entries, and quick actions.

### Step 4: Enquiries (MVP item 5), done first among content because it's additive

- Extend `/api/contact` to insert the `Enquiry` row before Brevo, per the behaviour matrix in the DB plan, with duplicate-submission detection and PII-free logging. Replace the in-memory limiter with the DB limiter. The form's appearance, the Brevo credentials, the sender and the notification template stay unchanged.
- `/admin/enquiries` (OWNER and ADMIN only):
  - Overview cards for new, in-progress and resolved enquiries.
  - Search and status filters, and a list with submission dates.
  - A details panel with status updates (`NEW`, `IN_PROGRESS`, `RESOLVED`, `ARCHIVED`), private admin notes, and "Mark resolved" and "Archive" actions.
  - A `mailto:` reply link that opens the existing hello@cynthiamueni.com Gmail setup. The dashboard doesn't send or sync replies.
  - Notification status, with a retry for failed notifications.
  - Empty, loading and error states. OWNER-only permanent delete.
- EDITOR accounts get a server-side denial (not just a hidden link).
- Vitest tests cover validation, duplicate detection, the persistence/notification outcomes, and role checks.
- **No public read path changes**, so there's no risk to the site.

### Step 5: Services (MVP item 4), the first read cutover

- Admin list, reorder, edit, create, and delete (icon chosen from the `lib/icons.ts` whitelist).
- **Cutover:** `lib/content/services.ts` reads from Prisma. Actions call `revalidatePath("/services")`.
- Run the parity script. It's the smallest model, so it proves the whole pipeline (build-time DB read, ISR revalidation, deploy env vars) at low risk.

### Step 6: Projects (MVP item 2)

- List grouped by tier, publish toggle, drag reorder, and filters.
- Edit form: core fields, a workflow-steps list editor, a capabilities editor (label + "planned" toggle), a tools tag input, the image path (pick from existing `/public/images/projects/*` until the media library exists), visual mode, related insights (multi-select), related FAQ slugs, and SEO fields.
- Guards: **protected projects** can't be deleted and their slug is locked. At most one flagship. Slugs are locked after first publish until the redirect strategy (redirect table + 301s) is implemented.
- **Configurable featured projects**: `FeaturedPlacement` slots replace the hard-coded IDs in `ProjectsSection`, `FeaturedExpertiseProjects` and `SafetyDigitalBridge`. They're seeded to match today's selection exactly, and an empty slot renders nothing instead of crashing.
- **Secure image uploading** ships with this module: images only (jpeg/png/webp/avif), size-limited, type sniffed on the server, no SVG, random filenames, upload authorization only after the server-side role check. Any CSP or image-config change it needs goes through the production-change review.
- **Cutover:** repository → Prisma. Revalidate `/projects`, `/projects/[slug]`, `/`, `/expertise`, and `/sitemap.xml`.
- While here, add the missing canonical/OG metadata to project detail pages (metadata only, no visual change).

### Step 7: Insights / blog (MVP item 3)

- List with status, category, featured star, and date.
- **Block editor**: one form row per `InsightContentBlock` type (paragraph, heading with auto-id, list, quote, linkParagraph, image, references, toc auto-generated from headings). Add, reorder, and delete blocks. Live preview reuses the real `InsightArticle` component.
- SEO panel: `seoTitle`, excerpt (meta description with a length counter), keywords, OG image, and a SERP preview.
- Status: Draft / Published. A "Set as featured" action enforces a single featured post. `readTime` is auto-calculated with an override.
- Fix the JSON-LD `<` escaping **before** this cutover (Architecture §1.11 #3).
- **Cutover:** repository → Prisma. Revalidate `/insights`, `/insights/[slug]`, `/`, and `/sitemap.xml`.

### Step 8: Settings (MVP item 6)

- `/admin/settings`: the `SiteSettings` singleton form (public email, phone, location, business hours editor, socials, WhatsApp number and message, HarunLucas Dev URL, default title/description/keywords).
- `/admin/settings/account`: account/session status and application sign-out; password and MFA changes are handled by the identity provider.
- **Cutover:** `lib/content/settings.ts` → Prisma. The root/site layout uses `generateMetadata`. Revalidate the layout (`revalidatePath("/", "layout")`).
- The `CONTACT_FROM_EMAIL` env fallback keeps working (the Brevo sender is never editable from the UI).

### Step 9: MVP hardening and release

- Security review of the auth, DAL, and actions (run `/security-review`), and confirm every action calls `requireAdmin()` (grep check plus a lint rule if practical).
- Check the production env vars, run migrations on the production branch, seed production, run the parity script against a production build, then deploy.
- Write a short `docs/ADMIN_OPERATIONS.md`: creating admins, rotating passwords, restoring a backup, running migrations.

---

## Phase 2 (after the MVP is stable)

| Order | Feature | Notes |
| --- | --- | --- |
| 1 | **Additional MFA** | Require identity-provider MFA for the MVP where supported; add app-managed TOTP only if the selected provider cannot meet the requirement and a separate review approves it. |
| 2 | **Media library** | Builds on the uploads introduced with Projects (step 6): a browsable `Media` table with alt text and usage. Existing `/public/images` stays in place. |
| 3 | **FAQs** | `Faq` model. Project `relatedFaqSlugs` → relation. Feeds the FAQPage JSON-LD. |
| 4 | **Testimonials** | CRUD + consent. **Public display needs a design decision** (there's no testimonial section today, and this brief excludes redesign). |
| 5 | **SEO overrides + redirects** | Per-route meta overrides with code defaults as the fallback. A redirect table unlocks editable slugs. |
| 6 | **Audit log viewer** | `/admin/activity` |
| 7 | **Revisions / scheduled publishing** | `InsightRevision` snapshots. Use a scheduler supported by the confirmed host for publishing and retention cleanup. |
| 8 | **Optional:** `cacheComponents` + `"use cache"`/`cacheTag`/`updateTag` | Only if the revalidation needs outgrow `revalidatePath` |

---

## Risks and compatibility concerns

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **Hard-coded project IDs** with `!` in `ProjectsSection`, plus ID lookups in `FeaturedExpertiseProjects` and `SafetyDigitalBridge` | Deleting or renaming one breaks the build or a page | Interim `isProtected` flag (no delete, slug locked), then the configurable `FeaturedPlacement` system in step 6 |
| **Slug changes break cross-references** (related IDs, FAQ `relatedHref`, `linkHref` inside articles, external backlinks, Search Console) | 404s, SEO loss | Published slugs are preserved and locked. The redirect strategy must exist before any slug change is allowed. Validate internal links in the article editor. |
| **Existing Neon configuration unknown** | Accidentally overwriting data or duplicating databases | Stage 4 verification before any schema work. Additive, reviewed migrations only. Never create a replacement production database. |
| **Client components importing data** (`InsightsGrid`, `InsightsFaq`, `Footer`, `ContactForm`) | A DB client can't run in the browser | Step 0.3 moves them to props first, while still on static data |
| **Build now depends on the DB** (static generation queries Postgres) | A DB outage or missing env var fails deploys | Pooled URL, env vars set for Preview and Production, clear build error. Already-deployed pages keep serving. |
| **Preview deployments writing to production data** | Data corruption | Separate DB branch per environment. The production URL is only in Production env scope. |
| **Route-group move** (Step 0.4) | Subtle layout or metadata regressions | Pure file move in one commit, HTML diff against the baseline |
| **In-memory rate limiting doesn't work on serverless** (existing) | Contact and login abuse | DB-backed limiter (Step 2/4). Upstash or KV is an option if traffic grows. |
| **JSON-LD injection** once content is DB-driven | XSS via `</script>` in a title or excerpt | Escape `<` in serialised JSON-LD before the insights cutover |
| **CSP blocks new origins** (Blob images, uploads) | Broken images or uploads | Planned config change at the media phase (Architecture §2.10) |
| **Existing defects** (GA unreachable in `layout.tsx`, Tawk.to likely blocked by the CSP) | Analytics and chat not working today | Not part of this work. Flagged for a separate fix with your approval. |
| **Prisma major-version differences** (v6 vs v7 config, generator, adapters) | Setup friction | Check against the Prisma docs for the installed version at Step 1 |
| **Next.js 16 conventions** (`proxy.ts` not `middleware.ts`, async request APIs, `revalidateTag(tag, profile)`, `unstable_cache` superseded) | Code written from older patterns breaks | Follow `node_modules/next/dist/docs/` per `AGENTS.md` |
| **Personal data in enquiries** (Kenya Data Protection Act 2019) | Compliance exposure | Minimal fields, hashed IPs, retention policy, delete action, access limited to admins |
| **Single admin account lockout** | Can't get into the dashboard | Account recovery through the identity provider. Keep a second OWNER account for break-glass access. Documented in the operations guide. |
| **Email infrastructure regression** (Brevo, Namecheap forwarding, Gmail) | Lost enquiry notifications | No changes to DNS, Brevo credentials, sender or templates without explicit approval. Persistence-first means a notification failure never loses the enquiry. Live delivery checked with a real submission on a preview deployment. |
