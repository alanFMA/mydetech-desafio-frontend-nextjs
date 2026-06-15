import { Skeleton } from "@/components/ui/skeleton";

/** Loading UI do segmento raiz (streaming do App Router). */
export default function Loading() {
    return (
        <div
            className="flex-1 flex flex-col items-center justify-center gap-3"
            role="status"
            aria-busy="true"
            aria-label="Carregando"
        >
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-40" />
        </div>
    );
}
