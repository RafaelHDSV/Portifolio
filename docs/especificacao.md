# Especificação de Desenvolvimento — Portfólio Rafael Vieira

> Documento de referência para levar o projeto do estágio atual ao **lançamento final** com qualidade visual, técnica e profissional.

**Versão:** 1.1  
**Data:** 18/05/2026  
**Última revisão:** decisões da seção 11 registradas  
**Repositório:** `portifolio/`  
**Stack:** React 18 · TypeScript · Vite · SASS · Emotion

---

## 1. Resumo executivo

O portfólio já possui estrutura funcional sólida: navegação por âncoras, hero com typewriter, integração com API do GitHub (About), carrossel de tecnologias, grade de 12 projetos com links, contato e alternância de tema claro/escuro. Porém, a experiência visual ainda não transmite o nível de um **produto final** — há contrastes abruptos, excesso de conteúdo sem hierarquia, telas de bloqueio em produção e inconsistências de design system.

**Objetivo desta especificação:** definir o que mudar, por quê, em que ordem e como validar que o portfólio está pronto para publicação profissional.

---

## 2. Estado atual (inventário)

### 2.1 O que já existe e funciona

| Área | Implementação atual | Arquivos principais |
|------|---------------------|---------------------|
| Estrutura SPA | Seções: Header, About, Languages, Projects, Contact, Footer | `App.tsx`, `screens/*` |
| Navegação | Navbar fixa com âncoras + toggle de tema | `Navbar.tsx`, `SwitchTheme.tsx` |
| Hero | Nome + typewriter + seta animada | `Header.tsx` |
| Sobre | Avatar e dados via GitHub API | `About.tsx`, `useGetMe.ts` |
| Tecnologias | Carrossel infinito de ícones | `Languages.tsx` |
| Projetos | 12 cards estáticos com imagem, stack, descrição e links | `ProjectsData.tsx`, `Projects.tsx` |
| Contato | 4 canais com hover revelando detalhe | `Contact.tsx` |
| UX extra | Cursor customizado, scroll-to-top, animações (react-awesome-reveal) | `CustomCursor.tsx`, etc. |
| Build | Vite + TypeScript + ESLint + Prettier | `vite.config.ts` |
| SEO básico | Meta tags OG no `index.html` | `index.html` |

### 2.2 Pendências técnicas para lançamento

| Item | Situação atual | Ação definida |
|------|----------------|---------------|
| `DevelopmentScreen` | Bloqueia produção com 30 cliques | **Remover gate**; reutilizar tela como easter egg opcional (ver §5.10) |
| `useGetRepos` | Comentado em `Projects.tsx` | **Ativar integração via API** com camada estática de curadoria (ver §5.6) |
| i18n | Apenas PT | **Implementar PT + EN** com toggle (ver §5.11) |
| Formulário de contato | Só links externos | **Adicionar form** via EmailJS (ver §5.7) |

### 2.3 Problemas visuais identificados (com base na UI atual)

1. **Contraste “boxy” nos cards de projeto** — bloco inferior usa `background: var(--text-color)` invertendo cores do tema; em dark mode gera blocos cinza-claros pesados contra fundo escuro.
2. **Barra de tecnologias desconectada** — faixa branca sólida (`background: var(--text-color)`) com gradiente branco fixo nas bordas; não se integra ao tema escuro.
3. **Tipografia fragmentada** — 5 famílias (`Cinzel`, `Roboto Condensed`, `Open Sans`, `Outfit`, `Schoolbell`) sem hierarquia clara; logo "RV" e nome "Rafael Vieira" usam estilos distintos.
4. **Hero genérico** — imagem de fundo (`background.png`) em 70% com glow animado; pouco diferenciado de templates comuns.
5. **Grade de 12 projetos sem curadoria** — todos com o mesmo peso visual; descrições longas em fonte pequena; screenshots com proporções diferentes.
6. **Espaçamentos fixos** — `padding: 0 10rem` nos projetos e about; quebra em telas médias/pequenas.
7. **Transição global** — `* { transition: 300ms all ease }` em `_global.scss` afeta performance e gera animações indesejadas.
8. **Sobre sem narrativa** — apenas estatísticas do GitHub; falta bio profissional, proposta de valor e CTA claro.
9. **Navbar sem menu mobile** — links sempre visíveis; em mobile provavelmente quebra ou fica apertado.
10. **Cursor customizado** — pode prejudicar acessibilidade e usuários com `prefers-reduced-motion`.

