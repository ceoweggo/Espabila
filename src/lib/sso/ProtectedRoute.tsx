import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROUTES } from '../../utils/constants';

interface ProtectedRouteProps {
  children: ReactNode;
}

const PUBLIC_ROUTES = [
  '/auth/sso/callback',
  '/auth/logout',
  '/auth/sso/logout-callback',
  '/login', 
];

/**
 * Componente para proteger rutas según autenticación
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos a renderizar si se cumplen los requisitos
 * @returns {JSX.Element} - Componente renderizado
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent"></div>
      </div>
    );
  }

  // Si la ruta es pública, permitir acceso siempre
  if (PUBLIC_ROUTES.some(route => location.pathname.startsWith(route))) {
    return <>{children}</>;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    // Guardar la ruta actual para redirigir después del login
    localStorage.setItem('globodain_auth_redirect', location.pathname + location.search);
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Si el usuario está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;