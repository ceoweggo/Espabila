import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeLanguage } from './lib/translations';

// Inicializar el sistema de traducción
initializeLanguage();

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>,
);
