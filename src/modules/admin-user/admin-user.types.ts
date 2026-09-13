import type { AdminRole } from "@/generated/prisma/client";

export interface AuthenticatedAdminDTO {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export type LoginResult =
  | { success: true; admin: AuthenticatedAdminDTO }
  | { success: false; error: "INVALID_CREDENTIALS" };
