"use client";

import { useMutation } from "@tanstack/react-query";
import { suggestReply } from "@/lib/api";
import { toast } from "sonner";

interface UseSuggestReplyOptions {
    onSuggestion: (suggestion: string) => void;
}

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
