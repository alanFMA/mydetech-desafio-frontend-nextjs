import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Inbox de Atendimento — Desafio Frontend",
    description: "Desafio técnico frontend Myde",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
            <body className={geist.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
