import { prisma } from "@/lib/db/prisma";
import type { Specialty } from "@/generated/prisma/client";
import type { CreateSpecialtyInput } from "./specialty.validation";

export async function createSpecialtyRecord(input: CreateSpecialtyInput): Promise<Specialty> {
  return prisma.specialty.create({
    data: {
      slug: input.slug,
      name: input.name,
      description: input.description,
    },
  });
}

export async function findAllSpecialties(): Promise<Specialty[]> {
  return prisma.specialty.findMany({ orderBy: { name: "asc" } });
}

export async function findSpecialtyBySlug(slug: string): Promise<Specialty | null> {
  return prisma.specialty.findUnique({ where: { slug } });
}

export async function findAllSpecialtySlugs(): Promise<string[]> {
  const rows = await prisma.specialty.findMany({ select: { slug: true } });
  return rows.map((row) => row.slug);
}
