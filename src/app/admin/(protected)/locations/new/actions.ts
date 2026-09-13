"use server";

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/dal";
import { createLocation } from "@/modules/location/location.service";
import { createLocationInputSchema } from "@/modules/location/location.validation";
import { zodFlattenErrors, type ActionState } from "@/lib/forms/action-state";

export async function createLocationAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireSuperAdmin();

  const parsed = createLocationInputSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    city: formData.get("city"),
  });

  if (!parsed.success) {
    return { errors: zodFlattenErrors(parsed.error) };
  }

  try {
    await createLocation(parsed.data);
  } catch {
    return { message: "Could not create location. The slug may already be in use." };
  }

  redirect("/admin/locations");
}
