import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Question, Answer, QuestionOption } from "@/types";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/TranslationProvider';

type QuestionCardProps = {
  question: Question;
  onAnswer: (answer: Answer) => void;
  onNext: () => void;
  className?: string;
}

const QuestionCard = ({ question, onAnswer, onNext, className }: QuestionCardProps) => {
  const { t } = useTranslation();
  const [openAnswer, setOpenAnswer] = useState('');
  const [singleChoiceAnswer, setSingleChoiceAnswer] = useState<string | null>(null);
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<string[]>([]);
  const [scaleAnswers, setScaleAnswers] = useState<Record<number, number>>({});
  const [subAnswer, setSubAnswer] = useState('');

  // Handle both naming conventions
  const questionText = question?.pregunta || question?.text;
  const questionType = question?.tipo || question?.type;
  const questionOptions = question?.opciones || question?.options;
  const questionItems = question?.items;
  const questionMaxOptions = question?.maxOpciones || question?.maxOptions;
  const questionSubQuestion = question?.subPregunta || question?.subQuestion;
  const questionMinValue = question?.valorMinimo || question?.minValue;
  const questionMaxValue = question?.valorMaximo || question?.maxValue;
  const minLabel = question?.minLabel;
  const maxLabel = question?.maxLabel;

  // Detect language based on which properties are present
  const isSpanish = !!question?.pregunta || !!question?.tipo;

  // Check if question has valid content
  if (!question || !questionText || !questionType) {
    return (
      <Card className={cn("w-full max-w-2xl mx-auto question-card", className)}>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-2">{t('test.error_invalid_question')}</p>
          <Button onClick={onNext}>{t('test.skip_to_next')}</Button>
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
        value = multipleChoiceAnswers;
        break;
      case 'escala':
      case 'scale':
        if (questionItems && questionItems.length > 0) {
          value = Object.values(scaleAnswers).map(val => String(val));
        } else {
          value = String(scaleAnswers[0] || 3);
        }
        break;
      default:
        value = '';
    }
    
    onAnswer({ questionId: question.id, value });
    onNext();
    
    // Reset form for next question
    setOpenAnswer('');
    setSingleChoiceAnswer(null);
    setMultipleChoiceAnswers([]);
    setScaleAnswers({});
    setSubAnswer('');
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
      case 'escala':
      case 'scale':
        if (questionItems && questionItems.length > 0) {
          return Object.keys(scaleAnswers).length === questionItems.length;
        }
        return Object.keys(scaleAnswers).length > 0;
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

  const handleScaleChange = (index: number, value: number[]) => {
    setScaleAnswers({
      ...scaleAnswers,
      [index]: value[0]
    });
  };
  
  const renderQuestionInput = () => {
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
        return (
          <RadioGroup 
            value={singleChoiceAnswer || ''} 
            onValueChange={setSingleChoiceAnswer}
            className="space-y-3"
          >
            {questionOptions?.map((option, index) => {
              if (typeof option === 'string') {
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-base font-normal">
                      {option}
                    </Label>
                  </div>
                );
              } else {
                // It's a QuestionOption with valor and descripcion
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.valor || ''} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-base font-normal">
                      {option.valor} {option.descripcion && `- ${option.descripcion}`}
                    </Label>
                  </div>
                );
              }
            })}
          </RadioGroup>
        );
      
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
      
      case 'escala':
      case 'scale':
        return (
          <div className="space-y-6">
            {questionItems && questionItems.length > 0 ? (
              // Multiple scale questions
              <div className="space-y-8">
                {questionItems.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <Label className="text-base mb-2 block">{item}</Label>
                    <div className="flex items-center gap-2">
                      {minLabel && <span className="text-sm text-muted-foreground">{minLabel}</span>}
                      <Slider
                        defaultValue={[3]}
                        min={questionMinValue || 1}
                        max={questionMaxValue || 5}
                        step={1}
                        value={[scaleAnswers[index] || 3]}
                        onValueChange={(value) => handleScaleChange(index, value)}
                        className="flex-1"
                      />
                      {maxLabel && <span className="text-sm text-muted-foreground">{maxLabel}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Single scale question
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {minLabel && <span className="text-sm text-muted-foreground">{minLabel}</span>}
                  <Slider
                    defaultValue={[3]}
                    min={questionMinValue || 1}
                    max={questionMaxValue || 5}
                    step={1}
                    value={[scaleAnswers[0] || 3]}
                    onValueChange={(value) => handleScaleChange(0, value)}
                    className="flex-1"
                  />
                  {maxLabel && <span className="text-sm text-muted-foreground">{maxLabel}</span>}
                </div>
                <div className="flex justify-between px-2">
                  {Array.from({length: (questionMaxValue || 5) - (questionMinValue || 1) + 1}).map((_, i) => (
                    <span key={i} className="text-xs text-muted-foreground">
                      {(questionMinValue || 1) + i}
                    </span>
                  ))}
                </div>
              </div>
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
    <Card className={cn("w-full max-w-8xl mx-auto question-card", className)}>
      <CardHeader>
        <CardTitle className="text-xl">{questionText}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {renderQuestionInput()}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit}>
          {t('test.continue')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
