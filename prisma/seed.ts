// Deterministic, minimal, clearly-fake seed data for local development.
// Never seed real doctor names, real BMDC information, or real reviews -
// see docs/DATABASE.md and CLAUDE.md's Healthcare Data rules.
//
// This bypasses the doctor.service validation layer intentionally (see the
// Phase 1 implementation notes): the primarySpecialtyId/specialtyIds
// invariant it enforces is satisfied by construction below, and importing
// the service here would transitively import the shared Prisma singleton
// before env vars are loaded. That invariant is covered independently by
// doctor.service.integration.test.ts.
import { loadEnvConfig } from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, DoctorStatus } from "@/generated/prisma/client";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const cardiology = await prisma.specialty.upsert({
    where: { slug: "cardiology" },
    update: {},
    create: {
      slug: "cardiology",
      name: "Cardiology",
      description: "Diagnosis and treatment of heart conditions.",
    },
  });

  const dermatology = await prisma.specialty.upsert({
    where: { slug: "dermatology" },
    update: {},
    create: {
      slug: "dermatology",
      name: "Dermatology",
      description: "Diagnosis and treatment of skin conditions.",
    },
  });

  const internalMedicine = await prisma.specialty.upsert({
    where: { slug: "internal-medicine" },
    update: {},
    create: { slug: "internal-medicine", name: "Internal Medicine" },
  });

  const dhanmondi = await prisma.location.upsert({
    where: { slug: "dhanmondi" },
    update: {},
    create: { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" },
  });

  const gulshan = await prisma.location.upsert({
    where: { slug: "gulshan" },
    update: {},
    create: { slug: "gulshan", name: "Gulshan", city: "Dhaka" },
  });

  const squareHospital = await prisma.hospital.upsert({
    where: { slug: "square-hospital-test" },
    update: {},
    create: {
      slug: "square-hospital-test",
      name: "Square Hospital (Test Data)",
      locationId: dhanmondi.id,
    },
  });

  const xray = await prisma.diagnosticTest.upsert({
    where: { slug: "x-ray" },
    update: {},
    create: { slug: "x-ray", name: "X-Ray", description: "Diagnostic imaging using radiation." },
  });

  const bloodTest = await prisma.diagnosticTest.upsert({
    where: { slug: "blood-test" },
    update: {},
    create: { slug: "blood-test", name: "Blood Test", description: "Laboratory analysis of a blood sample." },
  });

  await prisma.diagnosticCenter.upsert({
    where: { slug: "test-diagnostic-center" },
    update: {},
    create: {
      slug: "test-diagnostic-center",
      name: "Test Diagnostic Center",
      locationId: dhanmondi.id,
      tests: {
        create: [{ diagnosticTestId: xray.id }, { diagnosticTestId: bloodTest.id }],
      },
    },
  });

  await prisma.doctor.upsert({
    where: { slug: "dr-test-rahman" },
    update: {},
    create: {
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      degrees: "MBBS (Test)",
      designation: "Test Consultant",
      status: DoctorStatus.PUBLISHED,
      primarySpecialty: { connect: { id: cardiology.id } },
      specialties: {
        create: [{ specialtyId: cardiology.id }, { specialtyId: internalMedicine.id }],
      },
      hospitals: { create: [{ hospitalId: squareHospital.id }] },
      chambers: {
        create: [
          {
            name: "Test Chamber A",
            addressLine: "123 Test Road",
            locationId: dhanmondi.id,
            hospitalId: squareHospital.id,
            contactPhone: "0000-000000",
            visitingHoursNote: "Test data - Sat-Thu, 5pm-9pm",
          },
        ],
      },
    },
  });

  await prisma.doctor.upsert({
    where: { slug: "dr-test-akter" },
    update: {},
    create: {
      slug: "dr-test-akter",
      fullName: "Dr. Test Akter",
      degrees: "MBBS, FCPS (Test)",
      status: DoctorStatus.PUBLISHED,
      primarySpecialty: { connect: { id: dermatology.id } },
      specialties: { create: [{ specialtyId: dermatology.id }] },
      chambers: {
        create: [
          {
            addressLine: "45 Sample Avenue",
            locationId: gulshan.id,
            contactPhone: "0000-111111",
          },
        ],
      },
    },
  });

  // Intentionally DRAFT: verifies that unpublished doctors never surface in
  // listings or profile lookups (see docs/DATABASE.md Healthcare Integrity).
  await prisma.doctor.upsert({
    where: { slug: "dr-test-draft" },
    update: {},
    create: {
      slug: "dr-test-draft",
      fullName: "Dr. Test Draft",
      status: DoctorStatus.DRAFT,
      primarySpecialty: { connect: { id: internalMedicine.id } },
      specialties: { create: [{ specialtyId: internalMedicine.id }] },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
