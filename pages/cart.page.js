// @ts-check
const { BasePage } = require('./base.page');
const { CheckoutPage } = require('./checkout.page');

class CartPage extends BasePage {
  constructor(page) {
    super(page);

    this.cartItems    = page.locator('.cart_item');
    this.itemNames    = page.locator('.inventory_item_name');
    this.checkoutBtn  = page.getByRole('button', { name: 'Checkout' });
    this.continueBtn  = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async getItemNames() {
    return this.itemNames.allTextContents();
  }

  async removeItem(productName) {
    const item = this.page.locator('.cart_item', { hasText: productName });
    await item.getByRole('button', { name: 'Remove' }).click();
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
    return new CheckoutPage(this.page);
  }
}

module.exports = { CartPage };
