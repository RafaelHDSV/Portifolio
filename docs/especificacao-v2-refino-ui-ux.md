# Especificacao de Desenvolvimento — Portifolio v2 (Refino UI/UX e conteudo)

> Segunda iteracao pos-lancamento v1.1: polimento visual, identidade Full-Stack, projetos dinamicos (pins + recentes), contato com modal e easter eggs revisados.

**Versao:** 2.0  
**Data:** 24/05/2026  
**Repositorio:** `RafaelHDSV/portifolio`  
**Origem:** [`docs/current-task.md`](./current-task.md)  
**Referencias:** [`docs/especificacao.md`](./especificacao.md) v1.1 · [`docs/context.md`](./context.md) · deploy `https://rafaelhdsv.vercel.app`

---

## 1. Resumo executivo

O portifolio v1.1 entregou fundacao tecnica solida (design tokens, i18n, GitHub API, EmailJS, easter eggs). A v2 foca em **refino de produto**: identidade **Full-Stack**, hero mais limpo, secoes visualmente envolventes, grade unificada de projetos com pins e recentes do GitHub, filtros agregados, contato com cards hover + formulario em modal, e correcoes de inconsistencias (tema Konami, stack slider, footer, easter eggs obsoletos).

| Area | Mudanca principal |
|------|-------------------|
| Identidade | Front-End → **Full-Stack** (textos, meta, bio, i18n) |
| Hero | So typewriter; 1–2 CTAs; fundo moderno; `::selection` estilizado |
| About | Info alinhada ao DS; layout 1 ou 2 colunas; CV remoto |
| Stack | Corrigir slider ou nova secao; icones maiores |
| Projects | Pins + 10 recentes; grade unica 3 colunas; filtros multi |
| Contact | Cards hover (legado); form em modal |
| Footer / eggs | Texto "Easteregg a: X/6"; Konami 100% roxo; remover egg portfolio |

**Principios**

- Clareza antes de ornamentacao — cada secao responde a uma pergunta do visitante.
- Coerencia de marca via tokens existentes; liberdade para ajustar fontes/cores se documentado.
- Motion com proposito; respeitar `prefers-reduced-motion`.
- Mobile-first; grade de projetos **3 colunas** em desktop (1 em mobile, 2 em tablet).
- Easter eggs opcionais e profissionais — nunca bloqueiam conteudo nem SEO.

---

## 2. Decisoes registradas

