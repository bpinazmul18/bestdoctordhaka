import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient, DoctorStatus } from "@/generated/prisma/client";
import { getRequiredEnv } from "@/lib/utils/env";
import {
  countPublishedDoctors,
  findAllPublishedDoctorSlugs,
  findManyPublishedDoctors,
  findPublishedDoctorBySlug,
} from "./doctor.repository";

const adapter = new PrismaPg({ connectionString: getRequiredEnv("TEST_DATABASE_URL") });
const prisma = new PrismaClient({ adapter });

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.chamber.deleteMany();
  await prisma.doctorHospital.deleteMany();
  await prisma.doctorSpecialty.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.location.deleteMany();
  await prisma.specialty.deleteMany();
});

async function seedBasicFixture() {
  const cardiology = await prisma.specialty.create({ data: { slug: "cardiology", name: "Cardiology" } });
  const dermatology = await prisma.specialty.create({ data: { slug: "dermatology", name: "Dermatology" } });
  const dhanmondi = await prisma.location.create({ data: { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" } });
  const gulshan = await prisma.location.create({ data: { slug: "gulshan", name: "Gulshan", city: "Dhaka" } });
  const hospital = await prisma.hospital.create({
    data: { slug: "square-hospital-test", name: "Square Hospital (Test)", locationId: dhanmondi.id },
  });

  const published = await prisma.doctor.create({
    data: {
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      status: DoctorStatus.PUBLISHED,
      primarySpecialty: { connect: { id: cardiology.id } },
      specialties: { create: [{ specialtyId: cardiology.id }] },
      hospitals: { create: [{ hospitalId: hospital.id }] },
      chambers: { create: [{ addressLine: "1 Road", locationId: dhanmondi.id, hospitalId: hospital.id }] },
    },
  });

  const publishedElsewhere = await prisma.doctor.create({
    data: {
      slug: "dr-test-akter",
      fullName: "Dr. Test Akter",
      status: DoctorStatus.PUBLISHED,
      primarySpecialty: { connect: { id: dermatology.id } },
      specialties: { create: [{ specialtyId: dermatology.id }] },
      chambers: { create: [{ addressLine: "2 Avenue", locationId: gulshan.id }] },
    },
  });

  const draft = await prisma.doctor.create({
    data: {
      slug: "dr-test-draft",
      fullName: "Dr. Test Draft",
      status: DoctorStatus.DRAFT,
      primarySpecialty: { connect: { id: cardiology.id } },
      specialties: { create: [{ specialtyId: cardiology.id }] },
    },
  });

  return { cardiology, dermatology, dhanmondi, gulshan, hospital, published, publishedElsewhere, draft };
}

describe("doctor.repository", () => {
  it("should only return PUBLISHED doctors from the listing query", async () => {
    await seedBasicFixture();

    const result = await findManyPublishedDoctors({}, { page: 1, pageSize: 10 });

    expect(result.map((d) => d.slug).sort()).toEqual(["dr-test-akter", "dr-test-rahman"]);
  });

  it("should filter by specialty slug", async () => {
    await seedBasicFixture();

    const result = await findManyPublishedDoctors({ specialtySlug: "cardiology" }, { page: 1, pageSize: 10 });

    expect(result.map((d) => d.slug)).toEqual(["dr-test-rahman"]);
  });

  it("should filter by location slug via chambers", async () => {
    await seedBasicFixture();

    const result = await findManyPublishedDoctors({ locationSlug: "gulshan" }, { page: 1, pageSize: 10 });

    expect(result.map((d) => d.slug)).toEqual(["dr-test-akter"]);
  });

  it("should filter by hospital slug via institutional affiliation", async () => {
    await seedBasicFixture();

    const result = await findManyPublishedDoctors({ hospitalSlug: "square-hospital-test" }, { page: 1, pageSize: 10 });

    expect(result.map((d) => d.slug)).toEqual(["dr-test-rahman"]);
  });

  it("should perform a case-insensitive basic name search", async () => {
    await seedBasicFixture();

    const result = await findManyPublishedDoctors({ searchTerm: "rahman" }, { page: 1, pageSize: 10 });

    expect(result.map((d) => d.slug)).toEqual(["dr-test-rahman"]);
  });

  it("should combine filters with pagination", async () => {
    await seedBasicFixture();

    const total = await countPublishedDoctors({});
    const firstPage = await findManyPublishedDoctors({}, { page: 1, pageSize: 1 });
    const secondPage = await findManyPublishedDoctors({}, { page: 2, pageSize: 1 });

    expect(total).toBe(2);
    expect(firstPage).toHaveLength(1);
    expect(secondPage).toHaveLength(1);
    expect(firstPage[0].slug).not.toBe(secondPage[0].slug);
  });

  it("should return empty results for an empty result set rather than erroring", async () => {
    await seedBasicFixture();

    const result = await findManyPublishedDoctors({ specialtySlug: "does-not-exist" }, { page: 1, pageSize: 10 });

    expect(result).toEqual([]);
  });

  it("should find a published doctor by slug with full profile relations", async () => {
    await seedBasicFixture();

    const result = await findPublishedDoctorBySlug("dr-test-rahman");

    expect(result?.fullName).toBe("Dr. Test Rahman");
    expect(result?.specialties).toHaveLength(1);
    expect(result?.hospitals).toHaveLength(1);
    expect(result?.chambers).toHaveLength(1);
  });

  it("should not return a DRAFT doctor by slug", async () => {
    await seedBasicFixture();

    const result = await findPublishedDoctorBySlug("dr-test-draft");

    expect(result).toBeNull();
  });

  it("should return null for a nonexistent slug", async () => {
    const result = await findPublishedDoctorBySlug("does-not-exist");

    expect(result).toBeNull();
  });

  it("should list only published doctor slugs", async () => {
    await seedBasicFixture();

    const result = await findAllPublishedDoctorSlugs();

    expect(result.sort()).toEqual(["dr-test-akter", "dr-test-rahman"]);
  });

  it("should enforce a unique doctor slug", async () => {
    const { cardiology } = await seedBasicFixture();

    await expect(
      prisma.doctor.create({
        data: {
          slug: "dr-test-rahman",
          fullName: "Duplicate Slug",
          status: DoctorStatus.PUBLISHED,
          primarySpecialty: { connect: { id: cardiology.id } },
          specialties: { create: [{ specialtyId: cardiology.id }] },
        },
      }),
    ).rejects.toThrow();
  });

  it("should restrict deleting a specialty still referenced as a doctor's primary specialty", async () => {
    const { cardiology } = await seedBasicFixture();

    await expect(prisma.specialty.delete({ where: { id: cardiology.id } })).rejects.toThrow();
  });
});
