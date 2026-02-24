import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("app loads and title matches TS3Viewer", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/TS3Viewer/);
  });

  test.describe("Navbar links", () => {
    test.beforeEach(async ({ page }) => {
      await page.route("**/api/**", (route) =>
        route.fulfill({ status: 200, body: JSON.stringify([]) }),
      );
      await page.goto("/");
    });

    test("navigates to home (/)", async ({ page }) => {
      await page.getByRole("link", { name: "Home" }).click();
      await expect(page).toHaveURL("/");
    });

    test("navigates to server status (/status)", async ({ page }) => {
      await page.getByRole("link", { name: "Server status" }).click();
      await expect(page).toHaveURL("/status");
    });

    test("navigates to connect (/connect)", async ({ page }) => {
      await page.getByRole("link", { name: "Connect" }).click();
      await expect(page).toHaveURL("/connect");
    });

    test("navigates to song upload (/upload)", async ({ page }) => {
      await page.getByRole("link", { name: "Song upload" }).click();
      await expect(page).toHaveURL("/upload");
    });

    test("navigates to audiobot (/bot)", async ({ page }) => {
      await page.getByRole("link", { name: "Audiobot" }).click();
      await expect(page).toHaveURL("/bot");
    });
  });

  test("unauthenticated user sees login form on /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("Sign in")).toBeVisible();
  });
});
