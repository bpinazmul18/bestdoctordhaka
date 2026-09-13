import type { DiagnosticCenterListRecord, DiagnosticCenterProfileRecord } from "./diagnostic-center.repository";
import type { DiagnosticCenterListItemDTO, DiagnosticCenterProfileDTO } from "./diagnostic-center.types";

function toLocationRef(location: { slug: string; name: string; city: string }) {
  return { slug: location.slug, name: location.name, city: location.city };
}

export function toDiagnosticCenterListItemDTO(center: DiagnosticCenterListRecord): DiagnosticCenterListItemDTO {
  return {
    slug: center.slug,
    name: center.name,
    location: toLocationRef(center.location),
  };
}

export function toDiagnosticCenterProfileDTO(center: DiagnosticCenterProfileRecord): DiagnosticCenterProfileDTO {
  return {
    slug: center.slug,
    name: center.name,
    location: toLocationRef(center.location),
    tests: center.tests.map((entry) => ({
      slug: entry.diagnosticTest.slug,
      name: entry.diagnosticTest.name,
    })),
  };
}
