import { beforeEach, describe, expect, it, vi } from "vitest";
import { login, logout } from "./admin-user.service";
import { findAdminByEmail, touchLastLogin } from "./admin-user.repository";
import { createSession, deleteSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";

vi.mock("./admin-user.repository", () => ({
  findAdminByEmail: vi.fn(),
  touchLastLogin: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
}));

vi.mock("@/lib/auth/password", () => ({
  hashPassword: vi.fn().mockResolvedValue("dummy-hash"),
  verifyPassword: vi.fn(),
}));

const admin = {
  id: "admin-1",
  email: "admin@example.com",
  name: "Super Admin",
  role: "SUPER_ADMIN" as const,
  passwordHash: "stored-hash",
  lastLoginAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a session and return the admin on valid credentials", async () => {
    vi.mocked(findAdminByEmail).mockResolvedValue(admin);
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const result = await login({ email: "admin@example.com", password: "correct-password" });

    expect(result).toEqual({
      success: true,
      admin: { id: "admin-1", email: "admin@example.com", name: "Super Admin", role: "SUPER_ADMIN" },
    });
    expect(createSession).toHaveBeenCalledWith({ adminUserId: "admin-1", role: "SUPER_ADMIN" });
    expect(touchLastLogin).toHaveBeenCalledWith("admin-1");
  });

  it("should reject an unknown email without creating a session", async () => {
    vi.mocked(findAdminByEmail).mockResolvedValue(null);
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const result = await login({ email: "unknown@example.com", password: "whatever" });

    expect(result).toEqual({ success: false, error: "INVALID_CREDENTIALS" });
    expect(createSession).not.toHaveBeenCalled();
  });

  it("should reject an incorrect password without creating a session", async () => {
    vi.mocked(findAdminByEmail).mockResolvedValue(admin);
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const result = await login({ email: "admin@example.com", password: "wrong-password" });

    expect(result).toEqual({ success: false, error: "INVALID_CREDENTIALS" });
    expect(createSession).not.toHaveBeenCalled();
  });

  it("should still run a password comparison for an unknown email (timing safety)", async () => {
    vi.mocked(findAdminByEmail).mockResolvedValue(null);
    vi.mocked(verifyPassword).mockResolvedValue(false);

    await login({ email: "unknown@example.com", password: "whatever" });

    expect(verifyPassword).toHaveBeenCalledTimes(1);
  });
});

describe("logout", () => {
  it("should delete the session", async () => {
    await logout();

    expect(deleteSession).toHaveBeenCalledTimes(1);
  });
});
