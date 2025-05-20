import React from 'react';
import { 
  UserCircle,
  BarChart,
  Brain,
  Heart,
  BookOpen
} from 'lucide-react';

// Define tipos específicos para los datos
interface IkigaiScores {
  passion: number;
  mission: number;
  profession: number;
  vocation: number;
}

interface TraitScores {
  analytical: number;
  creative: number;
  empathetic: number;
  organized: number;
  curious: number;
}

interface MbtiScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

interface ProfileData {
  _id: { $oid: string };
  user_id: { $oid: string };
  mbti_type: string;
  trait_scores: TraitScores;
  mbti_scores: MbtiScores;
  ikigai_scores: IkigaiScores;
  recommended_personalities: string[];
  recommended_activities: string[];
  recommended_professions: string[];
  recommended_skills: string[];
  recommended_interests: string[];
  recommended_advices: string[];
  development_areas: string[];
  created_at: { $date: string };
  updated_at: { $date: string };
}

interface PrintableProfileProps {
  profileData: ProfileData;
  formatDate: (date: string) => string;
}

export function PrintableProfile({ profileData, formatDate }: PrintableProfileProps) {
  // MBTI Type descriptions
  const mbtiDescriptions: Record<string, { title: string; description: string }> = {
    INFP: {
      title: 'El Mediador',
      description: 'Poéticos, amables y altruistas, siempre buscando ayudar a una buena causa.'
    },
    ENFP: {
      title: 'El Activista',
      description: 'Entusiastas, creativos y sociables, que siempre encuentran un motivo para sonreír.'
    },
    INFJ: {
      title: 'El Abogado',
      description: 'Callados y místicos, pero muy inspiradores e incansables idealistas.'
    },
    ENFJ: {
      title: 'El Protagonista',
      description: 'Carismáticos e inspiradores líderes, capaces de cautivar a su audiencia.'
    }
  };

  // Get current MBTI description
  const currentMbtiInfo = mbtiDescriptions[profileData.mbti_type] || {
    title: 'Perfil de Personalidad',
    description: 'Tu perfil de personalidad único basado en el sistema Myers-Briggs.'
  };

  // Helper function to format string segments
  const formatWordCase = (text: string): string => {
    return text.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto my-8 shadow-md">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-2">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <UserCircle className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Informe Psicológico Detallado</h1>
        <p className="text-gray-600 mt-2">
          Análisis completo de personalidad y recomendaciones
        </p>
        <div className="mt-4 text-sm text-gray-600">
          Generado el: {formatDate(profileData.updated_at.$date)}
        </div>
      </div>

      {/* Resumen MBTI */}
      <div className="mb-10 p-6 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <BarChart className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Tipo de personalidad: {profileData.mbti_type} - {currentMbtiInfo.title}
          </h2>
        </div>
        <p className="text-gray-700 mb-4">
          {currentMbtiInfo.description}
        </p>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Características principales</h3>
            <ul className="space-y-1 text-gray-700">
              {profileData.mbti_type.includes('E') ? (
                <li>• Extrovertido: Obtiene energía de la interacción social</li>
              ) : (
                <li>• Introvertido: Prefiere la reflexión y el trabajo individual</li>
              )}
              {profileData.mbti_type.includes('S') ? (
                <li>• Sensorial: Se enfoca en detalles concretos y prácticos</li>
              ) : (
                <li>• Intuitivo: Se orienta hacia patrones y posibilidades futuras</li>
              )}
              {profileData.mbti_type.includes('T') ? (
                <li>• Pensamiento: Toma decisiones basadas en lógica y análisis</li>
              ) : (
                <li>• Sentimiento: Prioriza valores personales y relaciones humanas</li>
              )}
              {profileData.mbti_type.includes('J') ? (
                <li>• Juicio: Prefiere estructura, orden y planificación</li>
              ) : (
                <li>• Percepción: Valora la adaptabilidad y opciones abiertas</li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fortalezas destacadas</h3>
            <ul className="space-y-1 text-gray-700">
              {/* Fortalezas condicionales según tipo MBTI */}
              {profileData.mbti_type.includes('NF') && (
                <>
                  <li>• Alta empatía y comprensión de las necesidades de otros</li>
                  <li>• Creatividad para encontrar soluciones no convencionales</li>
                </>
              )}
              {profileData.mbti_type.includes('NT') && (
                <>
                  <li>• Excelente capacidad analítica y estratégica</li>
                  <li>• Innovación y pensamiento orientado a sistemas</li>
                </>
              )}
              {profileData.mbti_type.includes('SJ') && (
                <>
                  <li>• Gran sentido de responsabilidad y confiabilidad</li>
                  <li>• Excelente organización y atención al detalle</li>
                </>
              )}
              {profileData.mbti_type.includes('SP') && (
                <>
                  <li>• Adaptabilidad y habilidades prácticas excepcionales</li>
                  <li>• Capacidad para resolver problemas en tiempo real</li>
                </>
              )}
              {profileData.mbti_type.includes('INF') && (
                <li>• Profunda conexión con valores e ideales</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Análisis de rasgos */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Análisis de rasgos personales
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(profileData.trait_scores).map(([trait, score], index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-gray-800">
                  {trait.charAt(0).toUpperCase() + trait.slice(1)}
                </h3>
                <span className="font-bold">{score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-sm text-gray-700">
                {trait === 'analytical' && 'Capacidad para examinar información y resolver problemas complejos'}
                {trait === 'creative' && 'Habilidad para generar ideas originales y soluciones innovadoras'}
                {trait === 'empathetic' && 'Capacidad para entender y compartir los sentimientos de los demás'}
                {trait === 'organized' && 'Habilidad para planificar, priorizar y mantener el orden'}
                {trait === 'curious' && 'Deseo de aprender, explorar y descubrir nueva información'}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="font-semibold text-orange-800 mb-2">Áreas de desarrollo recomendadas</h3>
          <ul className="space-y-1">
            {profileData.development_areas.map((area, index) => (
              <li key={index} className="text-orange-700">• {area}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ikigai */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Análisis Ikigai - Propósito vital
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-1">
              Pasión (Lo que amas) - {profileData.ikigai_scores.passion}%
            </h3>
            <p className="text-sm text-red-700">
              {profileData.ikigai_scores.passion < 30
                ? 'Área identificada para desarrollo. Dedica tiempo a explorar actividades que te generen alegría genuina.'
                : 'Tienes claridad sobre las actividades que disfrutas profundamente y generan satisfacción.'}
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-1">
              Misión (Lo que el mundo necesita) - {profileData.ikigai_scores.mission}%
            </h3>
            <p className="text-sm text-blue-700">
              {profileData.ikigai_scores.mission < 30
                ? 'Conecta más tus actividades con necesidades reales de tu comunidad o sociedad.'
                : 'Tienes buen sentido de cómo contribuir positivamente a tu entorno.'}
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-1">
              Profesión (Por lo que te pagan) - {profileData.ikigai_scores.profession}%
            </h3>
            <p className="text-sm text-green-700">
              {profileData.ikigai_scores.profession < 30
                ? 'Explora cómo convertir tus habilidades en oportunidades profesionales.'
                : 'Has identificado bien cómo tus talentos pueden traducirse en actividades remuneradas.'}
            </p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="font-semibold text-amber-800 mb-1">
              Vocación (En lo que eres bueno) - {profileData.ikigai_scores.vocation}%
            </h3>
            <p className="text-sm text-amber-700">
              {profileData.ikigai_scores.vocation < 30
                ? 'Trabaja en identificar y perfeccionar tus fortalezas naturales.'
                : 'Tienes buena comprensión de tus talentos y capacidades destacadas.'}
            </p>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Recomendaciones personalizadas
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Profesiones recomendadas</h3>
            <ul className="space-y-1 text-gray-700">
              {profileData.recommended_professions.map((profession, index) => (
                <li key={index}>• {formatWordCase(profession)}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Habilidades a desarrollar</h3>
            <ul className="space-y-1 text-gray-700">
              {profileData.recommended_skills.map((skill, index) => (
                <li key={index}>• {formatWordCase(skill)}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Actividades recomendadas</h3>
            <ul className="space-y-1 text-gray-700">
              {profileData.recommended_activities.map((activity, index) => (
                <li key={index}>• {formatWordCase(activity)}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Consejos de desarrollo</h3>
            <ul className="space-y-1 text-gray-700">
              {profileData.recommended_advices.map((advice, index) => (
                <li key={index}>• {formatWordCase(advice)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
        <p>Este informe ha sido generado por EspaBila - Plataforma de Evaluación Psicológica</p>
        <p className="mt-1">La información contenida es confidencial y de uso personal.</p>
      </div>
    </div>
  );
} 