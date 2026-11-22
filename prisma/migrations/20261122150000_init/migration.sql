-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('OWNER', 'ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('EHS_SYSTEMS', 'EHS_DIGITAL_COMMUNICATION', 'SOFTWARE_SYSTEMS', 'DIGITAL_MARKETING', 'RESEARCH_PROFESSIONAL');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('LIVE', 'IN_DEVELOPMENT', 'PLANNED', 'ACTIVE_PROFESSIONAL_WORK');

-- CreateEnum
CREATE TYPE "ProjectTier" AS ENUM ('FLAGSHIP', 'CORE', 'SUPPORTING', 'REFERRED');

-- CreateEnum
CREATE TYPE "ProjectVisual" AS ENUM ('MOCKUP', 'SOCIAL');

-- CreateEnum
CREATE TYPE "FeaturedSlot" AS ENUM ('HOME_PROJECTS', 'EXPERTISE_FEATURED', 'EXPERTISE_BRIDGE');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EnquiryType" AS ENUM ('osh', 'ehs-systems', 'digital-communication', 'professional-opportunity', 'collaboration', 'other');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENDING', 'SENT', 'FAILED', 'UNCERTAIN');

-- CreateEnum
CREATE TYPE "ContentEntityType" AS ENUM ('PROJECT', 'INSIGHT', 'SERVICE', 'INSIGHT_CATEGORY');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "providerSubject" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "disabledAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ProjectCategory" NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "tier" "ProjectTier" NOT NULL,
    "description" TEXT NOT NULL,
    "workflow" TEXT[],
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "tools" TEXT[],
    "imagePath" TEXT,
    "imageAlt" TEXT,
    "visual" "ProjectVisual",
    "relatedFaqSlugs" TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "publishStatus" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "isProtected" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedPlacement" (
    "id" TEXT NOT NULL,
    "slot" "FeaturedSlot" NOT NULL,
    "position" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "FeaturedPlacement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "InsightCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "seoTitle" TEXT,
    "categoryId" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "publishedAt" DATE,
    "readTime" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "content" JSONB NOT NULL DEFAULT '[]',
    "keywords" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "iconKey" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "deliverables" TEXT[],
    "idealFor" TEXT NOT NULL,
    "footnoteText" TEXT,
    "footnoteHref" TEXT,
    "footnoteExternal" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "publishStatus" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(40),
    "organisation" VARCHAR(160),
    "enquiryType" "EnquiryType" NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "notificationStatus" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "dedupeHash" TEXT NOT NULL,
    "ipHash" TEXT,
    "resolvedAt" TIMESTAMPTZ(3),
    "archivedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnquiryNote" (
    "id" TEXT NOT NULL,
    "enquiryId" TEXT NOT NULL,
    "authorId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnquiryNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailOutbox" (
    "id" TEXT NOT NULL,
    "enquiryId" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMPTZ(3),
    "lockedUntil" TIMESTAMPTZ(3),
    "lastAttemptAt" TIMESTAMPTZ(3),
    "lastErrorCode" TEXT,
    "providerMessageId" TEXT,
    "sentAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "EmailOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redirect" (
    "id" TEXT NOT NULL,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 308,
    "entityType" "ContentEntityType",
    "entityId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "siteName" TEXT NOT NULL,
    "siteTitle" TEXT NOT NULL,
    "siteDescription" TEXT NOT NULL,
    "defaultKeywords" TEXT[],
    "publicEmail" TEXT NOT NULL,
    "phoneDisplay" TEXT NOT NULL,
    "phoneHref" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "businessHours" JSONB NOT NULL,
    "linkedinUrl" TEXT,
    "facebookUrl" TEXT,
    "githubUrl" TEXT,
    "whatsappNumber" TEXT NOT NULL,
    "whatsappMessage" TEXT NOT NULL,
    "harunlucasDevUrl" TEXT,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "actorRole" "AdminRole",
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "changes" JSONB,
    "ipHash" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectInsights" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectInsights_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_providerSubject_key" ON "AdminUser"("providerSubject");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "RateLimitBucket_windowStart_idx" ON "RateLimitBucket"("windowStart");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_publishStatus_tier_sortOrder_idx" ON "Project"("publishStatus", "tier", "sortOrder");

-- CreateIndex
CREATE INDEX "FeaturedPlacement_projectId_idx" ON "FeaturedPlacement"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedPlacement_slot_position_key" ON "FeaturedPlacement"("slot", "position");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedPlacement_slot_projectId_key" ON "FeaturedPlacement"("slot", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "InsightCategory_slug_key" ON "InsightCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "InsightCategory_name_key" ON "InsightCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Insight_slug_key" ON "Insight"("slug");

-- CreateIndex
CREATE INDEX "Insight_status_sortOrder_idx" ON "Insight"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "Insight_categoryId_idx" ON "Insight"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_publishStatus_sortOrder_idx" ON "Service"("publishStatus", "sortOrder");

-- CreateIndex
CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Enquiry_createdAt_idx" ON "Enquiry"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Enquiry_email_idx" ON "Enquiry"("email");

-- CreateIndex
CREATE INDEX "Enquiry_dedupeHash_createdAt_idx" ON "Enquiry"("dedupeHash", "createdAt");

-- CreateIndex
CREATE INDEX "Enquiry_notificationStatus_idx" ON "Enquiry"("notificationStatus");

-- CreateIndex
CREATE INDEX "EnquiryNote_enquiryId_createdAt_idx" ON "EnquiryNote"("enquiryId", "createdAt");

-- CreateIndex
CREATE INDEX "EnquiryNote_authorId_idx" ON "EnquiryNote"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailOutbox_enquiryId_key" ON "EmailOutbox"("enquiryId");

-- CreateIndex
CREATE INDEX "EmailOutbox_status_nextAttemptAt_idx" ON "EmailOutbox"("status", "nextAttemptAt");

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_fromPath_key" ON "Redirect"("fromPath");

-- CreateIndex
CREATE INDEX "Redirect_toPath_idx" ON "Redirect"("toPath");

-- CreateIndex
CREATE INDEX "Redirect_entityType_entityId_idx" ON "Redirect"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Redirect_createdById_idx" ON "Redirect"("createdById");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "_ProjectInsights_B_index" ON "_ProjectInsights"("B");

-- AddForeignKey
ALTER TABLE "FeaturedPlacement" ADD CONSTRAINT "FeaturedPlacement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "InsightCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryNote" ADD CONSTRAINT "EnquiryNote_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryNote" ADD CONSTRAINT "EnquiryNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailOutbox" ADD CONSTRAINT "EmailOutbox_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redirect" ADD CONSTRAINT "Redirect_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectInsights" ADD CONSTRAINT "_ProjectInsights_A_fkey" FOREIGN KEY ("A") REFERENCES "Insight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectInsights" ADD CONSTRAINT "_ProjectInsights_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ─────────────────────────────────────────────────────────────────────────────
-- Constraints Prisma can't express (Database Plan §3.1 and S9, S10). Added by hand; reviewed.
-- ─────────────────────────────────────────────────────────────────────────────

-- At most one featured insight (S3; the mapper keeps the "first insight" fallback).
CREATE UNIQUE INDEX "Insight_single_featured_key" ON "Insight" ((true)) WHERE "featured" = true;

-- At most one published flagship project (the Projects page renders exactly one showcase).
CREATE UNIQUE INDEX "Project_single_published_flagship_key" ON "Project" ((true))
  WHERE "tier" = 'FLAGSHIP' AND "publishStatus" = 'PUBLISHED';

-- S9: URL-safe slugs (lower-case words separated by single hyphens). All 34 current slugs match.
ALTER TABLE "Project"         ADD CONSTRAINT "Project_slug_format_check"         CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "Insight"         ADD CONSTRAINT "Insight_slug_format_check"         CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "Service"         ADD CONSTRAINT "Service_slug_format_check"         CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "InsightCategory" ADD CONSTRAINT "InsightCategory_slug_format_check" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

-- S10: emails stored lower-case, so uniqueness is case-insensitive.
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_email_lowercase_check" CHECK ("email" = lower("email"));

-- Settings singleton.
ALTER TABLE "SiteSettings" ADD CONSTRAINT "SiteSettings_singleton_check" CHECK ("id" = 1);

-- S8: redirects are internal paths, permanent, and never point at themselves.
ALTER TABLE "Redirect" ADD CONSTRAINT "Redirect_status_code_check" CHECK ("statusCode" IN (301, 308));
ALTER TABLE "Redirect" ADD CONSTRAINT "Redirect_paths_check"
  CHECK ("fromPath" LIKE '/%' AND "toPath" LIKE '/%' AND "fromPath" <> "toPath");

-- Backstops for application validation.
ALTER TABLE "Enquiry"           ADD CONSTRAINT "Enquiry_message_length_check"        CHECK (char_length("message") BETWEEN 1 AND 5000);
ALTER TABLE "EmailOutbox"       ADD CONSTRAINT "EmailOutbox_attempts_check"          CHECK ("attempts" >= 0);
ALTER TABLE "FeaturedPlacement" ADD CONSTRAINT "FeaturedPlacement_position_check"    CHECK ("position" >= 0);
