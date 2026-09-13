import type { DiagnosticTest } from "@/generated/prisma/client";
import type { DiagnosticTestDTO } from "./diagnostic-test.types";

export function toDiagnosticTestDTO(diagnosticTest: DiagnosticTest): DiagnosticTestDTO {
  return {
    slug: diagnosticTest.slug,
    name: diagnosticTest.name,
    description: diagnosticTest.description,
  };
}
