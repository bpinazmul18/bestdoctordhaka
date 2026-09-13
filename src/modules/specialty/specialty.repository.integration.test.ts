import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { getRequiredEnv } from "@/lib/utils/env";
import { createSpecialtyRecord, findAllSpecialties, findAllSpecialtySlugs, findSpecialtyBySlug } from "./specialty.repository";

const adapter = new PrismaPg({ connectionString: getRequiredEnv("TEST_DATABASE_URL") });
const prisma = new PrismaClient({ adapter });

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.doctorSpecialty.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.specialty.deleteMany();
});

describe("specialty.repository", () => {
  it("should list all specialties ordered by name", async () => {
    await prisma.specialty.createMany({
      data: [
        { slug: "dermatology", name: "Dermatology" },
        { slug: "cardiology", name: "Cardiology" },
      ],
    });

    const result = await findAllSpecialties();

    expect(result.map((s) => s.name)).toEqual(["Cardiology", "Dermatology"]);
  });

  it("should find a specialty by slug", async () => {
    await prisma.specialty.create({ data: { slug: "cardiology", name: "Cardiology" } });

    const result = await findSpecialtyBySlug("cardiology");

    expect(result?.name).toBe("Cardiology");
  });

  it("should return null for an unknown slug", async () => {
    const result = await findSpecialtyBySlug("does-not-exist");

    expect(result).toBeNull();
  });

  it("should list all specialty slugs", async () => {
    await prisma.specialty.createMany({
      data: [
        { slug: "cardiology", name: "Cardiology" },
        { slug: "dermatology", name: "Dermatology" },
      ],
    });

    const result = await findAllSpecialtySlugs();

    expect(result.sort()).toEqual(["cardiology", "dermatology"]);
  });

  it("should enforce unique slugs", async () => {
    await prisma.specialty.create({ data: { slug: "cardiology", name: "Cardiology" } });

    await expect(
      prisma.specialty.create({ data: { slug: "cardiology", name: "Cardiology Duplicate" } }),
    ).rejects.toThrow();
  });

  it("should create a specialty", async () => {
    const result = await createSpecialtyRecord({
      slug: "cardiology",
      name: "Cardiology",
      description: "Heart care",
    });

    expect(result.slug).toBe("cardiology");
    const stored = await prisma.specialty.findUnique({ where: { slug: "cardiology" } });
    expect(stored?.name).toBe("Cardiology");
  });

  it("should reject creating a specialty with a duplicate slug", async () => {
    await createSpecialtyRecord({ slug: "cardiology", name: "Cardiology" });

    await expect(createSpecialtyRecord({ slug: "cardiology", name: "Duplicate" })).rejects.toThrow();
  });
});
