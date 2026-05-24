# Contexto do projeto — Portfólio Rafael Vieira

Documento de referência sobre o estado atual do repositório após a implementação da [especificação v1.1](./especificacao.md) (maio/2026).

**URL de deploy:** https://rafaelhdsv.vercel.app  
**Stack:** React 18 · TypeScript · Vite 7 · SASS · Emotion · i18next · EmailJS

---

## 1. Resumo

Portfólio SPA de Rafael Vieira, desenvolvedor Front-End. O site comunica perfil, stack, projetos e contato em uma única página com navegação por âncoras.

A implementação seguiu a especificação completa: design system unificado, i18n PT/EN, integração híbrida com GitHub API, formulário de contato via EmailJS, easter eggs opcionais (sem bloqueio de produção), SEO básico e acessibilidade.

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
│   ├── Button/                # primary | secondary | ghost (+ href)
│   ├── Card/                  # Card de projeto (16:9, badges, links)
│   ├── ContactForm/           # Formulário EmailJS
│   ├── Container/             # max-width + padding responsivo
│   ├── CustomCursor/          # Cursor animado (só pointer:fine, sem reduced-motion)
│   ├── Navbar/                # Mobile menu, locale, CV, link ativo
│   ├── ScrollToTopButton/
│   ├── SectionTitle/          # Título + subtítulo + linha decorativa
│   ├── SwitchTheme/           # Toggle claro/escuro (dark-first)
│   └── TechIcon/              # Ícones de stack por nome
├── constants/
│   ├── projects.config.ts     # Curadoria: featured, imagens, descrições PT/EN
│   ├── images.tsx             # Imports de screenshots
│   └── ProjectsData.tsx       # LEGADO — substituído por projects.config.ts
├── hooks/
│   ├── useActiveSection.ts    # Intersection Observer para navbar
│   ├── useGetMe.ts            # Perfil GitHub (About)
│   ├── useGetRepos.ts         # Repositórios GitHub (Projects)
│   ├── EasterEggProvider.tsx  # Provider de easter eggs
│   ├── EasterEggContext.ts
│   ├── useEasterEgg.ts
│   ├── useEasterEgg.types.ts
│   └── useEasterEgg.helpers.ts
├── screens/
│   ├── Header/                # Hero com mesh, CTAs, typewriter i18n
│   ├── About/                 # Bio + skeleton + dados GitHub
│   ├── Languages/             # Carrossel "Stack" integrado ao tema
│   ├── Projects/              # API merge + filtros + destaques
│   ├── Contact/               # Redes + formulário
│   ├── Footer/                # Social, nav, contador de eggs
│   └── DevelopmentScreen/     # Overlay easter egg (não bloqueia produção)
├── repository/GithubRepository.ts
├── services/gitHub.ts
├── styles/
│   ├── _variables.scss        # Design tokens semânticos
│   ├── _global.scss           # Reset, body, focus-visible, reduced-motion
│   ├── _fonts.scss            # Cinzel Decorative + Outfit
│   └── main.scss
├── types/
│   ├── IGithub.ts
│   └── IProject.ts
└── utils/
    ├── environment.ts         # Env vars tipadas
    └── mergeProjects.ts       # Merge API + config estático

public/
├── robots.txt
├── sitemap.xml
├── cv.pdf                     # Currículo (atualizar manualmente)
└── main.png                   # OG image (atualizar manualmente)

