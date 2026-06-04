# Google Search Console — Portfolio Rafael Vieira

Guia para registrar o site no [Google Search Console](https://search.google.com/search-console) e enviar o sitemap.

**URL do site:** https://rafaelhdsv.vercel.app  
**Sitemap:** https://rafaelhdsv.vercel.app/sitemap.xml  
**Robots:** https://rafaelhdsv.vercel.app/robots.txt

---

## 1. O que ja esta pronto no codigo

| Item | Arquivo | Descricao |
|------|---------|-----------|
| Meta description + OG | `index.html` | Titulo, descricao, Open Graph, Twitter Card, JSON-LD (`Person`) |
| `robots.txt` | `public/robots.txt` | Permite indexacao e aponta para o sitemap |
| `sitemap.xml` | `public/sitemap.xml` | URL principal (home) + imagens OG |
| Canonical unico | `index.html` + `src/i18n/index.ts` | Apenas `/` indexavel; idioma via client-side |
| `/recruiter` noindex | `vercel.json` | Header `X-Robots-Tag: noindex, nofollow` |
| Verificacao Google | `vite.config.ts` + `.env` | Meta tag injetada no build quando `VITE_GOOGLE_SITE_VERIFICATION` esta definida |

---

## 2. Criar a propriedade no Search Console

1. Acesse https://search.google.com/search-console e entre com a conta Google desejada.
2. Clique em **Adicionar propriedade**.
3. Escolha **Prefixo do URL** e informe:
   ```
   https://rafaelhdsv.vercel.app/
   ```
   (Use exatamente `https` e a barra final, como acima.)
4. Clique em **Continuar**.

> Se no futuro voce usar dominio proprio (ex.: `rafaelvieira.dev`), crie uma **nova** propriedade para esse dominio ou migre usando redirecionamento 301 da Vercel.

---

## 3. Verificar a propriedade (meta tag — recomendado)

### 3.1. Copiar o token no Google

Na etapa de verificacao, escolha o metodo **Tag HTML** (meta tag).

O Google mostra algo como:

```html
<meta name="google-site-verification" content="SEU_TOKEN_AQUI" />
```

Copie **somente** o valor de `content` (o token).

### 3.2. Configurar localmente

No arquivo `.env` (nao commitar):

```env
VITE_GOOGLE_SITE_VERIFICATION=SEU_TOKEN_AQUI
```

### 3.3. Configurar na Vercel (producao)

1. Painel Vercel → projeto **portifolio** → **Settings** → **Environment Variables**
2. Adicione:
   - **Name:** `VITE_GOOGLE_SITE_VERIFICATION`
   - **Value:** o token copiado do Google
   - **Environment:** Production (e Preview, se quiser testar previews)
3. Salve e faca um **novo deploy** (Redeploy) para o HTML de producao incluir a meta tag.

### 3.4. Confirmar no site

Apos o deploy, abra o codigo-fonte de https://rafaelhdsv.vercel.app/ (Ctrl+U) e confira se existe:

```html
<meta name="google-site-verification" content="SEU_TOKEN_AQUI" />
```

### 3.5. Verificar no Google

Volte ao Search Console e clique em **Verificar**. Se falhar, aguarde alguns minutos apos o deploy e tente de novo.

---

## 4. Metodo alternativo: arquivo HTML

Se preferir nao usar variavel de ambiente:

1. No Search Console, escolha **Arquivo HTML** como metodo.
2. Baixe o arquivo (ex.: `google1234567890abcdef.html`).
3. Coloque o arquivo em `public/` do repositorio (mesmo nivel de `robots.txt`).
4. Commit, push e deploy.
5. Teste no navegador: `https://rafaelhdsv.vercel.app/google1234567890abcdef.html`
6. Clique em **Verificar** no Search Console.

Remova o arquivo depois da verificacao, se quiser — a propriedade permanece verificada.

---

## 5. Enviar o sitemap

1. No Search Console, menu lateral → **Sitemaps** (Mapas do site).
2. Em **Adicionar um novo sitemap**, informe:
   ```
   sitemap.xml
   ```
   (apenas o caminho relativo; o Google completa com a URL da propriedade.)
3. Clique em **Enviar**.

Status esperado: **Sucesso** (pode levar algumas horas para processar).

URLs uteis para conferir manualmente:

- https://rafaelhdsv.vercel.app/sitemap.xml
- https://rafaelhdsv.vercel.app/robots.txt

---

## 6. Inspecao de URL e indexacao

1. Menu **Inspecao de URL**.
2. Cole `https://rafaelhdsv.vercel.app/` e pressione Enter.
3. Se a pagina nao estiver indexada, use **Solicitar indexacao**.

O portfolio e uma SPA (React). O Google renderiza JavaScript; a indexacao pode levar dias na primeira vez. O JSON-LD e as meta tags em `index.html` ajudam o rastreador mesmo antes do JS carregar.

---

## 7. Checklist pos-configuracao

- [ ] Propriedade criada (`https://rafaelhdsv.vercel.app/`)
- [ ] Verificacao concluida (meta tag ou arquivo HTML)
- [ ] Sitemap enviado (`sitemap.xml`)
- [ ] Inspecao de URL solicitada para a home
- [ ] Variavel `VITE_GOOGLE_SITE_VERIFICATION` na Vercel (se usou meta tag)
- [ ] `.env` local atualizado (nao commitado)

---

## 8. Manutencao

- **Novo deploy:** nao e necessario reenviar o sitemap a cada deploy; o Google revisita periodicamente.
- **Mudanca de dominio:** atualize `index.html`, `public/sitemap.xml`, `public/robots.txt` e crie nova propriedade no Search Console.
- **Token invalido:** gere nova verificacao no Search Console e atualize `VITE_GOOGLE_SITE_VERIFICATION`.

---

## 9. Problemas comuns de indexacao (GSC)

### "Pagina alternativa com tag canonica adequada"

**Causa tipica neste projeto:** URLs `/?lang=pt` ou `/?lang=en` eram declaradas como alternates (hreflang + sitemap), mas o canonical apontava para `/`. O JavaScript ainda sobrescrevia o canonical para `/?lang=...` apos o boot — sinal conflitante para o Google.

**Correcao aplicada:**

- Canonical fixo em `https://rafaelhdsv.vercel.app/` (HTML estatico; JS nao altera mais).
- hreflang com query string removido do `index.html` e do `sitemap.xml` (SPA com i18n client-side usa uma unica URL).
- Parametro `?lang=` continua funcionando para links compartilhados, mas e removido da barra de endereco com `history.replaceState` apos aplicar o idioma.

Esse status para URLs antigas `/?lang=*` deve sumir apos re-rastreamento (dias).

### "Rastreada, mas nao indexada no momento"

**Causa tipica:** `/recruiter` — pagina auxiliar da SPA, sem valor de busca organica. O `noindex` so existia via JavaScript (`useRecruiterNoIndex`), invisivel para parte do crawl.

**Correcao aplicada:** header HTTP `X-Robots-Tag: noindex, nofollow` em `/recruiter` no `vercel.json`.

**Apos deploy:**

1. Search Console → **Sitemaps** → reenviar `sitemap.xml` (opcional, acelera).
2. **Inspecao de URL** → `https://rafaelhdsv.vercel.app/` → **Solicitar indexacao**.
3. Em **Indexacao → Paginas**, aguarde 3–14 dias; espere **1 URL indexada** (`/`) e queda das nao indexadas.

---

## 10. Favicon e imagem no resultado do Google

O Google **nao atualiza na hora**. Favicon e thumbnail (imagem ao lado do snippet) podem levar **dias ou semanas** apos deploy e reindexacao.

### O que o site expoe

| Recurso | URL | Uso |
|---------|-----|-----|
| Favicon 48px | `/icon-48.png`, `/favicon.ico` | Icone ao lado do resultado |
| Logo schema | `/icon-192.png` | `WebSite.logo` no JSON-LD |
| Foto Person | `/og/avatar.jpg` | `Person.image` (quadrada) |
| Favicon 192/512 | `/icon-192.png`, `/icon.png` | PWA / alta resolucao |
| OG / thumbnail | `/og-pt.png` (1200x630) | `og:image` + `WebPage.primaryImageOfPage` |
| JSON-LD | `index.html` | WebSite, Person, WebPage |
| Sitemap imagem | `sitemap.xml` | `og-pt.png` + `avatar.jpg` |

Gerados no build: `yarn tsx scripts/generate-icon.ts` e `yarn tsx scripts/generate-og.ts`.

### Por que aparece "Vercel" ou globo generico

- Indexacao antiga (antes do favicon/OG corretos).
- Google ainda nao re-rastreou a home apos o deploy.
- Falta `og:site_name` (corrigido em `index.html`).

### Acelerar a atualizacao

1. **Deploy** com as alteracoes de SEO (favicon + OG + JSON-LD).
2. Search Console → **Inspecao de URL** → `https://rafaelhdsv.vercel.app/` → **Solicitar indexacao**.
3. Confirme que abrem no navegador:
   - https://rafaelhdsv.vercel.app/icon-48.png
   - https://rafaelhdsv.vercel.app/og-pt.png
4. Teste de compartilhamento: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) ou [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) (valida OG).
5. **Thumbnail no Google nao e garantida** — o algoritmo decide por relevancia da query. Buscar pelo **dominio** (`rafaelhdsv.vercel.app`) costuma mostrar antes que busca por nome.

