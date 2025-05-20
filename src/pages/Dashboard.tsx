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
import { config, isDevelopment } from '@/config/environment';
import { toast } from 'sonner';

// Mapeo de celebridades a sus nombres completos e información
const celebrityInfo: Record<string, { 
  fullName: string, 
  fullNameEs: string, 
  description: string, 
  descriptionEs: string,
  imageUrl: string 
}> = {
  "gandhi": {
    fullName: "Mahatma Gandhi",
    fullNameEs: "Mahatma Gandhi",
    description: "Indian lawyer, anti-colonial nationalist, and political leader who employed nonviolent resistance.",
    descriptionEs: "Abogado indio, nacionalista anticolonial y líder político que empleó la resistencia no violenta.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/440px-Mahatma-Gandhi%2C_studio%2C_1931.jpg"
  },
  "curie": {
    fullName: "Marie Curie",
    fullNameEs: "Marie Curie",
    description: "Polish-French physicist and chemist who conducted pioneering research on radioactivity.",
    descriptionEs: "Física y química polaco-francesa que realizó investigaciones pioneras sobre la radiactividad.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c1920.jpg/440px-Marie_Curie_c1920.jpg"
  },
  "einstein": {
    fullName: "Albert Einstein",
    fullNameEs: "Albert Einstein",
    description: "German-born theoretical physicist, widely acknowledged to be one of the greatest and most influential physicists of all time.",
    descriptionEs: "Físico teórico nacido en Alemania, ampliamente reconocido como uno de los físicos más grandes e influyentes de todos los tiempos.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/440px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg"
  },
  "jobs": {
    fullName: "Steve Jobs",
    fullNameEs: "Steve Jobs",
    description: "American entrepreneur, industrial designer, business magnate, and media proprietor. Co-founder of Apple Inc.",
    descriptionEs: "Emprendedor, diseñador industrial, magnate empresarial y propietario de medios estadounidense. Cofundador de Apple Inc.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/440px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg"
  },
  "mandela": {
    fullName: "Nelson Mandela",
    fullNameEs: "Nelson Mandela",
    description: "South African anti-apartheid activist and politician who served as the first president of South Africa from 1994 to 1999.",
    descriptionEs: "Activista y político sudafricano contra el apartheid que sirvió como el primer presidente de Sudáfrica de 1994 a 1999.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/440px-Nelson_Mandela_1994.jpg"
  }
};

const Dashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { user: authUser, loading: authLoading } = useAuth();

  // Mapeo de tipos MBTI a nombres completos
  const mbtiTypeNames: { [key: string]: { name: string, group: string } } = {
    // Analistas (NT)
    "INTJ": { name: "Arquitecto", group: "Analistas" },
    "INTP": { name: "Lógico", group: "Analistas" },
    "ENTJ": { name: "Comandante", group: "Analistas" },
    "ENTP": { name: "Innovador", group: "Analistas" },
    
    // Diplomáticos (NF)
    "INFJ": { name: "Abogado", group: "Diplomáticos" },
    "INFP": { name: "Mediador", group: "Diplomáticos" },
    "ENFJ": { name: "Protagonista", group: "Diplomáticos" },
    "ENFP": { name: "Activista", group: "Diplomáticos" },
    
    // Centinelas (SJ)
    "ISTJ": { name: "Inspector", group: "Centinelas" },
    "ISFJ": { name: "Defensor", group: "Centinelas" },
    "ESTJ": { name: "Ejecutivo", group: "Centinelas" },
    "ESFJ": { name: "Cónsul", group: "Centinelas" },
    
    // Exploradores (SP)
    "ISTP": { name: "Virtuoso", group: "Exploradores" },
    "ISFP": { name: "Aventurero", group: "Exploradores" },
    "ESTP": { name: "Emprendedor", group: "Exploradores" },
    "ESFP": { name: "Animador", group: "Exploradores" },
  };

  // Mapeo de identificadores de habilidades a claves de traducción
  const skillsMap: { [key: string]: string } = {
    "emotional_intelligence": "skills.emotional_intelligence",
    "leadership": "skills.leadership",
    "communication": "skills.communication",
    "critical_thinking": "skills.critical_thinking",
    "creative_problem_solving": "skills.creative_problem_solving"
  };

  // Mapeo de identificadores de profesiones a claves de traducción
  const professionsMap: { [key: string]: string } = {
    "psychologist": "professions.psychologist",
    "data_scientist": "professions.data_scientist",
    "graphic_designer": "professions.graphic_designer"
  };

  // Mapeo de identificadores de personalidades a claves de traducción
  const personalitiesMap: { [key: string]: string } = {
    "gandhi": "personalities.gandhi",
    "curie": "personalities.curie",
    "einstein": "personalities.einstein"
  };

  // Mapeo de intereses a claves de traducción
  const interestsMap: { [key: string]: string } = {
    "social_impact": "interests.social_impact",
    "health_wellness": "interests.health_wellness",
    "business_entrepreneurship": "interests.business_entrepreneurship",
    "arts_culture": "interests.arts_culture",
    "science_tech": "interests.science_tech"
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchUserProfile(authUser.id);
    }
  }, [authUser, authLoading]);

  const fetchUserProfile = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener el token de autenticación
      let apiToken = localStorage.getItem('etedata_api_token');
      
      // Llamar al endpoint para obtener el perfil del usuario
      const response = await fetch(`${config.apiUrl}/v1/users/profile`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error(t('dashboard.fetch_error'));
      }

      const profileData = await response.json();
      console.log('[Dashboard] Datos del perfil recibidos:', profileData);
      
      // Intentar obtener el historial de tests si no está incluido en el perfil
      let completedTests = profileData.completed_tests || [];
      let testsCount = profileData.tests_count || 0;

      // Si no hay tests pero tenemos el ID de usuario, intentar obtenerlos directamente
      if ((completedTests.length === 0 || testsCount === 0) && userId) {
        try {
          const historyResponse = await fetch(`${config.apiUrl}/v1/tests/sessions/history`, {
            headers: {
              'Authorization': `Bearer ${apiToken}`
            }
          });
          
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            console.log('[Dashboard] Historial de tests obtenido:', historyData);
            
            if (Array.isArray(historyData) && historyData.length > 0) {
              completedTests = historyData.map(test => ({
                id: test.id || test._id,
                date: test.created_at || test.date || new Date().toISOString(),
                type: test.test_type || 'quick',
                result: test.profile_id || {}
              }));
              testsCount = historyData.length;
            }
          }
        } catch (historyError) {
          console.warn('Error obteniendo historial de tests:', historyError);
          // Continuar con el proceso normal, esto es solo un intento de recuperar datos
        }
      }
      
      // Limpiar el tipo MBTI (quitar prefijo MBTIType.)
      let mbtiType = profileData.profile_type || '';
      if (mbtiType.startsWith('MBTIType.')) {
        mbtiType = mbtiType.replace('MBTIType.', '');
      }
      
      // Obtener el nombre completo del tipo MBTI
      const fullMbtiName = mbtiTypeNames[mbtiType]?.name || mbtiType;
      
      // Convertir las habilidades de ID a nombres legibles según el idioma actual usando las claves de traducción
      const processedSkills = (profileData.skills || []).map((skill: string) => {
        const translationKey = skillsMap[skill];
        if (translationKey) {
          return t(translationKey);
        }
        // Si no se encuentra en el mapeo, devolver el id original con formato mejorado
        return skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      });
      
      // Convertir las personalidades similares de ID a nombres completos utilizando celebrityInfo
      const processedPersonalities = (profileData.similar_personalities || []).map((personality: string) => {
        // Obtener la información de la celebridad si existe en el mapeo
        if (celebrityInfo[personality]) {
          return language === 'es' ? celebrityInfo[personality].fullNameEs : celebrityInfo[personality].fullName;
        }
        
        // Si no está en celebrityInfo, intentar usar la clave de traducción
        const translationKey = personalitiesMap[personality];
        if (translationKey) {
          return t(translationKey);
        }
        
        // Si no se encuentra en ningún mapeo, devolver el ID con formato mejorado
        return personality.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      });
      
      // Convertir las profesiones recomendadas de ID a nombres legibles
      const processedProfessions = (profileData.recommended_professions || []).map((profession: string) => {
        const translationKey = professionsMap[profession];
        if (translationKey) {
          return t(translationKey);
        }
        // Si no se encuentra en el mapeo, devolver el id original con formato mejorado
        return profession.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      });

      // Convertir los intereses de ID a nombres legibles
      const processedInterests = (profileData.interests || []).map((interest: string) => {
        const translationKey = interestsMap[interest];
        if (translationKey) {
          return t(translationKey);
        }
        return interest.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      });
      
      // Construir el objeto de perfil de usuario
      const userProfile: UserProfile = {
        id: profileData.id || authUser?.id || '',
        name: profileData.name || authUser?.name || '',
        email: profileData.email || authUser?.email || '',
        profileType: fullMbtiName,
        mbtiRaw: mbtiType,
        mbtiGroup: mbtiTypeNames[mbtiType]?.group || '',
        skills: processedSkills,
        interests: processedInterests,
        similiarPersonalities: processedPersonalities,
        recommendedProfessions: processedProfessions,
        completedTests: completedTests
      };
      
      setUser(userProfile);
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      setError(t('dashboard.fetch_error'));
      
      // Usar información básica del usuario si falla la obtención del perfil
      if (authUser) {
        setUser({
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          profileType: '',
          mbtiRaw: '',
          mbtiGroup: '',
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
      const url = `${config.apiUrl}/v1/tests/utils/initialize-demo-test`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      if (!res.ok) {
        toast.error('No se pudo inicializar los tests demo.');
        return;
      }
      toast.success('Tests demo inicializados correctamente.');
      setTimeout(() => window.location.reload(), 1500);
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
        {isDevelopment() && (
          <div className="mb-4">
            <Button variant="globodain" onClick={handleInitializeDemoTests}>
              Inicializar tests demo
            </Button>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            {t('dashboard.welcome')} {user.name.split(' ')[0]}
          </h1>
          {user.mbtiRaw && (
            <p className="text-muted-foreground mt-1 dark:text-gray-400">
              <span className="font-medium">{user.mbtiRaw}</span>
              {user.profileType && user.mbtiRaw !== user.profileType && (
                <span> - {user.profileType}</span>
              )}
              {user.mbtiGroup && (
                <span className="ml-2 px-2 py-0.5 bg-primary/10 dark:bg-primary/20 rounded text-xs">
                  {user.mbtiGroup}
                </span>
              )}
            </p>
          )}
        </div>

        <main>
          <HomeScreen user={user} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
