/**
 * Tests for src/services/ai.ts
 * Covers: generate, generateSocialPost, generateReviewResponse, generateDigestNarrative
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock Anthropic SDK ───────────────────────────────────────────────────────

const mockMessagesCreate = vi.fn();
const mockMessagesStream = vi.fn();

vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = {
      create: (...args: unknown[]) => mockMessagesCreate(...args),
      stream: (...args: unknown[]) => mockMessagesStream(...args),
    };
  },
}));

import {
  generate,
  generateSocialPost,
  generateReviewResponse,
  generateDigestNarrative,
} from "@/services/ai";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockSuccessResponse(text: string) {
  mockMessagesCreate.mockResolvedValue({
    content: [{ type: "text", text }],
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── generate ────────────────────────────────────────────────────────────────

describe("generate", () => {
  it("returns text from the first text block", async () => {
    mockSuccessResponse("Hello from AI");
    const result = await generate({ prompt: "Say hello" });
    expect(result).toBe("Hello from AI");
  });

  it("returns empty string when response has no text block", async () => {
    mockMessagesCreate.mockResolvedValue({ content: [] });
    const result = await generate({ prompt: "..." });
    expect(result).toBe("");
  });

  it("passes the prompt to Anthropic", async () => {
    mockSuccessResponse("ok");
    await generate({ prompt: "Custom prompt here" });

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.messages[0].content).toBe("Custom prompt here");
  });

  it("uses claude-sonnet-4-6-20250514 as default model", async () => {
    mockSuccessResponse("ok");
    await generate({ prompt: "test" });

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.model).toBe("claude-sonnet-4-6-20250514");
  });

  it("uses a custom model when provided", async () => {
    mockSuccessResponse("ok");
    await generate({ prompt: "test", model: "claude-haiku-4-5-20251001" });

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.model).toBe("claude-haiku-4-5-20251001");
  });

  it("uses 1024 max_tokens by default", async () => {
    mockSuccessResponse("ok");
    await generate({ prompt: "test" });

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.max_tokens).toBe(1024);
  });

  it("respects custom maxTokens", async () => {
    mockSuccessResponse("ok");
    await generate({ prompt: "test", maxTokens: 256 });

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.max_tokens).toBe(256);
  });

  it("appends businessContext to system prompt when provided", async () => {
    mockSuccessResponse("ok");
    await generate({ prompt: "test", businessContext: { name: "Mario's" } });

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.system).toContain("Business context:");
    expect(call.system).toContain("Mario's");
  });

  it("does not include business context when not provided", async () => {
    mockSuccessResponse("ok");
    await generate({ prompt: "test" });

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.system).not.toContain("Business context:");
  });

  it("uses a custom system prompt when provided", async () => {
    mockSuccessResponse("ok");
    await generate({ prompt: "test", systemPrompt: "You are a custom bot." });

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.system).toContain("You are a custom bot.");
  });

  it("propagates errors from the Anthropic SDK", async () => {
    mockMessagesCreate.mockRejectedValue(new Error("Rate limit exceeded"));
    await expect(generate({ prompt: "test" })).rejects.toThrow("Rate limit exceeded");
  });
});

// ─── generateSocialPost ───────────────────────────────────────────────────────

describe("generateSocialPost", () => {
  const biz = { name: "Maria's Kitchen", vertical: "restaurant", city: "Austin" };

  it("returns the AI-generated text", async () => {
    mockSuccessResponse("Great post! #Austin #LocalFood");
    const result = await generateSocialPost(biz, "lunch specials");
    expect(result).toBe("Great post! #Austin #LocalFood");
  });

  it("includes business name in the prompt", async () => {
    mockSuccessResponse("ok");
    await generateSocialPost(biz, "new menu");

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.messages[0].content).toContain("Maria's Kitchen");
  });

  it("includes topic in the prompt", async () => {
    mockSuccessResponse("ok");
    await generateSocialPost(biz, "summer specials");

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.messages[0].content).toContain("summer specials");
  });

  it("uses maxTokens 512", async () => {
    mockSuccessResponse("ok");
    await generateSocialPost(biz, "topic");

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.max_tokens).toBe(512);
  });
});

// ─── generateReviewResponse ───────────────────────────────────────────────────

describe("generateReviewResponse", () => {
  const biz = { name: "Maria's Kitchen" };

  it("returns the AI-generated response text", async () => {
    mockSuccessResponse("Thank you for your review!");
    const result = await generateReviewResponse(biz, {
      reviewerName: "Jane",
      rating: 5,
      reviewText: "Amazing food!",
    });
    expect(result).toBe("Thank you for your review!");
  });

  it("includes the reviewer name in the prompt", async () => {
    mockSuccessResponse("ok");
    await generateReviewResponse(biz, {
      reviewerName: "Bob",
      rating: 4,
      reviewText: "Good",
    });

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.messages[0].content).toContain("Bob");
  });

  it("handles null reviewerName gracefully", async () => {
    mockSuccessResponse("ok");
    await expect(
      generateReviewResponse(biz, { reviewerName: null, rating: 3, reviewText: null })
    ).resolves.toBe("ok");

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.messages[0].content).toContain("Anonymous");
  });

  it("uses maxTokens 256", async () => {
    mockSuccessResponse("ok");
    await generateReviewResponse(biz, { reviewerName: "X", rating: 5, reviewText: "Y" });

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.max_tokens).toBe(256);
  });
});

// ─── generateDigestNarrative ──────────────────────────────────────────────────

describe("generateDigestNarrative", () => {
  const biz = { name: "Maria's Kitchen" };
  const metrics = {
    websiteVisits: 120,
    phoneCalls: 8,
    bookings: 3,
    socialEngagement: 45,
    reviewsReceived: 5,
  };

  it("returns the AI-generated narrative", async () => {
    mockSuccessResponse("Great week!");
    const result = await generateDigestNarrative(biz, metrics);
    expect(result).toBe("Great week!");
  });

  it("uses claude-haiku model for cost optimization", async () => {
    mockSuccessResponse("ok");
    await generateDigestNarrative(biz, metrics);

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.model).toBe("claude-haiku-4-5-20251001");
  });

  it("includes business name in the prompt", async () => {
    mockSuccessResponse("ok");
    await generateDigestNarrative(biz, metrics);

    const call = mockMessagesCreate.mock.calls[0][0];
    expect(call.messages[0].content).toContain("Maria's Kitchen");
  });

  it("includes metrics in the prompt", async () => {
    mockSuccessResponse("ok");
    await generateDigestNarrative(biz, metrics);

    const call = mockMessagesCreate.mock.calls[0][0];
    const content = call.messages[0].content;
    expect(content).toContain("websiteVisits");
  });
});
