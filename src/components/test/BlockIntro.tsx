import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionBlock } from "@/types";
import { useTranslation } from "@/lib/TranslationProvider";
import { useEffect } from "react";

type BlockIntroProps = {
  block?: QuestionBlock;
  blockNumber: number;
  totalBlocks: number;
  onStart: () => void;
  autoStart?: boolean; // Añadir esta prop
}

const BlockIntro = ({ 
  block, 
  blockNumber, 
  totalBlocks, 
  onStart,
  autoStart = false
}: BlockIntroProps) => {
  const { t } = useTranslation();
  
  // If block is undefined, handle it gracefully
  if (!block) {
    return (
      <Card className="w-full max-w-2xl mx-auto animate-scale-in">
        <CardHeader className="text-center">
          <CardDescription className="text-lg mb-2">
            {t('test.block_x_of_y').replace('{{blockNumber}}', String(blockNumber)).replace('{{totalBlocks}}', String(totalBlocks))}
          </CardDescription>
          <CardTitle className="text-3xl">
            {t('test.loading')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            {t('test.loading_description')}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button size="lg" onClick={onStart}>
            {t('test.continue')}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Handle both naming conventions
  const questionCount = block.preguntas?.length || block.questions?.length || 0;
  
  // Determine language based on which properties are present
  const isSpanish = !!block.titulo || !!block.preguntas;

  // Efecto para auto-iniciar al cargar si autoStart es true
  useEffect(() => {
    if (autoStart) {
      // Pequeño delay para permitir que la UI se actualice
      const timer = setTimeout(() => {
        onStart();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [autoStart, onStart]);

  return (
    <Card className="w-full max-w-2xl mx-auto animate-scale-in">
      <CardHeader className="text-center">
        <CardDescription className="text-lg mb-2">
          {t('test.block_x_of_y').replace('{{blockNumber}}', String(blockNumber)).replace('{{totalBlocks}}', String(totalBlocks))}
        </CardDescription>
        <CardTitle className="text-3xl">
          {block.title && (
            t('app.current_language') === 'ES' && block.titleEs 
              ? block.titleEs 
              : block.title
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {block.description && (
          <p className="text-muted-foreground mb-6">
            {t('app.current_language') === 'ES' && block.descriptionEs
              ? block.descriptionEs
              : block.description}
          </p>
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
