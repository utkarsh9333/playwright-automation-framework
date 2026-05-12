// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration.
 * Docs: https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',

  //add global-setup for auth
  globalSetup :require.resolve('./global-setup'),

  // Run tests in parallel across files
  fullyParallel: true,

  // Fail the build on CI if test.only is left in source
  forbidOnly: !!process.env.CI,

  // Retry only on CI to avoid masking real failures locally
  retries: process.env.CI ? 2 : 0,

  // Workers: fewer on CI for stability, more locally for speed
  workers: process.env.CI ? 2 : undefined,

  // Reporters: HTML for browsing, list for terminal, JSON for CI artifacts
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // Shared settings applied to every project
  use: {
    baseURL: 'https://www.saucedemo.com',

    // Collect a trace when retrying a failed test — invaluable for debugging
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Sane default timeouts
    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    //slows each tests locally to be seen
     launchOptions: {
          slowMo: process.env.CI ? 0 : 800,
        }
  },

  // Per-test timeout
  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  // Run the same tests across three browser engines
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
