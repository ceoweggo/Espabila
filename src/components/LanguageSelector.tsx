import React, { useEffect, useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getCurrentLanguage, setLanguage, t, Language } from '@/lib/translations';

export function LanguageSelector() {
  const [language, setCurrentLanguage] = useState<Language>(getCurrentLanguage());

  // Actualizar el estado cuando cambia el idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(getCurrentLanguage());
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="globodainOutline" size="sm" className="text-white border-white hover:bg-white/10 hover:text-white">
          {language === 'en' ? 'EN' : 'ES'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-accent/30">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={language === 'en' ? 'bg-accent/10 text-accent font-medium' : ''}
        >
          {t('language.english')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('es')}
          className={language === 'es' ? 'bg-accent/10 text-accent font-medium' : ''}
        >
          {t('language.spanish')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 