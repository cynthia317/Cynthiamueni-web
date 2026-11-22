/**
 * Seeds the existing public content into a NON-PRODUCTION database (Database Plan §4, §10).
 *
 *   npm run db:seed              dry run: reports what would be created, changes nothing
 *   npm run db:seed -- --apply   creates the missing records in one transaction
 *
 * Rules:
 *  - Refuses production (DATABASE_ENVIRONMENT=production or the production endpoint), always.
 *  - Create-only and idempotent: a record whose stable key already exists is never updated, so
 *    content edited in the admin is never overwritten. Differences from the static source are
 *    reported as "differs (kept)".
 *  - Featured placements are created only where both the slot position and the project are free.
 *
 * Runs with Node's built-in TypeScript support (see scripts/ts-paths.mjs); no extra runtime.
 */
import { existsSync } from "node:fs";

import { createDbClient } from "@/lib/db/create-client";
import { isProductionEndpoint } from "@/lib/db/environment";
import type { Prisma, PrismaClient } from "@/lib/generated/prisma/client";

import { buildSeedData, type SeedData } from "./data";

type Tx = Prisma.TransactionClient | PrismaClient;
type Action = "create" | "unchanged" | "differs (kept)";
interface PlanRow {
  model: string;
  key: string;
  action: Action;
  fields?: string[];
}

const APPLY = process.argv.includes("--apply");

function loadLocalEnv() {
  // Same rule as the integration tests: injected variables win; otherwise use .env.local.
  if (!process.env.DATABASE_ENVIRONMENT && existsSync(".env.local")) process.loadEnvFile(".env.local");
}

const iso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
function diffFields(expected: Record<string, unknown>, actual: Record<string, unknown>): string[] {
  return Object.keys(expected).filter((key) => !same(expected[key], actual[key]));
}

async function plan(db: Tx, data: SeedData): Promise<PlanRow[]> {
  const rows: PlanRow[] = [];

  const categories = new Map((await db.insightCategory.findMany()).map((c) => [c.name, c]));
  for (const c of data.categories) {
    const existing = categories.get(c.name);
    if (!existing) rows.push({ model: "InsightCategory", key: c.name, action: "create" });
    else {
      const fields = diffFields({ slug: c.slug, sortOrder: c.sortOrder }, existing);
      rows.push({ model: "InsightCategory", key: c.name, action: fields.length ? "differs (kept)" : "unchanged", fields });
    }
  }

  const insights = new Map(
    (await db.insight.findMany({ include: { category: true } })).map((i) => [i.slug, i]),
  );
  for (const i of data.insights) {
    const existing = insights.get(i.slug);
    if (!existing) rows.push({ model: "Insight", key: i.slug, action: "create" });
    else {
      const { categoryName, publishedAt, ...rest } = i;
      const fields = diffFields(
        { ...rest, categoryName, publishedAt },
        { ...existing, categoryName: existing.category.name, publishedAt: iso(existing.publishedAt) },
      );
      rows.push({ model: "Insight", key: i.slug, action: fields.length ? "differs (kept)" : "unchanged", fields });
    }
  }

  const projects = new Map(
    (await db.project.findMany({ include: { relatedInsights: { select: { slug: true } } } })).map((p) => [p.slug, p]),
  );
  for (const p of data.projects) {
    const existing = projects.get(p.slug);
    if (!existing) rows.push({ model: "Project", key: p.slug, action: "create" });
    else {
      const fields = diffFields(
        { ...p, relatedInsightSlugs: [...p.relatedInsightSlugs].sort() },
        { ...existing, relatedInsightSlugs: existing.relatedInsights.map((r) => r.slug).sort() },
      );
      rows.push({ model: "Project", key: p.slug, action: fields.length ? "differs (kept)" : "unchanged", fields });
    }
  }

  const services = new Map((await db.service.findMany()).map((s) => [s.slug, s]));
  for (const s of data.services) {
    const existing = services.get(s.slug);
    if (!existing) rows.push({ model: "Service", key: s.slug, action: "create" });
    else {
      const fields = diffFields({ ...s }, existing);
      rows.push({ model: "Service", key: s.slug, action: fields.length ? "differs (kept)" : "unchanged", fields });
    }
  }

  const placements = await db.featuredPlacement.findMany({ include: { project: { select: { slug: true } } } });
  for (const pl of data.placements) {
    const key = `${pl.slot}#${pl.position}`;
    const atPosition = placements.find((x) => x.slot === pl.slot && x.position === pl.position);
    const projectInSlot = placements.find((x) => x.slot === pl.slot && x.project.slug === pl.projectSlug);
    if (!atPosition && !projectInSlot) rows.push({ model: "FeaturedPlacement", key: `${key} -> ${pl.projectSlug}`, action: "create" });
    else if (atPosition?.project.slug === pl.projectSlug) rows.push({ model: "FeaturedPlacement", key: `${key} -> ${pl.projectSlug}`, action: "unchanged" });
    else rows.push({ model: "FeaturedPlacement", key: `${key} -> ${pl.projectSlug}`, action: "differs (kept)", fields: ["slot already configured"] });
  }

  return rows;
}

