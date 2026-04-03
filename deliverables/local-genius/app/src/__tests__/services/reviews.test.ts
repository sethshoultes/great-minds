/**
 * Tests for src/services/reviews.ts
 * Covers: fetchGoogleReviews, syncReviews, getReviewTrends
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock db ──────────────────────────────────────────────────────────────────

const mockInsertReturning = vi.fn();
const mockInsertValues = vi.fn().mockReturnValue({ returning: mockInsertReturning });
const mockInsert = vi.fn().mockReturnValue({ values: mockInsertValues });

const mockSelectOrderBy = vi.fn();
const mockSelectLimit = vi.fn();
const mockSelectWhere = vi.fn().mockReturnValue({
  orderBy: mockSelectOrderBy,
  limit: mockSelectLimit,
});
const mockSelectFrom = vi.fn().mockReturnValue({ where: mockSelectWhere });
const mockSelect = vi.fn().mockReturnValue({ from: mockSelectFrom });

vi.mock("@/lib/db", () => ({
  db: {
    insert: (...args: unknown[]) => mockInsert(...args),
    select: (...args: unknown[]) => mockSelect(...args),
  },
}));

vi.mock("@/db/schema", () => ({
  reviews: {
    businessId: "businessId",
    platform: "platform",
    externalReviewId: "externalReviewId",
    rating: "rating",
    reviewDate: "reviewDate",
  },
  actions: {},
  businesses: { id: "id", organizationId: "organizationId" },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  and: vi.fn(),
}));

// ─── Mock AI service ──────────────────────────────────────────────────────────

vi.mock("@/services/ai", () => ({
  generateReviewResponse: vi.fn().mockResolvedValue("Thank you for your review!"),
}));

import {
  fetchGoogleReviews,
  syncReviews,
  getReviewTrends,
} from "@/services/reviews";

const BIZ_ID = "biz-uuid-001";
const ORG_ID = "org-uuid-001";

const MOCK_BUSINESS = {
  id: BIZ_ID,
  organizationId: ORG_ID,
  name: "Test Biz",
  vertical: "restaurant",
  city: "Austin",
  autonomyLevel: 0,
};

beforeEach(() => {
  vi.clearAllMocks();

  // Default db responses
  mockSelectLimit.mockResolvedValue([MOCK_BUSINESS]);
  mockSelectOrderBy.mockResolvedValue([]);
  mockInsertReturning.mockResolvedValue([{ id: "review-new-001" }]);
});

// ─── fetchGoogleReviews ───────────────────────────────────────────────────────

describe("fetchGoogleReviews", () => {
  it("returns an object with reviews array, totalReviewCount, and averageRating", async () => {
    const result = await fetchGoogleReviews("platform-biz-id");
    expect(result).toHaveProperty("reviews");
    expect(Array.isArray(result.reviews)).toBe(true);
    expect(result).toHaveProperty("totalReviewCount");
    expect(result).toHaveProperty("averageRating");
  });

  it("returns empty reviews array (mock implementation)", async () => {
    const result = await fetchGoogleReviews("any-id");
    expect(result.reviews).toHaveLength(0);
    expect(result.totalReviewCount).toBe(0);
    expect(result.averageRating).toBe(0);
  });
});

// ─── syncReviews ──────────────────────────────────────────────────────────────

describe("syncReviews", () => {
  it("returns { synced: 0, drafted: 0 } when business not found", async () => {
    mockSelectLimit.mockResolvedValue([]);

    const result = await syncReviews("nonexistent", ORG_ID);
    expect(result).toEqual({ synced: 0, drafted: 0 });
  });

  it("returns { synced: 0, drafted: 0 } when no new Google reviews (empty mock)", async () => {
    // Business found, fetchGoogleReviews returns [] (default mock)
    const result = await syncReviews(BIZ_ID, ORG_ID);
    expect(result).toEqual({ synced: 0, drafted: 0 });
  });
});

// ─── getReviewTrends ──────────────────────────────────────────────────────────

describe("getReviewTrends", () => {
  it("returns all zeroes when there are no reviews", async () => {
    mockSelectOrderBy.mockResolvedValue([]);

    const result = await getReviewTrends(BIZ_ID, 7);
    expect(result.totalReviews).toBe(0);
    expect(result.recentReviews).toBe(0);
    expect(result.averageRating).toBe(0);
    expect(result.recentAverageRating).toBe(0);
  });

  it("calculates totalReviews and averageRating correctly", async () => {
    const now = new Date();
    mockSelectOrderBy.mockResolvedValue([
      { rating: 5, reviewDate: now },
      { rating: 3, reviewDate: now },
      { rating: 4, reviewDate: now },
    ]);

    const result = await getReviewTrends(BIZ_ID, 30);
    expect(result.totalReviews).toBe(3);
    expect(result.averageRating).toBe(4); // (5+3+4)/3 = 4.0
  });

  it("returns correct velocityPerWeek", async () => {
    const now = new Date();
    const reviews = Array.from({ length: 7 }, () => ({
      rating: 4,
      reviewDate: now,
    }));
    mockSelectOrderBy.mockResolvedValue(reviews);

    const result = await getReviewTrends(BIZ_ID, 7);
    // 7 recent reviews over 7 days = 7 per week
    expect(result.velocityPerWeek).toBe(7);
  });

  it("rounds averageRating to 1 decimal place", async () => {
    const now = new Date();
    mockSelectOrderBy.mockResolvedValue([
      { rating: 5, reviewDate: now },
      { rating: 4, reviewDate: now },
      { rating: 4, reviewDate: now },
    ]);

    const result = await getReviewTrends(BIZ_ID, 30);
    expect(result.averageRating).toBe(4.3); // (5+4+4)/3 = 4.333... -> 4.3
  });

  it("returns ratingTrend (recent vs overall delta)", async () => {
    const now = new Date();
    const recent = { rating: 5, reviewDate: now };
    const old = { rating: 3, reviewDate: new Date("2020-01-01") };
    mockSelectOrderBy.mockResolvedValue([recent, old]);

    const result = await getReviewTrends(BIZ_ID, 7);
    expect(typeof result.ratingTrend).toBe("number");
  });
});
