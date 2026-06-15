"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Error boundary específico da rota de chat: um erro ao renderizar a conversa
 * fica isolado aqui, mantendo a Sidebar (lista de conversas) viva e navegável.
 */
export default function ChatError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                    Não foi possível abrir esta conversa
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Tente novamente ou selecione outra conversa na barra
                    lateral.
                </p>
            </div>
            <Button onClick={() => reset()}>Tentar novamente</Button>
        </div>
    );
}
