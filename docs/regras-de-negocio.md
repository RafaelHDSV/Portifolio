# Regras de negócio

> **Para que serve:** algoritmos e regras do domínio que a IA não deve reinventar
> **Fonte da verdade:** módulos de domínio no código
> **Relacionados:** [especificacao](especificacao.md) · [api](api.md) · [banco-de-dados](banco-de-dados.md)

## Curadoria de projetos (GitHub)

Fonte: `src/utils/repoFilters.ts`, `src/constants/projects.config.ts`.

1. **Topic `hide-portfolio` (forma primaria):** qualquer repositório cujo array `topics` da API
   contenha `hide-portfolio` (case-insensitive) **não** entra na listagem automática (pins,
   recentes, slots non-pin). Uso: no GitHub do repo → Settings → Topics → `hide-portfolio`.
2. **`forceExclude` / `hidden`:** escape hatch opcional por entrada em `projectsConfig` (sem lista
   hardcoded de nomes). Preferir o topic.
3. **`forceInclude`:** injeta ou mantém o repo mesmo se outras regras de elegibilidade o
   excluiriam — **exceto** quando há topic `hide-portfolio` ou `forceExclude`/`hidden`.
   Precedência: **hide (topic / forceExclude) > forceInclude**.
4. Demais regras (fork, prefixo `estudo`/`curso`, repo = username, demo URL para non-pin)
   permanecem em `shouldIncludeRepo` / `isEligibleNonPinnedRepo`.

## Outras regras de produto

1. **Logo:** monograma RV tipográfico
2. **Hero CTAs:** par Ver projetos + Baixar CV
3. **Eggs:** badge Explorador incrementado + novos theme-hunter e arrow-hint
4. **Imagens:** placeholder textual até o autor incluir assets
