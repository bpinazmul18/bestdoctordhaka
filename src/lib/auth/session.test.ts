import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { decryptSession } from "./session";

describe("decryptSession", () => {
  const originalSecret = process.env.SESSION_SECRET;

  beforeEach(() => {
    process.env.SESSION_SECRET = "test-secret-at-least-32-bytes-long-000000";
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.SESSION_SECRET;
    } else {
      process.env.SESSION_SECRET = originalSecret;
    }
  });

  it("should return null for an undefined token", async () => {
    await expect(decryptSession(undefined)).resolves.toBeNull();
  });

  it("should return null for a malformed token", async () => {
    await expect(decryptSession("not-a-valid-jwt")).resolves.toBeNull();
  });

  it("should return null for a token signed with a different secret", async () => {
    const { SignJWT } = await import("jose");
    const wrongKey = new TextEncoder().encode("a-completely-different-secret-000000000");

    const token = await new SignJWT({ adminUserId: "admin-1", role: "SUPER_ADMIN" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(wrongKey);

    await expect(decryptSession(token)).resolves.toBeNull();
  });

  it("should return null for an expired token", async () => {
    const { SignJWT } = await import("jose");
    const key = new TextEncoder().encode(process.env.SESSION_SECRET);

    const token = await new SignJWT({ adminUserId: "admin-1", role: "SUPER_ADMIN" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 120)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(key);

    await expect(decryptSession(token)).resolves.toBeNull();
  });

  it("should round-trip a valid session payload", async () => {
    const { SignJWT } = await import("jose");
    const key = new TextEncoder().encode(process.env.SESSION_SECRET);

    const token = await new SignJWT({ adminUserId: "admin-1", role: "SUPER_ADMIN" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(key);

    await expect(decryptSession(token)).resolves.toEqual({
      adminUserId: "admin-1",
      role: "SUPER_ADMIN",
    });
  });
});
