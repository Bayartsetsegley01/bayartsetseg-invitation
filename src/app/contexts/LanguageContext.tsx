import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '../translations';

interface LanguageContextProps {
  lang: Language;
  t: typeof translations.en;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('mn');
  const t = translations[lang];

  const toggleLang = () => {
    setLang((prev) => (prev === 'mn' ? 'en' : 'mn'));
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
