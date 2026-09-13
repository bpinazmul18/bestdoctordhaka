import { z } from "zod";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination/pagination";
import { optionalSearchTermParam, optionalSlugParam, paginationQuerySchema, slugSchema } from "@/lib/validation/common";

export const doctorListQuerySchema = paginationQuerySchema.extend({
  specialty: optionalSlugParam,
  location: optionalSlugParam,
  hospital: optionalSlugParam,
  q: optionalSearchTermParam,
});

export type DoctorListQuery = z.infer<typeof doctorListQuerySchema>;

/**
 * Public listing/filter pages must never hard-fail on a malformed query
 * string (a crawler or a stale bookmark can send anything). Invalid input
 * falls back to the unfiltered first page rather than throwing.
 */
export function parseDoctorListQuery(raw: unknown): DoctorListQuery {
  const result = doctorListQuerySchema.safeParse(raw);
  if (result.success) return result.data;

  return { page: 1, pageSize: DEFAULT_PAGE_SIZE };
}

export const doctorSlugParamSchema = slugSchema;

const createChamberInputSchema = z.object({
  locationId: z.string().trim().min(1),
  hospitalId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).max(150).optional(),
  addressLine: z.string().trim().min(1).max(300),
  contactPhone: z.string().trim().min(1).max(30).optional(),
  whatsappNumber: z.string().trim().min(1).max(30).optional(),
  visitingHoursNote: z.string().trim().min(1).max(200).optional(),
});

export const createDoctorInputSchema = z
  .object({
    slug: slugSchema,
    fullName: z.string().trim().min(1).max(150),
    degrees: z.string().trim().min(1).max(200).optional(),
    designation: z.string().trim().min(1).max(150).optional(),
    shortBio: z.string().trim().min(1).max(1000).optional(),
    profileImageUrl: z.string().trim().url().optional(),
    yearsOfExperience: z.number().int().min(0).max(80).optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    primarySpecialtyId: z.string().trim().min(1),
    specialtyIds: z.array(z.string().trim().min(1)).min(1),
    hospitalIds: z.array(z.string().trim().min(1)).optional(),
    chambers: z.array(createChamberInputSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.specialtyIds.includes(data.primarySpecialtyId)) {
      ctx.addIssue({
        code: "custom",
        path: ["primarySpecialtyId"],
        message: "primarySpecialtyId must be included in specialtyIds",
      });
    }
  });

export type CreateDoctorInput = z.infer<typeof createDoctorInputSchema>;
export type CreateChamberInput = z.infer<typeof createChamberInputSchema>;
