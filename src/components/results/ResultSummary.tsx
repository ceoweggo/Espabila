import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestResult } from "@/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/lib/TranslationProvider";

type ResultSummaryProps = {
  result: TestResult;
  onDownloadReport?: () => void;
  onEmailReport?: () => void;
}

const ResultSummary = ({ result, onDownloadReport, onEmailReport }: ResultSummaryProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="max-w-8xl mx-auto space-y-8">
      <header className="text-center space-y-2 pb-6">
        <h2 className="text-2xl font-bold text-primary dark:text-white">{result.profileType}</h2>
        <p className="text-muted-foreground dark:text-gray-400 max-w-xl mx-auto">
          {t('results.analysis_description')}
        </p>
      </header>

      {/* Enhanced Ikigai Diagram */}
      <div className="relative w-full max-w-lg mx-auto h-80 md:h-96 mb-12">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5/6 h-5/6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary/20 dark:bg-primary/30 rounded-full text-sm dark:text-white">
              {t('ikigai.passion')}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4/6 h-4/6 bg-secondary/10 dark:bg-secondary/20 rounded-full flex items-center justify-center">
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-3 py-1 bg-secondary/20 dark:bg-secondary/30 rounded-full text-sm dark:text-white">
                {t('ikigai.mission')}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/6 h-3/6 bg-accent/20 rounded-full flex items-center justify-center">
              <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-accent/20 dark:bg-accent/30 rounded-full text-sm dark:text-white">
                {t('ikigai.profession')}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2/6 h-2/6 bg-background dark:bg-gray-800 border border-border dark:border-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold dark:text-white">Ikigai</span>
            </div>
            <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-muted/80 dark:bg-gray-700 rounded-full text-sm dark:text-white">
              {t('ikigai.vocation')}
            </span>
          </div>
          
          {/* Connection Labels */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-md text-xs dark:text-gray-300">
            {t('ikigai.delight')}
          </div>
          <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded-md text-xs dark:text-gray-300">
            {t('ikigai.excitement')}
          </div>
          <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-md text-xs dark:text-gray-300">
            {t('ikigai.comfort')}
          </div>
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded-md text-xs dark:text-gray-300">
            {t('ikigai.satisfaction')}
          </div>
        </div>
      </div>

      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Section (Vocation) */}
        <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="border-b border-border/60 pb-6 dark:border-gray-700">
            <CardTitle className="text-primary dark:text-white">{t('results.skills_title')}</CardTitle>
            <CardDescription className="dark:text-gray-400">{t('results.skills_description')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {result.skills.map((skill) => (
                <li key={skill} className="flex items-center gap-2 dark:text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-accent"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Interests Section (Passion) */}
        <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="border-b border-border/60 pb-6 dark:border-gray-700">
            <CardTitle className="text-primary dark:text-white">{t('results.passions_title')}</CardTitle>
            <CardDescription className="dark:text-gray-400">{t('results.passions_description')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {result.interests.map((interest) => (
                <li key={interest} className="flex items-center gap-2 dark:text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-secondary"></span>
                  {interest}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Similar Personalities */}
        <Card className="md:col-span-2 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="border-b border-border/60 pb-6 dark:border-gray-700">
            <CardTitle className="text-primary dark:text-white">{t('results.similar_figures_title')}</CardTitle>
            <CardDescription className="dark:text-gray-400">
              {t('results.similar_figures_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {result.similiarPersonalities.map((person) => (
                <div key={person} className="text-center p-4 bg-accent/10 dark:bg-accent/20 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-accent/20 dark:bg-accent/30 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary dark:text-white">{person.charAt(0)}</span>
                  </div>
                  <p className="font-medium text-primary dark:text-white">{person}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Professions */}
        <Card className="md:col-span-2 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="border-b border-border/60 pb-6 dark:border-gray-700">
            <CardTitle className="text-primary dark:text-white">{t('results.professions_title')}</CardTitle>
            <CardDescription className="dark:text-gray-400">
              {t('results.professions_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {result.recommendedProfessions.map((profession) => (
                <div key={profession} className="bg-accent/10 dark:bg-accent/20 p-3 rounded-lg text-center">
                  <p className="font-medium text-primary dark:text-white">{profession}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personal Advice */}
        <Card className="md:col-span-2 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="border-b border-border/60 pb-6 dark:border-gray-700">
            <CardTitle className="text-primary dark:text-white">{t('results.journey_title')}</CardTitle>
            <CardDescription className="dark:text-gray-400">{t('results.journey_description')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-primary dark:text-white">{t('results.needs_title')}</h3>
              <p className="text-muted-foreground dark:text-gray-300">{result.advice}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-primary dark:text-white">{t('results.activities_title')}</h3>
              <ul className="space-y-2">
                {result.recommendedActivities.map((activity) => (
                  <li key={activity} className="flex items-center gap-2 dark:text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-secondary"></span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Ikigai Analysis - New section */}
        <Card className="md:col-span-2 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="border-b border-border/60 pb-6 dark:border-gray-700">
            <CardTitle className="text-primary dark:text-white">{t('results.analysis_title')}</CardTitle>
            <CardDescription className="dark:text-gray-400">{t('results.analysis_subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-primary dark:text-white">{t('ikigai.passion')}</h3>
                <p className="text-sm dark:text-gray-300">
                  {t('results.passion_analysis')}
                </p>
              </div>
              
              <div className="bg-accent/10 dark:bg-accent/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-primary dark:text-white">{t('ikigai.vocation')}</h3>
                <p className="text-sm dark:text-gray-300">
                  {t('results.vocation_analysis')}
                </p>
              </div>
              
              <div className="bg-secondary/10 dark:bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-primary dark:text-white">{t('ikigai.mission')}</h3>
                <p className="text-sm dark:text-gray-300">
                  {t('results.mission_analysis')}
                </p>
              </div>
              
              <div className="bg-accent/10 dark:bg-accent/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-primary dark:text-white">{t('ikigai.profession')}</h3>
                <p className="text-sm dark:text-gray-300">
                  {t('results.profession_analysis')}
                </p>
              </div>
            </div>
            
            <div className="bg-muted dark:bg-gray-700 p-4 rounded-lg mt-4">
              <h3 className="font-medium mb-2 text-primary dark:text-white">{t('results.balance_title')}</h3>
              <p className="text-sm dark:text-gray-300">
                {t('results.balance_description')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      {(onDownloadReport || onEmailReport) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {onDownloadReport && (
            <Button variant="globodain" onClick={onDownloadReport}>
              {t('results.download_report')}
            </Button>
          )}
          {onEmailReport && (
            <Button variant="globodainOutline" onClick={onEmailReport} className="border-accent dark:border-accent dark:text-white">
              {t('results.email_report')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultSummary;
