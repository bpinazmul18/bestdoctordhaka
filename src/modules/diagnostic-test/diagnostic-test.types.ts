export interface DiagnosticTestDTO {
  slug: string;
  name: string;
  description: string | null;
}

/** Internal option shape for admin selects — carries the id needed to form relations. */
export interface DiagnosticTestOptionDTO {
  id: string;
  name: string;
}
