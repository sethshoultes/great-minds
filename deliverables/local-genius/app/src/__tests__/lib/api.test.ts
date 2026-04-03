/**
 * Tests for src/lib/api.ts
 * Covers: token management (getToken, setToken, clearToken via login/logout),
 *         ApiError, the request wrapper, and key API functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We import the named exports from api.ts under test
import {
  login,
  register,
  logout,
  getToken,
  clearToken,
  ApiError,
} from "@/lib/api";

// ─── Setup: mock global fetch ─────────────────────────────────────────────────

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetchOk(body: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => body,
  });
}

function mockFetchFail(status: number, errorBody: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => errorBody,
  });
}

// ─── ApiError ─────────────────────────────────────────────────────────────────

describe("ApiError", () => {
  it("is an instance of Error", () => {
    const err = new ApiError("Something went wrong", 400);
    expect(err).toBeInstanceOf(Error);
  });

  it("has name 'ApiError'", () => {
    const err = new ApiError("Bad Request", 400);
    expect(err.name).toBe("ApiError");
  });

  it("stores the status code", () => {
    const err = new ApiError("Not Found", 404);
    expect(err.status).toBe(404);
  });

  it("stores the message", () => {
    const err = new ApiError("Server Error", 500);
    expect(err.message).toBe("Server Error");
  });
});

// ─── Token management ────────────────────────────────────────────────────────

describe("getToken / clearToken", () => {
  it("returns null when no token is stored", () => {
    expect(getToken()).toBeNull();
  });

  it("clearToken removes the stored token", () => {
    localStorage.setItem("lg_token", "test-token");
    clearToken();
    expect(localStorage.getItem("lg_token")).toBeNull();
  });
});

// ─── login ────────────────────────────────────────────────────────────────────

describe("login", () => {
  const AUTH_RESPONSE = {
    token: "access-token-abc",
    user: { id: "u1", email: "owner@example.com", businessName: "Test Biz" },
  };

  it("calls POST /api/auth/login with email and password", async () => {
    mockFetchOk(AUTH_RESPONSE);
    await login("owner@example.com", "password123");

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "owner@example.com", password: "password123" }),
      })
    );
  });

  it("stores the returned token in localStorage", async () => {
    mockFetchOk(AUTH_RESPONSE);
    await login("owner@example.com", "password123");

    expect(localStorage.getItem("lg_token")).toBe("access-token-abc");
  });

  it("returns the auth response", async () => {
    mockFetchOk(AUTH_RESPONSE);
    const result = await login("owner@example.com", "password123");
    expect(result).toEqual(AUTH_RESPONSE);
  });

  it("throws ApiError on HTTP failure", async () => {
    mockFetchFail(401, { error: "Invalid credentials" });

    await expect(login("bad@example.com", "wrong")).rejects.toThrow(ApiError);
  });

  it("ApiError has correct status code", async () => {
    mockFetchFail(401, { error: "Unauthorized" });

    try {
      await login("a@b.com", "p");
    } catch (err) {
      expect((err as ApiError).status).toBe(401);
    }
  });
});

// ─── register ────────────────────────────────────────────────────────────────

describe("register", () => {
  const REGISTER_DATA = {
    email: "new@example.com",
    password: "SecurePass1!",
    businessName: "New Biz",
    businessType: "restaurant",
    city: "Austin",
  };

  const AUTH_RESPONSE = {
    token: "new-access-token",
    user: { id: "u2", email: "new@example.com", businessName: "New Biz" },
  };

  it("calls POST /api/auth/register", async () => {
    mockFetchOk(AUTH_RESPONSE);
    await register(REGISTER_DATA);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("stores the token in localStorage after registration", async () => {
    mockFetchOk(AUTH_RESPONSE);
    await register(REGISTER_DATA);

    expect(localStorage.getItem("lg_token")).toBe("new-access-token");
  });

  it("returns the auth response", async () => {
    mockFetchOk(AUTH_RESPONSE);
    const result = await register(REGISTER_DATA);
    expect(result).toEqual(AUTH_RESPONSE);
  });

  it("throws ApiError on HTTP failure", async () => {
    mockFetchFail(422, { error: "Email already registered" });
    await expect(register(REGISTER_DATA)).rejects.toThrow(ApiError);
  });
});

// ─── logout ───────────────────────────────────────────────────────────────────

describe("logout", () => {
  it("removes the stored token from localStorage", () => {
    localStorage.setItem("lg_token", "existing-token");
    logout();
    expect(localStorage.getItem("lg_token")).toBeNull();
  });

  it("does not throw when no token is present", () => {
    expect(() => logout()).not.toThrow();
  });
});

// ─── Request includes Authorization header when token is set ─────────────────

describe("authenticated requests", () => {
  it("includes Authorization header when token is stored", async () => {
    localStorage.setItem("lg_token", "my-auth-token");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    // Trigger any authenticated request — use getAnalytics as a proxy
    const { getAnalytics } = await import("@/lib/api");
    await getAnalytics().catch(() => {});

    const callHeaders = mockFetch.mock.calls[0]?.[1]?.headers as Record<string, string>;
    expect(callHeaders?.["Authorization"]).toBe("Bearer my-auth-token");
  });
});
