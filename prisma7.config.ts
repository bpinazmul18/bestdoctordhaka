import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Mirrors Next.js's own env file precedence (.env.local overrides .env)
// so `prisma migrate`/`prisma generate` see the same values the app does.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
