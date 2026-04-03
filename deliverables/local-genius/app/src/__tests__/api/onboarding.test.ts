/**
 * Tests for src/app/api/onboarding/route.ts
 * Covers: POST /api/onboarding and GET /api/onboarding
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

// ─── Mock db ──────────────────────────────────────────────────────────────────

const mockUpdateWhere = vi.fn().mockResolvedValue(undefined);
const mockUpdateSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet });

const mockSelectLimit = vi.fn();
const mockSelectWhere = vi.fn().mockReturnValue({ limit: mockSelectLimit });
const mockSelectFrom = vi.fn().mockReturnValue({ where: mockSelectWhere });
const mockSelect = vi.fn().mockReturnValue({ from: mockSelectFrom });

vi.mock("@/lib/db", () => ({
  db: {
    update: (...args: unknown[]) => mockUpdate(...args),
    select: (...args: unknown[]) => mockSelect(...args),
  },
}));

vi.mock("@/db/schema", () => ({
  businesses: { id: "id", organizationId: "organizationId" },
  conversations: { businessId: "businessId" },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  and: vi.fn(),
}));

// ─── Mock auth middleware ─────────────────────────────────────────────────────

const mockVerifyAuth = vi.fn();

vi.mock("@/api/middleware/auth", () => ({
  verifyAuth: (...args: unknown[]) => mockVerifyAuth(...args),
}));

import { POST, GET } from "@/app/api/onboarding/route";

const AUTH_CONTEXT = {
  userId: "user-uuid-001",
  organizationId: "org-uuid-001",
  businessId: "biz-uuid-001",
  plan: "base",
};

const MOCK_BUSINESS = {
  id: "biz-uuid-001",
  organizationId: "org-uuid-001",
  name: "Test Biz",
  vertical: "restaurant",
  city: "Austin",
  onboardingCompletedAt: null,
  priorityFocus: null,
};

async function makePostRequest(body: unknown): Promise<NextRequest> {
  return new NextRequest("http://localhost/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: "Bearer mock-token" },
    body: JSON.stringify(body),
  });
}

async function makeGetRequest(): Promise<NextRequest> {
  return new NextRequest("http://localhost/api/onboarding", {
    method: "GET",
    headers: { authorization: "Bearer mock-token" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockVerifyAuth.mockResolvedValue(AUTH_CONTEXT);
  mockSelectLimit.mockResolvedValue([MOCK_BUSINESS]);
});

// ─── POST /api/onboarding ─────────────────────────────────────────────────────

describe("POST /api/onboarding", () => {
  it("returns 401 when auth fails", async () => {
    mockVerifyAuth.mockResolvedValue(
      NextResponse.json({ error: { code: "UNAUTHORIZED", message: "No token" } }, { status: 401 })
    );

    const req = await makePostRequest({ step: "confirm" });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it("returns 400 on validation error (invalid step)", async () => {
    const req = await makePostRequest({ step: "invalid_step" });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 200 for 'confirm' step", async () => {
    const req = await makePostRequest(
      { step: "confirm", data: { address: "123 Main St", phone: "512-555-0100" } }
    );
    const response = await POST(req);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.step).toBe("confirm");
    expect(body.data.status).toBe("completed");
  });

  it("returns 200 for 'priority' step", async () => {
    const req = await makePostRequest({ step: "priority", data: { focus: "reviews" } });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.step).toBe("priority");
  });

  it("returns 200 for 'complete' step", async () => {
    const req = await makePostRequest({ step: "complete" });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.step).toBe("complete");
  });

  it("returns 200 for 'photos' step", async () => {
    const req = await makePostRequest({ step: "photos" });
    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  it("calls db.update for 'confirm' step when data is provided", async () => {
    const req = await makePostRequest(
      { step: "confirm", data: { address: "456 Oak Ave", phone: "512-555-9999" } }
    );
    await POST(req);
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockUpdateSet).toHaveBeenCalledWith(
      expect.objectContaining({ address: "456 Oak Ave", phone: "512-555-9999" })
    );
  });

  it("includes timestamp in meta", async () => {
    const req = await makePostRequest({ step: "complete" });
    const response = await POST(req);
    const body = await response.json();
    expect(body.meta).toHaveProperty("timestamp");
    expect(() => new Date(body.meta.timestamp)).not.toThrow();
  });
});

// ─── GET /api/onboarding ──────────────────────────────────────────────────────

describe("GET /api/onboarding", () => {
  it("returns 401 when auth fails", async () => {
    mockVerifyAuth.mockResolvedValue(
      NextResponse.json({ error: { code: "UNAUTHORIZED", message: "No token" } }, { status: 401 })
    );

    const req = await makeGetRequest();
    const response = await GET(req);
    expect(response.status).toBe(401);
  });

  it("returns business and conversationId", async () => {
    mockSelectLimit
      .mockResolvedValueOnce([MOCK_BUSINESS])
      .mockResolvedValueOnce([]);

    const req = await makeGetRequest();
    const response = await GET(req);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toHaveProperty("business");
    expect(body.data.business.id).toBe("biz-uuid-001");
    expect(body.data).toHaveProperty("conversationId");
  });

  it("returns conversationId when conversation exists", async () => {
    mockSelectLimit
      .mockResolvedValueOnce([MOCK_BUSINESS])
      .mockResolvedValueOnce([{ id: "conv-uuid-001" }]);

    const req = await makeGetRequest();
    const response = await GET(req);
    const body = await response.json();
    expect(body.data.conversationId).toBe("conv-uuid-001");
  });

  it("returns null conversationId when no conversation found", async () => {
    mockSelectLimit
      .mockResolvedValueOnce([MOCK_BUSINESS])
      .mockResolvedValueOnce([]);

    const req = await makeGetRequest();
    const response = await GET(req);
    const body = await response.json();
    expect(body.data.conversationId).toBeNull();
  });

  it("returns onboardingCompleted: false when not completed", async () => {
    mockSelectLimit
      .mockResolvedValueOnce([MOCK_BUSINESS])
      .mockResolvedValueOnce([]);

    const req = await makeGetRequest();
    const response = await GET(req);
    const body = await response.json();
    expect(body.data.business.onboardingCompleted).toBe(false);
  });

  it("returns onboardingCompleted: true when completed", async () => {
    mockSelectLimit
      .mockResolvedValueOnce([{ ...MOCK_BUSINESS, onboardingCompletedAt: new Date() }])
      .mockResolvedValueOnce([]);

    const req = await makeGetRequest();
    const response = await GET(req);
    const body = await response.json();
    expect(body.data.business.onboardingCompleted).toBe(true);
  });
});
