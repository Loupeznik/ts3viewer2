import { expect, test } from "@playwright/test";
import { mockServerGroups, setupAdminAuth } from "../../fixtures/admin-auth";
import { UsersPage } from "../../pages/admin/users.page";

const mockUsers = [
  { id: 1, login: "admin", isActive: true, type: "Admin", roles: [{ id: 1, permission: "ServerAdmin" }] },
  { id: 2, login: "editor", isActive: false, type: "User", roles: [] },
];

test.describe("Users admin page", () => {
  test.beforeEach(async ({ page }) => {
    await setupAdminAuth(page);
    await mockServerGroups(page);
    await page.route("**/api/v1/users**", (route) => {
      route.fulfill({ json: mockUsers });
    });
  });

  test("users table loads with mocked data", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto();

    await expect(usersPage.usersTable).toBeVisible();
    await expect(page.getByRole("cell", { name: "admin", exact: true })).toBeVisible();
    await expect(page.getByRole("cell", { name: "editor", exact: true })).toBeVisible();
  });

  test("add user button is visible", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto();

    await expect(usersPage.addUserBtn).toBeVisible();
  });

  test("clicking add user button opens create dialog", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto();

    await usersPage.addUserBtn.click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create user" })).toBeVisible();
  });

  test("create dialog has login, password and permissions fields", async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto();

    await usersPage.addUserBtn.click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel("Login")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByText("Permissions")).toBeVisible();
  });
});
