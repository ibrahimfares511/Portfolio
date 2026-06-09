import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../locales/en.json';
import arTranslation from '../locales/ar.json';

// Detect initial language based on URL path first, then localStorage, defaulting to 'en'
const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path === '/ar' || path.startsWith('/ar/')) {
      return 'ar';
    }
    const saved = localStorage.getItem('portfolio-language');
    if (saved === 'ar' || saved === 'en') {
      return saved;
    }
  }
  return 'en';
};

const initialLang = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Apply document attributes on initialization
if (typeof window !== 'undefined') {
  const dir = initialLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = initialLang;
}

export default i18n;
