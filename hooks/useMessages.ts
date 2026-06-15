"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMessages } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

export function useMessages(conversationId: string) {
    return useQuery({
        queryKey: qk.messages(conversationId),
        queryFn: () => getMessages(conversationId),
        refetchInterval: 3000,
        placeholderData: keepPreviousData,
    });
}
