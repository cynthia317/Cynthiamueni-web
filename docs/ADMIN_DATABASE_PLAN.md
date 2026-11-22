# Admin Dashboard: Database Plan

Status: **Implemented on the Neon development and preview branches** (2026-11-22, §10–§11). Production has no tables. Reviewed in Stage 4 (§7–§9). §3 below is the original draft: `prisma/schema.prisma` is the source of truth. Companion to [ADMIN_DASHBOARD_ARCHITECTURE.md](./ADMIN_DASHBOARD_ARCHITECTURE.md).

> **Superseded the same day (§10):** a dedicated Neon project was created and verified.
>
> **Stage 4 verification result (2026-11-22, first audit): Neon is still unverified.**
>
> - **Repository:** no database code, dependencies or migrations, and none in the git history. No database variable names are configured anywhere: there's no `.env.local`, and `.env.example` lists only `BREVO_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`.
> - **Vercel:** the repository isn't linked to a project (no `.vercel/`), and neither the Vercel CLI nor the Neon CLI is installed.
> - **Session tools:** no Neon or Vercel tool is connected, so the existing Neon project, its branches and data, and Vercel's database variables couldn't be inspected.
>
> The owner verifies these in the dashboards using the checklist in §7.1. Nothing has been created, connected or migrated.

---

## 1. Decision

**PostgreSQL + Prisma, on Neon, hosted alongside the Vercel deployment** (hosting confirmed by the owner on 2026-11-21).

**Verification comes first.** The owner reports that Neon has been used before, but the repository has no database code and no database variable names, and nothing has been confirmed. Before any schema work (roadmap stage 4):

1. Identify the existing Neon project, its region, and its branches.
2. Record which variable *names* are set in Vercel for Production, Preview and Development, without copying or printing any values.
3. Check whether any existing tables or data are present. **Never overwrite or drop existing tables or data.** New tables are added through reviewed migrations only.
4. Don't create a replacement production database.

**Environment isolation (agreed):**

| Environment | Database | Data |
| --- | --- | --- |
| Production (Vercel Production, `main`) | Neon production branch | Live data. Migrations applied only after review and explicit approval. |
| Preview (Vercel Preview deployments) | Separate Neon branch | Schema-only or sanitized data. Never production data with write access. |
| Local development | Separate Neon development branch | Connection string in the git-ignored `.env.local`, set up privately by the owner |

- Use Neon's pooled connection for runtime queries and a direct connection for migrations. The exact variable names are chosen after verification (if Vercel's Neon integration already created variables, reuse those names instead of adding parallel ones).
- Prisma is not installed in the current project. Select a release during implementation and follow that release's configuration, generator and driver-adapter documentation rather than assuming a major-version setup.
- A single `PrismaClient` lives in `lib/db.ts`, guarded by `import "server-only"` and cached on `globalThis` in development to survive hot reload.

---

## 2. Mapping existing content to the database

### 2.1 What moves, and when

| Source today | Target model | Phase | Notes |
| --- | --- | --- | --- |
| `lib/data/projects.ts` | `Project` | MVP | 8 rows. `id` → `slug`. `href` is derived, not stored. |
| `lib/data/insights.ts` | `Insight` | MVP | 9 rows, currently published. `content` block array → `jsonb`. `date` → `publishedAt` (`date`). |
| `lib/data/services.ts` | `Service` | MVP | 3 rows. Lucide component → `iconKey` string. |
| `/api/contact` submissions | `Enquiry` | MVP | New, nothing to migrate. |
| `lib/constants.ts` (non-secret) | `SiteSettings` (singleton) | MVP | Contact details, socials, hours, WhatsApp, default SEO. |
| `lib/data/faqs.ts` | `Faq` | Phase 2 | Referenced by projects (`relatedFaqIds`). Kept as a slug array until migrated. |
| (none) | `Testimonial` | Phase 2 | New content type. Public display needs a design decision. |
| `public/images/**` | `Media` (`kind = STATIC`) | Phase 2 | Register existing files and leave them in place. |
| Per-page `metadata` exports | `SeoOverride` | Phase 2 | Overrides only. The code defaults remain the fallback. |

### 2.2 What stays static

`lib/data/about.ts`, `expertise.ts`, `connection.ts`, `lib/navigation.ts`, the inline contact-page FAQs, every section component, and all secrets. See Architecture §2.8 for the reasons.

### 2.3 Type-mapping rules (DB ↔ `types/index.ts`)

The public components keep consuming the existing TypeScript types. `lib/content/mappers.ts` converts in both directions:

