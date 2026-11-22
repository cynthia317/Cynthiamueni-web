import { describe, expect, it } from "vitest";

import { can, CAPABILITIES, type Capability } from "@/lib/auth/permissions";
import type { AdminRole } from "@/lib/generated/prisma/enums";

// Architecture §2.11, row by row.
const MATRIX: Record<Capability, Record<AdminRole, boolean>> = {
  "enquiry.view": { OWNER: true, ADMIN: true, EDITOR: false },
  "enquiry.update": { OWNER: true, ADMIN: true, EDITOR: false },
  "enquiry.retryNotification": { OWNER: true, ADMIN: true, EDITOR: false },
  "enquiry.delete": { OWNER: true, ADMIN: false, EDITOR: false },
  "content.manage": { OWNER: true, ADMIN: true, EDITOR: true },
  "settings.manage": { OWNER: true, ADMIN: false, EDITOR: false },
  "users.manage": { OWNER: true, ADMIN: false, EDITOR: false },
};

describe("role permissions", () => {
  it("covers every capability", () => {
    expect(Object.keys(MATRIX).sort()).toEqual([...CAPABILITIES].sort());
  });

  for (const [capability, roles] of Object.entries(MATRIX) as [Capability, Record<AdminRole, boolean>][]) {
    it(`matches the approved matrix for ${capability}`, () => {
      for (const [role, allowed] of Object.entries(roles) as [AdminRole, boolean][]) {
        expect(can({ role, disabledAt: null }, capability)).toBe(allowed);
      }
    });
  }

  it("gives EDITOR no access to enquiries or client data", () => {
    const editor = { role: "EDITOR" as const, disabledAt: null };
    expect(CAPABILITIES.filter((c) => c.startsWith("enquiry.")).some((c) => can(editor, c))).toBe(false);
  });

  it("gives disabled users nothing, including OWNER", () => {
    const disabled = { role: "OWNER" as const, disabledAt: new Date() };
    expect(CAPABILITIES.some((c) => can(disabled, c))).toBe(false);
  });
});
