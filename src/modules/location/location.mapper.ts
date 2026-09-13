import type { Location } from "@/generated/prisma/client";
import type { LocationDTO, LocationOptionDTO } from "./location.types";

export function toLocationDTO(location: Location): LocationDTO {
  return {
    slug: location.slug,
    name: location.name,
    city: location.city,
  };
}

export function toLocationOptionDTO(location: Location): LocationOptionDTO {
  return {
    id: location.id,
    name: location.name,
    city: location.city,
  };
}
