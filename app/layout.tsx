import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Inbox de Atendimento — Desafio Frontend",
    description: "Desafio técnico frontend Myde",
};

// Next 15: themeColor/colorScheme vão no export `viewport`, não em `metadata`.
export const viewport: Viewport = {
    colorScheme: "light dark",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0B101A" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="pt-BR"
            className={cn("font-sans", geist.variable)}
            suppressHydrationWarning
        >
            <body className={geist.className}>
                <Providers>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
                            <Sidebar />
                            <main className="flex-1 flex flex-col h-full relative min-w-0 overflow-hidden">
                                {children}
                            </main>
                        </div>
                        <Toaster richColors position="top-right" />
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
