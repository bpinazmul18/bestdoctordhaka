import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { getRequiredEnv } from "@/lib/utils/env";

const adapter = new PrismaPg({
  connectionString: getRequiredEnv("TEST_DATABASE_URL"),
});
const prisma = new PrismaClient({ adapter });

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Prisma test database connection", () => {
  it("should connect to PostgreSQL and execute a query", async () => {
    const result = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 as result`;

    expect(result[0].result).toBe(1);
  });
});
