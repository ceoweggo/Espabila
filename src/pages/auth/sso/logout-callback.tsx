import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('Finalizando cierre de sesión...');

  useEffect(() => {
    const processLogoutCallback = () => {
      try {
        // Limpiar cualquier resto de tokens que pudiera quedar
        const keysToRemove = [
          'globodain_access_token', 
          'globodain_refresh_token',
          'globodain_token_expires',
          'globodain_user',
          'etedata_api_token',
          'etedata_api_token_expires',
          'processing_callback',
          'last_processed_code'
        ];
        
        // Eliminar todos los tokens de localStorage para asegurar la desconexión completa
        keysToRemove.forEach(key => {
          if (localStorage.getItem(key)) {
            console.log(`Eliminando token residual: ${key}`);
            localStorage.removeItem(key);
          }
        });
        
        // También limpiar sessionStorage
        sessionStorage.removeItem('globodain_logout_callback');
        
        // Actualizar el estado para mostrar éxito
        setStatus('Sesión cerrada correctamente');
        
        // Redirigir a la página principal
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
      } catch (error) {
        console.error('Error en el callback de logout:', error);
        setStatus('Hubo un problema al finalizar el proceso');
        setTimeout(() => navigate('/', { replace: true }), 2000);
      }
    };

    processLogoutCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-card dark:bg-gray-800 rounded-lg shadow-lg border border-accent/10 dark:border-gray-700 text-center">
        {status === 'Finalizando cierre de sesión...' ? (
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent mx-auto mb-4"></div>
        ) : (
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
        )}
        <h1 className="text-2xl font-bold mb-4 text-primary dark:text-white">{status}</h1>
        <p className="text-muted-foreground dark:text-gray-300">Serás redirigido a la página principal...</p>
      </div>
    </div>
  );
};

export default LogoutCallback; 