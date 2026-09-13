import type { DoctorListRecord, DoctorProfileRecord } from "./doctor.repository";
import type { DoctorListItemDTO, DoctorProfileDTO, SpecialtyRefDTO } from "./doctor.types";

function toSpecialtyRef(specialty: { slug: string; name: string }): SpecialtyRefDTO {
  return { slug: specialty.slug, name: specialty.name };
}

function summarizeLocations(chambers: Array<{ location: { name: string } }>): string | null {
  const names = Array.from(new Set(chambers.map((chamber) => chamber.location.name)));

  if (names.length === 0) return null;
  if (names.length === 1) return names[0];
  return `${names[0]} +${names.length - 1} more`;
}

export function toDoctorListItemDTO(doctor: DoctorListRecord): DoctorListItemDTO {
  return {
    slug: doctor.slug,
    fullName: doctor.fullName,
    degrees: doctor.degrees,
    designation: doctor.designation,
    profileImageUrl: doctor.profileImageUrl,
    primarySpecialty: toSpecialtyRef(doctor.primarySpecialty),
    locationSummary: summarizeLocations(doctor.chambers),
  };
}

export function toDoctorProfileDTO(doctor: DoctorProfileRecord): DoctorProfileDTO {
  return {
    slug: doctor.slug,
    fullName: doctor.fullName,
    degrees: doctor.degrees,
    designation: doctor.designation,
    shortBio: doctor.shortBio,
    profileImageUrl: doctor.profileImageUrl,
    yearsOfExperience: doctor.yearsOfExperience,
    conditionsTreated: doctor.conditionsTreated,
    primarySpecialty: toSpecialtyRef(doctor.primarySpecialty),
    specialties: doctor.specialties.map((entry) => toSpecialtyRef(entry.specialty)),
    hospitalNames: doctor.hospitals.map((entry) => entry.hospital.name),
    chambers: doctor.chambers.map((chamber) => ({
      name: chamber.name,
      addressLine: chamber.addressLine,
      contactPhone: chamber.contactPhone,
      whatsappNumber: chamber.whatsappNumber,
      visitingHoursNote: chamber.visitingHoursNote,
      location: {
        slug: chamber.location.slug,
        name: chamber.location.name,
        city: chamber.location.city,
      },
      hospitalName: chamber.hospital?.name ?? null,
    })),
  };
}
