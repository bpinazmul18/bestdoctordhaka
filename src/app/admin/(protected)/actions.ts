"use server";

import { redirect } from "next/navigation";
import { logout } from "@/modules/admin-user/admin-user.service";

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/admin/login");
}
