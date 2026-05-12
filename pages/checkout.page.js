// @ts-check
const { BasePage } = require('./base.page');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);

    // Step 1 — information
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput  = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueBtn    = page.locator('[data-test="continue"]');

    // Step 2 — overview
    this.finishBtn      = page.getByRole('button', { name: 'Finish' });
    this.subtotalLabel  = page.locator('.summary_subtotal_label');

    // Step 3 — confirmation
    this.completeHeader = page.locator('.complete-header');
  }

  async fillCustomerInfo({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueBtn.click();
  }

  async finishOrder() {
    await this.finishBtn.click();
  }

  async getConfirmationMessage() {
    return this.completeHeader.textContent();
  }

  async isOrderComplete() {
    return this.completeHeader.isVisible();
  }
}

module.exports = { CheckoutPage };
