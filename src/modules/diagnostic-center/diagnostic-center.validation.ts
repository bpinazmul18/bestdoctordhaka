import { z } from "zod";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination/pagination";
import { optionalSlugParam, paginationQuerySchema, slugSchema } from "@/lib/validation/common";

export const diagnosticCenterListQuerySchema = paginationQuerySchema.extend({
  location: optionalSlugParam,
  test: optionalSlugParam,
});

export type DiagnosticCenterListQuery = z.infer<typeof diagnosticCenterListQuerySchema>;

/**
 * Public listing pages must never hard-fail on a malformed query string (a
 * crawler or a stale bookmark can send anything). Invalid input falls back
 * to the unfiltered first page rather than throwing.
 */
export function parseDiagnosticCenterListQuery(raw: unknown): DiagnosticCenterListQuery {
  const result = diagnosticCenterListQuerySchema.safeParse(raw);
  if (result.success) return result.data;

  return { page: 1, pageSize: DEFAULT_PAGE_SIZE };
}

export const diagnosticCenterSlugParamSchema = slugSchema;

export const createDiagnosticCenterInputSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1).max(200),
  locationId: z.string().trim().min(1),
  testIds: z.array(z.string().trim().min(1)).optional(),
});

export type CreateDiagnosticCenterInput = z.infer<typeof createDiagnosticCenterInputSchema>;
