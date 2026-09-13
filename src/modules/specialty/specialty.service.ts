import { slugSchema } from "@/lib/validation/common";
import { findAllSpecialties, findAllSpecialtySlugs, findSpecialtyBySlug } from "./specialty.repository";
import { toSpecialtyDTO } from "./specialty.mapper";
import type { SpecialtyDTO } from "./specialty.types";

export async function listSpecialties(): Promise<SpecialtyDTO[]> {
  const rows = await findAllSpecialties();
  return rows.map(toSpecialtyDTO);
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
