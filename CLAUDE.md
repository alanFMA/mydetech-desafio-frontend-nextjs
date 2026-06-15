# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## Project Overview

**MydeChat** — frontend de um inbox de atendimento WhatsApp com IA (desafio técnico Frontend
Next.js). O atendente lista conversas, abre o chat, envia mensagens com **atualização otimista**
e gera **sugestões de resposta com IA**. O backend é **fornecido e hospedado** (AWS Lambda + API
Gateway + DynamoDB) — não se implementa nem se modifica; o foco é 100% a camada de frontend.

---

## Tech Stack

| Layer               | Key Technologies                                                 |
| ------------------- | ---------------------------------------------------------------- |
| Framework           | Next.js 15 (App Router), React 19, TypeScript 5.7                |
| Data fetching       | @tanstack/react-query 5, Axios                                   |
| UI                  | Tailwind CSS 4, shadcn/ui (`radix-nova`), Radix UI, lucide-react |
| UX                  | framer-motion, next-themes (dark mode), sonner (toasts)          |
| Backend (fornecido) | Node 22 ESM, AWS Lambda + API Gateway + DynamoDB                 |

---

## Commands

```bash
# Install
npm install

# Dev (http://localhost:3000)
npm run dev

# Type check
npm run typecheck      # tsc --noEmit

# Lint
npm run lint           # next lint

# Build
npm run build
```

### Environment Setup

```bash
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=https://8tymn68hp9.execute-api.us-east-1.amazonaws.com
# (alternativa local: http://localhost:4000 — cd server && node local.mjs)
```

---

## Project Structure

```
t3st3wh4ts4pp/
├── app/
│   ├── layout.tsx           # RootLayout: Providers + ThemeProvider + Sidebar + <main>
│   ├── page.tsx             # Tela de boas-vindas / empty state (Client, framer-motion)
│   ├── providers.tsx        # QueryClientProvider (React Query)
│   ├── error.tsx            # Error boundaries (+ global-error, not-found, loading)
│   ├── globals.css          # Tailwind 4 + tokens de tema (OKLCH)
│   └── chat/[id]/page.tsx   # Tela de chat dinâmica (histórico, envio otimista, IA)
├── components/
│   ├── chat/                # MessageList (memoizado, date dividers, status)
│   ├── layout/              # Sidebar, ThemeProvider, ThemeToggle
│   └── ui/                  # Primitivos shadcn/Radix
├── hooks/                   # useConversations/useMessages/useSendMessage/useSuggestReply
├── lib/
│   ├── api.ts               # Cliente Axios tipado + funções de fetch
│   ├── queryKeys.ts         # Query key factory
│   ├── avatar.ts            # Validação de cor + contraste do avatar
│   ├── date.ts              # Formatação de datas (divisores, horário)
│   └── utils.ts             # cn() (clsx + tailwind-merge)
├── e2e/                     # Testes Playwright (fluxos + screenshots locais)
├── server/                  # Backend FORNECIDO — não modificar
└── CLAUDE.md                # Este arquivo
```

---

## Architecture (Summary)

**Layout:** master-detail global no App Router — `Sidebar` (lista) renderizada uma vez no
`RootLayout`; `<main>` recebe a rota (`/` ou `/chat/[id]`), preservando a Sidebar na navegação.

**Server-state:** React Query é a única fonte de estado de servidor. Query keys: `["conversations"]`,
`["messages", chatId]`, `["me"]`. Polling de 3s em lista e mensagens. O header do chat lê o contato
do cache de `["conversations"]` (sem fetch redundante).

**Envio otimista:** `useMutation(sendMessage)` injeta a bolha em `onMutate`, faz rollback do snapshot
em `onError` e invalida em `onSettled`. A bolha otimista é reconciliada com a resposta real do
`POST` em `onSuccess`; o cache de `["conversations"]` é invalidado junto.

---

## Essential Rules

- **No Co-Authored-By** — não adicionar linhas `Co-Authored-By` nas mensagens de commit.
- **Não modificar o backend** — `server/` é fornecido; o desafio é só o frontend.
- **A chave da IA nunca toca o browser** — toda IA passa pelo proxy `/ai/suggest`. Nunca colocar
  segredos em código client (`NEXT_PUBLIC_*` é público por definição).
- **Estados sempre tratados** — loading/erro/vazio são obrigatórios em cada fluxo de dados.
- **Conscientemente Client vs Server** — só marque `"use client"` quando houver hooks/interatividade.

---

## Completed Features

- **Lista de conversas** — busca/filtro client-side, badge de não-lidas, polling 3s.
- **Tela de chat** — histórico em bolhas in/out, timestamps, header dinâmico via cache.
- **Envio otimista** — bolha imediata + rollback no erro (toast).
- **Sugestão de IA** — botão preenche o input via `/ai/suggest`.
- **Dark mode + UX** — next-themes, atalho ESC (consciente de foco), auto-scroll condicional,
  animações da home, responsivo mobile.
- **Acessibilidade** — `aria-label` nos controles, `role="log"`/`aria-live` na lista de mensagens,
  `aria-current` na conversa ativa, badges com texto `sr-only`.
- **Segurança/config** — security headers (CSP) no `next.config.mjs`, validação de cor de avatar.
- **Testes E2E** — Playwright mapeando todos os fluxos contra o build de produção (`npm run test:e2e`).
