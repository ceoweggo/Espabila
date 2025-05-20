import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronLeft, CheckIcon  } from "lucide-react";
import { Question, Answer, QuestionOption } from "@/types";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/TranslationProvider';

type QuestionCardProps = {
  question: Question;
  onAnswer: (answer: Answer) => void;
  onNext: () => void;
  onPrevious?: () => void;
  showBackButton?: boolean;
  isFirstQuestion?: boolean;
  currentAnswer?: any; // Temporal, to avoid errors
  isNextDisabled?: boolean;
  className?: string;
}

const CircularChoiceOption = ({ 
  option, 
  selected, 
  onChange, 
  index, 
  isColorQuestion,
  language = 'ES'
}) => {
  // Para opciones de color, determinar el color de fondo
  const getColorValue = (colorName) => {
    // Mapa de colores en español e inglés
    const colorMap = {
      // Español
      "amarillo": "bg-yellow-400 text-yellow-900",
      "amarillo:": "bg-yellow-400 text-yellow-900",
      "azul": "bg-blue-500 text-white",
      "azul:": "bg-blue-500 text-white",
      "rojo": "bg-red-500 text-white",
      "rojo:": "bg-red-500 text-white",
      "verde": "bg-green-500 text-white",
      "verde:": "bg-green-500 text-white",
      "naranja": "bg-orange-500 text-white",
      "naranja:": "bg-orange-500 text-white",
      "violeta": "bg-purple-500 text-white",
      "violeta:": "bg-purple-500 text-white",
      "negro": "bg-black text-white",
      "negro:": "bg-black text-white",
      "blanco": "bg-white text-black border border-gray-300",
      "blanco:": "bg-white text-black border border-gray-300",
      "gris": "bg-gray-500 text-white",
      "gris:": "bg-gray-500 text-white",
      "rosa": "bg-pink-400 text-white",
      "rosa:": "bg-pink-400 text-white",
      
      // Inglés
      "yellow": "bg-yellow-400 text-yellow-900",
      "yellow:": "bg-yellow-400 text-yellow-900",
      "blue": "bg-blue-500 text-white",
      "blue:": "bg-blue-500 text-white",
      "red": "bg-red-500 text-white",
      "red:": "bg-red-500 text-white",
      "green": "bg-green-500 text-white",
      "green:": "bg-green-500 text-white",
      "orange": "bg-orange-500 text-white",
      "orange:": "bg-orange-500 text-white",
      "purple": "bg-purple-500 text-white",
      "violet": "bg-purple-500 text-white",
      "purple:": "bg-purple-500 text-white",
      "violet:": "bg-purple-500 text-white",
      "black": "bg-black text-white",
      "black:": "bg-black text-white",
      "white": "bg-white text-black border border-gray-300",
      "white:": "bg-white text-black border border-gray-300",
      "gray": "bg-gray-500 text-white",
      "grey": "bg-gray-500 text-white",
      "gray:": "bg-gray-500 text-white",
      "grey:": "bg-gray-500 text-white",
      "pink": "bg-pink-400 text-white",
      "pink:": "bg-pink-400 text-white",
    };

    if (typeof option !== 'string' && option.valor) {
      const lowerColor = option.valor.toLowerCase();
      for (const [key, value] of Object.entries(colorMap)) {
        if (lowerColor.startsWith(key)) {
          return value;
        }
      }
    }
    
    if (typeof option === 'string') {
      const lowerOption = option.toLowerCase();
      for (const [key, value] of Object.entries(colorMap)) {
        if (lowerOption.startsWith(key)) {
          return value;
        }
      }
    }

    return null;
  };

  const colorClass = isColorQuestion ? getColorValue(option) : null;
  
  // Get texto from the option
  let optionText = '';
  let optionDescription = '';
  
  if (typeof option === 'string') {
    if (isColorQuestion && colorClass) {
      // Split title and description for color questions
      const parts = option.split(':');
      if (parts.length > 1) {
        optionText = parts[0].trim();
        optionDescription = parts.slice(1).join(':').trim();
      } else {
        optionText = option;
      }
    } else {
      optionText = option;
    }
  } else {
    // QuestionOption
    optionText = option.valor || '';
    optionDescription = option.descripcion || '';
  }

  const getInitials = (text) => {
    if (!text) return '';
    return text.slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center mb-6 px-2 w-[33%] sm:w-auto">
      <button
        type="button"
        onClick={() => onChange(typeof option === 'string' ? option : option.valor || '')}
        className={cn(
          "w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all mb-2 text-lg font-semibold",
          colorClass || (selected 
            ? "bg-primary text-primary-foreground shadow-lg" 
            : "bg-muted hover:bg-muted/80 border border-muted-foreground/20"),
          selected && "ring-4 ring-primary/20 transform scale-105"
        )}
        aria-checked={selected}
        role="radio"
      >
        {!colorClass && getInitials(optionText)}
      </button>
      
      <div className={cn(
        "text-center flex flex-col max-w-[120px]",
        selected && "font-medium"
      )}>
        <span className="text-sm">{optionText}</span>
        {optionDescription && (
          <span className="text-xs text-muted-foreground mt-1">
            {optionDescription}
          </span>
        )}
      </div>
    </div>
  );
};

