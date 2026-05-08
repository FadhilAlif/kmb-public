import { test, expect } from "@playwright/test";

test.describe("Booking page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/booking");
  });

  test("navigates to /booking and shows heading", async ({ page }) => {
    await expect(page.getByText("Booking Kursus")).toBeVisible();
  });

  test("stepper shows 4 steps", async ({ page }) => {
    await expect(page.getByText("Paket")).toBeVisible();
    await expect(page.getByText("Jadwal")).toBeVisible();
    await expect(page.getByText("Data Diri")).toBeVisible();
    await expect(page.getByText("Checkout")).toBeVisible();
  });

  test("back button navigates to landing page", async ({ page }) => {
    await page.locator("button").filter({ has: page.locator("svg") }).first().click();
    await expect(page).toHaveURL(/\//);
  });
});