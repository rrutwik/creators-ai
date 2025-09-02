import ReactGA from 'react-ga4';

export const GA_MEASUREMENT_ID = 'G-ZQ6YKQY8JC';

// Guard + queue to avoid race conditions when GA is not yet initialized
let gaInitialized = false;
const gaQueue: Array<() => void> = [];
const runOrQueue = (fn: () => void) => {
  if (gaInitialized) fn();
  else gaQueue.push(fn);
};

export const initGA = () => {
  if (gaInitialized) return;
  try {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    gaInitialized = true;
    // Optional: initial pageview
    try {
      ReactGA.send('pageview');
    } catch (_) {}

    while (gaQueue.length) {
      const fn = gaQueue.shift();
      try { fn && fn(); } catch (e) { console.error('GA queued call failed:', e); }
    }
  } catch (e) {
    console.error('Failed to initialize GA:', e);
  }
};

export interface AnalyticsUser {
  id?: string;
  email: string;
  language?: string;
  first_name?: string;
  last_name?: string;
  credits?: number;
}

export const setUser = (u: AnalyticsUser) => {
  runOrQueue(() => {
    // user_id
    ReactGA.gtag('config', GA_MEASUREMENT_ID, {
      user_id: u.id ?? u.email ?? 'unknown',
    });
    // user_properties
    ReactGA.gtag('set', 'user_properties', {
      language: u.language,
      first_name: u.first_name,
      last_name: u.last_name,
      credits: u.credits ?? 0,
    });
  });
};

export const trackLogin = (method: string = 'google') => {
  runOrQueue(() => ReactGA.event('login', { method }));
};

export const clearUser = () => {
  runOrQueue(() => {
    ReactGA.gtag('config', GA_MEASUREMENT_ID, { user_id: undefined });
    ReactGA.gtag('set', 'user_properties', {
      language: undefined,
      first_name: undefined,
      last_name: undefined,
      credits: undefined,
    });
  });
};

// Generic event helper + specific trackers for common funnels
export const trackEvent = (name: string, params: Record<string, any> = {}) => {
  runOrQueue(() => ReactGA.event(name as any, params));
};

export const trackPageView = (path?: string) => {
  runOrQueue(() => {
    if (path) ReactGA.send({ hitType: 'pageview', page: path } as any);
    else ReactGA.send('pageview');
  });
};

export const trackSignup = (method: string = 'google') => {
  runOrQueue(() => ReactGA.event('sign_up' as any, { method }));
};

export const trackLogout = () => {
  runOrQueue(() => ReactGA.event('logout' as any));
};

export const trackLanguageChange = (language: string) => {
  runOrQueue(() => ReactGA.event('language_change' as any, { language }));
};

export const trackThemeChange = (theme: 'light' | 'dark') => {
  runOrQueue(() => ReactGA.event('theme_change' as any, { theme }));
};

// PWA-related events
export const trackPWAInstallPromptShown = () => {
  runOrQueue(() => ReactGA.event('pwa_install_prompt_shown' as any));
};

export const trackPWAInstallOutcome = (outcome: 'accepted' | 'dismissed') => {
  runOrQueue(() => ReactGA.event('pwa_install_prompt_outcome' as any, { outcome }));
};

export const trackPWAInstalled = () => {
  runOrQueue(() => ReactGA.event('pwa_installed' as any));
};
