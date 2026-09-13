import { slugSchema } from "@/lib/validation/common";
import { findAllDiagnosticTests, findAllDiagnosticTestSlugs, findDiagnosticTestBySlug } from "./diagnostic-test.repository";
import { toDiagnosticTestDTO } from "./diagnostic-test.mapper";
import type { DiagnosticTestDTO } from "./diagnostic-test.types";

export async function listDiagnosticTests(): Promise<DiagnosticTestDTO[]> {
  const rows = await findAllDiagnosticTests();
  return rows.map(toDiagnosticTestDTO);
}

export async function getDiagnosticTestBySlug(rawSlug: string): Promise<DiagnosticTestDTO | null> {
  const parsed = slugSchema.safeParse(rawSlug);
  if (!parsed.success) return null;

  const row = await findDiagnosticTestBySlug(parsed.data);
  return row ? toDiagnosticTestDTO(row) : null;
}

export async function listAllDiagnosticTestSlugs(): Promise<string[]> {
  return findAllDiagnosticTestSlugs();
}
