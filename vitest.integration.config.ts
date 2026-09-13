import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.integration.test.ts"],
    setupFiles: ["./vitest.setup.integration.ts"],
    // Integration tests share one physical Postgres test database and each
    // file's beforeEach clears whole tables, so concurrent files would stomp
    // on each other's fixtures. Run files sequentially for correctness.
    fileParallelism: false,
  },
});
