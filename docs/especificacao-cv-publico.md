```
Titulo: Portifolio — CV publico acessivel (fix 404)
Repositorio: RafaelHDSV/portifolio
Labels: epic
Project: Vieira (https://github.com/users/RafaelHDSV/projects/8)
```

---

# Especificacao de Desenvolvimento — Portifolio v3.2 (CV publico acessivel)

> Correcao pos-v3.1: o link de CV aponta para PDF raw de repo GitHub privado e retorna 404 para visitantes anonimos. **Implementado (Issue #47):** Opcao C — repo publico [`RafaelHDSV/cvs`](https://github.com/RafaelHDSV/cvs).

**Versao:** 3.2  
**Data:** 20/06/2026 · **Implementado:** 21/06/2026  
**Repositorio:** `RafaelHDSV/portifolio`  
**Issue:** [#47](https://github.com/RafaelHDSV/Portifolio/issues/47)  
**Uso:** Epic para colar no GitHub Project Vieira; implementacao via `ai-development-workflow.mdc`  
**Referencias:** [`docs/context.md`](./context.md) · [`docs/especificacao-v2-refino-ui-ux.md`](./especificacao-v2-refino-ui-ux.md) (decisao CV #2) · deploy `https://rafaelhdsv.vercel.app` · repo CV [`cvs`](https://github.com/RafaelHDSV/cvs) (publico)

---

## 1. Resumo executivo

O portifolio expoe links de CV em cinco pontos da UI (navbar, hero, about, modo recrutador). Desde a v2, a URL aponta para o arquivo raw `Curriculo.pdf` no repositorio privado `PERSONAL-CVs`. URLs `/raw/` de repos privados exigem sessao GitHub autenticada com permissao de leitura — visitantes em guia anonima, ou logados sem acesso ao repo, recebem **404 do GitHub** em vez do PDF.

| Area | Mudanca principal |
|------|-------------------|
| `constants/cv.ts` | Trocar `CV_URL` por URL **publica** (same-origin ou CDN publico) |
| UI (4 telas) | Sem mudanca visual; herdam nova constante |
| `public/cv.pdf` | Asset estatico servido pela Vercel (opcoes A ou B) |
| CI (opcional) | GitHub Action sync do PDF privado → `public/` (opcao B) |
| E2E | Validar `href` + resposta HTTP 200 no PDF |
| Docs | Atualizar `docs/context.md`; supersede decisao v2 #2 |

**Principios**

- **Acesso publico sem auth:** qualquer visitante baixa ou abre PDF valido.
- **UX preservada:** mesmos CTAs, atributo `download`, nome `Rafael Vieira - Curriculo`.
- **Nao quebrar `GITHUB_USERNAME`:** constante permanece para perfil GitHub em About/Recrutador.
- **Atualizacao documentada:** fluxo claro para o autor manter CV sincronizado conforme estrategia escolhida.
- **Same-origin preferivel:** URL relativa (`/cv.pdf`) evita falhas de `download` cross-origin e dependencia de sessao externa.

---

## 2. Decisoes registradas

| # | Tema | Decisao |
|---|------|---------|
| 1 | Problema confirmado | URL raw de repo **privado** nao serve visitantes publicos |
| 2 | UX | Manter pontos de CV existentes (navbar, hero, about, recrutador); sem novo easter egg nesta epic |
| 3 | Nome do arquivo | Manter `CV_DOWNLOAD_NAME` = `Rafael Vieira - Curriculo` |
| 4 | Testes | E2E valida URL publica; adicionar assert HTTP 200 no PDF (Playwright `request`) |
| 5 | Docs | Atualizar [`docs/context.md`](./context.md) secao 6 (Integracoes) e tabela v1.1→v2 |
| 6 | Supersede v2 | Decisao v2 #2 (CV remoto PERSONAL-CVs) **revogada** — motivo: repo privado incompativel com acesso publico |
| 7 | Estrategia (#47) | **Opcao C** — repo publico renomeado para [`RafaelHDSV/cvs`](https://github.com/RafaelHDSV/cvs); `CV_URL` atualizado |

**Decisao pendente #1 — RESOLVIDA (21/06/2026): Opcao C**

Repo `PERSONAL-CVs` tornou-se publico e foi renomeado para `cvs`. URL final:

```
https://github.com/RafaelHDSV/cvs/raw/main/Curr%C3%ADculo.pdf
```

~~Decisao pendente #1 — Estrategia de hospedagem~~ (historico):

| Opcao | Descricao | Pros | Contras |
|-------|-----------|------|---------|
| **A** | PDF estatico em `public/cv.pdf` | Simples; zero infra extra; URL relativa `/cv.pdf` na Vercel; same-origin | Atualizacao manual + redeploy |
| **B** | GitHub Action sync no build/deploy | Repo fonte privado; deploy com ultimo PDF; URL publica no portifolio | Workflow + secret `PERSONAL_CV_TOKEN`; complexidade CI |
| **C** | Tornar `PERSONAL-CVs` publico | Minima mudanca de codigo; mantem URL raw atual | Expoe repositorio de CVs; pode nao ser desejado |

**Recomendacao (nao vinculante):** **Opcao A** para entrega rapida e confiavel; **Opcao B** se quiser manter fonte unica privada com sync automatico. **Opcao C** so se nao houver objecao em tornar o repo publico.

---

## 3. Visao do produto

### 3.1 Problema

Recrutadores e visitantes clicam em "Baixar CV" ou "CV" na navbar e sao redirecionados para pagina 404 do GitHub. Isso:

- Quebra confianca no portifolio como canal de contato profissional.
- Contradiz criterio de aceite v2: "CV abre PDF atualizado do GitHub".
- Afeta modo recrutador (`/recruiter`), pensado para avaliacao rapida por RH.
- So funciona quando o visitante esta logado no GitHub com acesso ao repo `PERSONAL-CVs`.

**Estado atual (codigo):**

```ts
// src/constants/cv.ts
export const CV_URL =
  'https://github.com/RafaelHDSV/PERSONAL-CVs/raw/main/Curr%C3%ADculo.pdf'
```

### 3.2 Solucao

1. Escolher estrategia de hospedagem (A, B ou C — secao 2).
2. Ajustar `CV_URL` em `src/constants/cv.ts` para URL publicamente acessivel.
3. Garantir entrega do PDF (asset em `public/` ou repo publico).
4. Validar download/abertura em guia anonima e cross-browser.
5. Atualizar testes E2E e documentacao.

### 3.3 Fora do escopo

- Gerador ou editor de CV integrado ao portifolio.
- Versionamento multi-idioma de PDF (PT/EN separados).
- QR code apontando para CV (backlog em `analise-sugestoes-v2.9.md`).
- Analytics de clique no CV (`@vieira/analytics`).
- Tornar outros repos privados publicos.
- Easter egg "CV rapido" (3 cliques no link CV).

---

## 4. Arquitetura

### 4.1 Arvore de diretorios impactados

```
src/
├── constants/
│   └── cv.ts                  # CV_URL publica; GITHUB_USERNAME inalterado
├── components/
│   └── Navbar/Navbar.tsx      # Link CV (desktop + mobile)
└── screens/
    ├── Header/Header.tsx      # CTA "Baixar CV"
    ├── About/About.tsx        # Botao CV
    └── Recruiter/RecruiterView.tsx  # 2 CTAs CV

public/
└── cv.pdf                     # Opcoes A e B — servido estaticamente

.github/workflows/
└── sync-cv.yml                # Opcao B — sync do PERSONAL-CVs

e2e/
└── links.spec.ts              # href + HTTP 200

docs/
└── context.md                 # Integracoes + historico v1.1→v2
```

### 4.2 Stack

| Camada | Tecnologia | Papel |
|--------|------------|-------|
| Front | React 18 + Vite 7 | Links `<a href download>` via `Button` |
| Asset | `public/cv.pdf` | PDF estatico (opcoes A/B) |
| Deploy | Vercel | Serve `/cv.pdf` do build |
| CI (opcional) | GitHub Actions | Sync PDF privado → repo portifolio (opcao B) |
| Testes | Playwright | Assert href + HEAD 200 |

### 4.3 Fluxo atual (quebrado)

```
Visitante anonimo
    → clica "Baixar CV"
    → href = github.com/.../PERSONAL-CVs/raw/main/Curriculo.pdf
    → GitHub exige auth no repo privado
    → 404 GitHub
```

### 4.4 Fluxo alvo — Opcao A (PDF estatico)

```
Visitante (qualquer)
    → clica "Baixar CV"
    → href = /cv.pdf (same-origin)
    → Vercel serve public/cv.pdf
    → 200 application/pdf
    → browser abre ou baixa (download attr)
```

### 4.5 Fluxo alvo — Opcao B (sync CI)

```
Autor atualiza Curriculo.pdf em PERSONAL-CVs (privado)
    → push ou workflow_dispatch
    → Action baixa PDF com token read-only
    → commit ou artefato em public/cv.pdf (repo portifolio)
    → Vercel redeploy
    → visitante acessa /cv.pdf (mesmo fluxo da opcao A)
```

### 4.6 Fluxo alvo — Opcao C (repo publico)

```
Autor torna PERSONAL-CVs publico
    → URL raw permanece (encode UTF-8 no path)
    → visitante acessa sem auth
    → 200 application/pdf
```

**Nota:** Opcao C mantem URL cross-origin; atributo `download` pode ser ignorado por alguns browsers — abrir em nova aba (`target=_blank`) continua funcionando.

### 4.7 Pontos de consumo de `CV_URL`

| Arquivo | Elemento | Contexto |
|---------|----------|------------|
| `Navbar.tsx` | `<a href download>` | Link "CV" desktop e menu mobile |
| `Header.tsx` | `Button href download` | CTA secundario "Baixar CV" |
| `About.tsx` | `Button href download` | Acao na secao Sobre |
| `RecruiterView.tsx` | `Button href download` (×2) | Hero recrutador + bloco contato |
| `links.spec.ts` | `toHaveAttribute('href')` | E2E navbar + hero |

`Button.tsx` trata links externos (`http`) com `target="_blank"` e `rel="noopener noreferrer"`. URL relativa `/cv.pdf` **nao** abre nova aba — comportamento desejado para download direto.

---

## 5. Especificacao detalhada

### 5.1 Constantes — `src/constants/cv.ts`

**Objetivo:** Fonte unica de URL e nome de download do CV; sem dependencia de auth GitHub.

**Mudancas**

- [ ] Alterar `CV_URL` conforme estrategia escolhida:

| Opcao | Valor sugerido |
|-------|----------------|
| A ou B | `'/cv.pdf'` |
| C | Manter URL raw (repo agora publico) |

- [ ] Manter `CV_DOWNLOAD_NAME = 'Rafael Vieira - Curriculo'`
- [ ] Manter `GITHUB_USERNAME = 'RafaelHDSV'` (nao relacionado ao CV)
- [ ] (Opcional) Comentario JSDoc indicando origem do PDF e como atualizar

**Exemplo — Opcao A/B:**

```ts
/** PDF servido em public/cv.pdf — atualizar manualmente ou via sync-cv workflow */
export const CV_URL = '/cv.pdf'

export const CV_DOWNLOAD_NAME = 'Rafael Vieira - Curriculo'

export const GITHUB_USERNAME = 'RafaelHDSV'
```

**Regras**

- `CV_URL` nunca aponta para raw de repo privado.
- Preferir path relativo (same-origin) nas opcoes A e B.

**Criterio de aceite**

- [ ] Constante exportada e importada nos 4 componentes sem alteracao de API
- [ ] TypeScript compila sem erros

---

### 5.2 Navbar — `src/components/Navbar/Navbar.tsx`

**Objetivo:** Link "CV" funcional para visitantes anonimos; zero mudanca visual.

**Uso esperado**

```
[RV]  Sobre · Stack · Projetos · Contato · CV    [PT|EN] [ tema ]
```

**Mudancas**

- [ ] Nenhuma alteracao de markup — apenas herda novo `CV_URL` de `constants/cv.ts`
- [ ] Desktop: link CV na barra de navegacao
- [ ] Mobile: link CV no menu hamburger

**Comportamento**

- URL relativa: sem `target="_blank"` (download/abertura na mesma origem)
- URL externa (opcao C): mantem `target="_blank"` via logica existente em `Button` ou anchor

**Criterio de aceite**

- [ ] Link "CV" na navbar abre/baixa PDF em guia anonima
- [ ] Funciona em PT e EN (label i18n inalterado)
- [ ] Menu mobile: mesmo comportamento

---

### 5.3 Hero — `src/screens/Header/Header.tsx`

**Objetivo:** CTA "Baixar CV" entrega PDF valido.

**Mudancas**

- [ ] Nenhuma alteracao visual — `Button` com `href={CV_URL}` e `download={CV_DOWNLOAD_NAME}`
- [ ] Manter par de CTAs: "Ver projetos" + "Baixar CV"

**Criterio de aceite**

- [ ] CTA secundario baixa/abre PDF em guia anonima
- [ ] Atributo `download` presente no DOM

---

### 5.4 About — `src/screens/About/About.tsx`

**Objetivo:** Botao CV na secao Sobre funcional.

**Mudancas**

- [ ] Herdar novo `CV_URL` — sem alteracao de layout ou copy i18n

**Criterio de aceite**

- [ ] Botao CV na secao About abre/baixa PDF em guia anonima

---

### 5.5 Modo recrutador — `src/screens/Recruiter/RecruiterView.tsx`

**Objetivo:** Ambos CTAs de CV no layout recrutador funcionam; print CSS nao depende de URL GitHub.

**Pontos de CV no componente**

1. Hero/card de perfil — botao "Baixar CV"
2. Bloco de contato — link/botao CV

**Mudancas**

- [ ] Herdar novo `CV_URL` nos dois pontos
- [ ] Validar `@media print`: links de CV nao quebram layout (URL relativa imprime path absoluto resolvido pelo browser)

**Criterio de aceite**

- [ ] Ambos CTAs funcionam em `/recruiter` em guia anonima
- [ ] Print preview (Ctrl+P) nao exibe URL GitHub quebrada

---

### 5.6 Asset PDF — `public/cv.pdf` (opcoes A e B)

**Objetivo:** Arquivo PDF servido estaticamente pelo Vite/Vercel em `/cv.pdf`.

**Preparacao (autor)**

1. Exportar PDF atual de `PERSONAL-CVs` (`Curriculo.pdf`)
2. Copiar para `public/cv.pdf` no repo portifolio
3. Commitar (PDF e documento publico por design desta epic)

**Regras**

- [ ] Arquivo **nao** listado em `.gitignore`
- [ ] Tamanho tipico ~100–500 KB — aceitavel no repo
- [ ] Se crescer muito (>2 MB), considerar Git LFS (evolucao futura)

**Validacao pos-deploy**

```bash
curl -I https://rafaelhdsv.vercel.app/cv.pdf
# Esperado: HTTP/2 200, content-type: application/pdf
```

**Criterio de aceite**

- [ ] `public/cv.pdf` existe no repo (opcoes A/B)
- [ ] URL `/cv.pdf` retorna 200 em producao e preview
- [ ] Conteudo e PDF valido (nao HTML de erro)

---

### 5.7 Workflow CI — `.github/workflows/sync-cv.yml` (opcao B)

**Objetivo:** Sincronizar PDF do repo privado `PERSONAL-CVs` para `public/cv.pdf` sem tornar o repo fonte publico.

**Triggers sugeridos**

- `workflow_dispatch` (manual)
- `schedule` (ex.: diario 06:00 UTC) — opcional
- `repository_dispatch` — se PERSONAL-CVs disparar evento (avancado)

**Secrets**

| Secret | Escopo |
|--------|--------|
| `PERSONAL_CV_TOKEN` | PAT read-only em `RafaelHDSV/PERSONAL-CVs` |

**Passos do workflow (pseudocodigo)**

```yaml
# 1. Checkout portifolio
# 2. Download raw PDF com Authorization: token ${{ secrets.PERSONAL_CV_TOKEN }}
#    URL: .../PERSONAL-CVs/raw/main/Curr%C3%ADculo.pdf
# 3. Salvar em public/cv.pdf
# 4. Validar: file exists && file --mime-type == application/pdf
# 5. Commit + push se diff (bot) OU falhar build se ausente
```

**Regras**

- Token **nunca** em `VITE_*` nem no bundle front
- Token minimo: contents read no repo PERSONAL-CVs
- Build Vercel deve falhar se `public/cv.pdf` ausente apos sync

**Criterio de aceite**

- [ ] Workflow executa com sucesso manualmente
- [ ] PDF atualizado reflete push em PERSONAL-CVs (dentro do intervalo do trigger)
- [ ] Falha explicita se download retorna 404 ou HTML

---

### 5.8 Repo publico — opcao C

**Objetivo:** Minima mudanca de codigo tornando `PERSONAL-CVs` publico.

**Passos (autor, fora do codigo)**

1. Settings → Danger Zone → Change visibility → Public em `PERSONAL-CVs`
2. Validar URL raw em guia anonima
3. (Opcional) Manter URL atual em `cv.ts` ou normalizar encoding do path

**Regras**

- Nenhum arquivo novo no portifolio
- E2E continua validando URL externa
- Adicionar teste HTTP 200 na URL raw (pode ser flaky se repo voltar a privado)

**Criterio de aceite**

- [ ] URL raw retorna 200 em guia anonima
- [ ] Nenhum 404 GitHub ao clicar CV

---

### 5.9 Testes E2E — `e2e/links.spec.ts`

**Objetivo:** Garantir links corretos e PDF acessivel em CI.

**Mudancas**

- [ ] Atualizar asserts de `href` para novo `CV_URL` (import de `constants/cv.ts` — ja existe)
- [ ] Renomear descricao: "PDF remoto" → "PDF publico" ou equivalente
- [ ] Novo teste: resposta HTTP 200

**Exemplo — teste de disponibilidade (opcao A/B):**

```ts
test('CV responde 200 na origem', async ({ page, baseURL }) => {
  const url = CV_URL.startsWith('/')
    ? `${baseURL}${CV_URL}`
    : CV_URL
  const response = await page.request.head(url)
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('pdf')
})
```

**Criterio de aceite**

- [ ] `yarn test:e2e` passa localmente e em CI
- [ ] Testes cobrem navbar e hero (existentes) + HTTP 200 (novo)

---

### 5.10 Documentacao

**Arquivo:** [`docs/context.md`](./context.md)

**Secoes a atualizar**

- [ ] Secao 2 (Estrutura): `cv.ts` — de "CV_URL remoto" para "CV publico `/cv.pdf`" (ou equivalente)
- [ ] Secao 4 (Navbar, Hero, About): remover "CV remoto PERSONAL-CVs"
- [ ] Secao 6 (Integracoes GitHub): remover linha "CV: raw de PERSONAL-CVs"; adicionar nota de asset estatico ou sync
- [ ] Secao 11 (tabela v1.1→v2): adicionar linha v3.2 revertendo/supersedendo CV remoto
- [ ] Secao 12 (Pendencias): item "como atualizar CV" conforme estrategia

**README (opcional, recomendado)**

Breve nota na secao de conteudo do autor:

```markdown
## Atualizar CV
1. Edite o PDF em PERSONAL-CVs (ou exporte novo)
2. Copie para `public/cv.pdf` e commit (opcao A)
   — ou dispare workflow sync-cv (opcao B)
3. Push → deploy Vercel
```

**Criterio de aceite**

- [ ] `docs/context.md` reflete estado pos-v3.2
- [ ] Decisao v2 #2 marcada como superseded com motivo

---

## 6. Mecanismos compartilhados

**Constantes de produto**

- `CV_URL`, `CV_DOWNLOAD_NAME`, `GITHUB_USERNAME` em `src/constants/cv.ts`
- Consumidas por componentes via import ESM — sem context provider

**Componente Button**

- Links com `href` starting `http` → `target="_blank"`, `rel="noopener noreferrer"`
- Links relativos → mesma aba; `download` attr repassado ao `<a>`

**Deploy Vercel**

- `public/cv.pdf` copiado para raiz do build pelo Vite
- Sem rewrite necessario em `vercel.json`

**Opcao B — CI**

- Secret `PERSONAL_CV_TOKEN` apenas no GitHub Actions
- Nunca expor em variaveis `VITE_*`

**Nao se aplica:** engine de templates Vieira CLI, variaveis `{{}}`, scaffolds.

---

## 7. Instalacao e distribuicao

Sem mudanca no fluxo principal de deploy.

```bash
# Opcao A — apos copiar PDF
cp /caminho/Curriculo.pdf public/cv.pdf
yarn build
yarn preview
# Validar http://localhost:4173/cv.pdf

# Opcao B — apos configurar workflow
# Adicionar secret PERSONAL_CV_TOKEN no GitHub
# Disparar workflow sync-cv manualmente
yarn build && yarn test:e2e
```

**Vercel:** redeploy apos merge; validar `/cv.pdf` em producao.

**Validacao pos-deploy (checklist manual)**

- [ ] Guia anonima: clicar CV na navbar → PDF abre
- [ ] Guia anonima: hero "Baixar CV" → PDF abre
- [ ] `/recruiter` → ambos CTAs CV funcionam
- [ ] Mobile Safari / Chrome Android (amostragem)

---

## 8. Roadmap de implementacao

| Fase | Escopo | Estimativa |
|------|--------|------------|
| **1 — Decisao** | Escolher estrategia A, B ou C | 0,5 dia |
| **2 — Implementacao** | `cv.ts` + asset/workflow/repo publico | 0,5–1 dia |
| **3 — Qualidade** | E2E + validacao manual anonima + recrutador | 0,5 dia |
| **4 — Docs** | `context.md` + nota README | 0,25 dia |

**Total estimado:** 1,5–2,5 dias (1 dev).

### Checklist por fase

**Fase 1**
- [ ] Decisao pendente #1 resolvida e registrada na issue

**Fase 2**
- [ ] `CV_URL` atualizado
- [ ] PDF acessivel conforme estrategia

**Fase 3**
- [ ] `yarn test:e2e` verde
- [ ] Validacao manual em guia anonima

**Fase 4**
- [ ] `docs/context.md` atualizado

---

## 9. Criterios de aceite (epic completa)

### Acesso publico
- [ ] CV abre ou baixa em guia anonima (Chrome)
- [ ] CV abre ou baixa em guia anonima (Firefox)
- [ ] CV funciona logado **sem** conta GitHub com acesso a PERSONAL-CVs

### UI
- [ ] Navbar: link CV funcional (desktop + mobile)
- [ ] Hero: CTA "Baixar CV" funcional
- [ ] About: botao CV funcional
- [ ] Recrutador: ambos CTAs CV funcionais
- [ ] Nenhuma regressao visual ou de copy i18n

### Tecnico
- [ ] `CV_URL` nao aponta para raw de repo privado (opcoes A/B) ou repo esta publico (opcao C)
- [ ] `curl -I .../cv.pdf` retorna 200 + `application/pdf` (opcoes A/B)
- [ ] `yarn build` e `yarn lint` sem erros
- [ ] `yarn test:e2e` passa incluindo assert HTTP 200

### Documentacao
- [ ] `docs/context.md` reflete nova origem do CV
- [ ] Decisao v2 #2 documentada como superseded (repo privado)

### Modo recrutador
- [ ] Print preview nao depende de URL GitHub autenticada

---

## 10. Riscos e mitigacoes

| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| PDF desatualizado (opcao A) | Recrutador ve CV antigo | Checklist no README; lembrete ao editar PERSONAL-CVs |
| Secret vazado no CI (opcao B) | Acesso ao repo privado | Secret only no Actions; token read-only; rotacionar se exposto |
| Atributo `download` ignorado cross-origin (opcao C) | Browser abre aba em vez de baixar | Aceitavel; ou migrar para opcao A |
| PDF grande no repo | Clone lento | ~200 KB tipico; Git LFS se >2 MB |
| Workflow sync falha silenciosamente (opcao B) | Deploy com PDF antigo ou ausente | Validar mime-type; falhar build se ausente |
| Cache CDN Vercel serve PDF antigo | Visitante ve versao desatualizada | Redeploy apos update; header Cache-Control curto (evolucao futura) |

---

## 11. Evolucao futura (pos-v3.2)

- Script local `yarn sync:cv` — opcao B simplificada sem Action (baixa PDF com token local)
- Versionamento de filename: `cv-2026-06.pdf` + redirect ou constante datada
- Header `Cache-Control` configuravel para `/cv.pdf`
- Easter egg "CV rapido" — 3 cliques no link CV (`analise-sugestoes-v2.9.md`)
- Analytics: evento clique CV via `@vieira/analytics`
- CV em ingles separado (`cv-en.pdf`) com toggle i18n
- QR code no modo recrutador print apontando para `/cv.pdf`

---

## 12. Anexo

### A. Evidencia do bug

**URL atual (requer auth):**

```
https://github.com/RafaelHDSV/PERSONAL-CVs/raw/main/Curr%C3%ADculo.pdf
```

**Reproducao:**

1. Abrir portifolio em guia anonima
2. Clicar "Baixar CV" no hero ou "CV" na navbar
3. Resultado: pagina 404 do GitHub

### B. Decisao v2 superseded

Fonte: [`docs/especificacao-v2-refino-ui-ux.md`](./especificacao-v2-refino-ui-ux.md), secao 2 #2:

> CV — URL fixa do repo PERSONAL-CVs — arquivo Curriculo.pdf via raw GitHub (sempre atualizado)

**Motivo da revogacao:** premissa "sempre atualizado via raw" falha quando o repo e privado; visitantes publicos nao autenticados recebem 404.

### C. Diff conceitual v2 → v3.2

| v2 (decisao #2) | v3.2 |
|-----------------|------|
| CV remoto raw GitHub | CV publico same-origin ou repo publico |
| Sem `public/cv.pdf` | `public/cv.pdf` (A/B) ou repo publico (C) |
| Atualizacao automatica via push no PERSONAL-CVs | Automatica (B/C) ou manual (A) |
| Funciona so com sessao GitHub autorizada | Funciona para qualquer visitante |

### D. Referencias

- Deploy: https://rafaelhdsv.vercel.app
- Repo fonte (privado): https://github.com/RafaelHDSV/PERSONAL-CVs
- Epic v2 UI/UX: [`docs/especificacao-v2-refino-ui-ux.md`](./especificacao-v2-refino-ui-ux.md)
- Contexto atual: [`docs/context.md`](./context.md)

---

*Documento vivo — atualizar apos escolha da estrategia (decisao pendente #1) e conclusao da implementacao v3.2.*
