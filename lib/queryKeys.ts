/**
 * Query Key Factory — fonte única das chaves do React Query.
 *
 * Centraliza as chaves para evitar typos e invalidações inconsistentes
 * (TkDodo, "Effective React Query Keys"). Use sempre estas funções em vez de
 * arrays literais espalhados pelos componentes.
 */
export const qk = {
    me: ["me"] as const,
    conversations: ["conversations"] as const,
    messages: (conversationId: string) => ["messages", conversationId] as const,
};
