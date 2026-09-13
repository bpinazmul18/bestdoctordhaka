// Generates 600 deterministic, clearly-fake doctors for pagination/search/
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

const HOSPITALS = [
  { slug: "square-hospital-test", name: "Square Hospital (Test Data)", locationSlug: "dhanmondi" },
  { slug: "apollo-hospital-test", name: "Apollo Hospital (Test Data)", locationSlug: "bashundhara" },
  { slug: "united-hospital-test", name: "United Hospital (Test Data)", locationSlug: "gulshan" },
  { slug: "labaid-hospital-test", name: "Labaid Hospital (Test Data)", locationSlug: "mirpur" },
  { slug: "popular-hospital-test", name: "Popular Hospital (Test Data)", locationSlug: "uttara" },
  { slug: "ibn-sina-hospital-test", name: "Ibn Sina Hospital (Test Data)", locationSlug: "banani" },
];

const DEGREES = ["MBBS (Test)", "MBBS, FCPS (Test)", "MBBS, MD (Test)", "MBBS, MS (Test)"];
const DESIGNATIONS = ["Test Consultant", "Test Senior Consultant", "Test Registrar", "Test Assistant Professor"];

async function main() {
  const specialtyRecords = await Promise.all(
    SPECIALTIES.map((s) => prisma.specialty.upsert({ where: { slug: s.slug }, update: {}, create: s })),
  );

  const locationRecords = await Promise.all(
    LOCATIONS.map((l) =>
      prisma.location.upsert({ where: { slug: l.slug }, update: {}, create: { ...l, city: "Dhaka" } }),
    ),
  );

  const locationBySlug = new Map(locationRecords.map((l) => [l.slug, l]));

  const hospitalRecords = await Promise.all(
    HOSPITALS.map((h) =>
      prisma.hospital.upsert({
        where: { slug: h.slug },
        update: {},
        create: { slug: h.slug, name: h.name, locationId: locationBySlug.get(h.locationSlug)!.id },
      }),
    ),
  );

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

  console.log(`Bulk seed complete: ${DOCTOR_COUNT} test doctors.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
