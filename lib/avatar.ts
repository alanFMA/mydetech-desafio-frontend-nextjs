/**
 * Helpers de avatar — validação de cor e contraste.
 *
 * `avatarColor` vem da API. Mesmo sendo um backend confiável, validamos o
 * formato antes de injetar em `style` (defesa na borda de render) e calculamos
 * a cor do texto pela luminância para garantir contraste legível (WCAG 1.4.3).
 */

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Retorna a cor se for um hex válido; senão, um token neutro do tema. */
export function safeAvatarColor(color: string | undefined | null): string {
    return color && HEX.test(color) ? color : "var(--muted)";
}

/** Escolhe #fff ou #111 conforme a luminância do fundo (só para hex válido). */
export function avatarTextColor(color: string | undefined | null): string {
    if (!color || !HEX.test(color)) return "var(--foreground)";

    let hex = color.slice(1);
    if (hex.length === 3) {
        hex = hex
            .split("")
            .map((c) => c + c)
            .join("");
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    // Luminância relativa aproximada (sRGB).
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#111111" : "#ffffff";
}

/** Iniciais seguras para nomes vazios, de 1 caractere ou com acentos/emoji. */
export function getInitials(name: string | undefined | null): string {
    if (!name) return "?";
    return Array.from(name.trim()).slice(0, 2).join("").toUpperCase() || "?";
}
