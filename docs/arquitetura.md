# Arquitetura

> **Para que serve:** estrutura do repositório, ciclo de request e fronteiras de empacotamento/deploy
> **Fonte da verdade:** layout de pastas, entrypoints, `vercel.json` / scripts de build
> **Relacionados:** [context](context.md) · [api](api.md) · [ambiente-e-operacao](ambiente-e-operacao.md)

## Visão

```
src/
├── App.tsx                    # Shell principal + lazy sections
├── main.tsx                   # Bootstrap React + InstitucionalProvider + Sentry + I18nextProvider + analytics
├── institucional.config.ts    # Páginas legais (sem conta)
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
│  

## Fronteiras

| Fronteira | Nota |
|---|---|
| App vs docs | `docs/` é contrato de living docs (board#7), não runtime |
| Segredos | Só `.env` / painel do provedor — nunca no Git |

Dependências declaradas em `package.json` (amostra): @emailjs/browser, @sentry/react, @emotion/react, @phosphor-icons/react, satori, @vieira/analytics, @vieira/institucional, axios, dayjs, i18next, npm, react, react-animated-cursor, react-awesome-reveal, react-dom, react-i18next, react-icons, sharp, typewriter-effect, @lhci/cli, @sentry/vite-plugin, @playwright/test, @types/node, @types/react, @types/react-dom.
