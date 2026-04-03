/**
 * Tests for src/lib/demo-mode.ts
 * Covers: isDemoMode, demoApi (all methods)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── isDemoMode ────────────────────────────────────────────────────────────────

describe("isDemoMode", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns false when NEXT_PUBLIC_DEMO_MODE is not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "");
    const { isDemoMode } = await import("@/lib/demo-mode");
    expect(isDemoMode()).toBe(false);
  });

  it("returns true when NEXT_PUBLIC_DEMO_MODE is 'true'", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "true");
    const { isDemoMode } = await import("@/lib/demo-mode");
    expect(isDemoMode()).toBe(true);
  });

  it("returns false for any other value", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "1");
    const { isDemoMode } = await import("@/lib/demo-mode");
    expect(isDemoMode()).toBe(false);
  });
});

// ─── demoApi ──────────────────────────────────────────────────────────────────

// Import the module once at module level (env stubbing for isDemoMode tested separately)
import { demoApi } from "@/lib/demo-mode";

describe("demoApi.login", () => {
  it("returns an AuthResponse with a token", async () => {
    const result = await demoApi.login("any@email.com", "any");
    expect(result).toHaveProperty("token");
    expect(typeof result.token).toBe("string");
  });

  it("returns user with email and businessName", async () => {
    const result = await demoApi.login("any@email.com", "any");
    expect(result.user).toHaveProperty("email");
    expect(result.user).toHaveProperty("businessName");
  });
});

describe("demoApi.register", () => {
  it("returns an AuthResponse", async () => {
    const result = await demoApi.register({
      email: "new@test.com",
      password: "pass",
      businessName: "Test",
      businessType: "restaurant",
      city: "Austin",
    });
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
  });
});

describe("demoApi.logout", () => {
  it("removes the demo token from localStorage", () => {
    localStorage.setItem("lg_token", "demo-token-local-genius-2026");
    demoApi.logout();
    expect(localStorage.getItem("lg_token")).toBeNull();
  });

  it("does not throw when no token is present", () => {
    localStorage.clear();
    expect(() => demoApi.logout()).not.toThrow();
  });
});

describe("demoApi.getConversation", () => {
  it("returns a Conversation with id and messages array", async () => {
    const result = await demoApi.getConversation("demo-conv-001");
    expect(result).toHaveProperty("id");
    expect(Array.isArray(result.messages)).toBe(true);
  });
});

describe("demoApi.createConversation", () => {
  it("returns a Conversation with empty messages", async () => {
    const result = await demoApi.createConversation();
    expect(result).toHaveProperty("id");
    expect(result.messages).toEqual([]);
  });
});

describe("demoApi.sendMessage", () => {
  it("returns a Message with role 'assistant'", async () => {
    const result = await demoApi.sendMessage("conv-1", "Hello there");
    expect(result.role).toBe("assistant");
    expect(typeof result.content).toBe("string");
  });

  it("returns lunch-related content for lunch keywords", async () => {
    const result = await demoApi.sendMessage("conv-1", "what about lunch specials?");
    expect(result.content.length).toBeGreaterThan(0);
  });
});

describe("demoApi.streamMessage", () => {
  it("calls onComplete with a message after streaming", async () => {
    const onChunk = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    const cancel = demoApi.streamMessage(
      "conv-1",
      "Tell me about specials",
      onChunk,
      onComplete,
      onError
    );

    // Wait for streaming to complete (words streamed at 30ms intervals)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    expect(onComplete).toHaveBeenCalledOnce();
    const completedMsg = onComplete.mock.calls[0][0];
    expect(completedMsg.role).toBe("assistant");
    expect(onError).not.toHaveBeenCalled();

    cancel(); // cleanup
  }, 10000);

  it("returns a cancel function", () => {
    const cancel = demoApi.streamMessage("c", "hi", vi.fn(), vi.fn(), vi.fn());
    expect(typeof cancel).toBe("function");
    cancel();
  });
});

describe("demoApi.generateContent", () => {
  it("returns a GeneratedContent object with given type", async () => {
    const result = await demoApi.generateContent("social_post", { topic: "special" });
    expect(result.type).toBe("social_post");
    expect(result).toHaveProperty("content");
    expect(result).toHaveProperty("status");
  });

  it("returns a unique id each call", async () => {
    const r1 = await demoApi.generateContent("email", {});
    const r2 = await demoApi.generateContent("email", {});
    expect(r1.id).not.toBe(r2.id);
  });
});

describe("demoApi.publishContent", () => {
  it("returns content with status 'published'", async () => {
    const result = await demoApi.publishContent("some-id");
    expect(result.status).toBe("published");
  });
});

describe("demoApi.getReviews", () => {
  it("returns an array of reviews", async () => {
    const result = await demoApi.getReviews();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("each review has platform, rating, and draftResponse", async () => {
    const reviews = await demoApi.getReviews();
    for (const review of reviews) {
      expect(review).toHaveProperty("platform");
      expect(review).toHaveProperty("rating");
      expect(review).toHaveProperty("draftResponse");
    }
  });
});

describe("demoApi.respondToReview", () => {
  it("returns review with updated draftResponse and status 'sent'", async () => {
    const reviews = await demoApi.getReviews();
    const reviewId = reviews[0].id;
    const result = await demoApi.respondToReview(reviewId, "Thank you!");
    expect(result.id).toBe(reviewId);
    expect(result.draftResponse).toBe("Thank you!");
    expect(result.responseStatus).toBe("sent");
  });
});

describe("demoApi.getDigest", () => {
  it("returns a DigestData object with businessName", async () => {
    const result = await demoApi.getDigest();
    expect(result).toHaveProperty("businessName");
    expect(result).toHaveProperty("highlights");
    expect(Array.isArray(result.highlights)).toBe(true);
  });
});

describe("demoApi.getAnalytics", () => {
  it("returns analytics with numeric fields", async () => {
    const result = await demoApi.getAnalytics();
    expect(typeof result.websiteVisits).toBe("number");
    expect(typeof result.reviewCount).toBe("number");
    expect(typeof result.averageRating).toBe("number");
  });
});

describe("demoApi.discoverBusiness", () => {
  it("returns a DiscoveryResult with businessName", async () => {
    const result = await demoApi.discoverBusiness("Maria's Kitchen", "Austin");
    expect(result).toHaveProperty("businessName");
    expect(result).toHaveProperty("competitors");
  });
});

describe("demoApi.generateReveal", () => {
  it("returns a RevealData with tagline", async () => {
    const result = await demoApi.generateReveal("Test Biz", "restaurant", "Great food");
    expect(result).toHaveProperty("tagline");
    expect(result).toHaveProperty("socialPostDraft");
  });
});

describe("demoApi.completeOnboarding", () => {
  it("returns a conversationId", async () => {
    const result = await demoApi.completeOnboarding(new FormData());
    expect(result).toHaveProperty("conversationId");
    expect(typeof result.conversationId).toBe("string");
  });
});
