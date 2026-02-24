import type { Page } from "@playwright/test";

export async function setupAdminAuth(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const payload = btoa('{"sub":"testadmin","permissions":["ServerAdmin"],"role":"Admin"}');
    localStorage.setItem("api_app_token", `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${payload}.fake-sig`);
  });
}

export async function mockServerGroups(page: Page): Promise<void> {
  await page.route("**/api/v1/server/groups**", (route) => {
    route.fulfill({ json: [{ id: 1, name: "Admin" }, { id: 2, name: "Guest" }] });
  });
}
