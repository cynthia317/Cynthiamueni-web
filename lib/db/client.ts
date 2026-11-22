/**
 * Server-only Prisma Client for the Next.js app (Database Plan §8).
 *
 * - Created lazily, so importing this module never connects (builds don't need a database).
 * - Cached on globalThis in development to survive hot reload.
 * - Connection, guard and TLS settings live in ./create-client.
 *
 * Not imported by any public page yet: the public site still reads static content (lib/content).
 */
import "server-only";

import type { PrismaClient } from "@/lib/generated/prisma/client";

import { createDbClient } from "./create-client";

const globalForDb = globalThis as unknown as { __cmDb?: PrismaClient };

export function getDb(): PrismaClient {
  if (globalForDb.__cmDb) return globalForDb.__cmDb;
  const { client } = createDbClient();
  if (process.env.NODE_ENV !== "production") globalForDb.__cmDb = client;
  return client;
}
