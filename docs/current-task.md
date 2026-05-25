# Tarefa atual — Panorama (origem da epic v2)

> Epic completa gerada: [`docs/especificacao-v2-refino-ui-ux.md`](./especificacao-v2-refino-ui-ux.md)  
> Para implementar, usar `ai-development-workflow.mdc` → proposta em `.issues/` → aprovacao → codigo.

## Panorama

- **Titulo:** Portifolio v2 — Refino UI/UX, Full-Stack e projetos dinamicos
- **Versao alvo:** v2.0
- **Problema:** Pos-v1.1 o site funciona, mas ha redundancias no hero, layout quebrado em projetos/stack, contato e footer abaixo do design system, identidade ainda Front-End, e easter eggs inconsistentes.
- **Solucao:** Polimento visual global; identidade Full-Stack; hero simplificado; about/stack/projects/contact/footer refatorados; pins + 10 recentes GitHub; filtros agregados; contato modal; eggs revisados.
- **Escopo da epic:** Header, Navbar, About, Languages, Projects (+ API GraphQL pins), Contact (+ Modal), Footer, EasterEggProvider, i18n, tokens SCSS, docs/context.md
- **Fora do escopo:** dominio custom, backend contato, novos idiomas, migracao de stack
- **Referencias:** docs/especificacao.md v1.1 · docs/context.md · PERSONAL-CVs · current-task (lista abaixo)
- **Decisoes ja tomadas:** ver secao 2 da epic v2 + secao 11 (logo RV, par CTAs, 7 eggs, placeholders)
- **Fases:** identidade/hero → about/stack → projects → contact/footer/eggs → polimento *(concluido)*
- **Status:** v2 implementada — `yarn build` e `yarn lint` OK

---

## Lista bruta de requisitos (autor)

- Pode alterar a logo
- Switch theme alinhado ao toggle de idioma
- Hero visualmente mais moderno (grid opcional)
- Liberdade para fontes, cores, espacamentos
- Hero: manter somente Typewriter (remover linha estatica duplicada)
- Estilizar `::selection`
- Remover palavra portfolio e easter egg do astronauta
- Hero: 1–2 CTAs no maximo (GitHub nao como botao diferente)
- Perfil **Full-Stack** (nao Front-End)
- CV sempre de PERSONAL-CVs/Curriculo.pdf (raw GitHub)
- Remover tag "Aberto a oportunidades"
- About: alinhar icone/texto; estilo DS; layout 1 ou 2 colunas (fix Seguindo)
- Stack: corrigir slider ou nova secao; icones maiores
- Projects: sem secao destaques separada; pins + 10 recentes; grid 3 col sempre; filtros multi AND; botoes demo/GitHub melhores; imagens dos repos
- Micro-interacoes visuais ao longo do site
- Contact: cards hover (versao antiga); form em modal; DS no form
- Remover texto freelance no contato
- Footer: "Easteregg a: X/6 descobertos"; sem voltar ao topo; menos centralizado
- Egg Explorador incrementado; Konami 100% roxo; remover egg portfolio