docs/
├── context.md                 # Este arquivo
└── especificacao.md           # Spec original v1.1
```

---

## 3. Design system

Tokens em `src/styles/_variables.scss`:

| Token | Uso |
|-------|-----|
| `--color-bg`, `--color-surface`, `--color-surface-elevated` | Superfícies (dark-first) |
| `--color-text-primary/secondary/muted` | Hierarquia de texto |
| `--color-accent`, `--color-accent-hover` | Marca (#38bdf8 dark / #0ea5e9 light) |
| `--text-display`, `--text-h2`, `--text-body`, `--text-small` | Escala tipográfica (clamp) |
| `--space-section-y`, `--space-container-x`, `--max-width-content` | Layout responsivo |
| `--radius-card`, `--radius-button` | Bordas |

**Tipografia:** Cinzel Decorative só em display (hero, logo RV, títulos de seção). Outfit em todo o restante.

**Tema:** escuro por padrão. Preferência em `localStorage` (`theme`). Script inline no `index.html` evita flash claro.

**Regras aplicadas:**
- Sem `transition: all` global
- Sem inversão `background: var(--text-color)` nos cards
- `prefers-reduced-motion` respeitado globalmente e por componente

---

## 4. Funcionalidades por seção

### Navbar
- Fixa com `backdrop-filter: blur()` e borda ao scroll
- Menu hamburger `< 768px`
- Link ativo via `useActiveSection` (Intersection Observer)
- Toggle PT | EN (`localStorage`: `locale`)
- Link "CV" (`cv.pdf`)
- Logo "RV" em Cinzel — 5 cliques rápidos = easter egg

### Hero (Header)
- Fundo: gradiente mesh + grid sutil (substituiu `background.png`)
- Nome + role + typewriter (strings i18n)
- CTAs: Ver projetos · Baixar CV · GitHub
- Palavra "portfólio" clicável — 30 cliques = easter egg espacial

### About
- Bio estática i18n + dados GitHub (`useGetMe`)
- Skeleton durante loading (não retorna vazio)
- Layout: avatar acima (mobile) / duas colunas (desktop)
- Highlights: role, focus, open to opportunities
- Botões CV e "Ver no GitHub"

### Stack (Languages)
- Título visível via `SectionTitle`
- Carrossel infinito com fundo `--color-surface`
- Fade nas bordas usando `--fade-edge` (adapta ao tema)
- Pausa no hover; estático com `prefers-reduced-motion`

### Projects
- **Modelo híbrido:** `useGetRepos` + `projects.config.ts` → `mergeProjects()`
- Exibe repos com `homepage` ou `featured: true`
- Ordenação: featured primeiro → ordem do config
- Fallback estático se API falhar
- 4 destaques: Plann.er, Netflix Clone, Listagem Automática, Controle Financeiro
- Filtros: Todos · React · JavaScript · API
- "Mostrar mais" após 6 itens não-featured
- Cards: ratio 16:9, badges, hover lift, lazy loading

### Contact
- Grid de 4 canais (Email, WhatsApp, GitHub, LinkedIn)
- Formulário EmailJS (`ContactForm`)
- Estados: enviando / sucesso / erro
- Frase de encerramento i18n

### Footer
- Ícones sociais + navegação repetida
- `© {ano} Rafael Vieira · Desenvolvedor Front-End`
- Contador de easter eggs descobertos (`X/6`)
- Badge flutuante "Explorador" (easter egg de scroll)

---

## 5. Internacionalização

- **Biblioteca:** `i18next` + `react-i18next`
- **Idioma padrão:** PT (navegador `pt-*` mantém PT; demais → EN ou preferência salva)
- **Persistência:** `localStorage.locale`
- **Atributo `lang`:** atualizado em `<html>` ao trocar idioma
- **Escopo traduzido:** navbar, seções, botões, formulário, toasts, easter eggs, typewriter
- **Projetos:** descrições PT/EN em `projects.config.ts`; dados da API GitHub permanecem no idioma original do repo

---

## 6. Integrações externas

### GitHub API
- Token: `VITE_GITHUB_ACCESS_TOKEN`
- Endpoints: `/user` (About), `/user/repos` (Projects)
- Campos usados nos repos: `name`, `homepage`, `html_url`, `description`, `language`, `updated_at`

### EmailJS
- Pacote: `@emailjs/browser`
- Variáveis: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
- Campos do form: `from_name`, `email`, `message`
- Sem env vars configuradas → mensagem de erro no submit

### Vieira Analytics
- `@vieira/analytics` via `main.tsx` (`projectKey: "portifolio"`)

---

## 7. Easter eggs (6 — nunca bloqueiam conteúdo)

| ID | Gatilho | Recompensa |
|----|---------|------------|
| `portfolio-clicks` | 30 cliques em "portfólio" no hero | Overlay `DevelopmentScreen` |
| `konami` | ↑↑↓↓←→←→BA | Accent roxo por 30s |
| `logo-clicks` | 5 cliques rápidos no logo RV | Console art + link Plann.er |
| `scroll-explorer` | Scroll fim → topo 3× | Badge "Explorador" 5s |
| `rocket-email` | E-mail contendo "rocket" | Mensagem de sucesso especial |
| `space-mode` | `?mode=space` na URL | Estrelas extras no hero |

Descobertas persistidas em `localStorage` (`eggs-unlocked`).

Implementação: `EasterEggProvider` + `useEasterEgg()`.

---

## 8. SEO e acessibilidade

**index.html:**
- Viewport sem `maximum-scale` (permite zoom iOS)
- OG tags + `twitter:card`
- JSON-LD `Person`
- Preconnect: GitHub API, Google Fonts

**public/:** `robots.txt`, `sitemap.xml`

**A11y:**
- Contraste via tokens semânticos
- `aria-label` em links só-ícone
- `focus-visible` estilizado
- Cursor customizado desativado em touch e `prefers-reduced-motion`
- Área de toque mínima 44×44px nos controles interativos

---

## 9. Variáveis de ambiente

Copiar `.env.example` → `.env` e configurar na Vercel:

```env
VITE_GITHUB_ACCESS_TOKEN=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

