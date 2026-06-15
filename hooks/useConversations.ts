"use client";

import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

export function useConversations() {
    return useQuery({
        queryKey: qk.conversations,
        queryFn: getConversations,
        refetchInterval: 3000,
    });
}
