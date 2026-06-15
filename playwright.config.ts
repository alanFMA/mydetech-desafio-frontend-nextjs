import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E — roda os fluxos contra o app local (`npm run dev`) com a API
 * interceptada (ver `e2e/fixtures.ts`). As capturas de tela vão para
 * `e2e/screenshots/` (gitignored — uso local para inspeção visual).
 */
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
    // Roda contra o BUILD DE PRODUÇÃO (não o dev server): sem compilação
    // on-demand (mais determinístico sob paralelismo) e exercita o CSP estrito
    // real de produção. O build é reaproveitado entre execuções locais.
    webServer: {
        command: "npm run build && npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
            // A baseURL do axios; as requisições são interceptadas pelos testes,
            // então o valor só precisa ser uma URL absoluta válida.
            NEXT_PUBLIC_API_URL:
                "https://8tymn68hp9.execute-api.us-east-1.amazonaws.com",
        },
    },
});
