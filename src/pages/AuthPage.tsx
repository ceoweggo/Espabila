import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useTranslation } from "@/lib/TranslationProvider";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/lib/sso/AuthContext";
import { ROUTES } from "@/utils/constants";

const AuthPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir a dashboard
    if (isAuthenticated && !loading) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleAuthSuccess = () => {
    navigate(ROUTES.DASHBOARD);
  };

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si el usuario no está autenticado, mostrar la página de login
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900 transition-colors duration-300">
      <header className="py-4 border-b border-border/20 bg-primary dark:bg-primary/90 text-white">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="text-accent font-bold mr-1">Espa</span>
            <span>Bila</span>
          </h1>
          <LanguageSelector />
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted/30 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary dark:text-white">
              {t('auth.title')}
            </h2>
            <p className="text-lg text-muted-foreground dark:text-gray-300">
              {t('auth.description')}
            </p>
            <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-accent/10 dark:bg-accent/20 rounded-lg border border-accent/20 dark:border-accent/30">
                <h3 className="font-semibold mb-2 text-primary dark:text-white">{t('auth.identify_strengths.title')}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-300">{t('auth.identify_strengths.description')}</p>
              </div>
              <div className="p-4 bg-muted dark:bg-gray-700 rounded-lg border border-border/60 dark:border-gray-600">
                <h3 className="font-semibold mb-2 text-primary dark:text-white">{t('auth.find_direction.title')}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-300">{t('auth.find_direction.description')}</p>
              </div>
              <div className="p-4 bg-primary/5 dark:bg-primary/20 rounded-lg border border-primary/10 dark:border-primary/30">
                <h3 className="font-semibold mb-2 text-primary dark:text-white">{t('auth.gain_insights.title')}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-300">{t('auth.gain_insights.description')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card dark:bg-gray-800 rounded-xl shadow-lg border border-accent/10 dark:border-gray-700">
            <AuthForm onSuccess={handleAuthSuccess} />
          </div>
        </div>
      </main>

      <footer className="bg-primary dark:bg-primary/90 text-white py-3 text-center text-sm">
        <div className="container">
          <p>&copy; 2025 EspaBila. <a href="https://globodain.com/" className="hover:text-accent" target="_blank" rel="noopener noreferrer">Globodain Education</a>. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
