"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="pt-BR">
            <body
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    fontFamily: "system-ui, sans-serif",
                    textAlign: "center",
                    padding: "1.5rem",
                }}
            >
                <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                    Algo deu errado
                </h2>
                <p style={{ color: "#6b7280", maxWidth: "24rem" }}>
                    Ocorreu um erro inesperado na aplicação.
                </p>
                <button
                    onClick={() => reset()}
                    style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #d1d5db",
                        cursor: "pointer",
                    }}
                >
                    Tentar novamente
                </button>
            </body>
        </html>
    );
}
