import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/TranslationProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Share, RotateCcw, Calendar, Clock } from 'lucide-react';
import { Loading } from '@/components/Loading';
import MbtiSection from '@/components/results/MbtiSection';
import ResultSummary from '@/components/results/ResultSummary';
import { config } from '@/config/environment';
import { TestResult } from '@/types/TestDetailsPage';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner'; // Asegúrate de tener este paquete instalado

// Utilidad para formatear fechas
const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Utilidad para formatear duración
const formatDuration = (seconds: number | null | undefined) => {
  if (!seconds) return '';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

// Mapear tipos de test a nombres más amigables
const testTypeLabels: Record<string, string> = {
  'rapid': 'Rápido',
  'comprehensive': 'Completo',
  'ikigai': 'Ikigai',
  'quick': 'Rápido'
};

const TestDetailsPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [result, setResult] = useState<TestResult | null>(null);
  const [testMetadata, setTestMetadata] = useState<{
    testType: string;
    startTime: string | null;
    endTime: string | null;
    duration: number | null;
    score: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'summary' | 'detail'>('summary');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiToken = localStorage.getItem('etedata_api_token');
        const response = await fetch(`${config.apiUrl}/v1/tests/results/${testId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          }
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const data = await response.json();
        
        // Extraer metadatos del test
        setTestMetadata({
          testType: data.test_type || '',
          startTime: data.startTime || data.start_time,
          endTime: data.endTime || data.end_time,
          duration: data.duration || null,
          score: data.score || 0
        });
        
        // Mapear datos principales
        const mapped: TestResult = {
          profileType: data.profileType || data.profile_type || '',
          mbtiType: data.mbtiType || data.mbti_type || '',
          mbtiGroup: data.mbtiGroup || data.mbti_group || '',
          skills: data.skills || [],
          interests: data.interests || [],
          similiarPersonalities: data.similiarPersonalities || data.similarPersonalities || data.similar_personalities || [],
          recommendedProfessions: data.recommendedProfessions || data.recommended_professions || [],
          advice: data.advice || '',
          recommendedActivities: data.recommendedActivities || data.recommended_activities || [],
        };
        
        console.log("Test details:", data);
        console.log("Mapped test result:", mapped);
        
        setResult(mapped);
      } catch (err) {
        console.error("Error fetching test:", err);
        setError('No se pudo cargar el test. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    if (testId) fetchTest();
  }, [testId]);

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-500 dark:text-red-400 font-medium mb-4">{error}</p>
          <Button onClick={() => navigate(-1)} className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
            {t('test.return_dashboard')}
          </Button>
        </div>
      </div>
    );
  }
  
  if (!result || typeof result.profileType !== 'string' || result.profileType.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="p-8 text-center bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">{t('error.test_result_view')}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">No se encontraron datos válidos para este resultado de test.</p>
          <Button onClick={() => navigate(-1)} className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
            {t('test.return_dashboard')}
          </Button>
        </div>
      </div>
    );
  }

  const handleDownloadReport = () => {
    // En una app real, esto generaría y descargaría un PDF
    toast.info("La descarga de informes estará disponible próximamente.");
  };

  const handleEmailReport = () => {
    // En una app real, esto enviaría el informe por email
    toast.info("El envío por email estará disponible próximamente.");
  };

  const testTypeLabel = testMetadata?.testType ? (testTypeLabels[testMetadata.testType] || testMetadata.testType) : '';

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <div className="container mx-auto py-6">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <div className="mb-6 flex flex-col items-center">
          <Avatar className="h-24 w-24 mx-auto bg-primary">
            <span className="text-2xl font-bold">{result.profileType.charAt(0) || "?"}</span>
          </Avatar>
          <h1 className="text-3xl font-bold mt-4 text-center text-primary dark:text-white">
            Resultado del Test
          </h1>
          
          {testTypeLabel && (
            <Badge variant="outline" className="mt-2 px-3 py-1 text-sm dark:bg-gray-800 dark:text-white">
              Test {testTypeLabel}
            </Badge>
          )}
          
          <div className="flex space-x-2 mt-6">
            <Button 
              variant={viewMode === 'summary' ? 'default' : 'outline'} 
              onClick={() => setViewMode('summary')}
              size="sm"
              className={viewMode === 'summary' ? '' : 'dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'}
            >
              Resumen
            </Button>
            <Button 
              variant={viewMode === 'detail' ? 'default' : 'outline'} 
              onClick={() => setViewMode('detail')}
              size="sm"
              className={viewMode === 'detail' ? '' : 'dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'}
            >
              Detallado
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <Card className="p-6 shadow-md border border-border dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary dark:text-white">{result.profileType}</h2>
                {testMetadata?.score !== undefined && testMetadata.score > 0 && (
                  <p className="text-muted-foreground dark:text-gray-400 mt-1">
                    Puntuación: {Math.round(testMetadata.score * 100)}%
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleDownloadReport} className="flex items-center gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
                  <Download className="h-4 w-4" />
                  Descargar PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleEmailReport} className="flex items-center gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
                  <Share className="h-4 w-4" />
                  Enviar por email
                </Button>
              </div>
            </div>
            
            {/* Metadata del test */}
            {testMetadata && (testMetadata.startTime || testMetadata.duration) && (
              <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground dark:text-gray-400">
                {testMetadata.startTime && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Realizado: {formatDate(testMetadata.startTime)}</span>
                  </div>
                )}
                {testMetadata.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Duración: {formatDuration(testMetadata.duration)}</span>
                  </div>
                )}
              </div>
            )}

            <Separator className="my-6 dark:bg-gray-700" />

            {viewMode === 'summary' ? (
              <ResultSummary result={result} />
            ) : (
              <MbtiSection result={result} />
            )}
          </Card>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-2 text-primary dark:text-white">¿Qué hacer ahora?</h3>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto dark:text-gray-300">
            Explora tus resultados y sigue aprendiendo sobre ti.
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 dark:hover:bg-primary/70">
              <ArrowLeft className="h-4 w-4" />
              Volver al Panel
            </Button>
            <Button variant="outline" onClick={() => navigate('/test/comprehensive')} className="flex items-center gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
              <RotateCcw className="h-4 w-4" />
              Realizar otro test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailsPage;