import { useEffect, useState } from 'react';
import { t, getCurrentLanguage, Language } from '@/lib/translations';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(getCurrentLanguage());

  // Actualizar el estado cuando cambia el idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(getCurrentLanguage());
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  // Función para traducir un texto
  const translate = (key: string): string => {
    return t(key);
  };

  return {
    t: translate,
    language,
  };
} 