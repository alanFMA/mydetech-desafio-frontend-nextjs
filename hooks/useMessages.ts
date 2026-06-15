"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMessages } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

/**
 * Histórico de mensagens de uma conversa, com polling de 3s.
 *
 * `placeholderData: keepPreviousData` mantém a conversa anterior visível
 * durante a transição entre chats, evitando o flash de skeleton de tela inteira
 * ao trocar de conversa (UX de inbox).
 */
export function useMessages(conversationId: string) {
    return useQuery({
        queryKey: qk.messages(conversationId),
        queryFn: () => getMessages(conversationId),
        refetchInterval: 3000,
        placeholderData: keepPreviousData,
    });
}
