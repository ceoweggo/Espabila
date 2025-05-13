import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/lib/TranslationProvider";

type TestProgressProps = {
  currentQuestion: number;
  totalQuestions: number;
  currentBlock: number;
  totalBlocks: number;
}

const TestProgress = ({ 
  currentQuestion, 
  totalQuestions, 
  currentBlock, 
  totalBlocks
}: TestProgressProps) => {
  const { t } = useTranslation();
  
  // Ensure we have valid numbers to avoid division by zero
  const safeCurrentQuestion = Math.max(1, currentQuestion);
  const safeTotalQuestions = Math.max(1, totalQuestions);
  
  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.round((safeCurrentQuestion / safeTotalQuestions) * 100));
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span>
          {t('test.question_progress').replace('{{current}}', String(safeCurrentQuestion)).replace('{{total}}', String(safeTotalQuestions))}
        </span>
        <span>
          {t('test.block_progress').replace('{{current}}', String(currentBlock)).replace('{{total}}', String(totalBlocks))}
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
      <div className="flex justify-end mt-1">
        <span className="text-sm text-muted-foreground">{progressPercent}%</span>
      </div>
    </div>
  );
};

export default TestProgress;
