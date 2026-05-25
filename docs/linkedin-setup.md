# LinkedIn — posts automaticos no portfolio

Este guia configura a secao **LinkedIn** do portfolio para exibir seus posts recentes sem editar codigo a cada publicacao.

**Como funciona:** a rota serverless `/api/linkedin-posts` busca um feed RSS (recomendado) ou a API oficial do LinkedIn. O front so mostra a secao quando ha posts validos.

**Site:** https://rafaelhdsv.vercel.app

---

## Pre-requisitos

- Conta no [RSS.app](https://rss.app/) (plano gratuito costuma bastar)
- Acesso ao projeto na [Vercel](https://vercel.com/) (Environment Variables)
- Perfil LinkedIn publico: https://www.linkedin.com/in/rafael-vieira1720/

---

## Passo a passo — RSS.app (recomendado)

### 1. Criar conta no RSS.app

1. Acesse https://rss.app/
2. Crie uma conta (Google ou e-mail)
3. Confirme o e-mail se solicitado

### 2. Gerar feed a partir do perfil LinkedIn

1. No painel, clique em **New Feed** (ou **Create Feed**)
2. Escolha a opcao de feed a partir de **URL** / **Webpage** / **Social** (o nome varia no painel)
3. Cole a URL do perfil:
   ```
   https://www.linkedin.com/in/rafael-vieira1720/
   ```
4. Aguarde o RSS.app processar (pode levar 1–2 minutos na primeira vez)
5. Se pedir plano pago para LinkedIn, use o trial gratuito ou a alternativa **LinkedIn Profile RSS** no mesmo painel

### 3. Copiar a URL do feed

1. Abra o feed criado
2. Copie a URL que termina em `.xml`, por exemplo:
   ```
   https://rss.app/feeds/xxxxxxxx.xml
   ```
3. Teste no navegador ou no terminal — deve retornar XML com tags `<item>`:

```bash
curl -s "https://rss.app/feeds/SUA_ID.xml" | head -n 30
```

Voce deve ver linhas como `<title>`, `<link>` e `<description>`.

### 4. Configurar localmente (desenvolvimento)

1. Na raiz do projeto, copie o exemplo se ainda nao tiver `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edite `.env` e adicione (sem aspas extras, sem espaco no fim):
   ```env
   LINKEDIN_RSS_URL=https://rss.app/feeds/xxxxxxxx.xml
   ```
3. Reinicie o servidor de dev (`yarn dev`)
4. Teste a API local:
   ```bash
   curl -s http://localhost:5173/api/linkedin-posts
   ```
   Resposta esperada: JSON com array `posts` (pode ser `[]` se o feed ainda estiver vazio)

### 5. Configurar na Vercel (producao)

1. Vercel → seu projeto **portifolio** → **Settings** → **Environment Variables**
2. Adicione:
   | Name | Value |
   |------|--------|
   | `LINKEDIN_RSS_URL` | `https://rss.app/feeds/xxxxxxxx.xml` |
3. Marque **Production** (e **Preview** se quiser testar em PRs)
4. Salve
5. **Deployments** → ultimo deploy → **Redeploy** (obrigatorio apos nova variavel)

### 6. Validar no site

1. Abra https://rafaelhdsv.vercel.app
2. A secao **LinkedIn** aparece na navbar e no rodape **somente** se houver posts
3. Cache: a API guarda resultado por ~30 min — um post novo pode demorar ate esse tempo para aparecer

---

## Opcao B — API oficial LinkedIn (avancado)

Use apenas se ja tiver app aprovado no [LinkedIn Developer Portal](https://www.linkedin.com/developers/).

```env
LINKEDIN_ACCESS_TOKEN=seu_token_oauth
LINKEDIN_MEMBER_URN=urn:li:person:XXXXXXXX
```

A API e tentada **primeiro**; se falhar ou retornar vazio, o sistema usa `LINKEDIN_RSS_URL`.

### Obter o Member URN

```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
  "https://api.linkedin.com/v2/me"
```

Use o campo `id` no formato `urn:li:person:XXXX`.

---

## Troubleshooting

| Sintoma | Causa provavel | O que fazer |
|---------|----------------|-------------|
| Secao LinkedIn nao aparece | Variavel ausente na Vercel ou feed vazio | Confira env + redeploy; teste URL do RSS no browser |
| `posts: []` na API | Feed sem itens ou URL errada | Abra o `.xml` no navegador; recrie o feed no RSS.app |
| Funciona local, nao em prod | Variavel so no `.env` local | Adicione `LINKEDIN_RSS_URL` na Vercel e redeploy |
| Erro 500 na API | RSS.app bloqueou ou URL invalida | Teste `curl` na URL; gere novo feed |
| Posts desatualizados | Cache da API (~30 min) | Aguarde ou faca redeploy para limpar cache cold |

### Checklist rapido

- [ ] URL do feed abre XML valido no navegador
- [ ] `LINKEDIN_RSS_URL` na Vercel (Production)
- [ ] Redeploy feito apos adicionar a variavel
- [ ] `/api/linkedin-posts` retorna JSON com posts em producao

---

## Referencia no codigo

| Arquivo | Funcao |
|---------|--------|
| `lib/linkedin/fetchPosts.ts` | Parse RSS + fallback API LinkedIn |
| `api/linkedin-posts.ts` | Handler serverless (Vercel) |
| `src/context/LinkedInProvider.tsx` | Carrega posts no client |
| `src/screens/LinkedIn/LinkedInPosts.tsx` | UI da secao |

---

## Comportamento quando nao configurado

Se nenhuma variavel estiver definida ou o feed estiver vazio, a secao LinkedIn **permanece oculta** — o restante do portfolio funciona normalmente.
