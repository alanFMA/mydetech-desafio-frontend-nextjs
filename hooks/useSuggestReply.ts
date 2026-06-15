"use client";

import { useMutation } from "@tanstack/react-query";
import { suggestReply } from "@/lib/api";
import { toast } from "sonner";

interface UseSuggestReplyOptions {
    /** Recebe a sugestão da IA; o componente decide como aplicá-la ao rascunho. */
    onSuggestion: (suggestion: string) => void;
}

/**
 * Sugestão de resposta via IA (proxy `/ai/suggest`).
 *
 * A operação é idempotente (não causa efeito colateral), então `retry: 2`
 * cobre falhas transitórias de rede sem risco. A aplicação da sugestão ao
 * rascunho fica a cargo do componente (ver tratamento de não-sobrescrever
 * rascunho existente em ChatPage — D-03).
 */
export function useSuggestReply(
    chatId: string,
    { onSuggestion }: UseSuggestReplyOptions,
) {
    return useMutation({
        mutationFn: () => suggestReply(chatId),
        retry: 2,
        onSuccess: (data) => {
            onSuggestion(data.suggestion);
        },
        onError: () => {
            toast.error("A IA não conseguiu gerar uma sugestão no momento.");
        },
    });
}
