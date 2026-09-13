import { prisma } from "@/lib/db/prisma";
import type { AdminUser } from "@/generated/prisma/client";

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  return prisma.adminUser.findUnique({ where: { email } });
}

export async function touchLastLogin(id: string): Promise<void> {
  await prisma.adminUser.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });
}
