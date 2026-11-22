/**
 * Development-database integration checks (Stage 4).
 * Synthetic records only (example.com); every case runs in a transaction that is always rolled back.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getDb } from "@/lib/db/client";
import { isProductionEndpoint, neonEndpointId } from "@/lib/db/environment";
import { Prisma, type PrismaClient } from "@/lib/generated/prisma/client";

const ROLLBACK = Symbol("rollback");
type Tx = Prisma.TransactionClient;

let db: PrismaClient;

/** Runs `fn` in a transaction and always rolls it back. Returns fn's result or rethrows its error. */
async function inRollback<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  let result: T | undefined;
  try {
    // Generous limits: each round trip from a local machine to the Neon region is slow.
    await db.$transaction(
      async (tx) => {
        result = await fn(tx);
        throw ROLLBACK;
      },
      { maxWait: 30_000, timeout: 30_000 },
    );
  } catch (error) {
    if (error !== ROLLBACK) throw error;
  }
  return result as T;
}

/** Expects `fn` to fail with a database constraint error, inside a rolled-back transaction. */
async function expectRejected(fn: (tx: Tx) => Promise<unknown>, pattern: RegExp) {
  await expect(inRollback(fn)).rejects.toThrow(pattern);
}

const project = (slug: string, extra: Partial<Prisma.ProjectCreateInput> = {}): Prisma.ProjectCreateInput => ({
  slug,
  title: `Synthetic ${slug}`,
  category: "EHS_SYSTEMS",
  status: "PLANNED",
  tier: "CORE",
  description: "Synthetic test record.",
  ...extra,
});

beforeAll(async () => {
  expect(process.env.DATABASE_ENVIRONMENT).toBe("development");
  expect(isProductionEndpoint(process.env.DATABASE_URL as string)).toBe(false);
  db = getDb();
  const [{ endpoint }] = await db.$queryRaw<{ endpoint: string }[]>`SELECT current_setting('neon.endpoint_id', true) AS endpoint`;
  // The server's own endpoint ID must match the configured (non-production) development endpoint.
  expect(endpoint).toBe(neonEndpointId(process.env.DATABASE_URL as string));
});

afterAll(async () => {
  await db?.$disconnect();
});

