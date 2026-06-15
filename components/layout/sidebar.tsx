"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { useConversations } from "@/hooks/useConversations";
import { useMe } from "@/hooks/useMe";
import { safeAvatarColor, avatarTextColor, getInitials } from "@/lib/avatar";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: conversations, isLoading, isError } = useConversations();
    const { data: me, isLoading: isMeLoading } = useMe();

    // Memoizado: evita refiltrar a lista inteira a cada keystroke/poll (PERF-03).
    const filteredConversations = useMemo(() => {
        if (!conversations) return undefined;
        const term = searchTerm.toLowerCase();
        return conversations.filter((chat) =>
            chat.contactName.toLowerCase().includes(term),
        );
    }, [conversations, searchTerm]);

    const isHome = pathname === "/";

    return (
        // Responsivo: em telas < md a lista ocupa a tela toda na home e some quando
        // há um chat aberto (a rota controla a view, padrão master→detail mobile).
        <aside
            className={cn(
                "w-full md:w-80 shrink-0 border-r bg-muted/10 flex-col h-full md:flex",
                isHome ? "flex" : "hidden",
            )}
        >
            <div className="p-4 border-b flex flex-col gap-3 bg-background shrink-0">
                <div className="flex items-center justify-between">
                    <div className="min-w-0">
                        <h2 className="font-semibold text-lg">Conversas</h2>
                        {isMeLoading ? (
                            <Skeleton className="h-3 w-28 mt-1" />
                        ) : me ? (
                            <p className="text-xs text-muted-foreground truncate">
                                {me.name} · {me.role}
                            </p>
                        ) : null}
                    </div>
                    <ThemeToggle />
                </div>
                <div className="relative">
                    <Search
                        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Input
                        type="search"
                        placeholder="Buscar contato..."
                        aria-label="Buscar contato"
                        className="pl-8 bg-muted/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <nav
                className="flex-1 overflow-y-auto"
                aria-label="Lista de conversas"
            >
                {isLoading && (
                    <div
                        className="p-4 space-y-4"
                        role="status"
                        aria-busy="true"
                        aria-label="Carregando conversas"
                    >
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-4/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="p-4 text-center text-sm text-destructive">
                        Erro ao carregar conversas.
                    </div>
                )}

                {!isLoading &&
                    !isError &&
                    filteredConversations?.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Nenhum contato encontrado.
                        </div>
                    )}

                {!isLoading &&
                    !isError &&
                    filteredConversations?.map((chat) => {
                        const isActive = pathname === `/chat/${chat.id}`;
                        const bg = safeAvatarColor(chat.avatarColor);
                        return (
                            <Link
                                key={chat.id}
                                href={`/chat/${chat.id}`}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                    "flex items-center gap-3 p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer relative",
                                    isActive && "bg-muted",
                                )}
                            >
                                <Avatar>
                                    <AvatarFallback
                                        style={{
                                            backgroundColor: bg,
                                            color: avatarTextColor(
                                                chat.avatarColor,
                                            ),
                                        }}
                                    >
                                        {getInitials(chat.contactName)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium truncate pr-2">
                                            {chat.contactName}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground shrink-0">
                                            {new Date(
                                                chat.lastMessageAt,
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate pr-6">
                                        {chat.lastMessage}
                                    </p>
                                </div>

                                {chat.unread > 0 && (
                                    <Badge
                                        variant="default"
                                        className="absolute right-4 bottom-4 rounded-full px-1.5 min-w-6 flex justify-center text-[10px]"
                                    >
                                        {chat.unread}
                                        <span className="sr-only">
                                            {" "}
                                            mensagens não lidas
                                        </span>
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
            </nav>
        </aside>
    );
}
