# LinkedIn — posts no portfolio

Este guia explica **o que funciona de verdade** em 2026 para exibir posts do LinkedIn no portfolio, e como configurar.

**Site:** https://rafaelhdsv.vercel.app

---

## Por que RSS e API falham (nao e culpa sua)

### RSS.app com perfil pessoal (`/in/seu-nome`)

O erro **"We couldn't find any posts"** e esperado.

O LinkedIn **nao expoe um feed publico** dos posts de perfil pessoal. Servicos como RSS.app tentam "raspar" a pagina, mas o LinkedIn bloqueia isso (login, anti-bot, conteudo carregado via JavaScript). Na pratica:

- URL de **perfil** (`/in/rafael-vieira1720/`) → quase sempre falha
- URL de **pagina de empresa** (`/company/nome/`) → as vezes funciona, mas **nao sao seus posts pessoais**

**Conclusao:** nao insista no RSS.app com URL de perfil. Nao e configuracao errada — e limitacao da plataforma.

### API oficial do LinkedIn

Dois obstaculos separados:

**1. Campo "LinkedIn Page" ao criar o app**

Voce **nao precisa ter uma empresa real**. O portal exige associar uma *LinkedIn Page* ao app — e regra administrativa deles.

Opcoes:

| Situacao | O que fazer |
|----------|-------------|
| Desenvolvedor individual | No campo de busca, digite **`Default Company Page for Individual Developer`** ou clique no link *"click here"* da mensagem de ajuda para ver a pagina padrao do LinkedIn |
| Nada aparece na busca | Crie uma **LinkedIn Page gratuita** minima (veja secao abaixo) — pode ser "Rafael Vieira Dev", sem CNPJ, sem atividade comercial |

**2. Permissao para ler seus posts**

Mesmo com app criado, a API de **ler posts do membro** (`r_member_social`) **nao e liberada** para a maioria dos devs individuais. E produto restrito / parceiros aprovados.

Ou seja: criar o app resolve o cadastro, mas **nao garante** que `/api/linkedin-posts` va buscar posts automaticamente.

**Conclusao:** para portfolio pessoal, trate API como opcional avancada — nao como caminho principal.

---

## Opcao recomendada — posts manuais (5 min por publicacao)

Funciona sempre, sem RSS, sem API, sem Company Page.

### Como funciona

Voce edita uma lista de posts no codigo (ou variavel de ambiente). O portfolio exibe ate 5, do mais recente ao mais antigo.

### Passo a passo

1. **Publique no LinkedIn** normalmente.

2. **Copie a URL do post**
   - Clique nos `...` do post → *Copiar link para publicacao*
   - Ou abra o post e copie da barra de endereco
   - Formato tipico: `https://www.linkedin.com/feed/update/urn:li:activity:7123456789012345678`

3. **Edite o arquivo** `lib/linkedin/manualPosts.ts`

Descomente o exemplo e adicione seu post (mais recente **no topo** do array):

```typescript
export const MANUAL_LINKEDIN_POSTS: LinkedInPost[] = [
  {
    id: '2026-05-24-meu-post',
    title: 'Titulo curto (primeira frase do post)',
    excerpt: 'Resumo em 1-2 frases do que voce escreveu.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7123456789012345678',
    publishedAt: '2026-05-24T15:30:00.000Z'  // data ISO (UTC)
  }
]
```

4. **Deploy** (commit + push, ou redeploy na Vercel).

5. **Confirme:** abra `/api/linkedin-posts` no site — deve retornar JSON com `posts`.

### Alternativa sem editar codigo (Vercel)

Na Vercel, crie a variavel `LINKEDIN_MANUAL_POSTS` com JSON em **uma linha**:

```env
LINKEDIN_MANUAL_POSTS=[{"id":"1","title":"Meu post","excerpt":"Resumo...","url":"https://www.linkedin.com/feed/update/urn:li:activity:XXX","publishedAt":"2026-05-24T12:00:00.000Z"}]
```

Ela tem **prioridade** sobre o arquivo `manualPosts.ts`.

---

## (Opcional) Criar LinkedIn Page minima para o Developer Portal

So necessario se quiser tentar a API ou se o portal nao mostrar a pagina padrao de dev individual.

1. LinkedIn → **Paginas** → **Criar pagina**
2. Tipo: **Pequena empresa** ou **Showcase**
3. Nome: ex. `Rafael Vieira Dev` (nao precisa ser empresa real)
4. Preencha o minimo (descricao curta, logo opcional)
5. Ao criar o app em https://www.linkedin.com/developers/apps/new:
   - **App name:** ex. `Portfolio Rafael`
   - **LinkedIn Page:** busque e selecione a pagina que voce criou
   - Aceite os termos e crie

Isso **nao publica nada** na pagina automaticamente — so destrava o cadastro do app.

Para tentar API depois (sem garantia de leitura de posts):

```env
LINKEDIN_ACCESS_TOKEN=...
LINKEDIN_MEMBER_URN=urn:li:person:XXXXXXXX
```

Token via OAuth no Developer Portal → aba *Auth* → gere token de teste com escopos disponiveis.

---

## Opcao RSS — quando usar

Use RSS **somente** se tiver feed de **pagina de empresa** que realmente publica conteudo, nao perfil `/in/`.

```env
LINKEDIN_RSS_URL=https://rss.app/feeds/xxxxx.xml
```

Ordem de prioridade no codigo:

1. `LINKEDIN_MANUAL_POSTS` (env) ou `manualPosts.ts`
2. LinkedIn API (se token + URN)
3. RSS (se URL)

---

## Testar localmente

```bash
# Com posts manuais no arquivo (sem outras variaveis)
yarn dev

# Testar API
curl -s http://localhost:5173/api/linkedin-posts
```

Resposta esperada:

```json
{ "posts": [ { "id": "...", "title": "...", "excerpt": "...", "url": "...", "publishedAt": "..." } ] }
```

---

## Troubleshooting

| Sintoma | Causa | Solucao |
|---------|-------|---------|
| RSS.app: "couldn't find any posts" | Perfil `/in/` nao tem feed scrapeavel | Use **posts manuais** |
| Portal pede Company Page | Regra do LinkedIn para apps | Pagina padrao de dev individual **ou** crie Page minima |
| API retorna 403 / vazio | Sem permissao `r_member_social` | Normal para dev individual — use **posts manuais** |
| Secao LinkedIn oculta | Array manual vazio + RSS/API falhando | Adicione pelo menos 1 post em `manualPosts.ts` |
| Funciona local, nao em prod | Deploy desatualizado | Push + redeploy na Vercel |

---

## Referencia no codigo

| Arquivo | Funcao |
|---------|--------|
| `lib/linkedin/manualPosts.ts` | **Lista manual (recomendado)** |
| `lib/linkedin/fetchPosts.ts` | Orquestra manual → API → RSS |
| `api/linkedin-posts.ts` | Handler serverless |
| `src/screens/LinkedIn/LinkedInPosts.tsx` | UI da secao |

---

## Resumo — qual caminho seguir?

```
Quer posts no portfolio hoje?
  └─ Sim → lib/linkedin/manualPosts.ts (5 min quando publicar)

Quer automatizar sem editar codigo?
  └─ Perfil pessoal → nao ha solucao confiavel gratuita em 2026
  └─ Pagina de empresa ativa → talvez RSS de /company/...

Quer explorar API?
  └─ Crie Page minima OU selecione "Default Company Page for Individual Developer"
  └─ Saiba que ler posts provavelmente nao sera aprovado
```