| Field | Existing type | DB representation | Mapper |
| --- | --- | --- | --- |
| `Project.id` / `Insight.id` | slug string | `slug` (unique), plus internal `id` (cuid) | `id: row.slug` |
| `Project.href` / `Insight.href` | `/projects/{slug}` | not stored | derived |
| `Project.category` | `"EHS Systems × Digital Communication"` etc. | Prisma enum `ProjectCategory` | label map |
| `Project.status` | `"In Development"` etc. | enum `ProjectStatus` | label map |
| `Project.tier` | `"flagship" \| "core" \| ...` | enum `ProjectTier` | lower-case map |
| `Project.capabilities` | `{label, planned?}[]` | `jsonb`, zod-validated | passthrough |
| `workflow`, `tools`, `keywords`, `deliverables` | `string[]` | `text[]` | passthrough |
| `Service.icon` | `LucideIcon` component | `iconKey` text (e.g. `"hard-hat"`) | `lib/icons.ts` whitelist registry |
| `Insight.content` | `InsightContentBlock[]` | `jsonb`, zod discriminated union | passthrough |
| `Insight.date` | `"YYYY-MM-DD"` | `publishedAt @db.Date` | ISO date slice |
| `Insight.href === "#"` ("coming soon") | convention | `status = DRAFT` | public queries return published only |
| `relatedInsightIds` | slug array | many-to-many `Project` ↔ `Insight` | map to slugs |
| `relatedFaqIds` | slug array | `relatedFaqSlugs text[]` (MVP), then a relation to `Faq` (phase 2) | passthrough |

---

## 3. Draft Prisma schema

> Draft for review, not a copy-ready schema. Names, field lengths, indexes and provider-adapter models must be finalised during implementation using the selected Prisma release's documentation.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
  // Prisma 7: no URL here. prisma.config.ts sets datasource.url to the DIRECT (unpooled) URL for the CLI;
  // the runtime client gets the POOLED URL through a driver adapter (see §8).
}

// ─────────────────────────── Application user / authorization ───────────────────────────

enum AdminRole {
  OWNER   // everything, incl. settings, users, permanent enquiry deletion
  ADMIN   // enquiries (view, status, notes, archive) + content
  EDITOR  // content only; no enquiries or client personal data
}

// Use the selected identity provider's supported Prisma adapter models for identity and
// sessions. This application-side role relation is illustrative; do not add a custom
// password/reset/session implementation based on this sketch.
model AdminUser {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String?
  role      AdminRole  @default(OWNER)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  auditLogs  AuditLog[]
  media      Media[]
}

model RateLimitBucket {
  key         String   @id               // e.g. "contact:<ipHash>"
  count       Int      @default(0)
  windowStart DateTime @default(now())
}

// ─────────────────────────── Content ───────────────────────────

enum PublishStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum ProjectCategory {
  EHS_SYSTEMS               // "EHS Systems"
  EHS_DIGITAL_COMMUNICATION // "EHS Systems × Digital Communication"
  SOFTWARE_SYSTEMS          // "Software / Systems"
  DIGITAL_MARKETING         // "Digital Marketing"
  RESEARCH_PROFESSIONAL     // "Research / Professional Work"
}

enum ProjectStatus {
  LIVE                      // "Live"
  IN_DEVELOPMENT            // "In Development"
  PLANNED                   // "Planned"
  ACTIVE_PROFESSIONAL_WORK  // "Active Professional Work"
}

enum ProjectTier {
  FLAGSHIP
  CORE
  SUPPORTING
  REFERRED
}

enum ProjectVisual {
  MOCKUP
  SOCIAL
}

model Project {
  id              String          @id @default(cuid())
  slug            String          @unique
  title           String
  category        ProjectCategory
  status          ProjectStatus
  tier            ProjectTier
  description     String          @db.Text
  workflow        String[]
  capabilities    Json            @default("[]")   // [{ label: string, planned?: boolean }]
  tools           String[]
  imagePath       String?         // "/images/projects/..." or Blob URL
  imageAlt        String?
  mediaId         String?         // phase 2 link to Media
  media           Media?          @relation(fields: [mediaId], references: [id], onDelete: SetNull)
  visual          ProjectVisual?
  relatedFaqSlugs String[]        // becomes a Faq relation in phase 2
  relatedInsights Insight[]       @relation("ProjectInsights")
  seoTitle        String?
  seoDescription  String?
  sortOrder       Int             @default(0)
  publishStatus   PublishStatus   @default(DRAFT)
  isProtected     Boolean         @default(false)  // interim: referenced by hard-coded page sections; no delete, slug locked
  placements      FeaturedPlacement[]
  publishedAt     DateTime?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([publishStatus, tier, sortOrder])
}

// Configurable featured-project system: replaces the hard-coded project IDs in
// ProjectsSection, FeaturedExpertiseProjects and SafetyDigitalBridge. Each page section
// reads its slots in order; an empty slot renders nothing instead of crashing.
enum FeaturedSlot {
  HOME_PROJECTS        // components/home/ProjectsSection
  EXPERTISE_FEATURED   // components/expertise/FeaturedExpertiseProjects
  EXPERTISE_BRIDGE     // components/expertise/SafetyDigitalBridge
}

model FeaturedPlacement {
  id        String       @id @default(cuid())
  slot      FeaturedSlot
  position  Int
  projectId String
  project   Project      @relation(fields: [projectId], references: [id], onDelete: Restrict)
  updatedAt DateTime     @updatedAt

  @@unique([slot, position])
  @@unique([slot, projectId])
}

model Insight {
  id              String        @id @default(cuid())
  slug            String        @unique
  title           String
  seoTitle        String?
  category        String        // free text today; can become a table later
  excerpt         String        @db.Text
  publishedAt     DateTime?     @db.Date
  readTime        String        // "13 min read"; auto-computed in admin with manual override
  imagePath       String
  imageAlt        String
  mediaId         String?
  media           Media?        @relation(fields: [mediaId], references: [id], onDelete: SetNull)
  featured        Boolean       @default(false)  // exactly one: enforced in action + partial unique index
  content         Json          @default("[]")   // InsightContentBlock[]
  keywords        String[]
  status          PublishStatus @default(DRAFT)
  projects        Project[]     @relation("ProjectInsights")
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([status, publishedAt(sort: Desc)])
}

