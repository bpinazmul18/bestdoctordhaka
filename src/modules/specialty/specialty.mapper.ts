import type { Specialty } from "@/generated/prisma/client";
import type { SpecialtyDTO, SpecialtyOptionDTO } from "./specialty.types";

export function toSpecialtyDTO(specialty: Specialty): SpecialtyDTO {
  return {
    slug: specialty.slug,
    name: specialty.name,
    description: specialty.description,
  };
}

export function toSpecialtyOptionDTO(specialty: Specialty): SpecialtyOptionDTO {
  return {
    id: specialty.id,
    name: specialty.name,
  };
}
