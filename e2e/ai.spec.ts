import { test, expect } from "@playwright/test";
import { mockApi, aiSuggestion } from "./fixtures";
import { shot } from "./helpers";

test.describe("Sugestão de IA", () => {
    test("preenche o input com a sugestão quando o rascunho está vazio", async ({
        page,
    }) => {
        await mockApi(page);
        await page.goto("/chat/c-1001");

        const input = page.getByLabel("Mensagem para Mariana Lopes");
        await page
            .getByRole("button", { name: "Sugerir resposta com IA" })
            .click();

        await expect(input).toHaveValue(aiSuggestion.suggestion);
        await expect(page.getByText("Sugestão aplicada!")).toBeVisible();
        await shot(page, "13-ia-sugestao");
    });

    test("oferece Desfazer e preserva o rascunho existente", async ({
        page,
    }) => {
        await mockApi(page);
        await page.goto("/chat/c-1001");

        const input = page.getByLabel("Mensagem para Mariana Lopes");
        await input.fill("Rascunho do atendente");
        await page
            .getByRole("button", { name: "Sugerir resposta com IA" })
            .click();

        await expect(input).toHaveValue(aiSuggestion.suggestion);
        const undo = page.getByRole("button", { name: "Desfazer" });
        await expect(undo).toBeVisible();
        await shot(page, "14-ia-desfazer");

        await undo.click();
        await expect(input).toHaveValue("Rascunho do atendente");
    });

    test("avisa por toast quando a IA falha", async ({ page }) => {
        await mockApi(page, { aiError: true });
        await page.goto("/chat/c-1001");

        await page
            .getByRole("button", { name: "Sugerir resposta com IA" })
            .click();
        // retry: 2 com backoff exponencial (~3s) antes de cair no onError.
        await expect(
            page.getByText("A IA não conseguiu gerar uma sugestão no momento."),
        ).toBeVisible({ timeout: 10_000 });
        await shot(page, "15-ia-erro");
    });
});
