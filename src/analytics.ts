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
      user_id: u.id ?? u.email,
    });
    // user_properties
    ReactGA.gtag('set', 'user_properties', {
      email: u.email,
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
      email: undefined,
      language: undefined,
      first_name: undefined,
      last_name: undefined,
      credits: undefined,
    });
  });
};
