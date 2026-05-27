# Contexto do projeto — Portfólio Rafael Vieira

Documento de referência sobre o estado atual do repositório após a implementação da [especificação v2](./especificacao-v2-refino-ui-ux.md) (maio/2026), evoluindo a [v1.1](./especificacao.md).

**URL de deploy:** https://rafaelhdsv.vercel.app  
**Stack:** React 18 · TypeScript · Vite 7 · SASS · Emotion · i18next · EmailJS

---

## 1. Resumo

Portfólio SPA de Rafael Vieira, desenvolvedor **Full-Stack**. O site comunica perfil, stack, projetos e contato em uma única página com navegação por âncoras.

A v2 focou em refino UI/UX: identidade Full-Stack, hero simplificado, stack em grid, projetos dinâmicos (pins + recentes GitHub), contato com modal, footer full-width e easter eggs revisados (8 total).

A **v3.0** (maio/2026) corrige scroll spy da navbar (Projetos), subtitulo de projetos e distribuicao stats/contribuidores no hover dos cards.

A **v3.1** (maio/2026) redesenha o modo recrutador com layout em cards (perfil, stats, entregas, stack, experiencia, projetos e contato), alinhado ao mock Lovable.

**Issue #23** (maio/2026): cache de midia em `resolveRepoMedia.ts` com TTL de 5 minutos — previews revalidam apos mudanca de demo no GitHub.

**Issue #24** (maio/2026): batch GraphQL de languages (`getRepoLanguagesBatch`) com cache em sessionStorage (sessao do browser); midia tambem persiste na sessao alem do cache in-memory. Reduz ~18 REST `/languages` para 1 GraphQL por sessao.

**Issue #26** (maio/2026): Vitest 3.2.4 com testes unitarios em `readmeMedia`, `mergeProjects` e `cardImageFallback`. Comando: `yarn test`.

**Issue #27** (maio/2026): fallback `onError` nos cards — URL invalida cai para placeholder generico; preview OG do GitHub so no hover (stats + imagem).

**Issue #28** (maio/2026): OG image gerada no **build** (`scripts/generate-og.ts` + `@vercel/og`) em `public/og-pt.png` e `og-en.png`. Meta tags apontam para PNG estatico; `/api/og` redireciona via rewrite em `vercel.json` (compatibilidade).

**Issue #29** (maio/2026): Playwright E2E — 13 cenarios em `e2e/` (home PT/EN, tema, filtros multi AND, modal contato, links CV/GitHub, modo recrutador, easter eggs vieira-mode/theme-hunter/locale-hopper). Comando: `yarn test:e2e`. Mocks de rede para GitHub e EmailJS; sem CI.

**Issue #30** (maio/2026): Modo recrutador — rota `/recruiter` (deep link), `@media print`, meta `noindex`. Projetos destaque mantidos em `RECRUITER_FEATURED_REPO_ORDER`. Rewrite em `vercel.json`.

**Issue #31** (maio/2026): Curadoria hibrida — `forceInclude`, `forceExclude` (alias `hidden`), `demoPriority` (`config` | `root` | `readme`) em `projects.config.ts`. Logica em `repoFilters`, `mergeProjects`, `resolveRepoMedia` (cache midia v4).

**Issue #32** (maio/2026): Performance — code-split (`React.lazy` em Projects, Contact, RecruiterView), `manualChunks` (phosphor, react-icons, i18n, reveal, emailjs), preconnect OG/raw GitHub, Lighthouse CI (`yarn lhci`, workflow em push `main`). Chunk principal ~284 kB (antes ~558 kB).

**Issue #33** (maio/2026): Empty state de filtros — mensagem i18n + icone + CTA `Limpar filtros` quando AND nao retorna projetos (`Projects.tsx`).

**Issue #34** (maio/2026): Skeleton 16:9 — `ProjectCardSkeleton` com silhueta completa do Card + shimmer compartilhado (`src/styles/_shimmer.scss`).

**Issue #35** (maio/2026): A11y cards — `aria-label` Demo/GitHub com nome do projeto; overlay stats com `role="group"`, labels por metrica, visivel em `focus-within`; `Button` repassa props ao `<a>`.

**Issue #36** (maio/2026): Stats touch — botao "Ver stats" em `@media (hover: none)` expande overlay de stats; contributors carregados via `IntersectionObserver` no viewport touch.

**Issue #37** (maio/2026): OG real — template com foto (avatar GitHub em `public/og/avatar.jpg`), marca RV e cargo Full-Stack; `og-pt.png`/`og-en.png` no build; `main.png` espelha `og-pt.png`.

