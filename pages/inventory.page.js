// @ts-check
const { BasePage } = require('./base.page');
const { CartPage } = require('./cart.page');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);

    this.pageTitle      = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge      = page.locator('.shopping_cart_badge');
    this.cartLink       = page.locator('.shopping_cart_link');
    this.sortDropdown   = page.locator('[data-test="product-sort-container"]');
  }

  /**
   * Add a product to the cart by its visible name.
   * Uses a dynamic locator scoped to the matching product card.
   */
  async addProductToCart(productName) {
    const productCard = this.page.locator('.inventory_item', {
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    await productCard.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductFromCart(productName) {
    const productCard = this.page.locator('.inventory_item', {
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    await productCard.getByRole('button', { name: 'Remove' }).click();
  }

  async getCartItemCount() {
    if (!(await this.cartBadge.isVisible())) return 0;
    return parseInt(await this.cartBadge.textContent(), 10);
  }

  async openCart() {
    await this.cartLink.click();
    return new CartPage(this.page);
  }

  async getAllProductNames() {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async sortBy(optionLabel) {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }
}

module.exports = { InventoryPage };