| # | Tema | Decisao |
|---|------|---------|
| 1 | Papel profissional | **Full-Stack Developer** em hero, about, footer, meta tags e i18n |
| 2 | CV | URL fixa do repo [`PERSONAL-CVs`](https://github.com/RafaelHDSV/PERSONAL-CVs) — arquivo `Curriculo.pdf` via raw GitHub (sempre atualizado) |
| 3 | Hero CTAs | **1 ou 2** botoes no maximo (ex.: Ver projetos + Baixar CV); remover GitHub como CTA solto no hero |
| 4 | Typewriter | **Unica** linha dinamica de papel/stack; remover texto estatico duplicado acima |
| 5 | Easter egg portfolio | **Remover** (palavra + overlay astronauta / `DevelopmentScreen` como egg) |
| 6 | Tag "Aberto a oportunidades" | **Remover** do About |
| 7 | Texto contato footer | **Remover** "Aberto a oportunidades e projetos freelance" |
| 8 | Projetos — layout | **Grade unica**; sem secao "Destaques" separada |
| 9 | Projetos — fonte | **Pins do GitHub** + **10 repos mais recentes** (deduplicados) |
| 10 | Filtros | **Agregados (AND)** — multi-selecao React + API mostra projetos com ambas stacks |
| 11 | Grade colunas | **3 colunas** fixas em desktop independente da quantidade filtrada |
| 12 | Imagens de projetos | Buscar no repo (README assets, `/public`, screenshots); fallback placeholder + lista de pendentes |
| 13 | Contato | Cards hover (4 canais) + **formulario em modal** sob demanda |
| 14 | Footer | Texto **"Easteregg a: X/6 descobertos"**; remover link "Voltar ao topo"; layout menos centralizado |
| 15 | Switch tema | Visual alinhado ao **toggle de idioma** (Navbar) |
| 16 | Konami accent | Todas as variaveis de cor accent devem mudar para roxo durante o egg |

**Decisao pendente #1:** Logo nova — SVG tipografico "RV", monograma ou asset externo? (ver secao 11)

**Decisao pendente #2:** CTAs finais do hero — par Ver projetos + Baixar CV ou apenas um? (ver secao 11)

---

## 3. Visao do produto

### 3.1 Problema

A v1.1 funciona, mas a experiencia ainda parece **fragmentada**: hero repetitivo, too many CTAs, secao de projetos com bloco de destaques desconectado, slider de stack com faixas vazias, filtros exclusivos que quebram o grid, formulario de contato sempre visivel e fora do DS, footer estreito, easter eggs inconsistentes (portfolio obsoleto, Konami parcial, explorador simples).

### 3.2 Solucao

1. Revisar identidade visual e micro-interacoes em todas as secoes.
2. Simplificar hero e alinhar narrativa Full-Stack ao CV remoto.
3. Reescrever Projects com pins + recentes, grade unica e filtros multi.
4. Restaurar UX de contato com hover cards + modal EmailJS.
5. Polir footer, contador de eggs e corrigir tema Konami.
6. Remover eggs e textos obsoletos; enriquecer egg Explorador (opcional).

### 3.3 Fora do escopo

- Dominio custom (permanece `*.vercel.app`)
- Backend proprio para contato (EmailJS permanece)
- Blog ou rotas adicionais
- Reescrever i18n para mais idiomas
- Migrar stack (permanece React + Vite + SASS)

---

## 4. Arquitetura

### 4.1 Arvore de diretorios impactados

```
src/
├── components/
│   ├── SwitchTheme/           # Redesign (paridade com locale toggle)
│   ├── Navbar/                # Logo; possivel botao "Contato" -> modal
│   ├── Card/                  # Links demo/GitHub; estado pinned
│   ├── ContactForm/           # Usado dentro de Modal
│   ├── Modal/                 # NOVO — formulario de contato
│   └── Button/
├── screens/
│   ├── Header/                # Hero simplificado; selection CSS
│   ├── About/                 # Layout info; remover highlight open
│   ├── Languages/             # Stack refeito ou slider corrigido
│   ├── Projects/              # Grade unica; filtros multi; pins API
│   ├── Contact/               # Cards hover; trigger modal
│   ├── Footer/                # Layout full-width; texto eggs
│   └── DevelopmentScreen/     # REMOVER ou arquivar (egg removido)
├── hooks/
│   ├── useGetRepos.ts         # Estender ou useGetPinnedRepos
│   ├── useGitHubProjects.ts   # NOVO — pins + recent + merge
│   └── EasterEggProvider.tsx  # Remover portfolio-clicks; fix Konami
├── repository/
│   └── GithubRepository.ts    # GraphQL pins ou REST complementar
├── constants/
│   └── projects.config.ts     # Curadoria imagens/descricoes; flag pinned override
├── utils/
│   ├── mergeProjects.ts       # Logica pins + recent + config
│   └── projectImages.ts       # NOVO — resolver imagem do repo
├── styles/
│   └── _variables.scss        # Tokens Konami (--color-accent-*)
└── locales/
    ├── pt.json
    └── en.json
```

### 4.2 Stack

| Camada | Tecnologia |
|--------|------------|
| UI | React 18, TypeScript, SASS modules |
| i18n | i18next |
| API GitHub | axios + REST `/user/repos`; **GraphQL** para pinned items |
| Contato | @emailjs/browser (modal) |
| Deploy | Vercel |

### 4.3 Fluxo — projetos (pins + recentes)

```
useGetRepos (recent, sort=updated)
       +
useGetPinnedRepos (GraphQL pinnedItems)
       +
projects.config.ts (imagens, descricoes i18n, stacks)
       ↓
mergeProjectsV2() — dedupe por repo name; pins primeiro; depois recent (max 10); config enriquece
       ↓
filterProjectsMulti(selectedFilters[]) — AND entre stacks
       ↓
Projects.tsx — CSS grid 3 colunas; cards uniformes
```

### 4.4 Fluxo — CV remoto

```
Navbar / Hero / About — href=
  https://github.com/RafaelHDSV/PERSONAL-CVs/raw/main/Curriculo.pdf
  (encode UTF-8 no path)
download attribute opcional; target _blank com rel noopener
```

---

## 5. Especificacao detalhada

### 5.1 Identidade visual global (logo, tokens, selection)

**Objetivo:** Modernizar apresentacao mantendo coerencia; logo revisavel; selecao de texto estilizada.

**Mudancas**

- [ ] Nova logo "RV" ou wordmark (Navbar + favicon se aplicavel)
- [ ] Revisao opcional de fontes/cores/espacamentos em `_variables.scss` (documentar no context)
- [ ] `::selection` com `--color-accent` e contraste AA
- [ ] Elementos visuais de envolvimento: gradientes sutis, hover states, stagger leve em cards (sem excesso)

**Criterio de aceite:** visual coeso dark/light; selecao de texto visivel; logo consistente navbar/OG se atualizado.

---

### 5.2 Navbar — tema e idioma

**Objetivo:** SwitchTheme com mesmo padrao visual do toggle PT/EN.

**Uso esperado**

```
[RV]  Sobre · Stack · Projetos · Contato · CV    [PT|EN] [ tema ]
```

**Mudancas**

- [ ] `SwitchTheme`: pill/chip igual `localeToggle` (altura 44px, borda, icone Sun/Moon)
- [ ] Remover track grande atual se inconsistente

**Criterio de aceite:** tema e idioma parecem irmaos visuais; a11y (`aria-pressed`, labels i18n).

---

### 5.3 Hero (Header)

**Objetivo:** Secao limpa, moderna, sem redundancia.

**Mudancas**

- [ ] Remover linha estatica "Desenvolvedor Front-End · React · TypeScript" — **somente Typewriter** com strings Full-Stack i18n
- [ ] Fundo: mesh/gradiente moderno (grid opcional); nao obrigatorio manter quadriculado
- [ ] CTAs: **maximo 2** — recomendado `Ver projetos` + `Baixar CV` (URL remota PERSONAL-CVs)
- [ ] Remover CTA GitHub ou terceiro botao ghost inconsistente
- [ ] Remover palavra "portfolio" e hook `incrementPortfolioClick`
- [ ] Remover overlay `DevelopmentScreen` do App

**Criterio de aceite:** em 5s visitante ve nome, role animado e 1–2 acoes; sem texto duplicado; sem egg portfolio.

---

### 5.4 About

**Objetivo:** Bio Full-Stack alinhada ao CV; info GitHub legivel.

**Mudancas**

- [ ] Atualizar bio i18n (Full-Stack; extrair pontos do Curriculo.pdf / repo PERSONAL-CVs)
- [ ] Remover highlight/tag **"Aberto a oportunidades"**
- [ ] `UserInfoItem`: alinhar icone + texto (flex, gap 0.5–0.75rem); estilo Badge/surface do DS
- [ ] Layout metricas: **2 colunas** em desktop ou **1 coluna** — corrigir "Seguindo" fora do alinhamento
- [ ] CV: link remoto PERSONAL-CVs (nao depender de `public/cv.pdf` estatico)

**Criterio de aceite:** grid alinhado; icones alinhados ao texto; sem tag open; CV abre PDF atualizado do GitHub.

---

### 5.5 Stack (Languages)

**Objetivo:** Secao densa, sem faixas brancas vazias; icones legiveis.

**Opcao A — Corrigir slider**

- [ ] Aumentar `$slideSize` / font-size dos icones
- [ ] Garantir `slideTrack` preenchido (duplicar icons suficientes; largura calc correta)
- [ ] Fundo `--color-surface` continuo; fade `--fade-edge`

**Opcao B — Nova secao (preferencia se slider continuar quebrado)**

- [ ] Grid ou marquee mais lento com categorias (Frontend / Backend / Ferramentas)
- [ ] Icones min 48px; labels visiveis

**Criterio de aceite:** em dark mode nao ha "buracos" brancos longos; icones claramente visiveis; reduced-motion ok.

---

### 5.6 Projects

**Objetivo:** Lista unica com pins + 10 recentes; filtros multi; grid 3 colunas; imagens resolvidas.

**API GitHub**

| Fonte | Endpoint / query | Uso |
|-------|------------------|-----|
| Pinned | GraphQL `user(login) { pinnedItems(first: 6) { ... } }` | Ordem pin; badge visual opcional |
| Recent | REST `/user/repos?sort=updated&per_page=10` | Complemento deduplicado |
| Config | `projects.config.ts` | Imagem, descricao PT/EN, stacks extras |

**Regras de merge**

1. Pins primeiro (ordem do GitHub)
2. Recent nao duplicados (max 10 apos pins)
3. Config local enriquece imagem/descricao/stack; nao remove pin da lista
4. Repos sem imagem: tentar `projectImages.ts` (raw README, `/assets`, social preview); senao placeholder + registrar em checklist autor

**Layout**

- [ ] Remover `featuredGrid` + label "Destaques"
- [ ] Unica grid CSS: `grid-template-columns: repeat(3, 1fr)` desktop; `repeat(2)` tablet; `1fr` mobile
- [ ] Com 1–2 resultados filtrados, **manter 3 colunas** (cards nao esticam full-width) — usar `max-width` no card ou colunas fixas com items ocupando celulas

**Filtros agregados**

- [ ] Substituir filtro unico por multi-select chips (toggle on/off)
- [ ] Logica **AND**: selecionar React + API → projeto precisa ter ambas em `languages`
- [ ] Expandir filtros: React, TypeScript, JavaScript, Node, API, CSS, HTML, etc. (derivar de stacks presentes + config)

**Card actions**

- [ ] Botoes "Ver demo" e "GitHub" com estilo Button secondary/ghost do DS; hover consistente

**Criterio de aceite:** pins aparecem primeiro; ate 10 recentes adicionais; filtro React+API funciona; 3 colunas em 1280px com 2 projetos; imagens preenchidas quando existirem no repo.

---

### 5.7 Contact

**Objetivo:** Restaurar cards hover legados; formulario sob demanda.

**Layout alvo**

```
[ Email ] [ WhatsApp ] [ GitHub ] [ LinkedIn ]  — hover revela valor (estilo v0)
[ Enviar mensagem ]  — abre Modal com ContactForm
```

**Mudancas**

- [ ] Restaurar `ContactItem` hover (nome → email/link)
- [ ] Novo componente `Modal` acessivel (focus trap, Esc, aria-modal)
- [ ] `ContactForm` dentro do modal; estilos alinhados ao DS (inputs `--color-surface`, Button primary)
- [ ] Remover formulario inline sempre visivel
- [ ] Remover frase closing "Aberto a oportunidades e projetos freelance" (i18n)

**Criterio de aceite:** hover funciona em desktop; modal abre/fecha a11y; form EmailJS intacto.

---

### 5.8 Footer

**Objetivo:** Melhor uso horizontal; contador de eggs claro.

**Mudancas**

- [ ] Layout: social + nav em linha ou grid **full-width** dentro de Container (nao bloco estreito centralizado)
- [ ] Texto: `Easteregg a: {n}/6 descobertos` (i18n PT/EN)
- [ ] Remover link "Voltar ao topo" (ja existe `ScrollToTopButton`)
- [ ] Role: "Desenvolvedor Full-Stack" no copyright

**Criterio de aceite:** laterais sem excesso de vazio em 1920px; contador visivel; sem link duplicado topo.

---

### 5.9 Easter eggs (revisao)

**Remover**

- [ ] `portfolio-clicks` + `DevelopmentScreen` + referencias App/locales
- [ ] Ajustar `TOTAL_EGGS` (5 ou substituir por novo egg)

**Corrigir**

- [ ] Konami: classe `.easter-egg-accent` deve sobrescrever **todas** vars accent (`--color-accent`, `--primary-color`, hovers, bordas focus, glows hardcoded)
- [ ] Auditar SCSS/modules que usam `#38bdf8` ou `--color-accent` literal

**Incrementar (opcional)**

- [ ] Badge Explorador: animacao, icone, particulas leves (respeitar reduced-motion)
- [ ] Novo egg substituto do portfolio (ex.: clique longo no scroll indicator) — so se autor aprovar

**Manter**

- Konami, logo-clicks, rocket-email, space-mode, scroll-explorer (melhorado)

**Criterio de aceite:** nenhum astronauta; Konami deixa site 100% roxo 30s; contador footer correto.

---

### 5.10 i18n e SEO

**Mudancas**

- [ ] Strings Full-Stack em `pt.json` / `en.json`
- [ ] Remover keys obsoletas (portfolio egg, closing freelance, about.highlights.open)
- [ ] `index.html` JSON-LD `jobTitle`: Full-Stack Developer
- [ ] OG description atualizada

**Criterio de aceite:** toggle PT/EN reflete todas as mudancas; meta coerente.

---

## 6. Mecanismos compartilhados

| Mecanismo | Descricao |
|-----------|-----------|
| Design tokens | `_variables.scss` + override `.easter-egg-accent` completo |
| i18n | chaves por secao; novos filtros e footer egg |
| GitHub token | `VITE_GITHUB_ACCESS_TOKEN` — GraphQL pins no mesmo token |
| localStorage | `eggs-unlocked`, `theme`, `locale` — migrar ids de eggs removidos |
| Modal | focus trap reutilizavel para contato |

---

## 7. Instalacao e distribuicao

Sem mudanca de deploy. Variaveis `.env` permanecem. CV nao e mais artefato em `public/` — link externo.

Checklist pos-deploy:

- [ ] Token GitHub com escopo para GraphQL (read user)
- [ ] EmailJS na Vercel
- [ ] Smoke test pins visiveis com conta RafaelHDSV

---

## 8. Roadmap de implementacao

### Fase 1 — Identidade e hero (2–3 dias)

- [ ] Full-Stack i18n + meta
- [ ] Hero simplificado; remover egg portfolio
- [ ] SwitchTheme redesign
- [ ] ::selection + logo

### Fase 2 — About e Stack (2–3 dias)

- [ ] About layout + UserInfoItem DS
- [ ] CV remoto PERSONAL-CVs
- [ ] Stack slider fix ou nova secao

### Fase 3 — Projects (4–5 dias)

- [ ] GraphQL pins + merge recent
- [ ] Grade unica 3 colunas
- [ ] Filtros multi AND
- [ ] Resolver imagens + placeholders
- [ ] Card link styling

### Fase 4 — Contact, footer, eggs (3–4 dias)

- [ ] Contact hover + Modal + form DS
- [ ] Footer layout + texto eggs
- [ ] Konami fix; Explorador incrementado
- [ ] Remover DevelopmentScreen

### Fase 5 — Polimento (2 dias)

- [ ] Micro-interacoes globais
- [ ] `docs/context.md` atualizado
- [ ] Lighthouse + cross-browser
- [ ] Lista imagens pendentes para autor

**Estimativa total:** 13–17 dias focados.

---

## 9. Criterios de aceite (epic completa)

### Visual / UX

- [ ] Identidade Full-Stack em todo o site
- [ ] Hero sem duplicata typewriter; max 2 CTAs
- [ ] Switch tema = switch idioma visualmente
- [ ] Stack sem faixas vazias prolongadas
- [ ] Projetos em grade unica 3 colunas
- [ ] Filtros multi AND funcionais
- [ ] Contact hover + modal form
- [ ] Footer full-width; "Easteregg a: X/6 descobertos"

### Funcional

- [ ] CV abre PDF raw de PERSONAL-CVs
- [ ] Pins + 10 recentes do GitHub visiveis
- [ ] Imagens resolvidas quando existirem no repo
- [ ] Sem easter egg portfolio / astronauta
- [ ] Konami altera todas as cores accent

### Tecnico

- [ ] `yarn build` e `yarn lint` sem erros
- [ ] i18n PT/EN completo nas areas alteradas
- [ ] A11y modal e focus visible
- [ ] `prefers-reduced-motion` respeitado

---

## 10. Riscos e mitigacoes

| Risco | Mitigacao |
|-------|-----------|
| GraphQL pins exige token com escopo | Documentar; fallback: ordem manual em config `pinned: true` |
| Rate limit GitHub | Cache sessionStorage 5min para repos/pins |
| Imagens inexistentes em muitos repos | Placeholder uniforme + issue checklist autor |
| Grid 3 col com poucos items parece vazio | max-width card + alinhamento start |
| Remover eggs altera contador 6 | Atualizar TOTAL_EGGS e textos footer |
| CV raw GitHub redireciona | Testar download cross-browser; `download` attr |

---

## 11. Evolucao futura (pos-v2)

- Dominio custom + hreflang
- OG image gerada automaticamente
- Testes E2E Playwright
- Modo "recrutador" (PDF one-pager)
- Integracao LinkedIn posts no footer

**Duvidas resolvidas (mai/2026)**

1. **Logo:** monograma tipografico **RV** (`src/components/Logo/`) — gradiente sutil, hover com brilho.
2. **Hero CTAs:** par **Ver projetos** + **Baixar CV** (CV remoto PERSONAL-CVs).
3. **Explorador:** badge visual incrementado no footer + novos eggs `theme-hunter` e `arrow-hint` (7 total; removido portfolio/astronauta).
4. **Imagens faltantes:** placeholder com texto *"Imagem pendente — adicionar screenshot deste projeto"* ate o autor incluir assets.

---

## 12. Anexo — mapa vs v1.1

| Item v1.1 | v2 |
|-----------|-----|
| Secao Destaques + grid | Grade unica |
| Filtro exclusivo | Multi AND |
| `public/cv.pdf` | Raw PERSONAL-CVs |
| Front-End copy | Full-Stack |
| Form inline | Modal |
| 6 eggs incl. portfolio | 5+ eggs; portfolio removido |
| Featured config priority | Pins GitHub priority |

---

*Documento vivo — atualizar apos aprovacao da epic e ao concluir cada fase.*
