export interface SpecialtyRefDTO {
  slug: string;
  name: string;
}

export interface LocationRefDTO {
  slug: string;
  name: string;
  city: string;
}

export interface ChamberDTO {
  name: string | null;
  addressLine: string;
  contactPhone: string | null;
  whatsappNumber: string | null;
  visitingHoursNote: string | null;
  location: LocationRefDTO;
  hospitalName: string | null;
}

export interface DoctorListItemDTO {
  slug: string;
  fullName: string;
  degrees: string | null;
  designation: string | null;
  profileImageUrl: string | null;
  primarySpecialty: SpecialtyRefDTO;
  locationSummary: string | null;
}

export interface DoctorProfileDTO {
  slug: string;
  fullName: string;
  degrees: string | null;
  designation: string | null;
  shortBio: string | null;
  profileImageUrl: string | null;
  yearsOfExperience: number | null;
  primarySpecialty: SpecialtyRefDTO;
  specialties: SpecialtyRefDTO[];
  hospitalNames: string[];
  chambers: ChamberDTO[];
}

export interface DoctorListFilters {
  specialtySlug?: string;
  locationSlug?: string;
  hospitalSlug?: string;
  searchTerm?: string;
}
