import { expect, test } from "@playwright/test";
import { AudioBotPage } from "../pages/audiobot.page";

test.describe("AudioBot page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/\/api\/v1\/users\/auth\/token/, (route) =>
      route.fulfill({ json: { token: "fake-token", expiresIn: 1 } }),
    );
    await page.route(/\/api\/v1\/audiobot\/song/, (route) =>
      route.fulfill({
        json: { title: "Test Song", link: "https://youtube.com/watch?v=test" },
      }),
    );
    await page.route(/\/api\/v1\/audiobot\/volume/, (route) =>
      route.fulfill({ json: { volume: 50 } }),
    );
    await page.route(/\/api\/v1\/files/, (route) =>
      route.fulfill({ json: [] }),
    );
  });

  test("loads without crashing", async ({ page }) => {
    const audioBotPage = new AudioBotPage(page);
    await audioBotPage.goto();
    await expect(page).toHaveURL(/\/bot/);
  });

  test("shows audiobot controls with mocked API", async ({ page }) => {
    const audioBotPage = new AudioBotPage(page);
    await audioBotPage.goto();
    await expect(audioBotPage.controls).toBeVisible();
  });

  test("shows song list table with mocked API", async ({ page }) => {
    const audioBotPage = new AudioBotPage(page);
    await audioBotPage.goto();
    await expect(audioBotPage.songList).toBeVisible();
  });

  test("shows validation error for invalid YouTube URL", async ({ page }) => {
    const audioBotPage = new AudioBotPage(page);
    await audioBotPage.goto();
    await page.getByPlaceholder(/youtube\.com/i).fill("not-a-valid-url");
    await page.getByRole("button", { name: "Play" }).click();
    await expect(page.getByText("Invalid URL")).toBeVisible();
  });
});
