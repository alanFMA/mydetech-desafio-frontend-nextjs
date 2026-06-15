import { test, expect } from "@playwright/test";
import { mockApi } from "./fixtures";
import { shot } from "./helpers";

const MSG = "Já estou verificando, um instante!";

test.describe("Envio otimista", () => {
    test("mostra a bolha otimista (⏳) e reconcilia com o servidor", async ({
        page,
    }) => {
        await mockApi(page, { sendDelayMs: 1200 });
        await page.goto("/chat/c-1001");

        const input = page.getByLabel("Mensagem para Mariana Lopes");
        await input.fill(MSG);
        await page.getByRole("button", { name: "Enviar mensagem" }).click();

        const log = page.getByRole("log");
        // A bolha aparece imediatamente, antes da resposta do POST...
        await expect(log.getByText(MSG)).toBeVisible();
        // ...com o marcador otimista de pendência.
        await expect(log.getByText("⏳")).toBeVisible();
        // O input é limpo no envio.
        await expect(input).toHaveValue("");
        await shot(page, "10-envio-otimista-pendente");

        // Após a confirmação do servidor, o ⏳ some (reconciliação).
        await expect(log.getByText("⏳")).toHaveCount(0);
        await expect(log.getByText(MSG)).toBeVisible();
        await shot(page, "11-envio-otimista-confirmado");
    });

    test("faz rollback, avisa por toast e restaura o rascunho no erro", async ({
        page,
    }) => {
        await mockApi(page, { sendError: true });
        await page.goto("/chat/c-1001");

        const input = page.getByLabel("Mensagem para Mariana Lopes");
        await input.fill(MSG);
        await page.getByRole("button", { name: "Enviar mensagem" }).click();

        // Toast de erro visível (Toaster montado no layout).
        await expect(
            page.getByText("Falha ao enviar mensagem. Tente novamente."),
        ).toBeVisible();
        // Rascunho restaurado para o atendente reenviar.
        await expect(input).toHaveValue(MSG);
        // Rollback: a bolha otimista não permanece no histórico.
        await expect(page.getByRole("log").getByText(MSG)).toHaveCount(0);
        await shot(page, "12-envio-erro-rollback");
    });
});
