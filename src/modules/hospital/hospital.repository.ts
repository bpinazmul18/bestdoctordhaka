import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import { toSkipTake, type PaginationParams } from "@/lib/pagination/pagination";
import type { HospitalListFilters } from "./hospital.types";

const hospitalWithLocationInclude = { location: true } satisfies Prisma.HospitalInclude;

export type HospitalRecord = Prisma.HospitalGetPayload<{ include: typeof hospitalWithLocationInclude }>;

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

export async function findAllHospitalSlugs(): Promise<string[]> {
  const rows = await prisma.hospital.findMany({ select: { slug: true } });
  return rows.map((row) => row.slug);
}
