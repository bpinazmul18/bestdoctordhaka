"use server";

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/dal";
import { createDiagnosticCenter } from "@/modules/diagnostic-center/diagnostic-center.service";
import { createDiagnosticCenterInputSchema } from "@/modules/diagnostic-center/diagnostic-center.validation";
import { zodFlattenErrors, type ActionState } from "@/lib/forms/action-state";

export async function createDiagnosticCenterAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSuperAdmin();

  const testIds = formData.getAll("testIds").map(String).filter(Boolean);

  const parsed = createDiagnosticCenterInputSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    locationId: formData.get("locationId"),
    testIds: testIds.length > 0 ? testIds : undefined,
  });

  if (!parsed.success) {
    return { errors: zodFlattenErrors(parsed.error) };
  }

  try {
    await createDiagnosticCenter(parsed.data);
  } catch {
    return {
      message: "Could not create diagnostic center. The slug may already be in use, or a related record no longer exists.",
    };
  }

  redirect("/admin/diagnostic-centers");
}
