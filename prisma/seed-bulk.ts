// Generates 600 deterministic, clearly-fake doctors, 500 clearly-fake
// hospitals, and 500 clearly-fake diagnostic centers for pagination/search/
// performance testing. Never run against production - see CLAUDE.md's
// Healthcare Data rules (never invent credentials, BMDC status, hospital
// affiliations, or reviews). Every record here is synthetic test data,
// marked as such in every name/degree/address field.
//
// This bypasses doctor.service validation the same way prisma/seed.ts does -
// see that file for why. The primarySpecialtyId/specialtyIds invariant the
// service enforces is satisfied by construction below.
import { loadEnvConfig } from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, DoctorStatus } from "@/generated/prisma/client";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const DOCTOR_COUNT = 600;
const HOSPITAL_COUNT = 500;
const DIAGNOSTIC_CENTER_COUNT = 500;

const SPECIALTIES = [
  { slug: "cardiology", name: "Cardiology" },
  { slug: "dermatology", name: "Dermatology" },
  { slug: "internal-medicine", name: "Internal Medicine" },
  { slug: "gynecology-obstetrics", name: "Gynecology & Obstetrics" },
  { slug: "orthopedics", name: "Orthopedics" },
  { slug: "pediatrics", name: "Pediatrics" },
  { slug: "ent", name: "ENT (Otolaryngology)" },
  { slug: "neurology", name: "Neurology" },
  { slug: "psychiatry", name: "Psychiatry" },
  { slug: "ophthalmology", name: "Ophthalmology" },
];

const LOCATIONS = [
  { slug: "dhanmondi", name: "Dhanmondi" },
  { slug: "gulshan", name: "Gulshan" },
  { slug: "uttara", name: "Uttara" },
  { slug: "mirpur", name: "Mirpur" },
  { slug: "banani", name: "Banani" },
  { slug: "mohammadpur", name: "Mohammadpur" },
  { slug: "motijheel", name: "Motijheel" },
  { slug: "bashundhara", name: "Bashundhara" },
];

// Named after a fixed pool of real Dhaka hospital brands, suffixed with a
// padded index and "(Test Data)" so each generated row is unambiguously
// synthetic while still producing varied, readable names at HOSPITAL_COUNT
// scale - see CLAUDE.md's Healthcare Data rules (never invent affiliations
// as if they were real; every record here is clearly marked as test data).
const HOSPITAL_BRANDS = [
  "Square Hospital",
  "Apollo Hospital",
  "United Hospital",
  "Labaid Hospital",
  "Popular Hospital",
  "Ibn Sina Hospital",
  "Evercare Hospital",
  "BIRDEM General Hospital",
  "Bangladesh Specialized Hospital",
  "Green Life Hospital",
];

const DIAGNOSTIC_TESTS = [
  { slug: "x-ray", name: "X-Ray" },
  { slug: "blood-test", name: "Blood Test" },
  { slug: "ct-scan", name: "CT Scan" },
  { slug: "mri", name: "MRI" },
  { slug: "ultrasound", name: "Ultrasound (USG)" },
  { slug: "ecg", name: "ECG" },
  { slug: "pathology", name: "Pathology" },
  { slug: "dental-x-ray", name: "Dental X-Ray" },
];

// Named after a fixed pool of real Dhaka diagnostic chain brands, suffixed
// with a padded index and "(Test Data)" for the same reason as
// HOSPITAL_BRANDS above - see that comment.
const DIAGNOSTIC_CENTER_BRANDS = [
  "Popular Diagnostic",
  "Ibn Sina Diagnostic",
  "Labaid Diagnostics",
  "Apollo Diagnostics",
  "Green Life Diagnostics",
  "Ad-din Diagnostic",
  "Bangladesh Diagnostic Centre",
  "Prime Diagnostic",
];

const DEGREES = ["MBBS (Test)", "MBBS, FCPS (Test)", "MBBS, MD (Test)", "MBBS, MS (Test)"];
const DESIGNATIONS = ["Test Consultant", "Test Senior Consultant", "Test Registrar", "Test Assistant Professor"];

