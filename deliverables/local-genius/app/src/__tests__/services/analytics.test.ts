/**
 * Tests for src/services/analytics.ts
 * Covers: recordEvent, getWeeklyAggregates, getAttributionSummary
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock db ──────────────────────────────────────────────────────────────────

const mockInsertReturning = vi.fn();
const mockInsertOnConflict = vi.fn().mockReturnValue({ set: vi.fn().mockResolvedValue(undefined) });
const mockInsertValues = vi.fn().mockReturnValue({
  returning: mockInsertReturning,
  onConflictDoUpdate: mockInsertOnConflict,
});
const mockInsert = vi.fn().mockReturnValue({ values: mockInsertValues });

const mockSelectLimitChain = vi.fn();
const mockSelectOrderByChain = vi.fn().mockReturnValue({ limit: mockSelectLimitChain });
const mockSelectWhereChain = vi.fn().mockReturnValue({
  orderBy: mockSelectOrderByChain,
  limit: mockSelectLimitChain,
});
const mockSelectFromChain = vi.fn().mockReturnValue({ where: mockSelectWhereChain });
const mockSelect = vi.fn().mockReturnValue({ from: mockSelectFromChain });

vi.mock("@/lib/db", () => ({
  db: {
    insert: (...args: unknown[]) => mockInsert(...args),
    select: (...args: unknown[]) => mockSelect(...args),
  },
}));

// ─── Mock schema ──────────────────────────────────────────────────────────────

vi.mock("@/db/schema", () => ({
  analyticsEvents: { businessId: "businessId", organizationId: "organizationId", eventType: "eventType", source: "source", metadata: "metadata", occurredAt: "occurredAt" },
  attributionEvents: { businessId: "businessId", organizationId: "organizationId", actionId: "actionId", eventType: "eventType", confidence: "confidence", attributionWindowHours: "attributionWindowHours", occurredAt: "occurredAt", valueCents: "valueCents" },
  benchmarkAggregates: { vertical: "vertical", city: "city", sizeBucket: "sizeBucket", periodType: "periodType", periodStart: "periodStart", metricName: "metricName", metricValue: "metricValue", sampleSize: "sampleSize" },
  actions: { businessId: "businessId", status: "status", executedAt: "executedAt", actionType: "actionType" },
  businesses: { id: "id", vertical: "vertical", city: "city", employeeCount: "employeeCount" },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  and: vi.fn(),
  gte: vi.fn(),
  sql: Object.assign(vi.fn().mockReturnValue({}), { raw: vi.fn().mockReturnValue({}) }),
  desc: vi.fn(),
}));

import {
  recordEvent,
  getWeeklyAggregates,
  getAttributionSummary,
} from "@/services/analytics";

const BIZ_ID = "biz-uuid-001";
const ORG_ID = "org-uuid-001";

beforeEach(() => {
  vi.clearAllMocks();

  // Default: insert returns an event
  mockInsertReturning.mockResolvedValue([{
    id: "event-uuid-001",
    businessId: BIZ_ID,
    organizationId: ORG_ID,
    eventType: "page_view",
    source: "google_analytics",
    metadata: {},
    occurredAt: new Date(),
  }]);

  // Default: select returns empty (no attribution action, no business)
  mockSelectLimitChain.mockResolvedValue([]);
});

// ─── recordEvent ──────────────────────────────────────────────────────────────

describe("recordEvent", () => {
  it("inserts an analytics event and returns it", async () => {
    const event = await recordEvent(BIZ_ID, ORG_ID, "page_view", "google_analytics");
    expect(event).toHaveProperty("id", "event-uuid-001");
    expect(event.eventType).toBe("page_view");
  });

  it("calls db.insert with correct event data", async () => {
    await recordEvent(BIZ_ID, ORG_ID, "phone_call", "direct", { source: "google" });
    expect(mockInsert).toHaveBeenCalled();
    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        businessId: BIZ_ID,
        organizationId: ORG_ID,
        eventType: "phone_call",
        source: "direct",
        metadata: { source: "google" },
      })
    );
  });

  it("uses empty metadata by default", async () => {
    await recordEvent(BIZ_ID, ORG_ID, "booking", "direct");
    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: {} })
    );
  });
});

// ─── getWeeklyAggregates ──────────────────────────────────────────────────────

describe("getWeeklyAggregates", () => {
  it("returns zeroed aggregates when db returns empty", async () => {
    // The select chain resolves to an array with one agg-like object
    mockSelectWhereChain.mockResolvedValue([undefined]);

    const result = await getWeeklyAggregates(BIZ_ID);
    expect(result.websiteVisits).toBe(0);
    expect(result.phoneCalls).toBe(0);
    expect(result.bookings).toBe(0);
    expect(result.socialEngagement).toBe(0);
    expect(result.reviewsReceived).toBe(0);
  });

  it("correctly maps DB aggregate columns", async () => {
    mockSelectWhereChain.mockResolvedValue([{
      pageViews: 42,
      phoneCalls: 7,
      bookings: 3,
      socialEngagement: 15,
      reviewsReceived: 2,
    }]);

    const result = await getWeeklyAggregates(BIZ_ID);
    expect(result.websiteVisits).toBe(42);
    expect(result.phoneCalls).toBe(7);
    expect(result.bookings).toBe(3);
    expect(result.socialEngagement).toBe(15);
    expect(result.reviewsReceived).toBe(2);
  });

  it("returns numeric types (not strings)", async () => {
    mockSelectWhereChain.mockResolvedValue([{
      pageViews: "10",
      phoneCalls: "2",
      bookings: "1",
      socialEngagement: "5",
      reviewsReceived: "0",
    }]);

    const result = await getWeeklyAggregates(BIZ_ID);
    expect(typeof result.websiteVisits).toBe("number");
    expect(typeof result.phoneCalls).toBe("number");
  });
});

// ─── getAttributionSummary ────────────────────────────────────────────────────

describe("getAttributionSummary", () => {
  it("returns zeroed summary when db returns empty", async () => {
    mockSelectWhereChain.mockResolvedValue([undefined]);

    const result = await getAttributionSummary(BIZ_ID);
    expect(result.directActions).toBe(0);
    expect(result.correlatedOutcomes).toBe(0);
    expect(result.estimatedValueCents).toBe(0);
  });

  it("correctly maps DB attribution columns", async () => {
    mockSelectWhereChain.mockResolvedValue([{
      directCount: 3,
      correlatedCount: 8,
      totalValue: 1500,
    }]);

    const result = await getAttributionSummary(BIZ_ID);
    expect(result.directActions).toBe(3);
    expect(result.correlatedOutcomes).toBe(8);
    expect(result.estimatedValueCents).toBe(1500);
  });

  it("returns numeric types", async () => {
    mockSelectWhereChain.mockResolvedValue([{
      directCount: "2",
      correlatedCount: "5",
      totalValue: "300",
    }]);

    const result = await getAttributionSummary(BIZ_ID);
    expect(typeof result.directActions).toBe("number");
    expect(typeof result.correlatedOutcomes).toBe("number");
    expect(typeof result.estimatedValueCents).toBe("number");
  });
});
