import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "@/lib/TranslationProvider";
import { Button } from "@/components/ui/button";
import { Navbar } from '@/components/Navbar';

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md p-8 rounded-lg border border-border dark:border-gray-700 shadow-lg bg-card dark:bg-gray-800">
          <div className="w-24 h-24 rounded-full bg-accent/10 dark:bg-accent/20 mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary dark:text-white">404</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-primary dark:text-white">{t('not_found.title')}</h1>
          <p className="text-muted-foreground dark:text-gray-300 mb-6">
            {t('not_found.description')}
          </p>
          <div className="flex justify-center">
            <Button variant="outline" asChild className="dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              <Link to="/dashboard">
                {t('not_found.back_to_dashboard')}
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <span className="text-accent font-bold mr-1">Espa</span>
            <span className="text-primary dark:text-white font-bold">Bila</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
