import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test.describe("Authentication", () => {
  test.describe("Login form", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/admin");
    });

    test("shows login and password fields", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await expect(loginPage.loginInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    });

    test("shows validation errors when submitted empty", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.submitButton.click();
      const errors = await loginPage.getValidationErrors();
      expect(errors).toContain("Username is required");
      expect(errors).toContain("Password is required");
    });
  });

  test("admin page shows login form when not authenticated", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page.getByText("Sign in")).toBeVisible();
    await expect(page.locator('[data-testid="admin-layout"]')).not.toBeVisible();
  });
});
