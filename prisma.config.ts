/**
 * Prisma CLI configuration (Prisma 7; Database Plan §8).
 *
 * - Prisma 7 doesn't load .env files, so this uses Next.js's own loader (@next/env, already a
 *   dependency) to read .env.local exactly as the app does.
 * - The CLI (migrations, introspection) uses the DIRECT connection: DATABASE_URL_UNPOOLED.
 * - `prisma generate` must work without any database variables (Vercel builds without them),
 *   so the URL is optional here instead of using env().
 * - When a URL is present, the environment guard runs first: a production URL is rejected
 *   unless DATABASE_ENVIRONMENT=production and VERCEL_ENV=production are both set deliberately.
 *
 * Production migrations are a separate, explicitly approved step (Architecture §2.12 item 5).
 */
import nextEnv from "@next/env";
import { defineConfig } from "prisma/config";

import { assertDatabaseEnvironment } from "./lib/db/environment";

nextEnv.loadEnvConfig(process.cwd(), false, { info: () => {}, error: console.error });

const directUrl = process.env.DATABASE_URL_UNPOOLED;
// Check every database URL that is present (direct and pooled). On Vercel this runs during
// `postinstall: prisma generate`, so a mis-scoped variable fails the build before deployment.
for (const variableName of ["DATABASE_URL_UNPOOLED", "DATABASE_URL"] as const) {
  const connectionString = process.env[variableName];
  if (!connectionString) continue;
  assertDatabaseEnvironment({
    connectionString,
    declared: process.env.DATABASE_ENVIRONMENT,
    vercelEnv: process.env.VERCEL_ENV,
    variableName,
  });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: directUrl ?? "" },
});
