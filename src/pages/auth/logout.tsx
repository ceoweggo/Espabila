import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/sso/AuthContext';
import { config } from '../../config/environment';

export const LogoutPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  // Construir la URL de logout del SSO de Globodain
  const getSsoLogoutUrl = () => {
    const ssoUrl = config.ssoConfig.ssoUrl;
    const callbackUrl = `${window.location.origin}/auth/sso/logout-callback`;
    return `${ssoUrl}/api/auth/logout?redirect_uri=${encodeURIComponent(callbackUrl)}`;
  };

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 1. Eliminar la sesión actual (tokens locales)
        console.log('Paso 1: Eliminando la sesión local...');
        await logout();
        
        // 2. Redirigir al logout de Globodain SSO
        console.log('Paso 2: Redirigiendo al logout de Globodain SSO...');
        const ssoLogoutUrl = getSsoLogoutUrl();
        console.log('URL de logout del SSO:', ssoLogoutUrl);
        
        window.location.href = ssoLogoutUrl;
      } catch (error) {
        console.error('Error durante el proceso de logout:', error);
        setIsLoggingOut(false);
        setTimeout(() => navigate('/', { replace: true }), 2000);
      }
    };

    // Si estamos autenticados, realizar el logout
    if (isAuthenticated) {
      performLogout();
    } else {
      // Si ya no estamos autenticados, redirigir a la página principal
      setIsLoggingOut(false);
      console.log('No hay sesión activa para cerrar');
      setTimeout(() => navigate('/', { replace: true }), 1500);
    }
  }, [isAuthenticated, logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-card dark:bg-gray-800 rounded-lg shadow-lg border border-accent/10 dark:border-gray-700 text-center">
        {isLoggingOut ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-4 text-primary dark:text-white">Cerrando sesión...</h1>
            <p className="text-muted-foreground dark:text-gray-300">
              Por favor espera mientras cerramos tu sesión.
            </p>
          </>
        ) : (
          <>
            <div className="mb-6 text-green-500">
              <svg 
                className="mx-auto h-16 w-16" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-primary dark:text-white">Sesión cerrada</h1>
            <p className="text-muted-foreground dark:text-gray-300 mb-6">
              Has cerrado sesión correctamente. Serás redirigido a la página principal.
            </p>
            <button 
              onClick={() => navigate('/', { replace: true })}
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors"
            >
              Ir al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LogoutPage;