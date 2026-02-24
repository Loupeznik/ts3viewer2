import type { Locator, Page } from "@playwright/test";

export class AudioBotPage {
  readonly page: Page;
  readonly controls: Locator;
  readonly songList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.controls = page.getByTestId("audiobot-controls");
    this.songList = page.getByTestId("song-list");
  }

  async goto() {
    await this.page.goto("/bot");
  }
}
