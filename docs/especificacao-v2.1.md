```
Titulo: Portifolio v2.1 — Correcoes pos-feedback, GitHub dinamico e polish
Repositorio: RafaelHDSV/portifolio
Labels: epic
Project: Vieira (https://github.com/users/RafaelHDSV/projects/8)
```

---

# Especificacao de Desenvolvimento — Portifolio v2.1 (Correcoes pos-feedback)

> Terceira iteracao pos-v2: corrigir tema claro, i18n residual, listagem real de projetos GitHub (pins dinamicos, recentes incluindo privados, midia do README), stacks alinhadas ao CV e DX (docs EmailJS, catalogo de eggs em dev).

**Versao:** 2.1  
**Data:** 24/05/2026  
**Repositorio:** `RafaelHDSV/portifolio`  
**Uso:** Epic para colar no GitHub Project Vieira; implementacao via `ai-development-workflow.mdc`  
**Referencias:** [`docs/current-task.md`](./current-task.md) · [`docs/especificacao-v2-refino-ui-ux.md`](./especificacao-v2-refino-ui-ux.md) · [`docs/context.md`](./context.md) · deploy `https://rafaelhdsv.vercel.app` · CV [`PERSONAL-CVs`](https://github.com/RafaelHDSV/PERSONAL-CVs) · profile [`RafaelHDSV/README.md`](https://github.com/RafaelHDSV/RafaelHDSV)

---

## 1. Resumo executivo

A v2 entregou identidade Full-Stack, grade unica de projetos e modal de contato. O uso real revelou **lacunas de produto e dados**: tema claro excessivamente branco, labels de UI ainda em ingles, stacks incompletas (faltam PHP e C#), subtitulo de projetos desatualizado, **pins incorretos ou estaticos**, listagem incompleta (nao chega a 10 recentes apos pins), forks e profile README aparecendo como projetos, resolucao de imagens falha (ex.: `Gericht-Restaurant`), sem suporte a GIF/video do README (ex.: `Repo-Workspace`), placeholder instrucional demais, copy "Easteregg" junto, ausencia de doc EmailJS e falta de ferramenta de debug para eggs em dev.

| Area | Mudanca principal |
|------|-------------------|
| Tema claro | Superficies menos brancas; contraste e hierarquia revisados |
| i18n | Stack / Dark / Light / copy de eggs traduzidos |
| Stack | Incluir **PHP** e **C#** (alinhado ao CV) |
| Projects — copy | Subtitulo: **somente "Trabalhos recentes"** |
| Projects — dados | Pins **100% dinamicos** via GraphQL; 10 recentes via API autenticada |
| Projects — filtros | Excluir **forks**, **profile README** (`RafaelHDSV/RafaelHDSV`) |
| Projects — midia | Resolver PNG/GIF/video do README + config local |
| Cards | Placeholder **generico** (sem texto "adicionar screenshot") |
| Footer | **"Easter egg"** separado; modal catalogo **somente em dev** |
| Docs | `docs/emailjs-setup.md` |
| SEO | **hreflang** PT/EN sem dominio custom |
| Analise | Doc explicando OG auto, E2E Playwright, modo recrutador |
| Stretch | Secao **LinkedIn posts** (ultimos posts, embed simples) |

**Principios**

- Dados do GitHub sao fonte de verdade para pins e recentes; config local so enriquece (imagem, descricao, ocultar).
- Privacidade respeitada: repos privados aparecem no portfolio **sem expor codigo** — apenas metadados permitidos pela API autenticada.
- Midia do card prioriza qualidade: imagem estatica > GIF > poster de video; autoplay muted apenas se performance permitir.
- i18n completo: nenhum label de UI hardcoded em ingles fora de nomes proprios de tecnologia quando convencao global (ex.: "React" permanece).
- Dev ergonomics: catalogo de eggs acelera manutencao; nunca visivel em producao.

---

## 2. Decisoes registradas

| # | Tema | Decisao |
|---|------|---------|
| 1 | Tema claro | Revisar tokens light (`--color-bg`, `--color-surface`, `--color-surface-elevated`, `--navbar-color`) — **menos branco puro**, mais contraste sutil |
| 2 | i18n UI | Traduzir **Stack** (nav + secao), labels **Dark/Light** no toggle, copy **Easter egg** no footer |
| 3 | Stacks | Adicionar **PHP** e **C#** na grade (`Languages.tsx`) conforme CV |
| 4 | Subtitulo Projects | Trocar "Pins e trabalhos recentes do GitHub" por **"Trabalhos recentes"** (PT) / **"Recent work"** (EN) |
| 5 | Pins | **Dinamicos** via GraphQL `pinnedItems`; refletir mudancas no perfil GitHub sem deploy |
| 6 | Recentes | **10 repos mais recentes** (por `updated_at`), deduplicados dos pins |
| 7 | Repos privados | **Incluir** na listagem quando token autenticado permitir (projetos LinkedIn privados) |
| 8 | Forks | **Excluir** repos com `fork: true` (ex.: `serveruler-client`) |
| 9 | Profile README | **Excluir** repo especial `RafaelHDSV/RafaelHDSV` (e equivalente por convencao GitHub) |
| 10 | Midia cards | Buscar em ordem: `projects.config` → assets do repo → **primeira midia do README** (png/jpg/gif/webp/mp4/webm) |
| 11 | Placeholder | Substituir texto instrucional por **placeholder visual generico** (icone + fundo neutro) |
| 12 | Easter egg copy | PT: **"Easter egg: X/Y descobertos"** (palavras separadas); EN equivalente |
| 13 | EmailJS | Criar **`docs/emailjs-setup.md`** com passo a passo de configuracao |
| 14 | Dev eggs | Clique no contador do footer abre **modal catalogo** apenas se `import.meta.env.DEV === true` |
| 15 | hreflang | Implementar **`link rel="alternate" hreflang`** PT-BR e EN na SPA (sem dominio custom) |
| 16 | Dominio custom | **Fora do escopo** (custo) |
| 17 | OG auto / E2E / Recrutador | **Documentar** em analise — nao implementar nesta versao |
| 18 | LinkedIn posts | **Automatico** via API serverless + RSS/API LinkedIn (ver `docs/linkedin-setup.md`) |
| 19 | Video no card | **Thumbnail + play ao clicar** (sem autoplay) |
| 20 | Repos privados | **Exibir por padrao**; ocultar via `hidden: true` em `projects.config.ts` quando necessario |

**Decisoes resolvidas (mai/2026)**

1. **LinkedIn:** posts automaticos — configurar `LINKEDIN_RSS_URL` (recomendado) ou API LinkedIn uma vez; novos posts aparecem sem editar codigo.
2. **Video no card:** somente thumbnail; clique inicia reproducao com controles.
3. **Repos privados:** exibir por padrao; autor avisa quando ocultar (`hidden: true` no config).

---

## 3. Visao do produto

### 3.1 Problema

O portfolio v2 transmite identidade Full-Stack, mas o feedback pos-deploy aponta **inconsistencias visuais e de dados**:

- Tema claro cansativo ("MUITO branco").
- Palavras **Stack**, **Dark**, **Light** fixas em ingles.
- Grade de stack incompleta vs CV (PHP, C#).
- Secao Projects promete pins + recentes, mas **pins estao errados**, **nao completa 10 recentes**, exibe **fork** e possivelmente o **README do perfil** como projeto.
- Resolver de imagens nao encontra assets reais (`Gericht-Restaurant`); nao le midia em README (`Repo-Workspace` video).
- Placeholder com texto longo parece erro de producao.
- Footer com "Easteregg" junto; falta doc EmailJS; debug de eggs manual.

### 3.2 Solucao

1. Refinar tokens do tema claro e validar contraste WCAG AA nos componentes principais.
2. Completar i18n residual (nav stack, toggle tema, footer eggs).
3. Expandir stack com PHP e C#.
4. Reescrever pipeline de projetos GitHub: pins GraphQL confiaveis, recentes autenticados, filtros fork/README, merge deduplicado.
5. Implementar `resolveRepoMedia()` com parse de README (REST `contents` ou raw) suportando img/gif/video.
6. Placeholder generico nos cards; copy de eggs corrigida.
7. Documentar EmailJS; modal catalogo de eggs em dev.
8. Adicionar hreflang; doc de analise para backlog v3; secao LinkedIn (stretch).

### 3.3 Fora do escopo

- Dominio custom e custos associados
- OG image gerada automaticamente (so explicacao)
- Testes E2E Playwright (so explicacao)
- Modo recrutador PDF one-pager (so explicacao)
- Backend proprio para contato ou LinkedIn
- Migracao de stack (React + Vite + SASS permanece)

---

## 4. Arquitetura

### 4.1 Arvore de diretorios impactados

```
src/
├── components/
│   ├── Card/                  # Placeholder generico; suporte video/gif
│   ├── SwitchTheme/           # Labels i18n Dark/Light
│   └── Modal/                 # Reutilizar para catalogo eggs (dev)
├── screens/
│   ├── Languages/             # + PHP, C#
│   ├── Projects/              # Subtitulo; loading/error
│   └── Footer/                # Copy eggs; click -> modal dev
├── hooks/
│   ├── useGitHubProjects.ts   # Pipeline pins + recent + filtros
│   └── useEasterEgg.ts        # Expor lista para catalogo dev
├── repository/
│   └── GithubRepository.ts    # GraphQL pins; REST recent autenticado; README fetch
├── utils/
│   ├── mergeProjects.ts       # Excluir fork, profile README; dedupe
│   ├── projectImages.ts       # -> resolveRepoMedia.ts (expandir)
│   └── readmeMedia.ts         # NOVO — parse README midia
├── constants/
│   └── projects.config.ts     # Overrides; hidden; fork blacklist
├── locales/
│   ├── pt.json                # stack, theme labels, projects subtitle, footer
│   └── en.json
├── styles/
│   └── _variables.scss        # Tokens light refinados
└── i18n/index.ts              # hreflang helper (opcional)

docs/
├── emailjs-setup.md           # NOVO
├── analise-evolucao-v3.md     # NOVO — OG, E2E, recrutador
└── context.md                 # Atualizar pos-v2.1

index.html                     # hreflang links (ou injetados via main.tsx)
```

### 4.2 Stack (sem mudanca)

| Camada | Tecnologia |
|--------|------------|
| UI | React 18, TypeScript, SASS modules |
| Build | Vite 7 |
| i18n | i18next |
| API | GitHub REST + GraphQL (token `VITE_GITHUB_ACCESS_TOKEN`) |
| Contato | EmailJS |
| Deploy | Vercel |

### 4.3 Fluxo — listagem de projetos

```
useGitHubProjects()
    │
    ├─► getPinnedRepos(username)     GraphQL pinnedItems (6)
    │
    └─► getRecentReposAuth(limit=10) REST /user/repos?sort=updated
              │
              ▼
        filterRepos()
              • fork === false
              • name !== username (profile README)
              • not in projects.config hidden list
              │
              ▼
        mergeGitHubProjects(pinned, recent, locale)
              │
              ▼
        for each repo → resolveRepoMedia(repo)
              1. projects.config.image
              2. opengraph / social preview (opcional)
              3. README: first img | gif | video src
              4. fallback: generic placeholder (pending: false)
```

### 4.4 Fluxo — midia do README

```
GET /repos/{owner}/{repo}/readme (Accept: application/vnd.github.raw)
    │
    ▼
parseReadmeMedia(markdown + html)
    • regex markdown ![...](url)
    • regex html <img src="">
    • regex html5 <video><source src="">
    • resolver URLs relativas → raw.githubusercontent.com
    │
    ▼
{ type: 'image'|'gif'|'video', url, poster? }
```

---

## 5. Especificacao detalhada

### 5.1 Tema claro — tokens e superficies

**Objetivo:** Reduzir sensacao de "tela branca" mantendo light mode profissional.

**Alteracoes em `_variables.scss` (`:root`, nao `.dark`):**

| Token | Atual (aprox.) | Proposta |
|-------|----------------|----------|
| `--color-bg` | `#f4f4f5` | `#ececee` ou `#e8e8ec` (cinza quente) |
| `--color-surface` | `#e4e4e7` | `#dfe0e4` |
| `--color-surface-elevated` | `#ffffff` | `#f5f5f7` (off-white) |
| `--navbar-color` | `rgba(255,255,255,0.85)` | `rgba(245,245,247,0.9)` |
| `--color-border` | preto 8% | preto 10–12% (mais definicao) |

**Regras:**

- Validar cards, navbar, modal e formulario em light mode.
- Hero mesh light: reduzir opacidade se competir com texto.
- Nao alterar tokens dark (salvo regressao).

**Criterio de aceite:**

- [ ] Light mode sem `#ffffff` dominante em >50% da viewport na home
- [ ] Contraste texto primario vs `--color-bg` >= 4.5:1
- [ ] Toggle dark/light sem regressao visual

---

### 5.2 i18n residual — Stack, tema e footer

**Objetivo:** Eliminar strings de UI hardcoded em ingles.

| Chave | PT | EN |
|-------|----|----|
| `nav.stack` | Pilha / Stack tecnica | Tech stack |
| `stack.title` | Pilha tecnica | Tech stack |
| `theme.labelDark` | Escuro | Dark |
| `theme.labelLight` | Claro | Light |
| `footer.eggCounter` | Easter egg: {{count}}/{{total}} descobertos | Easter egg: {{count}}/{{total}} discovered |

**Arquivos:** `SwitchTheme.tsx` (remover `'Dark'`/`'Light'` literais), `locales/*.json`, `Footer.tsx`.

**Criterio de aceite:**

- [ ] Com locale PT, navbar e secao nao exibem "Stack" sozinho se traduzido
- [ ] Toggle tema mostra "Escuro"/"Claro" em PT
- [ ] Footer usa "Easter egg" (duas palavras) em ambos idiomas

---

### 5.3 Secao Stack — PHP e C#

**Objetivo:** Alinhar grade ao CV (React, TS, Node, MongoDB, **C#**, **PHP**).

**Implementacao:**

- Adicionar em `Languages.tsx`: `FaPhp` ou `SiPhp`, `SiCsharp` (react-icons).
- Ordem sugerida: agrupar com linguagens backend (Node, MongoDB, PHP, C#).
- i18n: nomes proprios permanecem; titulo da secao traduzido (5.2).

**Criterio de aceite:**

- [ ] PHP e C# visiveis na grade desktop e mobile
- [ ] Hover e acessibilidade iguais aos demais itens

---

### 5.4 Projects — copy, filtros e listagem

**Objetivo:** Subtitulo correto; listagem fiel ao GitHub do autor.

**Copy i18n:**

```json
"projects": {
  "subtitle": "Trabalhos recentes do GitHub"
}
```

(en: `"Recent work from GitHub"` ou `"Recent projects"`)

**Filtros em `mergeProjects.ts` / `GithubRepository.ts`:**

| Regra | Implementacao |
|-------|---------------|
| Excluir fork | `repo.fork === true` → skip |
| Excluir profile README | `repo.name.toLowerCase() === username.toLowerCase()` |
| Blacklist manual | `projects.config.ts` → `hidden: true` ou `exclude: true` |
| Recentes | `getRecentRepos` via **`/user/repos`** autenticado (nao `/users/{u}/repos` publico) |
| Limite | `per_page=10`, `sort=updated` |
| Dedupe | Pins primeiro; recentes preenchem ate 10 **adicionais** unicos |

**Tipo `IGithubResponseRepo`:** garantir campo `fork?: boolean` mapeado na resposta REST.

**Criterio de aceite:**

- [ ] Subtitulo sem mencao a "Pins"
- [ ] `serveruler-client` (fork) nao aparece
- [ ] `RafaelHDSV/RafaelHDSV` nao aparece
- [ ] Apos 6 pins, listagem mostra ate **10 repos recentes adicionais** (total ate 16)
- [ ] Repos privados visiveis quando token tem escopo `repo`

---

### 5.5 Projects — pins dinamicos (GraphQL)

**Objetivo:** Pins refletem exatamente o perfil GitHub (MedIT, TechMoto, ThreeJs-Tshirt, Deprecated-Finder, GitHub-Label-Sync, Repo-Workspace).

**Diagnostico provavel v2:**

- GraphQL falha silenciosa (`catch → []`)
- Parse de `id` numerico fragil
- Token sem escopo `read:user` ou query incorreta

**Query (manter/ajustar):**

```graphql
query($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          homepageUrl
          url
          updatedAt
          isFork
          primaryLanguage { name }
          repositoryTopics(first: 10) { nodes { topic { name } } }
        }
      }
    }
  }
}
```

**Regras:**

- Filtrar `isFork === true` mesmo em pins.
- Log de erro em dev se pins vazio e API retornou erro (nao silenciar totalmente).
- Usar `GITHUB_USERNAME` de `constants/cv.ts`.

**Criterio de aceite:**

- [ ] 6 pins correspondem ao perfil GitHub atual
- [ ] Alterar pin no GitHub reflete apos refresh (sem alterar codigo)
- [ ] Badge "Pin" nos cards pinados

---

### 5.6 Projects — resolucao de midia (`resolveRepoMedia`)

**Objetivo:** Exibir imagem/GIF/video quando existir no repo ou README.

**Ordem de resolucao:**

1. `projects.config.ts` → `image` explicita
2. Fetch README raw → parse primeira midia valida
3. Heuristicas opcionais: `/preview.png`, `/demo.gif`, `/assets/cover.jpg` (HEAD request)
4. Fallback: placeholder generico (5.7)

**Casos de teste obrigatorios:**

| Repo | Expectativa |
|------|-------------|
| `Gericht-Restaurant` | Imagem encontrada (config ou README/assets) |
| `Repo-Workspace` | Video ou GIF do README |
| Repo sem midia | Placeholder generico |

**Suporte video no Card:**

- `<video muted loop playsInline poster={...}>` ou thumbnail + icone
- Lazy load; respeitar `prefers-reduced-motion` (nao autoplay)

**Cache:**

- Memoria por sessao ou `sessionStorage` para URLs README (evitar N+1).

**Criterio de aceite:**

- [ ] Gericht-Restaurant exibe midia real
- [ ] Repo-Workspace exibe preview video ou GIF
- [ ] URLs relativas no README resolvem para raw GitHub

---

### 5.7 Card — placeholder generico

**Objetivo:** Remover texto "Imagem pendente — adicionar screenshot deste projeto".

**Design:**

- Fundo `--color-surface-elevated` com pattern sutil ou icone `Image` / monograma repo
- **Sem copy instrucional**; opcional `aria-label` acessivel i18n curto ("Sem preview")
- Prop `imagePending` renomeada semanticamente para `usesPlaceholder` ou mantida com comportamento visual only

**Criterio de aceite:**

- [ ] Nenhum card exibe paragrafo longo de placeholder
- [ ] Layout 16:9 preservado

---

### 5.8 Footer — copy e modal catalogo (dev)

**Copy:** ver 5.2.

**Modal catalogo (DEV only):**

- Gatilho: clique no contador `Easter egg: X/Y`
- Condicao: `import.meta.env.DEV`
- Conteudo: tabela/lista com colunas — ID, nome, gatilho, resultado, status (desbloqueado/sim)
- Fonte: array derivado de `useEasterEgg.types.ts` + metadados i18n (`easterEgg.catalog.*`)
- Producao: contador nao abre modal (cursor default; sem hint de clique)

**Criterio de aceite:**

- [ ] `yarn dev` → clique abre modal com 7 eggs documentados
- [ ] Build producao → clique nao faz nada / sem modal no bundle exposto

---

### 5.9 Documentacao — EmailJS

**Arquivo:** `docs/emailjs-setup.md`

**Conteudo minimo:**

1. Criar conta EmailJS
2. Criar Service (Gmail ou SMTP)
3. Criar Template com variaveis `from_name`, `email`, `message`
4. Copiar Public Key, Service ID, Template ID
5. Preencher `.env` a partir de `.env.example`
6. Configurar mesmas vars na Vercel
7. Testar envio local e producao
8. Troubleshooting (CORS, quota, template invalido)

**Criterio de aceite:**

- [ ] Doc segue passo a passo executavel por nao-dev
- [ ] Link no README ou `docs/context.md`

---

### 5.10 SEO — hreflang (sem dominio custom)

**Objetivo:** Indicar alternates PT-BR e EN para crawlers.

**Implementacao sugerida:**

- Em `index.html` ou efeito em `main.tsx` ao trocar locale:

```html
<link rel="alternate" hreflang="pt-BR" href="https://rafaelhdsv.vercel.app/?lang=pt" />
<link rel="alternate" hreflang="en" href="https://rafaelhdsv.vercel.app/?lang=en" />
<link rel="alternate" hreflang="x-default" href="https://rafaelhdsv.vercel.app/" />
```

- Ler `?lang=` na inicializacao i18n (opcional, se ainda nao existir) **sem** quebrar `localStorage.locale`.

**Criterio de aceite:**

- [ ] Tags hreflang presentes no DOM
- [ ] Funciona em `*.vercel.app` (nao depende dominio custom)

---

### 5.11 Secao LinkedIn — ultimos posts (stretch)

**Objetivo:** Exibir posts recentes sem forcar visita ao LinkedIn.

**Opcoes (decisao pendente #1):**

| Abordagem | Pros | Contras |
|-----------|------|---------|
| A. Curadoria JSON local | Simples, zero API | Atualizacao manual |
| B. Embed iframe oficial | Visual nativo | LinkedIn limita embed; responsivo dificil |
| C. RSS/third-party | Automatizado | Fragil, ToS |

**Recomendacao epic:** Fase 4 com **Opcao A** (JSON `constants/linkedinPosts.ts` com 3–5 posts: titulo, data, url, resumo) + link "Ver no LinkedIn". Migrar para API/embed quando decisao madura.

**UI:** Secao entre Contact e Footer ou bloco no Footer; cards horizontais scroll ou lista vertical simples.

**Criterio de aceite (se fase executada):**

- [ ] 3+ posts visiveis com link externo
- [ ] i18n para titulo da secao
- [ ] Responsivo mobile

---

### 5.12 Documento de analise — evolucao v3

**Arquivo:** `docs/analise-evolucao-v3.md`

**Secoes obrigatorias (explicar em linguagem acessivel):**

1. **OG image gerada automaticamente** — o que e; ferramentas (Vercel OG, Satori, Puppeteer); beneficio SEO/redes; esforco estimado
2. **Testes E2E Playwright** — o que cobre vs unitario; fluxo critico do portfolio; CI; esforco
3. **Modo recrutador (PDF one-pager)** — conteudo (bio, stack, 3 projetos, contato); geracao estatica vs print CSS; esforco

**Criterio de aceite:**

- [ ] Doc criado e linkado em `docs/context.md` secao evolucao

---

## 6. Mecanismos compartilhados

**GitHub token**

- Variavel: `VITE_GITHUB_ACCESS_TOKEN`
- Escopos minimos v2.1: `repo` (privados), `read:user` (GraphQL pins)
- Rate limit: cache de README por sessao; paralelismo max 5 fetches

**i18n**

- Chaves novas em `pt.json` / `en.json`; nunca string literal de UI em componentes

**Feature flags**

- Catalogo eggs: `import.meta.env.DEV`
- LinkedIn section: constante `ENABLE_LINKEDIN_SECTION` ate estabilizar

**Nao se aplica:** engine de templates Vieira CLI.

---

## 7. Instalacao e distribuicao

Sem mudanca no fluxo de deploy.

```bash
cp .env.example .env
# Preencher VITE_GITHUB_ACCESS_TOKEN com escopo repo
yarn && yarn dev
```

**Vercel:** atualizar env vars; redeploy apos merge.

**Validacao pos-deploy:**

- Pins corretos em producao
- Repo privado aparece (se configurado)
- hreflang no view-source

---

## 8. Roadmap de implementacao

| Fase | Escopo | Estimativa |
|------|--------|------------|
| **1 — Polish visual** | Tema claro, i18n, stack PHP/C#, copy projects/footer | 1–2 dias |
| **2 — GitHub pipeline** | Pins GraphQL fix, recent autenticado, filtros fork/README | 2–3 dias |
| **3 — Midia cards** | readmeMedia, Gericht + Repo-Workspace, placeholder generico | 2–3 dias |
| **4 — DX e docs** | emailjs-setup.md, modal eggs dev, hreflang, analise-v3 | 1–2 dias |
| **5 — Stretch** | Secao LinkedIn (curadoria JSON) | 1–2 dias |

**Total estimado:** 7–12 dias (1 dev), fase 5 opcional.

---

## 9. Criterios de aceite (epic completa)

### Visual e i18n
- [ ] Tema claro revisado e aprovado visualmente
- [ ] Stack / Dark / Light / Easter egg traduzidos
- [ ] PHP e C# na grade

### Projects
- [ ] Subtitulo "Trabalhos recentes" (sem "Pins")
- [ ] 6 pins dinamicos corretos
- [ ] Ate 10 recentes adicionais; forks excluidos; profile README excluido
- [ ] Privados listados com token valido
- [ ] Midia README funcionando (Gericht, Repo-Workspace)
- [ ] Placeholder generico sem texto longo

### Footer e dev
- [ ] Copy "Easter egg" separado
- [ ] Modal catalogo eggs somente em `yarn dev`

### Docs e SEO
- [ ] `docs/emailjs-setup.md` completo
- [ ] `docs/analise-evolucao-v3.md` com OG, E2E, recrutador explicados
- [ ] hreflang PT-BR / EN / x-default

### Geral
- [ ] `yarn build` e `yarn lint` sem erros
- [ ] `docs/context.md` atualizado pos-v2.1

### Stretch
- [ ] Secao LinkedIn com posts curados (se fase 5 executada)

---

## 10. Riscos e mitigacoes

| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| Token GitHub sem escopo `repo` | Privados nao aparecem | Documentar escopos; fallback graceful |
| Rate limit ao parsear READMEs | Cards lentos | Cache sessionStorage; limitar fetch paralelo |
| GraphQL pins continua falhando | Pins vazios | Log dev; fallback ultimos 6 nao-fork mais estrelados |
| Video no card pesa LCP | Performance | Lazy load; poster estatico; muted only |
| hreflang + SPA locale | Crawlers confusos | URLs `?lang=` estaveis + canonical |
| LinkedIn ToS embed | Secao quebrada | Curadoria JSON manual na v2.1 |
| README com midia relativa quebrada | Placeholder | Resolver base raw branch default |

---

## 11. Evolucao futura (pos-v2.1)

- **Dominio custom** — quando houver budget; hreflang ja preparado
- **OG image automatica** — ver `docs/analise-evolucao-v3.md`
- **E2E Playwright** — ver analise; CI GitHub Actions
- **Modo recrutador PDF** — ver analise
- **LinkedIn API/embed completo** — apos validar secao curada
- **Filtros stack PHP/C#/MongoDB** — estender `PROJECT_FILTER_OPTIONS`
- **Cache ISR projetos** — edge function para reduzir calls GitHub

**Decisao pendente #1:** LinkedIn — JSON manual vs embed (recomendado: manual v2.1)  
**Decisao pendente #2:** Video card — autoplay muted vs thumbnail  
**Decisao pendente #3:** Card de repo privado sem preview — mostrar ou ocultar

---

## 12. Anexo — diff vs v2

| Item v2 | v2.1 |
|---------|------|
| Light mode `#ffffff` dominante | Superficies off-white/cinza |
| "Stack" / "Dark" / "Light" fixos EN | i18n completo |
| 14 stacks | + PHP, C# |
| Subtitle pins + recentes | So "Trabalhos recentes" |
| `resolveProjectImage` config-only | + README img/gif/video |
| Placeholder instrucional | Generico visual |
| "Easteregg" junto | "Easter egg" |
| Pins GraphQL silencioso | Fix + filtros fork |
| `/users/{u}/repos` publico | `/user/repos` autenticado + privados |
| Sem doc EmailJS | `docs/emailjs-setup.md` |
| Sem debug eggs | Modal dev |
| Sem hreflang | hreflang PT/EN |
| Secao 11 v2 backlog | Analise doc + LinkedIn stretch |

### Pins esperados (referencia maio/2026)

Conforme perfil GitHub do autor:

1. MedIT  
2. TechMoto  
3. ThreeJs-Tshirt  
4. Deprecated-Finder  
5. GitHub-Label-Sync  
6. Repo-Workspace  

---

*Documento vivo — atualizar apos aprovacao da epic e ao concluir cada fase.*

---

Colar a secao **B** acima no corpo da issue no repositorio `RafaelHDSV/portifolio`, label **`epic`**, e adicionar ao [Project Vieira](https://github.com/users/RafaelHDSV/projects/8).

**Duvidas em aberto**

1. **LinkedIn:** curadoria manual em JSON, embed oficial ou integracao API?
2. **Video no card:** autoplay muted em loop ou thumbnail estatica com play?
3. **Repo privado sem preview:** exibir card minimal ou ocultar da grade?

Para implementar um incremento desta epic, use `ai-development-workflow.mdc` e gere `.issues/` — nao implemente codigo neste fluxo.