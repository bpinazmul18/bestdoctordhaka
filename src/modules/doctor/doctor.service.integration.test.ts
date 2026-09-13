import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { getRequiredEnv } from "@/lib/utils/env";
import { createDoctor, getDoctorProfile } from "./doctor.service";

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
  await prisma.diagnosticCenterTest.deleteMany();
  await prisma.diagnosticCenter.deleteMany();
  await prisma.location.deleteMany();
  await prisma.specialty.deleteMany();
});

describe("createDoctor - primary specialty consistency", () => {
  it("should persist a doctor when primarySpecialtyId is included in specialtyIds", async () => {
    const cardiology = await prisma.specialty.create({ data: { slug: "cardiology", name: "Cardiology" } });
    const medicine = await prisma.specialty.create({ data: { slug: "internal-medicine", name: "Internal Medicine" } });

    await createDoctor({
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      status: "PUBLISHED",
      primarySpecialtyId: cardiology.id,
      specialtyIds: [cardiology.id, medicine.id],
    });

    const profile = await getDoctorProfile("dr-test-rahman");

    expect(profile?.primarySpecialty.slug).toBe("cardiology");
    expect(profile?.specialties.map((s) => s.slug).sort()).toEqual(["cardiology", "internal-medicine"]);
  });

  it("should reject and persist nothing when primarySpecialtyId is not in specialtyIds", async () => {
    const cardiology = await prisma.specialty.create({ data: { slug: "cardiology", name: "Cardiology" } });
    const dermatology = await prisma.specialty.create({ data: { slug: "dermatology", name: "Dermatology" } });

    await expect(
      createDoctor({
        slug: "dr-test-invalid",
        fullName: "Dr. Test Invalid",
        status: "PUBLISHED",
        primarySpecialtyId: cardiology.id,
        specialtyIds: [dermatology.id],
      }),
    ).rejects.toThrow();

    const doctorCount = await prisma.doctor.count();
    expect(doctorCount).toBe(0);
  });

  it("should reject a primarySpecialtyId that does not reference any real specialty", async () => {
    await expect(
      createDoctor({
        slug: "dr-test-invalid",
        fullName: "Dr. Test Invalid",
        status: "PUBLISHED",
        primarySpecialtyId: "specialty-that-does-not-exist",
        specialtyIds: ["specialty-that-does-not-exist"],
      }),
    ).rejects.toThrow();

    const doctorCount = await prisma.doctor.count();
    expect(doctorCount).toBe(0);
  });
});
