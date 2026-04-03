/**
 * Tests for src/api/middleware/auth.ts
 * Covers: verifyAuth, issueAccessToken, issueRefreshToken
 *
 * We mock jose to avoid ESM module realm issues with Uint8Array instanceof
 * checks in the jsdom test environment.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ─── Mock jose ────────────────────────────────────────────────────────────────

const mockJwtVerify = vi.fn();
const mockSign = vi.fn().mockResolvedValue("mock-jwt-token");
const mockSignJWT = vi.fn().mockReturnValue({
  setProtectedHeader: vi.fn().mockReturnThis(),
  setIssuedAt: vi.fn().mockReturnThis(),
  setExpirationTime: vi.fn().mockReturnThis(),
  sign: mockSign,
});

vi.mock("jose", () => ({
  jwtVerify: (...args: unknown[]) => mockJwtVerify(...args),
  SignJWT: function (...args: unknown[]) { return mockSignJWT(...args); },
}));

import {
  verifyAuth,
  issueAccessToken,
  issueRefreshToken,
  type AuthContext,
} from "@/api/middleware/auth";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(authHeader?: string): NextRequest {
  const headers: HeadersInit = {};
  if (authHeader) headers["authorization"] = authHeader;
  return new NextRequest("http://localhost/api/test", { headers });
}

const TEST_CONTEXT: AuthContext = {
  userId: "user-uuid-001",
  organizationId: "org-uuid-001",
  businessId: "biz-uuid-001",
  plan: "base",
};

beforeEach(() => {
  vi.clearAllMocks();
  // Reset SignJWT mock to default chain
  mockSignJWT.mockReturnValue({
    setProtectedHeader: vi.fn().mockReturnThis(),
    setIssuedAt: vi.fn().mockReturnThis(),
    setExpirationTime: vi.fn().mockReturnThis(),
    sign: mockSign,
  });
  mockSign.mockResolvedValue("mock-jwt-token");
});

// ─── verifyAuth ───────────────────────────────────────────────────────────────

describe("verifyAuth", () => {
  it("returns AuthContext for a valid Bearer token", async () => {
    mockJwtVerify.mockResolvedValue({
      payload: {
        sub: TEST_CONTEXT.userId,
        org: TEST_CONTEXT.organizationId,
        biz: TEST_CONTEXT.businessId,
        plan: "base",
      },
    });

    const request = makeRequest("Bearer valid-token");
    const result = await verifyAuth(request);

    expect(result).toEqual(TEST_CONTEXT);
  });

  it("defaults plan to 'base' when plan claim is absent", async () => {
    mockJwtVerify.mockResolvedValue({
      payload: {
        sub: "u1",
        org: "o1",
        biz: "b1",
        // no plan field
      },
    });

    const request = makeRequest("Bearer valid-token");
    const result = await verifyAuth(request);

    expect((result as AuthContext).plan).toBe("base");
  });

  it("returns 401 when Authorization header is missing", async () => {
    const request = makeRequest();
    const result = await verifyAuth(request);

    expect(result).toHaveProperty("status", 401);
    const body = await (result as Response).json();
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 when Authorization header lacks Bearer prefix", async () => {
    const request = makeRequest("Basic not-bearer");
    const result = await verifyAuth(request);

    expect(result).toHaveProperty("status", 401);
    const body = await (result as Response).json();
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 when jwtVerify throws (expired token)", async () => {
    mockJwtVerify.mockRejectedValue(new Error("JWTExpired"));
    const request = makeRequest("Bearer expired-token");
    const result = await verifyAuth(request);

    expect(result).toHaveProperty("status", 401);
    const body = await (result as Response).json();
    expect(body.error.code).toBe("TOKEN_EXPIRED");
  });

  it("returns 401 when token payload is missing 'org' claim", async () => {
    mockJwtVerify.mockResolvedValue({
      payload: { sub: "u1", biz: "b1" }, // no org
    });

    const request = makeRequest("Bearer partial-token");
    const result = await verifyAuth(request);

    expect(result).toHaveProperty("status", 401);
    const body = await (result as Response).json();
    expect(body.error.code).toBe("INVALID_TOKEN");
  });

  it("returns 401 when token payload is missing 'biz' claim", async () => {
    mockJwtVerify.mockResolvedValue({
      payload: { sub: "u1", org: "o1" }, // no biz
    });

    const request = makeRequest("Bearer partial-token");
    const result = await verifyAuth(request);

    expect(result).toHaveProperty("status", 401);
    const body = await (result as Response).json();
    expect(body.error.code).toBe("INVALID_TOKEN");
  });

  it("returns 401 when token payload is missing 'sub' claim", async () => {
    mockJwtVerify.mockResolvedValue({
      payload: { org: "o1", biz: "b1" }, // no sub
    });

    const request = makeRequest("Bearer partial-token");
    const result = await verifyAuth(request);

    expect(result).toHaveProperty("status", 401);
    const body = await (result as Response).json();
    expect(body.error.code).toBe("INVALID_TOKEN");
  });

  it("accepts 'pro' plan tokens", async () => {
    mockJwtVerify.mockResolvedValue({
      payload: { sub: "u1", org: "o1", biz: "b1", plan: "pro" },
    });

    const request = makeRequest("Bearer pro-token");
    const result = await verifyAuth(request);

    expect((result as AuthContext).plan).toBe("pro");
  });

  it("extracts the token from the Bearer header correctly", async () => {
    mockJwtVerify.mockResolvedValue({
      payload: { sub: "u1", org: "o1", biz: "b1" },
    });

    await verifyAuth(makeRequest("Bearer my-specific-token-abc"));

    expect(mockJwtVerify).toHaveBeenCalledWith(
      "my-specific-token-abc",
      expect.anything()
    );
  });
});

// ─── issueAccessToken ─────────────────────────────────────────────────────────

describe("issueAccessToken", () => {
  it("returns a token string", async () => {
    const token = await issueAccessToken(TEST_CONTEXT);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("calls SignJWT with the correct payload claims", async () => {
    await issueAccessToken(TEST_CONTEXT);

    expect(mockSignJWT).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: TEST_CONTEXT.userId,
        org: TEST_CONTEXT.organizationId,
        biz: TEST_CONTEXT.businessId,
        plan: TEST_CONTEXT.plan,
      })
    );
  });

  it("sets expiry to 15 minutes", async () => {
    const mockChain = {
      setProtectedHeader: vi.fn().mockReturnThis(),
      setIssuedAt: vi.fn().mockReturnThis(),
      setExpirationTime: vi.fn().mockReturnThis(),
      sign: vi.fn().mockResolvedValue("token"),
    };
    mockSignJWT.mockReturnValue(mockChain);

    await issueAccessToken(TEST_CONTEXT);

    expect(mockChain.setExpirationTime).toHaveBeenCalledWith("15m");
  });
});

// ─── issueRefreshToken ────────────────────────────────────────────────────────

describe("issueRefreshToken", () => {
  it("returns a token string", async () => {
    const token = await issueRefreshToken("user-uuid-001");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("calls SignJWT with userId as sub and type 'refresh'", async () => {
    await issueRefreshToken("user-uuid-001");

    expect(mockSignJWT).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: "user-uuid-001",
        type: "refresh",
      })
    );
  });

  it("sets expiry to 30 days", async () => {
    const mockChain = {
      setProtectedHeader: vi.fn().mockReturnThis(),
      setIssuedAt: vi.fn().mockReturnThis(),
      setExpirationTime: vi.fn().mockReturnThis(),
      sign: vi.fn().mockResolvedValue("refresh-token"),
    };
    mockSignJWT.mockReturnValue(mockChain);

    await issueRefreshToken("user-uuid-001");

    expect(mockChain.setExpirationTime).toHaveBeenCalledWith("30d");
  });
});
