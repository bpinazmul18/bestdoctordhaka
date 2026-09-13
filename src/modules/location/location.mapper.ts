import type { Location } from "@/generated/prisma/client";
import type { LocationDTO } from "./location.types";

export function toLocationDTO(location: Location): LocationDTO {
  return {
    slug: location.slug,
    name: location.name,
    city: location.city,
  };
}
