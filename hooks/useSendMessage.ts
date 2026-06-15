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
    /** Chamado quando o envio falha, com o texto original para reidratar o rascunho. */
    onSendError?: (text: string) => void;
}

/**
 * Envio otimista de mensagem.
 *
 * - `onMutate`: injeta a bolha otimista e tira um snapshot para rollback.
 * - `onError`: faz rollback do cache, devolve o texto ao rascunho e avisa via toast.
 * - `onSuccess`: substitui a bolha otimista pelo objeto real do servidor (D-07),
 *   evitando que o poll de 3s sobrescreva ou duplique a bolha na janela da mutation.
 * - `onSettled`: invalida mensagens e a lista de conversas (D-08), para que
 *   `lastMessage`/`unread` da Sidebar não fiquem stale até o próximo poll.
 *
 * `retry: 0` é intencional: sem `Idempotency-Key` (backend imutável), um retry
 * automático poderia duplicar a mensagem entregue ao cliente.
 */
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
            // Troca a bolha otimista pelo objeto real do servidor (reconciliação determinística).
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
            // Mantém a Sidebar (lastMessage/unread) em sincronia com o envio.
            queryClient.invalidateQueries({ queryKey: qk.conversations });
        },
    });
}
