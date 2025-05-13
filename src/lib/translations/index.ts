import { en } from './en';
import { es } from './es';

// Tipos para nuestro sistema de traducción
export type Language = 'en' | 'es';
export type Translations = Record<string, string>;

// Objeto que contiene todas las traducciones
export const translations: Record<Language, Translations> = {
  en,
  es,
};

// Estado actual del idioma
let currentLanguage: Language = 'en';

// Función para obtener el idioma actual
export const getCurrentLanguage = (): Language => currentLanguage;

// Función para cambiar el idioma
export const setLanguage = (language: Language): void => {
  currentLanguage = language;
  // Podríamos almacenar la preferencia del usuario en localStorage
  localStorage.setItem('language', language);
  // Disparar un evento para notificar a los componentes del cambio
  window.dispatchEvent(new Event('languageChanged'));
};

// Función para traducir un texto
export const translate = (key: string, lang?: Language): string => {
  const language = lang || currentLanguage;
  return translations[language][key] || key;
};

// Alias para traducir más fácilmente
export const t = translate;

// Inicializar el idioma basado en la preferencia guardada o el idioma del navegador
export const initializeLanguage = (): void => {
  const savedLanguage = localStorage.getItem('language') as Language;
  const browserLanguage = navigator.language.split('-')[0];
  
  // Si hay un idioma guardado y es válido, usarlo
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
    currentLanguage = savedLanguage;
  } 
  // De lo contrario, usar el idioma del navegador si está soportado
  else if (browserLanguage === 'es') {
    currentLanguage = 'es';
  } else {
    // Por defecto, usar inglés
    currentLanguage = 'en';
  }
}; 