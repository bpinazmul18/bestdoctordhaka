import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { Hospital } from "@/generated/prisma/client";
import { toSkipTake, type PaginationParams } from "@/lib/pagination/pagination";
import type { CreateHospitalInput } from "./hospital.validation";
import type { HospitalListFilters } from "./hospital.types";

const hospitalWithLocationInclude = { location: true } satisfies Prisma.HospitalInclude;

export type HospitalRecord = Prisma.HospitalGetPayload<{ include: typeof hospitalWithLocationInclude }>;

export async function createHospitalRecord(input: CreateHospitalInput): Promise<Hospital> {
  return prisma.hospital.create({
    data: {
      slug: input.slug,
      name: input.name,
      location: { connect: { id: input.locationId } },
    },
  });
}

function buildWhere(filters: HospitalListFilters): Prisma.HospitalWhereInput {
  const where: Prisma.HospitalWhereInput = {};

  if (filters.locationSlug) {
    where.location = { slug: filters.locationSlug };
  }

  return where;
}

export async function findManyHospitals(
  filters: HospitalListFilters,
  pagination: PaginationParams,
): Promise<HospitalRecord[]> {
  const { skip, take } = toSkipTake(pagination);

  return prisma.hospital.findMany({
    where: buildWhere(filters),
    include: hospitalWithLocationInclude,
    orderBy: { name: "asc" },
    skip,
    take,
  });
}

export async function countHospitals(filters: HospitalListFilters): Promise<number> {
  return prisma.hospital.count({ where: buildWhere(filters) });
}

export async function findHospitalBySlug(slug: string): Promise<HospitalRecord | null> {
  return prisma.hospital.findUnique({ where: { slug }, include: hospitalWithLocationInclude });
}

export async function findAllHospitals(): Promise<Hospital[]> {
  return prisma.hospital.findMany({ orderBy: { name: "asc" } });
}

export async function findAllHospitalSlugs(): Promise<string[]> {
  const rows = await prisma.hospital.findMany({ select: { slug: true } });
  return rows.map((row) => row.slug);
}
