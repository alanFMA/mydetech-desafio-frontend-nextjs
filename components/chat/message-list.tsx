"use client";

import { memo } from "react";
import { Message } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatTime, formatDayLabel, dayKey } from "@/lib/date";

interface MessageListProps {
    messages: Message[];
}

/** Ícone de status estilo WhatsApp: ✓ enviado · ✓✓ entregue (cinza) · ✓✓ lido (azul). */
function StatusTicks({
    status,
    optimistic,
}: {
    status: Message["status"];
    optimistic: boolean;
}) {
    if (optimistic) return <span className="ml-1 tracking-tighter">⏳</span>;
    if (status === "read")
        return <span className="ml-1 tracking-tighter text-sky-400">✓✓</span>;
    if (status === "delivered")
        return <span className="ml-1 tracking-tighter">✓✓</span>;
    return <span className="ml-1 tracking-tighter">✓</span>;
}

/**
 * Lista de bolhas memoizada (D-01): isolada do estado do input para que digitar
 * não re-renderize todas as mensagens a cada tecla. Insere divisores de dia
 * (UX-04) e distingue os três status de entrega (ARCH-05).
 */
function MessageListImpl({ messages }: MessageListProps) {
    let lastDay = "";

    return (
        <>
            {messages.map((msg) => {
                const isOut = msg.direction === "out";
                const isOptimistic = msg.id.startsWith("optimistic-");
                const key = dayKey(msg.createdAt);
                const showDivider = key !== "" && key !== lastDay;
                if (showDivider) lastDay = key;

                return (
                    <div key={msg.id}>
                        {showDivider && (
                            <div className="flex justify-center my-3">
                                <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
                                    {formatDayLabel(msg.createdAt)}
                                </span>
                            </div>
                        )}
                        <div
                            className={cn(
                                "flex w-full",
                                isOut ? "justify-end" : "justify-start",
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[75%] px-4 py-2 text-sm shadow-sm transition-all",
                                    isOut
                                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                        : "bg-background border text-foreground rounded-2xl rounded-tl-sm",
                                    isOptimistic && "opacity-60",
                                )}
                            >
                                <p className="leading-relaxed whitespace-pre-wrap break-words">
                                    {msg.body}
                                </p>
                                <div className="text-[10px] mt-1 text-right opacity-70 font-medium">
                                    {formatTime(msg.createdAt)}
                                    {isOut && (
                                        <StatusTicks
                                            status={msg.status}
                                            optimistic={isOptimistic}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export const MessageList = memo(MessageListImpl);