model Service {
  id               String        @id @default(cuid())
  slug             String        @unique   // "osh", "software", "digital"
  title            String
  iconKey          String                  // must exist in lib/icons.ts registry
  summary          String        @db.Text
  deliverables     String[]
  idealFor         String        @db.Text
  footnoteText     String?
  footnoteHref     String?
  footnoteExternal Boolean       @default(false)
  sortOrder        Int           @default(0)
  publishStatus    PublishStatus @default(PUBLISHED)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

model Faq {                                   // phase 2
  id           String        @id @default(cuid())
  slug         String        @unique
  question     String
  answer       String[]                       // 1–4 paragraphs
  category     String?
  relatedLabel String?
  relatedHref  String?
  sortOrder    Int           @default(0)
  status       PublishStatus @default(PUBLISHED)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Testimonial {                           // phase 2
  id             String        @id @default(cuid())
  authorName     String
  authorRole     String?
  organisation   String?
  quote          String        @db.Text
  avatarId       String?
  avatar         Media?        @relation(fields: [avatarId], references: [id], onDelete: SetNull)
  consentGivenAt DateTime?                    // required before PUBLISHED (enforced in action)
  consentNote    String?                      // how/where consent was given
  projectSlug    String?
  serviceSlug    String?
  sortOrder      Int           @default(0)
  status         PublishStatus @default(DRAFT)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

// ─────────────────────────── Enquiries ───────────────────────────

enum EnquiryStatus {   // agreed 2026-11-21
  NEW
  IN_PROGRESS
  RESOLVED
  ARCHIVED
}
// Spam isn't a status: honeypot submissions are never stored (unchanged behaviour).

enum NotificationStatus {
  PENDING
  SENT
  FAILED
}

model Enquiry {
  id                     String             @id @default(cuid())
  name                   String             @db.VarChar(120)
  email                  String             @db.VarChar(254)
  phone                  String?            @db.VarChar(40)
  organisation           String?            @db.VarChar(160)   // optional, approved
  requestedService       String             @db.VarChar(40)    // existing form keys: osh, ehs-systems, digital-communication, ...
  subject                String             @db.VarChar(200)
  message                String             @db.Text           // ≤ 5000 enforced by validation
  status                 EnquiryStatus      @default(NEW)
  adminNotes             String?            @db.Text           // private; OWNER/ADMIN only
  notificationStatus     NotificationStatus @default(PENDING)
  notificationAttemptAt  DateTime?
  notificationErrorCode  String?            // redacted code only, never a provider message body
  emailOutbox            EmailOutbox?
  dedupeHash             String             // sha256(normalised email + subject + message)
  ipHash                 String?            // salted; abuse/rate-limit only
  resolvedAt             DateTime?
  createdAt              DateTime           @default(now())   // submission timestamp
  updatedAt              DateTime           @updatedAt

  @@index([status, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
  @@index([email])
  @@index([dedupeHash, createdAt])
}

model EmailOutbox {
  id            String   @id @default(cuid())
  enquiryId     String   @unique
  enquiry       Enquiry  @relation(fields: [enquiryId], references: [id], onDelete: Cascade)
  attempts      Int      @default(0)
  nextAttemptAt DateTime?
  lastAttemptAt DateTime?
  lastErrorCode String?  // redacted provider/error code; never store the message body here
  createdAt     DateTime @default(now())
  sentAt        DateTime?

  @@index([nextAttemptAt])
}

// ─────────────────────────── Media / SEO / Settings ───────────────────────────

enum MediaKind {
  STATIC   // file already in /public, path only
  BLOB     // uploaded to object storage
}

model Media {
  id           String     @id @default(cuid())
  kind         MediaKind
  url          String     @unique    // "/images/..." or https://<blob-host>/...
  storageKey   String?               // blob pathname, for deletion
  filename     String
  mimeType     String
  sizeBytes    Int?
  width        Int?
  height       Int?
  altText      String?
  caption      String?
  uploadedById String?
  uploadedBy   AdminUser? @relation(fields: [uploadedById], references: [id], onDelete: SetNull)
  createdAt    DateTime   @default(now())

  projects     Project[]
  insights     Insight[]
  testimonials Testimonial[]
}

model SeoOverride {                           // phase 2
  id          String   @id @default(cuid())
  routePath   String   @unique   // "/", "/about", "/services", ...
  title       String?
  description String?
  keywords    String[]
  ogImageUrl  String?
  noindex     Boolean  @default(false)
  updatedAt   DateTime @updatedAt
}

model Redirect {                              // phase 2: needed once slugs become editable
  id        String   @id @default(cuid())
  fromPath  String   @unique
  toPath    String
  permanent Boolean  @default(true)
  createdAt DateTime @default(now())
}

model SiteSettings {
  id                 Int      @id @default(1)   // singleton row
  siteName           String
  siteTitle          String
  siteDescription    String   @db.Text
  defaultKeywords    String[]
  publicEmail        String   // shown on site + mailto fallback (NOT the private inbox)
  phoneDisplay       String
  phoneHref          String
  location           String
  businessHours      Json     // [{ days, hours }]
  linkedinUrl        String?
  facebookUrl        String?
  githubUrl          String?
  whatsappNumber     String
  whatsappMessage    String
  harunlucasDevUrl   String?
  updatedAt          DateTime @updatedAt
}

// ─────────────────────────── Audit ───────────────────────────

model AuditLog {
  id         String     @id @default(cuid())
  userId     String?
  user       AdminUser? @relation(fields: [userId], references: [id], onDelete: SetNull)
  action     String     // "project.update", "auth.login_failed", ...
  entityType String?
  entityId   String?
  changes    Json?      // shallow before/after of changed fields; never passwords/tokens
  ipHash     String?
  createdAt  DateTime   @default(now())

  @@index([entityType, entityId])
  @@index([createdAt(sort: Desc)])
}
```

### 3.1 Constraints Prisma can't express (raw SQL in a migration)

```sql
-- At most one featured insight
CREATE UNIQUE INDEX insight_single_featured ON "Insight" ((true)) WHERE featured = true;
-- At most one flagship project (Projects page renders exactly one showcase)
CREATE UNIQUE INDEX project_single_flagship ON "Project" ((true)) WHERE tier = 'FLAGSHIP' AND "publishStatus" = 'PUBLISHED';
-- Settings singleton
ALTER TABLE "SiteSettings" ADD CONSTRAINT site_settings_singleton CHECK (id = 1);
```

Server Actions also enforce these rules with friendly error messages. The indexes are a backstop.

### 3.2 Secrets are never stored in the database

`BREVO_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, DB URLs, `IP_HASH_SALT`, and `BLOB_READ_WRITE_TOKEN` stay in environment variables. `SiteSettings.publicEmail` is the public address and is distinct from the private destination inbox.

---

## 4. Seeding and initial migration

`prisma/seed.ts` imports the **existing static arrays** directly (`PROJECTS`, `INSIGHTS`, `SERVICES`, `FAQS`, and the constants), validates each record with the same zod schemas the admin uses, and upserts by `slug`. The seed is **idempotent**, so it can be re-run safely.

Seed rules:
- Everything currently on the site → `PUBLISHED` (all 9 insights currently have real hrefs).
- Projects referenced by hard-coded IDs → `isProtected = true`: `safety-management-system`, `workplace-risk-assessment`, `safetec-digital-presence`, plus whatever `FeaturedExpertiseProjects.FEATURED_IDS` lists (confirm when implementing). The seed also creates matching `FeaturedPlacement` rows, so the configurable system starts out reproducing today's selection exactly.
- `sortOrder` = the current array index, which preserves today's order on the public site.
- Service icons: `HardHat → "hard-hat"`, `Code2 → "code-2"`, `Megaphone → "megaphone"`.
- `relatedInsightIds` → connect the `ProjectInsights` relation by slug. `relatedFaqIds` → `relatedFaqSlugs`.

**Verification step (required before any cutover):** a script renders every public route against the static source and then against the DB source, and diffs the HTML. Cutover happens only when the diff is empty, apart from known-dynamic values like the sitemap timestamps.

---

## 5. Enquiry persistence: behaviour matrix

`/api/contact` becomes: validate → rate limit → atomically insert `Enquiry` + `EmailOutbox` → attempt Brevo delivery → update delivery state. An email attempt must never happen before durable enquiry persistence.

| DB insert | Brevo send | Response to visitor | Result |
| --- | --- | --- | --- |
| ✅ | ✅ | `{ ok: true }` | `notificationStatus = SENT` |
| ✅ | ❌ | `{ ok: true }` | Keep the enquiry and retry record; mark delivery pending/failed and show it on the dashboard. The visitor must not be prompted to submit the same enquiry again just because notification delivery failed. |
| ❌ | not attempted | `{ ok: false, error: "persistence_failed" }` | Do not claim success or send an untracked notification. Preserve the existing client-side error/mailto fallback. |

The honeypot behaviour is unchanged: no row is written and no email is sent. The response JSON contract stays the same, so `ContactForm.tsx` doesn't need any changes.

**Duplicate submissions:** a submission whose `dedupeHash` matches an enquiry created in the last 10 minutes returns `{ ok: true }` without inserting a row or sending another notification. This covers double-clicks and retries after network errors without changing the form.

**Logging:** production logs record outcomes and codes only (e.g. `persisted`, `notification_failed:401`). Names, emails, phone numbers, message text and raw provider response bodies are never logged.

If delivery succeeds but updating the database fails, the outbox may be retried and duplicate an email. Keep provider delivery errors distinct from persistence errors, make retries visible, and use provider idempotency if it is supported; do not silently mark an unrecorded delivery as successful.

**Retry policy (approved 2026-11-22):** see [Architecture §2.12 item 2](./ADMIN_DASHBOARD_ARCHITECTURE.md).
- **Atomic claim:** each attempt claims the outbox row first, so only one worker sends.
- **Automatic retries:** only for failures known to happen before Brevo accepted the request.
- **Uncertain outcomes** (timeouts after sending, 5xx responses, or an expired `SENDING` lock) become `UNCERTAIN`. They're never resent automatically; an OWNER or ADMIN resolves them after checking Brevo's logs.

**Gate:** public submissions aren't persisted until debt #7 (server-side validation) and #8 (trusted-IP, shared rate limiting) are complete and verified on a preview ([Architecture §2.12 item 3](./ADMIN_DASHBOARD_ARCHITECTURE.md)).

---

## 6. Data retention

| Data | Retention | Mechanism |
| --- | --- | --- |
| Enquiries | Agree a lawful retention period; a proposed 12-month archive / 24-month deletion window requires owner/legal confirmation | Host-supported scheduled task later; manual retention-aware action in the MVP |
| Sessions | Delete when expired | Follow the chosen auth provider's database/session cleanup behavior |
| Rate-limit buckets | Delete when the window has expired | Same as sessions |
| Audit log | Agree and document a retention period | Host-supported scheduled task |
| IP addresses | Stored only as salted SHA-256 hashes | `IP_HASH_SALT` env var |

---

## 7. Stage 4 review (2026-11-22): environments

### 7.1 Owner verification checklist (dashboards only; never paste secrets into chat or the repo)

**Neon console**
1. Is there an existing project for this site? Record:
   - project name and ID;
   - region;
   - Postgres version;
   - plan (Free, Launch or Scale), which determines protected branches, branch limits and point-in-time restore;
   - owner account.
2. **Branches:** which branches exist, and which one is the default (root)?
3. **Tables and data:** in **Tables** (or the SQL editor, read-only), are there any tables in any branch?
   - If yes, record the table names and approximate row counts.
   - Note whether any table holds personal data.
   - Don't drop, rename or modify anything.
4. **Roles and databases:** which roles and databases exist (for example `neondb_owner` / `neondb`)?
5. **Vercel integration:** is a Vercel integration installed? Look under **Integrations** in Neon, or under the Vercel project's **Storage** or **Integrations** tab. If it is, record:
   - which Vercel project it's linked to;
   - whether it creates a branch for each preview deployment;
   - which branch that per-preview branching copies from.

**Vercel dashboard** (project `cynthiamueni-web`)

6. **Environment variables:** under Settings → Environment Variables, record the **names only** for Production, Preview and Development. Look for `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `POSTGRES_*` and `PG*`, and note which Neon branch each environment points to; the hostname shows the endpoint, so don't share the password.
7. **Functions:** under Settings → Functions, record the **Function Region** and the **Node.js version**. Prisma 7.10.1 needs Node `^20.19`, `^22.12` or `>=24`.
8. **Deployment Protection:** confirm previews stay protected (they currently redirect to Vercel login).

Expected outcomes:

| Outcome | What it means |
| --- | --- |
| **A. A project exists and holds no tables** | Reuse it. Use the default branch as `production`. |
| **B. A project exists and holds tables** | Stop and review before any Prisma work. Existing tables must be baselined and never reset; see §9.1. |
| **C. No project exists** | Creating one requires explicit approval, in the region nearest the Vercel function region. |

### 7.2 Recommended Neon branch structure

| Neon branch | Used by | Created from | Data | Protection |
| --- | --- | --- | --- | --- |
| `production` (default/root) | Vercel **Production** only | — | Live data | Protected branch (if the plan allows). Only `prisma migrate deploy`, after approval. |
| `preview` | Vercel **Preview** (one shared branch) | **Schema-only** branch of `production` | Public site content from `prisma/seed.ts` and synthetic enquiries | Can be reset at any time |
| `development` | Local `.env.local` | **Schema-only** branch of `production` | Same as `preview` | Can be reset at any time |
| `dev-shadow` (optional) | `prisma migrate dev` shadow database | Empty | None | Only if Neon roles can't create a temporary shadow database |

Rules:
- **Never branch with data from `production`, and never "reset from parent", for preview or development once production holds enquiries.** A data branch copies client personal data. Use schema-only branches, or re-create the branch and run the seed.
- **Per-preview branching:** if Neon's Vercel integration has "create a branch for every preview deployment" turned on and copies from `production`, turn it off or point it at `preview`. One shared `preview` branch is enough for this site.
- **Connection strings:** each Vercel environment gets its own variables, pointing at its own branch. Production values exist only in Vercel's Production scope and never in `.env.local`.
- **Roles:** use separate Neon roles per branch where practical, so a leaked development credential can't reach production. As a minimum, every branch has its own endpoint and password.

### 7.3 Environment variables (names to confirm against §7.1 step 6)

| Name | Purpose | Production | Preview | Development (`.env.local`) |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | Pooled URL for runtime queries | prod pooled | preview pooled | development pooled |
| `DATABASE_URL_UNPOOLED` | Direct URL for the Prisma CLI (migrations) | prod direct (used only by the approved deploy step) | preview direct | development direct |
| `IP_HASH_SALT` | Hashing enquiry IPs (later stage) | unique random value | different value | different value |

Reuse the names Neon's Vercel integration already created, if any (it typically creates `DATABASE_URL` and `DATABASE_URL_UNPOOLED`) instead of adding parallel ones. Auth variables are defined in Stage 5.

## 8. Stage 4 review: Prisma integration plan

**Version:** pin **Prisma 7.10.1** exactly: `prisma`, `@prisma/client`, and the chosen adapter `@prisma/adapter-*`, all at the same version.
- It's the current stable release (published 2026-10-15).
- **Don't run a bare `npm install prisma`.** The npm `latest` tag for `prisma` currently points to **8.0.0-rc.34**, a release candidate, while `@prisma/client` `latest` is 7.10.1.
- Prisma 7.10.1 requires Node `^20.19`, `^22.12` or `>=24`. Next.js 16.4.6 requires Node `>=20.9`.

Verified from the 7.10.1 packages:
- `prisma.config.ts` (`defineConfig`, with `env()` from `prisma/config`) holds `schema`, `migrations.path`, `migrations.seed` and `datasource.url`. **`datasource` accepts only `url` and `shadowDatabaseUrl`; there is no `directUrl`.**
- So `datasource.url = env("DATABASE_URL_UNPOOLED")`, used by migrate, introspection and Studio.
- The runtime client receives the **pooled** `DATABASE_URL` through a driver adapter. Driver adapters are how Prisma 7 connects.
- **Adapter:**
  - **`@prisma/adapter-pg`** (TCP to Neon's pooled endpoint) suits Vercel's Node.js runtime, which every database route will use.
  - **`@prisma/adapter-neon`** (Neon's serverless driver, which accepts `@neondatabase/serverless` `>0.6.0 <2`) is the alternative if connection setup latency becomes an issue.
  - Decide with a small spike on the `development` branch in Stage 5. Nothing touches the Edge runtime: `proxy.ts` must not import the database.

Integration pattern (unchanged from §1, now concrete):
- **Generator:** `generator client { provider = "prisma-client", output = "../lib/generated/prisma" }`. The output folder is git-ignored.
- **Generate in the build:** `prisma generate` runs in `postinstall` or the build script, so Vercel builds always generate a fresh client.
- **One client:** `lib/db.ts` (`import "server-only"`) creates one `PrismaClient({ adapter })`, cached on `globalThis` in development.
- **Content cutover:** only `lib/content/*` imports `lib/db.ts`. Public pages stay statically generated, and admin writes call `revalidatePath`/`revalidateTag`.
- **Builds must not need a database:** keep `generateStaticParams` and the public pages on the static source until the cutover step (§4 verification), so a database outage can't break a deployment.

Migrations:

| Where | Command | When |
| --- | --- | --- |
| Local, `development` branch | `prisma migrate dev` (`--create-only` when raw SQL from §3.1 must be added) | While developing. Migration files are committed. |
| `preview` branch | `prisma migrate deploy`, then the seed | Manually or from CI, after the migration PR is reviewed |
| `production` | `prisma migrate deploy` only | A separate, explicitly approved step: from CI with a protected environment, or run once by the owner. **Never part of `next build`, and never `migrate dev` or `migrate reset`.** |

## 9. Stage 4 review: schema adjustments (approved in principle 2026-11-22)

The owner approved S1–S14 in principle, together with the safeguards in [Architecture §2.12](./ADMIN_DASHBOARD_ARCHITECTURE.md). Final field-level details are confirmed in the reviewed migration PR, after the Neon environment is verified (§7.1).

Checked against the Stage 3 `lib/content` API and the live data (8 projects, 9 insights, 3 services, 14 FAQs).

| # | Area | Adjustment | Why |
| --- | --- | --- | --- |
| S1 | Insights order | Add `Insight.sortOrder Int`, seeded from the current array index. Public queries order by `sortOrder`, not `publishedAt`. | The page shows insights in array order, which isn't date order (2026-09-30, 08-26, 09-29, …). Ordering by date would visibly reorder the Insights page. |
| S2 | Insight categories | Add `InsightCategory { id, slug @unique, name @unique, sortOrder }` and `Insight.categoryId` (FK, `onDelete: Restrict`). Seed the 6 current names exactly. | The topic filter and `getRelatedInsights` both compare categories exactly, so a free-text typo would split a topic. Restrict stops a category in use from being deleted. |
| S3 | Featured insight | Keep the partial unique index. The mapper must reproduce the fallback `featured ?? first insight`. | `getFeaturedInsight` falls back to the first insight when none is flagged. |
| S4 | Enquiry notes | Replace `Enquiry.adminNotes` with `EnquiryNote { id, enquiryId → Enquiry (Cascade), authorId → AdminUser (SetNull), body Text, createdAt }`, plus `@@index([enquiryId, createdAt])`. | Notes become attributable and timestamped. Still OWNER/ADMIN only. |
| S5 | Notification state | Make `EmailOutbox` the single source of truth:<br>• add `status` (`PENDING`, `SENDING`, `SENT`, `FAILED`, `UNCERTAIN`), `lockedUntil` and `providerMessageId`;<br>• add `@@index([status, nextAttemptAt])`;<br>• keep only a denormalised `Enquiry.notificationStatus`, updated in the same transaction, for list filtering;<br>• drop `notificationAttemptAt` and `notificationErrorCode` from `Enquiry`. | Avoids the two records drifting apart. `lockedUntil` stops concurrent retries from sending twice. `UNCERTAIN` outcomes are never retried automatically (Architecture §2.12 item 2). `providerMessageId` lets a delivery be traced in Brevo. |
| S6 | Enquiry type | Replace `requestedService String` with an `EnquiryType` enum, using `@map` for the existing form keys (`osh`, `ehs-systems`, `digital-communication`, `professional-opportunity`, `collaboration`, `other`). | Implements debt #7 at the database level. |
| S7 | Enquiry archive | Add `archivedAt DateTime?` next to `resolvedAt`. | Retention rules (§6) need the archive date. |
| S8 | Slugs and redirects | Create `Redirect` in the **same migration as the content tables**, not phase 2, and extend it with:<br>• `entityType` and `entityId`;<br>• `statusCode` (301 or 308);<br>• `@@index([toPath])`.<br>Then:<br>• the admin rejects a redirect whose `fromPath` is a live route;<br>• the admin collapses redirect chains;<br>• slugs stay **read-only in the MVP**, and editing ships only with the redirect write path. | The approved rule is that the redirect strategy exists before any slug change. |
| S9 | Slug format | Raw-SQL `CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')` on `Project`, `Insight`, `Service`, `Faq` and `InsightCategory`. | Every current slug matches the pattern. It blocks URL-breaking values. |
| S10 | Users and roles | Keep one `role AdminRole` per user (OWNER, ADMIN, EDITOR, as approved), keyed by the external provider's immutable subject ID (`providerSubject @unique`, Architecture §2.12 item 1), and add:<br>• `disabledAt DateTime?` for revocation without deleting history;<br>• store email lower-cased with `CHECK (email = lower(email))`;<br>• the application enforces "at least one active OWNER".<br>Merge `AdminUser` with the auth library's user model once Stage 5 picks the provider, rather than keeping two user tables. | Revoking a user and matching emails case-insensitively are basic access-control needs. A second user table would duplicate the provider's. |
| S11 | Audit log | Add:<br>• `actorRole`, a snapshot of the user's role at the time;<br>• `@@index([userId, createdAt])`.<br>For enquiries, record the **names of changed fields only**, never values. | EDITOR-safe history that keeps client personal data out of the log. |
| S12 | Timestamps | Use `@db.Timestamptz(3)` on every `DateTime`, keeping `@db.Date` for `publishedAt`. | Unambiguous times across the Vercel region and the owner's timezone. |
| S13 | Related insights | Keep the `ProjectInsights` relation, noting that `relatedInsightIds` isn't currently rendered anywhere. Defer an ordered join table until it is. | Avoids designing for an unused field. |
| S14 | Rate limiting | `RateLimitBucket`: add `@@index([windowStart])` for cleanup. Use it for debt #8, the shared rate limiter. | — |

Unchanged and confirmed:
- **Featured slots:** `FeaturedPlacement` uniques `(slot, position)` and `(slot, projectId)`, with Restrict on delete, matching the three `FEATURED_PROJECT_SLOTS`.
- **Slug uniques:** unique slugs on content.
- **Flagship:** the single-flagship index, since the data has exactly one flagship.
- **Content:** `Service.iconKey` registry and the `SiteSettings` singleton.
- **Secrets:** secrets stay out of the database.

### 9.1 Migration risks and safeguards

| Risk | Safeguard |
| --- | --- |
| `prisma migrate dev` detects drift and offers to **reset**, which drops all data, if pointed at a database with existing tables or at production | Production URLs never go in `.env.local`; development uses only the `development` branch. If §7.1 finds existing tables, baseline them with `prisma migrate diff` and `migrate resolve --applied` before the first migration. Never run `migrate reset` outside `development`. |
| The shadow database for `migrate dev` needs permission to create databases | Use the branch owner role, or set `shadowDatabaseUrl` to a `dev-shadow` branch. |
| Postgres enum changes (renaming or removing a value) are awkward | Add values only, and review every enum change in the PR. Label text lives in mappers, so wording changes need no migration. |
| Raw-SQL constraints (§3.1, S9, S10) are invisible to Prisma | Create them with `migrate dev --create-only`, edit the SQL, and test on `development` and `preview` first. |
| Copying client data into lower environments | Schema-only branches and the seed only (§7.2). |
| The deploy build depends on the database | `generateStaticParams` and public pages stay on static data until the verified cutover (§4). |
| Restoring production | Before the first production migration, check the Neon plan's point-in-time-restore window and take a named branch snapshot. |

---

## 10. Stage 4 implementation (2026-11-22): development only

**Status:** Prisma is integrated, and the initial schema is migrated on the Neon **development** branch only. `preview` and `production` have no tables. No public page reads from the database.

**Neon project** `red-forest-05302661` (aws-us-east-2, Postgres 18, Free plan):

| Branch | Endpoint | Contents |
| --- | --- | --- |
| `production` (default) | (not recorded in the repository) | Empty. Untouched. |
| `preview` | `ep-gentle-heart-bd2lwl8b` | Migration `20261122150000_init` applied (§11). No content rows. |
| `development` | `ep-withered-lake-bdztu36v` | Migration `20261122150000_init` applied |

- Schema-only branches have no data lineage to production, and each has its own `neondb_owner` password.
- The development password is rejected by production.

**Packages** (exact pins):
- `prisma` 7.10.1 (dev);
- `@prisma/client` 7.10.1;
- `@prisma/adapter-pg` 7.10.1, with `pg` 8.23.1 coming transitively.

Don't use a bare `npm install prisma`: npm's `latest` tag is an 8.0 release candidate.

**Files:**

| File | Purpose |
| --- | --- |
| `prisma/schema.prisma` | 14 tables and 11 enums. Implements §3 with S1–S14. Phase-2 models (`Faq`, `Testimonial`, `Media`, `SeoOverride`) come later in additive migrations. |
| `prisma/migrations/20261122150000_init/migration.sql` | Generated offline with `prisma migrate diff --from-empty`, plus the reviewed raw-SQL constraints: 2 partial unique indexes and 11 CHECKs. No destructive statements. |
| `prisma.config.ts` | Loads `.env.local` through `@next/env`. The CLI uses `DATABASE_URL_UNPOOLED`. The environment guard runs before any CLI command. The URL is optional, so `prisma generate` works on Vercel without database variables. |
| `lib/db/environment.ts` | Guard (Architecture §2.12 item 4):<br>• `DATABASE_ENVIRONMENT` must match `VERCEL_ENV`;<br>• the production endpoint (compared by SHA-256 of its ID) is rejected outside production;<br>• production must point at it.<br>Errors never contain URLs. |
| `lib/db/client.ts` | `import "server-only"` and a lazy `getDb()` with `PrismaPg` on the pooled `DATABASE_URL`, `sslmode=verify-full` and a 10 s connect timeout. Not imported by any route yet. |
| `lib/auth/permissions.ts` | The OWNER/ADMIN/EDITOR capability matrix from §2.11, enforced on the server from Stage 5. Disabled users get nothing. |
| `lib/generated/prisma/` | Generated client. Git-ignored, and rebuilt by `postinstall: prisma generate`. |

**Commands:**
- `npm run db:status`: migration status for the configured database (development locally).
- `npm run test:db`: integration tests against development. Synthetic data, with every case rolled back.
- **Applying migrations:** `npx prisma migrate deploy`, reviewed SQL only. Never `migrate reset`.
- **New migrations:** `prisma migrate diff --from-migrations prisma/migrations --to-schema prisma/schema.prisma --script`, then review the SQL. Or use `migrate dev --create-only` on development only.

**TLS:**
- **Runtime:** `node-postgres` gets `sslmode=verify-full`, so the certificate and hostname are verified.
- **CLI:** the Prisma schema engine (CLI) uses the URL's `sslmode=require` as Neon provides it. Prisma's docs don't say whether the engine accepts `verify-full`, so it was left unchanged.

**Not yet done:**
- Vercel Preview and Production variables, and any `preview` or `production` migration. Each needs approval, per §8 and Architecture §2.12 item 5.
- A seed script, and the content cutover (§4).

## 11. Preview database and seed preparation (2026-11-22)

**Preview migration:**
- **Before applying,** I checked that:
  - the target was the preview endpoint (`ep-gentle-heart-bd2lwl8b`), reported by the server itself;
  - the database was empty, with 0 tables, 0 enums and no `_prisma_migrations`;
  - the migration file was unchanged since the reviewed commit `ddfbb32`, with no destructive statements.
- **Applied** with `prisma migrate deploy` (Prisma 7.10.1). Never `migrate dev`, `db push` or `migrate reset`.
- **After:** the catalog is identical to development (15 tables, 152 columns, 11 enums, 49 indexes and 35 constraints), the migration checksum matches, there's no drift, and integration tests pass 13/13 with 0 rows left behind.

**How preview commands are run from a laptop:**
- The preview URLs are fetched in memory (`neon connection-string preview`), and `DATABASE_ENVIRONMENT=preview` and `VERCEL_ENV=preview` are set for that one process only. Nothing is written to disk.
- `.env.local` stays development-only. The test setup and the seed don't load it when variables are injected.

**Stricter environment guard:** `lib/db/environment.ts` now knows all three endpoints, by hash:
- **Preview** must use the preview endpoint.
- **Production** must use the production endpoint.
- **Development** may use any endpoint except those two.
- `prisma.config.ts` checks both `DATABASE_URL` and `DATABASE_URL_UNPOOLED`.

On Vercel this runs during `postinstall: prisma generate`, so a Preview build fails if its variables point at the wrong branch. The same check confirms the variables configured in the Vercel dashboard.

**Seed** (`npm run db:seed`, `prisma/seed/`):
- **Mapping:** `prisma/seed/data.ts` is a pure, unit-tested mapping from `lib/data` and `lib/content/featured`:
  - slugs and `sortOrder` (array order);
  - image paths, dates and insight content unchanged;
  - categories by exact name;
  - featured slots by `(slot, position)`;
  - `isProtected` for featured projects;
  - service icons through the registry keys.
- **Runner:** `prisma/seed/run.ts`:
  - **dry run by default;**
  - **create-only**: an existing record is never updated, so admin edits aren't overwritten; differences are reported as "differs (kept)";
  - **idempotent**;
  - creates everything in one transaction;
  - **refuses production** by `DATABASE_ENVIRONMENT` or endpoint, even when mislabelled.
- **Execution:** it runs with Node's built-in TypeScript support and the small alias hook in `scripts/ts-paths.mjs`, so there's no `tsx`/esbuild dependency.
- **Dry run on development and on preview:** it would create **34 records**: 6 insight categories, 9 insights, 8 projects, 3 services and 8 featured placements. **Not applied yet.**
- **Not seeded:** `SiteSettings`, whose values need owner approval. The phase-2 models don't exist yet.
