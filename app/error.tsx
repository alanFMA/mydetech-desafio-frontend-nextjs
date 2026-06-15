"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
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
                    Algo deu errado
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Ocorreu um erro inesperado ao carregar esta tela. Você pode
                    tentar novamente.
                </p>
            </div>
            <Button onClick={() => reset()}>Tentar novamente</Button>
        </div>
    );
}
