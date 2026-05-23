import { VieiraAnalytics } from '@vieira/analytics/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />

    <VieiraAnalytics
      projectKey='portifolio'
      endpoint='http://localhost:3693/v1'
    />
  </React.StrictMode>
)
