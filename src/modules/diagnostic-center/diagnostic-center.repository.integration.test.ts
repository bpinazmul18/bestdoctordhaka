import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { getRequiredEnv } from "@/lib/utils/env";
import {
  countDiagnosticCenters,
  createDiagnosticCenterRecord,
  findAllDiagnosticCenterSlugs,
  findDiagnosticCenterBySlug,
  findManyDiagnosticCenters,
} from "./diagnostic-center.repository";

const adapter = new PrismaPg({ connectionString: getRequiredEnv("TEST_DATABASE_URL") });
const prisma = new PrismaClient({ adapter });

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Location has FK dependents across several modules (Chamber, Hospital,
  // DiagnosticCenter), so a full reset here avoids failing on leftover rows
  // from whichever integration test file last ran, regardless of file order.
  await prisma.chamber.deleteMany();
  await prisma.doctorHospital.deleteMany();
  await prisma.doctorSpecialty.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.diagnosticCenterTest.deleteMany();
  await prisma.diagnosticCenter.deleteMany();
  await prisma.diagnosticTest.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.location.deleteMany();
  await prisma.specialty.deleteMany();
});

async function seedBasicFixture() {
  const dhanmondi = await prisma.location.create({ data: { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" } });
  const gulshan = await prisma.location.create({ data: { slug: "gulshan", name: "Gulshan", city: "Dhaka" } });

  const xray = await prisma.diagnosticTest.create({ data: { slug: "x-ray", name: "X-Ray" } });
  const bloodTest = await prisma.diagnosticTest.create({ data: { slug: "blood-test", name: "Blood Test" } });

  const dhanmondiCenter = await prisma.diagnosticCenter.create({
    data: {
      slug: "dhanmondi-diagnostic-test",
      name: "Dhanmondi Diagnostic (Test)",
      locationId: dhanmondi.id,
      tests: { create: [{ diagnosticTestId: xray.id }] },
    },
  });
  const gulshanCenter = await prisma.diagnosticCenter.create({
    data: {
      slug: "gulshan-diagnostic-test",
      name: "Gulshan Diagnostic (Test)",
      locationId: gulshan.id,
      tests: { create: [{ diagnosticTestId: bloodTest.id }] },
    },
  });

  return { dhanmondi, gulshan, xray, bloodTest, dhanmondiCenter, gulshanCenter };
}

describe("diagnostic-center.repository", () => {
  it("should list all diagnostic centers ordered by name", async () => {
    await seedBasicFixture();

    const result = await findManyDiagnosticCenters({}, { page: 1, pageSize: 10 });

    expect(result.map((c) => c.name)).toEqual(["Dhanmondi Diagnostic (Test)", "Gulshan Diagnostic (Test)"]);
  });

  it("should filter by location slug", async () => {
    await seedBasicFixture();

    const result = await findManyDiagnosticCenters({ locationSlug: "gulshan" }, { page: 1, pageSize: 10 });

    expect(result.map((c) => c.slug)).toEqual(["gulshan-diagnostic-test"]);
  });

  it("should filter by diagnostic test slug", async () => {
    await seedBasicFixture();

    const result = await findManyDiagnosticCenters({ testSlug: "x-ray" }, { page: 1, pageSize: 10 });

    expect(result.map((c) => c.slug)).toEqual(["dhanmondi-diagnostic-test"]);
  });

  it("should combine filters with pagination", async () => {
    await seedBasicFixture();

    const total = await countDiagnosticCenters({});
    const firstPage = await findManyDiagnosticCenters({}, { page: 1, pageSize: 1 });
    const secondPage = await findManyDiagnosticCenters({}, { page: 2, pageSize: 1 });

    expect(total).toBe(2);
    expect(firstPage).toHaveLength(1);
    expect(secondPage).toHaveLength(1);
    expect(firstPage[0].slug).not.toBe(secondPage[0].slug);
  });

  it("should return empty results for an empty result set rather than erroring", async () => {
    await seedBasicFixture();

    const result = await findManyDiagnosticCenters({ testSlug: "does-not-exist" }, { page: 1, pageSize: 10 });

    expect(result).toEqual([]);
  });

  it("should find a diagnostic center by slug with its location and tests", async () => {
    await seedBasicFixture();

    const result = await findDiagnosticCenterBySlug("dhanmondi-diagnostic-test");

    expect(result?.name).toBe("Dhanmondi Diagnostic (Test)");
    expect(result?.location.slug).toBe("dhanmondi");
    expect(result?.tests).toHaveLength(1);
    expect(result?.tests[0].diagnosticTest.slug).toBe("x-ray");
  });

  it("should return null for a nonexistent slug", async () => {
    const result = await findDiagnosticCenterBySlug("does-not-exist");

    expect(result).toBeNull();
  });

  it("should list all diagnostic center slugs", async () => {
    await seedBasicFixture();

    const result = await findAllDiagnosticCenterSlugs();

    expect(result.sort()).toEqual(["dhanmondi-diagnostic-test", "gulshan-diagnostic-test"]);
  });

  it("should enforce a unique diagnostic center slug", async () => {
    const { dhanmondi } = await seedBasicFixture();

    await expect(
      prisma.diagnosticCenter.create({
        data: { slug: "dhanmondi-diagnostic-test", name: "Duplicate Slug", locationId: dhanmondi.id },
      }),
    ).rejects.toThrow();
  });

  it("should restrict deleting a location still referenced by a diagnostic center", async () => {
    const { dhanmondi } = await seedBasicFixture();

    await expect(prisma.location.delete({ where: { id: dhanmondi.id } })).rejects.toThrow();
  });

  it("should restrict deleting a diagnostic test still referenced by a center", async () => {
    const { xray } = await seedBasicFixture();

    await expect(prisma.diagnosticTest.delete({ where: { id: xray.id } })).rejects.toThrow();
  });

  it("should create a diagnostic center with connected tests", async () => {
    const dhanmondi = await prisma.location.create({ data: { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" } });
    const xray = await prisma.diagnosticTest.create({ data: { slug: "x-ray", name: "X-Ray" } });

    const result = await createDiagnosticCenterRecord({
      slug: "dhanmondi-diagnostic-test",
      name: "Dhanmondi Diagnostic (Test)",
      locationId: dhanmondi.id,
      testIds: [xray.id],
    });

    expect(result.slug).toBe("dhanmondi-diagnostic-test");
    const stored = await prisma.diagnosticCenter.findUnique({
      where: { slug: "dhanmondi-diagnostic-test" },
      include: { tests: true },
    });
    expect(stored?.tests).toHaveLength(1);
    expect(stored?.tests[0].diagnosticTestId).toBe(xray.id);
  });

  it("should create a diagnostic center with no tests when none are given", async () => {
    const dhanmondi = await prisma.location.create({ data: { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" } });

    const result = await createDiagnosticCenterRecord({
      slug: "dhanmondi-diagnostic-test",
      name: "Dhanmondi Diagnostic (Test)",
      locationId: dhanmondi.id,
    });

    expect(result.slug).toBe("dhanmondi-diagnostic-test");
  });

  it("should reject creating a diagnostic center with a duplicate slug", async () => {
    const dhanmondi = await prisma.location.create({ data: { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" } });
    await createDiagnosticCenterRecord({
      slug: "dhanmondi-diagnostic-test",
      name: "Dhanmondi Diagnostic (Test)",
      locationId: dhanmondi.id,
    });

    await expect(
      createDiagnosticCenterRecord({
        slug: "dhanmondi-diagnostic-test",
        name: "Duplicate",
        locationId: dhanmondi.id,
      }),
    ).rejects.toThrow();
  });
});
