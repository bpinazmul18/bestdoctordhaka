import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { getRequiredEnv } from "@/lib/utils/env";
import {
  findAllDiagnosticTestSlugs,
  findAllDiagnosticTests,
  findDiagnosticTestBySlug,
} from "./diagnostic-test.repository";

const adapter = new PrismaPg({ connectionString: getRequiredEnv("TEST_DATABASE_URL") });
const prisma = new PrismaClient({ adapter });

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.diagnosticCenterTest.deleteMany();
  await prisma.diagnosticTest.deleteMany();
});

describe("diagnostic-test.repository", () => {
  it("should list all diagnostic tests ordered by name", async () => {
    await prisma.diagnosticTest.createMany({
      data: [
        { slug: "x-ray", name: "X-Ray" },
        { slug: "blood-test", name: "Blood Test" },
      ],
    });

    const result = await findAllDiagnosticTests();

    expect(result.map((t) => t.name)).toEqual(["Blood Test", "X-Ray"]);
  });

  it("should find a diagnostic test by slug", async () => {
    await prisma.diagnosticTest.create({ data: { slug: "x-ray", name: "X-Ray" } });

    const result = await findDiagnosticTestBySlug("x-ray");

    expect(result?.name).toBe("X-Ray");
  });

  it("should return null for an unknown slug", async () => {
    const result = await findDiagnosticTestBySlug("does-not-exist");

    expect(result).toBeNull();
  });

  it("should list all diagnostic test slugs", async () => {
    await prisma.diagnosticTest.createMany({
      data: [
        { slug: "x-ray", name: "X-Ray" },
        { slug: "blood-test", name: "Blood Test" },
      ],
    });

    const result = await findAllDiagnosticTestSlugs();

    expect(result.sort()).toEqual(["blood-test", "x-ray"]);
  });

  it("should enforce unique slugs", async () => {
    await prisma.diagnosticTest.create({ data: { slug: "x-ray", name: "X-Ray" } });

    await expect(
      prisma.diagnosticTest.create({ data: { slug: "x-ray", name: "X-Ray Duplicate" } }),
    ).rejects.toThrow();
  });
});
