import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  assertDatabaseEnvironment,
  DatabaseEnvironmentError,
  expectedDatabaseEnvironment,
  neonEndpointId,
  withVerifiedTls,
} from "@/lib/db/environment";

// Synthetic endpoints only; the real production hash isn't used here.
const PROD = "ep-fake-production-000000";
const DEV = "ep-fake-development-111111";
const hashes = new Set([createHash("sha256").update(PROD).digest("hex")]);
const url = (endpoint: string, pooled = false) =>
  `postgresql://user:secret-value@${endpoint}${pooled ? "-pooler" : ""}.c-1.us-east-2.aws.neon.tech/neondb?sslmode=require`;
const check = (connectionString: string | undefined, declared: string | undefined, vercelEnv?: string) =>
  assertDatabaseEnvironment({ connectionString, declared, vercelEnv, variableName: "DATABASE_URL", productionHashes: hashes });

describe("database environment guard", () => {
  it("maps VERCEL_ENV to the allowed database environment", () => {
    expect(expectedDatabaseEnvironment("production")).toBe("production");
    expect(expectedDatabaseEnvironment("preview")).toBe("preview");
    expect(expectedDatabaseEnvironment("development")).toBe("development");
    expect(expectedDatabaseEnvironment(undefined)).toBe("development");
  });

  it("extracts the Neon endpoint ID from direct and pooled hosts", () => {
    expect(neonEndpointId(url(DEV))).toBe(DEV);
    expect(neonEndpointId(url(DEV, true))).toBe(DEV);
  });

  it("accepts development on a local machine", () => {
    expect(check(url(DEV, true), "development")).toBe("development");
  });

  it("rejects the production endpoint in development, direct or pooled", () => {
    expect(() => check(url(PROD), "development")).toThrow(/points at the production database/);
    expect(() => check(url(PROD, true), "development")).toThrow(DatabaseEnvironmentError);
  });

  it("rejects the production endpoint in preview", () => {
    expect(() => check(url(PROD), "preview", "preview")).toThrow(/production database/);
  });

  it("rejects DATABASE_ENVIRONMENT=production outside a production deployment", () => {
    expect(() => check(url(PROD), "production")).toThrow(/expects "development"/);
    expect(() => check(url(PROD), "production", "preview")).toThrow(/expects "preview"/);
  });

  it("rejects production deployments pointing at a non-production endpoint", () => {
    expect(() => check(url(DEV), "production", "production")).toThrow(/does not point at the production database/);
    expect(check(url(PROD, true), "production", "production")).toBe("production");
  });

  it("fails closed on missing or invalid configuration", () => {
    expect(() => check(undefined, "development")).toThrow(/DATABASE_URL is not set/);
    expect(() => check(url(DEV), undefined)).toThrow(/must be one of/);
    expect(() => check(url(DEV), "staging")).toThrow(/must be one of/);
    expect(() => check("not a url", "development")).toThrow(/not a valid URL/);
  });

  it("never includes the connection string in error messages", () => {
    try {
      check(url(PROD), "development");
    } catch (error) {
      expect(String(error)).not.toContain("secret-value");
      expect(String(error)).not.toContain(PROD);
    }
  });

  it("forces certificate and hostname verification for node-postgres", () => {
    const result = new URL(withVerifiedTls(url(DEV)));
    expect(result.searchParams.get("sslmode")).toBe("verify-full");
  });
});
