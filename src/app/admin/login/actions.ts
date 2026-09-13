"use server";

import { redirect } from "next/navigation";
import { login } from "@/modules/admin-user/admin-user.service";
import { loginInputSchema } from "@/modules/admin-user/admin-user.validation";
import { zodFlattenErrors, type ActionState } from "@/lib/forms/action-state";

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: zodFlattenErrors(parsed.error) };
  }

  const result = await login(parsed.data);

  if (!result.success) {
    return { message: "Invalid email or password." };
  }

  redirect("/admin");
}
