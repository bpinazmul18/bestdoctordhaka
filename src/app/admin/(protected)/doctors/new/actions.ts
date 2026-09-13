"use server";

import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/dal";
import { createDoctor } from "@/modules/doctor/doctor.service";
import { createDoctorInputSchema } from "@/modules/doctor/doctor.validation";
import { zodFlattenErrors, type ActionState } from "@/lib/forms/action-state";

function toOptionalNumber(value: FormDataEntryValue | null): number | undefined {
  if (!value || typeof value !== "string" || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toOptionalString(value: FormDataEntryValue | null): string | undefined {
  if (!value || typeof value !== "string" || value.trim() === "") return undefined;
  return value;
}

export async function createDoctorAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireSuperAdmin();

  const primarySpecialtyId = formData.get("primarySpecialtyId");
  const additionalSpecialtyIds = formData.getAll("additionalSpecialtyIds").map(String).filter(Boolean);
  const hospitalIds = formData.getAll("hospitalIds").map(String).filter(Boolean);

  const specialtyIds =
    typeof primarySpecialtyId === "string" && primarySpecialtyId
      ? Array.from(new Set([primarySpecialtyId, ...additionalSpecialtyIds]))
      : additionalSpecialtyIds;

  const parsed = createDoctorInputSchema.safeParse({
    slug: formData.get("slug"),
    fullName: formData.get("fullName"),
    degrees: toOptionalString(formData.get("degrees")),
    designation: toOptionalString(formData.get("designation")),
    shortBio: toOptionalString(formData.get("shortBio")),
    profileImageUrl: toOptionalString(formData.get("profileImageUrl")),
    yearsOfExperience: toOptionalNumber(formData.get("yearsOfExperience")),
    status: formData.get("status"),
    primarySpecialtyId,
    specialtyIds,
    hospitalIds: hospitalIds.length > 0 ? hospitalIds : undefined,
  });

  if (!parsed.success) {
    return { errors: zodFlattenErrors(parsed.error) };
  }

  try {
    await createDoctor(parsed.data);
  } catch {
    return { message: "Could not create doctor. The slug may already be in use, or a related record no longer exists." };
  }

  redirect("/admin/doctors");
}
