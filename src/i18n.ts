import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import gu from './locales/gu/translation.json';
import mr from './locales/mr/translation.json';

// Detect preferred language from localStorage or browser
const supportedLangs = ['en', 'hi', 'gu', 'mr'] as const;
type SupportedLang = typeof supportedLangs[number];

const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;

const browser = typeof navigator !== 'undefined' ? navigator.language?.split('-')[0] : null;
const fallbackLng: SupportedLang = 'en';
const initialLng: string = stored || browser || fallbackLng;

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

// If there's no stored preference and browser language isn't supported,
// attempt a lightweight geolocation-based default (non-blocking).
// if (!stored) {
//   (async () => {
//     try {
//       const res = await fetch('https://ipapi.co/json/');
//       if (!res.ok) return;
//       const data: any = await res.json();
//       const country: string | undefined = data?.country;
//       const region: string = (data?.region_code || data?.region || '').toUpperCase();
//       // Regional mapping within India
//       // Reference ISO 3166-2:IN codes commonly used by ip providers (e.g., UP, MH, GJ, DL, RJ, MP, BR, HR, UT, HP, JH, CT, JK, CH)
//       let geoLang: SupportedLang = 'en';
//       if (country === 'IN') {
//         const hindiBelt = new Set(['UP','MP','RJ','BR','HR','UT','UK','HP','JH','DL','CH','CT','JK','LA']);
//         const gujarati = new Set(['GJ','DN','DD']); // Gujarat, Dadra & Nagar Haveli, Daman & Diu
//         const marathi = new Set(['MH']); // Maharashtra

//         if (gujarati.has(region)) geoLang = 'gu';
//         else if (marathi.has(region)) geoLang = 'mr';
//         else if (hindiBelt.has(region)) geoLang = 'hi';
//         else geoLang = 'hi'; // Default within India -> Hindi
//       }
//       if (i18n.language !== geoLang) {
//         void i18n.changeLanguage(geoLang);
//       }
//     } catch {
//       // Silent fail; fallback remains
//     }
//   })();
// }

export default i18n;
