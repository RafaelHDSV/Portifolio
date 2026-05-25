# Analise — evolucao v3 do portfolio

Documento explicativo sobre itens do backlog pos-v2.1. **Nao implementados nesta versao.**

---

## 1. OG image gerada automaticamente

### O que e

A **Open Graph image** e a imagem exibida quando alguem compartilha o link do portfolio no WhatsApp, LinkedIn, Twitter/X ou Slack. Hoje o site usa `public/main.png` estatico.

**OG image automatica** significa gerar essa imagem dinamicamente — por exemplo com nome, cargo, stack e foto — sempre atualizada com o conteudo do site.

### Como funciona na pratica

| Abordagem | Descricao |
|-----------|-----------|
| **Vercel OG** | Rotas serverless que renderizam HTML/SVG em PNG (Satori + @vercel/og) |
| **Screenshot CI** | Pipeline gera PNG apos deploy |
| **Servico externo** | Bannerbear, Placid, etc. |

### Beneficios

- Preview profissional e consistente em redes sociais
- Atualiza cargo/stack sem editar PNG manualmente
- Suporte a variantes (PT/EN, modo recrutador)

### Esforco estimado

2–4 dias (rota OG + template + testes em WhatsApp/LinkedIn).

---

## 2. Testes E2E com Playwright

### O que e

**E2E (end-to-end)** testa o site como um usuario real: abre o navegador, clica, rola, troca idioma, envia formulario.

**Playwright** e a ferramenta (Microsoft) que automatiza Chrome, Firefox e Safari.

### Diferenca de testes unitarios

| Tipo | O que cobre |
|------|-------------|
| Unitario (Vitest) | Funcoes isoladas (`parseReadmeMedia`, `filterReposForPortfolio`) |
| E2E (Playwright) | Fluxos completos (hero → projetos → modal contato) |

### Fluxos criticos sugeridos para o portfolio

1. Home carrega em PT e EN
2. Toggle tema persiste apos reload
3. Filtros de projetos (multi AND)
4. Modal de contato abre e valida campos
5. Links externos (CV, GitHub) com `href` correto

### CI

GitHub Actions roda Playwright em cada PR; falha se regressao visual ou funcional.

### Esforco estimado

3–5 dias (setup + 5–8 cenarios + CI).

---

## 3. Modo recrutador (PDF one-pager)

### O que e

Versao **resumida do portfolio em uma pagina**, otimizada para RH/recrutadores que gastam poucos segundos por candidato.

### Conteudo tipico

- Nome, cargo, localizacao, contato
- Bio em 3–4 linhas
- Stack principal (5–8 itens)
- 3 projetos destaque com link
- QR code ou URL curta
- Botao **Imprimir / Salvar PDF** (CSS `@media print` ou geracao estatica)

### Implementacao possivel

| Opcao | Pros | Contras |
|-------|------|---------|
| Rota `/recruiter` | Simples, shareable | Manter sync com home |
| Print CSS na home | Zero pagina extra | Layout atual e longo |
| PDF gerado no build | Arquivo fixo para anexar | Desatualiza sem rebuild |

### Esforco estimado

2–3 dias (layout print + rota dedicada + i18n).

---

## Prioridade sugerida

1. OG automatica — maior impacto em compartilhamento
2. E2E Playwright — seguranca antes de refactors
3. Modo recrutador — diferencial em processos seletivos

---

*Referencia: secao 11 da epic v2.1 · maio/2026*
