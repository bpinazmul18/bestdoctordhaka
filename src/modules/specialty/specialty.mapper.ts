import type { Specialty } from "@/generated/prisma/client";
import type { SpecialtyDTO } from "./specialty.types";

export function toSpecialtyDTO(specialty: Specialty): SpecialtyDTO {
  return {
    slug: specialty.slug,
    name: specialty.name,
    description: specialty.description,
  };
}
