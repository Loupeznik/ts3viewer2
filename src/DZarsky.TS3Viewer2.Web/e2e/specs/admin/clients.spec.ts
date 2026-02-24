import { expect, test } from "@playwright/test";
import { mockServerGroups, setupAdminAuth } from "../../fixtures/admin-auth";
import { ClientsPage } from "../../pages/admin/clients.page";

test.describe("Clients admin page", () => {
  test("shows no clients message when empty", async ({ page }) => {
    await setupAdminAuth(page);
    await mockServerGroups(page);
    await page.route("**/api/v1/server/clients**", (route) => {
      route.fulfill({ json: [] });
    });

    const clientsPage = new ClientsPage(page);
    await clientsPage.goto();

    await expect(clientsPage.noClientsMessage).toBeVisible();
  });

  test("clients table shows when clients are connected", async ({ page }) => {
    await setupAdminAuth(page);
    await mockServerGroups(page);
    await page.route("**/api/v1/server/clients**", (route) => {
      route.fulfill({
        json: [
          {
            id: 1,
            channelId: 1,
            databaseId: 10,
            nickName: "TestUser",
            type: "FullClient",
            detail: {
              away: false,
              outputMuted: false,
              inputMuted: false,
              serverGroupIds: [1],
            },
          },
        ],
      });
    });

    const clientsPage = new ClientsPage(page);
    await clientsPage.goto();

    await expect(clientsPage.clientsTable).toBeVisible();
    await expect(page.getByText("TestUser")).toBeVisible();
  });
});
