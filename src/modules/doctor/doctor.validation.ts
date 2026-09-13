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
    conditionsTreated: z.array(z.string().trim().min(1).max(100)).max(30).optional(),
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

/**
 * The admin form collects conditions treated as one free-text line per
 * condition (a textarea), since there is no fixed taxonomy yet. Blank
 * lines and duplicates (case-insensitive) are dropped; schema-level
 * length/count limits are still enforced by createDoctorInputSchema.
 */
export function parseConditionsTreatedText(raw: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

const CHAMBER_FIELD_NAMES = [
  "chamberLocationId",
  "chamberHospitalId",
  "chamberName",
  "chamberAddressLine",
  "chamberContactPhone",
  "chamberWhatsappNumber",
  "chamberVisitingHours",
  "chamberClosedDay",
] as const;

export type ChamberFormRowsResult =
  | { ok: true; chambers: CreateChamberInput[] }
  | { ok: false; error: string };

/**
 * The admin Add Doctor form submits one or more repeatable chamber rows as
 * parallel arrays (all inputs sharing a name, e.g. `chamberLocationId`),
 * since FormData has no native support for nested array-of-objects fields.
 * A row is dropped silently if every field in it is blank (the form always
 * renders at least one empty row), and rejected with a single message if
 * only some of it is filled in — the DB doesn't need per-chamber field
 * errors for what's ultimately an optional, small admin form.
 */
export function parseChamberRowsFromFormData(formData: FormData): ChamberFormRowsResult {
  const columns = Object.fromEntries(
    CHAMBER_FIELD_NAMES.map((name) => [name, formData.getAll(name).map(String)]),
  ) as Record<(typeof CHAMBER_FIELD_NAMES)[number], string[]>;

  const rowCount = columns.chamberLocationId.length;
  const chambers: CreateChamberInput[] = [];

  for (let index = 0; index < rowCount; index++) {
    const row = {
      locationId: (columns.chamberLocationId[index] ?? "").trim(),
      hospitalId: (columns.chamberHospitalId[index] ?? "").trim(),
      name: (columns.chamberName[index] ?? "").trim(),
      addressLine: (columns.chamberAddressLine[index] ?? "").trim(),
      contactPhone: (columns.chamberContactPhone[index] ?? "").trim(),
      whatsappNumber: (columns.chamberWhatsappNumber[index] ?? "").trim(),
      visitingHours: (columns.chamberVisitingHours[index] ?? "").trim(),
      closedDay: (columns.chamberClosedDay[index] ?? "").trim(),
    };

    const isBlankRow = Object.values(row).every((value) => value === "");
    if (isBlankRow) continue;

    if (!row.locationId || !row.addressLine) {
      return { ok: false, error: "Each chamber must have a location and an address." };
    }

    chambers.push({
      locationId: row.locationId,
      hospitalId: row.hospitalId || undefined,
      name: row.name || undefined,
      addressLine: row.addressLine,
      contactPhone: row.contactPhone || undefined,
      whatsappNumber: row.whatsappNumber || undefined,
      visitingHoursNote:
        [row.visitingHours, row.closedDay ? `Closed ${row.closedDay}` : ""].filter(Boolean).join(" · ") ||
        undefined,
    });
  }

  return { ok: true, chambers };
}
