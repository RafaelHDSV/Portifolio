# Contexto do projeto — Portfólio Rafael Vieira

Documento de referência sobre o estado atual do repositório após a implementação da [especificação v2](./especificacao-v2-refino-ui-ux.md) (maio/2026), evoluindo a [v1.1](./especificacao.md).

**URL de deploy:** https://rafaelhdsv.vercel.app  
**Stack:** React 18 · TypeScript · Vite 7 · SASS · Emotion · i18next · EmailJS

---

## 1. Resumo

Portfólio SPA de Rafael Vieira, desenvolvedor **Full-Stack**. O site comunica perfil, stack, projetos e contato em uma única página com navegação por âncoras, além do **modo recrutador** em `/recruiter`.

A v2 focou em refino UI/UX: identidade Full-Stack, hero simplificado, stack em grid, projetos dinâmicos (pins + recentes GitHub), contato com modal, footer full-width e easter eggs revisados (8 total).

A **v3.0** (maio/2026) corrige scroll spy da navbar (Projetos), subtítulo de projetos e distribuição stats/contribuidores no hover dos cards.

A **v3.1** (maio/2026) redesenha o modo recrutador com layout em cards (perfil, stats, entregas, stack, experiência, projetos e contato), alinhado ao mock Lovable.

**Issue #23** (maio/2026): cache de mídia em `resolveRepoMedia.ts` com TTL de 5 minutos — previews revalidam após mudança de demo no GitHub.

**Issue #24** (maio/2026): batch GraphQL de languages (`getRepoLanguagesBatch`) com cache em sessionStorage (sessão do browser); mídia também persiste na sessão além do cache in-memory. Reduz ~18 REST `/languages` para 1 GraphQL por sessão.

**Issue #26** (maio/2026): Vitest 3.2.4 com testes unitários em `readmeMedia`, `mergeProjects`, `cardImageFallback`, curadoria e OG. Comando: `yarn test` (~51 casos).

**Issue #27** (maio/2026): fallback `onError` nos cards — URL inválida cai para placeholder genérico; preview OG do GitHub só no hover (stats + imagem).

**Issue #28** (maio/2026): OG image gerada no **build** (`scripts/generate-og.ts` + `@vercel/og`) em `public/og-pt.png` e `og-en.png`. Meta tags apontam para PNG estático; `/api/og` redireciona via rewrite em `vercel.json` (compatibilidade).

**Issue #29** (maio/2026): Playwright E2E — fluxos críticos em `e2e/` (home PT/EN, tema, filtros multi AND, modal contato, links CV/GitHub, modo recrutador, easter eggs). Comando: `yarn test:e2e`. Mocks de rede para GitHub e EmailJS.

**Issue #30** (maio/2026): Modo recrutador — rota `/recruiter` (deep link), `@media print`, meta `noindex`. Projetos destaque mantidos em `RECRUITER_FEATURED_REPO_ORDER`. Rewrite em `vercel.json`.

**Issue #31** (maio/2026): Curadoria híbrida — `forceInclude`, `forceExclude` (alias `hidden`), `demoPriority` (`config` | `root` | `readme`) em `projects.config.ts`. Lógica em `repoFilters`, `mergeProjects`, `resolveRepoMedia` (cache mídia v4).

**Issue #32** (maio/2026): Performance — code-split (`React.lazy` em Projects, Contact, RecruiterView), `manualChunks` (phosphor, react-icons, i18n, reveal, emailjs), preconnect OG/raw GitHub, Lighthouse CI (`yarn lhci`, workflow em push `main`). Chunk principal ~284 kB (antes ~558 kB).

**Issue #33** (maio/2026): Empty state de filtros — mensagem i18n + ícone + CTA `Limpar filtros` quando AND não retorna projetos (`Projects.tsx`).

**Issue #34** (maio/2026): Skeleton 16:9 — `ProjectCardSkeleton` com silhueta completa do Card + shimmer compartilhado (`src/styles/_shimmer.scss`).

**Issue #35** (maio/2026): A11y cards — `aria-label` Demo/GitHub com nome do projeto; overlay stats com `role="group"`, labels por métrica, visível em `focus-within`; `Button` repassa props ao `<a>`. E2E: `projects-a11y.spec.ts`.

**Issue #36** (maio/2026): Stats touch — botão "Ver stats" em `@media (hover: none)` expande overlay de stats; contributors carregados via `IntersectionObserver` no viewport touch. E2E: `projects-touch-stats.spec.ts`.

