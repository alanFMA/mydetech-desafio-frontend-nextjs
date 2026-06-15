/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

// O runtime de desenvolvimento do Next usa `eval` (HMR/source maps), que exige
// 'unsafe-eval'. Em produção o bundle não usa eval, então o CSP fica mais estrito.
const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

// Defense-in-depth: headers de segurança estáticos (OWASP Secure Headers).
// connect-src libera apenas a própria origem e o API Gateway do desafio.
const securityHeaders = [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
    },
    {
        key: "Content-Security-Policy",
        value: [
            "default-src 'self'",
            "connect-src 'self' https://*.execute-api.us-east-1.amazonaws.com",
            "img-src 'self' data:",
            "style-src 'self' 'unsafe-inline'",
            // 'unsafe-inline' necessário para os estilos do Next/Tailwind; refinar com
            // nonce via middleware caso a app evolua para produção.
            scriptSrc,
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join("; "),
    },
];

const nextConfig = {
    async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
    },
};

export default nextConfig;