const ScaleQuestion = ({ 
  item, 
  index, 
  value, 
  minValue, 
  maxValue, 
  minLabel, 
  maxLabel, 
  onChange 
}) => {
  // Valores de 1 a 5 (o los definidos por minValue/maxValue)
  const min = minValue || 1;
  const max = maxValue || 5;
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  
  return (
    <div className="mb-8 pb-4 border-b last:border-b-0">
      {/* Título del ítem */}
      <Label className="text-base font-medium mb-3 block">{item}</Label>
      
      {/* Etiquetas de mínimo y máximo */}
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">{minLabel}</span>
        <span className="text-sm text-muted-foreground">{maxLabel}</span>
      </div>
      
      {/* Botones de valores en lugar de slider - mejor para móvil */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {values.map(val => (
          <Button
            key={val}
            type="button"
            variant={value === val ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-12 text-center font-medium",
              value === val 
                ? "bg-primary text-primary-foreground ring-2 ring-primary/20" 
                : "hover:bg-muted"
            )}
            onClick={() => onChange(index, [val])}
          >
            {val}
          </Button>
        ))}
      </div>
      
      {/* Notas explicativas (opcional) */}
      <div className="flex justify-between mt-1 px-1">
        <span className="text-xs text-muted-foreground">
          {min === 1 && "Muy bajo"}
        </span>
        <span className="text-xs text-muted-foreground">
          {max === 5 && "Muy alto"}
        </span>
      </div>
    </div>
  );
};

