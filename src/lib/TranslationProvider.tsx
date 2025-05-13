import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, getCurrentLanguage, setLanguage as changeLanguage, t } from './translations';

// Definir la interfaz del contexto
interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Crear el contexto
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Props para el proveedor
interface TranslationProviderProps {
  children: React.ReactNode;
}

// Componente proveedor
export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<Language>(getCurrentLanguage());

  // Actualizar el estado cuando cambia el idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageState(getCurrentLanguage());
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  // Función para cambiar el idioma
  const setLanguage = (lang: Language) => {
    changeLanguage(lang);
  };

  // Valor del contexto
  const contextValue: TranslationContextType = {
    language,
    setLanguage,
    t: (key: string) => t(key),
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useTranslation() {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  return context;
} 