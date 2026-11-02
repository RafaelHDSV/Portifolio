# Frontend

> **Para que serve:** mapa da SPA do portfólio e regra de indexação.
> **Fonte da verdade:** `src/App.tsx`, `index.html`, `public/robots.txt`, `public/sitemap.xml`.

## SEO e indexação

Site público no apex `https://getvieira.com`. Metadados de crawler (Open Graph, JSON-LD, canonical) ficam no `index.html`. A imagem OG canônica é `/og-pt.png` (1200×630, gerada no build com a marca e o avatar); `/api/og` redireciona por compatibilidade. Não usar um `og.png` genérico neste repo.

`public/robots.txt` permite `/` e aponta o sitemap. O sitemap lista home, `/privacidade`, `/termos` e imagens OG.

Ícones: o conjunto já existente em `public/` (`favicon.ico`, `icon-48.png`, `icon-192.png`, `icon.png` 512, `apple-touch-icon.png`) e `site.webmanifest`. A marca RV e o OG com foto não devem ser substituídos pelo gerador genérico dos outros apps.

`<Seo>` define o título da aba (`Portfólio` / `Recrutador`). `/privacidade` e `/termos` usam o `Seo` do `LegalPage`.
