import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TestResult } from '@/types';
import { useTranslation } from '@/lib/TranslationProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Share, RotateCcw } from 'lucide-react';
import { Loading } from '@/components/Loading';
import MbtiSection from '@/components/results/MbtiSection';
import ResultSummary from '@/components/results/ResultSummary';
import { useAuth } from '@/lib/sso/AuthContext';
import { config } from '@/config/environment';

const ResultsPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'summary' | 'detail'>('summary');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.result) {
      setResult(location.state.result);
      setLoading(false);
      return;
    }
    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiToken = localStorage.getItem('etedata_api_token');
        
        // Determinar la URL correcta según el formato del ID
        // Si la ruta incluye "session/", usar el endpoint de resultados de sesión
        let apiUrl;
        if (testId && location.pathname.includes('session/')) {
          // Para IDs de sesión, usar el endpoint de resultados de sesión directamente
          apiUrl = `${config.apiUrl}/v1/tests/results/${testId.replace('session/', '')}`;
        } else {
          // Para IDs de resultado, usar el endpoint de resultados directamente
          apiUrl = `${config.apiUrl}/v1/tests/results/${testId}`;
        }
        
        console.log('[ResultsPage] Fetching results from:', apiUrl);
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          }
        });
        if (!response.ok) throw new Error('Error fetching results');
        const data = await response.json();
        console.log('[ResultsPage] Respuesta cruda del backend:', data);
        
        // Mapear correctamente los datos del resultado del test
        const mapped: TestResult = {
          profileType: data.profileType || data.mbti_type || '',
          mbtiType: data.mbtiType || data.mbti_type || '',
          mbtiGroup: data.mbtiGroup || data.mbti_group || '',
          skills: data.skills || data.recommended_skills || [],
          interests: data.interests || data.recommended_interests || [],
          similiarPersonalities: data.similiarPersonalities || data.recommended_personalities || [],
          recommendedProfessions: data.recommendedProfessions || data.recommended_professions || [],
          advice: data.advice || (data.recommended_advices?.join(', ') || ''),
          recommendedActivities: data.recommendedActivities || data.recommended_activities || [],
        };
        console.log('[ResultsPage] Objeto mapeado para UI:', mapped);
        setResult(mapped);
      } catch (err) {
        console.error('[ResultsPage] Error al cargar resultado:', err);
        setError(t('results.error_loading'));
      } finally {
        setLoading(false);
      }
    };
    if (testId) fetchResult();
  }, [testId, t, location.state, location.pathname]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h2 className="text-xl font-bold text-red-500 dark:text-red-400">{error}</h2>
        <Button onClick={() => navigate('/dashboard')} className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
          {t('results.dashboard')}
        </Button>
      </div>
    );
  }

  if (!result || !result.mbtiType || result.mbtiType.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <h2 className="text-xl font-bold text-red-500 dark:text-red-400">{t('results.error_loading')}</h2>
        <Button onClick={() => navigate('/dashboard')} className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
          {t('results.dashboard')}
        </Button>
      </div>
    );
  }

  const handleDownloadReport = () => {
    if (!result) return;
    
    // Crear un objeto con los datos del test para exportar como PDF
    const reportData = {
      title: `Personality Test Results - ${result.mbtiType}`,
      date: new Date().toLocaleDateString(),
      mbtiType: result.mbtiType,
      skills: result.skills,
      interests: result.interests,
      personalities: result.similiarPersonalities,
      professions: result.recommendedProfessions,
      advice: result.advice,
      activities: result.recommendedActivities
    };
    
    // En una implementación real, aquí se utilizaría una biblioteca para generar PDF
    // Como jsPDF, pdfmake, html2pdf o similar
    
    // Versión simple: crear un blob con JSON para demostración
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace para descargar
    const a = document.createElement('a');
    a.href = url;
    a.download = `personality-report-${result.mbtiType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    // TODO: En un entorno de producción, se llamaría a un endpoint del backend para generar el PDF
    console.log('Reporte descargado:', reportData);
  };

  const handleEmailReport = () => {
    if (!result || !user) return;
    
    // Mostrar un diálogo o modal para confirmar el envío del email
    if (window.confirm(t('results.confirm_email_send'))) {
      // En un entorno real, aquí se llamaría a un endpoint del backend para enviar el email
      
      // Simulación del envío de email
      console.log('Enviando email con resultados del test a:', user.email);
      console.log('Datos del test:', {
        mbtiType: result.mbtiType,
        skills: result.skills,
        interests: result.interests,
        personalities: result.similiarPersonalities,
        professions: result.recommendedProfessions
      });
      
      // Mostrar confirmación al usuario
      alert(t('results.email_sent_confirmation'));
      
      // TODO: En una implementación real, esto sería una llamada API:
      // await fetch(`${config.apiUrl}/v1/tests/email-results`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${apiToken}`
      //   },
      //   body: JSON.stringify({ testId, email: user.email })
      // });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <div className="container mx-auto py-6">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
          className="mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('results.dashboard')}
        </Button>

        <div className="mb-6 flex flex-col items-center">
          <Avatar className="h-24 w-24 mx-auto bg-primary">
            <span className="text-2xl font-bold">{result.mbtiType && result.mbtiType.length > 0 ? result.mbtiType.charAt(0) : "?"}</span>
          </Avatar>
          <h1 className="text-3xl font-bold mt-4 text-center text-primary dark:text-white">
            {t('results.title')}
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            {new Date().toLocaleDateString()}
          </p>

          <div className="flex space-x-2 mt-6">
            <Button 
              variant={viewMode === 'summary' ? 'default' : 'outline'} 
              onClick={() => setViewMode('summary')}
              size="sm"
              className={viewMode === 'summary' ? '' : 'dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'}
            >
              {t('results.summary_view')}
            </Button>
            <Button 
              variant={viewMode === 'detail' ? 'default' : 'outline'} 
              onClick={() => setViewMode('detail')}
              size="sm"
              className={viewMode === 'detail' ? '' : 'dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'}
            >
              {t('results.detailed_view')}
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <Card className="p-6 shadow-md border border-border dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary dark:text-white">{result.mbtiType || result.profileType}</h2>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleDownloadReport} className="flex items-center gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
                  <Download className="h-4 w-4" />
                  {t('results.download_pdf')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleEmailReport} className="flex items-center gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
                  <Share className="h-4 w-4" />
                  {t('results.email_results')}
                </Button>
              </div>
            </div>

            <Separator className="my-6 dark:bg-gray-700" />

            {viewMode === 'summary' ? (
              <ResultSummary result={result} onDownloadReport={handleDownloadReport} onEmailReport={handleEmailReport} />
            ) : (
              <MbtiSection result={result} />
            )}
          </Card>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-2 text-primary dark:text-white">{t('results.what_next')}</h3>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto dark:text-gray-300">
            {t('results.next_steps_description')}
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 dark:hover:bg-primary/70">
              <ArrowLeft className="h-4 w-4" />
              {t('results.back_to_dashboard')}
            </Button>
            <Button variant="outline" onClick={() => navigate('/test/comprehensive')} className="flex items-center gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
              <RotateCcw className="h-4 w-4" />
              {t('results.take_another_test')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
