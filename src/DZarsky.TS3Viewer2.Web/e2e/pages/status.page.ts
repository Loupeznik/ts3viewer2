import type { Locator, Page } from "@playwright/test";

export class StatusPage {
  readonly page: Page;
  readonly serverName: Locator;
  readonly clientList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.serverName = page.getByTestId("server-name");
    this.clientList = page.getByTestId("client-list");
  }

  async goto() {
    await this.page.goto("/status");
  }
}
