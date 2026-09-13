export interface DiagnosticCenterLocationRefDTO {
  slug: string;
  name: string;
  city: string;
}

export interface DiagnosticTestRefDTO {
  slug: string;
  name: string;
}

export interface DiagnosticCenterListItemDTO {
  slug: string;
  name: string;
  location: DiagnosticCenterLocationRefDTO;
}

export interface DiagnosticCenterProfileDTO extends DiagnosticCenterListItemDTO {
  tests: DiagnosticTestRefDTO[];
}

export interface DiagnosticCenterListFilters {
  locationSlug?: string;
  testSlug?: string;
}
