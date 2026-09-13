import type { Doctor } from "@/generated/prisma/client";
import { buildPaginatedResult, type PaginatedResult } from "@/lib/pagination/pagination";
import {
  countPublishedDoctors,
  createDoctorRecord,
  findAllPublishedDoctorSlugs,
  findManyPublishedDoctors,
  findPublishedDoctorBySlug,
} from "./doctor.repository";
import { toDoctorListItemDTO, toDoctorProfileDTO } from "./doctor.mapper";
import {
  createDoctorInputSchema,
  doctorSlugParamSchema,
  type CreateDoctorInput,
  type DoctorListQuery,
} from "./doctor.validation";
import type { DoctorListFilters, DoctorListItemDTO, DoctorProfileDTO } from "./doctor.types";

function toFilters(query: DoctorListQuery): DoctorListFilters {
  return {
    specialtySlug: query.specialty,
    locationSlug: query.location,
    hospitalSlug: query.hospital,
    searchTerm: query.q,
  };
}

export async function listDoctors(query: DoctorListQuery): Promise<PaginatedResult<DoctorListItemDTO>> {
  const filters = toFilters(query);
  const pagination = { page: query.page, pageSize: query.pageSize };

  const [records, totalItems] = await Promise.all([
    findManyPublishedDoctors(filters, pagination),
    countPublishedDoctors(filters),
  ]);

  return buildPaginatedResult(records.map(toDoctorListItemDTO), totalItems, pagination);
}

export async function getDoctorProfile(rawSlug: string): Promise<DoctorProfileDTO | null> {
  const parsed = doctorSlugParamSchema.safeParse(rawSlug);
  if (!parsed.success) return null;

  const record = await findPublishedDoctorBySlug(parsed.data);
  return record ? toDoctorProfileDTO(record) : null;
}

export async function listAllPublishedDoctorSlugs(): Promise<string[]> {
  return findAllPublishedDoctorSlugs();
}

/**
 * The only write path for Doctor data in Phase 1 (invoked from seed/admin
 * scripts, never over HTTP - there is no authenticated mutation surface
 * yet). Enforces the primarySpecialtyId/specialtyIds consistency invariant
 * at the service layer since it cannot be expressed as a DB constraint.
 */
export async function createDoctor(input: CreateDoctorInput): Promise<Doctor> {
  const validated = createDoctorInputSchema.parse(input);
  return createDoctorRecord(validated);
}
