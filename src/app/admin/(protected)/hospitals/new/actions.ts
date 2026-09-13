"use server";

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/dal";
import { createHospital } from "@/modules/hospital/hospital.service";
import { createHospitalInputSchema } from "@/modules/hospital/hospital.validation";
import { zodFlattenErrors, type ActionState } from "@/lib/forms/action-state";

export async function createHospitalAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireSuperAdmin();

  const parsed = createHospitalInputSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    locationId: formData.get("locationId"),
  });

  if (!parsed.success) {
    return { errors: zodFlattenErrors(parsed.error) };
  }

  try {
    await createHospital(parsed.data);
  } catch {
    return { message: "Could not create hospital. The slug may already be in use, or the location no longer exists." };
  }

  redirect("/admin/hospitals");
}
