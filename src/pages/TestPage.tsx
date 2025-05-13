import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quickTestBlocks, comprehensiveTestBlocks } from '@/data/testQuestions';
import { mockResults } from '@/data/mockProfiles';
import { Question, Answer, QuestionBlock, TestResult } from '@/types';
import QuestionCard from '@/components/test/QuestionCard';
import TestProgress from '@/components/test/TestProgress';
import BlockIntro from '@/components/test/BlockIntro';
import { Button } from '@/components/ui/button';
import { profileTypes } from '@/data/mockProfiles';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/TranslationProvider';
import { useAuth } from '@/lib/sso/AuthContext';
import { config } from '@/config/environment';

const TestPage = () => {
  const { testType } = useParams<{ testType: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { user } = useAuth();
  
  const isComprehensive = testType === 'comprehensive';
  const isSpanish = language === 'es';
  
  // Get the right test blocks based on the test type
  const testBlocks = useMemo(() => 
    isComprehensive ? comprehensiveTestBlocks : quickTestBlocks, 
    [isComprehensive]
  );
  
  // Extract all questions into a flat array
  const allQuestions = useMemo(() => 
    testBlocks.flatMap(block => block.questions || block.preguntas || []), 
    [testBlocks]
  );
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [showingBlockIntro, setShowingBlockIntro] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [testId, setTestId] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  
  // Track which block we're in based on question index
  useEffect(() => {
    if (currentQuestionIndex < 0 || currentQuestionIndex >= allQuestions.length) return;
    
    let questionCount = 0;
    for (let i = 0; i < testBlocks.length; i++) {
      if (!testBlocks[i]) continue;
      
      // Handle both naming conventions
      const blockQuestions = testBlocks[i].questions || testBlocks[i].preguntas;
      if (!blockQuestions) continue;
      
      questionCount += blockQuestions.length;
      if (currentQuestionIndex < questionCount) {
        if (currentBlock !== i) {
          setCurrentBlock(i);
          setShowingBlockIntro(true);
        }
        break;
      }
    }
  }, [currentQuestionIndex, testBlocks, currentBlock, allQuestions.length]);

  // Al montar, obtener testId y crear sesión
  useEffect(() => {
    const startSession = async () => {
      const apiToken = localStorage.getItem('etedata_api_token');
      try {
        // 1. Obtener testId
        const testTypeEndpoint = `${config.apiUrl}/v1/tests/${testType}`;
        console.log('[TestPage] GET', testTypeEndpoint);
        const testsRes = await fetch(testTypeEndpoint, {
          headers: { 'Authorization': `Bearer ${apiToken}` }
        });
        if (!testsRes.ok) {
          setSessionError('No se pudo obtener el test.');
          console.error('[TestPage] Error al obtener tests:', await testsRes.text());
          return;
        }
        const tests = await testsRes.json();
        if (!Array.isArray(tests) || tests.length === 0) {
          setSessionError('No hay tests disponibles. Por favor, crea un test para poder comenzar.');
          return;
        }
        const selectedTest = tests[0];
        setTestId(selectedTest._id || selectedTest.id);
        // 2. Crear sesión
        const sessionRes = await fetch(`${config.apiUrl}/v1/tests/sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          },
          body: JSON.stringify({ test_id: selectedTest._id || selectedTest.id })
        });
        if (!sessionRes.ok) {
          setSessionError('No se pudo crear la sesión de test.');
          console.error('[TestPage] Error al crear sesión:', await sessionRes.text());
          return;
        }
        const sessionData = await sessionRes.json();
        if (!sessionData.id) {
          setSessionError('La sesión de test no tiene un ID válido.');
          console.error('[TestPage] Sesión inválida:', sessionData);
          return;
        }
        setSessionId(sessionData.id);
        setSessionError(null);
        console.log('[TestPage] Sesión creada:', sessionData);
      } catch (err) {
        setSessionError('Error inesperado al iniciar la sesión de test.');
        console.error('[TestPage] Error al iniciar sesión de test:', err);
      }
    };
    startSession();
  }, [testType]);

  // Handle an answer submission
  const handleAnswer = (answer: Answer) => {
    setAnswers(prev => [...prev, answer]);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (!sessionId) {
      setSessionError('La sesión de test no está lista. Espera unos segundos e inténtalo de nuevo.');
      return;
    }
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit test
      handleSubmitTest();
    }
  };

  // Start the current block's questions
  const handleStartBlock = () => {
    setShowingBlockIntro(false);
  };

  // Submit the completed test
  const handleSubmitTest = async () => {
    if (!sessionId) {
      setSessionError('No se puede enviar el test porque la sesión no está lista.');
      return;
    }
    setIsSubmitting(true);
    try {
      const apiToken = localStorage.getItem('etedata_api_token');
      // Map answers to { [questionId]: value }
      const answersObj = answers.reduce((acc, curr) => {
        acc[curr.questionId] = curr.value;
        return acc;
      }, {} as Record<string, any>);
      // 3. Actualizar sesión con respuestas
      const updateUrl = `${config.apiUrl}/v1/tests/sessions/${sessionId}`;
      console.log('[TestPage] PUT', updateUrl);
      console.log('[TestPage] Respuestas:', answersObj);
      const updateRes = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({ answers: answersObj })
      });
      const updateData = await updateRes.json();
      console.log('[TestPage] Sesión actualizada:', updateData);
      // 4. Completar sesión
      const completeUrl = `${config.apiUrl}/v1/tests/sessions/${sessionId}/complete`;
      console.log('[TestPage] POST', completeUrl);
      const completeRes = await fetch(completeUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });
      const completeData = await completeRes.json();
      console.log('[TestPage] Sesión completada:', completeData);
      toast.success(t('test.complete_success'));
      navigate(`/results/${completeData.id || completeData.session_id}`);
    } catch (err) {
      toast.error(t('test.error_title'));
      console.error('[TestPage] Error al enviar/completar test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate current block and question
  const currentBlockData = testBlocks[currentBlock];
  const questionsCompletedInPreviousBlocks = testBlocks
    .slice(0, currentBlock)
    .reduce((sum, block) => {
      const questionsLength = block?.questions?.length || block?.preguntas?.length || 0;
      return sum + questionsLength;
    }, 0);
  
  const currentQuestionInBlock = currentBlockData?.questions 
    ? currentQuestionIndex - questionsCompletedInPreviousBlocks 
    : currentBlockData?.preguntas
      ? currentQuestionIndex - questionsCompletedInPreviousBlocks
      : 0;
  
  const currentQuestion = currentBlockData?.questions?.[currentQuestionInBlock] || 
                         currentBlockData?.preguntas?.[currentQuestionInBlock];
  const totalQuestions = allQuestions.length || 0;

  // Check if current question exists
  const hasValidQuestion = Boolean(currentQuestion && (currentQuestion.text || currentQuestion.pregunta));

  // Función para inicializar tests demo
  const handleInitializeDemoTests = async () => {
    const apiToken = localStorage.getItem('etedata_api_token');
    try {
      const url = `${config.apiUrl}/v1/tests/initialize-demo-test`;
      console.log('[TestPage] POST', url);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      if (!res.ok) {
        setSessionError('No se pudo inicializar los tests demo.');
        console.error('[TestPage] Error al inicializar tests demo:', await res.text());
        return;
      }
      setSessionError(null);
      // Reintentar la carga de tests
      window.location.reload();
    } catch (err) {
      setSessionError('Error inesperado al inicializar los tests demo.');
      console.error('[TestPage] Error al inicializar tests demo:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            {t('test.exit')}
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-8">
        {sessionError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-300 text-center">
            {sessionError}
            {(() => {
              const err = sessionError.toLowerCase().replace(/[\.!]/g, '');
              if (
                err.includes('no tests') ||
                err.includes('no se pudo obtener el test') ||
                err.includes('no se pudo crear la sesión')
              ) {
                return (
                  <div className="mt-4">
                    <Button variant="globodain" onClick={handleInitializeDemoTests}>
                      Inicializar tests demo
                    </Button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-1">
            {isComprehensive ? t('test.comprehensive') : t('test.quick')}
          </h2>
          <p className="text-muted-foreground">
            {isComprehensive 
              ? t('test.comprehensive_description')
              : t('test.quick_description')}
          </p>
        </div>

        {!showingBlockIntro && hasValidQuestion && (
          <TestProgress 
            currentQuestion={currentQuestionIndex + 1} 
            totalQuestions={totalQuestions}
            currentBlock={currentBlock + 1}
            totalBlocks={testBlocks.length}
          />
        )}

        <div className="mt-8 flex justify-center">
          {showingBlockIntro && currentBlockData ? (
            <BlockIntro 
              block={currentBlockData} 
              blockNumber={currentBlock + 1} 
              totalBlocks={testBlocks.length}
              onStart={handleStartBlock}
            />
          ) : hasValidQuestion ? (
            <QuestionCard 
              question={currentQuestion} 
              onAnswer={handleAnswer}
              onNext={handleNextQuestion}
              disabled={!sessionId}
            />
          ) : (
            <div className="text-center p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{t('test.error_title')}</h3>
              <p className="mb-4">{t('test.error_description')}</p>
              <Button onClick={() => navigate('/dashboard')}>
                {t('test.return_dashboard')}
              </Button>
            </div>
          )}
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-medium">{t('test.analyzing')}</p>
              <p className="text-muted-foreground">{t('test.analyzing_description')}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TestPage;
