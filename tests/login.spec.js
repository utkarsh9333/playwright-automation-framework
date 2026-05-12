// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');
const { users, invalidCredentials } = require('../utils/test-data');

test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('valid user can log in and lands on inventory page @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventory = await loginPage.loginAs(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventory.pageTitle).toHaveText('Products');
  });

  test('locked out user sees an error and cannot proceed @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.attemptLogin(users.lockedOut.username, users.lockedOut.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  // Data-driven negative tests — one test per row of invalidCredentials
  for (const creds of invalidCredentials) {
    test(`invalid login: "${creds.username || 'empty'}" / "${creds.password || 'empty'}" @regression`,
      async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.attemptLogin(creds.username, creds.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(creds.error);
      });
  }
});
