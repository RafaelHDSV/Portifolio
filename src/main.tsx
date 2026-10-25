import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { VieiraAnalytics } from '@vieira/analytics/react'
import { InstitucionalProvider } from '@vieira/institucional'
import { AppErrorBoundary, initSentry } from '@vieira/institucional/sentry'
import App from './App'
import i18n from './i18n'
import { institucionalConfig } from './institucional.config'
import '@vieira/institucional/styles.css'

initSentry({
  enabled: import.meta.env.PROD,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: import.meta.env.VITE_SENTRY_RELEASE,
  allowUrls: [window.location.origin]
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InstitucionalProvider config={institucionalConfig}>
      <AppErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <App />
          <VieiraAnalytics projectKey='portifolio' />
        </I18nextProvider>
      </AppErrorBoundary>
    </InstitucionalProvider>
  </React.StrictMode>
)
