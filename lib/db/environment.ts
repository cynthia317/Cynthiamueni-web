/**
 * Database environment guard (Architecture §2.12 item 4).
 *
 * Every database connection, at runtime and in the Prisma CLI, passes through
 * `assertDatabaseEnvironment` first. It fails closed when:
 *  - DATABASE_ENVIRONMENT is missing or invalid;
 *  - DATABASE_ENVIRONMENT doesn't match the deployment (VERCEL_ENV), e.g. "production" on a laptop;
 *  - a non-production environment points at the production Neon endpoint;
 *  - production points at anything other than the production endpoint.
 *
 * Endpoints are compared by SHA-256 of the Neon endpoint ID, so the repository doesn't publish
 * the production identifier. Error messages never include connection strings.
 *
 * Kept dependency-free (except node:crypto) so prisma.config.ts can import it too.
 */
import { createHash } from "node:crypto";

export type DatabaseEnvironment = "production" | "preview" | "development";

const ENVIRONMENTS: readonly DatabaseEnvironment[] = ["production", "preview", "development"];

/** SHA-256 of the production Neon endpoint ID (project red-forest-05302661, branch "production"). */
export const PRODUCTION_ENDPOINT_SHA256: ReadonlySet<string> = new Set([
  "3707bedcdd375d43ec08c51e1795def5954a5ca11a98505a4aaf1c2d5c07c1af",
]);

export class DatabaseEnvironmentError extends Error {
  constructor(message: string) {
    super(`Database environment check failed: ${message}`);
    this.name = "DatabaseEnvironmentError";
  }
}

/** The environment a process is allowed to use, derived from Vercel's system variable. */
export function expectedDatabaseEnvironment(vercelEnv: string | undefined): DatabaseEnvironment {
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "preview";
  return "development"; // local machines and `vercel dev`
}

/** Neon endpoint ID from a connection string's host ("ep-xxx" or "ep-xxx-pooler" → "ep-xxx"). */
export function neonEndpointId(connectionString: string): string {
  let host: string;
  try {
    host = new URL(connectionString).hostname;
  } catch {
    throw new DatabaseEnvironmentError("the connection string is not a valid URL");
  }
  return host.split(".")[0].replace(/-pooler$/, "");
}

export function isProductionEndpoint(connectionString: string, productionHashes = PRODUCTION_ENDPOINT_SHA256): boolean {
  const hash = createHash("sha256").update(neonEndpointId(connectionString)).digest("hex");
  return productionHashes.has(hash);
}

export interface DatabaseEnvironmentInput {
  connectionString: string | undefined;
  declared: string | undefined; // DATABASE_ENVIRONMENT
  vercelEnv: string | undefined; // VERCEL_ENV
  variableName: string; // for error messages only
  productionHashes?: ReadonlySet<string>;
}

export function assertDatabaseEnvironment(input: DatabaseEnvironmentInput): DatabaseEnvironment {
  const { connectionString, declared, vercelEnv, variableName, productionHashes = PRODUCTION_ENDPOINT_SHA256 } = input;

  if (!connectionString) throw new DatabaseEnvironmentError(`${variableName} is not set`);
  if (!declared || !ENVIRONMENTS.includes(declared as DatabaseEnvironment)) {
    throw new DatabaseEnvironmentError("DATABASE_ENVIRONMENT must be one of production, preview or development");
  }
  const environment = declared as DatabaseEnvironment;
  const expected = expectedDatabaseEnvironment(vercelEnv);
  if (environment !== expected) {
    throw new DatabaseEnvironmentError(`DATABASE_ENVIRONMENT is "${environment}" but this deployment expects "${expected}"`);
  }

  const production = isProductionEndpoint(connectionString, productionHashes);
  if (environment !== "production" && production) {
    throw new DatabaseEnvironmentError(`${variableName} points at the production database, which is not allowed in ${environment}`);
  }
  if (environment === "production" && !production) {
    throw new DatabaseEnvironmentError(`${variableName} does not point at the production database`);
  }
  return environment;
}

/**
 * Runtime TLS: require full certificate and hostname verification with node-postgres.
 * (pg currently treats "require" as verify-full but will adopt weaker libpq semantics in v9.)
 */
export function withVerifiedTls(connectionString: string): string {
  const url = new URL(connectionString);
  url.searchParams.set("sslmode", "verify-full");
  return url.toString();
}