**Issue #38** (maio/2026): Secao LinkedIn (posts) **removida do escopo** — dead code i18n (`linkedin.*`, `nav.linkedin`) eliminado; link de perfil LinkedIn permanece em Contato, Footer e modo recrutador.

**Issue #44** (maio/2026): Easter egg **filtro ninja** — desbloqueia com 3+ filtros AND em Projetos; pulse nos chips ativos; catalogo 8/8.

**Status de build:** `yarn build`, `yarn lint`, `yarn test` e `yarn test:e2e` passam. `yarn lhci` roda com assert Performance em **warn** (baseline mobile local ~0.42).

---

## 2. Estrutura do repositório

```
src/
├── App.tsx                    # Shell principal + EasterEggProvider
├── main.tsx                   # Bootstrap React + I18nextProvider + analytics
├── i18n/index.ts              # Configuração i18next (PT padrão, EN fallback)
├── locales/
│   ├── pt.json                # Traduções PT-BR (UI completa)
│   └── en.json                # Traduções EN
├── components/
│   ├── Badge/                 # Chip de tecnologia nos cards
│   ├── Button/                # primary | secondary | ghost (+ href, download)
│   ├── Card/                  # Card de projeto (16:9, pin badge, placeholder imagem)
│   ├── ContactForm/           # Formulário EmailJS (+ onSuccess para modal)
│   ├── Container/             # max-width + padding responsivo
│   ├── CustomCursor/          # Cursor animado (só pointer:fine, sem reduced-motion)
│   ├── Logo/                  # Monograma RV tipográfico
│   ├── Modal/                 # Dialog acessível para formulário de contato
│   ├── Navbar/                # Mobile menu, locale pill, CV remoto, link ativo
│   ├── ScrollToTopButton/
│   ├── SectionTitle/          # Título + subtítulo + linha decorativa
│   └── SwitchTheme/           # Toggle pill alinhado ao locale
├── constants/
│   ├── cv.ts                  # CV_URL remoto (PERSONAL-CVs), GITHUB_USERNAME
│   ├── projects.config.ts     # Curadoria: imagens, descricoes, forceInclude/Exclude, demoPriority
│   └── images.tsx             # Imports de screenshots
├── hooks/
│   ├── useActiveSection.ts    # Intersection Observer para navbar
│   ├── useGetMe.ts            # Perfil GitHub (About)
│   ├── useGitHubProjects.ts   # Pins (GraphQL) + recentes (REST) em paralelo
│   ├── EasterEggProvider.tsx  # Provider de easter eggs
│   ├── EasterEggContext.ts
│   ├── useEasterEgg.ts
│   └── useEasterEgg.types.ts
├── screens/
│   ├── Header/                # Hero mesh, typewriter, 2 CTAs, seta (egg)
│   ├── About/                 # Bio + skeleton + dados GitHub (sem tag oportunidades)
│   ├── Languages/             # Grid de stack (substituiu carrossel)
│   ├── Projects/              # Grade única 3 col, filtros multi AND
│   ├── Contact/               # Cards hover + modal com form
│   └── Footer/                # Full-width, contador eggs, badge Explorador
├── repository/GithubRepository.ts  # REST + GraphQL (pinned repos)
├── services/gitHub.ts
├── styles/
│   ├── _variables.scss        # Design tokens + Konami accent roxo
│   ├── _global.scss           # Reset, ::selection, reduced-motion
│   ├── _fonts.scss            # Cinzel Decorative + Outfit
│   └── main.scss
├── types/
│   ├── IGithub.ts
│   └── IProject.ts
└── utils/
    ├── environment.ts         # Env vars tipadas
    ├── mergeProjects.ts       # mergeGitHubProjects, filterProjectsMulti
    └── projectImages.ts       # Resolve imagem; pending se faltar asset

api/
└── og/
    ├── copy.ts                # Textos PT/EN + buildOgImageUrl
    ├── template.ts            # Arvore Satori (build + testes)
    ├── copy.test.ts
    └── template.test.ts

scripts/
└── generate-og.ts             # Gera public/og-pt.png e og-en.png no build

e2e/
├── helpers/                   # storage, githubMocks
├── fixtures/github/           # repos mockados para filtros
├── home.spec.ts
├── theme.spec.ts
├── projects-filters.spec.ts
├── contact-modal.spec.ts
├── links.spec.ts
├── recruiter.spec.ts
└── easter-eggs.spec.ts

public/
├── robots.txt
├── sitemap.xml
├── og-pt.png                  # Gerado no build
└── og-en.png                  # Gerado no build

docs/
├── context.md                 # Este arquivo
├── especificacao.md           # Spec original v1.1
├── especificacao-v2-refino-ui-ux.md
└── current-task.md
```

