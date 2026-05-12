// @ts-check
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { users } = require('./utils/test-data');

/**
 * Global setup runs ONCE before the entire test suite.
 *
 * Strategy: log in as each user role, save the resulting browser state
 * (cookies + localStorage) to disk. Tests then load these state files
 * instead of logging in via the UI.
 *
 * Result: a 50-test suite that used to spend ~50 * 3s = 150s on login
 * now spends ~3s total. The remaining tests start "already logged in."
 */
async function globalSetup() {
  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir);
  }

  const browser = await chromium.launch();

  // Generate one storage state per user role we care about
  const rolesToCapture = [
    { name: 'standard', creds: users.standard },
    { name: 'problem',  creds: users.problem  },
    // Note: we deliberately do NOT capture lockedOut — that user
    // can't log in, so there's no state to capture. Negative tests
    // still use UI login for that case.
  ];

  for (const role of rolesToCapture) {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill(role.creds.username);
    await page.getByPlaceholder('Password').fill(role.creds.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for the post-login URL before saving — otherwise we might
    // capture state from the still-loading login page.
    await page.waitForURL(/inventory\.html/);

    const statePath = path.join(authDir, `${role.name}.json`);
    await context.storageState({ path: statePath });
    console.log(`✓ Captured auth state for: ${role.name} -> ${statePath}`);

    await context.close();
  }

  await browser.close();
}

module.exports = globalSetup;