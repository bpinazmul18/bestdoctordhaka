import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import type { AdminRole } from "@/generated/prisma/client";
import { getRequiredEnv } from "@/lib/utils/env";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export interface SessionPayload {
  adminUserId: string;
  role: AdminRole;
}

function getEncodedSecret() {
  return new TextEncoder().encode(getRequiredEnv("SESSION_SECRET"));
}

async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_MS / 1000}s`)
    .sign(getEncodedSecret());
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getEncodedSecret(), { algorithms: ["HS256"] });
    if (typeof payload.adminUserId !== "string" || typeof payload.role !== "string") return null;

    return { adminUserId: payload.adminUserId, role: payload.role as AdminRole };
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function readSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export { SESSION_COOKIE_NAME };
