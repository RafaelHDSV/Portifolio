# LinkedIn — posts automaticos no portfolio

O portfolio busca seus posts recentes via API serverless (`/api/linkedin-posts`). Quando voce publica no LinkedIn, os posts aparecem automaticamente apos o cache expirar (~30 min), sem editar codigo.

## Opcao A — RSS (recomendada, setup unico)

Servicos como [RSS.app](https://rss.app/) geram um feed RSS a partir do seu perfil LinkedIn.

1. Crie conta no RSS.app (plano gratuito costuma bastar).
2. Crie um feed a partir da URL do perfil:
   `https://www.linkedin.com/in/rafael-vieira1720/`
3. Copie a URL do feed RSS gerada.
4. Configure a variavel de ambiente:

```env
LINKEDIN_RSS_URL=https://rss.app/feeds/xxxxx.xml
```

5. Na Vercel: Project Settings > Environment Variables > adicione `LINKEDIN_RSS_URL`.
6. Redeploy.

Novos posts passam a aparecer na secao **LinkedIn** do portfolio quando o feed RSS atualizar.

## Opcao B — LinkedIn API oficial

Requer app no [LinkedIn Developer Portal](https://www.linkedin.com/developers/) com permissao para ler posts do membro autenticado.

```env
LINKEDIN_ACCESS_TOKEN=seu_token
LINKEDIN_MEMBER_URN=urn:li:person:XXXXXXXX
```

A API e tentada primeiro; se falhar ou retornar vazio, o sistema usa `LINKEDIN_RSS_URL` como fallback.

### Obter o Member URN

```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
  "https://api.linkedin.com/v2/me"
```

Use o campo `id` no formato `urn:li:person:XXXX`.

## Desenvolvimento local

O Vite expoe a mesma rota em dev (`vite.config.ts`). Configure as variaveis no `.env` na raiz do projeto (sem prefixo `VITE_`).

## Secao oculta

Se nenhuma variavel estiver configurada ou o feed estiver vazio, a secao LinkedIn **nao e exibida** — o portfolio continua funcionando normalmente.

## Referencia no codigo

- Fetch: `lib/linkedin/fetchPosts.ts`
- API Vercel: `api/linkedin-posts.ts`
- UI: `src/screens/LinkedIn/LinkedInPosts.tsx`
