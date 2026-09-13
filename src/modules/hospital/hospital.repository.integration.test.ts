import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { getRequiredEnv } from "@/lib/utils/env";
import { countHospitals, findAllHospitalSlugs, findHospitalBySlug, findManyHospitals } from "./hospital.repository";

const adapter = new PrismaPg({ connectionString: getRequiredEnv("TEST_DATABASE_URL") });
const prisma = new PrismaClient({ adapter });

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.chamber.deleteMany();
  await prisma.doctorHospital.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.diagnosticCenterTest.deleteMany();
  await prisma.diagnosticCenter.deleteMany();
  await prisma.location.deleteMany();
});

async function seedBasicFixture() {
  const dhanmondi = await prisma.location.create({ data: { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" } });
  const gulshan = await prisma.location.create({ data: { slug: "gulshan", name: "Gulshan", city: "Dhaka" } });

  const square = await prisma.hospital.create({
    data: { slug: "square-hospital-test", name: "Square Hospital (Test)", locationId: dhanmondi.id },
  });
  const apollo = await prisma.hospital.create({
    data: { slug: "apollo-hospital-test", name: "Apollo Hospital (Test)", locationId: gulshan.id },
  });

  return { dhanmondi, gulshan, square, apollo };
}

describe("hospital.repository", () => {
  it("should list all hospitals ordered by name", async () => {
    await seedBasicFixture();

    const result = await findManyHospitals({}, { page: 1, pageSize: 10 });

    expect(result.map((h) => h.name)).toEqual(["Apollo Hospital (Test)", "Square Hospital (Test)"]);
  });

  it("should filter by location slug", async () => {
    await seedBasicFixture();

    const result = await findManyHospitals({ locationSlug: "gulshan" }, { page: 1, pageSize: 10 });

    expect(result.map((h) => h.slug)).toEqual(["apollo-hospital-test"]);
  });

  it("should combine filters with pagination", async () => {
    await seedBasicFixture();

    const total = await countHospitals({});
    const firstPage = await findManyHospitals({}, { page: 1, pageSize: 1 });
    const secondPage = await findManyHospitals({}, { page: 2, pageSize: 1 });

    expect(total).toBe(2);
    expect(firstPage).toHaveLength(1);
    expect(secondPage).toHaveLength(1);
    expect(firstPage[0].slug).not.toBe(secondPage[0].slug);
  });

  it("should return empty results for an empty result set rather than erroring", async () => {
    await seedBasicFixture();

    const result = await findManyHospitals({ locationSlug: "does-not-exist" }, { page: 1, pageSize: 10 });

    expect(result).toEqual([]);
  });

  it("should find a hospital by slug with its location", async () => {
    await seedBasicFixture();

    const result = await findHospitalBySlug("square-hospital-test");

    expect(result?.name).toBe("Square Hospital (Test)");
    expect(result?.location.slug).toBe("dhanmondi");
  });

  it("should return null for a nonexistent slug", async () => {
    const result = await findHospitalBySlug("does-not-exist");

    expect(result).toBeNull();
  });

  it("should list all hospital slugs", async () => {
    await seedBasicFixture();

    const result = await findAllHospitalSlugs();

    expect(result.sort()).toEqual(["apollo-hospital-test", "square-hospital-test"]);
  });

  it("should enforce a unique hospital slug", async () => {
    const { dhanmondi } = await seedBasicFixture();

    await expect(
      prisma.hospital.create({
        data: { slug: "square-hospital-test", name: "Duplicate Slug", locationId: dhanmondi.id },
      }),
    ).rejects.toThrow();
  });

  it("should restrict deleting a location still referenced by a hospital", async () => {
    const { dhanmondi } = await seedBasicFixture();

    await expect(prisma.location.delete({ where: { id: dhanmondi.id } })).rejects.toThrow();
  });
});
