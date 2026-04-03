/**
 * Tests for src/services/digest.ts
 * Covers: generateDigest, generateAllDigests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock db ──────────────────────────────────────────────────────────────────

const mockInsertReturning = vi.fn();
const mockInsertValues = vi.fn().mockReturnValue({ returning: mockInsertReturning });
const mockInsert = vi.fn().mockReturnValue({ values: mockInsertValues });

const mockSelectLimit = vi.fn();
const mockSelectOrderBy = vi.fn().mockReturnValue({ limit: mockSelectLimit });
// makeSelectWhere returns a thenable chain so both .limit() and direct await work
const makeSelectWhere = (resolveWith: unknown) => {
  const wh: Record<string, unknown> = {};
  wh.limit = vi.fn().mockResolvedValue(resolveWith);
  wh.orderBy = vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue(resolveWith) });
  wh.then = (resolve: (v: unknown) => unknown) => Promise.resolve(resolveWith).then(resolve);
  return wh;
};

const mockSelectFrom = vi.fn();
const mockSelect = vi.fn().mockReturnValue({ from: mockSelectFrom });

vi.mock("@/lib/db", () => ({
  db: {
    insert: (...args: unknown[]) => mockInsert(...args),
    select: (...args: unknown[]) => mockSelect(...args),
    _: {
      fullSchema: {
        conversations: { businessId: "businessId" },
      },
    },
  },
}));

vi.mock("@/db/schema", () => ({
  businesses: { id: "id", deletedAt: "deletedAt", onboardingCompletedAt: "onboardingCompletedAt" },
  weeklyDigests: {},
  reviews: {},
  actions: { businessId: "businessId", status: "status", executedAt: "executedAt", actionType: "actionType" },
  messages: {},
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  and: vi.fn(),
  gte: vi.fn(),
  desc: vi.fn(),
  sql: Object.assign(vi.fn().mockReturnValue({}), { raw: vi.fn().mockReturnValue({}) }),
}));

// ─── Mock services ────────────────────────────────────────────────────────────

vi.mock("@/services/ai", () => ({
  generateDigestNarrative: vi.fn().mockResolvedValue("Great week for Test Biz!"),
}));

vi.mock("@/services/analytics", () => ({
  getWeeklyAggregates: vi.fn().mockResolvedValue({
    websiteVisits: 100,
    phoneCalls: 5,
    bookings: 2,
    socialEngagement: 20,
    reviewsReceived: 3,
  }),
  getAttributionSummary: vi.fn().mockResolvedValue({
    directActions: 2,
    correlatedOutcomes: 5,
    estimatedValueCents: 1500,
  }),
}));

vi.mock("@/services/reviews", () => ({
  getReviewTrends: vi.fn().mockResolvedValue({
    totalReviews: 15,
    recentReviews: 3,
    averageRating: 4.2,
    recentAverageRating: 4.5,
    ratingTrend: 0.3,
    velocityPerWeek: 3.5,
  }),
}));

import { generateDigest, generateAllDigests } from "@/services/digest";

const BIZ_ID = "biz-uuid-001";
const ORG_ID = "org-uuid-001";

const MOCK_BUSINESS = {
  id: BIZ_ID,
  organizationId: ORG_ID,
  name: "Test Biz",
  vertical: "restaurant",
  city: "Austin",
  deletedAt: null,
  onboardingCompletedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();

  // Default: select chain returns business for .limit() and thenable .where()
  const defaultWhere = makeSelectWhere([MOCK_BUSINESS]);
  mockSelectFrom.mockReturnValue({ where: vi.fn().mockReturnValue(defaultWhere) });

  // Default insert
  mockInsertReturning.mockResolvedValue([{ id: "digest-uuid-001" }]);
});

// ─── generateDigest ───────────────────────────────────────────────────────────

describe("generateDigest", () => {
  it("returns null when business not found", async () => {
    const emptyWhere = makeSelectWhere([]);
    mockSelectFrom.mockReturnValue({ where: vi.fn().mockReturnValue(emptyWhere) });

    const result = await generateDigest("nonexistent", ORG_ID);
    expect(result).toBeNull();
  });
});

// ─── generateAllDigests ───────────────────────────────────────────────────────

describe("generateAllDigests", () => {
  it("returns { generated: 0, failed: 0, errors: [] } when no businesses", async () => {
    const emptyWhere = makeSelectWhere([]);
    mockSelectFrom.mockReturnValue({ where: vi.fn().mockReturnValue(emptyWhere) });

    const result = await generateAllDigests();
    expect(result.generated).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it("counts failures when generateDigest throws", async () => {
    // Outer businesses query returns one business
    const bizWhere = makeSelectWhere([MOCK_BUSINESS]);
    mockSelectFrom.mockReturnValueOnce({ where: vi.fn().mockReturnValue(bizWhere) });

    // Inner generateDigest business lookup throws
    mockSelectFrom.mockReturnValue({
      where: vi.fn().mockReturnValue({
        limit: vi.fn().mockRejectedValue(new Error("DB error")),
        then: (_: unknown, reject: (e: unknown) => unknown) =>
          Promise.reject(new Error("DB error")).catch(reject),
      }),
    });

    const result = await generateAllDigests();
    expect(result.failed).toBe(1);
    expect(result.generated).toBe(0);
    expect(result.errors[0]).toContain("DB error");
  });
});
