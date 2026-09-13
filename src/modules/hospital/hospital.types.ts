export interface HospitalLocationRefDTO {
  slug: string;
  name: string;
  city: string;
}

export interface HospitalDTO {
  slug: string;
  name: string;
  location: HospitalLocationRefDTO;
}

export interface HospitalListFilters {
  locationSlug?: string;
}
