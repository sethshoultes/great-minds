/**
 * Tests for src/services/social.ts
 * Covers: generatePost, publishPost, createAndPublishPost
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock db ──────────────────────────────────────────────────────────────────

const mockInsertReturning = vi.fn();
const mockInsertValues = vi.fn().mockReturnValue({ returning: mockInsertReturning });
const mockInsert = vi.fn().mockReturnValue({ values: mockInsertValues });

const mockUpdateWhere = vi.fn().mockResolvedValue(undefined);
const mockUpdateSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet });

const mockSelectLimit = vi.fn();
const mockSelectWhere = vi.fn().mockReturnValue({ limit: mockSelectLimit });
const mockSelectFrom = vi.fn().mockReturnValue({ where: mockSelectWhere });
const mockSelect = vi.fn().mockReturnValue({ from: mockSelectFrom });

vi.mock("@/lib/db", () => ({
  db: {
    insert: (...args: unknown[]) => mockInsert(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
    select: (...args: unknown[]) => mockSelect(...args),
  },
}));

vi.mock("@/db/schema", () => ({
  actions: { id: "id" },
  contentItems: {},
  businesses: {},
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

// ─── Mock AI service ──────────────────────────────────────────────────────────

vi.mock("@/services/ai", () => ({
  generateSocialPost: vi.fn().mockResolvedValue("Check out our specials today! #Austin #LocalFood #Restaurant"),
}));

import {
  generatePost,
  publishPost,
  createAndPublishPost,
} from "@/services/social";

const BIZ_ID = "biz-uuid-001";
const ORG_ID = "org-uuid-001";

const MOCK_BUSINESS = {
  id: BIZ_ID,
  organizationId: ORG_ID,
  name: "Test Biz",
  vertical: "restaurant",
  city: "Austin",
};

beforeEach(() => {
  vi.clearAllMocks();

  mockSelectLimit.mockResolvedValue([MOCK_BUSINESS]);
  mockInsertReturning.mockResolvedValue([{
    id: "content-uuid-001",
    businessId: BIZ_ID,
    organizationId: ORG_ID,
    contentType: "social_post",
    content: {},
  }]);
});

// ─── generatePost ─────────────────────────────────────────────────────────────

describe("generatePost", () => {
  it("returns post text and platform", async () => {
    const result = await generatePost(BIZ_ID, "lunch specials");
    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("platform");
  });

  it("appends 'Posted by LocalGenius' watermark", async () => {
    const result = await generatePost(BIZ_ID, "topic");
    expect(result.text).toContain("Posted by LocalGenius");
  });

  it("defaults to instagram platform", async () => {
    const result = await generatePost(BIZ_ID, "topic");
    expect(result.platform).toBe("instagram");
  });

  it("respects facebook platform option", async () => {
    const result = await generatePost(BIZ_ID, "topic", "facebook");
    expect(result.platform).toBe("facebook");
  });

  it("throws when business is not found", async () => {
    mockSelectLimit.mockResolvedValue([]);
    await expect(generatePost("nonexistent", "topic")).rejects.toThrow(
      "Business not found"
    );
  });
});

// ─── publishPost ─────────────────────────────────────────────────────────────

describe("publishPost", () => {
  const credentials = { accessToken: "tok", pageId: "page-1" };

  it("returns a successful result for instagram", async () => {
    const result = await publishPost(
      "instagram",
      { text: "Hello world!" },
      credentials
    );
    expect(result.success).toBe(true);
    expect(result.platform).toBe("instagram");
  });

  it("returns a successful result for facebook", async () => {
    const result = await publishPost(
      "facebook",
      { text: "Hello world!" },
      credentials
    );
    expect(result.success).toBe(true);
    expect(result.platform).toBe("facebook");
  });

  it("returns an id in the result", async () => {
    const result = await publishPost("instagram", { text: "Test" }, credentials);
    expect(typeof result.id).toBe("string");
    expect(result.id.length).toBeGreaterThan(0);
  });

  it("returns an instagram postUrl for instagram", async () => {
    const result = await publishPost("instagram", { text: "Test" }, credentials);
    expect(result.postUrl).toContain("instagram.com");
  });

  it("returns a facebook postUrl for facebook", async () => {
    const result = await publishPost("facebook", { text: "Test" }, credentials);
    expect(result.postUrl).toContain("facebook.com");
  });
});

// ─── createAndPublishPost ────────────────────────────────────────────────────

describe("createAndPublishPost", () => {
  it("returns content, action, published, and postUrl", async () => {
    // Set up action insert returning
    mockInsertReturning
      .mockResolvedValueOnce([{ id: "content-uuid-001", contentType: "social_post", content: {} }])
      .mockResolvedValueOnce([{ id: "action-uuid-001", actionType: "social_post", status: "proposed" }]);

    const result = await createAndPublishPost(BIZ_ID, ORG_ID, "lunch specials");
    expect(result).toHaveProperty("content");
    expect(result).toHaveProperty("action");
    expect(result).toHaveProperty("published");
    expect(result).toHaveProperty("postUrl");
  });

  it("creates a 'proposed' action when autoPublish is false", async () => {
    mockInsertReturning
      .mockResolvedValueOnce([{ id: "c1", contentType: "social_post", content: {} }])
      .mockResolvedValueOnce([{ id: "a1", actionType: "social_post", status: "proposed" }]);

    const result = await createAndPublishPost(BIZ_ID, ORG_ID, "topic", "instagram", false);
    expect(result.published).toBe(false);
    expect(result.postUrl).toBeNull();
  });

  it("publishes and marks action as completed when autoPublish is true", async () => {
    mockInsertReturning
      .mockResolvedValueOnce([{ id: "c1", contentType: "social_post", content: {} }])
      .mockResolvedValueOnce([{ id: "a1", actionType: "social_post", status: "completed" }]);

    const result = await createAndPublishPost(BIZ_ID, ORG_ID, "topic", "instagram", true);
    expect(result.published).toBe(true);
    expect(result.postUrl).toContain("instagram.com");
  });
});
