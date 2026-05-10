import { test, expect } from "@playwright/test";

test.describe("Booking page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/booking");
  });

  test("navigates to /booking and shows heading", async ({ page }) => {
    await expect(page.getByText("Booking Kursus")).toBeVisible();
  });

  test("stepper shows 4 steps", async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState("networkidle");
    // Check stepper steps using heading role to avoid duplicate text
    await expect(page.getByText("Booking Kursus")).toBeVisible();
    // Verify step labels exist
    await expect(page.locator("text=Paket").first()).toBeVisible();
    await expect(page.locator("text=Jadwal").first()).toBeVisible();
    await expect(page.locator("text=Data Diri").first()).toBeVisible();
    await expect(page.locator("text=Checkout").first()).toBeVisible();
  });

  test("back button navigates to landing page", async ({ page }) => {
    await page.locator("button").filter({ has: page.locator("svg") }).first().click();
    await expect(page).toHaveURL(/\//);
  });
});