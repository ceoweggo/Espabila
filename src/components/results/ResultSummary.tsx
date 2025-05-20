import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestResult } from "@/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/lib/TranslationProvider";

// Mapeo de celebridades a sus nombres completos e información
const celebrityInfo: Record<string, { 
  fullName: string, 
  fullNameEs: string, 
  description: string, 
  descriptionEs: string,
  imageUrl: string 
}> = {
  "gandhi": {
    fullName: "Mahatma Gandhi",
    fullNameEs: "Mahatma Gandhi",
    description: "Indian lawyer, anti-colonial nationalist, and political leader who employed nonviolent resistance.",
    descriptionEs: "Abogado indio, nacionalista anticolonial y líder político que empleó la resistencia no violenta.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/440px-Mahatma-Gandhi%2C_studio%2C_1931.jpg"
  },
  "curie": {
    fullName: "Marie Curie",
    fullNameEs: "Marie Curie",
    description: "Polish-French physicist and chemist who conducted pioneering research on radioactivity.",
    descriptionEs: "Física y química polaco-francesa que realizó investigaciones pioneras sobre la radiactividad.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c1920.jpg/440px-Marie_Curie_c1920.jpg"
  },
  "einstein": {
    fullName: "Albert Einstein",
    fullNameEs: "Albert Einstein",
    description: "German-born theoretical physicist, widely acknowledged to be one of the greatest and most influential physicists of all time.",
    descriptionEs: "Físico teórico nacido en Alemania, ampliamente reconocido como uno de los físicos más grandes e influyentes de todos los tiempos.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/440px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg"
  },
  "jobs": {
    fullName: "Steve Jobs",
    fullNameEs: "Steve Jobs",
    description: "American entrepreneur, industrial designer, business magnate, and media proprietor. Co-founder of Apple Inc.",
    descriptionEs: "Emprendedor, diseñador industrial, magnate empresarial y propietario de medios estadounidense. Cofundador de Apple Inc.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/440px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg"
  },
  "mandela": {
    fullName: "Nelson Mandela",
    fullNameEs: "Nelson Mandela",
    description: "South African anti-apartheid activist and politician who served as the first president of South Africa from 1994 to 1999.",
    descriptionEs: "Activista y político sudafricano contra el apartheid que sirvió como el primer presidente de Sudáfrica de 1994 a 1999.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/440px-Nelson_Mandela_1994.jpg"
  }
};

// Mapeo de habilidades a sus traducciones
const skillsTranslations: Record<string, { en: string, es: string }> = {
  "emotional_intelligence": { 
    en: "Emotional Intelligence", 
    es: "Inteligencia Emocional" 
  },
  "leadership": { 
    en: "Leadership", 
    es: "Liderazgo" 
  },
  "communication": { 
    en: "Communication", 
    es: "Comunicación" 
  },
  "critical_thinking": { 
    en: "Critical Thinking", 
    es: "Pensamiento Crítico" 
  },
  "creative_problem_solving": { 
    en: "Creative Problem Solving", 
    es: "Resolución Creativa de Problemas" 
  }
};

// Mapeo de intereses a sus traducciones
const interestsTranslations: Record<string, { en: string, es: string }> = {
  "social_impact": { 
    en: "Social Impact", 
    es: "Impacto Social" 
  },
  "health_wellness": { 
    en: "Health & Wellness", 
    es: "Salud y Bienestar" 
  },
  "business_entrepreneurship": { 
    en: "Business & Entrepreneurship", 
    es: "Negocios y Emprendimiento" 
  },
  "arts_culture": { 
    en: "Arts & Culture", 
    es: "Artes y Cultura" 
  },
  "science_tech": { 
    en: "Science & Technology", 
    es: "Ciencia y Tecnología" 
  }
};

// Mapeo de profesiones a sus traducciones
const professionsTranslations: Record<string, { en: string, es: string }> = {
  "psychologist": { 
    en: "Psychologist", 
    es: "Psicólogo/a" 
  },
  "data_scientist": { 
    en: "Data Scientist", 
    es: "Científico/a de Datos" 
  },
  "graphic_designer": { 
    en: "Graphic Designer", 
    es: "Diseñador/a Gráfico/a" 
  }
};

// Mapeo de actividades a sus traducciones
const activitiesTranslations: Record<string, { en: string, es: string }> = {
  "volunteer_work": { 
    en: "Volunteer Work", 
    es: "Trabajo Voluntario" 
  },
  "creative_writing": { 
    en: "Creative Writing", 
    es: "Escritura Creativa" 
  },
  "data_analysis": { 
    en: "Data Analysis", 
    es: "Análisis de Datos" 
  }
};

