# 💬 MydeChat — Interface de Atendimento (Frontend)

Este repositório contém a solução para o desafio técnico de front-end. A aplicação foi construída com foco em **Clean Architecture, Resiliência, Segurança e Experiência do Utilizador (UX)**, simulando um ambiente de produção real e escalável.

## ✨ Funcionalidades Entregues

A aplicação consome a API Serverless fornecida e entrega um inbox completo:

- **Lista de conversas:** Busca/filtro client-side, indicador de mensagens não lidas e atualização em tempo real (polling).
- **Tela de chat:** Histórico de mensagens com bolhas segregadas (cliente × atendente), timestamps e header dinâmico.
- **Envio Otimista (Optimistic UI):** A mensagem aparece instantaneamente no DOM antes da confirmação da rede, garantindo fluidez.
- **Inteligência Artificial:** Botão de sugestão de resposta via `/ai/suggest` (com proxy seguro no backend) com opção de "Desfazer" para preservar o rascunho do usuário.
- **UX e Acessibilidade:** Tratamento rigoroso de estados (Loading, Erro, Vazio), Dark Mode, navegação por teclado (ESC para fechar) e suporte a leitores de tela (WAI-ARIA).

---

## 📂 Estrutura do Projeto

A organização de diretórios reflete a separação de responsabilidades (Clean Architecture):

```text
desafio-front-end-nextjs/
├── app/                  # Roteamento do Next.js (App Router), Layouts e Páginas
├── components/
│   ├── chat/             # Componentes de domínio do chat (MessageList, Bubbles)
│   ├── layout/           # Estrutura global (Sidebar, ThemeProvider)
│   └── ui/               # Componentes visuais primitivos (Shadcn/Radix)
├── hooks/                # Lógica de negócio isolada (React Query, Mutações)
├── lib/                  # Utilitários puros (Axios, Data, Avatar, QueryKey Factory)
├── e2e/                  # Suíte de testes Playwright e screenshots
└── server/               # Backend Serverless (Fornecido pelo desafio)
```

---

## 🧭 Decisões de Arquitetura e Trade-offs

Esta seção documenta as decisões de engenharia e — tão importante quanto — o que foi **conscientemente deixado de fora** para evitar _over-engineering_.

### O que foi feito

- **Camada de Hooks + Query Key Factory:** Toda a lógica de servidor saiu das páginas. `useConversations`, `useMessages`, `useSendMessage` e `useSuggestReply` encapsulam _queries_ e _mutations_. As chaves de cache vivem num só lugar (`lib/queryKeys.ts`), evitando _typos_ e invalidações inconsistentes.
- **Envio otimista com reconciliação determinística:** A bolha otimista é substituída pela resposta real do `POST` em `onSuccess` (sem depender do polling), invalidando o cache da Sidebar em paralelo. O `retry: 0` no envio é **intencional**: como o backend fornecido não honra _Idempotency-Keys_, um _retry_ automático poderia duplicar a mensagem enviada.
- **Resiliência:** Implementação de `<Toaster>` no layout root para feedback visual de falhas, Error Boundaries nativos (`error.tsx`, `not-found.tsx`) e `refetchOnReconnect`.
- **UX de Chat Avançada:** Auto-scroll **condicional** (só rola a tela automaticamente se o usuário já estiver no fim ou se ele mesmo enviar a mensagem), `MessageList` memoizado (para não re-renderizar o histórico ao digitar) e divisores de data.
- **Acessibilidade e Segurança:** Uso extensivo de `aria-label`, `role="log"` com `aria-live="polite"` no histórico, `aria-current` na conversa ativa e emblemas numéricos com `sr-only`. A infraestrutura conta com _Security Headers_ (CSP, X-Frame-Options) configurados no `next.config.mjs`.

### O que foi deixado de fora (De propósito)

- **Prefetch SSR / `HydrationBoundary`:** Contraindicado para um inbox autenticado com dados _live_ (polling). O ganho de Web Vitals não compensa a complexidade arquitetural neste cenário.
- **Virtualização de listas (`@tanstack/react-virtual`):** Otimização prematura para o volume de dados do desafio. Seria o próximo passo lógico em um cenário de alta escala.
- **`staleTime` × `refetchInterval`:** Não há incoerência no setup. O `refetchInterval` refazer a requisição a cada 3s independente do `staleTime` é o comportamento documentado e desejado para simular _WebSockets_ via _polling_.

### O que faria com mais tempo (Evolução Contínua)

- Em um cenário com mais tempo para aprimoramentos, minha primeira ação seria implementar uma política de segurança mais rígida utilizando **CSP com Nonce via Middleware**. Para elevar ainda mais a proteção contra ataques de `XSS`, adicionaria a injeção de um `nonce` dinâmico e estrito diretamente nos cabeçalhos HTTP.

- Investiria na cobertura de **Testes Unitários Estruturais** com ferramentas como `Jest` ou `Vitest`. O foco seria testar exaustivamente as funções utilitárias do domínio isoladas no diretório `lib/`, garantindo a integridade estrutural e a ausência de regressões nos cálculos matemáticos de contraste de avatar e nas lógicas de divisores de data.

- Pensaria na **Virtualização para Escala**. Caso o volume de mensagens por conversa em ambiente de produção crescesse vertiginosamente, eu aplicaria a virtualização de renderização da lista de histórico. Isso impediria a sobrecarga do `DOM`, garantindo uma fluidez constante e sem engasgos na `Main Thread`.

---

## 🧪 Qualidade e Testes (E2E)

A suíte E2E em **Playwright** mapeia todos os fluxos principais. A API é interceptada/mockada (`e2e/fixtures.ts`), tornando os testes **determinísticos e capazes de rodar offline**. Isso também permite exercitar estados que a API real não entrega sob demanda (erros 5xx, timeouts). A execução sobe automaticamente o build de produção, validando também as políticas de CSP.

**Fluxos cobertos:**

1. **Lista:** Carga, busca/filtro, estado vazio, skeletons e erro.
2. **Chat:** Histórico, header dinâmico, _deep-link_ de conversas inexistentes (404).
3. **Envio:** Bolha otimista ⏳, reconciliação, rollback com _toast_ de erro e restauração do rascunho.
4. **IA:** Preenchimento do input e funcionalidade de "Desfazer".
5. **UX Global:** Dark mode, tecla ESC consciente de foco e responsividade mobile.

---

### 🚀 1. Configuração de Ambiente

O cliente HTTP já vem configurado para consumir o backend AWS Serverless fornecido. Apenas clone as variáveis de ambiente:

```bash
cp .env.example .env.local
```

### 🚀 2. Instalação e Execução

```bash
npm install
npm run dev #http://localhost:3000
```

### ⚙️ Comandos úteis

`npm run build` | Build de produção

`npm run start` | Serve o build de produção

`npm run typecheck` | Type check (`tsc --noEmit`)

`npm run test:e2e` | Roda **todos os fluxos E2E** (sobe o build sozinho)

**Rodar os testes do zero:**
`npm install` → `npx playwright install chromium` (apenas uma vez na máquina) → `npm run test:e2e`.
