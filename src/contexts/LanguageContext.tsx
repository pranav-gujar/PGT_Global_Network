import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';

export type LanguageCode =
  | 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn' | 'bn'
  | 'es' | 'fr' | 'de' | 'pt' | 'ar' | 'zh' | 'ja' | 'ko';

export interface LanguageInfo {
  code: LanguageCode;
  nativeName: string;
  isRtl?: boolean;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', nativeName: 'English' },
  { code: 'hi', nativeName: 'हिन्दी' },
  { code: 'mr', nativeName: 'मराठी' },
  { code: 'gu', nativeName: 'ગુજરાતી' },
  { code: 'ta', nativeName: 'தமிழ்' },
  { code: 'te', nativeName: 'తెలుగు' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ' },
  { code: 'bn', nativeName: 'বাংলা' },
  { code: 'es', nativeName: 'Español' },
  { code: 'fr', nativeName: 'Français' },
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'pt', nativeName: 'Português' },
  { code: 'ar', nativeName: 'العربية', isRtl: true },
  { code: 'zh', nativeName: '中文' },
  { code: 'ja', nativeName: '日本語' },
  { code: 'ko', nativeName: '한국어' }
];

interface LanguageContextType {
  language: LanguageCode;
  t: (key: string, variables?: Record<string, string | number>) => any;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ─── Storage helpers ──────────────────────────────────────────────────────────
// We use sessionStorage so that:
//   • First visit always starts in English (sessionStorage is empty on a brand-new session)
//   • Refresh / same-tab navigation keeps the selected language
//   • Links opened in a new tab from the current page inherit sessionStorage
//     (browsers copy sessionStorage when duplicating a tab or opening via target="_blank")
//   • Manually typing the URL / opening a new browser window starts fresh in English

const SESSION_KEY = 'pgt-lang';

const getSessionLang = (): LanguageCode | null => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved && LANGUAGES.some(l => l.code === saved)) {
      return saved as LanguageCode;
    }
  } catch {
    // sessionStorage may be unavailable in some environments
  }
  return null;
};

const setSessionLang = (lang: LanguageCode) => {
  try {
    sessionStorage.setItem(SESSION_KEY, lang);
  } catch {
    // silently ignore
  }
};

// ─── Document attribute helpers ───────────────────────────────────────────────
const updateDocumentAttributes = (langCode: LanguageCode) => {
  const root = document.documentElement;
  root.setAttribute('lang', langCode);
  const langInfo = LANGUAGES.find(l => l.code === langCode);
  if (langInfo?.isRtl) {
    root.setAttribute('dir', 'rtl');
    root.classList.add('rtl');
  } else {
    root.setAttribute('dir', 'ltr');
    root.classList.remove('rtl');
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    // On first load, use sessionStorage value if present, else default to English.
    return getSessionLang() ?? 'en';
  });

  const [translations, setTranslations] = useState<Record<string, any>>(enTranslations);
  const [cache, setCache] = useState<Record<string, any>>({ en: enTranslations });
  const [loading, setLoading] = useState(false);

  const loadLanguagePack = async (lang: LanguageCode): Promise<Record<string, any>> => {
    if (lang === 'en') return enTranslations;
    if (cache[lang]) return cache[lang];

    setLoading(true);
    try {
      let data: Record<string, any>;
      switch (lang) {
        case 'hi': data = (await import('../locales/hi.json')).default; break;
        case 'mr': data = (await import('../locales/mr.json')).default; break;
        case 'gu': data = (await import('../locales/gu.json')).default; break;
        case 'ta': data = (await import('../locales/ta.json')).default; break;
        case 'te': data = (await import('../locales/te.json')).default; break;
        case 'kn': data = (await import('../locales/kn.json')).default; break;
        case 'bn': data = (await import('../locales/bn.json')).default; break;
        case 'es': data = (await import('../locales/es.json')).default; break;
        case 'fr': data = (await import('../locales/fr.json')).default; break;
        case 'de': data = (await import('../locales/de.json')).default; break;
        case 'pt': data = (await import('../locales/pt.json')).default; break;
        case 'ar': data = (await import('../locales/ar.json')).default; break;
        case 'zh': data = (await import('../locales/zh.json')).default; break;
        case 'ja': data = (await import('../locales/ja.json')).default; break;
        case 'ko': data = (await import('../locales/ko.json')).default; break;
        default: data = enTranslations;
      }
      setCache(prev => ({ ...prev, [lang]: data }));
      return data;
    } catch (error) {
      console.error(`Failed to load translation pack for language: ${lang}`, error);
      return enTranslations;
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = async (newLang: LanguageCode) => {
    const data = await loadLanguagePack(newLang);
    setTranslations(data);
    setLanguageState(newLang);
    setSessionLang(newLang);          // persist within the browser session
    updateDocumentAttributes(newLang);
  };

  // On mount: if a language was saved in sessionStorage, load its pack
  useEffect(() => {
    const initLanguage = async () => {
      if (language !== 'en') {
        const data = await loadLanguagePack(language);
        setTranslations(data);
        updateDocumentAttributes(language);
      } else {
        updateDocumentAttributes('en');
      }
    };
    initLanguage();
  }, []);

  // ─── Translation function ───────────────────────────────────────────────────
  // Walks the current translation tree by dot-separated key.
  // Falls back to the English translation for any missing key.
  const t = (key: string, variables?: Record<string, string | number>): any => {
    const keys = key.split('.');

    // Try active language
    let value: any = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = null;
        break;
      }
    }

    // Fall back to English if not found
    if (value === null || value === undefined) {
      let fallback: any = enTranslations;
      for (const k of keys) {
        if (fallback && typeof fallback === 'object' && k in fallback) {
          fallback = fallback[k];
        } else {
          return key; // key not in English either — return raw key
        }
      }
      value = fallback;
    }

    if (typeof value !== 'string') return value;

    if (variables) {
      let result = value;
      Object.entries(variables).forEach(([k, v]) => {
        result = result.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
      return result;
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
