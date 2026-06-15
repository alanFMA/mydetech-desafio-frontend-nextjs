"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    // `resolvedTheme` reflete o tema efetivo (resolve "system" para light/dark),
    // evitando que o 1º clique erre a direção quando defaultTheme="system" (D-02).
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            title="Alternar tema"
            aria-label="Alternar tema claro/escuro"
            className="shrink-0"
        >
            <Sun
                aria-hidden="true"
                className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground"
            />
            <Moon
                aria-hidden="true"
                className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground"
            />
            <span className="sr-only">Alternar tema</span>
        </Button>
    );
}
