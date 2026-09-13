import type { Hospital } from "@/generated/prisma/client";
import { buildPaginatedResult, type PaginatedResult } from "@/lib/pagination/pagination";
import {
  countHospitals,
  createHospitalRecord,
  findAllHospitals,
  findAllHospitalSlugs,
  findHospitalBySlug,
  findManyHospitals,
} from "./hospital.repository";
import { toHospitalDTO } from "./hospital.mapper";
import {
  createHospitalInputSchema,
  hospitalSlugParamSchema,
  type CreateHospitalInput,
  type HospitalListQuery,
} from "./hospital.validation";
import type { HospitalDTO, HospitalListFilters, HospitalOptionDTO } from "./hospital.types";

export async function createHospital(input: CreateHospitalInput): Promise<Hospital> {
  const validated = createHospitalInputSchema.parse(input);
  return createHospitalRecord(validated);
}

/** For admin selects that need to relate a record to a Hospital by id. */
export async function listHospitalOptions(): Promise<HospitalOptionDTO[]> {
  const rows = await findAllHospitals();
  return rows.map((row) => ({ id: row.id, name: row.name }));
}

function toFilters(query: HospitalListQuery): HospitalListFilters {
  return { locationSlug: query.location };
}

export async function listHospitals(query: HospitalListQuery): Promise<PaginatedResult<HospitalDTO>> {
  const filters = toFilters(query);
  const pagination = { page: query.page, pageSize: query.pageSize };

  const [records, totalItems] = await Promise.all([
    findManyHospitals(filters, pagination),
    countHospitals(filters),
  ]);

  return buildPaginatedResult(records.map(toHospitalDTO), totalItems, pagination);
}

export async function getHospitalBySlug(rawSlug: string): Promise<HospitalDTO | null> {
  const parsed = hospitalSlugParamSchema.safeParse(rawSlug);
  if (!parsed.success) return null;

  const row = await findHospitalBySlug(parsed.data);
  return row ? toHospitalDTO(row) : null;
}

export async function listAllHospitalSlugs(): Promise<string[]> {
  return findAllHospitalSlugs();
}
