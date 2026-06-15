/** Formatação de datas para o chat (divisores de dia e horário das bolhas). */

/** Rótulo amigável do dia: "Hoje", "Ontem" ou data completa. */
export function formatDayLabel(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const sameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    if (sameDay(date, today)) return "Hoje";
    if (sameDay(date, yesterday)) return "Ontem";

    return date.toLocaleDateString([], {
        day: "2-digit",
        month: "long",
        year:
            date.getFullYear() === today.getFullYear() ? undefined : "numeric",
    });
}

/** Chave de dia (YYYY-MM-DD) para agrupar mensagens; "" se a data for inválida. */
export function dayKey(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

/** Horário curto (HH:mm); "" se a data for inválida. */
export function formatTime(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
