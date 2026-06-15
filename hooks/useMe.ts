"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

export function useMe() {
    return useQuery({
        queryKey: qk.me,
        queryFn: getMe,
        staleTime: Infinity,
    });
}
