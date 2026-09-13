import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { getRequiredEnv } from "@/lib/utils/env";
import { findAdminByEmail, touchLastLogin } from "./admin-user.repository";

const adapter = new PrismaPg({ connectionString: getRequiredEnv("TEST_DATABASE_URL") });
const prisma = new PrismaClient({ adapter });

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.adminUser.deleteMany();
});

describe("admin-user.repository", () => {
  it("should find an admin by email", async () => {
    await prisma.adminUser.create({
      data: { email: "admin@example.com", passwordHash: "hash", name: "Super Admin" },
    });

    const result = await findAdminByEmail("admin@example.com");

    expect(result?.name).toBe("Super Admin");
    expect(result?.role).toBe("SUPER_ADMIN");
  });

  it("should return null for an unknown email", async () => {
    const result = await findAdminByEmail("does-not-exist@example.com");

    expect(result).toBeNull();
  });

  it("should enforce a unique email", async () => {
    await prisma.adminUser.create({
      data: { email: "admin@example.com", passwordHash: "hash", name: "Super Admin" },
    });

    await expect(
      prisma.adminUser.create({
        data: { email: "admin@example.com", passwordHash: "hash", name: "Duplicate" },
      }),
    ).rejects.toThrow();
  });

  it("should record the last login time", async () => {
    const admin = await prisma.adminUser.create({
      data: { email: "admin@example.com", passwordHash: "hash", name: "Super Admin" },
    });
    expect(admin.lastLoginAt).toBeNull();

    await touchLastLogin(admin.id);

    const updated = await prisma.adminUser.findUnique({ where: { id: admin.id } });
    expect(updated?.lastLoginAt).not.toBeNull();
  });
});
