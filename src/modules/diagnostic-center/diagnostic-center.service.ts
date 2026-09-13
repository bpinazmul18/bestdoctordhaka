import type { DiagnosticCenter } from "@/generated/prisma/client";
import { buildPaginatedResult, type PaginatedResult } from "@/lib/pagination/pagination";
import {
  countDiagnosticCenters,
  createDiagnosticCenterRecord,
  findAllDiagnosticCenterSlugs,
  findDiagnosticCenterBySlug,
  findManyDiagnosticCenters,
} from "./diagnostic-center.repository";
import { toDiagnosticCenterListItemDTO, toDiagnosticCenterProfileDTO } from "./diagnostic-center.mapper";
import {
  createDiagnosticCenterInputSchema,
  diagnosticCenterSlugParamSchema,
  type CreateDiagnosticCenterInput,
  type DiagnosticCenterListQuery,
} from "./diagnostic-center.validation";
import type {
  DiagnosticCenterListFilters,
  DiagnosticCenterListItemDTO,
  DiagnosticCenterProfileDTO,
} from "./diagnostic-center.types";

export async function createDiagnosticCenter(input: CreateDiagnosticCenterInput): Promise<DiagnosticCenter> {
  const validated = createDiagnosticCenterInputSchema.parse(input);
  return createDiagnosticCenterRecord(validated);
}

function toFilters(query: DiagnosticCenterListQuery): DiagnosticCenterListFilters {
  return { locationSlug: query.location, testSlug: query.test };
}

export async function listDiagnosticCenters(
  query: DiagnosticCenterListQuery,
): Promise<PaginatedResult<DiagnosticCenterListItemDTO>> {
  const filters = toFilters(query);
  const pagination = { page: query.page, pageSize: query.pageSize };

  const [records, totalItems] = await Promise.all([
    findManyDiagnosticCenters(filters, pagination),
    countDiagnosticCenters(filters),
  ]);

  return buildPaginatedResult(records.map(toDiagnosticCenterListItemDTO), totalItems, pagination);
}

export async function getDiagnosticCenterBySlug(rawSlug: string): Promise<DiagnosticCenterProfileDTO | null> {
  const parsed = diagnosticCenterSlugParamSchema.safeParse(rawSlug);
  if (!parsed.success) return null;

  const row = await findDiagnosticCenterBySlug(parsed.data);
  return row ? toDiagnosticCenterProfileDTO(row) : null;
}

export async function listAllDiagnosticCenterSlugs(): Promise<string[]> {
  return findAllDiagnosticCenterSlugs();
}
