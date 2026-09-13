import { prisma } from "@/lib/db/prisma";
import type { Location } from "@/generated/prisma/client";

export async function findAllLocations(): Promise<Location[]> {
  return prisma.location.findMany({ orderBy: { name: "asc" } });
}

export async function findLocationBySlug(slug: string): Promise<Location | null> {
  return prisma.location.findUnique({ where: { slug } });
}

export async function findAllLocationSlugs(): Promise<string[]> {
  const rows = await prisma.location.findMany({ select: { slug: true } });
  return rows.map((row) => row.slug);
}
