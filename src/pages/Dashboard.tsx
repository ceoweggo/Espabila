import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeScreen from "@/components/home/HomeScreen";
import { UserProfile } from "@/types";
import { Navbar } from '@/components/Navbar';
import { useTranslation } from '@/lib/TranslationProvider';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/sso/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { config } from '@/config/environment';
import { toast } from 'sonner';

const Dashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchUserProfile(authUser.id);
    }
  }, [authUser, authLoading]);

  const fetchUserProfile = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user profile from API
      let apiToken = localStorage.getItem('etedata_api_token');
      let response = await fetch(`${config.apiUrl}/v1/users/${userId}/profile`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error(t('dashboard.fetch_error'));
      }

      const profileData = await response.json();
      
      // Map API data to UserProfile format
      const userProfile: UserProfile = {
        id: authUser?.id || '',
        name: authUser?.name || '',
        email: authUser?.email || '',
        profileType: profileData.profile_type || '',
        skills: profileData.skills || [],
        interests: profileData.interests || [],
        similiarPersonalities: profileData.similar_personalities || [],
        recommendedProfessions: profileData.recommended_professions || [],
        completedTests: (profileData.completed_tests || []).map((test: any) => ({
          id: test.id,
          date: test.date,
          type: test.type,
          result: test.result
        }))
      };
      
      setUser(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(t('dashboard.fetch_error'));
      
      // Fallback to user basic data if profile fails
      if (authUser) {
        setUser({
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          profileType: '',
          skills: [],
          interests: [],
          similiarPersonalities: [],
          recommendedProfessions: [],
          completedTests: []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (authUser) {
      fetchUserProfile(authUser.id);
    }
  };

  // Botón para inicializar tests demo (solo para desarrollo)
  const handleInitializeDemoTests = async () => {
    const apiToken = localStorage.getItem('etedata_api_token');
    try {
      const url = `${config.apiUrl}/v1/tests/initialize-demo-test`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      if (!res.ok) {
        toast.error('No se pudo inicializar los tests demo.');
        return;
      }
      toast.success('Tests demo inicializados correctamente.');
      window.location.reload();
    } catch (err) {
      toast.error('Error inesperado al inicializar los tests demo.');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[340px] md:col-span-2" />
            <Skeleton className="h-[340px]" />
          </div>
          
          <Skeleton className="h-6 w-48 mt-8 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        
        <div className="container mx-auto py-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('dashboard.error_title')}</AlertTitle>
            <AlertDescription>
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="ml-2 gap-1"
              >
                <RefreshCcw className="h-3 w-3" /> {t('dashboard.try_again')}
              </Button>
            </AlertDescription>
          </Alert>
          
          {user && <HomeScreen user={user} />}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <p className="text-destructive mb-2 dark:text-red-400">{t('dashboard.user_not_found')}</p>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            {t('dashboard.try_again')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto py-6">
        {/* Botón solo para desarrollo: inicializar tests demo */}
        <div className="mb-4">
          <Button variant="globodain" onClick={handleInitializeDemoTests}>
            Inicializar tests demo
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            {t('dashboard.welcome')} {user.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1 dark:text-gray-400">
            {user.profileType || 'Aún no tienes un rol de personalidad asignado'}
          </p>
        </div>

        <main>
          <HomeScreen user={user} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
