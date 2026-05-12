// @ts-check
const base = require('@playwright/test');
const path = require('path');
const { InventoryPage } = require('../pages/inventory.page');

/**
 * Custom Playwright fixtures.
 *
 * Why fixtures instead of beforeEach?
 *   - Composable: tests opt-in by name (`standardUserPage`, `problemUserPage`)
 *   - Type-safe: each fixture provides exactly what the test needs
 *   - Lazy: a fixture is only set up if a test actually requests it
 *
 * Usage:
 *   test('cart works', async ({ standardUserPage }) => {
 *     // page is already logged in as standard_user, on /inventory
 *   });
 */
exports.test = base.test.extend({
  // A page pre-authenticated as standard_user
  standardUserPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '..', '.auth', 'standard.json'),
    });
    const page = await context.newPage();
    await page.goto('/inventory.html');
    await use(page);
    await context.close();
  },

  // A page pre-authenticated as problem_user (the user whose product
  // images are broken — useful for visual regression tests)
  problemUserPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '..', '.auth', 'problem.json'),
    });
    const page = await context.newPage();
    await page.goto('/inventory.html');
    await use(page);
    await context.close();
  },

  // A page object pre-built on top of an authenticated page —
  // saves boilerplate in tests that mostly use one page object
  inventoryPage: async ({ standardUserPage }, use) => {
    const inventory = new InventoryPage(standardUserPage);
    await use(inventory);
  },
});

exports.expect = base.expect;