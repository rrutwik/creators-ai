import ReactGA from 'react-ga4';

export const GA_MEASUREMENT_ID = 'G-ZQ6YKQY8JC';

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
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
};

export const trackLogin = (method: string = 'google') => {
  ReactGA.event('login', { method });
};

export const clearUser = () => {
  ReactGA.gtag('config', GA_MEASUREMENT_ID, { user_id: undefined });
  ReactGA.gtag('set', 'user_properties', {
    email: undefined,
    language: undefined,
    first_name: undefined,
    last_name: undefined,
    credits: undefined,
  });
};