**Issue #37** (maio/2026): OG real — template com foto (avatar GitHub em `public/og/avatar.jpg`), marca RV e cargo Full-Stack; `og-pt.png`/`og-en.png` no build; `main.png` espelha `og-pt.png`.

**Issue #38** (maio/2026): Seção LinkedIn (posts) **removida do escopo** — dead code i18n eliminado; link de perfil permanece em Contato/Footer/Recrutador.

**Issue LinkedIn posts** (jun/2026): Seção implementada e **removida novamente** (jun/2026) — complexidade de integração (RSS, Apify, API, Voyager) superou o benefício; link de perfil permanece em Contato/Footer/Recrutador.

**Issue #44** (maio/2026): Easter egg **filtro ninja** — desbloqueio no catálogo na 1ª vez com 3+ filtros AND em Projetos; **efeito visual (pulse nos chips ativos) repete** sempre que um filtro é adicionado com 3+ ativos; `playEggEffect` reinicia animação se já estiver rodando; catálogo 8/8.

**Issue #47** (jun/2026): CV publico acessivel — repo [`cvs`](https://github.com/RafaelHDSV/cvs) publico; `CV_URL` aponta para raw `Curriculo.pdf` sem auth; E2E valida href + HTTP 200.

**Status de build:** `yarn build`, `yarn lint`, `yarn test` (~51) e `yarn test:e2e` passam.

---

## 2. Estrutura do repositório

