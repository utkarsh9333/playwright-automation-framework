// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');
const { users, products } = require('../utils/test-data');

test.describe('Shopping cart', () => {

  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    inventoryPage = await loginPage.loginAs(users.standard.username, users.standard.password);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('add a single product to cart @smoke', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
  });

  test('add multiple products to cart @regression', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.addProductToCart(products.tshirt);
    expect(await inventoryPage.getCartItemCount()).toBe(3);
  });

  test('remove a product reduces the cart count @regression', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    expect(await inventoryPage.getCartItemCount()).toBe(2);

    await inventoryPage.removeProductFromCart(products.backpack);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
  });

  test('cart page lists exactly the items added @regression', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);

    const cart = await inventoryPage.openCart();
    expect(await cart.getItemCount()).toBe(2);
    const names = await cart.getItemNames();
    expect(names).toEqual(expect.arrayContaining([products.backpack, products.bikeLight]));
  });
});
