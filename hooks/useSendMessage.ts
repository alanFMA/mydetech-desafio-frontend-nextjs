"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage, Message } from "@/lib/api";
import { qk } from "@/lib/queryKeys";
import { toast } from "sonner";

interface SendContext {
    previousMessages?: Message[];
    optimisticId: string;
}

interface UseSendMessageOptions {
    onSendError?: (text: string) => void;
}

export function useSendMessage(
    chatId: string,
    options: UseSendMessageOptions = {},
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newMessage: string) => sendMessage(chatId, newMessage),
        retry: 0,
        onMutate: async (newMessage): Promise<SendContext> => {
            await queryClient.cancelQueries({ queryKey: qk.messages(chatId) });
            const previousMessages = queryClient.getQueryData<Message[]>(
                qk.messages(chatId),
            );

            const optimisticId = `optimistic-${previousMessages?.length ?? 0}-${newMessage.length}-${
                previousMessages?.[previousMessages.length - 1]?.id ?? "first"
            }`;

            const optimisticMessage: Message = {
                id: optimisticId,
                direction: "out",
                body: newMessage,
                status: "sent",
                createdAt: new Date().toISOString(),
            };

            queryClient.setQueryData<Message[]>(qk.messages(chatId), (old) =>
                old ? [...old, optimisticMessage] : [optimisticMessage],
            );

            return { previousMessages, optimisticId };
        },
        onError: (_err, newMessage, context) => {
            if (context?.previousMessages) {
                queryClient.setQueryData(
                    qk.messages(chatId),
                    context.previousMessages,
                );
            }
            toast.error("Falha ao enviar mensagem. Tente novamente.");
            options.onSendError?.(newMessage);
        },
        onSuccess: (serverMessage, _newMessage, context) => {
            queryClient.setQueryData<Message[]>(qk.messages(chatId), (old) =>
                old
                    ? old.map((m) =>
                          m.id === context.optimisticId ? serverMessage : m,
                      )
                    : [serverMessage],
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: qk.messages(chatId) });
            queryClient.invalidateQueries({ queryKey: qk.conversations });
        },
    });
}
