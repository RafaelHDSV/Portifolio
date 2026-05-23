/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VIEIRA_ANALYTICS_KEY?: string
  readonly VITE_VIEIRA_ANALYTICS_HOST?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