async function main() {
  // Re-runnable: clear this script's own previously-generated rows first, so
  // changing DOCTOR_COUNT/HOSPITAL_COUNT and re-running never leaves stale
  // doctors/hospitals (or duplicate affiliations) behind. Scoped to this
  // script's deterministic id prefixes so seed.ts's fixture data is untouched.
  await prisma.chamber.deleteMany({ where: { doctorId: { startsWith: "test-bulk-doctor-" } } });
  await prisma.doctorHospital.deleteMany({ where: { doctorId: { startsWith: "test-bulk-doctor-" } } });
  await prisma.doctorSpecialty.deleteMany({ where: { doctorId: { startsWith: "test-bulk-doctor-" } } });
  await prisma.doctor.deleteMany({ where: { id: { startsWith: "test-bulk-doctor-" } } });
  await prisma.hospital.deleteMany({ where: { id: { startsWith: "test-bulk-hospital-" } } });
  await prisma.diagnosticCenterTest.deleteMany({
    where: { diagnosticCenterId: { startsWith: "test-bulk-diagnostic-center-" } },
  });
  await prisma.diagnosticCenter.deleteMany({ where: { id: { startsWith: "test-bulk-diagnostic-center-" } } });

  const specialtyRecords = await Promise.all(
    SPECIALTIES.map((s) => prisma.specialty.upsert({ where: { slug: s.slug }, update: {}, create: s })),
  );

  const locationRecords = await Promise.all(
    LOCATIONS.map((l) =>
      prisma.location.upsert({ where: { slug: l.slug }, update: {}, create: { ...l, city: "Dhaka" } }),
    ),
  );

  const hospitals: { id: string; slug: string; name: string; locationId: string }[] = [];
  for (let i = 1; i <= HOSPITAL_COUNT; i++) {
    const index = i - 1;
    const padded = String(i).padStart(4, "0");
    const brand = HOSPITAL_BRANDS[index % HOSPITAL_BRANDS.length];
    const location = locationRecords[index % locationRecords.length];

    hospitals.push({
      id: `test-bulk-hospital-${padded}`,
      slug: `hospital-test-bulk-${padded}`,
      name: `${brand} ${padded} (Test Data)`,
      locationId: location.id,
    });
  }

  await prisma.hospital.createMany({ data: hospitals, skipDuplicates: true });
  const hospitalRecords = hospitals;

  const diagnosticTestRecords = await Promise.all(
    DIAGNOSTIC_TESTS.map((t) => prisma.diagnosticTest.upsert({ where: { slug: t.slug }, update: {}, create: t })),
  );

  const diagnosticCenters: { id: string; slug: string; name: string; locationId: string }[] = [];
  const diagnosticCenterTests: { diagnosticCenterId: string; diagnosticTestId: string }[] = [];
  for (let i = 1; i <= DIAGNOSTIC_CENTER_COUNT; i++) {
    const index = i - 1;
    const padded = String(i).padStart(4, "0");
    const id = `test-bulk-diagnostic-center-${padded}`;
    const brand = DIAGNOSTIC_CENTER_BRANDS[index % DIAGNOSTIC_CENTER_BRANDS.length];
    const location = locationRecords[index % locationRecords.length];
    const primaryTest = diagnosticTestRecords[index % diagnosticTestRecords.length];
    const secondaryTest = diagnosticTestRecords[(index + 3) % diagnosticTestRecords.length];

    diagnosticCenters.push({
      id,
      slug: `diagnostic-center-test-bulk-${padded}`,
      name: `${brand} ${padded} (Test Data)`,
      locationId: location.id,
    });

    diagnosticCenterTests.push({ diagnosticCenterId: id, diagnosticTestId: primaryTest.id });
    if (secondaryTest.id !== primaryTest.id) {
      diagnosticCenterTests.push({ diagnosticCenterId: id, diagnosticTestId: secondaryTest.id });
    }
  }

  await prisma.diagnosticCenter.createMany({ data: diagnosticCenters, skipDuplicates: true });
  await prisma.diagnosticCenterTest.createMany({ data: diagnosticCenterTests, skipDuplicates: true });

  const doctors: {
    id: string;
    slug: string;
    fullName: string;
    degrees: string;
    designation: string;
    yearsOfExperience: number;
    primarySpecialtyId: string;
    status: DoctorStatus;
  }[] = [];
  const doctorSpecialties: { doctorId: string; specialtyId: string }[] = [];
  const doctorHospitals: { doctorId: string; hospitalId: string }[] = [];
  const chambers: {
    doctorId: string;
    hospitalId: string | null;
    locationId: string;
    addressLine: string;
    contactPhone: string;
    visitingHoursNote: string;
  }[] = [];

  for (let i = 1; i <= DOCTOR_COUNT; i++) {
    const index = i - 1;
    const padded = String(i).padStart(4, "0");
    const id = `test-bulk-doctor-${padded}`;
    const slug = `dr-test-bulk-${padded}`;
    const specialty = specialtyRecords[index % specialtyRecords.length];
    const secondarySpecialty = specialtyRecords[(index + 3) % specialtyRecords.length];
    const location = locationRecords[index % locationRecords.length];
    const hospital = hospitalRecords[index % hospitalRecords.length];
    const hasHospital = i % 7 !== 0; // some doctors intentionally unaffiliated, for filter testing

    let status: DoctorStatus = DoctorStatus.PUBLISHED;
    if (i % 40 === 0) status = DoctorStatus.DRAFT;
    else if (i % 53 === 0) status = DoctorStatus.ARCHIVED; // 53 is coprime with 40, so this stays reachable

    doctors.push({
      id,
      slug,
      fullName: `Dr. Test Bulk ${padded}`,
      degrees: DEGREES[index % DEGREES.length],
      designation: DESIGNATIONS[index % DESIGNATIONS.length],
      yearsOfExperience: (index % 30) + 1,
      primarySpecialtyId: specialty.id,
      status,
    });

    doctorSpecialties.push({ doctorId: id, specialtyId: specialty.id });
    if (secondarySpecialty.id !== specialty.id) {
      doctorSpecialties.push({ doctorId: id, specialtyId: secondarySpecialty.id });
    }

    if (hasHospital) {
      doctorHospitals.push({ doctorId: id, hospitalId: hospital.id });
    }

    chambers.push({
      doctorId: id,
      hospitalId: hasHospital ? hospital.id : null,
      locationId: location.id,
      addressLine: `${i} Test Bulk Road (Test Data)`,
      contactPhone: `0000-${String(i).padStart(6, "0")}`,
      visitingHoursNote: "Test bulk data - not a real schedule",
    });
  }

  await prisma.doctor.createMany({ data: doctors, skipDuplicates: true });
  await prisma.doctorSpecialty.createMany({ data: doctorSpecialties, skipDuplicates: true });
  await prisma.doctorHospital.createMany({ data: doctorHospitals, skipDuplicates: true });
  await prisma.chamber.createMany({ data: chambers, skipDuplicates: true });

  console.log(
    `Bulk seed complete: ${DOCTOR_COUNT} test doctors, ${HOSPITAL_COUNT} test hospitals, ${DIAGNOSTIC_CENTER_COUNT} test diagnostic centers.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
