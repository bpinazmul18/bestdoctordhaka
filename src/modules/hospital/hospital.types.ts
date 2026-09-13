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

/** Internal option shape for admin selects — carries the id needed to form relations. */
export interface HospitalOptionDTO {
  id: string;
  name: string;
}
