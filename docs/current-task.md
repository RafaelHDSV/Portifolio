# Issue #32 — Performance e Core Web Vitals

GitHub: https://github.com/RafaelHDSV/Portifolio/issues/32

- [x] Code-split: `React.lazy` em Projects, Contact e RecruiterView
- [x] `manualChunks` no Vite (phosphor, react-icons, i18n, reveal, emailjs)
- [x] Preconnect: `opengraph.githubassets.com`, `raw.githubusercontent.com`
- [x] Lighthouse CI — workflow push `main` + `workflow_dispatch` (assert Performance warn >= 0.9; baseline ~0.42)
- [x] `SectionFallback` + i18n `common.sectionLoading`

Proposta: `.issues/2026-05-27-performance-core-web-vitals.md`

Decisoes: CI push main; assert Performance error; lazy RecruiterView; so React.lazy (sem IO).
