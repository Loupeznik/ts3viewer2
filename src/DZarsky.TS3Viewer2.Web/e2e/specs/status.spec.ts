import { expect, test } from "@playwright/test";
import { StatusPage } from "../pages/status.page";

const mockServerInfo = {
  name: "Test Server",
  status: "online",
  clientsOnline: 1,
  maxClients: 32,
  queriesOnline: 0,
  uptime: "0:00:01",
};

test.describe("Status page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/\/api\/v1\/users\/auth\/token/, (route) =>
      route.fulfill({ json: { token: "fake-token", expiresIn: 1 } }),
    );
    await page.route(/\/api\/v1\/server\/info/, (route) =>
      route.fulfill({ json: mockServerInfo }),
    );
    await page.route(/\/api\/v1\/server\/clients/, (route) =>
      route.fulfill({ json: [] }),
    );
    await page.route(/\/api\/v1\/server\/channels/, (route) =>
      route.fulfill({ json: [] }),
    );
  });

  test("loads without crashing", async ({ page }) => {
    const statusPage = new StatusPage(page);
    await statusPage.goto();
    await expect(page).toHaveURL(/\/status/);
  });

  test("shows skeleton or server name after navigation", async ({ page }) => {
    const statusPage = new StatusPage(page);
    await statusPage.goto();
    const loadingOrLoaded = page.locator(
      '[data-testid="server-name"], .animate-pulse',
    );
    await expect(loadingOrLoaded.first()).toBeVisible();
  });

  test("shows server name from mocked API response", async ({ page }) => {
    const statusPage = new StatusPage(page);
    await statusPage.goto();
    await expect(statusPage.serverName).toContainText("Test Server");
  });

  test("shows client list with mocked empty channels and clients", async ({
    page,
  }) => {
    const statusPage = new StatusPage(page);
    await statusPage.goto();
    await expect(statusPage.clientList).toBeVisible();
  });
});
