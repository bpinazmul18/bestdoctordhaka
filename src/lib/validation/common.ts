import { z } from "zod";
import { DEFAULT_PAGE_SIZE, MAX_PAGE, MAX_PAGE_SIZE } from "@/lib/pagination/pagination";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(SLUG_PATTERN, "Slug must be lowercase, URL-safe, and hyphen-separated");

/**
 * Next.js exposes searchParams entries as string | string[] | undefined
 * (repeated query keys become arrays). Query filters here are single-valued,
 * so we deterministically take the first occurrence.
 */
export function toOptionalString(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }
  return typeof value === "string" ? value : undefined;
}

export const optionalSlugParam = z.preprocess(toOptionalString, slugSchema.optional());

export const optionalSearchTermParam = z.preprocess(
  toOptionalString,
  z.string().trim().min(1).max(100).optional(),
);

export const paginationQuerySchema = z.object({
  page: z.preprocess(
    toOptionalString,
    z.coerce.number().int().min(1).max(MAX_PAGE).default(1),
  ),
  pageSize: z.preprocess(
    toOptionalString,
    z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  ),
});
