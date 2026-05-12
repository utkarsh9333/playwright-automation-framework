# Playwright Automation Framework

[![Playwright Tests](https://github.com/utkarsh9333/playwright-automation-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/utkarsh9333/playwright-automation-framework/actions/workflows/playwright.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.47-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

End-to-end UI test automation framework built with **Playwright** and **JavaScript**, demonstrating production-grade patterns: Page Object Model, data-driven testing, cross-browser execution, and CI/CD integration via GitHub Actions.

The framework runs against [SauceDemo](https://www.saucedemo.com) — a public e-commerce demo site — exercising real user workflows: authentication, browsing, cart management, and checkout.

---

## ✨ Features

- ✅ **Playwright Test runner** — built-in parallelism, fixtures, and rich reporting
- ✅ **Page Object Model** — clean separation of locators, actions, and assertions
- ✅ **Cross-browser** — Chromium, Firefox, and WebKit configured out of the box
- ✅ **Data-driven tests** — parameterised negative-path login scenarios
- ✅ **Tagged test suites** — `@smoke`, `@regression`, `@e2e` for selective runs
- ✅ **Auto-waiting locators** — no `Thread.sleep`, no flake-prone manual waits
- ✅ **CI integration** — GitHub Actions workflow runs on every push/PR
- ✅ **Rich reporting** — HTML report, JSON output, screenshots, traces, and video on failure
- ✅ **Retries on CI** — flaky failures retry automatically to surface real bugs

---

## 🧰 Tech Stack

| Layer            | Tool                              |
|------------------|-----------------------------------|
| Language         | JavaScript (Node.js 20+)          |
| Test framework   | @playwright/test                  |
| Browsers         | Chromium · Firefox · WebKit       |
| CI               | GitHub Actions                    |
| Reporting        | Playwright HTML + JSON reporters  |
| Target app       | https://www.saucedemo.com         |

---

## 📁 Project Structure

```
playwright-automation-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI workflow
├── pages/                          # Page Object Model
│   ├── base.page.js
│   ├── login.page.js
│   ├── inventory.page.js
│   ├── cart.page.js
│   └── checkout.page.js
├── tests/                          # Spec files
│   ├── login.spec.js
│   ├── cart.spec.js
│   └── checkout.spec.js
├── utils/
│   └── test-data.js                # Centralised test data
├── playwright.config.js            # Playwright configuration
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 20 or newer
- npm 10+

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/utkarsh9333/playwright-automation-framework.git
cd playwright-automation-framework

# 2. Install dependencies
npm install

# 3. Install browser binaries (Chromium, Firefox, WebKit)
npx playwright install --with-deps
```

---

## ▶️ Running Tests

```bash
# Run all tests in all browsers (headless)
npm test

# Run with browser UI visible
npm run test:headed

# Run in a single browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run by tag
npm run test:smoke
npm run test:regression

# Debug mode (step through tests in the inspector)
npm run test:debug

# Generate test code interactively
npm run codegen
```

### Viewing the report

After a run, open the HTML report:

```bash
npm run report
```

The report includes per-test status, execution time, retries, screenshots, video, and the Playwright trace viewer for failed steps.

---

## 🧪 Test Scenarios Covered

### Authentication
- Successful login with a standard user
- Locked-out user receives the expected error
- Empty username / empty password / wrong credentials (data-driven)

### Cart Management
- Add a single product to cart
- Add multiple products and verify badge count
- Remove a product and verify count decreases
- Cart page lists exactly the items added

### Checkout
- Complete end-to-end purchase: login → add to cart → checkout → confirmation
- Continuing checkout without customer info shows validation errors

---

## 🏗️ Design Decisions

**Why Page Object Model?**
Tests describe *what* the user does; page objects describe *how* the UI is interacted with. When a locator changes, exactly one file changes — never a test.

**Why Playwright over Selenium?**
Auto-waiting locators eliminate the largest source of flake in Selenium suites (timing-sensitive `WebDriverWait` setups). Playwright's `getByRole`, `getByLabel`, and similar locators also pin tests to accessible semantics rather than brittle CSS or XPath.

**Why tag tests with `@smoke` / `@regression`?**
PR pipelines should be fast — running only `@smoke` keeps CI under a minute. Nightly regression runs use the full suite. The tagging mechanism is just a `grep` over the test title, so it's trivial to layer on.

**Why three browser projects?**
Real users open the same product in Chrome, Firefox, and Safari. Running the same suite across three engines catches engine-specific bugs (CSS rendering, event handling, storage APIs) before customers do.

---

## 🔄 CI/CD

Every push to `main` and every pull request triggers the [Playwright Tests](.github/workflows/playwright.yml) workflow, which:

1. Installs dependencies (`npm ci`)
2. Installs Playwright browsers with system deps
3. Runs the full test suite across all three browsers in parallel
4. Uploads the HTML report and trace files as workflow artifacts (retained 14 days)

The build status badge at the top of this README updates automatically.

---

## 📈 Future Improvements

- [done ] Add API-level setup (seed cart state via API instead of UI)
- [ ] Visual regression testing using Playwright's snapshot assertions
- [ ] Allure reporting integration
- [ ] Docker container for fully reproducible local runs
- [ ] Environment-specific configs (staging vs prod baseURL)

---

## ⚡ Performance — Auth State Reuse

Logging in via the UI for every test is slow and unrepresentative of real
user sessions. To address this, the framework uses Playwright's `globalSetup`
to log in once per user role at the start of the run, save the resulting
browser state (cookies + localStorage) to disk, and reuse that state across
tests via custom fixtures.

### Measured impact

Cart test suite, Chromium only, 4 tests running in parallel:

| Approach                                  | Time    |
|-------------------------------------------|---------|
| UI login per test (original)              | 11.2 s  |
| Auth state via `globalSetup` + fixtures   |  6.6 s  |
| **Reduction**                             | **~41%** |

The per-test gain is modest because tests run in parallel and login overhead
overlaps across workers. The pattern's real value is **scaling** — adding
10 more cart tests would add ~30s to the original approach and near-zero
to the auth-state approach. The bigger the suite, the bigger the win.

### How it works

1. `global-setup.js` — runs once before any test. Logs in as each user role
   (standard, problem) and writes `.auth/<role>.json` containing the
   resulting storage state.
2. `fixtures/auth-fixtures.js` — exposes `standardUserPage` and
   `problemUserPage` fixtures. Each fixture creates a new browser context
   pre-loaded with the saved auth state.
3. Tests opt in by destructuring the fixture they need:
```js
   test('cart works', async ({ inventoryPage }) => {
     // page is already logged in as standard_user, on /inventory
   });
```

The `.auth/` directory is gitignored — those files contain real session
cookies and must never be committed.


## 👤 Author

**Utkarsh Gupta** — QA Engineer
[LinkedIn](https://www.linkedin.com/in/utkarsh-gupta-9bb2a2190/) · [GitHub](https://github.com/utkarsh9333)

---

## 📄 License

[MIT](LICENSE) — free to use, fork, and adapt.
