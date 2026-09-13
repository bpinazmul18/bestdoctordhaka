import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { getRequiredEnv } from "@/lib/utils/env";
import { findAllLocationSlugs, findAllLocations, findLocationBySlug } from "./location.repository";

const adapter = new PrismaPg({ connectionString: getRequiredEnv("TEST_DATABASE_URL") });
const prisma = new PrismaClient({ adapter });

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.chamber.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.location.deleteMany();
});

describe("location.repository", () => {
  it("should list all locations ordered by name", async () => {
    await prisma.location.createMany({
      data: [
        { slug: "gulshan", name: "Gulshan", city: "Dhaka" },
        { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" },
      ],
    });

    const result = await findAllLocations();

    expect(result.map((l) => l.name)).toEqual(["Dhanmondi", "Gulshan"]);
  });

  it("should find a location by slug", async () => {
    await prisma.location.create({ data: { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" } });

    const result = await findLocationBySlug("dhanmondi");

    expect(result?.name).toBe("Dhanmondi");
    expect(result?.city).toBe("Dhaka");
  });

  it("should return null for an unknown slug", async () => {
    const result = await findLocationBySlug("does-not-exist");

    expect(result).toBeNull();
  });

  it("should list all location slugs", async () => {
    await prisma.location.createMany({
      data: [
        { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" },
        { slug: "gulshan", name: "Gulshan", city: "Dhaka" },
      ],
    });

    const result = await findAllLocationSlugs();

    expect(result.sort()).toEqual(["dhanmondi", "gulshan"]);
  });

  it("should require an explicit city with no silent default", async () => {
    await expect(
      prisma.location.create({
        data: { slug: "dhanmondi", name: "Dhanmondi" } as never,
      }),
    ).rejects.toThrow();
  });
});
