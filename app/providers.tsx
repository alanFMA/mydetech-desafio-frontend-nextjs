"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5_000,
                        refetchOnWindowFocus: false,
                        // Revalida ao recuperar a conexão (resiliência offline→online).
                        refetchOnReconnect: true,
                        // 1 retry: erro de leitura aparece rápido para o usuário;
                        // o polling de 3s recupera assim que a API volta.
                        retry: 1,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}
