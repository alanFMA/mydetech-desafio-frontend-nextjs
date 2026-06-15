"use client";

import { useParams, notFound } from "next/navigation";
import { Send, Wand2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useSuggestReply } from "@/hooks/useSuggestReply";
import { MessageList } from "@/components/chat/message-list";
import { safeAvatarColor, avatarTextColor, getInitials } from "@/lib/avatar";

export default function ChatPage() {
    const params = useParams();
    const chatId = params.id as string;

    const [text, setText] = useState("");

    const { data: conversations } = useConversations();
    const currentChat = conversations?.find((c) => c.id === chatId);

    if (conversations && !currentChat) {
        notFound();
    }

    const { data: messages, isLoading, isError } = useMessages(chatId);

    const sendMutation = useSendMessage(chatId, {
        onSendError: (failedText) => setText(failedText),
    });

    const aiMutation = useSuggestReply(chatId, {
        onSuggestion: (suggestion) => {
            const previous = text;
            setText(suggestion);
            toast.success("Sugestão aplicada! Revise antes de enviar.", {
                action: previous
                    ? { label: "Desfazer", onClick: () => setText(previous) }
                    : undefined,
            });
        },
    });

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        sendMutation.mutate(text);
        setText("");
    };

    if (isLoading && !messages) {
        return (
            <div className="flex-1 flex flex-col p-4 space-y-4" role="status" aria-busy="true" aria-label="Carregando mensagens">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
                        <Skeleton className="h-12 w-1/3 rounded-2xl" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex-1 flex items-center justify-center text-destructive">
                Erro ao carregar o histórico de mensagens.
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50 dark:bg-[#0B101A]">
            <div className="h-16 border-b flex items-center px-4 md:px-6 bg-background/95 backdrop-blur z-10 shrink-0 gap-3 shadow-sm">
                {currentChat ? (
                    <>
                        <Avatar className="h-10 w-10 border border-border/50">
                            <AvatarFallback
                                style={{
                                    backgroundColor: safeAvatarColor(currentChat.avatarColor),
                                    color: avatarTextColor(currentChat.avatarColor),
                                }}
                            >
                                {getInitials(currentChat.contactName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <h1 className="font-semibold text-sm leading-tight text-foreground">
                                {currentChat.contactName}
                            </h1>
                            <span className="text-xs text-muted-foreground mt-0.5">
                                {currentChat.contactPhone}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-3" role="status" aria-busy="true" aria-label="Carregando contato">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                )}
            </div>

            <div
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-label={currentChat ? `Conversa com ${currentChat.contactName}` : "Histórico de mensagens"}
                className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col pb-4"
            >
                {messages && messages.length > 0 ? (
                    <MessageList messages={messages} />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center text-sm text-muted-foreground">
                        Nenhuma mensagem ainda. Diga olá 👋
                    </div>
                )}
            </div>

            <div className="p-4 bg-background border-t shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <Button
                        type="button" variant="outline" size="icon"
                        onClick={() => aiMutation.mutate()}
                        disabled={aiMutation.isPending || sendMutation.isPending}
                        title="Sugerir resposta com IA" aria-label="Sugerir resposta com IA"
                        className="shrink-0"
                    >
                        <Wand2 aria-hidden="true" className={cn("h-4 w-4 text-primary", aiMutation.isPending && "animate-spin")} />
                    </Button>

                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        aria-label={currentChat ? `Mensagem para ${currentChat.contactName}` : "Mensagem"}
                        className="flex-1 bg-background"
                        disabled={sendMutation.isPending}
                    />

                    <Button
                        type="submit" size="icon"
                        disabled={!text.trim() || sendMutation.isPending}
                        title="Enviar mensagem" aria-label="Enviar mensagem"
                        className="shrink-0"
                    >
                        <Send aria-hidden="true" className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