---

## 3. Visão do produto final

### 3.1 Proposta de valor

> Portfólio de Rafael Vieira, desenvolvedor Front-End, que comunica em segundos **quem ele é**, **o que sabe fazer** e **provas concretas de trabalho** — com design moderno, acessível e performático.

### 3.2 Princípios de design

- **Clareza antes de ornamentação** — cada seção responde a uma pergunta do visitante.
- **Hierarquia visual** — destaque para 3–4 projetos principais; demais em segundo plano.
- **Coerência de marca** — paleta, tipografia e espaçamento unificados via design tokens.
- **Dark-first** — tema escuro como padrão (alinhado ao mercado dev); light mode como alternativa polida.
- **Motion com propósito** — animações sutis; respeitar `prefers-reduced-motion`.
- **Mobile-first** — layout pensado primeiro para 375px, depois escalado.

### 3.3 Personas e jornadas

| Persona | Objetivo ao visitar | Seções críticas |
|---------|---------------------|-----------------|
| Recrutador / RH | Avaliar fit técnico em < 2 min | Hero, Projetos em destaque, CV, Contato |
| Tech Lead | Ver qualidade de código e stack | Projetos (links GitHub), Tecnologias |
| Cliente freelance | Entender o que você entrega e como contratar | Hero, Sobre (bio), Contato |

---

## 4. Design system (redefinição)

### 4.1 Paleta de cores

Substituir variáveis atuais por tokens semânticos:

```scss
// Exemplo de estrutura alvo — valores finais a definir na implementação
:root {
  // Superfícies
  --color-bg: #0a0a0b;
  --color-surface: #141416;
  --color-surface-elevated: #1c1c1f;
  --color-border: rgba(255, 255, 255, 0.08);

  // Texto
  --color-text-primary: #f4f4f5;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;

  // Marca
  --color-accent: #38bdf8;        // evoluir do #349bd3 atual
  --color-accent-hover: #7dd3fc;

  // Estados
  --color-success: #22c55e;
  --color-error: #ef4444;
}
```

**Regra:** eliminar inversões manuais `background: var(--text-color)` nos cards; usar `--color-surface-elevated` sempre.

### 4.2 Tipografia — **decisão: manter Cinzel**

| Uso | Família | Pesos |
|-----|---------|-------|
| Marca / display | **`Cinzel Decorative`** — nome no hero, logo "RV", títulos principais | 600–700 |
| Corpo / UI | **`Outfit`** (já no projeto) ou `Inter` | 400, 500, 600 |

**Remover do projeto:** `Roboto Condensed`, `Open Sans` e `Schoolbell` como fontes globais — hoje competem com Cinzel e quebram a identidade.

#### Cinzel — pontos positivos e negativos

| ✅ Manter | ⚠️ Cuidados (não é motivo para trocar, só regras de uso) |
|-----------|----------------------------------------------------------|
| Identidade elegante e memorável no nome | Legibilidade cai em textos longos e `< 14px` — **não usar em parágrafos** |
| Diferencia o portfólio de templates “sans genérico” | Peso da fonte no carregamento — usar só 1–2 pesos via Google Fonts |
| Combina bem com sans moderna (Outfit) | Decorative é ornamentada — evitar em labels, badges e formulários |

**Regra de ouro:** Cinzel só em **display** (hero, logo, opcionalmente títulos de seção). Todo o restante em Outfit.

**Quando reconsiderar a troca:** se no mobile o nome quebrar layout ou o Lighthouse apontar regressão grave de CLS por fonte — aí avaliar `Cinzel` (menos ornamental) em vez de `Cinzel Decorative`, sem abandonar a família.

**Escala tipográfica (clamp para responsividade):**

```scss
--text-display: clamp(2.5rem, 5vw, 4rem);   // Hero
--text-h2: clamp(1.75rem, 3vw, 2.25rem);    // Títulos de seção
--text-body: clamp(0.9375rem, 1.5vw, 1.0625rem);
--text-small: 0.875rem;
```

### 4.3 Espaçamento e layout

