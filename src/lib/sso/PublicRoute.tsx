import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROUTES } from '../../utils/constants';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * Componente para proteger rutas públicas (como login) y redirigir
 * al dashboard si el usuario ya está autenticado
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos a renderizar
 * @returns {JSX.Element} - Componente renderizado
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent"></div>
      </div>
    );
  }

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    // Obtener la ruta de redirección (si existe)
    const redirectTo = localStorage.getItem('globodain_auth_redirect') || ROUTES.DASHBOARD;
    // Limpiar la redirección guardada
    localStorage.removeItem('globodain_auth_redirect');
    
    return <Navigate to={redirectTo} replace />;
  }

  // Si el usuario no está autenticado, mostrar la ruta pública
  return <>{children}</>;
};

export default PublicRoute; 