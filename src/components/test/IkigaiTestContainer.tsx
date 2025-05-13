import { useState, useEffect } from 'react';
import { ikigaiTestBlocks } from '@/data/ikigaiTest';
import QuestionCard from './QuestionCard';
import TestProgress from './TestProgress';
import BlockIntro from './BlockIntro';
import { Answer } from '@/types';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/TranslationProvider';
import { useAuth } from '@/lib/sso/AuthContext';
import { useNavigate } from 'react-router-dom';
import { config } from '@/config/environment';

// Optional configuration
const TEST_CONFIG = {
  tiempoMaximo: "20-25 min",
};

const IkigaiTestContainer = () => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
  const [showingBlockIntro, setShowingBlockIntro] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if test data is available
  if (!ikigaiTestBlocks || ikigaiTestBlocks.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-6">{t('ikigai.error')}</h1>
        <p className="text-xl mb-8">{t('ikigai.data_error')}</p>
      </div>
    );
  }

  const totalBlocks = ikigaiTestBlocks.length;
  const totalQuestions = ikigaiTestBlocks.reduce((acc, block) => acc + (block.preguntas?.length || 0), 0);
  
  const currentBlock = ikigaiTestBlocks[currentBlockIndex];
  const currentQuestionNumber = ikigaiTestBlocks
    .slice(0, currentBlockIndex)
    .reduce((acc, block) => acc + (block.preguntas?.length || 0), 0) + currentQuestionIndex + 1;
  
  const handleStartBlock = () => {
    setShowingBlockIntro(false);
  };
  
  const handleNextQuestion = () => {
    // Ensure currentBlock and its preguntas exist
    if (!currentBlock || !currentBlock.preguntas) {
      console.error("Current block or its questions are undefined");
      return;
    }

    // If we're at the end of the questions in this block
    if (currentQuestionIndex >= currentBlock.preguntas.length - 1) {
      // Move to the next block
      if (currentBlockIndex < totalBlocks - 1) {
        setCurrentBlockIndex(prevIndex => prevIndex + 1);
        setCurrentQuestionIndex(0);
        setShowingBlockIntro(true);
      } else {
        // Test completed
        setTestCompleted(true);
      }
    } else {
      // Move to the next question in the current block
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handleAnswer = (answer: Answer) => {
    setAnswers(prev => [...prev, answer]);
  };
  
  const handleTestComplete = async () => {
    setIsSubmitting(true);
    try {
      const answersObj = answers.reduce((acc, curr) => {
        acc[curr.questionId] = curr.value;
        return acc;
      }, {} as Record<string, any>);
      const apiToken = localStorage.getItem('etedata_api_token');
      console.log('Enviando test Ikigai a:', `${config.apiUrl}/v1/tests/sessions`);
      console.log('Token usado:', apiToken);
      const body = {
        test_type: 'ikigai',
        answers: answersObj,
        language: 'es',
      };
      console.log('Body enviado:', body);
      const response = await fetch(`${config.apiUrl}/v1/tests/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Error submitting test');
      const data = await response.json();
      navigate(`/results/${data.test_id || data.testId}`);
    } catch (err) {
      // Puedes mostrar un toast de error aquí
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If the test is completed, you would typically redirect to a results page
  if (testCompleted) {
    handleTestComplete();
    return (
      <div className="container mx-auto p-4 max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-6">{t('ikigai.test_completed')}</h1>
        <p className="text-xl mb-8">{t('ikigai.thanks')}</p>
        <p className="mb-4">{t('ikigai.results_preparation')}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Optional header with test info */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('ikigai.title')}</h1>
        <p className="text-muted-foreground mb-2">{t('ikigai.intro_message')}</p>
        <p className="text-sm">{t('ikigai.estimated_time')}: {TEST_CONFIG.tiempoMaximo}</p>
      </div>
      
      {/* Test progress bar */}
      <TestProgress 
        currentQuestion={currentQuestionNumber}
        totalQuestions={totalQuestions}
        currentBlock={currentBlockIndex + 1}
        totalBlocks={totalBlocks}
      />
      
      {/* Either show block intro or current question */}
      {showingBlockIntro ? (
        <BlockIntro
          block={currentBlock}
          blockNumber={currentBlockIndex + 1}
          totalBlocks={totalBlocks}
          onStart={handleStartBlock}
        />
      ) : (
        currentBlock && currentBlock.preguntas && currentBlock.preguntas[currentQuestionIndex] ? (
          <QuestionCard
            question={currentBlock.preguntas[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            className="animate-fade-in"
          />
        ) : (
          <div className="text-center p-6">
            <p className="text-red-500">{t('ikigai.question_error')}</p>
            <Button onClick={handleNextQuestion} className="mt-4">{t('ikigai.try_next')}</Button>
          </div>
        )
      )}
    </div>
  );
};

export default IkigaiTestContainer; 