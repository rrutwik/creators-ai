import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import './styles/globals.css';  
import './i18n';
import { registerSW } from 'virtual:pwa-register';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "https://e18cb8ca1f0b60491c32335a924ee708@o4507185345527808.ingest.us.sentry.io/4507185347428352",
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 1.0,
  enableLogs: true,
});

const updateSW = registerSW({
  onNeedRefresh() {
    // Show update prompt UI here
    if (confirm('New version available. Refresh?')) updateSW()
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
