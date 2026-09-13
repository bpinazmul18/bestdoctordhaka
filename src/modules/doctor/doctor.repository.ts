import { prisma } from "@/lib/db/prisma";
import { DoctorStatus, Prisma } from "@/generated/prisma/client";
import type { Doctor } from "@/generated/prisma/client";
import { toSkipTake, type PaginationParams } from "@/lib/pagination/pagination";
import type { CreateDoctorInput } from "./doctor.validation";
import type { DoctorListFilters } from "./doctor.types";

const doctorListInclude = {
  primarySpecialty: true,
  chambers: { include: { location: true } },
} satisfies Prisma.DoctorInclude;

const doctorProfileInclude = {
  primarySpecialty: true,
  specialties: { include: { specialty: true } },
  hospitals: { include: { hospital: true } },
  chambers: { include: { location: true, hospital: true } },
} satisfies Prisma.DoctorInclude;

export type DoctorListRecord = Prisma.DoctorGetPayload<{ include: typeof doctorListInclude }>;
export type DoctorProfileRecord = Prisma.DoctorGetPayload<{ include: typeof doctorProfileInclude }>;

function buildWhere(filters: DoctorListFilters): Prisma.DoctorWhereInput {
  const where: Prisma.DoctorWhereInput = { status: DoctorStatus.PUBLISHED };

  if (filters.specialtySlug) {
    where.specialties = { some: { specialty: { slug: filters.specialtySlug } } };
  }
  if (filters.locationSlug) {
    where.chambers = { some: { location: { slug: filters.locationSlug } } };
  }
  if (filters.hospitalSlug) {
    where.hospitals = { some: { hospital: { slug: filters.hospitalSlug } } };
  }
  if (filters.searchTerm) {
    // Basic, non-ranked name search (ILIKE via Prisma's case-insensitive
    // `contains`). Not backed by a dedicated search index — see docs/DATABASE.md
    // and the Phase 1 design notes; ranked/advanced search is a Phase 3 concern.
    where.fullName = { contains: filters.searchTerm, mode: "insensitive" };
  }

  return where;
}

export async function findManyPublishedDoctors(
  filters: DoctorListFilters,
  pagination: PaginationParams,
): Promise<DoctorListRecord[]> {
  const { skip, take } = toSkipTake(pagination);

  return prisma.doctor.findMany({
    where: buildWhere(filters),
    include: doctorListInclude,
    orderBy: { fullName: "asc" },
    skip,
    take,
  });
}

export async function countPublishedDoctors(filters: DoctorListFilters): Promise<number> {
  return prisma.doctor.count({ where: buildWhere(filters) });
}

export async function findPublishedDoctorBySlug(slug: string): Promise<DoctorProfileRecord | null> {
  return prisma.doctor.findFirst({
    where: { slug, status: DoctorStatus.PUBLISHED },
    include: doctorProfileInclude,
  });
}

export async function findAllPublishedDoctorSlugs(): Promise<string[]> {
  const rows = await prisma.doctor.findMany({
    where: { status: DoctorStatus.PUBLISHED },
    select: { slug: true },
  });
  return rows.map((row) => row.slug);
}

export async function createDoctorRecord(input: CreateDoctorInput): Promise<Doctor> {
  return prisma.doctor.create({
    data: {
      slug: input.slug,
      fullName: input.fullName,
      degrees: input.degrees,
      designation: input.designation,
      shortBio: input.shortBio,
      profileImageUrl: input.profileImageUrl,
      yearsOfExperience: input.yearsOfExperience,
      conditionsTreated: input.conditionsTreated ?? [],
      status: input.status,
      primarySpecialty: { connect: { id: input.primarySpecialtyId } },
      specialties: {
        create: input.specialtyIds.map((specialtyId) => ({
          specialty: { connect: { id: specialtyId } },
        })),
      },
      hospitals: input.hospitalIds
        ? {
            create: input.hospitalIds.map((hospitalId) => ({
              hospital: { connect: { id: hospitalId } },
            })),
          }
        : undefined,
      chambers: input.chambers
        ? {
            create: input.chambers.map((chamber) => ({
              addressLine: chamber.addressLine,
              name: chamber.name,
              contactPhone: chamber.contactPhone,
              whatsappNumber: chamber.whatsappNumber,
              visitingHoursNote: chamber.visitingHoursNote,
              location: { connect: { id: chamber.locationId } },
              hospital: chamber.hospitalId ? { connect: { id: chamber.hospitalId } } : undefined,
            })),
          }
        : undefined,
    },
  });
}
