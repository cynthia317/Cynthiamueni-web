# Admin Dashboard: Architecture

Status: **Proposal, not yet implemented**. Written 2026-11-10 from an inspection of the repository at that date. Updated 2026-11-21 with the owner's confirmed decisions (§2.11). None of the admin, database or authentication work described here exists yet.
Companion docs: [ADMIN_DASHBOARD_ROADMAP.md](./ADMIN_DASHBOARD_ROADMAP.md), [ADMIN_DATABASE_PLAN.md](./ADMIN_DATABASE_PLAN.md).

---

## 1. Current architecture (as inspected)

### 1.1 Framework and versions

| Item | Installed version | Notes |
| --- | --- | --- |
| Next.js | 16.3.0 (App Router, Turbopack) | `middleware` is renamed `proxy` in v16. Async `params`/`cookies()` only. Bundled docs live in `node_modules/next/dist/docs/` (see `AGENTS.md`). |
| React / React DOM | 19.2.8 | |
| TypeScript | 5.9.3 | `strict: true`, path alias `@/*` → repo root |
| Tailwind CSS | 4.3.3 (`@tailwindcss/postcss`) | Class-based dark mode via `@custom-variant dark` in `app/globals.css` |
| next-themes | 0.4.6 | light / dark / system |
| lucide-react | 1.31.0 | Icons are imported as React components inside data files |
| @next/third-parties | 16.4.0 | Imported for Google Analytics (see the bug in §1.10) |
| ESLint | 9, flat config, `eslint-config-next` 16.3.0 | |

There is **no database client, ORM, auth library, validation library (zod), or test framework** installed.
The Next.js docs require Node.js 20.9 or later. The original inspection couldn't run a build because neither `node` nor `git` was installed. They're installed now (re-checked 2026-11-21: Git 2.56, Node 26.13, npm 11.20), and on the unmodified `main` code `tsc --noEmit`, `eslint` and `next build` all pass (31 routes generated).

### 1.2 Folder structure

```
app/
  layout.tsx            root layout: fonts, ThemeProvider, Header, Footer, WhatsApp button, Tawk.to script
  page.tsx              home
  about/ expertise/ services/ contact/   static pages
  projects/page.tsx, projects/[slug]/page.tsx     (generateStaticParams over PROJECTS)
  insights/page.tsx, insights/[slug]/page.tsx     (generateStaticParams over INSIGHTS)
  api/contact/route.ts  POST handler → Brevo transactional email
  sitemap.ts robots.ts icon.tsx apple-icon.tsx globals.css
components/
  layout/ ui/ icons/ home/ about/ expertise/ services/ projects/ insights/ contact/
lib/
  constants.ts          site identity, contact details, social URLs, WhatsApp
  navigation.ts         NAV_ITEMS
  data/                 all content as typed TS arrays (see 1.3)
types/index.ts          every content interface (Project, Insight, Service, Faq, ...)
public/images/{home,projects,insights}/   all imagery (webp/png)
```

### 1.3 How content is stored today

All content is **hard-coded TypeScript** in `lib/data/`, compiled into the build. Pages are statically generated.

