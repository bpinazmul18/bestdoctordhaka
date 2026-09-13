export interface LocationDTO {
  slug: string;
  name: string;
  city: string;
}

/** Internal option shape for admin selects — carries the id needed to form relations. */
export interface LocationOptionDTO {
  id: string;
  name: string;
  city: string;
}
