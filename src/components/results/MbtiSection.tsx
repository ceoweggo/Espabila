import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TestResult } from "@/types";
import { useTranslation } from "@/lib/TranslationProvider";
import { personalityTypes } from "@/data/mockProfiles";

type MbtiSectionProps = {
  result: TestResult;
}

const MbtiSection: React.FC<MbtiSectionProps> = ({ result }) => {
  const { t } = useTranslation();
  
  if (!result.mbtiType) {
    return null;
  }
  
  const mbtiInfo = result.mbtiType ? personalityTypes[result.mbtiType] : null;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-border/60 pb-6">
        <CardTitle className="text-primary">
          {t('results.mbti_personality')}
        </CardTitle>
        <CardDescription>
          {t('results.mbti_subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-accent/10 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-primary">
              {t(`mbti.${result.mbtiType.toLowerCase()}`)}
            </h3>
            <div className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full mb-4">
              {result.mbtiGroup ? t(`mbti.${result.mbtiGroup.toLowerCase()}`) : ''}
            </div>
            <p className="text-sm">
              {t(`mbti.${result.mbtiType.toLowerCase()}.description`)}
            </p>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-primary">
              {t('profiles.'+result.profileType.toLowerCase().replace(/\s+/g, '_'))}
            </h3>
            <p className="text-sm mb-4">
              {t('results.mbti_description')} {t(`mbti.${result.mbtiType.toLowerCase()}`)}.
            </p>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">{t('results.mbti_characteristics')}</h4>
              <ul className="grid grid-cols-2 gap-2 text-xs">
                {mbtiInfo && mbtiInfo.traits && mbtiInfo.traits.map((trait, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    {trait}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-primary">{t('results.mbti_alignment')}</h3>
            <p className="text-sm">
              {t('results.mbti_alignment_description')}
            </p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <span className="block text-lg font-bold">
                  {result.mbtiType ? result.mbtiType.charAt(0) : '?'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {result.mbtiType?.charAt(0) === 'E' ? t('mbti.extraversion') : t('mbti.introversion')}
                </span>
              </div>
              <div>
                <span className="block text-lg font-bold">
                  {result.mbtiType ? result.mbtiType.charAt(1) : '?'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {result.mbtiType?.charAt(1) === 'S' ? t('mbti.sensing') : t('mbti.intuition')}
                </span>
              </div>
              <div>
                <span className="block text-lg font-bold">
                  {result.mbtiType ? result.mbtiType.charAt(2) : '?'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {result.mbtiType?.charAt(2) === 'T' ? t('mbti.thinking') : t('mbti.feeling')}
                </span>
              </div>
              <div>
                <span className="block text-lg font-bold">
                  {result.mbtiType ? result.mbtiType.charAt(3) : '?'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {result.mbtiType?.charAt(3) === 'J' ? t('mbti.judging') : t('mbti.perceiving')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MbtiSection; 