**Nunca commitar** `.env` com valores reais.

---

## 10. Comandos

```bash
yarn          # instalar dependências
yarn dev      # dev server (Vite)
yarn build    # tsc + vite build
yarn lint     # ESLint (max-warnings 0)
yarn preview  # preview do build
```

**Node recomendado:** 22 LTS (`.nvmrc`). Node 23 pode causar problemas ao instalar Vitest.

---

## 11. Mudanças em relação ao código anterior

| Antes | Depois |
|-------|--------|
| `DevelopmentScreen` bloqueava produção (30 cliques) | Site sempre visível; tela virou easter egg overlay |
| Delay artificial de 1s no loading | Removido |
| 5 famílias tipográficas | Cinzel Decorative + Outfit |
| `ProjectsData.tsx` com JSX nos arrays | `projects.config.ts` + `TechIcon` |
| Cards com `background: var(--text-color)` | `--color-surface-elevated` |
| Faixa branca no carrossel de stack | Integrada ao tema dark/light |
| Hero com `background.png` + glow pesado | Mesh gradient + grid CSS |
| About retornava `null` no loading | Skeleton |
| Sem i18n | PT + EN completo |
| Sem formulário | EmailJS |
| `useGetRepos` comentado | Ativo com merge híbrido |
| Pasta `UNUSED Tooltip` | Removida (ou em processo de limpeza) |

---

## 12. Pendências (conteúdo e ops — fora do código)

Itens da spec §7 e §5.12 que dependem do autor ou infra:

- [ ] Bio definitiva (~80 palavras) — hoje há rascunho em `locales/*.json`
- [ ] Screenshots padronizados 16:9 (mesma resolução/crop)
- [ ] `public/cv.pdf` atualizado
- [ ] `public/main.png` real para OG (1200×630)
- [ ] Variáveis de ambiente na Vercel (GitHub + EmailJS)
- [ ] Testes automatizados (Vitest + Testing Library) — não instalados por incompatibilidade Node 23
- [ ] Lighthouse mobile nas metas (Performance ≥90, A11y ≥95)
- [ ] Domínio custom — fora do escopo v1 (`*.vercel.app`)

---

## 13. Decisões registradas (spec §11)

1. **Tipografia display:** Cinzel Decorative + Outfit  
2. **Projetos:** API GitHub + config local  
3. **Idiomas:** PT + EN com toggle na navbar  
4. **Domínio:** `*.vercel.app` na v1  
5. **Formulário:** EmailJS  
6. **Easter eggs:** espalhados, nunca como gate  

---

## 14. Referências internas

- [Especificação completa v1.1](./especificacao.md) — requisitos, critérios de aceite, roadmap
- Perfil público: [linkedin.com/in/rafael-vieira1720](https://www.linkedin.com/in/rafael-vieira1720/)
- GitHub: [github.com/RafaelHDSV](https://github.com/RafaelHDSV)

---

*Última atualização: maio/2026 — pós-implementação da spec v1.1.*
