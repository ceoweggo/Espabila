// src/pages/auth/callback.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/sso/AuthContext';
import { ROUTES } from '../../../utils/constants';
import { toast } from 'sonner';
import { SSO_PROVIDERS } from '../../../lib/sso/GlobodainSSOAuth';

// Estados posibles del proceso de autenticación
enum AuthStatus {
  INIT = 'Iniciando autenticación...',
  PROCESSING_CODE = 'Procesando código de autorización...',
  SUCCESS = 'Autenticación exitosa, redirigiendo...',
  ERROR = 'Error de autenticación',
}

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(AuthStatus.INIT);
  const [provider, setProvider] = useState<string | null>(null);
  const { handleCallback, loading, isAuthenticated } = useAuth();
  
  // Usar useRef para evitar múltiples ejecuciones
  const processingRef = useRef(false);
  const processedRef = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      // Evitar múltiples ejecuciones
      if (processingRef.current || processedRef.current) {
        console.log('Ya se está procesando el callback o ya fue procesado');
        return;
      }
      
      processingRef.current = true;
      
      try {
        console.log('Manejando callback del SSO');
        setStatus(AuthStatus.INIT);
        
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const providerParam = params.get('provider');
        
        // Guardar el proveedor si está disponible en la URL
        if (providerParam) {
          setProvider(providerParam);
          console.log('Proveedor detectado:', providerParam);
          
          // Validar el proveedor
          const validProviders = Object.values(SSO_PROVIDERS) as string[];
          if (!validProviders.some(p => p.toLowerCase() === providerParam.toLowerCase())) {
            console.warn(`Proveedor no reconocido: ${providerParam}`);
          }
        }
        
        console.log('Código recibido:', code ? 'Sí' : 'No');
        console.log('URL completa:', window.location.href);

        if (!code) {
          const errorMsg = params.get('error_description') || 
                          params.get('error') || 
                          'No se recibió código de autorización';
          throw new Error(errorMsg);
        }

        // Verificar si este código ya fue procesado
        const lastProcessedCode = sessionStorage.getItem('last_processed_code');
        if (lastProcessedCode === code) {
          console.log('Este código ya fue procesado anteriormente');
          processedRef.current = true;
          // Si ya tenemos un token, redirigir directamente
          if (localStorage.getItem('globodain_access_token')) {
            const redirectTo = localStorage.getItem('globodain_auth_redirect') || ROUTES.DASHBOARD;
            localStorage.removeItem('globodain_auth_redirect');
            navigate(redirectTo, { replace: true });
            return;
          }
        }

        setStatus(AuthStatus.PROCESSING_CODE);
        
        const success = await handleCallback(code);

        // Si ya hay un callback procesando (detectado por handleCallback),
        // vamos a esperar un poco y verificar si se completó con éxito
        if (!success && localStorage.getItem('processing_callback')) {
          console.log('Detectado otro proceso de callback en curso, esperando...');
          // Esperar un momento para ver si el otro proceso termina
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Verificar si ahora tenemos un token (el otro proceso pudo haber terminado)
          if (localStorage.getItem('globodain_access_token')) {
            console.log('El otro proceso parece haber completado con éxito');
            setStatus(AuthStatus.SUCCESS);
            processedRef.current = true;
            
            // Redirigir a la página previa si existe, si no a dashboard
            const redirectTo = localStorage.getItem('globodain_auth_redirect') || ROUTES.DASHBOARD;
            localStorage.removeItem('globodain_auth_redirect');
            navigate(redirectTo, { replace: true });
            return;
          } else {
            // Si seguimos sin token, entonces algo salió mal
            throw new Error('Error al procesar la autenticación');
          }
        } else if (!success) {
          throw new Error('Error al procesar la autenticación');
        }

        // Marcar el código como procesado
        sessionStorage.setItem('last_processed_code', code);
        processedRef.current = true;

        setStatus(AuthStatus.SUCCESS);
        toast.success(`Autenticación exitosa${provider ? ` con ${provider}` : ''}`);
        
        // Esperar un momento para asegurar que el estado se actualice
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirigir a la página previa si existe, si no a dashboard
        const redirectTo = localStorage.getItem('globodain_auth_redirect') || ROUTES.DASHBOARD;
        localStorage.removeItem('globodain_auth_redirect');
        navigate(redirectTo, { replace: true });
        
      } catch (err) {
        console.error('Error en callback:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        setStatus(AuthStatus.ERROR);
        toast.error(`Error de autenticación: ${errorMessage}`);
        
        // En caso de error, redirigir a login después de un delay
        setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 3000);
      } finally {
        processingRef.current = false;
      }
    };

    processCallback();
    
    // Cleanup function
    return () => {
      processingRef.current = false;
    };
  }, []); // Remover todas las dependencias

  // Componente para mostrar el estado de carga
  const LoadingState = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6 max-w-md mx-auto bg-card rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-4">{status}</h1>
        {provider && (
          <p className="text-muted-foreground mb-2">
            Proveedor: <span className="font-medium">{provider}</span>
          </p>
        )}
        <p className="text-muted-foreground">Por favor, espere mientras completamos el proceso...</p>
      </div>
    </div>
  );

  // Componente para mostrar errores
  const ErrorState = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6 max-w-md mx-auto bg-card rounded-lg shadow-md">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error de autenticación</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        {provider && (
          <p className="text-muted-foreground mb-4">
            Proveedor: <span className="font-medium">{provider}</span>
          </p>
        )}
        <button 
          onClick={() => navigate(ROUTES.LOGIN)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Volver a intentar
        </button>
      </div>
    </div>
  );

  // Render condicional basado en el estado
  if (loading || status !== AuthStatus.ERROR) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  // Estado de redirección (no debería llegar aquí normalmente)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6 max-w-md mx-auto bg-card rounded-lg shadow-md">
        <div className="animate-pulse">
          <h1 className="text-2xl font-bold mb-4">Redirigiendo...</h1>
          <p className="text-muted-foreground">Por favor, espere...</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;