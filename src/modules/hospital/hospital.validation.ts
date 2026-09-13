import { z } from "zod";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination/pagination";
import { optionalSlugParam, paginationQuerySchema, slugSchema } from "@/lib/validation/common";

export const hospitalListQuerySchema = paginationQuerySchema.extend({
  location: optionalSlugParam,
});

export type HospitalListQuery = z.infer<typeof hospitalListQuerySchema>;

/**
 * Public listing pages must never hard-fail on a malformed query string (a
 * crawler or a stale bookmark can send anything). Invalid input falls back
 * to the unfiltered first page rather than throwing.
 */
export function parseHospitalListQuery(raw: unknown): HospitalListQuery {
  const result = hospitalListQuerySchema.safeParse(raw);
  if (result.success) return result.data;

  return { page: 1, pageSize: DEFAULT_PAGE_SIZE };
}

export const hospitalSlugParamSchema = slugSchema;