// Type definition for profession/activity objects from the API
interface TranslatedItem {
  id: string;
  name: string;
  name_es: string;
}

type ResultSummaryProps = {
  result: TestResult;
  onDownloadReport?: () => void;
  onEmailReport?: () => void;
}

const ResultSummary = ({ result, onDownloadReport, onEmailReport }: ResultSummaryProps) => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  // Función para traducir habilidades
  const translateSkill = (skill: string) => {
    return skillsTranslations[skill] 
      ? (language === 'es' ? skillsTranslations[skill].es : skillsTranslations[skill].en)
      : skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Función para traducir intereses
  const translateInterest = (interest: string) => {
    return interestsTranslations[interest]
      ? (language === 'es' ? interestsTranslations[interest].es : interestsTranslations[interest].en)
      : interest.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Función para traducir profesiones
  const translateProfession = (profession: string) => {
    return professionsTranslations[profession]
      ? (language === 'es' ? professionsTranslations[profession].es : professionsTranslations[profession].en)
      : profession.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Función para traducir actividades
  const translateActivity = (activity: string | { id: string; name: string; name_es: string; }) => {
    if (typeof activity === 'object') {
      return language === 'es' ? activity.name_es : activity.name;
    }
    
    return activitiesTranslations[activity]
      ? (language === 'es' ? activitiesTranslations[activity].es : activitiesTranslations[activity].en)
      : activity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Función para obtener información de celebridad
  const getCelebrityInfo = (personId: string) => {
    return celebrityInfo[personId] || {
      fullName: personId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      fullNameEs: personId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: "",
      descriptionEs: "",
      imageUrl: "https://via.placeholder.com/150"
    };
  };

  // Función para deduplicar intereses y pasiones
  const getUniqueInterests = (interests: string[]) => {
    return [...new Set(interests)].map(interest => translateInterest(interest));
  };

  return (
    <div className="max-w-8xl mx-auto space-y-8">
      <header className="text-center space-y-2 pb-6">
        <h2 className="text-2xl font-bold text-primary dark:text-white">{result.mbtiType}</h2>
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
                  {translateSkill(skill)}
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
              {getUniqueInterests(result.interests).map((interest, index) => (
                <li key={index} className="flex items-center gap-2 dark:text-gray-300">
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
              {result.similiarPersonalities.map((person) => {
                const info = getCelebrityInfo(person);
                return (
                  <div key={person} className="text-center p-4 bg-accent/10 dark:bg-accent/20 rounded-lg">
                    <div className="w-16 h-16 rounded-full bg-accent/20 dark:bg-accent/30 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                      {info.imageUrl && (
                        <img 
                          src={info.imageUrl} 
                          alt={language === 'es' ? info.fullNameEs : info.fullName} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(`Failed to load image for ${person}:`, info.imageUrl);
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=' + 
                              encodeURIComponent(language === 'es' ? info.fullNameEs : info.fullName);
                          }}
                        />
                      )}
                    </div>
                    <p className="font-medium text-primary dark:text-white">
                      {language === 'es' ? info.fullNameEs : info.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1 line-clamp-2">
                      {language === 'es' ? info.descriptionEs : info.description}
                    </p>
                  </div>
                );
              })}
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
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-primary dark:text-white">
                {t('results.recommended_professions')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {result.recommendedProfessions.map((profession, index) => {
                  const professionName = typeof profession === 'string' 
                    ? translateProfession(profession)
                    : language === 'es' ? profession.name_es : profession.name;
                  
                  return (
                    <div 
                      key={`profession-${index}`} 
                      className="p-3 bg-muted/30 dark:bg-gray-800 rounded-md text-center"
                    >
                      <p className="font-medium dark:text-gray-300">{professionName}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Activities */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary dark:text-white">
            {t('results.recommended_activities')}
          </h3>
          <ul className="space-y-2">
            {result.recommendedActivities.map((activity, index) => (
              <li key={`activity-${index}`} className="flex items-center gap-2 dark:text-gray-300">
                <span className="h-2 w-2 rounded-full bg-secondary"></span>
                {translateActivity(activity)}
              </li>
            ))}
          </ul>
        </div>

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
                {result.recommendedActivities.map((activity, index) => (
                  <li key={`advice-activity-${index}`} className="flex items-center gap-2 dark:text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-secondary"></span>
                    {translateActivity(activity)}
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
                  {!t('results.mission_analysis') && "What the world needs - How your skills and interests can help others and make a positive impact in society. This represents your contribution to the greater good."}
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
