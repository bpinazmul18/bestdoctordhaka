import { prisma } from "@/lib/db/prisma";
import type { DiagnosticTest } from "@/generated/prisma/client";

export async function findAllDiagnosticTests(): Promise<DiagnosticTest[]> {
  return prisma.diagnosticTest.findMany({ orderBy: { name: "asc" } });
}

export async function findDiagnosticTestBySlug(slug: string): Promise<DiagnosticTest | null> {
  return prisma.diagnosticTest.findUnique({ where: { slug } });
}

export async function findAllDiagnosticTestSlugs(): Promise<string[]> {
  const rows = await prisma.diagnosticTest.findMany({ select: { slug: true } });
  return rows.map((row) => row.slug);
}