```scss
--space-section-y: clamp(4rem, 10vh, 8rem);
--space-container-x: clamp(1rem, 5vw, 6rem);
--max-width-content: 1200px;
--radius-card: 12px;
--radius-button: 9999px;
```

**Container padrão:** classe utilitária `.container` centralizada com `max-width` e padding horizontal via token — substituir `10rem` fixos.

### 4.4 Componentes base (criar/reutilizar)

| Componente | Responsabilidade |
|------------|------------------|
| `Container` | Largura máxima + padding responsivo |
| `SectionTitle` | Título de seção + subtítulo opcional + linha decorativa |
| `Button` | Variantes: primary, secondary, ghost |
| `Card` | Superfície elevada, borda sutil, hover lift |
| `Badge` | Tags de tecnologia nos projetos |
| `IconButton` | Contato e links sociais |

---

## 5. Especificação por seção

### 5.1 Tela "Em desenvolvimento" — sem bloqueio

**Situação:** `DevelopmentScreen` bloqueia produção até 30 cliques.

**Decisão registrada:**

- [ ] Remover bloqueio em `App.tsx` — portfólio sempre visível em produção.
- [ ] Transformar `DevelopmentScreen` em **easter egg desbloqueável** (ex.: 30 cliques na palavra "portfólio" no hero, ou sequência Konami) — ver §5.10.
- [ ] Assets espaciais (astronautas) também no easter egg e/ou 404 customizado.

**Critério de aceite:** URL pública (`*.vercel.app`) abre o portfólio imediatamente; easter eggs são bônus, nunca barreira.

---

### 5.2 Navbar

**Melhorias:**

- [ ] Menu hamburger para `< 768px` com drawer ou dropdown animado.
- [ ] Estado `active` no link da seção visível (Intersection Observer).
- [ ] Navbar com `backdrop-filter: blur()` e borda inferior sutil ao rolar.
- [ ] Logo "RV" em **Cinzel Decorative** (mesma família do hero).
- [ ] Link "CV" ou botão CTA discreto na navbar (além do botão na seção Sobre).
- [ ] **Toggle de idioma PT | EN** (ícone globo ou abreviação) — ver §5.11.

**Critério de aceite:** navegação utilizável em iPhone SE e desktop 1920px; link ativo reflete a seção atual.

---

### 5.3 Hero (Header)

**Problema atual:** fundo estático + glow genérico; falta CTA e proposta clara.

**Layout alvo:**

```
[Navbar]

        Rafael Vieira
        Desenvolvedor Front-End · React · TypeScript

        [Ver projetos]  [Baixar CV]  [GitHub]

                    ↓ (scroll indicator)
```

**Melhorias:**

- [ ] Substituir `background.png` por: gradiente mesh animado leve, grid sutil ou partículas CSS (performance-friendly).
- [ ] Reduzir strings do typewriter para 2–3 frases impactantes (evitar lista longa de tecnologias).
- [ ] Adicionar CTAs primário e secundário acima da dobra.
- [ ] Ajustar animação `bubbleAnimation` — glow excessivo compete com o texto.
- [ ] Garantir contraste WCAG AA no texto sobre o fundo.

**Critério de aceite:** em 5 segundos o visitante entende nome, papel e tem 2 ações claras.

---

### 5.4 Sobre (About)

**Problema atual:** só dados do GitHub; retorna `null` enquanto carrega (flash vazio).

**Melhorias:**

- [ ] Adicionar parágrafo de bio (3–5 linhas) com tom profissional e objetivo — pode ser estático em constante ou complementar API.
- [ ] Skeleton/placeholder durante loading (não retornar vazio).
- [ ] Reorganizar layout: mobile = avatar acima, desktop = duas colunas.
- [ ] Destacar 2–3 conquistas (certificações, formação, empresa) além de followers/seguindo.
- [ ] Botão "Baixar CV" com ícone e estado de hover consistente com design system.
- [ ] Considerar link "Ver no GitHub" no perfil.

**Critério de aceite:** seção compreensível sem depender só de métricas sociais do GitHub.

---

### 5.5 Tecnologias (Languages)

**Problema atual:** faixa branca sólida; gradientes fixos em branco.

**Melhorias:**