async function apply(tx: Prisma.TransactionClient, data: SeedData, rows: PlanRow[]) {
  const toCreate = (model: string) => new Set(rows.filter((r) => r.model === model && r.action === "create").map((r) => r.key));

  const newCategories = toCreate("InsightCategory");
  for (const c of data.categories) if (newCategories.has(c.name)) await tx.insightCategory.create({ data: c });
  const categoryIds = new Map((await tx.insightCategory.findMany()).map((c) => [c.name, c.id]));

  const newInsights = toCreate("Insight");
  for (const i of data.insights) {
    if (!newInsights.has(i.slug)) continue;
    const { categoryName, publishedAt, content, ...rest } = i;
    await tx.insight.create({
      data: {
        ...rest,
        content: content as Prisma.InputJsonValue,
        publishedAt: new Date(`${publishedAt}T00:00:00Z`),
        category: { connect: { id: categoryIds.get(categoryName) as string } },
      },
    });
  }

  const newProjects = toCreate("Project");
  for (const p of data.projects) {
    if (!newProjects.has(p.slug)) continue;
    const { relatedInsightSlugs, capabilities, ...rest } = p;
    await tx.project.create({
      data: {
        ...rest,
        capabilities: capabilities as unknown as Prisma.InputJsonValue,
        relatedInsights: { connect: relatedInsightSlugs.map((slug) => ({ slug })) },
      },
    });
  }

  const newServices = toCreate("Service");
  for (const s of data.services) if (newServices.has(s.slug)) await tx.service.create({ data: s });

  const newPlacements = toCreate("FeaturedPlacement");
  const projectIds = new Map((await tx.project.findMany({ select: { slug: true, id: true } })).map((p) => [p.slug, p.id]));
  for (const pl of data.placements) {
    if (!newPlacements.has(`${pl.slot}#${pl.position} -> ${pl.projectSlug}`)) continue;
    await tx.featuredPlacement.create({
      data: { slot: pl.slot, position: pl.position, projectId: projectIds.get(pl.projectSlug) as string },
    });
  }
}

function report(rows: PlanRow[]) {
  const models = [...new Set(rows.map((r) => r.model))];
  for (const model of models) {
    const own = rows.filter((r) => r.model === model);
    const count = (a: Action) => own.filter((r) => r.action === a).length;
    console.log(`${model.padEnd(18)} create ${String(count("create")).padStart(2)} | unchanged ${String(count("unchanged")).padStart(2)} | differs (kept) ${count("differs (kept)")}`);
    for (const r of own) console.log(`    ${r.action.padEnd(15)} ${r.key}${r.fields?.length ? `  [${r.fields.join(", ")}]` : ""}`);
  }
}

async function main() {
  loadLocalEnv();
  if (process.env.DATABASE_ENVIRONMENT === "production" || (process.env.DATABASE_URL && isProductionEndpoint(process.env.DATABASE_URL))) {
    throw new Error("Seed refused: this script never runs against production.");
  }
  const { client: db, environment } = createDbClient(); // runs the environment guard
  try {
    const [{ endpoint }] = await db.$queryRaw<{ endpoint: string }[]>`SELECT current_setting('neon.endpoint_id', true) AS endpoint`;
    console.log(`Seed ${APPLY ? "APPLY" : "DRY RUN"} | environment: ${environment} | server endpoint: ${endpoint}\n`);

    const data = buildSeedData();
    const rows = await plan(db, data);
    report(rows);
    const creates = rows.filter((r) => r.action === "create").length;

    if (!APPLY) {
      console.log(`\nDry run only: ${creates} record(s) would be created. Nothing was written. Re-run with --apply to create them.`);
      return;
    }
    if (creates === 0) {
      console.log("\nNothing to create. The database already contains every seed record.");
      return;
    }
    await db.$transaction((tx) => apply(tx, data, rows), { maxWait: 30_000, timeout: 120_000 });
    const after = await plan(db, data);
    const remaining = after.filter((r) => r.action === "create").length;
    console.log(`\nApplied: ${creates} record(s) created in one transaction. Records still missing afterwards: ${remaining}.`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(String(error instanceof Error ? error.message : error).replace(/postgres(ql)?:\/\/\S+/g, "<redacted>"));
  process.exitCode = 1;
});
