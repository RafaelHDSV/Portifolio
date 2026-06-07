# Analise e sugestoes — portfolio (pos-v2.9)

Documento gerado apos revisao do projeto em maio/2026. Complementa [`analise-evolucao-v3.md`](./analise-evolucao-v3.md).

---

## 1. Correcoes imediatas (baixo esforco)

| Item | Problema | Sugestao |
|------|----------|----------|
| **Cache de midia** | `mediaCache` em `resolveRepoMedia.ts` nunca expira; pode servir resultado errado apos mudanca no repo | TTL curto (ex.: 5 min) ou invalidar no reload da pagina |
| **Rate limit GitHub** | `useEnrichedProjects` faz 2+ requests por projeto (midia + languages) | Batch de languages ou cache em sessionStorage |
| **OG estatica** | `public/main.png` generico para compartilhamento | Ver secao 2 abaixo (OG automatica) |
| **Context.md desatualizado** | Easter eggs, fluxo de projetos e modo recrutador nao refletem v2.5–v2.9 | Atualizar secao 4 (Projects) e secao 7 (eggs) |
| **Testes unitarios de midia** | Regressoes v2.7–v2.9 em preview de cards | Vitest para `isLikelyDemoMedia`, `applyMediaToCard`, `sortReposByStarsSizeThenRecent` |
| **Erro de imagem quebrada** | URL invalida no README pode mostrar icone quebrado | `onError` no `<img>` do card → fallback para OG do GitHub |

---

## 2. Evolucao de produto (medio esforco)

Prioridade alinhada ao backlog v3, com itens novos identificados no codigo:

### 2.1 OG image automatica (v3 — ja documentada)

Maior impacto em LinkedIn/WhatsApp. `@vercel/og` ou rota serverless com nome, cargo e stack.

**Esforco:** 2–4 dias.

### 2.2 Testes E2E com Playwright (v3 — ja documentada)

Proteger fluxos: i18n, tema, filtros AND, modal contato, eggs, modo recrutador.

**Esforco:** 3–5 dias.

### 2.3 Modo recrutador — evolucao

Ja existe `RecruiterView` + botao na navbar. Proximos passos:

- Rota `/recruiter` compartilhavel (deep link)
- CSS `@media print` para PDF one-pager
- QR code apontando para CV ou WhatsApp
- Sync automatico dos 3 projetos destaque com pins GitHub

**Esforco:** 1–2 dias (print + rota); +1 dia QR e sync.

### 2.4 Curadoria hibrida de projetos

Hoje: 18 repos da API + `projects.config` como fallback. Sugestao:

- Flag `forceInclude` / `forceExclude` no config
- Campo `demoPriority: 'root' | 'config' | 'readme'` por repo
- Reduz surpresas quando a API muda a ordem

**Esforco:** 1 dia.

### 2.5 Performance e Core Web Vitals

- Code-split por secao (`React.lazy` em Projects, Contact)
- `manualChunks` no Vite (bundle JS ~517 kB)
- Preconnect para `opengraph.githubassets.com` e `raw.githubusercontent.com`
- Lighthouse CI no GitHub Actions (meta: Performance > 90 mobile)

**Esforco:** 2–3 dias.

---

## 3. UX e conteudo

| Sugestao | Detalhe |
|----------|---------|
| **Estado vazio de filtros** | Mensagem quando nenhum projeto corresponde aos filtros AND |
| **Skeleton por card** | Substituir skeleton generico por shimmer no formato 16:9 |
| **A11y nos cards** | `aria-label` nos botoes GitHub/demo; foco visivel no overlay |
| **Touch: stats no card** | Em mobile, botao "Ver stats" ou stats sempre visiveis no rodape do card |
| **Screenshots OG reais** | Atualizar `public/main.png` (1200x630) com foto + marca |
| **Secao LinkedIn** | Removida (jun/2026) — link de perfil permanece em Contato/Footer |

---

## 4. DevOps e qualidade

- **GitHub Actions:** `yarn lint` + `yarn build` em PR (se ainda nao houver workflow)
- **Preview deploys** Vercel por PR
- **Renovate/Dependabot** para Vite, React, ESLint
- **`.env.example`** documentar escopos do token (`repo` para privados)
- **Analytics:** revisar eventos `@vieira/analytics` (clique CV, egg, filtro)

---

## 5. Easter eggs — manutencao

Catalogo atual (~7 eggs). Sugestoes pos-v2.9:

- Egg "filtro ninja": aplicar 3+ filtros AND de uma vez
- Egg "CV rapido": 3 cliques no link CV
- Documentar eggs no README privado para nao vazar spoilers em repo publico

---

## 6. Roadmap sugerido (ordem)

```
1. Testes unitarios de midia + onError fallback     (1 dia)   — evita regressao v2.9
2. OG automatica                                    (2–4 dias)— compartilhamento
3. E2E Playwright                                   (3–5 dias)— confianca em refactors
4. Modo recrutador: rota + print                    (2 dias)  — diferencial RH
5. Performance (code-split + Lighthouse)              (2 dias)
6. Curadoria hibrida + cache API                    (1–2 dias)
```

**Total estimado:** 11–16 dias de incrementos, entregaveis em PRs separados.

---

## 7. Fora de escopo (por ora)

- Blog integrado
- CMS headless para projetos
- Autenticacao / area admin
- Dominio custom (depende de DNS/Vercel manual)

---

*Gerado em maio/2026 — pos-implementacao v2.9 (fallback OG + filtro README).*
