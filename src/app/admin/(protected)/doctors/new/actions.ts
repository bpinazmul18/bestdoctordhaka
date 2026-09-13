"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/dal";
import { createDoctor } from "@/modules/doctor/doctor.service";
import {
  createDoctorInputSchema,
  parseChamberRowsFromFormData,
  parseConditionsTreatedText,
} from "@/modules/doctor/doctor.validation";
import { zodFlattenErrors, type ActionState } from "@/lib/forms/action-state";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  deleteObject,
  extensionForImageMimeType,
  uploadPublicObject,
} from "@/lib/storage/r2";

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

  const slug = formData.get("slug");

  const profileImage = formData.get("profileImage");
  let uploadedImageKey: string | undefined;
  let profileImageUrl: string | undefined;

  if (profileImage instanceof File && profileImage.size > 0) {
    if (!ALLOWED_IMAGE_MIME_TYPES.has(profileImage.type)) {
      return { errors: { profileImage: ["Only JPEG, PNG, or WebP images are allowed."] } };
    }
    if (profileImage.size > MAX_IMAGE_SIZE_BYTES) {
      return { errors: { profileImage: ["Image must be 5MB or smaller."] } };
    }

    const extension = extensionForImageMimeType(profileImage.type);
    uploadedImageKey = `doctors/${typeof slug === "string" && slug ? slug : randomUUID()}/${randomUUID()}.${extension}`;
    const body = Buffer.from(await profileImage.arrayBuffer());
    profileImageUrl = await uploadPublicObject({ key: uploadedImageKey, body, contentType: profileImage.type });
  }

  const chamberRows = parseChamberRowsFromFormData(formData);
  if (!chamberRows.ok) {
    if (uploadedImageKey) await deleteObject(uploadedImageKey);
    return { message: chamberRows.error };
  }

  const conditionsTreated = parseConditionsTreatedText(String(formData.get("conditionsTreated") ?? ""));

  const parsed = createDoctorInputSchema.safeParse({
    slug,
    fullName: formData.get("fullName"),
    degrees: toOptionalString(formData.get("degrees")),
    designation: toOptionalString(formData.get("designation")),
    shortBio: toOptionalString(formData.get("shortBio")),
    profileImageUrl,
    yearsOfExperience: toOptionalNumber(formData.get("yearsOfExperience")),
    status: formData.get("status"),
    primarySpecialtyId,
    specialtyIds,
    hospitalIds: hospitalIds.length > 0 ? hospitalIds : undefined,
    chambers: chamberRows.chambers.length > 0 ? chamberRows.chambers : undefined,
    conditionsTreated: conditionsTreated.length > 0 ? conditionsTreated : undefined,
  });

  if (!parsed.success) {
    if (uploadedImageKey) await deleteObject(uploadedImageKey);
    return { errors: zodFlattenErrors(parsed.error) };
  }

  try {
    await createDoctor(parsed.data);
  } catch {
    if (uploadedImageKey) await deleteObject(uploadedImageKey);
    return { message: "Could not create doctor. The slug may already be in use, or a related record no longer exists." };
  }

  redirect("/admin/doctors");
}
