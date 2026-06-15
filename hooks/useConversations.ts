"use client";

import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

/**
 * Lista de conversas com polling de 3s.
 * É a mesma query consumida pela Sidebar e pelo header do chat — o React Query
 * deduplica automaticamente por compartilharem a chave `qk.conversations`.
 */
export function useConversations() {
    return useQuery({
        queryKey: qk.conversations,
        queryFn: getConversations,
        refetchInterval: 3000,
    });
}
