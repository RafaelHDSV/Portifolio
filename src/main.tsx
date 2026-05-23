import { VieiraAnalytics } from '@vieira/analytics/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const ANALYTICS_KEY = import.meta.env.VITE_VIEIRA_ANALYTICS_KEY
const ANALYTICS_HOST = import.meta.env.VITE_VIEIRA_ANALYTICS_HOST

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {ANALYTICS_KEY && ANALYTICS_HOST && (
      <VieiraAnalytics
        projectKey={ANALYTICS_KEY}
        endpoint={ANALYTICS_HOST}
        debug={import.meta.env.DEV}
      />
    )}
  </React.StrictMode>
)