describe("development database", () => {
  it("is migrated and starts empty", async () => {
    const [{ name }] = await db.$queryRaw<{ name: string }[]>`SELECT migration_name AS name FROM _prisma_migrations WHERE finished_at IS NOT NULL`;
    expect(name).toBe("20261122150000_init");
    expect(await db.adminUser.count()).toBe(0);
    expect(await db.project.count()).toBe(0);
    expect(await db.enquiry.count()).toBe(0);
  });

  it("creates, reads, updates and deletes content with relations", async () => {
    const out = await inRollback(async (tx) => {
      const category = await tx.insightCategory.create({ data: { slug: "synthetic-topic", name: "Synthetic Topic", sortOrder: 0 } });
      const insight = await tx.insight.create({
        data: {
          slug: "synthetic-insight",
          title: "Synthetic insight",
          categoryId: category.id,
          excerpt: "Synthetic.",
          readTime: "1 min read",
          imagePath: "/images/synthetic.webp",
          imageAlt: "Synthetic",
          publishedAt: new Date("2026-11-22"),
          sortOrder: 3,
          status: "PUBLISHED",
        },
      });
      const created = await tx.project.create({
        data: project("synthetic-project", { relatedInsights: { connect: { id: insight.id } }, sortOrder: 1 }),
      });
      await tx.featuredPlacement.create({ data: { slot: "HOME_PROJECTS", position: 0, projectId: created.id } });
      const read = await tx.project.findUniqueOrThrow({
        where: { slug: "synthetic-project" },
        include: { relatedInsights: { include: { category: true } }, placements: true },
      });
      const updated = await tx.project.update({ where: { id: created.id }, data: { publishStatus: "PUBLISHED" } });
      await tx.featuredPlacement.deleteMany({ where: { projectId: created.id } });
      await tx.project.delete({ where: { id: created.id } });
      return { read, updated, remaining: await tx.project.count() };
    });
    expect(out.read.relatedInsights[0].category.name).toBe("Synthetic Topic");
    expect(out.read.placements[0].slot).toBe("HOME_PROJECTS");
    expect(out.updated.publishStatus).toBe("PUBLISHED");
    expect(out.remaining).toBe(0);
  });

  it("stores enquiries with notes and an outbox row, keeping the form's enquiry-type values", async () => {
    const out = await inRollback(async (tx) => {
      const author = await tx.adminUser.create({
        data: { providerSubject: "synthetic|admin-1", email: "admin.synthetic@example.com", role: "ADMIN" },
      });
      const enquiry = await tx.enquiry.create({
        data: {
          name: "Synthetic Visitor",
          email: "visitor.synthetic@example.com",
          enquiryType: "EHS_SYSTEMS",
          subject: "Synthetic enquiry",
          message: "Synthetic message.",
          dedupeHash: "synthetic-hash",
          notes: { create: { body: "Synthetic note", authorId: author.id } },
          outbox: { create: {} },
        },
        include: { notes: true, outbox: true },
      });
      const [{ stored }] = await tx.$queryRaw<{ stored: string }[]>`SELECT "enquiryType"::text AS stored FROM "Enquiry" WHERE id = ${enquiry.id}`;
      await tx.enquiry.delete({ where: { id: enquiry.id } }); // cascades to notes and outbox
      const orphans = (await tx.enquiryNote.count()) + (await tx.emailOutbox.count());
      return { enquiry, stored, orphans };
    });
    expect(out.enquiry.status).toBe("NEW");
    expect(out.enquiry.notificationStatus).toBe("PENDING");
    expect(out.enquiry.outbox?.status).toBe("PENDING");
    expect(out.enquiry.notes[0].body).toBe("Synthetic note");
    expect(out.stored).toBe("ehs-systems");
    expect(out.orphans).toBe(0);
  });

  it("represents roles with least privilege by default", async () => {
    const user = await inRollback((tx) =>
      tx.adminUser.create({ data: { providerSubject: "synthetic|new-user", email: "new.synthetic@example.com" } }),
    );
    expect(user.role).toBe("EDITOR");
    expect(user.disabledAt).toBeNull();
  });

  describe("constraints", () => {
    it("rejects duplicate provider subjects and upper-case emails", async () => {
      await expectRejected(async (tx) => {
        await tx.adminUser.create({ data: { providerSubject: "synthetic|dup", email: "a.synthetic@example.com" } });
        await tx.adminUser.create({ data: { providerSubject: "synthetic|dup", email: "b.synthetic@example.com" } });
      }, /Unique constraint/i);
      await expectRejected(
        (tx) => tx.adminUser.create({ data: { providerSubject: "synthetic|case", email: "Upper.Synthetic@example.com" } }),
        /AdminUser_email_lowercase_check|check constraint/i,
      );
    });

    it("rejects slugs that aren't URL-safe", async () => {
      await expectRejected((tx) => tx.project.create({ data: project("Bad Slug") }), /Project_slug_format_check|check constraint/i);
    });

    it("allows only one featured insight and one published flagship", async () => {
      await expectRejected(async (tx) => {
        const category = await tx.insightCategory.create({ data: { slug: "synthetic-a", name: "Synthetic A" } });
        const base = { categoryId: category.id, excerpt: "x", readTime: "1 min read", imagePath: "/x.webp", imageAlt: "x", featured: true };
        await tx.insight.create({ data: { ...base, slug: "synthetic-one", title: "One" } });
        await tx.insight.create({ data: { ...base, slug: "synthetic-two", title: "Two" } });
      }, /Unique constraint|Insight_single_featured_key/i);
      await expectRejected(async (tx) => {
        await tx.project.create({ data: project("synthetic-flag-one", { tier: "FLAGSHIP", publishStatus: "PUBLISHED" }) });
        await tx.project.create({ data: project("synthetic-flag-two", { tier: "FLAGSHIP", publishStatus: "PUBLISHED" }) });
      }, /Unique constraint|Project_single_published_flagship_key/i);
    });

    it("keeps featured slots unique and blocks deleting a featured project", async () => {
      await expectRejected(async (tx) => {
        const a = await tx.project.create({ data: project("synthetic-slot-a") });
        const b = await tx.project.create({ data: project("synthetic-slot-b") });
        await tx.featuredPlacement.create({ data: { slot: "EXPERTISE_BRIDGE", position: 0, projectId: a.id } });
        await tx.featuredPlacement.create({ data: { slot: "EXPERTISE_BRIDGE", position: 0, projectId: b.id } });
      }, /Unique constraint/i);
      await expectRejected(async (tx) => {
        const a = await tx.project.create({ data: project("synthetic-restrict") });
        await tx.featuredPlacement.create({ data: { slot: "HOME_PROJECTS", position: 0, projectId: a.id } });
        await tx.project.delete({ where: { id: a.id } });
      }, /Foreign key|violates|restrict/i);
    });

    it("blocks deleting a category that still has insights", async () => {
      await expectRejected(async (tx) => {
        const category = await tx.insightCategory.create({ data: { slug: "synthetic-used", name: "Synthetic Used" } });
        await tx.insight.create({
          data: { slug: "synthetic-in-use", title: "x", categoryId: category.id, excerpt: "x", readTime: "1 min read", imagePath: "/x.webp", imageAlt: "x" },
        });
        await tx.insightCategory.delete({ where: { id: category.id } });
      }, /Foreign key|violates|restrict/i);
    });

    it("rejects invalid redirects and oversized enquiry messages", async () => {
      await expectRejected((tx) => tx.redirect.create({ data: { fromPath: "/same", toPath: "/same" } }), /Redirect_paths_check|check constraint/i);
      await expectRejected((tx) => tx.redirect.create({ data: { fromPath: "/a", toPath: "/b", statusCode: 302 } }), /Redirect_status_code_check|check constraint/i);
      await expectRejected(
        (tx) =>
          tx.enquiry.create({
            data: { name: "x", email: "x@example.com", enquiryType: "OTHER", subject: "x", message: "x".repeat(5001), dedupeHash: "x" },
          }),
        /Enquiry_message_length_check|check constraint/i,
      );
    });

    it("allows only one settings row", async () => {
      await expectRejected(
        (tx) =>
          tx.siteSettings.create({
            data: {
              id: 2, siteName: "x", siteTitle: "x", siteDescription: "x", publicEmail: "x@example.com", phoneDisplay: "x",
              phoneHref: "x", location: "x", businessHours: [], whatsappNumber: "x", whatsappMessage: "x",
            },
          }),
        /SiteSettings_singleton_check|check constraint/i,
      );
    });
  });

  it("leaves no synthetic rows behind", async () => {
    const counts = await Promise.all([
      db.adminUser.count(), db.project.count(), db.insight.count(), db.insightCategory.count(),
      db.enquiry.count(), db.enquiryNote.count(), db.emailOutbox.count(), db.redirect.count(), db.featuredPlacement.count(),
    ]);
    expect(counts.every((n) => n === 0)).toBe(true);
  });
});