- [ ] Renomear seção na UI para **"Stack"** ou **"Tecnologias"** com título visível (`SectionTitle`).
- [ ] Fundo integrado: `var(--color-surface)` com borda top/bottom, sem bloco branco.
- [ ] Gradientes de fade nas bordas usando a cor de fundo do tema (CSS variable), não branco hardcoded.
- [ ] Agrupar por categoria (Frontend · Backend · Ferramentas) OU manter carrossel mas com labels ao hover.
- [ ] Pausar animação no hover e com `prefers-reduced-motion: reduce`.

**Critério de aceite:** seção visualmente contínua no dark mode; sem “corte” branco no meio da página.

---

### 5.6 Projetos (Projects) — prioridade alta

**Problema atual:** 12 cards iguais, contraste alto, textos longos, imagens desalinhadas.

**Estratégia de conteúdo:**

| Tier | Quantidade | Critério |
|------|------------|----------|
| Destaque | 3–4 | Melhores projetos (Plann.er, Netflix Clone, Controle Financeiro, etc.) |
| Demais | 6–8 | Grid compacto ou lista; acesso via filtro / "Ver todos" |
| Externo | — | Botão "Ver mais no GitHub" (já existe) |

**Layout alvo — card de destaque:**

```
┌─────────────────────────────┐
│  [Screenshot 16:9 uniforme] │
├─────────────────────────────┤
│  Título                     │
│  [React] [TS] [CSS] badges  │
│  Descrição curta (2 linhas) │
│  Ver demo · GitHub          │
└─────────────────────────────┘
```

**Melhorias técnicas e visuais:**

- [ ] Padronizar screenshots: ratio 16:9, `object-fit: cover`, overlay gradient no hover.
- [ ] Encurtar descrições para ~120 caracteres; texto completo em modal ou tooltip opcional.
- [ ] Substituir bloco inferior invertido por `Card` com `--color-surface-elevated`.
- [ ] Tags de stack como `Badge` chips (não círculos com tooltip pesado).
- [ ] Hover no card: `translateY(-4px)`, borda accent, sombra suave.
- [ ] Filtros por tecnologia (React, JS puro, API) — tabs ou chips.
- [ ] Lazy loading de imagens (`loading="lazy"`).
- [ ] Avaliar paginação ou "Mostrar mais" após 6 itens.

**Integração GitHub — decisão: API** ✅

Modelo **híbrido** (API + curadoria local):

| Camada | Fonte | Responsabilidade |
|--------|--------|------------------|
| Lista de repos | `useGetRepos` → `GithubRepository` | Nome, URL, `homepage`, topics, stars, `updated_at` |
| Apresentação | `ProjectsData` (ou `projects.config.ts`) | `featured`, imagem, descrição PT/EN, ordem, ocultar repo |
| Render | `Projects.tsx` | Merge por `repo.full_name` ou `key` mapeado |

**Regras da API:**

- [ ] Exibir apenas repos com **`homepage`** definido **ou** flag `featured: true` no config local.
- [ ] Ordenar: featured primeiro → `updated_at` desc.
- [ ] Fallback: se API falhar, mostrar só projetos do config estático (12 atuais).
- [ ] Loading skeleton na grade; erro discreto + retry.
- [ ] Token em `VITE_GITHUB_ACCESS_TOKEN` (já previsto em `environment.ts`).

**Critério de aceite:** novos deploys no GitHub com homepage aparecem sem editar código; curadoria visual continua sob seu controle.

---

### 5.7 Contato (Contact) — **formulário via EmailJS** ✅

