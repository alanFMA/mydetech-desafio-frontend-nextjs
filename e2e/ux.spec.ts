import { test, expect } from "@playwright/test";
import { mockApi } from "./fixtures";
import { shot } from "./helpers";

test.describe("UX — tema, teclado e responsividade", () => {
    test("alterna entre tema claro e escuro", async ({ page }) => {
        await mockApi(page);
        await page.goto("/");

        const html = page.locator("html");
        await expect(html).not.toHaveClass(/dark/);

        await page
            .getByRole("button", { name: "Alternar tema claro/escuro" })
            .click();
        await expect(html).toHaveClass(/dark/);
        await shot(page, "16-dark-mode");
    });

    test("ESC fecha o chat — mas não enquanto se digita", async ({ page }) => {
        await mockApi(page);
        await page.goto("/chat/c-1001");
        await expect(page).toHaveURL(/\/chat\/c-1001$/);

        // Digitando: ESC não navega e o rascunho é preservado (D-04).
        const input = page.getByLabel("Mensagem para Mariana Lopes");
        await input.fill("texto em progresso");
        await input.press("Escape");
        await expect(page).toHaveURL(/\/chat\/c-1001$/);
        await expect(input).toHaveValue("texto em progresso");

        // Fora do input: ESC volta para a home.
        await page.getByRole("log").click();
        await page.keyboard.press("Escape");
        await expect(page).toHaveURL(/\/$/);
        await expect(
            page.getByRole("heading", { name: "Conversas" }),
        ).toBeVisible();
    });

    test("responsivo mobile: lista some no chat e o botão voltar aparece", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await mockApi(page);

        // Na home, a lista ocupa a tela.
        await page.goto("/");
        await expect(
            page.getByRole("heading", { name: "Conversas" }),
        ).toBeVisible();
        await shot(page, "17-mobile-lista");

        // No chat, a sidebar some e surge o botão de voltar.
        await page.goto("/chat/c-1001");
        await expect(
            page.getByRole("heading", { name: "Conversas" }),
        ).toBeHidden();
        const back = page.getByRole("button", {
            name: "Voltar para a lista de conversas",
        });
        await expect(back).toBeVisible();
        await shot(page, "18-mobile-chat");

        await back.click();
        await expect(page).toHaveURL(/\/$/);
        await expect(
            page.getByRole("heading", { name: "Conversas" }),
        ).toBeVisible();
    });
});
