# Banco de dados

> **Para que serve:** schema, migrations, seeds e storage
> **Fonte da verdade:** migrations / SQL / ORM / buckets
> **Relacionados:** [api](api.md) · [seguranca](seguranca.md) · [regras-de-negocio](regras-de-negocio.md)

## Visão

- Function Vercel: `api/linkedin-posts.ts`
- Cliente: `src/hooks/useLinkedInPosts.ts` e seção lazy `src/screens/LinkedInPosts/`
- Variáveis server-only na Vercel: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (sem prefixo `VITE_`)
- A Function lê até cinco posts cacheados de `linkedin_posts_posts`; não inicia scraping nem expõe a service role.
- Atualização do cache: repo irmão [`linkedin-posts`](https://github.com/RafaelHDSV/linkedin-posts) (`yarn scrape <username>` / tarefa de logon). O HTML do LinkedIn mudou para SDUI (`role=listitem`); o scraper resolve URL via "Copiar link da publicação" quando o card não expõe `/feed/update/`.

## Tabelas / coleções principais

| Nome | Papel |
|---|---|
| | Preencher a partir das migrations |

## Migrations

Onde vivem e como aplicar: ver scripts do `package.json` e [ambiente-e-operacao](ambiente-e-operacao.md).
