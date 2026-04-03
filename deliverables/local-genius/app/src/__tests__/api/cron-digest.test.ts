/**
 * Tests for src/app/api/cron/digest/route.ts
 * Covers: GET /api/cron/digest — authorization, success, and error paths
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ─── Mock generateAllDigests ──────────────────────────────────────────────────

const mockGenerateAllDigests = vi.fn();

vi.mock("@/services/digest", () => ({
  generateAllDigests: (...args: unknown[]) => mockGenerateAllDigests(...args),
}));

import { GET } from "@/app/api/cron/digest/route";

function makeRequest(authHeader?: string): NextRequest {
  const headers: HeadersInit = {};
  if (authHeader) headers["authorization"] = authHeader;
  return new NextRequest("http://localhost/api/cron/digest", { headers });
}

beforeEach(() => {
  vi.clearAllMocks();
  // Set a known CRON_SECRET in process.env
  process.env.CRON_SECRET = "test-cron-secret";
});

// ─── Authorization ────────────────────────────────────────────────────────────

describe("GET /api/cron/digest", () => {
  it("returns 401 when Authorization header is missing", async () => {
    const response = await GET(makeRequest());
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 when Authorization header has wrong secret", async () => {
    const response = await GET(makeRequest("Bearer wrong-secret"));
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 when CRON_SECRET env var is not set", async () => {
    delete process.env.CRON_SECRET;
    const response = await GET(makeRequest("Bearer any-secret"));
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 200 with digest stats on success", async () => {
    mockGenerateAllDigests.mockResolvedValue({
      generated: 10,
      failed: 0,
      errors: [],
    });

    const response = await GET(makeRequest("Bearer test-cron-secret"));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data.generated).toBe(10);
    expect(body.data.failed).toBe(0);
    expect(body.data.errors).toHaveLength(0);
    expect(body.data).toHaveProperty("timestamp");
  });

  it("returns errors array when some digests fail", async () => {
    mockGenerateAllDigests.mockResolvedValue({
      generated: 8,
      failed: 2,
      errors: ["Biz A: DB error", "Biz B: Network timeout"],
    });

    const response = await GET(makeRequest("Bearer test-cron-secret"));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data.generated).toBe(8);
    expect(body.data.failed).toBe(2);
    expect(body.data.errors).toHaveLength(2);
  });

  it("returns 500 when generateAllDigests throws", async () => {
    mockGenerateAllDigests.mockRejectedValue(new Error("Critical DB failure"));

    const response = await GET(makeRequest("Bearer test-cron-secret"));
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body.error.code).toBe("INTERNAL_ERROR");
    expect(body.error.message).toBe("Critical DB failure");
  });

  it("timestamp in response is a valid ISO string", async () => {
    mockGenerateAllDigests.mockResolvedValue({ generated: 1, failed: 0, errors: [] });

    const response = await GET(makeRequest("Bearer test-cron-secret"));
    const body = await response.json();
    expect(() => new Date(body.data.timestamp)).not.toThrow();
  });
});
