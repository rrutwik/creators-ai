import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import gu from './locales/gu/translation.json';
import mr from './locales/mr/translation.json';

// Detect preferred language from localStorage or browser
const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
const browser = typeof navigator !== 'undefined' ? navigator.language?.split('-')[0] : 'en';
const fallbackLng = 'en';
const initialLng = stored || browser || fallbackLng;

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
      mr: { translation: mr },
    },
    lng: initialLng,
    fallbackLng,
    interpolation: {
      escapeValue: false,
    },
    returnEmptyString: false,
  });

// Persist language changes
i18n.on('languageChanged', (lng: string) => {
  try {
    localStorage.setItem('lang', lng);
    const html = document.documentElement;
    html.setAttribute('lang', lng);
  } catch {}
});

export default i18n;
