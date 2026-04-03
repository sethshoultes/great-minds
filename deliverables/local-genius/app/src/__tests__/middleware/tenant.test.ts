/**
 * Tests for src/api/middleware/tenant.ts
 * Covers: setTenantContext, getSizeBucket
 */

import { describe, it, expect, vi } from "vitest";
import { setTenantContext, getSizeBucket } from "@/api/middleware/tenant";
import type { AuthContext } from "@/api/middleware/auth";

const AUTH: AuthContext = {
  userId: "user-uuid-001",
  organizationId: "org-uuid-001",
  businessId: "biz-uuid-001",
  plan: "base",
};

// ─── setTenantContext ─────────────────────────────────────────────────────────

describe("setTenantContext", () => {
  it("calls db.execute with the correct SQL and org_id parameter", async () => {
    const mockExecute = vi.fn().mockResolvedValue(undefined);
    const mockDb = { execute: mockExecute };

    await setTenantContext(mockDb, AUTH);

    expect(mockExecute).toHaveBeenCalledOnce();
    const callArg = mockExecute.mock.calls[0][0];
    expect(callArg.sql).toBe(
      "SELECT set_config('app.current_org_id', $1, true)"
    );
    expect(callArg.params).toEqual([AUTH.organizationId]);
  });

  it("passes the organization_id from the auth context", async () => {
    const mockExecute = vi.fn().mockResolvedValue(undefined);
    const mockDb = { execute: mockExecute };

    await setTenantContext(mockDb, { ...AUTH, organizationId: "org-uuid-999" });

    const callArg = mockExecute.mock.calls[0][0];
    expect(callArg.params[0]).toBe("org-uuid-999");
  });

  it("propagates errors thrown by db.execute", async () => {
    const mockExecute = vi.fn().mockRejectedValue(new Error("DB connection failed"));
    const mockDb = { execute: mockExecute };

    await expect(setTenantContext(mockDb, AUTH)).rejects.toThrow(
      "DB connection failed"
    );
  });
});

// ─── getSizeBucket ────────────────────────────────────────────────────────────

describe("getSizeBucket", () => {
  it("returns '1-5' for null employee count", () => {
    expect(getSizeBucket(null)).toBe("1-5");
  });

  it("returns '1-5' for 0 employees", () => {
    expect(getSizeBucket(0)).toBe("1-5");
  });

  it("returns '1-5' for 1 employee", () => {
    expect(getSizeBucket(1)).toBe("1-5");
  });

  it("returns '1-5' for exactly 5 employees", () => {
    expect(getSizeBucket(5)).toBe("1-5");
  });

  it("returns '6-15' for 6 employees", () => {
    expect(getSizeBucket(6)).toBe("6-15");
  });

  it("returns '6-15' for exactly 15 employees", () => {
    expect(getSizeBucket(15)).toBe("6-15");
  });

  it("returns '16-50' for 16 employees", () => {
    expect(getSizeBucket(16)).toBe("16-50");
  });

  it("returns '16-50' for 50 employees", () => {
    expect(getSizeBucket(50)).toBe("16-50");
  });

  it("returns '16-50' for very large businesses", () => {
    expect(getSizeBucket(1000)).toBe("16-50");
  });
});