| Content | File | Shape | Who reads it |
| --- | --- | --- | --- |
| Projects (8) | `lib/data/projects.ts` | `Project[]`: slug-as-`id`, category/status/tier unions, `workflow[]`, `capabilities[{label, planned}]`, `tools[]`, `image`, `visual`, `relatedFaqIds`, `relatedInsightIds` | `app/projects/*`, `app/sitemap.ts`, `components/home/ProjectsSection.tsx`, `components/expertise/{SafetyDigitalBridge,FeaturedExpertiseProjects}.tsx` |
| Blog = "Insights" (9, all published) | `lib/data/insights.ts` (≈170 KB) | `Insight[]` with a structured **block array** `content: InsightContentBlock[]` (paragraph, heading, list, linkParagraph, toc, references, quote, image), `seoTitle`, `keywords`, `featured` | `app/insights/*`, `app/sitemap.ts`, `components/home/InsightsSection.tsx`, `components/insights/{InsightsGrid,InsightArticle}.tsx` |
| Services (3) | `lib/data/services.ts` | `Service[]`: `icon` is a **lucide component**, `deliverables[]`, `idealFor`, optional `footnote` | `components/services/ServicesList.tsx` |
| FAQs | `lib/data/faqs.ts` | `Faq[]` with answer paragraphs | Insights page (FAQPage JSON-LD), `InsightsFaq`, `ProjectDetail` (via `relatedFaqIds`) |
| Expertise, About, Connection | `lib/data/{expertise,about,connection}.ts` | Page-specific structured copy with icons and accent colours | Their respective page sections |
| Site settings | `lib/constants.ts` | Plain constants | Layout metadata, Footer, ContactForm, WhatsApp button, contact page, Brevo sender fallback |
| Testimonials | **none exist** | — | — |

Notable coupling:

- **Slugs are the `id` field** and they're referenced by string across files: `relatedInsightIds`, `relatedFaqIds`, FAQ `relatedHref`, and `linkHref` inside insight content blocks.
- **Hard-coded project IDs with non-null assertions**: `components/home/ProjectsSection.tsx` does `PROJECTS.find(p => p.id === "safety-management-system")!` (and two more IDs). `FeaturedExpertiseProjects` and `SafetyDigitalBridge` also look projects up by ID. If one of these is deleted or renamed, the home or expertise page breaks.
- **Client components import data modules directly**: `InsightsGrid` (`"use client"`) imports `INSIGHTS`, so the full 170 KB of article bodies ends up in the browser bundle. `InsightsFaq` imports `FAQS`, and `Footer`/`ContactForm` import constants. A database client can't be imported into client components, so these will need to receive data as props.
- **Module-level derived constants** (`FEATURED_INSIGHT` in `InsightsSection` and `app/insights/page.tsx`, `SAFETY_SYSTEM` etc.) assume data is available synchronously at import time.

### 1.4 Contact form → enquiries

