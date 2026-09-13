import { buildPaginatedResult, type PaginatedResult } from "@/lib/pagination/pagination";
import { countHospitals, findAllHospitalSlugs, findHospitalBySlug, findManyHospitals } from "./hospital.repository";
import { toHospitalDTO } from "./hospital.mapper";
import { hospitalSlugParamSchema, type HospitalListQuery } from "./hospital.validation";
import type { HospitalDTO, HospitalListFilters } from "./hospital.types";

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
