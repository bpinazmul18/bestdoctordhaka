"use server";

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/dal";
import { createSpecialty } from "@/modules/specialty/specialty.service";
import { createSpecialtyInputSchema } from "@/modules/specialty/specialty.validation";
import { zodFlattenErrors, type ActionState } from "@/lib/forms/action-state";

export async function createSpecialtyAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireSuperAdmin();

  const description = formData.get("description");

  const parsed = createSpecialtyInputSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: description ? description : undefined,
  });

  if (!parsed.success) {
    return { errors: zodFlattenErrors(parsed.error) };
  }

  try {
    await createSpecialty(parsed.data);
  } catch {
    return { message: "Could not create specialty. The slug may already be in use." };
  }

  redirect("/admin/specialties");
}
