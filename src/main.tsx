import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import './styles/globals.css';  
import './i18n';
import { registerSW } from 'virtual:pwa-register';
import { initSentryWhenIdle } from './lib/sentry';

// Sentry loads after the page is interactive (see src/lib/sentry.ts), not before it.
initSentryWhenIdle();

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
