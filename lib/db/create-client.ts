/**
 * Prisma Client factory shared by the app (lib/db/client.ts, server-only) and Node scripts
 * (prisma/seed). Runs the environment guard before connecting; TLS uses verify-full.
 * Runtime queries use the POOLED Neon URL (DATABASE_URL).
 */
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/lib/generated/prisma/client";

import { assertDatabaseEnvironment, type DatabaseEnvironment, withVerifiedTls } from "./environment";

export function createDbClient(): { client: PrismaClient; environment: DatabaseEnvironment } {
  const connectionString = process.env.DATABASE_URL;
  const environment = assertDatabaseEnvironment({
    connectionString,
    declared: process.env.DATABASE_ENVIRONMENT,
    vercelEnv: process.env.VERCEL_ENV,
    variableName: "DATABASE_URL",
  });
  const adapter = new PrismaPg({
    connectionString: withVerifiedTls(connectionString as string),
    connectionTimeoutMillis: 10_000,
  });
  return { client: new PrismaClient({ adapter }), environment };
}
