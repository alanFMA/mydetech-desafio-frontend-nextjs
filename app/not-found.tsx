import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                    Conversa não encontrada
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                    O endereço acessado não corresponde a nenhuma conversa
                    ativa.
                </p>
            </div>
            <Button asChild>
                <Link href="/">Voltar para o início</Link>
            </Button>
        </div>
    );
}
