import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, Answer, QuestionBlock, TestResult } from '@/types';
import QuestionCard from '@/components/test/QuestionCard';
import TestProgress from '@/components/test/TestProgress';
import BlockIntro from '@/components/test/BlockIntro';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/TranslationProvider';
import { useAuth } from '@/lib/sso/AuthContext';
import { config } from '@/config/environment';
import { Navbar } from '@/components/Navbar';

const TestPage = () => {
  const { testType } = useParams<{ testType: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { user } = useAuth();
  
  // Validar que solo se puedan usar los tipos de test permitidos
  useEffect(() => {
    if (testType !== 'quick' && testType !== 'comprehensive') {
      navigate('/dashboard');
      toast.error(t('test.invalid_test_type'));
    }
  }, [testType, navigate, t]);
  
  const isComprehensive = testType === 'comprehensive';
  const isSpanish = language === 'es';
  
  // API data state
  const [testBlocks, setTestBlocks] = useState<QuestionBlock[]>([]);
  const [isLoadingTest, setIsLoadingTest] = useState<boolean>(true);
  const [testId, setTestId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  
  // Estado para el diálogo de sesión existente
  const [showSessionDialog, setShowSessionDialog] = useState<boolean>(false);
  const [existingSessionData, setExistingSessionData] = useState<any>(null);
  
  // Extract all questions into a flat array
  const allQuestions = useMemo(() => 
    testBlocks.flatMap(block => block.questions || block.preguntas || []), 
    [testBlocks]
  );
  
  // UI state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [showingBlockIntro, setShowingBlockIntro] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Estado para bloquear navegación mientras se guarda una respuesta
  const [isSavingAnswer, setIsSavingAnswer] = useState<boolean>(false);
  const [isContinuingSession, setIsContinuingSession] = useState<boolean>(false);

  // Referencia para la respuesta actual
  const currentAnswerRef = useRef<Answer | null>(null);
  
  // Add state to track retry attempts
  const [retryCount, setRetryCount] = useState<number>(0);
  const MAX_RETRIES = 3;

  // Retry session loading
  const handleRetryLoading = () => {
    if (retryCount >= MAX_RETRIES) {
      // Too many retries, redirect to dashboard
      toast.error(t('test.too_many_retries'));
      navigate('/dashboard');
      return;
    }
    
    setRetryCount(prevCount => prevCount + 1);
    setSessionError(null);
    setIsLoadingTest(true);
    
    // Reset states
    setTestBlocks([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setCurrentBlock(0);
    
    // Reiniciar el proceso
    const initTest = async () => {
      try {
        const apiToken = localStorage.getItem('etedata_api_token');
        if (!apiToken || !testType) {
          throw new Error('Missing API token or test type');
        }
        
        if (sessionId) {
          // If we have a session ID, try to load questions
          await loadTestQuestions(apiToken, testType);
        } else {
          // Otherwise reinitialize the whole thing
          const sessionEndpoint = `${config.apiUrl}/v1/tests/sessions`;
          const sessionRes = await fetch(sessionEndpoint, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${apiToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              test_type: testType
            })
          });

          if (!sessionRes.ok) {
            throw new Error(`Error creating session: ${await sessionRes.text()}`);
          }

          const sessionData = await sessionRes.json();
          
          if (!sessionData._id) {
            throw new Error('Invalid session data - no ID found');
          }
          
          setSessionId(sessionData._id);
          
          // Load questions
          await loadTestQuestions(apiToken, testType);
        }
      } catch (err) {
        console.error('[TestPage] Error during retry:', err);
        setSessionError(`Error al cargar el test (intento ${retryCount + 1}/${MAX_RETRIES}).`);
      } finally {
        setIsLoadingTest(false);
      }
    };
    
    initTest();
  };
  
  // Inicializar la sesión y cargar las preguntas del test
  useEffect(() => {
    const initializeTest = async () => {
      if (!testType || !user) return;
      
      const apiToken = localStorage.getItem('etedata_api_token');
      setIsLoadingTest(true);
      
      try {
        // Crear/recuperar sesión de test con el tipo de test y user_id
        const sessionEndpoint = `${config.apiUrl}/v1/tests/sessions`;
        const sessionRes = await fetch(sessionEndpoint, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            test_type: testType
          })
        });

        if (!sessionRes.ok) {
          const errorText = await sessionRes.text();
          console.error('[TestPage] Error creating session:', errorText);
          setSessionError('Error al crear la sesión del test. Por favor, inténtalo de nuevo.');
          return;
        }

        const sessionData = await sessionRes.json();
        console.log('[TestPage] Session data:', sessionData);

        if (!sessionData._id) {
          setSessionError('Los datos de la sesión no son válidos.');
          return;
        }
        
        // Guardar el ID de la sesión
        setSessionId(sessionData._id);
        
        if (sessionData.updated_at) {
          // Encontramos una sesión existente - guardar datos y mostrar diálogo
          setExistingSessionData(sessionData);
          setShowSessionDialog(true);
          return; // Detener la inicialización hasta que el usuario decida
        }
        
        // Si no hay sesión existente o el usuario eligió continuar, cargar las preguntas
        await loadTestQuestions(apiToken, testType);
        
      } catch (err) {
        setSessionError('Error inesperado al iniciar la sesión de test.');
        console.error('[TestPage] Error initializing test:', err);
      } finally {
        setIsLoadingTest(false);
      }
    };
    
    initializeTest();
  }, [testType, t, isComprehensive, user]);
  
  // Función para cargar las preguntas del test
  const loadTestQuestions = async (apiToken: string, testType: string) => {
    try {
      const questionsEndpoint = `${config.apiUrl}/v1/tests/questions/${testType}`;
      console.log('[TestPage] GET', questionsEndpoint);
      
      const questionsRes = await fetch(questionsEndpoint, {
        headers: { 
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (!questionsRes.ok) {
        const errorText = await questionsRes.text();
        console.error('[TestPage] Error getting questions:', errorText);
        setSessionError('Error al cargar las preguntas del test. Por favor, inténtalo de nuevo.');
        setTestBlocks([]); // Ensure testBlocks is at least an empty array
        return;
      }

      let questionsData;
      try {
        questionsData = await questionsRes.json();
        console.log('[TestPage] Questions data:', questionsData);
      } catch (jsonError) {
        console.error('[TestPage] Error parsing questions JSON:', jsonError);
        setSessionError('Error al procesar los datos del test. Por favor, inténtalo de nuevo.');
        setTestBlocks([]);
        return;
      }
      
      // Validar la estructura de los datos
      if (!questionsData || typeof questionsData !== 'object') {
        console.error('[TestPage] Invalid questions data format (not an object):', questionsData);
        setSessionError('El formato de los datos del test no es válido.');
        setTestBlocks([]);
        return;
      }
      
      // Formatear las preguntas en bloques
      if (questionsData.blocks && Array.isArray(questionsData.blocks)) {
        // Verificar que los bloques tienen una estructura válida
        const validBlocks = questionsData.blocks.filter(block => 
          block && 
          (Array.isArray(block.questions) || Array.isArray(block.preguntas))
        );
        
        if (validBlocks.length > 0) {
          setTestBlocks(validBlocks);
        } else {
          console.error('[TestPage] No valid blocks found in data');
          setSessionError('No se encontraron bloques válidos en los datos del test.');
          setTestBlocks([]);
        }
      } else if (questionsData.questions && Array.isArray(questionsData.questions)) {
        // Verificar que las preguntas tienen una estructura válida
        const validQuestions = questionsData.questions.filter(question => 
          question && question.id && (question.text || question.pregunta)
        );
        
        if (validQuestions.length > 0) {
          // Si no hay bloques definidos, crear un solo bloque con todas las preguntas
          const formattedBlock = {
            id: 'all-questions',
            title: isComprehensive ? t('test.comprehensive') : t('test.quick'),
            titleEs: isComprehensive ? 'Evaluación Completa' : 'Evaluación Rápida',
            description: isComprehensive ? t('test.comprehensive_description') : t('test.quick_description'),
            descriptionEs: isComprehensive 
              ? 'Análisis profundo de tu personalidad y aptitudes'
              : 'Evaluación breve de tu perfil profesional',
            questions: validQuestions
          };
          
          setTestBlocks([formattedBlock]);
        } else {
          console.error('[TestPage] No valid questions found in data');
          setSessionError('No se encontraron preguntas válidas en los datos del test.');
          setTestBlocks([]);
        }
      } else {
        // No valid data found
        console.error('[TestPage] Invalid questions data format (no blocks or questions):', questionsData);
        setSessionError('El formato de los datos del test no es válido.');
        setTestBlocks([]);
      }
      
      setSessionError(null);
    } catch (err) {
      console.error('[TestPage] Error loading test questions:', err);
      setSessionError('Error al cargar las preguntas del test.');
      setTestBlocks([]); // Initialize as empty array on error
    }
  };
  
  // Manejar reinicio de sesión
  const handleResetSession = async () => {
    if (!existingSessionData || !existingSessionData._id) return;
    
    setShowSessionDialog(false);
    setIsLoadingTest(true);
    
    try {
      const apiToken = localStorage.getItem('etedata_api_token');
      
      // Llamar al endpoint para reiniciar la sesión
      const resetEndpoint = `${config.apiUrl}/v1/tests/sessions/${existingSessionData._id}`;
      const resetRes = await fetch(resetEndpoint, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!resetRes.ok) {
        throw new Error(`Error al reiniciar la sesión: ${await resetRes.text()}`);
      }
      
      // Obtener la sesión reiniciada
      const resetData = await resetRes.json();
      setSessionId(resetData._id);

      return location.reload()
      
    } catch (err) {
      console.error('[TestPage] Error resetting session:', err);
      setSessionError('Error al reiniciar la sesión del test. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoadingTest(false);
    }
  };
  
  const handleContinueSession = async () => {
    if (!existingSessionData) return;
    
    setShowSessionDialog(false);
    setIsLoadingTest(true);
    setIsContinuingSession(true);

    try {
      const apiToken = localStorage.getItem('etedata_api_token');
      
      // Cargar las preguntas primero para tener allQuestions disponible
      await loadTestQuestions(apiToken, testType || '');
      
      // Esperar a que los datos estén disponibles (React state updates are async)
      // Añadimos un pequeño delay para asegurar que testBlocks y allQuestions están actualizados
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Verificar que se cargaron datos válidos - con un enfoque más tolerante
      if (testBlocks.length === 0) {
        console.warn('[TestPage] No test blocks available after loading');
        // En lugar de lanzar error, intentamos continuar de todas formas
      }
      
      // Recuperar las respuestas previas si existen
      let answersArray: Answer[] = [];
      if (existingSessionData.answers) {
        answersArray = Object.entries(existingSessionData.answers).map(([questionId, value]) => ({
          questionId,
          value
        })) as Answer[];
        
        // Convertir a Answer[] - forzamos el tipo
        setAnswers(answersArray);
        console.log('[TestPage] Loaded previous answers:', answersArray);
      }
      
      // Procesar después de que se carguen las preguntas
      setTimeout(() => {
        // Obtener las preguntas otra vez, ya que el estado podría haberse actualizado
        const currentAllQuestions = testBlocks.flatMap(block => block?.questions || block?.preguntas || []);
        
        if (currentAllQuestions.length > 0 && existingSessionData.answers) {
          // Obtener los IDs de las preguntas respondidas
          const answeredQuestionIds = Object.keys(existingSessionData.answers);
          console.log('[TestPage] Answered question IDs:', answeredQuestionIds);
          
          // Encontrar la primera pregunta que no ha sido respondida
          const nextQuestionIndex = currentAllQuestions.findIndex(
            question => !answeredQuestionIds.includes(question.id)
          );
          
          console.log('[TestPage] Next unanswered question index:', nextQuestionIndex);
          
          if (nextQuestionIndex >= 0) {
            // Si encontramos una pregunta no respondida, posicionamos ahí
            setCurrentQuestionIndex(nextQuestionIndex);
            
            // IMPORTANTE: Forzar la visualización de la pregunta, no la intro del bloque
            setShowingBlockIntro(false);
            console.log(`[TestPage] Positioning at question index ${nextQuestionIndex}`);
            
            // Inicializar también la referencia del estado actual a null para asegurar la validación
            currentAnswerRef.current = null;
          } else if (currentAllQuestions.length > 0) {
            // Si todas han sido respondidas, posicionamos en la última
            setCurrentQuestionIndex(currentAllQuestions.length - 1);
            setShowingBlockIntro(false);
            console.log(`[TestPage] All questions answered, positioning at last question`);
            
            // En este caso, si todas están respondidas, establecemos la referencia a la última respuesta
            const lastQuestionId = currentAllQuestions[currentAllQuestions.length - 1]?.id;
            if (lastQuestionId) {
              const lastAnswer = answersArray.find(a => a.questionId === lastQuestionId);
              currentAnswerRef.current = lastAnswer || null;
            }
          } else {
            // Si no hay preguntas, volvemos al inicio del test
            console.warn('[TestPage] No questions found, resetting to beginning');
            setCurrentQuestionIndex(0);
            setShowingBlockIntro(true);
          }
        } else {
          // Si no hay preguntas o respuestas, volvemos al inicio del test
          console.warn('[TestPage] No questions or answers found, resetting to beginning');
          setCurrentQuestionIndex(0);
          setShowingBlockIntro(true);
        }
      }, 500);
      
    } catch (err) {
      console.error('[TestPage] Error continuing session:', err);
      setSessionError('Error al continuar la sesión del test. Por favor, inténtalo de nuevo.');
      // Ensure a consistent state
      setTestBlocks([]);
      setAnswers([]);
      setCurrentQuestionIndex(0);
      setCurrentBlock(0);
    } finally {
      setIsLoadingTest(false);
    }
  };

  // Reset isContinuingSession after a specfici time
  useEffect(() => {
    if (isContinuingSession && !isLoadingTest) {
      const timer = setTimeout(() => {
        setIsContinuingSession(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isContinuingSession, isLoadingTest]);

  // Comprobar si la pregunta actual tiene respuesta
  const hasAnswerForCurrentQuestion = useMemo(() => {
    if (currentQuestionIndex < 0 || !allQuestions[currentQuestionIndex]) return false;
    const currentId = allQuestions[currentQuestionIndex].id;
    return answers.some(answer => answer.questionId === currentId);
  }, [answers, currentQuestionIndex, allQuestions]);

  useEffect(() => {
    if (currentQuestionIndex < 0 || currentQuestionIndex >= allQuestions.length) return;
    
    // If testBlocks is empty, nothing to do
    if (!testBlocks || testBlocks.length === 0) {
      console.log('[TestPage] No test blocks available');
      return;
    }
    
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

          if (!isContinuingSession) {
            setShowingBlockIntro(true);
          }
        }
        break;
      }
    }
    
    // Reiniciar la referencia y buscar respuesta existente
    currentAnswerRef.current = null;
    
    // Comprobar si ya tenemos una respuesta para esta pregunta
    const currentQuestionId = allQuestions[currentQuestionIndex]?.id;
    if (currentQuestionId) {
      const existingAnswer = answers.find(a => a.questionId === currentQuestionId);
      if (existingAnswer) {
        currentAnswerRef.current = existingAnswer;
        console.log(`[TestPage] Found existing answer for question ${currentQuestionId}:`, existingAnswer);
      }
    }
    
  }, [currentQuestionIndex, testBlocks, currentBlock, allQuestions.length, isContinuingSession]);

  // Handle an answer submission - llamado desde QuestionCard cuando el usuario selecciona una opción
  const handleAnswer = (answer: Answer) => {
    console.log('[TestPage] handleAnswer called with:', answer);
    
    if (!answer || !answer.questionId) {
      console.error('[TestPage] Invalid answer object received');
      return;
    }
    
    // Guardamos la respuesta tanto en la referencia como en el estado
    currentAnswerRef.current = answer;
    
    setAnswers(prev => {
      // Check if we already have an answer for this question
      const existingIndex = prev.findIndex(a => a.questionId === answer.questionId);
      
      let newAnswers;
      if (existingIndex >= 0) {
        // Replace existing answer
        newAnswers = [...prev];
        newAnswers[existingIndex] = answer;
      } else {
        // Add new answer
        newAnswers = [...prev, answer];
      }
      
      console.log('[TestPage] Updated answers state:', newAnswers);
      return newAnswers;
    });
  };

  // Función para guardar una respuesta en el backend
  const saveAnswerToServer = async (questionId: string, answerValue: any): Promise<boolean> => {
    if (!sessionId) {
      console.error('[TestPage] Cannot save answer: No active session');
      return false;
    }
    
    try {
      setIsSavingAnswer(true);
      
      const apiToken = localStorage.getItem('etedata_api_token');
      
      // Formatear la respuesta para el backend
      const answersObject = {
        [questionId]: answerValue
      };
      
      console.log('[TestPage] Saving answer to server:', {
        questionId,
        value: answerValue,
        endpoint: `${config.apiUrl}/v1/tests/sessions/${sessionId}`
      });
      
      // Enviar la respuesta
      const updateRes = await fetch(`${config.apiUrl}/v1/tests/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({ answers: answersObject })
      });
      
      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        console.error(`[TestPage] Failed to save answer: ${errorText}`);
        return false;
      }
      
      const responseData = await updateRes.json();
      console.log('[TestPage] Server response after saving answer:', responseData);
      
      // Verificar que la respuesta se guardó correctamente
      if (responseData.answers && questionId in responseData.answers) {
        console.log('[TestPage] Answer saved successfully');
        return true;
      } else {
        console.error('[TestPage] Answer not found in server response');
        return false;
      }
    } catch (err) {
      console.error('[TestPage] Error saving answer:', err);
      return false;
    } finally {
      setIsSavingAnswer(false);
    }
  };

  // Move to the next question - cuando el usuario hace clic en "Siguiente"
  const handleNextQuestion = async () => {
    console.log("[TestPage] handleNextQuestion called");
    
    if (!sessionId) {
      console.error("[TestPage] No session ID available");
      setSessionError('La sesión de test no está lista. Espera unos segundos e inténtalo de nuevo.');
      return;
    }
    
    if (isSavingAnswer) {
      console.log("[TestPage] Already saving an answer, please wait");
      toast.info(t('test.saving_answer'));
      return;
    }
    
    // Obtener la pregunta actual
    const currentQuestionId = allQuestions[currentQuestionIndex]?.id;
    console.log("[TestPage] Current question ID:", currentQuestionId);
    
    if (!currentQuestionId) {
      console.error("[TestPage] No valid question ID found");
      return;
    }
    
    // Aquí está el cambio principal: usamos la referencia para la respuesta actual
    const currentAnswer = currentAnswerRef.current;
    console.log("[TestPage] Current answer from ref:", currentAnswer);
    
    // Si no hay respuesta en la referencia, buscamos en el estado
    if (!currentAnswer) {
      const storedAnswer = answers.find(a => a.questionId === currentQuestionId);
      console.log("[TestPage] Trying to find answer in state:", storedAnswer);
      
      if (storedAnswer) {
        // Si encontramos la respuesta en el estado, la usamos y actualizamos la referencia
        currentAnswerRef.current = storedAnswer;
      } else {
        // Si realmente no hay respuesta, mostramos mensaje y no avanzamos
        console.log("[TestPage] No answer for current question");
        toast.error(t('test.answer_required'));
        return;
      }
    }
    
    // En este punto, currentAnswerRef.current debería tener una respuesta válida
    if (!currentAnswerRef.current) {
      console.error("[TestPage] Still no answer available");
      toast.error(t('test.answer_required'));
      return;
    }
    
    // Guardar la respuesta actual en el servidor antes de avanzar
    const saveSuccess = await saveAnswerToServer(
      currentAnswerRef.current.questionId, 
      currentAnswerRef.current.value
    );
    
    if (!saveSuccess) {
      console.error("[TestPage] Failed to save answer to server");
      toast.error(t('test.error_saving_answer'));
      return; // No avanzamos si hay un error al guardar
    }
    
    // Reiniciar la referencia para la nueva pregunta ANTES de avanzar
    currentAnswerRef.current = null;
    
    // Avanzar a la siguiente pregunta
    if (currentQuestionIndex < allQuestions.length - 1) {
      console.log("[TestPage] Moving to next question");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("[TestPage] Reached last question, submitting test");
      // Si es la última pregunta, completar el test
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
    
    // Verificar que todas las preguntas tienen respuesta
    const unansweredQuestions = allQuestions.filter(
      q => !answers.some(a => a.questionId === q.id)
    );
    
    if (unansweredQuestions.length > 0) {
      console.log('[TestPage] Unanswered questions:', unansweredQuestions);
      toast.error(t('test.complete_all_questions'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const apiToken = localStorage.getItem('etedata_api_token');
      
      // Completar la sesión
      const completeUrl = `${config.apiUrl}/v1/tests/sessions/${sessionId}/complete`;
      console.log('[TestPage] POST', completeUrl);
      
      const completeRes = await fetch(completeUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });
      
      if (!completeRes.ok) {
        const errorText = await completeRes.text();
        throw new Error(`Failed to complete test: ${errorText}`);
      }
      
      const completeData = await completeRes.json();
      console.log('[TestPage] Session completed:', completeData);
      
      toast.success(t('test.complete_success'));
      
      // Redirigir a la página de resultados usando el ID del test
      console.log("completeData", completeData);
      navigate(`/results/${completeData.test_result_id}`);
    } catch (err) {
      toast.error(t('test.error_title'));
      console.error('[TestPage] Error completing test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate current block and question
  const currentBlockData = testBlocks[currentBlock] || null;
  const questionsCompletedInPreviousBlocks = testBlocks
    .slice(0, currentBlock)
    .reduce((sum, block) => {
      if (!block) return sum;
      const questionsLength = block?.questions?.length || block?.preguntas?.length || 0;
      return sum + questionsLength;
    }, 0);
  
  let currentQuestionInBlock = 0;
  if (currentBlockData) {
    const blockQuestions = currentBlockData.questions || currentBlockData.preguntas;
    if (blockQuestions && blockQuestions.length > 0) {
      currentQuestionInBlock = Math.min(
        currentQuestionIndex - questionsCompletedInPreviousBlocks,
        blockQuestions.length - 1
      );
    }
  }
  
  let currentQuestion = null;
  if (currentBlockData) {
    const blockQuestions = currentBlockData.questions || currentBlockData.preguntas;
    if (blockQuestions && blockQuestions.length > 0) {
      currentQuestion = blockQuestions[currentQuestionInBlock];
    }
  }
  
  const totalQuestions = allQuestions.length || 0;

  // Check if current question exists
  const hasValidQuestion = Boolean(currentQuestion && (currentQuestion.text || currentQuestion.pregunta));

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      {showSessionDialog && existingSessionData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-semibold mb-3">{t('test.existing_session_title')}</h3>
            <p className="mb-4">{t('test.existing_session_message')}</p>
            <p className="text-sm text-muted-foreground mb-4">
              {t('test.last_updated')}: {new Date(existingSessionData.updated_at).toLocaleString()}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={handleResetSession}
              >
                {t('test.restart_session')}
              </Button>
              <Button 
                onClick={handleContinueSession}
              >
                {t('test.continue_session')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto py-8">
        <main className="flex-1 container py-8">
        {sessionError && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
            <p>{sessionError}</p>
            <div className="mt-4 flex gap-3">
              <Button 
                onClick={handleRetryLoading} 
                disabled={isLoadingTest || retryCount >= MAX_RETRIES}
              >
                {isLoadingTest ? t('test.retrying') : t('test.retry')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                {t('test.back_to_dashboard')}
              </Button>
            </div>
          </div>
        )}
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-1">
            {isComprehensive 
              ? t('test.comprehensive') 
              : t('test.quick')}
          </h2>
          <p className="text-muted-foreground">
            {isComprehensive 
              ? t('test.comprehensive_description')
              : t('test.quick_description')}
          </p>
        </div>

        {isLoadingTest ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">{t('test.loading')}</p>
          </div>
        ) : (
          <>
            <div className="mb-8 max-w-2xl mx-auto">
              <TestProgress 
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={totalQuestions}
                currentBlock={currentBlock + 1}
                totalBlocks={testBlocks.length}
              />
            </div>
            
            {showingBlockIntro ? (
              currentBlockData ? (
                <BlockIntro 
                  block={currentBlockData}
                  blockNumber={currentBlock + 1}
                  totalBlocks={testBlocks.length}
                  onStart={handleStartBlock}
                />
              ) : (
                <div className="max-w-2xl mx-auto text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>{t('test.loading_block')}</p>
                </div>
              )
            ) : (
              <div className="question-container">
                {hasValidQuestion ? (
                  <QuestionCard 
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    onNext={handleNextQuestion}
                    onPrevious={() => setCurrentQuestionIndex(prevIndex => Math.max(0, prevIndex - 1))}
                    showBackButton={currentQuestionIndex > 0}
                    isFirstQuestion={currentQuestionIndex === 0}
                    currentAnswer={currentAnswerRef.current?.value}
                    isNextDisabled={isSavingAnswer}
                    className="animate-fade-in"
                  />
                ) : (
                  <div className="max-w-2xl mx-auto text-center p-6 bg-background rounded-lg shadow-md">
                    <p className="text-red-500 mb-4">{t('test.question_error')}</p>
                    <Button onClick={() => navigate('/dashboard')}>{t('test.back_to_dashboard')}</Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

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
    </div>
  );
};

export default TestPage;