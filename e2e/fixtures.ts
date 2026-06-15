import { Page, Route } from "@playwright/test";

export const me = {
    id: "agent-1",
    name: "Atendente Myde",
    role: "Suporte NeoFibra",
};

export const conversations = [
    {
        id: "c-1001",
        contactName: "Mariana Lopes",
        contactPhone: "5511988887766",
        avatarColor: "#25D366",
        unread: 3,
        lastMessage: "Minha internet caiu de novo agora de manhã",
        lastMessageAt: "2026-06-15T13:10:00.000Z",
    },
    {
        id: "c-1003",
        contactName: "Juliana Prado",
        contactPhone: "5511966665544",
        avatarColor: "#9C27B0",
        unread: 0,
        lastMessage: "Quer que eu já faça a mudança para o plano de 1 Gbps?",
        lastMessageAt: "2026-06-15T11:00:00.000Z",
    },
    {
        id: "c-1004",
        contactName: "Camila Nogueira",
        contactPhone: "5511955554433",
        avatarColor: "#E91E63",
        unread: 0,
        lastMessage: "Obrigada pelo atendimento!",
        lastMessageAt: "2026-06-14T18:30:00.000Z",
    },
];

export const messages: Record<string, unknown[]> = {
    "c-1001": [
        {
            id: "m-1",
            direction: "in",
            status: "read",
            body: "Bom dia",
            createdAt: "2026-06-14T11:40:00.000Z",
        },
        {
            id: "m-2",
            direction: "in",
            status: "read",
            body: "Minha internet caiu de novo agora de manhã",
            createdAt: "2026-06-14T11:42:00.000Z",
        },
        {
            id: "m-3",
            direction: "out",
            status: "read",
            body: "Bom dia, Mariana! Já vou verificar sua conexão.",
            createdAt: "2026-06-15T09:02:00.000Z",
        },
        {
            id: "m-4",
            direction: "out",
            status: "delivered",
            body: "Pode reiniciar o roteador por 30 segundos, por favor?",
            createdAt: "2026-06-15T09:05:00.000Z",
        },
    ],
    "c-1003": [],
    "c-1004": [
        {
            id: "m-9",
            direction: "in",
            status: "read",
            body: "Obrigada pelo atendimento!",
            createdAt: "2026-06-14T18:30:00.000Z",
        },
    ],
};

export const aiSuggestion = {
    suggestion:
        "Olá, Mariana! Sinto muito pelo transtorno. Pode reiniciar o roteador (30s) e me dizer se a luz LOS está vermelha?",
    source: "mock",
};

const json = (route: Route, body: unknown, status = 200) =>
    route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(body),
    });

export interface MockOptions {
    delayMs?: number;
    conversationsError?: boolean;
    messagesError?: boolean;
    sendError?: boolean;
    sendDelayMs?: number;
    aiError?: boolean;
    conversationsOverride?: unknown[];
}

export async function mockApi(page: Page, opts: MockOptions = {}) {
    const wait = () =>
        opts.delayMs
            ? new Promise((r) => setTimeout(r, opts.delayMs))
            : Promise.resolve();

    const store: Record<string, unknown[]> = JSON.parse(
        JSON.stringify(messages),
    );

    await page.route("**/*", async (route) => {
        const req = route.request();
        const path = new URL(req.url()).pathname;
        const method = req.method();

        if (path.endsWith("/me")) return json(route, me);

        const msgMatch = path.match(/\/conversations\/([^/]+)\/messages$/);
        if (msgMatch) {
            const id = msgMatch[1];
            if (method === "POST") {
                if (opts.sendDelayMs) {
                    await new Promise((r) => setTimeout(r, opts.sendDelayMs));
                }
                if (opts.sendError) return json(route, { error: "boom" }, 500);
                const payload = req.postDataJSON() as { text: string };
                const serverMessage = {
                    id: `m-server-${(store[id]?.length ?? 0) + 1}`,
                    direction: "out",
                    status: "sent",
                    body: payload.text,
                    createdAt: "2026-06-15T10:00:00.000Z",
                };
                store[id] = [...(store[id] ?? []), serverMessage];
                return json(route, serverMessage);
            }
            await wait();
            if (opts.messagesError) return json(route, { error: "boom" }, 500);
            return json(route, store[id] ?? []);
        }

        if (path.endsWith("/conversations")) {
            await wait();
            if (opts.conversationsError) {
                return json(route, { error: "boom" }, 500);
            }
            return json(route, opts.conversationsOverride ?? conversations);
        }

        if (path.endsWith("/ai/suggest")) {
            if (opts.aiError) return json(route, { error: "boom" }, 500);
            return json(route, aiSuggestion);
        }

        return route.continue();
    });
}
