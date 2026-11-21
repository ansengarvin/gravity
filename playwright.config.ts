import { defineConfig, devices } from "@playwright/test";

// GitHub Actions sets CI. Locally, CI=1 runs every browser too.
const full = Boolean(process.env.CI);

const firefox = { name: "firefox", use: { ...devices["Desktop Firefox"] } };

// CI runners have no GPU, so WebGL runs on software renderers. Chromium only allows its own (SwiftShader) with this flag.
const chromium = {
    name: "chromium",
    use: { ...devices["Desktop Chrome"], launchOptions: { args: ["--enable-unsafe-swiftshader"] } },
};

const webkit = { name: "webkit", use: { ...devices["Desktop Safari"] } };

export default defineConfig({
    testDir: "tests",
    forbidOnly: full,
    reporter: "list",
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
