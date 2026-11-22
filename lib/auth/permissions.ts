/**
 * Approved role permissions (Architecture §2.11), as data the server-side Data Access Layer will
 * enforce in Stage 5. Hiding a control in the UI is never authorization; every protected
 * operation calls `can()` on the server with the user's role from the database.
 *
 * Uses the database enum, so a role added to the schema must be added here (TypeScript enforces it).
 */
import type { AdminRole } from "@/lib/generated/prisma/enums";

export const CAPABILITIES = [
  "enquiry.view", // view enquiries and client details
  "enquiry.update", // update status, add notes, archive
  "enquiry.retryNotification",
  "enquiry.delete", // permanent deletion
  "content.manage", // projects, insights, services, ...
  "settings.manage", // site settings
  "users.manage", // users and roles
] as const;

export type Capability = (typeof CAPABILITIES)[number];

export const ROLE_CAPABILITIES: Readonly<Record<AdminRole, ReadonlySet<Capability>>> = {
  OWNER: new Set<Capability>(CAPABILITIES),
  ADMIN: new Set<Capability>(["enquiry.view", "enquiry.update", "enquiry.retryNotification", "content.manage"]),
  EDITOR: new Set<Capability>(["content.manage"]), // never enquiries or client personal data
};

/** Disabled users have no capabilities. */
export function can(user: { role: AdminRole; disabledAt: Date | null }, capability: Capability): boolean {
  if (user.disabledAt) return false;
  return ROLE_CAPABILITIES[user.role].has(capability);
}
