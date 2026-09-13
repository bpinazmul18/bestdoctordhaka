import { cache } from "react";
import { redirect } from "next/navigation";
import { decryptSession, readSessionCookie } from "./session";
import type { SessionPayload } from "./session";

export const getCurrentAdmin = cache(async (): Promise<SessionPayload | null> => {
  const token = await readSessionCookie();
  return decryptSession(token);
});

export async function requireSuperAdmin(): Promise<SessionPayload> {
  const admin = await getCurrentAdmin();

  if (!admin || admin.role !== "SUPER_ADMIN") {
    redirect("/admin/login");
  }

  return admin;
}
