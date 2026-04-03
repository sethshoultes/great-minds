/**
 * Tests for src/lib/password.ts
 * Covers: hashPassword, verifyPassword
 */

import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("hashPassword", () => {
  it("returns a string in 'saltHex:hashHex' format", async () => {
    const result = await hashPassword("MySecret123!");
    expect(result).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
  });

  it("produces different hashes for the same password (salting)", async () => {
    const hash1 = await hashPassword("SamePassword");
    const hash2 = await hashPassword("SamePassword");
    expect(hash1).not.toBe(hash2);
  });

  it("salt and hash segments have non-zero length", async () => {
    const result = await hashPassword("test");
    const [salt, hash] = result.split(":");
    expect(salt.length).toBeGreaterThan(0);
    expect(hash.length).toBeGreaterThan(0);
  });

  it("uses a 128-bit (32 hex char) salt", async () => {
    const result = await hashPassword("test");
    const [salt] = result.split(":");
    expect(salt.length).toBe(32); // 16 bytes = 32 hex chars
  });

  it("produces a 64-byte (128 hex char) hash", async () => {
    const result = await hashPassword("test");
    const [, hash] = result.split(":");
    expect(hash.length).toBe(128); // 64 bytes = 128 hex chars
  });
});

describe("verifyPassword", () => {
  it("returns true for the correct password", async () => {
    const stored = await hashPassword("CorrectPassword");
    const result = await verifyPassword("CorrectPassword", stored);
    expect(result).toBe(true);
  });

  it("returns false for an incorrect password", async () => {
    const stored = await hashPassword("CorrectPassword");
    const result = await verifyPassword("WrongPassword", stored);
    expect(result).toBe(false);
  });

  it("returns false for an empty password against a real hash", async () => {
    const stored = await hashPassword("NotEmpty");
    const result = await verifyPassword("", stored);
    expect(result).toBe(false);
  });

  it("returns false for a stored string without ':' separator", async () => {
    const result = await verifyPassword("any", "invalidstoredvalue");
    expect(result).toBe(false);
  });

  it("returns false when stored value is empty string", async () => {
    const result = await verifyPassword("any", "");
    expect(result).toBe(false);
  });

  it("is case-sensitive", async () => {
    const stored = await hashPassword("MyPassword");
    expect(await verifyPassword("mypassword", stored)).toBe(false);
    expect(await verifyPassword("MYPASSWORD", stored)).toBe(false);
  });

  it("handles unicode passwords correctly", async () => {
    const password = "pássw0rd🔑";
    const stored = await hashPassword(password);
    expect(await verifyPassword(password, stored)).toBe(true);
    expect(await verifyPassword("pássw0rd", stored)).toBe(false);
  });

  it("verifies against a hash from a previous call (stable)", async () => {
    const stored = await hashPassword("StableTest");
    // A second independent verify call must still return true
    expect(await verifyPassword("StableTest", stored)).toBe(true);
    expect(await verifyPassword("StableTest", stored)).toBe(true);
  });
});
