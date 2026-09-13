import { slugSchema } from "@/lib/validation/common";
import { findAllLocations, findAllLocationSlugs, findLocationBySlug } from "./location.repository";
import { toLocationDTO } from "./location.mapper";
import type { LocationDTO } from "./location.types";

export async function listLocations(): Promise<LocationDTO[]> {
  const rows = await findAllLocations();
  return rows.map(toLocationDTO);
}

export async function getLocationBySlug(rawSlug: string): Promise<LocationDTO | null> {
  const parsed = slugSchema.safeParse(rawSlug);
  if (!parsed.success) return null;

  const row = await findLocationBySlug(parsed.data);
  return row ? toLocationDTO(row) : null;
}

export async function listAllLocationSlugs(): Promise<string[]> {
  return findAllLocationSlugs();
}
