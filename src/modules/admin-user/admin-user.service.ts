import { createSession, deleteSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { findAdminByEmail, touchLastLogin } from "./admin-user.repository";
import { loginInputSchema, type LoginInput } from "./admin-user.validation";
import type { LoginResult } from "./admin-user.types";

let dummyHash: string | undefined;

/**
 * Always runs the password hash comparison even when the email is unknown,
 * so response timing can't be used to enumerate valid admin emails.
 */
async function getDummyHash(): Promise<string> {
  dummyHash ??= await hashPassword("not-a-real-password");
  return dummyHash;
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const parsed = loginInputSchema.parse(input);
  const admin = await findAdminByEmail(parsed.email);

  const isValid = await verifyPassword(parsed.password, admin?.passwordHash ?? (await getDummyHash()));
  if (!admin || !isValid) {
    return { success: false, error: "INVALID_CREDENTIALS" };
  }

  await createSession({ adminUserId: admin.id, role: admin.role });
  await touchLastLogin(admin.id);

  return {
    success: true,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  };
}

export async function logout(): Promise<void> {
  await deleteSession();
}
