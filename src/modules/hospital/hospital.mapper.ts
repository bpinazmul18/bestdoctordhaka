import type { HospitalRecord } from "./hospital.repository";
import type { HospitalDTO } from "./hospital.types";

export function toHospitalDTO(hospital: HospitalRecord): HospitalDTO {
  return {
    slug: hospital.slug,
    name: hospital.name,
    location: {
      slug: hospital.location.slug,
      name: hospital.location.name,
      city: hospital.location.city,
    },
  };
}
