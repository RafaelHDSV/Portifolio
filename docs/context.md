# Contexto do projeto — Portfólio Rafael Vieira

Documento de referência sobre o estado atual do repositório após a implementação da [especificação v2](./especificacao-v2-refino-ui-ux.md) (maio/2026), evoluindo a [v1.1](./especificacao.md).

**URL de deploy:** https://rafaelhdsv.vercel.app  
**Stack:** React 18 · TypeScript · Vite 7 · SASS · Emotion · i18next · EmailJS

---

## 1. Resumo

Portfólio SPA de Rafael Vieira, desenvolvedor **Full-Stack**. O site comunica perfil, stack, projetos e contato em uma única página com navegação por âncoras.

A v2 focou em refino UI/UX: identidade Full-Stack, hero simplificado, stack em grid, projetos dinâmicos (pins + recentes GitHub), contato com modal, footer full-width e easter eggs revisados (7 total).

A **v2.7** (maio/2026) limita a 18 projetos (sem ESTUDO*), ordena por estrelas + tamanho + data, corrige CTAs e seta, egg Salto de idioma e animacao Vieira aprimorada.

**Status de build:** `yarn build` e `yarn lint` passam sem erros.

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
│   ├── projects.config.ts     # Curadoria: imagens, descrições PT/EN, featured
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

public/
├── robots.txt
├── sitemap.xml
└── main.png                   # OG image (atualizar manualmente)

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
- Grade única **3 colunas**; badge "Pin" nos fixados
- Filtros **multi AND** (React, TypeScript, Node, etc.)
- Imagens via `projectImages.ts`; placeholder textual se asset faltar
- Fallback para `projects.config.ts` se API falhar

### Contact
- Cards com hover (email, WhatsApp, GitHub, LinkedIn)
- Formulário em **Modal**; `ContactForm` aceita `onSuccess` para fechar
- Removido texto "Aberto a oportunidades e projetos freelance"

### Footer
- Layout full-width, menos centralizado
- `© {ano} Rafael Vieira · Desenvolvedor Full-Stack`
- Contador: `Easteregg a: X/7 descobertos` (dinâmico via `totalEggs`)
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

## 7. Easter eggs (7 — nunca bloqueiam conteúdo)

| ID | Gatilho | Recompensa |
|----|---------|------------|
| `konami` | ↑↑↓↓←→←→BA | Accent + mesh roxo 30s |
| `logo-clicks` | 5 cliques rápidos no logo RV | Console art + link Plann.er |
| `scroll-explorer` | Scroll fim → topo 3× | Badge Explorador |
| `rocket-email` | E-mail contendo "rocket" | Mensagem de sucesso especial |
| `space-mode` | `?mode=space` na URL | Estrelas extras no hero |
| `theme-hunter` | 5 toggles de tema em 3s | Toast "Caçador de temas" |
| `arrow-hint` | 3 cliques na seta do hero | Toast "Curioso, né?" |

**Removido na v2:** `portfolio-clicks` / `DevelopmentScreen`.

Descobertas em `localStorage` (`eggs-unlocked`). Implementação: `EasterEggProvider` + `useEasterEgg()`.

---

## 8. SEO e acessibilidade

**index.html:** meta/OG/JSON-LD com **Full-Stack Developer**; preconnect GitHub + Fonts.

**A11y:** focus-visible, aria-labels, 44×44px em controles, reduced-motion global.

---

## 9. Variáveis de ambiente

```env
VITE_GITHUB_ACCESS_TOKEN=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Copiar de `.env.example`. **Nunca commitar** `.env` com valores reais.

---

## 10. Comandos

```bash
yarn          # instalar dependências
yarn dev      # dev server (Vite)
yarn build    # tsc + vite build
yarn lint     # ESLint (max-warnings 0)
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
| 6 eggs | 7 eggs (+ theme-hunter, arrow-hint) |
| Logo texto navbar | Component Logo RV |

---

## 12. Pendências (conteúdo — autor)

- [ ] Screenshots faltantes nos cards (placeholder indica onde adicionar)
- [ ] `public/main.png` real para OG (1200×630)
- [ ] Variáveis de ambiente na Vercel (GitHub + EmailJS)
- [ ] Testes automatizados (Vitest) — pendente compatibilidade Node
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

---

*Última atualização: maio/2026 — pós-implementação da spec v2.*
