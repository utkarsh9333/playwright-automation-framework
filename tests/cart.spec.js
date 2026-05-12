// @ts-check
const { test, expect } = require('../fixtures/auth-fixtures');
const { products } = require('../utils/test-data');

/**
 * Cart tests rewritten to use the inventoryPage fixture.
 *
 * Compare to the original cart.spec.js: no beforeEach, no manual login,
 * no LoginPage import. Each test starts already authenticated on the
 * inventory page. Cuts ~3 seconds per test in this file alone.
 */
test.describe('Shopping cart (authenticated)', () => {

  test('add a single product to cart @smoke', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(products.backpack);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
  });

  test('add multiple products to cart @regression', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.addProductToCart(products.tshirt);
    expect(await inventoryPage.getCartItemCount()).toBe(3);
  });

  test('remove a product reduces cart count @regression', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    expect(await inventoryPage.getCartItemCount()).toBe(2);

    await inventoryPage.removeProductFromCart(products.backpack);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
  });

  test('cart page lists exactly the items added @regression', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);

    const cart = await inventoryPage.openCart();
    expect(await cart.getItemCount()).toBe(2);

    const names = await cart.getItemNames();
    expect(names).toEqual(expect.arrayContaining([products.backpack, products.bikeLight]));
  });
});