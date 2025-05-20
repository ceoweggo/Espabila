import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserProfile, TestRecord } from '@/types';
import { Navbar } from '@/components/Navbar';
import { useTranslation } from '@/lib/TranslationProvider';
import { useAuth } from '@/lib/sso/AuthContext';
import { config } from '@/config/environment';

const TestHistoryPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useTranslation();
  const { user } = useAuth();

  // Mapeo de identificadores de habilidades a claves de traducción
  const skillsMap: { [key: string]: string } = {
    "emotional_intelligence": "skills.emotional_intelligence",
    "leadership": "skills.leadership",
    "communication": "skills.communication",
    "critical_thinking": "skills.critical_thinking",
    "creative_problem_solving": "skills.creative_problem_solving"
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiToken = localStorage.getItem('etedata_api_token');
        
        // 1. Obtener historial de sesiones de test
        const response = await fetch(`${config.apiUrl}/v1/tests/sessions/history`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          }
        });
        
        if (!response.ok) throw new Error('Error fetching test history');
        
        const sessions = await response.json();
        console.log('Historial de sesiones completo:', sessions);
        
        if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
          console.warn('No se recibieron datos de historial o el formato es incorrecto');
          setTests([]);
          return;
        }
        
        // 2. Para cada sesión, obtener sus resultados completos
        const enrichedTests = await Promise.all(sessions.map(async (session: any) => {
          try {
            const sessionId = session._id;
            console.log(`Procesando sesión ${sessionId}`);
            
            // Obtener los resultados de la sesión
            const detailsResponse = await fetch(`${config.apiUrl}/v1/tests/sessions/${sessionId}/results`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
              }
            });
            
            if (!detailsResponse.ok) {
              console.warn(`No se pudieron obtener detalles del test ${sessionId}: ${detailsResponse.status}`);
              return null;
            }
            
            const result = await detailsResponse.json();
            console.log(`Resultados de la sesión ${sessionId}:`, result);
            
            // Formato para la UI
            return {
              id: result._id,
              session_id: sessionId,
              date: session.created_at || new Date().toISOString(),
              type: session.test_type || 'quick',
              result: {
                profileType: result.mbti_type || '',
                mbtiType: result.mbti_type || '',
                skills: result.recommended_skills || [],
                interests: result.recommended_interests || [],
                similiarPersonalities: result.recommended_personalities || [],
                recommendedProfessions: result.recommended_professions || [],
                advice: result.advice || '',
                recommendedActivities: result.recommended_activities || [],
              }
            };
          } catch (testErr) {
            console.error(`Error procesando sesión ${session._id}:`, testErr);
            return null;
          }
        }));
        
        // Filtrar posibles resultados null
        const validTests = enrichedTests.filter(test => test !== null);
        console.log('Tests después de enriquecer:', validTests);
        setTests(validTests);
      } catch (err) {
        console.error('Error al obtener el historial de pruebas:', err);
        setError('Error al cargar el historial de pruebas');
        setTests([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [user]);

  const handleViewResult = (test: TestRecord) => {
    console.log("test", test)
    navigate(`/results/${test.id}`);
  };

  // Función para convertir identificadores de habilidades a texto legible usando traducciones
  const getSkillTranslation = (skill: string) => {
    const translationKey = skillsMap[skill];
    if (translationKey) {
      return t(translationKey);
    }
    // Si no hay traducción, formatea el identificador
    return skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderMBTIType = (profileType: string) => {
    if (!profileType) return t('test.have_no_test');
    
    // Limpiar el tipo MBTI si viene como MBTIType.XXXX
    if (profileType.startsWith('MBTIType.')) {
      return profileType.replace('MBTIType.', '');
    }
    
    return profileType;
  };
  
  const renderSkills = (test: TestRecord) => {
    const skills = test.result.skills;
    if (!skills || skills.length === 0) {
      return (
        <span className="text-muted-foreground dark:text-gray-400 text-sm">
          {t('dashboard.no_skills')}
        </span>
      );
    }
    
    return skills.slice(0, 3).map((skill: string, index: number) => (
      <span 
        key={`${skill}-${index}`} 
        className="px-2 py-1 bg-secondary/10 text-secondary dark:bg-accent/20 dark:text-secondary-foreground text-xs rounded-full"
      >
        {getSkillTranslation(skill)}
      </span>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            {t('nav.tests')}
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-1">
            {t('test_history.description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="dark:text-gray-300">{t('test_history.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-destructive/10 dark:bg-destructive/20 rounded-lg border border-destructive/30 dark:border-destructive/30">
              <p className="text-destructive dark:text-destructive-foreground mb-4">{error}</p>
              <Button variant="destructive" size="sm" onClick={() => window.location.reload()}>
                {t('dashboard.try_again')}
              </Button>
            </div>
          ) : tests.length > 0 ? (
            <div className="space-y-6">
              {tests.map((test) => (
                <Card key={test.id} className="overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-3 border-b border-border/60 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-primary dark:text-white">
                          {renderMBTIType(test.result.profileType)}
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400">
                          {t(`dashboard.last_test_type.${test.type}`)}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary dark:text-white">
                          {new Date(test.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-gray-400">
                          {new Date(test.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-primary dark:text-white mb-2">
                        {t('test_history.key_skills')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {renderSkills(test)}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="globodain" 
                        size="sm" 
                        onClick={() => handleViewResult(test)}
                      >
                        {t('test_history.view_results')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700">
              <p className="mb-4 text-primary dark:text-white">{t('test_history.no_tests')}</p>
              <Button variant="globodain" onClick={() => navigate('/test/quick')}>
                {t('test.start')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestHistoryPage;
