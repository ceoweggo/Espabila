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
        const response = await fetch(`${config.apiUrl}/v1/tests/${testId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          }
        });
        if (!response.ok) throw new Error('Error fetching results');
        const data = await response.json();
        console.log('[ResultsPage] Respuesta cruda del backend:', data);
        const raw = data.profile || data.result || data;
        const mapped: TestResult = {
          profileType: raw.profileType || raw.profile_type || '',
          mbtiType: raw.mbtiType || raw.mbti_type || '',
          mbtiGroup: raw.mbtiGroup || raw.mbti_group || '',
          skills: raw.skills || [],
          interests: raw.interests || [],
          similiarPersonalities: raw.similiarPersonalities || raw.similarPersonalities || raw.similar_personalities || [],
          recommendedProfessions: raw.recommendedProfessions || raw.recommended_professions || [],
          advice: raw.advice || '',
          recommendedActivities: raw.recommendedActivities || raw.recommended_activities || [],
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
  }, [testId, t, location.state]);

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

  if (!result || typeof result.profileType !== 'string' || result.profileType.length === 0) {
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
    // In a real app, this would generate and download a PDF
    console.log('Downloading report...');
  };

  const handleEmailReport = () => {
    // In a real app, this would send the report via email
    console.log('Emailing report...');
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
            <span className="text-2xl font-bold">{typeof result.profileType === 'string' && result.profileType.length > 0 ? result.profileType.charAt(0) : "?"}</span>
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
                <h2 className="text-2xl font-bold text-primary dark:text-white">{result.profileType}</h2>
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
              <ResultSummary result={result} />
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
