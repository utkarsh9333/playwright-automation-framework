// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');
const { users, customer, products } = require('../utils/test-data');

test.describe('Checkout flow', () => {

  test('complete end-to-end purchase @smoke @e2e', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    const inventory = await loginPage.loginAs(users.standard.username, users.standard.password);
    await inventory.addProductToCart(products.backpack);
    await inventory.addProductToCart(products.bikeLight);

    const cart = await inventory.openCart();
    expect(await cart.getItemCount()).toBe(2);

    const checkout = await cart.proceedToCheckout();
    await checkout.fillCustomerInfo(customer);
    await checkout.finishOrder();

    expect(await checkout.isOrderComplete()).toBe(true);
    expect(await checkout.getConfirmationMessage()).toContain('Thank you');
  });

  test('checkout requires customer info @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    const inventory = await loginPage.loginAs(users.standard.username, users.standard.password);
    await inventory.addProductToCart(products.backpack);

    const cart = await inventory.openCart();
    const checkout = await cart.proceedToCheckout();

    // Submitting with empty info should not advance the user
    await checkout.continueBtn.click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });
});
