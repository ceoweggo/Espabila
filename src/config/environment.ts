/**
 * Configuración de entornos para la aplicación
 */

// Tipos de entorno soportados
export type Environment = 'development' | 'test' | 'production';

// Interfaz para la configuración de entorno
export interface EnvironmentConfig {
  apiUrl: string;
  ssoConfig: {
    ssoUrl: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    successRedirect: string;
    serviceId: string;
  };
  debug: boolean;
}

// Determinar el entorno actual
export const getEnvironment = (): Environment => {
  // Obtener del import.meta.env (Vite) o process.env (Node.js)
  const env = import.meta.env?.VITE_APP_ENV || process.env?.NODE_ENV || 'development';
  
  if (env === 'production' || env === 'prod') return 'production';
  if (env === 'test' || env === 'testing') return 'test';
  return 'development';
};

// Helpers para información sobre el entorno
export const isDevelopment = () => getEnvironment() === 'development';
export const isTest = () => getEnvironment() === 'test';
export const isProduction = () => getEnvironment() === 'production';
export const isDevelopmentLocal = () => {
  return typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1');
};

// Configuraciones específicas por entorno
const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  development: {
    apiUrl: 'http://localhost:2000',
    ssoConfig: {
      ssoUrl: isDevelopmentLocal() ? 'http://localhost:3000' : 'https://sso.globodain.com',
      clientId: import.meta.env?.VITE_GLOBODAIN_CLIENT_ID || '54861d27-d349-4b6f-abc3-0cfdb22eefab',
      clientSecret: import.meta.env?.VITE_GLOBODAIN_CLIENT_SECRET || '2be63d91-898d-455e-9611-6a3de0b81ba9',
      redirectUri: import.meta.env?.VITE_GLOBODAIN_REDIRECT_URI || 'http://localhost:8081/auth/sso/callback',
      successRedirect: import.meta.env?.VITE_GLOBODAIN_SUCCESS_REDIRECT || '/',
      serviceId: import.meta.env?.VITE_GLOBODAIN_SERVICE_ID || '7',
    },
    debug: true
  },
  test: {
    apiUrl: 'http://localhost:2000',
    ssoConfig: {
      ssoUrl: isDevelopmentLocal() ? 'http://localhost:3000' : 'https://sso.globodain.com',
      clientId: import.meta.env?.VITE_GLOBODAIN_CLIENT_ID || '54861d27-d349-4b6f-abc3-0cfdb22eefab',
      clientSecret: import.meta.env?.VITE_GLOBODAIN_CLIENT_SECRET || '2be63d91-898d-455e-9611-6a3de0b81ba9',
      redirectUri: import.meta.env?.VITE_GLOBODAIN_REDIRECT_URI || 'http://localhost:8081/auth/sso/callback',
      successRedirect: import.meta.env?.VITE_GLOBODAIN_SUCCESS_REDIRECT || '/',
      serviceId: import.meta.env?.VITE_GLOBODAIN_SERVICE_ID || '7',
    },
    debug: true
  },
  production: {
    apiUrl: 'https://espabila.globodain.com',
    ssoConfig: {
      ssoUrl: 'https://sso.globodain.com',
      clientId: import.meta.env?.VITE_GLOBODAIN_CLIENT_ID || '54861d27-d349-4b6f-abc3-0cfdb22eefab',
      clientSecret: import.meta.env?.VITE_GLOBODAIN_CLIENT_SECRET || '2be63d91-898d-455e-9611-6a3de0b81ba9',
      redirectUri: import.meta.env?.VITE_GLOBODAIN_REDIRECT_URI || 'https://espabila.globodain.com/auth/sso/callback',
      successRedirect: import.meta.env?.VITE_GLOBODAIN_SUCCESS_REDIRECT || '/',
      serviceId: import.meta.env?.VITE_GLOBODAIN_SERVICE_ID || '7',
    },
    debug: false
  }
};

// Obtener la configuración del entorno actual
export const getConfig = (): EnvironmentConfig => {
  const env = getEnvironment();
  return environmentConfigs[env];
};

// Exportar la configuración actual para uso rápido
export const config = getConfig();

// Función de logging condicional según el entorno
export const envLog = (message: string, data?: any): void => {
  if (config.debug) {
    if (data) {
      console.log(`[${getEnvironment().toUpperCase()}] ${message}`, data);
    } else {
      console.log(`[${getEnvironment().toUpperCase()}] ${message}`);
    }
  }
}; 