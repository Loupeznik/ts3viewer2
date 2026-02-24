import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly loginInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginInput = page.getByLabel("Username");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: "Login" });
  }

  async login(username: string, password: string): Promise<void> {
    await this.loginInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getValidationErrors(): Promise<string[]> {
    const errorElements = this.page.locator('[data-slot="form-message"]');
    await errorElements.first().waitFor({ state: "visible" });
    return errorElements.allTextContents();
  }
}
