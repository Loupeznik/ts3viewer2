import type { Page } from "@playwright/test";

export class ClientsPage {
  readonly page: Page;
  readonly clientsTable;
  readonly noClientsMessage;

  constructor(page: Page) {
    this.page = page;
    this.clientsTable = page.getByTestId("clients-table");
    this.noClientsMessage = page.getByText("No clients connected");
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/clients");
  }
}
