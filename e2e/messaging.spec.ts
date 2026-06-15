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
        await expect(log.getByText(MSG)).toBeVisible();
        await expect(log.getByText("⏳")).toBeVisible();
        await expect(input).toHaveValue("");
        await shot(page, "10-envio-otimista-pendente");

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

        await expect(
            page.getByText("Falha ao enviar mensagem. Tente novamente."),
        ).toBeVisible();
        await expect(input).toHaveValue(MSG);
        await expect(page.getByRole("log").getByText(MSG)).toHaveCount(0);
        await shot(page, "12-envio-erro-rollback");
    });
});
