import { defineConfig, devices } from "@playwright/test";

// GitHub Actions sets CI. Locally, CI=1 runs every browser too.
const full = Boolean(process.env.CI);

// CI runners have no GPU, so WebGL runs on software renderers, and each browser needs a push to use one.

// Headless Firefox on Linux has no GL driver to give WebGL, so there it runs headed, on the virtual display xvfb-run gives
const firefox = {
  name: "firefox",
  use: { ...devices["Desktop Firefox"], headless: process.platform !== "linux" },
};

// Chromium only allows its own software renderer, SwiftShader, with this flag
const chromium = {
  name: "chromium",
  use: { ...devices["Desktop Chrome"], launchOptions: { args: ["--enable-unsafe-swiftshader"] } },
};

const webkit = { name: "webkit", use: { ...devices["Desktop Safari"] } };

export default defineConfig({
  testDir: "tests",
  forbidOnly: full,
  reporter: "list",
  // Software rendering takes up to about 30s a frame on CI, so every wait on the canvas needs far longer than the defaults
  timeout: 360_000,
  expect: { timeout: 120_000 },
  use: {
    baseURL: "http://localhost:4175",
    trace: "off",
    screenshot: "off",
  },
  projects: full ? [chromium, firefox, webkit] : [firefox],
  webServer: {
    command: "npm run preview -- --port 4175 --strictPort",
    url: "http://localhost:4175",
    reuseExistingServer: !full,
  },
});
