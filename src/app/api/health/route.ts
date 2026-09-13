import { NextResponse } from "next/server";
import { redis } from "@/lib/cache/redis";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    database: false,
    cache: false,
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    console.error("Health check: database unreachable", error);
  }

  try {
    await redis.ping();
    checks.cache = true;
  } catch (error) {
    console.error("Health check: cache unreachable", error);
  }

  const healthy = checks.database && checks.cache;

  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checks },
    { status: healthy ? 200 : 503 },
  );
}