`components/contact/ContactForm.tsx` (client) → `POST /api/contact` (`app/api/contact/route.ts`, Node runtime):
honeypot check → server-side validation and length limits → **in-memory, per-instance rate limit** (5 per 10 min per IP, which doesn't hold across serverless instances) → Brevo Transactional Email API → `CONTACT_TO_EMAIL`, with Reply-To set to the visitor.
**Enquiries are not stored anywhere.** If the Brevo call fails, the visitor sees an error with a mailto fallback, and nothing is kept.

### 1.5 Authentication

None. There is no `proxy.ts`/`middleware.ts`, no session handling, and no protected routes.

### 1.6 Environment variables

`.env.example` lists `BREVO_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` (all server-only). `.env*` is git-ignored except the example file. No local `.env.local` file was present during inspection; the production environment-variable values and where they are configured are unknown.
The GA measurement ID and the Tawk.to property ID are hard-coded in `app/layout.tsx`.

### 1.7 Database

There's no database code in the repository: no ORM or driver package, no `prisma/` folder, and no database environment-variable names in code or in `.env.example`.

The owner reports that **Neon** PostgreSQL has been used in the site's infrastructure before. That is **not verified**: as of 2026-11-21 there is no `.env.local`, no linked Vercel project (`.vercel/`), and no Vercel CLI in the development environment. Before any database work, check the existing Neon project, its branches, and the variable names set in Vercel, without exposing credentials (roadmap stage 4).

### 1.8 Images and media

All images are static files in `public/images/**`, referenced by path strings in the data files and rendered with `next/image` (`ProjectCard`, `InsightCard`, `InsightsFeatured`, `InsightArticle`). `next.config.ts` has no `images` config (no `remotePatterns`). Some housekeeping issues:

- Duplicate files: `*.webp.webp` copies in `public/images/home/`, and the same bytes saved under several names.
- Large PNGs: `ppe-alone-workplace-safety-featured.png` (2.4 MB), `right-ppe-for-right-hazard.png` (1.8 MB), `hierarchy-of-controls-diagram.png` (1.5 MB).

### 1.9 SEO

- Root `metadata` has `metadataBase`, a title template, a description, keywords, and Open Graph.
- Insights index and detail pages have canonical URLs, OG/Twitter tags, and Article, BreadcrumbList, and FAQPage JSON-LD.
- `/projects/[slug]` sets only a title and description, with no canonical URL or OG image. Static pages set only a title and description.
- `app/sitemap.ts` builds from `PROJECTS` and `INSIGHTS`. `lastModified: new Date()` changes on every build for static pages and projects.
- `app/robots.ts` allows everything. A Google Search Console verification file is in `public/`.

### 1.10 Deployment and security headers

- **The owner has confirmed hosting is Vercel** (2026-11-21). There's no `vercel.json` and no CI workflow, so the project uses Vercel's defaults. The Git remote is GitHub, with production on `main`. Admin work happens on the `feature/admin-dashboard` branch.
- Email setup (owner-confirmed, must be preserved): the contact form sends notifications through **Brevo** (`BREVO_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`). hello@cynthiamueni.com uses **Namecheap** email forwarding together with **Gmail** for sending and receiving. DNS, Brevo credentials, sender configuration and notification templates must not change without explicit approval.
- `next.config.ts` sets global security headers and a strict **CSP**: `default-src 'self'`, allow-lists for GA, Meta, and LinkedIn, `frame-ancestors 'none'`, and `form-action 'self'`.

### 1.11 Existing defects found during inspection (not fixed, outside the scope of this task)

1. **`app/layout.tsx` contains unreachable code.** A second `return (...)` block containing `<GoogleAnalytics gaId=…/>` comes after the first `return`, so **Google Analytics never renders**.
2. **The Tawk.to script is probably blocked by the CSP.** `https://embed.tawk.to` isn't in `script-src`, and Tawk also needs its own `connect-src`/`frame-src`/WebSocket origins.
3. **JSON-LD is injected with a plain `JSON.stringify`.** That's safe while content is hand-written, but once titles and excerpts come from an admin form, a value containing `</script>` can break out of the tag. Escape `<` as `\u003c` before content moves to the database.
4. `InsightsGrid` ships every article body to the client (see §1.3).
5. The README is still the create-next-app boilerplate.

---

## 2. Target architecture

### 2.1 Principles

1. **The public site renders the same as today.** Same URLs, markup, and styles. The admin changes where data comes from, not how it looks.
2. **Introduce a content repository layer before touching the database**, so the switch from static files to the database happens in one place per content type.
3. **Content is server-rendered and cached, and invalidated on write.** Public pages stay statically generated. Admin mutations call `revalidatePath` / `revalidateTag` (on-demand ISR).
4. **Defence in depth for auth.** `proxy.ts` does an optimistic redirect only. Every admin page, Server Action, and Route Handler verifies the session again through a Data Access Layer (this is the pattern the bundled Next 16 auth guide prescribes).
5. **Keep the static files.** `lib/data/*.ts` stays as the seed source and the audit trail for the initial import.

### 2.2 Recommended stack additions

| Concern | Recommendation | Why |
| --- | --- | --- |
| Database | **PostgreSQL on Neon** (intended; the existing project must be verified first, see §1.7) | Relational content with cross-references, JSONB for insight blocks and durable enquiry records. Neon branches give separate production, preview and development databases. Check region, pooling and connection limits as part of the verification. |
| ORM | **Prisma**, after verifying the selected release and its current setup requirements | Typed client, migration history and an import process for `lib/data/*.ts`. Use the provider's recommended runtime connection and a safe migration connection where applicable. |
| Validation | **zod** | One schema per entity, shared by Server Actions and the seed script. Validates the `InsightContentBlock` union stored as JSON. |
| Authentication | A maintained Next.js-compatible auth integration using an allowlisted OIDC/OAuth identity and provider-supported sessions | Avoid implementing password, reset, token and session protocols from scratch. Require MFA at the identity provider where available and disable public registration. Confirm compatibility with the deployed runtime before choosing the library/provider. |
| Server boundary | `server-only` package | Prevents the DB client and DAL from being bundled into client code. |
| Media (with Projects, step 6) | Durable object storage compatible with Vercel (e.g. Vercel Blob or S3-compatible storage), chosen at step 6 | Signed uploads and CDN delivery without relying on an application filesystem. Existing `public/images` files stay where they are. |

**Is PostgreSQL + Prisma the right call?** Yes. The content is relational: projects ↔ insights ↔ FAQs, enquiries with statuses, and an audit log. Postgres's JSONB maps exactly onto the existing insight block model, so the article renderer doesn't change. A headless CMS (Sanity, Contentful) would be a reasonable alternative for blog content alone, but it would split the data across two systems once enquiries, settings, and audit logs need a database anyway. Drizzle would also work. Prisma is preferred here for its seed and migration ergonomics and its readable schema.

Do not build a custom password/session implementation merely to keep the administrator count small. Choose a maintained auth integration and an OIDC/OAuth identity provider with MFA support; allowlist the owner account and disable sign-up. The provider/library's supported adapter determines the auth tables and session implementation. Verify its compatibility and operational requirements before implementation.

### 2.3 Layout isolation (required structural change)

The root `app/layout.tsx` currently renders the public Header, Footer, WhatsApp button, and Tawk.to chat around everything. The admin must not inherit these. Recommended approach, using **route groups with no URL change**:

```
app/
  layout.tsx                  ← keeps only <html>, <body>, fonts, ThemeProvider, globals.css
  (site)/
    layout.tsx                ← Header, <main>, Footer, WhatsApp button, Tawk.to (moved here unchanged)
    page.tsx, about/, expertise/, services/, projects/, insights/, contact/   ← moved, URLs unchanged
  admin/
    layout.tsx                ← noindex metadata, admin font/theme wrapper, no public chrome
    login/page.tsx
    (dashboard)/
      layout.tsx              ← await verifySession(); sidebar + topbar shell
      ...admin pages
  api/contact/route.ts        ← unchanged location
  sitemap.ts robots.ts icon.tsx apple-icon.tsx   ← unchanged location
```

This only moves files. The rendered HTML for public pages stays identical. It should be its own commit with a visual before/after check.

**Implemented in Stage 3 (commit `5012834`).** The public chrome lives in `components/layout/SiteChrome.tsx` and is rendered by `app/(site)/layout.tsx`. Two details turned up during verification:

- **404 pages.** Unmatched URLs render `app/not-found.tsx` inside the root layout only, so that file adds `SiteChrome` itself. `notFound()` calls from public pages render `app/(site)/not-found.tsx` inside the `(site)` layout, so that file renders only the 404 body (otherwise the chrome would appear twice). Both reuse Next's built-in 404 body, and both were verified identical to the pre-move build in server HTML and the rendered page.
- **Title template.** Pages in a child segment get the root `title.template`. The home page now uses `title: { absolute: SITE_TITLE }`, the pattern `/about` already used, to keep its original `<title>`.

### 2.4 Admin route structure

| Route | Purpose | MVP |
| --- | --- | --- |
| `/admin/login` | Sign-in through the selected identity provider | ✅ |
| `/admin` | Overview: counts (published/draft per type), new enquiries, recent edits, quick links | ✅ |
| `/admin/projects` | List with filter by tier/status, publish toggle, reorder | ✅ |
| `/admin/projects/new`, `/admin/projects/[id]` | Create / edit form | ✅ |
| `/admin/insights` | Blog post list (named "Insights" to match the public URL) | ✅ |
| `/admin/insights/new`, `/admin/insights/[id]` | Block editor plus SEO panel, preview | ✅ |
| `/admin/services`, `/admin/services/[id]` | Edit the service cards (create/delete allowed, icon picked from a whitelist) | ✅ |
| `/admin/enquiries` | Inbox: filter by status/type, search | ✅ |
| `/admin/enquiries/[id]` | Detail, status change, internal notes, "reply by email" (mailto) | ✅ |
| `/admin/settings` | Site settings (contact details, socials, business hours, WhatsApp, default SEO) | ✅ |
| `/admin/settings/account` | Account/session status and sign out; password/MFA changes handled by the identity provider | ✅ |
| `/admin/testimonials` | CRUD and consent tracking | Phase 2 |
| `/admin/media` | Library, upload, alt text, usage | Phase 2 |
| `/admin/seo` | Per-route meta overrides, OG images, redirects | Phase 2 |
| `/admin/faqs` | FAQ CRUD (feeds the FAQPage JSON-LD) | Phase 2 |
| `/admin/activity` | Audit log viewer | Phase 2 (logging itself starts in the MVP) |

Admin pages are dynamic (`await verifySession()` reads cookies), so they're never statically cached.

### 2.5 Server Actions and Route Handlers

**Default: Server Actions**, colocated per section (`app/admin/(dashboard)/projects/actions.ts`). Every action follows the same pipeline:

```
"use server"
1. const session = await requireAdmin()          // DAL: re-validates the session from the DB, throws/redirects otherwise
2. const input = Schema.safeParse(formData)      // zod; return field errors to useActionState
3. await repo.mutate(input, session.user)        // lib/content/* repository, Prisma transaction
4. await audit(session.user, "project.update", id, diff)
5. revalidatePath("/projects"); revalidatePath(`/projects/${slug}`); revalidatePath("/")  // plus sitemap
6. return { ok: true } | redirect(...)
```

Planned actions (MVP):

| Area | Actions |
| --- | --- |
| Auth | Provider sign-in/callback/sign-out flow (not application-owned password actions) |
| Projects | `createProject`, `updateProject`, `setProjectPublished`, `reorderProjects`, `deleteProject` (blocked for protected projects) |
| Insights | `createInsight`, `updateInsight`, `setInsightStatus` (draft/published), `setFeaturedInsight` (enforces a single featured post), `deleteInsight` |
| Services | `createService`, `updateService`, `reorderServices`, `deleteService` |
| Enquiries | `setEnquiryStatus` (NEW / IN_PROGRESS / RESOLVED / ARCHIVED), `updateEnquiryNotes`, `retryNotification`, `deleteEnquiry` (OWNER only, data-protection erasure) |
| Settings | `updateSiteSettings` |

**Route Handlers**, only where an HTTP endpoint is actually needed:

| Handler | Purpose |
| --- | --- |
| `POST /api/contact` (existing) | Extended to persist the enquiry and retry record first, then email via Brevo (see the DB plan for the failure matrix). |
| `POST /api/admin/media/upload` (phase 2) | Issues short-lived upload authorization for the selected object store after `requireAdmin()` and checks type and size limits. |
| `GET /api/admin/enquiries/export` (optional) | CSV export, admin only. |

Route Handlers must also call `requireAdmin()` and check the `Origin` header on state-changing requests. Server Actions get POST-only plus same-origin checks from Next itself.

### 2.6 Content repository layer (the key seam)

```
lib/
  db.ts                  Prisma client singleton (server-only)
  auth/
    provider.ts          selected maintained auth integration/configuration
    dal.ts               getCurrentAdmin() / requireAdmin(), server-only
  content/
    projects.ts          getPublishedProjects(), getProjectBySlug(), getProjectsByIds()
    insights.ts          getPublishedInsights({withContent?}), getInsightBySlug(), getFeaturedInsight()
    services.ts          getPublishedServices()
    faqs.ts              getFaqs()
    settings.ts          getSiteSettings()
    mappers.ts           DB row → existing types in types/index.ts (enum labels, icon registry, href)
  validation/            zod schemas per entity
  icons.ts               whitelist registry: "hard-hat" → HardHat, etc.
    rate-limit.ts          shared contact-form limiter, if supported by the confirmed host
    data/                  existing static files (kept: seed source, fallback reference)
```

The repositories **return the existing `Project`, `Insight`, `Service`, and `Faq` types**, with `href` derived from the slug and `icon` resolved from a key. As a result, **no presentational component has to change**. Only the call sites change: synchronous imports become `await getX()` in Server Components, and the results are passed as props into client components.

Step 1 of the roadmap implements these functions **against the static arrays**, which proves the seam with no database involved. Step N swaps each function body to Prisma.

#### As implemented in Stage 3 (static source)

The functions below exist and are used by every public page. They're `async` now, so swapping a body to a database query later doesn't change any call site.

| Module | Functions | Notes |
| --- | --- | --- |
| `lib/content/types.ts` | `InsightSummary` (+ re-exports of `Project`, `Insight`, `Service`, `Faq`, …) | `types/index.ts` stays the canonical contract |
| `lib/content/projects.ts` | `getProjects()`, `getProjectsByTier(tier)`, `getProjectBySlug(slug)`, `getProjectSlugs()`, `getProjectsBySlugs(slugs)` | Slug = `id` = URL segment |
| `lib/content/featured.ts` | `FEATURED_PROJECT_SLOTS`, `getFeaturedProjects(slot)` | Slots `homeProjects`, `expertiseFeatured`, `expertiseBridge` replace IDs that used to be hard-coded in components. They mirror the planned `FeaturedPlacement` model. |
| `lib/content/insights.ts` | `getInsightSummaries()`, `getPublishedInsightSummaries()`, `getPublishedInsightSlugs()`, `getInsightBySlug(slug)`, `getFeaturedInsight()`, `getRelatedInsights(insight, max)`, `isPublishedInsight(insight)` | Listings and client components get summaries without article bodies. This cut client JavaScript from 848,370 to 696,731 bytes. |
| `lib/content/services.ts` | `getServices()` | |
| `lib/content/faqs.ts` | `getFaqs()`, `getFaqsByIds(ids)` | |

**Data-flow rule:** pages and data-loading sections (`ServicesList`, `ProjectsSection`, `InsightsSection`, `FeaturedExpertiseProjects`, `SafetyDigitalBridge`) are async Server Components that call these functions. Presentational and client components (`InsightsGrid`, `InsightsFaq`, `InsightArticle`, `ProjectDetail`) receive data as props.

**Not yet abstracted (planned):**
- `settings.ts` / `getSiteSettings()`, which moves with the Settings step.
- `mappers.ts` and `icons.ts`, which are needed only once there's a database.
- The `server-only` guard (roadmap step 1.2).
- `lib/data/about.ts`, `expertise.ts` and `connection.ts` intentionally stay static (§2.8).

### 2.7 Caching and revalidation

The project doesn't enable `cacheComponents`, and enabling it is a larger migration. Recommended for the MVP:

- Public routes stay statically generated. `generateStaticParams` reads from the repository, so the DB is queried at build time. `dynamicParams` stays at its default (`true`), so a newly published slug renders on first request.
- Admin mutations call `revalidatePath(...)` for every affected public route (list page, detail page, home, sitemap). This is on-demand ISR with no time-based revalidation needed.
- Use React `cache()` inside repositories for per-request deduplication.
- Adopting `cacheComponents` and `"use cache"` + `cacheTag` / `updateTag` (the Next 16 replacement for `unstable_cache`) is a separate, optional later step.

### 2.8 What stays static (not moved to the database)

| Keep in code | Reason |
| --- | --- |
| Page composition and section components (Hero, Introduction, ConnectionSection, ReferralSection, FinalCta, …) | Design, not content. Making these editable would amount to a page builder, which is out of scope and risks the design. |
| `lib/data/about.ts`, `expertise.ts`, `connection.ts` | Rarely changes, tightly bound to bespoke layouts (accent colours, icons, flows). Can be revisited later. |
| `components/contact/ContactFaq.tsx` inline FAQs | Page-specific microcopy |
| `lib/navigation.ts` | Navigation is structural |
| `types/index.ts` | Stays the public contract. DB types are mapped onto it. |
| Secrets (`BREVO_API_KEY`, `CONTACT_TO_EMAIL`, DB URLs) | **Never** stored in the DB or editable in the UI |
| CSP and security headers in `next.config.ts` | Code-reviewed configuration, not an admin setting |
| Existing `public/images/**` | Stay in place and get registered as static media records. No re-upload needed. |

**Moves to the database:** projects, insights, services, enquiries (new), site settings (from `constants.ts`). In phase 2: FAQs, testimonials (new), media metadata, per-route SEO overrides, redirects.

### 2.9 Security requirements

**Authentication and sessions**
- No public sign-up route. Provision/allowlist the owner through the selected identity provider; require MFA where available.
- Use the provider/library's supported secure, revocable session mechanism and cookie settings (`HttpOnly`, `Secure` in production, an appropriate `SameSite` policy, narrow path/domain). Set practical session expiry and revocation behavior.
- Do not store or verify passwords, implement recovery flows, or invent session cryptography in this application unless a reviewed requirement rules out provider-based auth.
- Apply provider- or host-supported login abuse protection and ensure callback URLs are restricted to the production origin.

**Authorization**
- `proxy.ts` matcher `/admin/:path*` (excluding `/admin/login`) does an **optimistic cookie-presence check only**. It doesn't query the DB, because Proxy also runs on prefetches.
- `requireAdmin()` runs in the dashboard layout **and** in every page, Server Action, and Route Handler. Next 16 docs explicitly warn that Server Actions are reachable by direct POST and that proxy matcher coverage can silently drift.
- Role-based access with **OWNER, ADMIN and EDITOR** (permissions in §2.11). Every role check runs on the server, in the Data Access Layer or the action itself. Hiding a control in the UI is never treated as authorization.
- EDITOR accounts must never receive enquiry records or client personal data, including through list counts that reveal names, exports, or the overview page.

**Input and output**
- zod validation on every action. Explicit field allow-lists, never spreading `formData` into Prisma.
- Insight content stays a **typed block model** (no raw HTML, no `dangerouslySetInnerHTML` for body content). Link hrefs are validated (`/…`, `https://…`, or `mailto:` only, so no `javascript:`).
- JSON-LD output escapes `<` (see §1.11 #3).
- Uploads (phase 2): images only (jpeg/png/webp/avif), ≤ 5 MB, MIME sniffed server-side, **no SVG uploads**, random filenames.

**Privacy and data protection** (enquiries contain personal data and the site operates from Kenya, so the Data Protection Act 2019 applies)
- Store only what the form already collects. IP addresses are stored **hashed with a salt**, used only for rate limiting and abuse checks.
- Define retention (suggested: enquiries archived after 12 months, hard-deleted after 24 months unless they lead to an engagement) and offer a delete action.
- Testimonials require a recorded consent date before they can be published.

**Search and exposure**
- `/admin` gets `robots: { index: false, follow: false }` metadata. `robots.ts` gets `disallow: /admin`, and an `X-Robots-Tag: noindex` header is added for `/admin/*`. Admin routes are never included in the sitemap.

**Operations**
- Audit log for every create/update/delete/publish/login (success and failure).
- Managed Postgres with point-in-time restore. A monthly `pg_dump` export kept off-platform.
- Separate DB branches/instances for development, preview, and production. **Preview deployments must never point at the production DB with write access.**

### 2.10 CSP and config changes that will be needed later (deferred, need approval)

The brief says not to change deployment configuration yet. The following will be needed when the relevant phase starts:

| Phase | Change |
| --- | --- |
| Auth (MVP) | Add a `/admin/:path*` header block with `X-Robots-Tag: noindex` and `Cache-Control: no-store`. Edit `robots.ts`. |
| DB (MVP) | Database connection variables and a migration/generation step appropriate to the confirmed host and selected Prisma release. |
| Media (phase 2) | Any required `img-src`, `connect-src`, image loader/domain and server-side storage credential changes for the selected object store. |
| Existing bug | Add Tawk.to origins to the CSP or remove the script. Fix the GA placement in `layout.tsx`. |

### 2.11 Confirmed decisions (2026-11-21)

These are agreed decisions, not implemented features.

**Hosting and environments**
- Hosting is Vercel. Neon is the intended database once the existing project has been checked.
- Production, preview and local development use **completely separate** databases (Neon branches). Preview uses a schema-only branch or sanitized data, never production data with write access. The local development connection string goes in a git-ignored `.env.local`, which the owner sets up privately.
- No replacement production database is created, and no production migration runs, until the existing configuration has been reviewed.

**Roles** (enforced on the server for every protected operation)

| Capability | OWNER | ADMIN | EDITOR |
| --- | --- | --- | --- |
| View enquiries and client details | ✅ | ✅ | ❌ |
| Update status, add notes, archive enquiries | ✅ | ✅ | ❌ |
| Retry a failed enquiry notification | ✅ | ✅ | ❌ |
| Permanently delete an enquiry | ✅ | ❌ | ❌ |
| Content management (projects, insights, services, …) | ✅ | ✅ | ✅ |
| Site settings, user and role management | ✅ | ❌ | ❌ |

**Enquiries**
- Statuses: `NEW`, `IN_PROGRESS`, `RESOLVED`, `ARCHIVED`.
- Stored fields: ID, name, email, optional phone, optional organisation, requested service, subject, message, submission time, status, private admin notes, notification delivery status, last-updated time. Nothing beyond what the form already collects, apart from operational metadata (a hashed IP and a duplicate-detection hash).
- Replies happen through the existing hello@cynthiamueni.com Gmail setup via a `mailto:` link. The dashboard doesn't claim to send or sync replies.

**Content**
- **Configurable featured projects** replace the hard-coded project IDs in `ProjectsSection`, `FeaturedExpertiseProjects` and `SafetyDigitalBridge`. Until that ships, those projects stay protected from deletion and slug changes.
- **Secure image uploading** ships with the first content module that needs it (Projects), not as a later standalone phase.
- **Published slugs are preserved.** A redirect strategy (redirect table plus 301s) must exist before the admin allows any slug change.
- The public website must keep working at every step of the transition.

**Tooling**
- Vitest is approved as a development-only dependency. It gets installed when the first tests are written.

---

## 3. What changes vs. what stays untouched

**Changes (structural, no visual difference):**
- Public pages move into `app/(site)/` and the chrome moves into `app/(site)/layout.tsx`.
- Data consumers switch from direct `lib/data` imports to `await` repository calls. Client components (`InsightsGrid`, `InsightsFaq`, `Footer`, `ContactForm`, the WhatsApp button) receive data as props.
- `/api/contact` also writes to the DB.
- `sitemap.ts` and `generateStaticParams` read from repositories.
- New: `app/admin/**`, `proxy.ts`, `lib/db.ts`, `lib/auth/**`, `lib/content/**`, `lib/validation/**`, `prisma/**`, `components/admin/**`.

**Untouched:**
- All public components' markup and styles, `globals.css`, the theme system, icons, and images in `public/`.
- `types/index.ts` (it may gain optional fields only).
- URLs and slugs of every existing page.
- Brevo email delivery and its HTML template.
- `next.config.ts` until a phase explicitly requires a change (§2.10).
- `lib/data/*.ts` (kept as the seed source).
