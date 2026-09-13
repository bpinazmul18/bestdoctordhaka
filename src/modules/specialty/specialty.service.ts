import type { Specialty } from "@/generated/prisma/client";
import { slugSchema } from "@/lib/validation/common";
import {
  createSpecialtyRecord,
  findAllSpecialties,
  findAllSpecialtySlugs,
  findSpecialtyBySlug,
} from "./specialty.repository";
import { toSpecialtyDTO, toSpecialtyOptionDTO } from "./specialty.mapper";
import { createSpecialtyInputSchema, type CreateSpecialtyInput } from "./specialty.validation";
import type { SpecialtyDTO, SpecialtyOptionDTO } from "./specialty.types";

export async function createSpecialty(input: CreateSpecialtyInput): Promise<Specialty> {
  const validated = createSpecialtyInputSchema.parse(input);
  return createSpecialtyRecord(validated);
}

export async function listSpecialties(): Promise<SpecialtyDTO[]> {
  const rows = await findAllSpecialties();
  return rows.map(toSpecialtyDTO);
}

/** For admin selects that need to relate a record to a Specialty by id. */
export async function listSpecialtyOptions(): Promise<SpecialtyOptionDTO[]> {
  const rows = await findAllSpecialties();
  return rows.map(toSpecialtyOptionDTO);
}

export async function getSpecialtyBySlug(rawSlug: string): Promise<SpecialtyDTO | null> {
  const parsed = slugSchema.safeParse(rawSlug);
  if (!parsed.success) return null;

  const row = await findSpecialtyBySlug(parsed.data);
  return row ? toSpecialtyDTO(row) : null;
}

export async function listAllSpecialtySlugs(): Promise<string[]> {
  return findAllSpecialtySlugs();
}
