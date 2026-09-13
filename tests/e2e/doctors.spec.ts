import { expect, test } from "@playwright/test";

test("Home -> Doctor listing -> filter by specialty -> Doctor profile", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Browse Doctors" }).click();
  await expect(page).toHaveURL(/\/doctors$/);

  await expect(page.getByRole("heading", { name: "Find Doctors in Dhaka" })).toBeVisible();

  await page.getByRole("link", { name: "Cardiology" }).first().click();
  await expect(page).toHaveURL(/\/specialties\/cardiology$/);

  await page.getByRole("link", { name: "Dr. Test Rahman" }).click();
  await expect(page).toHaveURL(/\/doctors\/dr-test-rahman$/);
  await expect(page.getByRole("heading", { name: "Dr. Test Rahman" })).toBeVisible();
});

test("Home -> Specialty page -> Doctor profile", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Specialties" }).click();
  await expect(page).toHaveURL(/\/specialties$/);

  await page.getByRole("link", { name: "Dermatology" }).click();
  await expect(page).toHaveURL(/\/specialties\/dermatology$/);
  await expect(page.getByRole("heading", { name: "Dermatology Doctors in Dhaka" })).toBeVisible();

  await page.getByRole("link", { name: "Dr. Test Akter" }).click();
  await expect(page).toHaveURL(/\/doctors\/dr-test-akter$/);
  await expect(page.getByRole("heading", { name: "Dr. Test Akter" })).toBeVisible();
});

test("Home -> Location page -> Doctor profile", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Locations" }).click();
  await expect(page).toHaveURL(/\/locations$/);

  await page.getByRole("link", { name: "Gulshan, Dhaka" }).click();
  await expect(page).toHaveURL(/\/locations\/gulshan$/);
  await expect(page.getByRole("heading", { name: "Doctors in Gulshan, Dhaka" })).toBeVisible();

  await page.getByRole("link", { name: "Dr. Test Akter" }).click();
  await expect(page).toHaveURL(/\/doctors\/dr-test-akter$/);
});

test("an unpublished doctor slug returns a not-found page", async ({ page }) => {
  const response = await page.goto("/doctors/dr-test-draft");

  expect(response?.status()).toBe(404);
});

test("a nonexistent doctor slug returns a not-found page", async ({ page }) => {
  const response = await page.goto("/doctors/does-not-exist");

  expect(response?.status()).toBe(404);
});
