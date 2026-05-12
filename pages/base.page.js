// @ts-check

/**
 * BasePage — parent class for all page objects.
 * Holds the Playwright `page` instance and exposes shared helpers.
 *
 * Why Page Object Model?
 *   - Tests read like specs, not selectors
 *   - One place to fix a locator when the UI changes
 *   - Re-usable workflows (login, addToCart) live with the page they belong to
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to the configured baseURL.
   * @param {string} path
   */
  async goto(path = '/') {
    await this.page.goto(path);
  }

  async title() {
    return this.page.title();
  }

  async url() {
    return this.page.url();
  }
}

module.exports = { BasePage };