**Pacote:** [`@emailjs/browser`](https://www.emailjs.com/docs/examples/reactjs/) — envia e-mail direto do front sem backend próprio; combina bem com Vite e deploy na Vercel.

**Alternativa equivalente:** `@formspree/react` — usar só se preferir dashboard Formspree em vez de templates EmailJS.

**Layout alvo:**

```
[Ícones: Email · WhatsApp · GitHub · LinkedIn]

[Formulário]
  Nome · E-mail · Mensagem
  [Enviar]  → feedback: enviando / sucesso / erro
```

**Implementação:**

- [ ] Instalar `@emailjs/browser`.
- [ ] Variáveis de ambiente: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.
- [ ] Campos: nome, e-mail, mensagem; validação HTML5 + mensagens traduzidas (PT/EN).
- [ ] Estados: loading no botão, toast ou banner de sucesso/erro.
- [ ] Manter cards de redes sociais; formulário como canal principal de mensagem longa.
- [ ] Frase de encerramento i18n: *"Aberto a oportunidades e projetos freelance."*
- [ ] Área de toque mínima 44×44px em mobile.

**Critério de aceite:** mensagem de teste chega na caixa de entrada configurada no EmailJS; chaves não commitadas (apenas `.env`).

---

### 5.10 Easter eggs — **espalhados pelo projeto** ✅

**Princípio:** divertidos e opcionais; **nunca bloqueiam** conteúdo nem prejudicam SEO ou acessibilidade.

| # | Gatilho sugerido | Recompensa |
|---|------------------|------------|
| 1 | 30 cliques em "portfólio" (ou palavra-chave no hero) | Overlay `DevelopmentScreen` com astronautas + mensagem |
| 2 | Código Konami (↑↑↓↓←→←→BA) | Tema accent alternativo por 30s ou confete CSS leve |
| 3 | 5 cliques rápidos no logo "RV" | Console art + link secreto para repo favorito |
| 4 | Scroll até o fim e voltar ao topo 3× | Badge flutuante temporário "Explorador" |
| 5 | Campo e-mail do form com texto `rocket` | Placeholder easter egg na resposta de sucesso |
| 6 | `?mode=space` na URL | Fundo com estrelas extras na hero (query param documentado só no console) |

**Implementação técnica:**

- [ ] Hook `useEasterEgg(id, trigger)` centralizando listeners.
- [ ] Persistir descobertas em `localStorage` (`eggs-unlocked`) — opcional UI "X/6".
- [ ] Desativar animações extras com `prefers-reduced-motion`.
- [ ] Não esconder links de contato, CV ou projetos atrás de eggs.

**Critério de aceite:** recrutador que não interage com eggs tem experiência 100% profissional; quem explora encontra detalhes memoráveis.

---

### 5.11 Internacionalização — **PT + EN** ✅

**Escopo:** todo texto de UI (navbar, seções, botões, formulário, toasts, easter eggs). Conteúdo de projetos: descrições em ambos idiomas no config; dados da API GitHub permanecem no idioma original do repo.

**Stack sugerida:** `react-i18next` + `i18next` + arquivos `src/locales/pt.json` e `src/locales/en.json`.

**Comportamento:**

- [ ] Idioma padrão: **PT** (navegador `pt-*` mantém PT; demais → EN ou PT conforme preferência salva).
- [ ] Toggle na navbar; preferência em `localStorage` (`locale`).
- [ ] Atributo `lang` no `<html>` atualizado dinamicamente.
- [ ] Typewriter do hero com strings por idioma.
- [ ] Meta tags OG: considerar `hreflang` futuro se houver domínio custom; em `*.vercel.app` uma URL basta.

**Critério de aceite:** alternar idioma atualiza toda a página sem reload; escolha persiste na próxima visita.

---

### 5.12 Deploy e domínio — **Vercel** ✅

| Item | Valor |
|------|--------|
| Hospedagem | Vercel (já alinhado ao `og:url` atual) |
| URL | `https://rafaelhdsv.vercel.app` (ou subdomínio Vercel do projeto) |
| Domínio custom | **Fora do escopo v1** — permanece `*.vercel.app` |

- [ ] Variáveis de ambiente configuradas no painel Vercel (GitHub token, EmailJS).
- [ ] Preview deployments por PR.
- [ ] Atualizar `og:url` e screenshot OG após redesign.

---

### 5.8 Footer

**Melhorias:**

- [ ] Incluir links sociais (ícones) além da navegação repetida.
- [ ] Texto: `© {ano} Rafael Vieira · Desenvolvedor Front-End`.
- [ ] Link "Voltar ao topo" opcional (já existe `ScrollToTopButton`).

---

### 5.9 Componentes globais

#### Cursor customizado

- [ ] Desabilitar quando `prefers-reduced-motion: reduce` ou em touch devices (`matchMedia('(pointer: fine)')`).
- [ ] Manter cursor padrão do sistema como fallback.

#### Animações

- [ ] Remover `transition: all` global; transicionar apenas propriedades específicas (`color`, `background`, `transform`, `opacity`).
- [ ] Padronizar: Fade para seções, stagger leve nos cards — evitar excesso de Bounce.

#### Loading inicial

- [ ] Substituir tela branca de 1s por skeleton do layout ou remover delay artificial se não houver assets críticos.

#### Tema claro/escuro

- [ ] Persistir preferência em `localStorage`.
- [ ] Revisar todas as variáveis no light mode (especialmente Languages e Projects).
- [ ] Ícone do toggle refletindo estado atual.

---

## 6. Requisitos técnicos

### 6.1 Performance

| Métrica | Meta (Lighthouse mobile) |
|---------|--------------------------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

**Ações:**

- [ ] Otimizar imagens (WebP/AVIF, dimensões corretas).
- [ ] Code-splitting se adicionar bibliotecas pesadas.
- [ ] `font-display: swap` nas fontes Google.
- [ ] Preconnect para APIs externas (GitHub).

### 6.2 Acessibilidade (WCAG 2.1 AA)

- [ ] Contraste mínimo 4.5:1 em textos.
- [ ] `aria-label` em links só com ícone.
- [ ] Navegação por teclado na navbar e cards.
- [ ] `focus-visible` estilizado.
- [ ] Respeitar `prefers-reduced-motion`.
- [ ] Remover `maximum-scale=1.0` do viewport (impede zoom em iOS — acessibilidade).

### 6.3 SEO e compartilhamento

- [ ] Atualizar `og:image` para screenshot real do site (1200×630), não o favicon.
- [ ] Adicionar `twitter:card`.
- [ ] JSON-LD `Person` com links sociais.
- [ ] `sitemap.xml` e `robots.txt` na pasta `public/`.

### 6.4 Qualidade de código

- [ ] Remover pasta `components/UNUSED Tooltip` ou integrar de fato.
- [ ] Resolver código comentado em `Projects.tsx` (decisão sobre `useGetRepos`).
- [ ] Extrair tipos de `ProjectsData` para `types/IProject.ts`.
- [ ] Mover ícones de linguagem para componente `TechIcon` (evitar JSX no array de dados).
- [ ] Testes: pelo menos smoke test com Vitest + Testing Library para App e Navbar.

---

## 7. Conteúdo a preparar (checklist do autor)

Antes da implementação visual final, reunir:

- [ ] Bio profissional (português, ~80 palavras).
- [ ] Frase de headline alternativa ao typewriter.
- [ ] Lista definitiva de **4 projetos em destaque** com descrições curtas.
- [ ] Screenshots padronizados (mesma resolução e crop).
- [ ] CV em PDF atualizado em `public/cv.pdf`.
- [ ] Foto/avatar profissional (se não usar só GitHub).
- [ ] URL final de deploy e domínio customizado (se houver).

---

## 8. Roadmap de implementação

### Fase 0 — Liberação (1–2 dias) 🔴 Crítico

1. Remover gate `DevelopmentScreen` em produção.
2. Corrigir viewport (`maximum-scale`).
3. Configurar env na Vercel (GitHub, EmailJS).
4. Deploy de smoke test em `*.vercel.app`.

### Fase 1 — Fundação visual (3–5 dias)

1. Novo design system em `_variables.scss` + `_global.scss`.
2. Componentes base (`Container`, `SectionTitle`, `Button`, `Card`, `Badge`).
3. Refatorar Navbar (mobile + scroll state).

### Fase 2 — Seções principais (5–7 dias)

1. Hero redesenhado com CTAs.
2. About com bio + skeleton.
3. Languages integrado ao tema.
4. Projects: cards novos + curadoria (4 destaques + grid).

### Fase 3 — Polimento (3–4 dias)

1. Contact (EmailJS) e Footer.
2. i18n PT/EN completo.
3. Easter eggs (§5.10).
4. Acessibilidade e reduced-motion.
5. Performance (imagens, fontes Cinzel/Outfit).
6. SEO (OG image, JSON-LD).

### Fase 4 — Qualidade e lançamento (2–3 dias)

1. Testes automatizados básicos.
2. Revisão cross-browser (Chrome, Firefox, Safari, mobile).
3. Atualizar README e screenshot em `public/main.png`.
4. Lançamento v1.0.0 — tag GitHub.

**Estimativa total:** 14–21 dias de desenvolvimento focado.

---

## 9. Critérios de aceite do projeto final

O portfólio será considerado **concluído** quando todos os itens abaixo forem verdadeiros:

### Funcional
- [ ] Site acessível publicamente sem easter eggs **bloqueando** conteúdo.
- [ ] Toggle PT/EN funcional em todas as seções.
- [ ] Formulário EmailJS envia e confirma sucesso.
- [ ] Projetos carregam via API com fallback estático.
- [ ] Todas as âncoras de navegação funcionam com scroll suave.
- [ ] Links de projetos (demo + GitHub) abrem corretamente.
- [ ] CV baixa o arquivo correto.
- [ ] Tema persiste entre sessões.
- [ ] Contato: email, WhatsApp, GitHub e LinkedIn funcionais.

### Visual
- [ ] Aparência coesa em dark mode (padrão) e light mode.
- [ ] Nenhuma faixa ou bloco com cor "estranha" desconectada do fundo.
- [ ] Hierarquia clara: hero → destaques → demais projetos.
- [ ] Responsivo sem overflow horizontal em 375px, 768px e 1280px.

### Técnico
- [ ] `yarn build` sem erros.
- [ ] `yarn lint` sem warnings.
- [ ] Lighthouse mobile nas metas da seção 6.1.
- [ ] Sem transição global em `*`.

### Profissional
- [ ] Recrutador consegue entender perfil, ver projetos e entrar em contato em menos de 3 minutos.
- [ ] README do repositório reflete o estado final com screenshot atualizado.

---

## 10. Referências e inspiração (direção visual)

Usar como referência de **estrutura e polish**, não cópia:

- Portfólios com hero minimalista + projetos em Bento grid.
- Uso moderado de glassmorphism e bordas `1px` semi-transparentes.
- Micro-interações em hover de cards (elevação + borda luminosa).

**Direção sugerida para Rafael:** dark elegante, accent azul-ciano (`#38bdf8`), **Cinzel Decorative** no nome/marca, **Outfit** no restante.

---

## 11. Decisões registradas ✅

| # | Pergunta | Decisão |
|---|----------|---------|
| 1 | Tipografia display | **Manter `Cinzel Decorative`** no hero e logo; corpo em **Outfit**; ver regras em §4.2 |
| 2 | Fonte dos projetos | **API GitHub** + config local para imagens, featured e textos (§5.6) |
| 3 | Idiomas | **PT + EN** com toggle na navbar (§5.11) |
| 4 | Domínio | **`*.vercel.app`** (sem domínio custom na v1) (§5.12) |
| 5 | Formulário | **Sim** — `@emailjs/browser` + variáveis no `.env` / Vercel (§5.7) |
| 6 | Easter eggs | **Sim, espalhados** — nunca como gate; lista em §5.10 |

*Nenhuma decisão pendente para iniciar a Fase 0.*

---

## 12. Anexo — mapa de arquivos a modificar

```
src/
├── App.tsx                          # Sem gate; providers i18n
├── styles/
│   ├── _variables.scss              # Design tokens
│   ├── _fonts.scss                  # Só Cinzel + Outfit
│   └── _global.scss                 # Remover transition global
├── locales/
│   ├── pt.json                      # NOVO
│   └── en.json                      # NOVO
├── hooks/
│   ├── useGetRepos.ts               # Ativar em Projects
│   └── useEasterEgg.ts              # NOVO
├── components/
│   ├── Navbar/                      # Mobile + locale toggle
│   ├── ContactForm/                 # NOVO (EmailJS)
│   ├── Container/                   # NOVO
│   ├── SectionTitle/                # NOVO
│   ├── Button/                      # NOVO
│   ├── Card/                        # NOVO
│   └── Badge/                       # NOVO
├── screens/
│   ├── Header/                      # Hero + eggs
│   ├── About/                       # Bio i18n + skeleton
│   ├── Languages/                   # Tema integrado
│   ├── Projects/                    # API merge + cards
│   ├── Contact/                     # Form + redes
│   └── DevelopmentScreen/           # Só easter egg overlay
├── constants/
│   └── projects.config.ts           # featured, imagens, i18n
└── index.html                       # SEO + lang dinâmico
```

**Dependências novas previstas:**

```bash
yarn add @emailjs/browser i18next react-i18next
```

---

*Documento vivo — v1.1 com decisões do autor incorporadas.*
