# API

> **Para que serve:** rotas HTTP, CLI I/O, códigos de erro e contratos
> **Fonte da verdade:** handlers / routers / entrypoints CLI
> **Relacionados:** [arquitetura](arquitetura.md) · [banco-de-dados](banco-de-dados.md) · [seguranca](seguranca.md)

## Convenções

- Prefixo / entrypoint: ver código (`/api`, `/v1`, binário CLI, etc.)
- Auth: ver [seguranca](seguranca.md)

## Superfície

| Comando | Descrição |
|---------|-----------|
| `yarn dev` | Servidor de desenvolvimento (Vite) |
| `yarn build` | Typecheck + geração OG PNG + build de produção |
| `yarn preview` | Preview local do build |
| `yarn lint` | ESLint (zero warnings) |
| `yarn test` | Testes unitários (Vitest) |
| `yarn test:e2e` | E2E com Playwright (build + preview) |
| `yarn test:e2e:ui` | Playwright em modo UI |
| `yarn lhci` | Lighthouse CI (autorun local) |

| Método / comando | Caminho | Auth | Nota |
|---|---|---|---|
| GET | `/api/linkedin-posts?limit=1..5` | pública | Lê cache Supabase (`linkedin_posts_posts`). `Cache-Control: public, s-maxage=60, stale-while-revalidate=120`; `Cache-Tag: linkedin-posts`. |
| GET | `/api/linkedin-media?url=` | pública | Proxy de mídia LinkedIn com cache longo. |
