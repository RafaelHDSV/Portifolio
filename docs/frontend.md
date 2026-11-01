# Frontend

> **Para que serve:** mapa da SPA do portfólio e regra de indexação.
> **Fonte da verdade:** `src/App.tsx`, `index.html`, `public/robots.txt`, `public/sitemap.xml`.

## SEO e indexação

Site público no apex `https://getvieira.com`. Metadados de crawler (Open Graph, JSON-LD, canonical) ficam no `index.html`. A imagem OG canônica é `/og-pt.png` (1200×630, gerada no build); `/api/og` redireciona por compatibilidade.

`public/robots.txt` permite `/` e aponta o sitemap. O sitemap lista home, `/privacidade`, `/termos` e imagens OG.

Ícones: `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png` / `icons/icon-192.png` e `icon-512`.

`<Seo>` define o título da aba (`Portfólio` / `Recrutador`). `/privacidade` e `/termos` usam o `Seo` do `LegalPage`.
