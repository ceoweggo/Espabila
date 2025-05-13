import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionBlock } from "@/types";
import { useTranslation } from "@/lib/TranslationProvider";

type BlockIntroProps = {
  block: QuestionBlock;
  blockNumber: number;
  totalBlocks: number;
  onStart: () => void;
}

const BlockIntro = ({ block, blockNumber, totalBlocks, onStart }: BlockIntroProps) => {
  const { t } = useTranslation();
  
  // Handle both naming conventions
  const title = block.titulo || block.title;
  const questionCount = block.preguntas?.length || block.questions?.length || 0;
  
  // Determine language based on which properties are present
  const isSpanish = !!block.titulo || !!block.preguntas;

  return (
    <Card className="w-full max-w-2xl mx-auto animate-scale-in">
      <CardHeader className="text-center">
        <CardDescription className="text-lg mb-2">
          {t('test.block_x_of_y').replace('{{blockNumber}}', String(blockNumber)).replace('{{totalBlocks}}', String(totalBlocks))}
        </CardDescription>
        <CardTitle className="text-3xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {block.description && (
          <p className="text-muted-foreground mb-6">{block.description}</p>
        )}
        <p className="font-medium">
          {t('test.section_contains_questions').replace('{{count}}', String(questionCount))}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button size="lg" onClick={onStart}>
          {t('test.start_section')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlockIntro;
