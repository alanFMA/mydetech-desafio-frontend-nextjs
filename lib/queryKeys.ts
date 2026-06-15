export const qk = {
    me: ["me"] as const,
    conversations: ["conversations"] as const,
    messages: (conversationId: string) => ["messages", conversationId] as const,
};
