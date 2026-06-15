import { test, expect } from "@playwright/test";
import { mockApi, conversations } from "./fixtures";
import { shot } from "./helpers";

test.describe("Lista de conversas", () => {
    test("carrega a lista com contato, horário e badge de não-lidas", async ({
        page,
    }) => {
        await mockApi(page);
        await page.goto("/");

        await expect(
            page.getByRole("heading", { name: "Conversas" }),
        ).toBeVisible();
        for (const c of conversations) {
            await expect(page.getByText(c.contactName)).toBeVisible();
        }
        const marianaLink = page
            .getByRole("link")
            .filter({ hasText: "Mariana Lopes" });
        await expect(
            marianaLink.getByText("mensagens não lidas"),
        ).toBeAttached();
        const julianaLink = page
            .getByRole("link")
            .filter({ hasText: "Juliana Prado" });
        await expect(julianaLink.getByText("mensagens não lidas")).toHaveCount(
            0,
        );

        await shot(page, "01-lista-conversas");
    });

    test("filtra por busca e mostra estado vazio sem resultado", async ({
        page,
    }) => {
        await mockApi(page);
        await page.goto("/");

        const search = page.getByLabel("Buscar contato");
        await search.fill("juliana");
        await expect(page.getByText("Juliana Prado")).toBeVisible();
        await expect(page.getByText("Mariana Lopes")).toHaveCount(0);
        await shot(page, "02-busca-filtro");

        await search.fill("zzz-nao-existe");
        await expect(
            page.getByText("Nenhum contato encontrado."),
        ).toBeVisible();
        await shot(page, "03-busca-vazia");
    });

    test("exibe skeleton de carregamento", async ({ page }) => {
        await mockApi(page, { delayMs: 1500 });
        await page.goto("/");
        await expect(
            page.getByRole("status", { name: "Carregando conversas" }),
        ).toBeVisible();
        await shot(page, "04-lista-loading");
        await expect(page.getByText("Mariana Lopes")).toBeVisible();
    });

    test("trata erro ao carregar conversas", async ({ page }) => {
        await mockApi(page, { conversationsError: true });
        await page.goto("/");
        await expect(
            page.getByText("Erro ao carregar conversas."),
        ).toBeVisible();
        await shot(page, "05-lista-erro");
    });
});
