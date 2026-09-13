import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import { toSkipTake, type PaginationParams } from "@/lib/pagination/pagination";
import type { DiagnosticCenterListFilters } from "./diagnostic-center.types";

const diagnosticCenterListInclude = { location: true } satisfies Prisma.DiagnosticCenterInclude;

const diagnosticCenterProfileInclude = {
  location: true,
  tests: { include: { diagnosticTest: true } },
} satisfies Prisma.DiagnosticCenterInclude;

export type DiagnosticCenterListRecord = Prisma.DiagnosticCenterGetPayload<{
  include: typeof diagnosticCenterListInclude;
}>;
export type DiagnosticCenterProfileRecord = Prisma.DiagnosticCenterGetPayload<{
  include: typeof diagnosticCenterProfileInclude;
}>;

function buildWhere(filters: DiagnosticCenterListFilters): Prisma.DiagnosticCenterWhereInput {
  const where: Prisma.DiagnosticCenterWhereInput = {};

  if (filters.locationSlug) {
    where.location = { slug: filters.locationSlug };
  }
  if (filters.testSlug) {
    where.tests = { some: { diagnosticTest: { slug: filters.testSlug } } };
  }

  return where;
}

export async function findManyDiagnosticCenters(
  filters: DiagnosticCenterListFilters,
  pagination: PaginationParams,
): Promise<DiagnosticCenterListRecord[]> {
  const { skip, take } = toSkipTake(pagination);

  return prisma.diagnosticCenter.findMany({
    where: buildWhere(filters),
    include: diagnosticCenterListInclude,
    orderBy: { name: "asc" },
    skip,
    take,
  });
}

export async function countDiagnosticCenters(filters: DiagnosticCenterListFilters): Promise<number> {
  return prisma.diagnosticCenter.count({ where: buildWhere(filters) });
}

export async function findDiagnosticCenterBySlug(slug: string): Promise<DiagnosticCenterProfileRecord | null> {
  return prisma.diagnosticCenter.findUnique({
    where: { slug },
    include: diagnosticCenterProfileInclude,
  });
}

export async function findAllDiagnosticCenterSlugs(): Promise<string[]> {
  const rows = await prisma.diagnosticCenter.findMany({ select: { slug: true } });
  return rows.map((row) => row.slug);
}
