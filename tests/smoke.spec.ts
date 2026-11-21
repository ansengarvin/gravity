import { expect, test as base, type Page } from "@playwright/test";

// Basic checks that the app loads, renders and responds, so a dependency bump can't break it unnoticed.

// Fails any test whose page logged an error or threw, collected while the test runs.
const test = base.extend<{ errors: string[] }>({
    errors: [
        async ({ page }, use) => {
            const errors: string[] = [];
            page.on("console", (msg) => {
                if (msg.type() === "error") errors.push(msg.text());
            });
            page.on("pageerror", (err) => errors.push(err.message));
            await use(errors);
            expect(errors, "console errors and uncaught exceptions").toEqual([]);
        },
        { auto: true },
    ],
});

// The canvas alone: the UI drawn over it is hidden, so a blank canvas can't pass for a rendered one
async function canvasShot(page: Page): Promise<Buffer> {
    return page.locator("canvas").screenshot({
        style: "* { visibility: hidden !important; } canvas { visibility: visible !important; }",
    });
}

// The share of the screenshot's pixels that differ from its most common colour
async function nonBackgroundShare(page: Page, png: Buffer): Promise<number> {
    return page.evaluate(async (base64) => {
        const img = new Image();
        img.src = `data:image/png;base64,${base64}`;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const pixels = new Uint32Array(ctx.getImageData(0, 0, img.width, img.height).data.buffer);
        const counts = new Map<number, number>();
        for (const p of pixels) counts.set(p, (counts.get(p) ?? 0) + 1);
        return 1 - Math.max(...counts.values()) / pixels.length;
    }, png.toString("base64"));
}

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("shows the header, dashboard and info box", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Gravity" })).toBeVisible();
    for (const name of ["Settings", "Play", "Restart", "Leaderboard"]) {
        await expect(page.getByRole("button", { name, exact: true })).toBeVisible();
    }
    // "None", or the central star, which the app follows on load when there is one
    await expect(page.getByText(/^Following: /)).toBeVisible();
});

test("gets a WebGL2 context", async ({ page }) => {
    const ok = await page.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
        // Returns the context the app already created, or null if WebGL2 isn't available
        const gl = canvas.getContext("webgl2");
        return gl !== null && !gl.isContextLost();
    });
    expect(ok).toBe(true);
});

test("draws something on the canvas", async ({ page }) => {
    await expect.poll(async () => nonBackgroundShare(page, await canvasShot(page))).toBeGreaterThan(0);
});

test("play runs the simulation and pause stops it", async ({ page }) => {
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();

    const running = await canvasShot(page);
    await expect.poll(async () => (await canvasShot(page)).equals(running)).toBe(false);

    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();

    // Let the last in-flight frame land, then the picture should hold still
    await page.waitForTimeout(250);
    const paused = await canvasShot(page);
    await page.waitForTimeout(500);
    expect((await canvasShot(page)).equals(paused)).toBe(true);
});

test("leaderboard opens with bodies and closes", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Leaderboard", exact: true });

    await toggle.click();
    await expect(page.getByRole("button", { name: "Mass", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /^B-\d+$/ }).first()).toBeVisible();

    await toggle.click();
    await expect(page.getByRole("button", { name: "Mass", exact: true })).toBeHidden();
});

test("settings opens, switches tabs and closes", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Settings", exact: true });

    await toggle.click();
    await expect(page.getByText("Seed", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Graphics", exact: true }).click();
    await expect(page.getByText("Circles:", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Debug", exact: true }).click();
    await expect(page.getByRole("button", { name: "Show Debug", exact: true })).toBeVisible();

    await toggle.click();
    await expect(page.getByRole("button", { name: "Graphics", exact: true })).toBeHidden();
});