---

## 3. Design system

Tokens em `src/styles/_variables.scss`:

| Token | Uso |
|-------|-----|
| `--color-bg`, `--color-surface`, `--color-surface-elevated` | Superfícies (dark-first) |
| `--color-text-primary/secondary/muted` | Hierarquia de texto |
| `--color-accent`, `--color-accent-hover` | Marca (#38bdf8 dark / #0ea5e9 light) |
| `--hero-mesh-1`, `--hero-mesh-2` | Fundo do hero |
| `--text-display`, `--text-h2`, `--text-body`, `--text-small` | Escala tipográfica (clamp) |
| `--space-section-y`, `--space-container-x`, `--max-width-content` | Layout responsivo |
| `--radius-card`, `--radius-button` | Bordas |

**Tipografia:** Cinzel Decorative em display (hero, logo RV, títulos). Outfit no restante.

**Tema:** escuro por padrão. Preferência em `localStorage` (`theme`). Toggle pill igual ao de idioma.

**Seleção de texto:** `::selection` com accent semitransparente em `_global.scss`.

**Konami:** classe `easter-egg-accent` no `<html>` — accent e hero-mesh 100% roxo por 30s.

---

## 4. Funcionalidades por seção

### Navbar
- Logo component `RV` (5 cliques = egg console)
- Toggle PT | EN e tema em estilo **pill**
- Link "CV" aponta para PDF remoto (`constants/cv.ts`)
- Botao **Recrutador** ativa modo e navega para `/recruiter`
- Menu hamburger `< 768px`, link ativo via `useActiveSection`

### Hero (Header)
- Apenas typewriter (sem linha estática duplicada)
- CTAs: **Ver projetos** + **Baixar CV** (sem botão GitHub separado)
- Seta inferior clicável 3× = egg `arrow-hint`
- Removidos: palavra "portfólio" clicável e `DevelopmentScreen`

### About
- Identidade **Full-Stack** (i18n + meta tags)
- Grid 2 colunas info; ícones alinhados em `UserInfoItem`
- Sem tag "Aberto a oportunidades"
- CV remoto + "Ver no GitHub"

### Stack (Languages)
- Grid responsivo com ícones grandes (~2.25rem)
- Hover lift + accent; substitui carrossel quebrado da v1.1

### Projects
- **Pins GitHub** (GraphQL) + **10 repos recentes** (REST), deduplicados
- Grade unica **3 colunas**; badge "Pin" nos fixados
- Filtros **multi AND** (React, TypeScript, Node, etc.)
- Curadoria hibrida (#31): `forceInclude` injeta repo ausente na API; `forceExclude`/`hidden` oculta; `demoPriority` controla ordem da midia demo
- Imagens via `projectImages.ts`; placeholder textual se asset faltar
- Midia enriquecida via `resolveRepoMedia.ts` (config > README > paths comuns > raiz); **cache in-memory TTL 5 min** (#23) + **sessionStorage na sessao** (#24)
- Languages dos cards via **batch GraphQL** + cache sessionStorage (#24); fallback REST se GraphQL falhar
- Fallback para `projects.config.ts` se API falhar

### Contact
- Cards com hover (email, WhatsApp, GitHub, LinkedIn)
- Formulário em **Modal**; `ContactForm` aceita `onSuccess` para fechar
- Removido texto "Aberto a oportunidades e projetos freelance"

### Footer
- Layout full-width, menos centralizado
- `© {ano} Rafael Vieira · Desenvolvedor Full-Stack`
- Contador: `X/8 descobertos` (dinamico via `totalEggs`)
- Badge Explorador incrementado (ícone animado, mensagens contextuais)
- Sem link "Voltar ao topo" (mantido `ScrollToTopButton` flutuante)

---

## 5. Internacionalização

- **Biblioteca:** `i18next` + `react-i18next`
- **Idioma padrão:** PT; persistência `localStorage.locale`
- **Escopo:** navbar, seções, filtros, formulário, footer, easter eggs, typewriter
- Copy atualizada para **Full-Stack** em PT e EN

---

## 6. Integrações externas

### GitHub API
- Token: `VITE_GITHUB_ACCESS_TOKEN`
- REST: `/user`, `/user/repos` (recentes)
- GraphQL: pinned repositories (`getPinnedRepos`)
- CV: raw de `github.com/RafaelHDSV/PERSONAL-CVs/.../Currículo.pdf`

### EmailJS
- Variáveis: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
- Egg `rocket-email` quando mensagem contém "rocket"

### Vieira Analytics
- `@vieira/analytics` via `main.tsx` (`projectKey: "portifolio"`)

---

## 7. Easter eggs (8 — nunca bloqueiam conteudo)

| ID | Gatilho | Recompensa |
|----|---------|------------|
| `konami` | sequencia Konami | Accent roxo 30s |
| `logo-clicks` | 5 cliques no logo RV | Modo blueprint 14s |
| `locale-hopper` | 4 toggles idioma em 5s | Pulse no pill idioma |
| `rocket-email` | E-mail com "vieira" | Animacao contato |
| `vieira-mode` | `?mode=vieira` na URL | Visual Vieira no hero |
| `theme-hunter` | 5 toggles tema em 3s | Espectro de cores 5s |
| `arrow-hint` | 5 cliques na seta hero | Orbita da seta |
| `filter-ninja` | 3+ filtros AND em Projetos | Pulse nos chips ativos 3s |

**Removido na v2:** `portfolio-clicks` / `DevelopmentScreen`.

Descobertas em `localStorage` (`eggs-unlocked`). Implementação: `EasterEggProvider` + `useEasterEgg()`.

---

## 8. SEO e acessibilidade

**index.html:** meta/OG/JSON-LD com **Full-Stack Developer**; preconnect GitHub + Fonts. `og:image` e `twitter:image` apontam para `/og-pt.png` (1200x630, gerado no build, #28). Verificacao Google Search Console via `VITE_GOOGLE_SITE_VERIFICATION` (build). Guia: [`docs/google-search-console.md`](./google-search-console.md).

**Arquivos SEO estaticos:** `public/robots.txt`, `public/sitemap.xml` (hreflang PT/EN).

**A11y:** focus-visible, aria-labels, 44×44px em controles, reduced-motion global.

---

## 9. Variáveis de ambiente

```env
VITE_GITHUB_ACCESS_TOKEN=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_GOOGLE_SITE_VERIFICATION=
```

Copiar de `.env.example`. **Nunca commitar** `.env` com valores reais.

---

## 10. Comandos

```bash
yarn          # instalar dependências
yarn dev      # dev server (Vite)
yarn build    # tsc + vite build
yarn lint     # ESLint (max-warnings 0)
yarn test     # Vitest (utils de midia, ordenacao, cardImageFallback, api/og)
yarn test:e2e # Playwright E2E (build + preview automatico)
yarn preview  # preview do build
```

**Node recomendado:** 22 LTS. Node 23 pode causar problemas com Vitest.

---

## 11. Mudanças v1.1 → v2

| v1.1 | v2 |
|------|-----|
| Front-End | Full-Stack |
| Hero: 3 CTAs + egg portfolio | 2 CTAs; egg portfolio removido |
| `public/cv.pdf` | CV remoto PERSONAL-CVs |
| Carrossel stack | Grid de tecnologias |
| Destaques + grid projects | Grade única 3 col; pins GitHub |
| Filtro exclusivo | Multi AND |
| Form inline | Modal |
| Footer centralizado, X/6 | Full-width, X/7 dinâmico |
| 6 eggs | 8 eggs (+ filter-ninja) |
| Logo texto navbar | Component Logo RV |

---

## 12. Pendências (conteúdo — autor)

- [ ] Screenshots faltantes nos cards (placeholder indica onde adicionar)
- [ ] Preview OG em WhatsApp e LinkedIn pos-deploy (#28 — autor)
- [ ] Variáveis de ambiente na Vercel (GitHub + EmailJS)
- [x] Testes automatizados (Vitest) — `readmeMedia` e `mergeProjects` (#26)
- [x] Testes E2E (Playwright) — fluxos criticos (#29)
- [ ] Lighthouse mobile nas metas
- [ ] Domínio custom — fora do escopo v2

---

## 13. Decisões v2 (secao 11 da epic)

1. **Logo:** monograma RV tipográfico  
2. **Hero CTAs:** par Ver projetos + Baixar CV  
3. **Eggs:** badge Explorador incrementado + novos theme-hunter e arrow-hint  
4. **Imagens:** placeholder textual até o autor incluir assets  

---

## 14. Referências internas

- [Epic v2 UI/UX](./especificacao-v2-refino-ui-ux.md)
- [Especificação v1.1](./especificacao.md)
- [LinkedIn](https://www.linkedin.com/in/rafael-vieira1720/) · [GitHub](https://github.com/RafaelHDSV)
- [Google Search Console — setup](./google-search-console.md)

---

*Ultima atualizacao: maio/2026 — pos Issue #31 (curadoria hibrida).*
