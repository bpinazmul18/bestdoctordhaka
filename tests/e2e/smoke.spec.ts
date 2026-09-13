import { expect, test } from "@playwright/test";

test("homepage loads successfully", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
});

test("health endpoint reports service status", async ({ request }) => {
  const response = await request.get("/api/health");
  const body = await response.json();

  expect([200, 503]).toContain(response.status());
  expect(body).toHaveProperty("status");
  expect(body).toHaveProperty("checks");
});
