import { test, expect } from "@playwright/test";
import { mockApi } from "./fixtures";
import { shot } from "./helpers";

test.describe("Tela de chat", () => {
    test("abre conversa com header dinâmico e histórico de bolhas", async ({
        page,
    }) => {
        await mockApi(page);
        await page.goto("/");
        await page
            .getByRole("link")
            .filter({ hasText: "Mariana Lopes" })
            .click();

        await expect(page).toHaveURL(/\/chat\/c-1001$/);
        // Header dinâmico (nome em <h1> + telefone), lido do cache de conversas.
        await expect(
            page.getByRole("heading", { name: "Mariana Lopes", level: 1 }),
        ).toBeVisible();
        await expect(page.getByText("5511988887766")).toBeVisible();

        // Região de mensagens acessível (role=log) com as bolhas in/out.
        const log = page.getByRole("log");
        await expect(log).toBeVisible();
        await expect(log.getByText("Bom dia", { exact: true })).toBeVisible();
        await expect(
            log.getByText(
                "Pode reiniciar o roteador por 30 segundos, por favor?",
            ),
        ).toBeVisible();

        await shot(page, "06-chat-historico");
    });

    test("mostra empty state em conversa sem mensagens", async ({ page }) => {
        await mockApi(page);
        await page.goto("/chat/c-1003");
        await expect(
            page.getByText("Nenhuma mensagem ainda. Diga olá 👋"),
        ).toBeVisible();
        await shot(page, "07-chat-vazio");
    });

    test("deep-link para conversa inexistente cai no 404", async ({ page }) => {
        await mockApi(page);
        await page.goto("/chat/nao-existe");
        await expect(page.getByText("Conversa não encontrada")).toBeVisible();
        await expect(
            page.getByRole("link", { name: "Voltar para o início" }),
        ).toBeVisible();
        await shot(page, "08-chat-404");
    });

    test("trata erro ao carregar o histórico", async ({ page }) => {
        await mockApi(page, { messagesError: true });
        await page.goto("/chat/c-1001");
        await expect(
            page.getByText("Erro ao carregar o histórico de mensagens."),
        ).toBeVisible();
        await shot(page, "09-chat-erro-historico");
    });
});