const EnhancedRadioOption = ({ 
  option, 
  selected, 
  onChange, 
  index 
}) => {
  // Extraer el texto de la opción
  let optionText = '';
  let optionDescription = '';
  
  if (typeof option === 'string') {
    optionText = option;
  } else {
    // Caso para QuestionOption con valor y descripcion
    optionText = option.valor || '';
    optionDescription = option.descripcion || '';
  }

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => onChange(typeof option === 'string' ? option : option.valor || '')}
        className={cn(
          "w-full text-left p-4 rounded-lg transition-all border flex items-start gap-3",
          selected 
            ? "bg-primary/5 border-primary shadow-sm" 
            : "bg-background border-border hover:bg-muted/30"
        )}
        aria-checked={selected}
        role="radio"
      >
        <div className={cn(
          "w-5 h-5 mt-0.5 rounded-full flex-shrink-0 border flex items-center justify-center",
          selected ? "border-primary bg-primary" : "border-muted-foreground"
        )}>
          {selected && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
        </div>
        
        <div className="flex-1">
          <div className={cn(
            "text-base",
            selected && "font-medium"
          )}>
            {optionText}
          </div>
          {optionDescription && (
            <div className="text-sm text-muted-foreground mt-1">
              {optionDescription}
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

const QuestionCard = ({ 
  question, 
  onAnswer, 
  onNext, 
  currentAnswer,
  isNextDisabled = false,
  onPrevious, 
  showBackButton = true,  // Valores por defecto
  isFirstQuestion = false, // Valores por defecto
  className 
}: QuestionCardProps) => {
  const { t } = useTranslation();
  const [openAnswer, setOpenAnswer] = useState('');
  const [singleChoiceAnswer, setSingleChoiceAnswer] = useState<string | null>(null);
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<string[]>([]);
  const [multipleSelectAnswers, setMultipleSelectAnswers] = useState<string[]>([]);
  const [scaleAnswers, setScaleAnswers] = useState<Record<number, number>>({});
  const [subAnswer, setSubAnswer] = useState('');
  const [isColorQuestion, setIsColorQuestion] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(''); // Store current question ID

  const currentLanguage = t('app.current_language') || 'ES';

  // Handle both naming conventions
  const questionText = currentLanguage === 'ES' && question?.textEs 
  ? question?.textEs 
  : (question?.text);
  const questionType = question?.tipo || question?.type;
  const questionOptions = currentLanguage === 'ES' && question?.optionsEs 
    ? question?.optionsEs 
    : (question?.options);

  const questionItems = question?.items || [];
  const questionItemsEs = question?.itemsEs || question?.items || [];

  const currentItems = currentLanguage === 'ES' ? questionItemsEs : questionItems;

  const questionMaxOptions = question?.maxOpciones || question?.maxOptions;
  const questionSubQuestion = question?.subPregunta || question?.subQuestion;
  const questionMinValue = question?.valorMinimo || question?.minValue;
  const questionMaxValue = question?.valorMaximo || question?.maxValue;
  const minLabel = currentLanguage === 'ES' && question?.minLabelEs 
    ? question?.minLabelEs
    : (question?.minLabel);
  const maxLabel = currentLanguage === 'ES' && question?.maxLabelEs 
    ? question?.maxLabelEs
    : (question?.maxLabel);

  // Reset all form state when the question changes
  useEffect(() => {
    // Function to reset all form state
    const resetFormState = () => {
      setOpenAnswer('');
      setSingleChoiceAnswer(null);
      setMultipleChoiceAnswers([]);
      setMultipleSelectAnswers([]);
      setScaleAnswers({});
      setSubAnswer('');
    };
    
    if (question?.id && question.id !== currentQuestionId) {
      // Reset all form fields when question changes
      resetFormState();
      
      // Update current question ID
      setCurrentQuestionId(question.id);
    }
    
    // Also reset on unmount for safety
    return () => {
      resetFormState();
    };
  }, [question?.id]);

  // Only populate form with currentAnswer if question ID matches
  useEffect(() => {
    if (currentAnswer && question?.id === currentQuestionId) {
      console.log('Setting question form state from currentAnswer:', currentAnswer);
      // Determinar qué tipo de respuesta es y establecer el estado correspondiente
      if (typeof currentAnswer === 'string') {
        switch (questionType) {
          case 'abierta':
          case 'open':
            setOpenAnswer(currentAnswer);
            break;
          case 'unica':
          case 'multiple-choice':
            setSingleChoiceAnswer(currentAnswer);
            break;
        }
      } else if (Array.isArray(currentAnswer)) {
        // Para respuestas múltiples
        if (questionType === 'multiple') {
          setMultipleChoiceAnswers(currentAnswer);
        } else if (questionType === 'multiple-select') {
          setMultipleSelectAnswers(currentAnswer);
        } else if (questionType === 'open' || questionType === 'abierta') {
          // Si es una respuesta abierta con subpregunta ([respuesta, subrespuesta])
          if (currentAnswer.length >= 2) {
            setOpenAnswer(currentAnswer[0]);
            setSubAnswer(currentAnswer[1]);
          } else if (currentAnswer.length === 1) {
            setOpenAnswer(currentAnswer[0]);
          }
        }
      } else if (typeof currentAnswer === 'object' && currentAnswer !== null) {
        // Para preguntas tipo escala con múltiples items
        setScaleAnswers(currentAnswer);
      } else if (typeof currentAnswer === 'number') {
        // Para preguntas tipo escala con un solo valor
        setScaleAnswers({ 0: currentAnswer });
      }
    }
  }, [currentAnswer, questionType, question?.id, currentQuestionId]);

  // Detect if its a colour question
  useEffect(() => {
    const colorKeywords = {
      'EN': ['color', 'coloured', 'colorful', 'hue', 'shade', 'tint', 'tone'],
      'ES': ['color', 'colores', 'colorido', 'colorida', 'tonalidad', 'tono']
    };
    
    const keywordsForLanguage = colorKeywords[currentLanguage] || colorKeywords['ES'];

    // Check if question text contains color keywords
    const isColor = questionText && 
      keywordsForLanguage.some(keyword => 
        questionText.toLowerCase().includes(keyword)
      );
    
    setIsColorQuestion(isColor);
  }, [questionText, question, currentLanguage]);

  // Detect language based on which properties are present
  const isSpanish = !!question?.pregunta || !!question?.tipo || currentLanguage === 'ES';
  
  // Check if question has valid content
  if (!question || !questionText || !questionType) {
    return (
      <Card className={cn("w-full max-w-2xl mx-auto question-card", className)}>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-2">{t('test.error_invalid_question')}</p>
          <div className="flex justify-between mt-4">
            {showBackButton && onPrevious && !isFirstQuestion && (
              <Button variant="outline" onClick={onPrevious}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                {t('test.back')}
              </Button>
            )}
            <Button onClick={onNext}>{t('test.skip_to_next')}</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = () => {
    if (!isValid()) {
      toast.error(t('test.please_answer'));
      return;
    }
    
    let value: string | number | string[];
    
    switch (questionType) {
      case 'abierta':
      case 'open':
        value = openAnswer;
        if (questionSubQuestion && subAnswer) {
          value = [openAnswer, subAnswer];
        }
        break;
      case 'unica':
      case 'multiple-choice':
        value = singleChoiceAnswer || '';
        break;
      case 'multiple':
      case 'multiple-select':
        value = questionType === 'multiple' ? multipleChoiceAnswers : multipleSelectAnswers;
        break;
      case 'escala':
      case 'scale':
        if (currentItems && currentItems.length > 0) {
          // Para múltiples ítems, devolvemos un objeto con los valores para cada ítem
          const scaleValues: Record<number, number> = {};
          currentItems.forEach((_, index) => {
            scaleValues[index] = scaleAnswers[index] || 3; // Usar valor por defecto si no está definido
          });
          value = scaleValues as any; // Cast to any to handle type mismatch
        } else {
          // Para un solo ítem, devolvemos el valor directamente
          value = scaleAnswers[0] || 3;
        }
        break;
      default:
        value = '';
    }
    
    onAnswer({ questionId: question.id, value });
    onNext();
  };
  
  const isValid = () => {
    switch (questionType) {
      case 'abierta':
      case 'open':
        return openAnswer.trim().length > 0;
      case 'unica':
      case 'multiple-choice':
        return singleChoiceAnswer !== null;
      case 'multiple':
        return multipleChoiceAnswers.length > 0 && 
              (!questionMaxOptions || multipleChoiceAnswers.length <= questionMaxOptions);
      case 'multiple-select':
        return multipleSelectAnswers.length > 0 && 
              (!questionMaxOptions || multipleSelectAnswers.length <= questionMaxOptions);
      case 'escala':
      case 'scale':
        // Para preguntas de escala, siempre son válidas debido al valor por defecto
        return true;
      default:
        return false;
    }
  };

  const handleMultipleChoiceChange = (option: string, checked: boolean) => {
    if (checked) {
      // Check if we're at the max options limit
      if (questionMaxOptions && multipleChoiceAnswers.length >= questionMaxOptions) {
        toast.error(t('test.max_options_error').replace('{{maxOptions}}', String(questionMaxOptions)));
        return;
      }
      setMultipleChoiceAnswers([...multipleChoiceAnswers, option]);
    } else {
      setMultipleChoiceAnswers(multipleChoiceAnswers.filter(item => item !== option));
    }
  };

  const handleMultipleSelectChange = (option: string) => {
    if (multipleSelectAnswers.includes(option)) {
      setMultipleSelectAnswers(multipleSelectAnswers.filter(item => item !== option));
    } else {
      if (questionMaxOptions && multipleSelectAnswers.length >= questionMaxOptions) {
        toast.error(t('test.max_options_error').replace('{{maxOptions}}', String(questionMaxOptions)));
        return;
      }
      setMultipleSelectAnswers([...multipleSelectAnswers, option]);
    }
  };

  const handleScaleChange = (index: number, value: number[]) => {
    setScaleAnswers({
      ...scaleAnswers,
      [index]: value[0]
    });
  };
  
  const renderQuestionInput = () => {
    // Ensure we're only rendering for a valid question with matching ID
    if (!question || !question.id || question.id !== currentQuestionId) {
      return <div className="py-4 text-center text-muted-foreground">{t('test.loading_question')}</div>;
    }
    
    switch (questionType) {
      case 'abierta':
      case 'open':
        return (
          <div className="space-y-4">
            <Textarea 
              placeholder={t('test.write_answer_here')}
              value={openAnswer}
              onChange={(e) => setOpenAnswer(e.target.value)}
              className="min-h-[120px]"
            />
            
            {questionSubQuestion && (
              <div className="mt-4">
                <Label className="text-base mb-2 block">{questionSubQuestion}</Label>
                <Textarea 
                  placeholder={t('test.write_subquestion_answer')}
                  value={subAnswer}
                  onChange={(e) => setSubAnswer(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            )}
          </div>
        );
      
      case 'unica':
      case 'multiple-choice':
        if (isColorQuestion || (questionOptions && questionOptions.length <= 6)) {
          return (
            <div className="pt-4">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {questionOptions?.map((option, index) => (
                  <CircularChoiceOption
                    key={index}
                    option={option}
                    selected={
                      singleChoiceAnswer === option || 
                      (typeof option !== 'string' && option.valor && singleChoiceAnswer === option.valor)
                    }
                    onChange={setSingleChoiceAnswer}
                    index={index}
                    isColorQuestion={isColorQuestion}
                    language={currentLanguage}
                  />
                ))}
              </div>
            </div>
          );
        } else {
          
          return (
            <div className="pt-2">
              <div className="space-y-1">
                {questionOptions?.map((option, index) => (
                  <EnhancedRadioOption
                    key={index}
                    option={option}
                    selected={
                      singleChoiceAnswer === option || 
                      (typeof option !== 'string' && option.valor && singleChoiceAnswer === option.valor)
                    }
                    onChange={setSingleChoiceAnswer}
                    index={index}
                  />
                ))}
              </div>
            </div>
          );
        }
      
      case 'multiple':
        return (
          <div className="space-y-3">
            {questionMaxOptions && (
              <p className="text-muted-foreground text-sm mb-2">
                {t('test.select_up_to').replace('{{maxOptions}}', String(questionMaxOptions))}
              </p>
            )}
            {questionOptions?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`option-multi-${index}`} 
                  checked={multipleChoiceAnswers.includes(option as string)}
                  onCheckedChange={(checked) => 
                    handleMultipleChoiceChange(option as string, checked === true)
                  }
                />
                <Label htmlFor={`option-multi-${index}`} className="text-base font-normal">
                  {option as string}
                </Label>
              </div>
            ))}
          </div>
        );
      
      case 'multiple-select':
        return (
          <div className="space-y-4">
            {questionMaxOptions && (
              <p className="text-muted-foreground text-sm mb-2">
                {t('test.select_up_to').replace('{{maxOptions}}', String(questionMaxOptions))}
              </p>
            )}
            <div className="p-2 border rounded-md bg-background">
              <div className="space-y-2">
                {questionOptions?.map((option, index) => {
                  const isSelected = multipleSelectAnswers.includes(option as string);
                  return (
                    <button
                      key={index}
                      type="button"
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md transition-colors",
                        isSelected 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-muted/40 hover:bg-muted"
                      )}
                      onClick={() => handleMultipleSelectChange(option as string)}
                    >
                      {option as string}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      
      case 'escala':
      case 'scale':
        return (
          <div className="space-y-2 pt-2">
            {currentItems && currentItems.length > 0 ? (
              // Multiple scale questions - Versión mejorada para móvil
              <div>
                {currentItems.map((item, index) => (
                  <ScaleQuestion
                    key={index}
                    item={item}
                    index={index}
                    value={scaleAnswers[index] || 3}
                    minValue={questionMinValue}
                    maxValue={questionMaxValue}
                    minLabel={minLabel}
                    maxLabel={maxLabel}
                    onChange={handleScaleChange}
                  />
                ))}
              </div>
            ) : (
              // Single scale question - Versión mejorada para móvil
              <ScaleQuestion
                item=""
                index={0}
                value={scaleAnswers[0] || 3}
                minValue={questionMinValue}
                maxValue={questionMaxValue}
                minLabel={minLabel}
                maxLabel={maxLabel}
                onChange={handleScaleChange}
              />
            )}
          </div>
        );
      
      default:
        return (
          <div className="p-4 border rounded-md bg-muted">
            <p>{t('test.unsupported_question_type').replace('{{type}}', questionType)}</p>
          </div>
        );
    }
  };

  return (
    <Card className={cn("w-full mx-auto question-card shadow-lg", className)}>
      <CardHeader>
        <CardTitle className="text-xl">{questionText}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {renderQuestionInput()}
      </CardContent>
      <CardFooter className="flex justify-between pt-6 pb-6">
        {/* Botón de Volver */}
        {showBackButton && onPrevious && !isFirstQuestion && (
          <Button 
            variant="outline" 
            onClick={onPrevious}
            className="flex items-center"
            size="lg"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            {t('test.back')}
          </Button>
        )}
        
        {/* Div para alinear a la derecha cuando no hay botón de Volver */}
        {(!showBackButton || !onPrevious || isFirstQuestion) && (
          <div></div>
        )}
        
        {/* Botón de Continuar */}
        <Button 
          onClick={handleSubmit}
          className="sm:w-auto"
          size="lg"
          disabled={isNextDisabled || !isValid()}
        >
          {t('test.continue')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;