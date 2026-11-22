/**
 * Server-only Prisma Client (Database Plan §8).
 *
 * - Runtime queries use the POOLED Neon URL (DATABASE_URL) through the node-postgres adapter.
 * - The environment guard runs before the first connection; TLS uses verify-full.
 * - Created lazily, so importing this module never connects (builds don't need a database).
 * - Cached on globalThis in development to survive hot reload.
 *
 * Not imported by any public page yet: the public site still reads static content (lib/content).
 */
import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/lib/generated/prisma/client";

import { assertDatabaseEnvironment, withVerifiedTls } from "./environment";

const globalForDb = globalThis as unknown as { __cmDb?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  assertDatabaseEnvironment({
    connectionString,
    declared: process.env.DATABASE_ENVIRONMENT,
    vercelEnv: process.env.VERCEL_ENV,
    variableName: "DATABASE_URL",
  });
  const adapter = new PrismaPg({
    connectionString: withVerifiedTls(connectionString as string),
    connectionTimeoutMillis: 10_000,
  });
  return new PrismaClient({ adapter });
}

export function getDb(): PrismaClient {
  if (globalForDb.__cmDb) return globalForDb.__cmDb;
  const client = createClient();
  if (process.env.NODE_ENV !== "production") globalForDb.__cmDb = client;
  return client;
}
