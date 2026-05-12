// @ts-check
const { BasePage } = require('./base.page');
const { InventoryPage } = require('./inventory.page');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Locators — Playwright recommends getByX role-based locators
    // where possible, falling back to data-test attributes for stability.
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton   = page.getByRole('button', { name: 'Login' });
    this.errorMessage  = page.locator('[data-test="error"]');
  }

  async open() {
    await this.goto('/');
  }

  /**
   * Logs in successfully and returns the next page object.
   * Throws if login fails — use attemptLogin() for negative tests.
   */
  async loginAs(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return new InventoryPage(this.page);
  }

  /**
   * For negative-path tests: fills the form and clicks login,
   * but does not assert success or return a new page.
   */
  async attemptLogin(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorText() {
    return this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return this.errorMessage.isVisible();
  }
}

module.exports = { LoginPage };