```
src/
├── App.tsx                    # Shell principal + lazy sections
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
│   ├── ScrollProgressBar/     # Barra de progresso de scroll
│   ├── ScrollToTopButton/
│   ├── SectionFallback/       # Fallback de Suspense para lazy routes
│   ├── SectionTitle/          # Título + subtítulo + linha decorativa
│   └── SwitchTheme/           # Toggle pill alinhado ao locale
├── constants/
│   ├── cv.ts                  # CV_URL raw (repo publico cvs), GITHUB_USERNAME
│   ├── easterEggCatalog.ts    # Catálogo i18n dos 8 eggs
│   ├── projects.config.ts     # Curadoria: imagens, descrições, forceInclude/Exclude, demoPriority
│   └── images.tsx             # Imports de screenshots
├── context/
│   ├── RecruiterModeProvider.tsx
│   └── useRecruiterMode.ts
├── hooks/
│   ├── useActiveSection.ts    # Intersection Observer para navbar
│   ├── useGetMe.ts            # Perfil GitHub (About)
│   ├── useGitHubProjects.ts   # Pins (GraphQL) + recentes (REST) em paralelo
│   ├── EasterEggProvider.tsx  # Provider de easter eggs + playEggEffect
│   ├── EasterEggContext.ts
│   ├── useEasterEgg.ts
│   └── useEasterEgg.types.ts  # EasterEggId, TOTAL_EGGS = 8
├── screens/
│   ├── Header/                # Hero mesh, typewriter, 2 CTAs, seta (egg)
│   ├── About/                 # Bio + skeleton + dados GitHub (sem tag oportunidades)
│   ├── Languages/             # Grid de stack (substituiu carrossel)
│   ├── Projects/              # Grade única 3 col, filtros multi AND, skeleton, empty state
│   ├── Contact/               # Cards hover + modal com form
│   ├── Recruiter/             # Modo recrutador (RecruiterView)
│   └── Footer/                # Full-width, contador eggs, badge Explorador
├── repository/GithubRepository.ts  # REST + GraphQL (pinned repos)
├── services/gitHub.ts
├── styles/
│   ├── _variables.scss        # Design tokens + Konami accent roxo
│   ├── _global.scss           # Reset, ::selection, reduced-motion
│   ├── _easter-egg-effects.scss  # Classes egg-* no <html>
│   ├── _shimmer.scss          # Shimmer compartilhado (skeleton)
│   ├── _fonts.scss            # Cinzel Decorative + Outfit
│   └── main.scss
├── types/
│   ├── IGithub.ts
│   └── IProject.ts
└── utils/
    ├── environment.ts         # Env vars tipadas
    ├── mergeProjects.ts       # mergeGitHubProjects, filterProjectsMulti
    ├── resolveRepoMedia.ts    # Demo/README media + cache TTL + sessionStorage
    ├── repoFilters.ts         # Curadoria forceInclude/Exclude
    └── projectImages.ts       # Resolve imagem; pending se faltar asset

api/
└── og/
    ├── copy.ts                # Textos PT/EN + buildOgImageUrl
    ├── template.ts            # Árvore Satori (build + testes)
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
├── projects-a11y.spec.ts
├── projects-touch-stats.spec.ts
├── contact-modal.spec.ts
├── links.spec.ts
├── recruiter.spec.ts
└── easter-eggs.spec.ts

public/
├── robots.txt
├── sitemap.xml
├── og/
│   └── avatar.jpg             # Foto circular no template OG (#37)
├── og-pt.png                  # Gerado no build
├── og-en.png                  # Gerado no build
└── main.png                   # Cópia de og-pt.png no build (#37)

docs/
├── context.md                 # Este arquivo
├── especificacao.md           # Spec original v1.1
├── especificacao-v2-refino-ui-ux.md
├── google-search-console.md
├── emailjs-setup.md
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
- Link "CV" aponta para PDF publico no GitHub ([`cvs`](https://github.com/RafaelHDSV/cvs), `constants/cv.ts`)
- Botão **Recrutador** ativa modo e navega para `/recruiter`
- Menu hamburger `< 768px`, link ativo via `useActiveSection`

### Hero (Header)
- Apenas typewriter (sem linha estática duplicada)
- CTAs: **Ver projetos** + **Baixar CV** (sem botão GitHub separado)
- Seta inferior clicável 5× = egg `arrow-hint`
- Removidos: palavra "portfólio" clicável e `DevelopmentScreen`

### About
- Identidade **Full-Stack** (i18n + meta tags)
- Grid 2 colunas info; ícones alinhados em `UserInfoItem`
- Sem tag "Aberto a oportunidades"
- CV publico (GitHub raw) + "Ver no GitHub"

### Stack (Languages)
- Grid responsivo com ícones grandes (~2.25rem)
- Hover lift + accent; substitui carrossel quebrado da v1.1

### Projects
- **Pins GitHub** (GraphQL) + **10 repos recentes** (REST), deduplicados
- Grade única **3 colunas**; badge "Pin" nos fixados
- Filtros **multi AND** (React, TypeScript, Node, etc.)
- **Empty state** (#33) quando filtros não retornam resultados
- **Skeleton 16:9** (#34) durante loading
- **A11y** (#35): labels Demo/GitHub, overlay stats acessível por teclado
- **Touch** (#36): botão "Ver stats" sem hover; contributors lazy no viewport
- Curadoria híbrida (#31): `forceInclude` injeta repo ausente na API; `forceExclude`/`hidden` oculta; `demoPriority` controla ordem da mídia demo
- Imagens via `projectImages.ts`; placeholder textual se asset faltar
- Mídia enriquecida via `resolveRepoMedia.ts` (config > README > paths comuns > raiz); **cache in-memory TTL 5 min** (#23) + **sessionStorage na sessão** (#24)
- Languages dos cards via **batch GraphQL** + cache sessionStorage (#24); fallback REST se GraphQL falhar
- Fallback para `projects.config.ts` se API falhar
- Egg **filter-ninja** (#44): pulse nos chips ativos ao adicionar filtro com 3+ ativos (repetível)

### Contact
- Cards com hover (email, WhatsApp, GitHub, LinkedIn)
- Formulário em **Modal**; `ContactForm` aceita `onSuccess` para fechar
- Removido texto "Aberto a oportunidades e projetos freelance"

### Modo recrutador (`/recruiter`)
- Layout em cards: perfil, stats GitHub, entregas, stack, experiência, projetos destaque, contato
- `@media print`, meta `noindex`, deep link compartilhável

### Footer
- Layout full-width, menos centralizado
- `© {ano} Rafael Vieira · Desenvolvedor Full-Stack`
- Contador: `X/8 descobertos` (dinâmico via `totalEggs`)
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
- CV: raw publico de [`github.com/RafaelHDSV/cvs`](https://github.com/RafaelHDSV/cvs) — `Curriculo.pdf` (atualizado via push no repo cvs)

### EmailJS
- Variáveis: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
- Egg `rocket-email` quando mensagem contém "vieira"

### Vieira Analytics
- `@vieira/analytics` via `main.tsx` (`projectKey: "portifolio"`)

---

## 7. Easter eggs (8 — nunca bloqueiam conteúdo)

| ID | Gatilho | Recompensa |
|----|---------|------------|
| `konami` | sequência Konami | Accent roxo 30s |
| `logo-clicks` | 5 cliques no logo RV | Modo blueprint 14s |
| `locale-hopper` | 4 toggles idioma em 5s | Pulse no pill idioma |
| `rocket-email` | E-mail com "vieira" | Animação contato |
| `vieira-mode` | `?mode=vieira` na URL | Visual Vieira no hero |
| `theme-hunter` | 5 toggles tema em 3s | Espectro de cores 5s |
| `arrow-hint` | 5 cliques na seta hero | Órbita da seta |
| `filter-ninja` | 3+ filtros AND ao **adicionar** filtro | Pulse nos chips ativos 3s (**repetível**; catálogo desbloqueia 1×) |

**Removido na v2:** `portfolio-clicks` / `DevelopmentScreen`.

Descobertas em `localStorage` (`eggs-unlocked`). Implementação: `EasterEggProvider` + `useEasterEgg()`. Efeitos visuais em `_easter-egg-effects.scss`; `playEggEffect` remove/reaplica classe no `<html>` para reiniciar animação.

---

## 8. SEO e acessibilidade

**index.html:** meta/OG/JSON-LD com **Full-Stack Developer**; preconnect GitHub + Fonts. `og:image` e `twitter:image` apontam para `/og-pt.png` (1200×630, gerado no build, #28/#37). Verificação Google Search Console via `VITE_GOOGLE_SITE_VERIFICATION` (build). Guia: [`docs/google-search-console.md`](./google-search-console.md).

**Arquivos SEO estáticos:** `public/robots.txt`, `public/sitemap.xml` (home + imagens OG). Canonical único em `/`; i18n client-side sem hreflang com query string.

**A11y:** focus-visible, aria-labels, 44×44px em controles, reduced-motion global. Cards de projetos (#35): labels contextuais em links Demo/GitHub; overlay stats com `role="group"` e métricas nomeadas; visível em `:focus-within`.

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
yarn build    # tsc + generate-og + vite build
yarn lint     # ESLint (max-warnings 0)
yarn test     # Vitest (~51 casos)
yarn test:e2e # Playwright E2E (~20 casos, build + preview automático)
yarn preview  # preview do build
yarn lhci     # Lighthouse CI (autorun local)
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
| Footer centralizado, X/6 | Full-width, X/8 dinâmico |
| 6 eggs | 8 eggs (+ filter-ninja) |
| Logo texto navbar | Component Logo RV |

## 11.1 Mudanca v3.2 (Issue #47)

| v2 (quebrado) | v3.2 |
|---------------|------|
| CV raw PERSONAL-CVs (privado → 404 anonimo) | CV raw [`RafaelHDSV/cvs`](https://github.com/RafaelHDSV/cvs) (publico) |
| Atualizacao via push no repo fonte | Mesmo fluxo; visitantes anonimos acessam PDF |

---

## 12. Pendências (conteúdo — autor)

- [ ] Screenshots faltantes nos cards (placeholder indica onde adicionar)
- [ ] Preview OG em WhatsApp e LinkedIn pós-deploy (#28/#37 — autor)
- [ ] Variáveis de ambiente na Vercel (GitHub + EmailJS)
- [x] Testes automatizados (Vitest) — `readmeMedia` e `mergeProjects` (#26)
- [x] Testes E2E (Playwright) — fluxos críticos (#29+)
- [ ] Lighthouse mobile nas metas
- [ ] Domínio custom — fora do escopo v2

---

## 13. Decisões v2 (seção 11 da epic)

1. **Logo:** monograma RV tipográfico  
2. **Hero CTAs:** par Ver projetos + Baixar CV  
3. **Eggs:** badge Explorador incrementado + novos theme-hunter e arrow-hint  
4. **Imagens:** placeholder textual até o autor incluir assets  

---

## 14. Referências internas

- [Epic v2 UI/UX](./especificacao-v2-refino-ui-ux.md)
- [Especificação v1.1](./especificacao.md)
- [EmailJS — setup](./emailjs-setup.md)
- [LinkedIn](https://www.linkedin.com/in/rafael-vieira1720/) · [GitHub](https://github.com/RafaelHDSV)
- [Google Search Console — setup](./google-search-console.md)

---

*Última atualização: maio/2026 — pós Issue #44 (filter-ninja repetível) e docs README/context.*
