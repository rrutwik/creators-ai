import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import './styles/globals.css';  
import './i18n';
import { registerSW } from 'virtual:pwa-register';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "https://6b2849f870a9dff3b140c21831846a83@o4507185345527808.ingest.us.sentry.io/4509979759083520",
  integrations: [
    Sentry.consoleLoggingIntegration({ 
      levels: ["log", "warn", "error"]
    }),
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  tracesSampleRate: 1.0,
  enableLogs: true,
});

Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' })

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
