# Histórico de mudanças

> **Para que serve:** registro datado de mudanças notáveis — não é estado atual
> **Fonte da verdade:** o que entrou/saiu do produto em cada data
> **Relacionados:** [context](context.md) · [especificacao](especificacao.md) · [CHANGELOG](../CHANGELOG.md)

Use `CHANGELOG.md` na raiz para releases Keep a Changelog. Este arquivo guarda o detalhe por data.

## 2026-11-20

### Topic `hide-portfolio` (Portifolio#94)

- `repoFilters` exclui repos cujo `topics` contenha `hide-portfolio` (case-insensitive), inclusive
  contra `forceInclude`.
- Removidos `FORCE_EXCLUDED_REPO_NAMES` e os `forceExclude` da config de demos legadas — ocultação
  passa a ser só via topic (escape hatch `forceExclude`/`hidden` por entrada permanece no tipo).
- GraphQL pinned: `repositoryTopics(first: 20)`.
- Doc: `docs/regras-de-negocio.md`, menção em `docs/context.md` e `README.md`.

## 2026-11-17

### Search Console — redirect `?lang=` (board#26)

- `vercel.json`: 301 de `/?lang=en` e `/?lang=pt` para `/`.

## 2026-11-03

### Living docs (board#7)

- Conjunto canônico de 12 documentos em `docs/` alinhado ao padrão forge.
- Arquivos de comunidade e README vendável.

## Extraído do CHANGELOG

# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado

- Living docs (hub `docs/context.md`), arquivos de comunidade e README no padrão board#7.
