import { expect, test } from "@playwright/test";
import { mockServerGroups, setupAdminAuth } from "../../fixtures/admin-auth";

test.describe("Channels admin page", () => {
  test("channels page loads with channel list", async ({ page }) => {
    await setupAdminAuth(page);
    await mockServerGroups(page);
    await page.route("**/api/v1/server/channels**", (route) => {
      route.fulfill({ json: [{ id: 1, name: "Default Channel" }, { id: 2, name: "Music" }] });
    });

    await page.goto("/admin/channels");

    await expect(page.getByTestId("channels-list")).toBeVisible();
    await expect(page.getByText("Default Channel")).toBeVisible();
  });
});

test.describe("Files admin page", () => {
  test("files page loads with files table", async ({ page }) => {
    await setupAdminAuth(page);
    await mockServerGroups(page);
    await page.route("**/api/v1/files**", (route) => {
      route.fulfill({ json: [{ fullName: "song.mp3", name: "song" }, { fullName: "track.mp3", name: "track" }] });
    });

    await page.goto("/admin/files");

    await expect(page.getByTestId("files-table")).toBeVisible();
    await expect(page.getByText("song.mp3")).toBeVisible();
  });
});

test.describe("Server admin page", () => {
  test("server page loads with server info card", async ({ page }) => {
    await setupAdminAuth(page);
    await mockServerGroups(page);
    await page.route("**/api/v1/server/info**", (route) => {
      route.fulfill({
        json: { name: "Test Server", status: "online", clientsOnline: 0, maxClients: 32, queriesOnline: 0, uptime: "0:00:01" },
      });
    });

    await page.goto("/admin/server");

    await expect(page.getByTestId("server-info")).toBeVisible();
    await expect(page.getByText("Test Server")).toBeVisible();
  });
});