### Search Console mostra "Dados em processamento"

Se a Visao geral exibe **"Dados em processamento: volte em mais ou menos um dia"** e **0 cliques**, a propriedade foi criada ha pouco. Isso e normal:

1. O Google ainda nao terminou o primeiro rastreamento completo.
2. Favicon e thumbnail **so aparecem depois** que a indexacao estabilizar.
3. Enquanto isso, o snippet pode mostrar **"Vercel"** e globo generico (hostname `*.vercel.app`).

**Acoes enquanto processa:**

1. Menu **Indexacao** → **Paginas** — confira se a URL `/` aparece como "Indexada".
2. **Inspecao de URL** → teste a URL publicada → compare HTML ao codigo-fonte local.
3. **Sitemaps** — status "Sucesso" em `sitemap.xml`.
4. Repita **Solicitar indexacao** apos cada deploy relevante de SEO.

### Painel da direita vs thumbnail ao lado do link

| Elemento | O que e | Como conseguir |
|----------|---------|----------------|
| Thumbnail ao lado do resultado | Preview da pagina (OG) | `og-pt.png` + indexacao; nao garantido |
| Painel da direita (Knowledge Panel) | Card de entidade (pessoa/marca) | Autoridade + `Person` + `sameAs`; raro em portfolio novo |
| Carrossel (GitHub, LinkedIn) | Outras URLs indexadas suas | Normal ao buscar por dominio; nao e a OG do site |

Dominio proprio (`rafaelvieira.dev`) acelera sair do branding "Vercel" no resultado.

---

## 11. Referencias

- [Documentacao Search Console](https://support.google.com/webmasters/)
- [Sitemaps — protocolo](https://www.sitemaps.org/protocol.html)
- Contexto do projeto: [`docs/context.md`](./context.md)
