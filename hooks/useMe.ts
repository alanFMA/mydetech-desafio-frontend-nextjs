"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

/**
 * Perfil do atendente logado (GET /me).
 *
 * Dado de sessão — não muda durante o uso, então `staleTime: Infinity`
 * evita refetches desnecessários (sem polling, ao contrário das conversas).
 */
export function useMe() {
    return useQuery({
        queryKey: qk.me,
        queryFn: getMe,
        staleTime: Infinity,
    });
}
