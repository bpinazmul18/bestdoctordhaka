import type { Location } from "@/generated/prisma/client";
import { slugSchema } from "@/lib/validation/common";
import {
  createLocationRecord,
  findAllLocations,
  findAllLocationSlugs,
  findLocationBySlug,
} from "./location.repository";
import { toLocationDTO, toLocationOptionDTO } from "./location.mapper";
import { createLocationInputSchema, type CreateLocationInput } from "./location.validation";
import type { LocationDTO, LocationOptionDTO } from "./location.types";

export async function createLocation(input: CreateLocationInput): Promise<Location> {
  const validated = createLocationInputSchema.parse(input);
  return createLocationRecord(validated);
}

export async function listLocations(): Promise<LocationDTO[]> {
  const rows = await findAllLocations();
  return rows.map(toLocationDTO);
}

/** For admin selects that need to relate a record to a Location by id. */
export async function listLocationOptions(): Promise<LocationOptionDTO[]> {
  const rows = await findAllLocations();
  return rows.map(toLocationOptionDTO);
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
