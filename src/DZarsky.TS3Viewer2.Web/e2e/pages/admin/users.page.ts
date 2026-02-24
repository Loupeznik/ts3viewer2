import type { Page } from "@playwright/test";

export class UsersPage {
  readonly page: Page;
  readonly usersTable;
  readonly addUserBtn;

  constructor(page: Page) {
    this.page = page;
    this.usersTable = page.getByTestId("users-table");
    this.addUserBtn = page.getByTestId("add-user-btn");
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/users");
  }
}
