import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    outputDir: "./test-results",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: [["list"], ["html", { open: "never" }]],
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm run build && npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
            NEXT_PUBLIC_API_URL:
                "https://8tymn68hp9.execute-api.us-east-1.amazonaws.com",
        },
    },
});
