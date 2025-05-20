import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UserCircle, 
  BookOpen, 
  Briefcase, 
  Brain, 
  Heart, 
  LightbulbIcon, 
  ActivityIcon
} from 'lucide-react';

interface RecommendationsProps {
  personalities: string[];
  activities: string[];
  professions: string[];
  skills: string[];
  interests: string[];
  advices: string[];
}

export function RecommendationsList({
  personalities,
  activities,
  professions,
  skills,
  interests,
  advices
}: RecommendationsProps) {
  // Mapping for personality icons and descriptions
  const personalityInfo: Record<string, { name: string; description: string }> = {
    'gandhi': { 
      name: 'Mahatma Gandhi', 
      description: 'Líder pacifista y espiritual, defensor de la no violencia y la resistencia civil.' 
    },
    'curie': { 
      name: 'Marie Curie', 
      description: 'Física y química pionera en el campo de la radiactividad, ganadora de dos premios Nobel.' 
    },
    'einstein': { 
      name: 'Albert Einstein', 
      description: 'Físico teórico, desarrollador de la teoría de la relatividad y revolucionario de la física.' 
    },
    'shakespeare': { 
      name: 'William Shakespeare', 
      description: 'Poeta, dramaturgo y actor, considerado el escritor más importante en lengua inglesa.' 
    },
    'tesla': { 
      name: 'Nikola Tesla', 
      description: 'Ingeniero eléctrico e inventor, pionero en el campo de la electricidad.' 
    }
  };

  // Activity descriptions
  const activityInfo: Record<string, string> = {
    'volunteer_work': 'Participar en programas de voluntariado para causas sociales o ambientales',
    'creative_writing': 'Desarrollar habilidades de escritura creativa como cuentos, poesía o ensayos',
    'data_analysis': 'Trabajar con datos para encontrar patrones y obtener información valiosa',
    'public_speaking': 'Practicar presentaciones y discursos para mejorar habilidades comunicativas',
    'meditation': 'Práctica regular de meditación para desarrollar atención plena y reducir estrés'
  };

  // Labels for profession categories
  const professionCategories: Record<string, string> = {
    'psychologist': 'Ciencias sociales',
    'data_scientist': 'Tecnología',
    'graphic_designer': 'Artes visuales',
    'teacher': 'Educación',
    'entrepreneur': 'Emprendimiento',
    'writer': 'Comunicación',
    'researcher': 'Investigación',
    'project_manager': 'Gestión'
  };

  // Descriptions for skills
  const skillDescriptions: Record<string, string> = {
    'emotional_intelligence': 'Capacidad para reconocer y gestionar emociones propias y ajenas',
    'leadership': 'Habilidad para guiar e influir positivamente en equipos',
    'communication': 'Capacidad para expresar ideas de forma clara y efectiva',
    'critical_thinking': 'Análisis objetivo y evaluación de situaciones para formar juicios',
    'creative_problem_solving': 'Enfoques innovadores para superar obstáculos y desafíos'
  };

  // Colors for interests categories
  const interestColors: Record<string, string> = {
    'social_impact': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30',
    'health_wellness': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30',
    'business_entrepreneurship': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30',
    'arts_culture': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30',
    'science_tech': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/30'
  };

  // Advice descriptions
  const adviceDescriptions: Record<string, string> = {
    'emotional_development': 'Cultivar la inteligencia emocional y la autoconciencia para relaciones saludables',
    'creative_development': 'Explorar formas de expresión creativa y pensamiento innovador',
    'leadership_development': 'Desarrollar habilidades de liderazgo e influencia positiva',
    'work_life_balance': 'Mantener equilibrio entre vida profesional y personal para bienestar general',
    'analytical_thinking': 'Fortalecer capacidades de análisis y resolución estructurada de problemas'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personalidades similares */}
      <Card className="shadow-lg border-border/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-blue-500" />
            Personalidades similares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {personalities.map((personality, index) => (
              <div key={index} className="flex items-start p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                  {personality.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-medium">
                    {personalityInfo[personality]?.name || personality}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {personalityInfo[personality]?.description || 'Personalidad con características afines a tu perfil'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actividades recomendadas */}
      <Card className="shadow-lg border-border/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <ActivityIcon className="h-5 w-5 text-green-500" />
            Actividades recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium">
                  {activity.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {activityInfo[activity] || 'Actividad recomendada basada en tu perfil personal'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profesiones recomendadas */}
      <Card className="shadow-lg border-border/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-500" />
            Profesiones recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {professions.map((profession, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <h4 className="text-sm font-medium">
                    {profession.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </h4>
                </div>
                {professionCategories[profession] && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30 dark:hover:bg-purple-900/30">
                    {professionCategories[profession]}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Habilidades recomendadas */}
      <Card className="shadow-lg border-border/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-500" />
            Habilidades recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {skills.map((skill, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium">
                  {skill.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {skillDescriptions[skill] || 'Habilidad recomendada para desarrollar basada en tu perfil'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intereses recomendados */}
      <Card className="shadow-lg border-border/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Intereses recomendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className={`text-sm py-2 px-3 ${interestColors[interest] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}
              >
                {interest.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">¿Por qué son importantes los intereses?</h4>
            <p className="text-xs text-muted-foreground">
              Explorar estos campos de interés puede enriquecer tu vida personal y profesional, 
              alineándose con tus valores y fortalezas naturales. Son áreas que podrían proporcionarte 
              mayor satisfacción y sentido de propósito.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Consejos recomendados */}
      <Card className="shadow-lg border-border/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <LightbulbIcon className="h-5 w-5 text-amber-500" />
            Consejos personalizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {advices.map((advice, index) => (
              <div key={index} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20">
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  {advice.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  {adviceDescriptions[advice] || 'Consejo personalizado basado en tu perfil para desarrollo personal'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 