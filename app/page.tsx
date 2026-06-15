"use client";

import { MessageSquareCode } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Home() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 120,
            },
        },
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#f0f2f5] dark:bg-[#222e35] border-l border-border/50 shadow-inner">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center gap-6 text-center max-w-md px-6"
            >
                <motion.div
                    variants={itemVariants}
                    className="h-28 w-28 bg-white dark:bg-muted shadow-sm rounded-full flex items-center justify-center border border-border"
                >
                    <MessageSquareCode
                        aria-hidden="true"
                        className="h-12 w-12 text-primary"
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                    <h1 className="text-3xl font-light text-foreground tracking-tight">
                        Myde<span className="font-semibold">Chat</span>
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Selecione uma conversa na barra lateral para iniciar o
                        atendimento ou pressione a tecla{" "}
                        <kbd className="px-2 py-1 bg-muted rounded-md border text-xs font-mono shadow-sm">
                            ESC
                        </kbd>{" "}
                        a qualquer momento para fechar um chat ativo.
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="mt-8 flex items-center gap-2 text-xs text-muted-foreground opacity-70"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                    >
                        <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Protegido com criptografia de ponta-a-ponta
                </motion.div>
            </motion.div>
        </div>
    );
}
