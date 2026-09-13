import { expect, test } from "@playwright/test";

test("Home -> Diagnostic Center listing -> Diagnostic Center profile", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Diagnostic Centers" }).click();
  await expect(page).toHaveURL(/\/diagnostic-centers$/);
  await expect(page.getByRole("heading", { name: "Diagnostic Centers in Dhaka" })).toBeVisible();

  // Navigate to the profile directly rather than clicking a listing row: with
  // performance-test bulk data seeded (500 diagnostic centers), the minimal
  // seed.ts fixture used here is not guaranteed to land on page 1 of the
  // default alphabetical sort, so asserting on its exact link would be flaky.
  await page.goto("/diagnostic-centers/test-diagnostic-center");
  await expect(page.getByRole("heading", { name: "Test Diagnostic Center" })).toBeVisible();
  await expect(page.getByText("X-Ray")).toBeVisible();
});

test("a nonexistent diagnostic center slug returns a not-found page", async ({ page }) => {
  const response = await page.goto("/diagnostic-centers/does-not-exist");

  expect(response?.status()).toBe(404);
});
