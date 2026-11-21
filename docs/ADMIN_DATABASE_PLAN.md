# Admin Dashboard: Database Plan

Status: **Proposal, not yet implemented**. Companion to [ADMIN_DASHBOARD_ARCHITECTURE.md](./ADMIN_DASHBOARD_ARCHITECTURE.md).

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
  // URLs configured in prisma.config.ts (DATABASE_URL pooled, DIRECT_URL for migrations)
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

---

## 6. Data retention

| Data | Retention | Mechanism |
| --- | --- | --- |
| Enquiries | Agree a lawful retention period; a proposed 12-month archive / 24-month deletion window requires owner/legal confirmation | Host-supported scheduled task later; manual retention-aware action in the MVP |
| Sessions | Delete when expired | Follow the chosen auth provider's database/session cleanup behavior |
| Rate-limit buckets | Delete when the window has expired | Same as sessions |
| Audit log | Agree and document a retention period | Host-supported scheduled task |
| IP addresses | Stored only as salted SHA-256 hashes | `IP_HASH_SALT` env var |
