import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads and shows brand name", async ({ page }) => {
    await expect(page.getByText("Kursus Mobil Bantul")).toBeVisible();
  });

  test("theme toggle is present and clickable", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /switch to .+ mode/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
  });

  test("navigation links are present and work", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Paket Harga" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cek Jadwal" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tentang Kami" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Kontak" })).toBeVisible();

    await page.getByRole("link", { name: "Paket Harga" }).click();
    await expect(page).toHaveURL(/\//);
  });

  test('"Lihat Paket Harga" button is visible', async ({ page }) => {
    await expect(page.getByRole("link", { name: "Lihat Paket Harga" })).toBeVisible();
  });
});