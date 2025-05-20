import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { useTranslation } from '@/lib/TranslationProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  ClockIcon, 
  BadgeIcon, 
  GlobeIcon, 
  FileTextIcon,
  UserCircle, 
  BarChart, 
  Brain, 
  Heart, 
  BookOpen, 
  Printer
} from 'lucide-react';
import Loading from '@/components/Loading';
import { MbtiChart } from '@/components/profile/MbtiChart';
import { IkigaiChart } from '@/components/profile/IkigaiChart';
import { TraitScoresChart } from '@/components/profile/TraitScores';
import { RecommendationsList } from '@/components/profile/RecommendationsList';
import { RadarChart } from '@/components/ui/radar-chart';
import { PrintableProfile } from '@/components/profile/PrintableProfile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Sample data for development and testing
const sampleProfileData = {
  "_id": {
    "$oid": "682887ea68dd5d86d679e65f"
  },
  "user_id": {
    "$oid": "681a215e8cc026adc3f5e655"
  },
  "mbti_type": "INFP",
  "trait_scores": {
    "analytical": 40,
    "creative": 20,
    "empathetic": 80,
    "organized": 50,
    "curious": 50
  },
  "mbti_scores": {
    "E": 100,
    "I": 100,
    "S": 89,
    "N": 100,
    "T": 100,
    "F": 100,
    "J": 100,
    "P": 100
  },
  "ikigai_scores": {
    "passion": 25,
    "mission": 27,
    "profession": 28,
    "vocation": 29
  },
  "recommended_personalities": [
    "gandhi",
    "curie",
    "einstein"
  ],
  "recommended_activities": [
    "volunteer_work",
    "creative_writing",
    "data_analysis"
  ],
  "recommended_professions": [
    "psychologist",
    "data_scientist",
    "graphic_designer"
  ],
  "recommended_skills": [
    "emotional_intelligence",
    "leadership",
    "communication",
    "critical_thinking",
    "creative_problem_solving"
  ],
  "recommended_interests": [
    "social_impact",
    "health_wellness",
    "business_entrepreneurship",
    "arts_culture",
    "science_tech"
  ],
  "recommended_advices": [
    "emotional_development",
    "creative_development",
    "leadership_development",
    "work_life_balance",
    "analytical_thinking"
  ],
  "development_areas": [
    "Creative",
    "Passion (What You Love)"
  ],
  "created_at": {
    "$date": "2025-05-17T14:58:18.002Z"
  },
  "updated_at": {
    "$date": "2025-05-17T14:58:18.002Z"
  }
};

export default function UserProfilePage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(sampleProfileData);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  // Fetch user profile data
  useEffect(() => {
    // In a real application, this would fetch data from an API
    // For now, we'll just use the sample data
    setLoading(true);
    setTimeout(() => {
      setProfileData(sampleProfileData);
      setLoading(false);
    }, 500);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Prepare data for radar chart
  const radarData = Object.entries(profileData.trait_scores).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
    fullMark: 100
  }));

  // Handle print function
  const handlePrint = () => {
    const printContent = printableRef.current?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Perfil Psicológico - EspaBila</title>
            <style>
              body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
              h1, h2, h3 { color: #2563eb; }
              .page-break { page-break-after: always; }
              @media print {
                body { margin: 0; padding: 20px; }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      
      // Cerrar el diálogo
      setShowPrintDialog(false);
      
      // Esperar a que se cargue el contenido
      printWindow.document.close();
      printWindow.focus();
      
      // Imprimir después de que el contenido se haya cargado
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">Perfil Psicológico</h1>
            <p className="text-muted-foreground dark:text-gray-300">
              Visualización detallada de tus resultados de evaluación y recomendaciones personalizadas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1 py-1.5 px-3">
              <CalendarIcon className="h-3.5 w-3.5" />
              Actualizado: {formatDate(profileData.updated_at.$date)}
            </Badge>
            <Badge variant="secondary" className="py-1.5 px-3 bg-primary/10 text-primary">
              {profileData.mbti_type}
            </Badge>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 text-primary"
                >
                  <FileTextIcon className="h-4 w-4" />
                  Exportar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Informe Psicológico Detallado</DialogTitle>
                  <DialogDescription>
                    Versión imprimible de tu perfil para guardar o compartir
                  </DialogDescription>
                </DialogHeader>
                
                <div ref={printableRef}>
                  <PrintableProfile profileData={profileData} formatDate={formatDate} />
                </div>
                
                <DialogFooter className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" onClick={() => setShowPrintDialog(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir/Exportar PDF
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card className="mb-8 border-border/20 shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                <div className="text-4xl font-bold text-primary">{profileData.mbti_type}</div>
                <div className="text-sm text-muted-foreground mt-1">Tipo de personalidad</div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(profileData.trait_scores)
                  .sort(([, a], [, b]) => Number(b) - Number(a))
                  .slice(0, 2)
                  .map(([trait, score], index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 rounded-lg">
                      <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                        {score}%
                      </div>
                      <div className="text-xs text-blue-800 dark:text-blue-300 mt-1 text-center">
                        {trait.charAt(0).toUpperCase() + trait.slice(1)}
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="col-span-1 sm:col-span-2 flex flex-col justify-center p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-lg">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                  Áreas de desarrollo
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.development_areas.map((area, index) => (
                    <Badge key={index} variant="outline" 
                      className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="personality">Personalidad</TabsTrigger>
            <TabsTrigger value="ikigai">Ikigai</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="shadow-lg border-border/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        P
                      </span>
                      Resumen de Perfil
                    </CardTitle>
                    <CardDescription>
                      Una visión general de tus rasgos y características principales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">Tipo MBTI</div>
                        <div className="font-medium">{profileData.mbti_type}</div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium mb-2">Rasgos principales</div>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(profileData.trait_scores)
                            .sort(([, a], [, b]) => Number(b) - Number(a))
                            .map(([trait, score], index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{trait.charAt(0).toUpperCase() + trait.slice(1)}</span>
                                <span className="font-medium">{score}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium mb-2">Áreas de desarrollo</div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.development_areas.map((area, index) => (
                            <Badge key={index} variant="outline">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <RadarChart data={radarData} />
              </div>
              
              <div className="space-y-6">
                <Card className="shadow-lg border-border/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        R
                      </span>
                      Recomendaciones Destacadas
                    </CardTitle>
                    <CardDescription>
                      Sugerencias personalizadas basadas en tu perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Profesiones</div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.recommended_professions.map((profession, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                              {profession.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium mb-2">Habilidades a desarrollar</div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.recommended_skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium mb-2">Personalidades similares</div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.recommended_personalities.map((personality, index) => (
                            <Badge key={index} variant="outline" 
                              className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30">
                              {personality.charAt(0).toUpperCase() + personality.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <TraitScoresChart 
                  traitScores={profileData.trait_scores} 
                  developmentAreas={profileData.development_areas} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="personality" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <MbtiChart 
                mbtiType={profileData.mbti_type} 
                mbtiScores={profileData.mbti_scores} 
              />
              
              <Card className="shadow-lg border-border/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      C
                    </span>
                    Características de personalidad MBTI
                  </CardTitle>
                  <CardDescription>
                    Explicación detallada de tu tipo de personalidad {profileData.mbti_type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Energía: {profileData.mbti_type.includes('E') ? 'Extroversión (E)' : 'Introversión (I)'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {profileData.mbti_type.includes('E') 
                          ? 'Te energizas al interactuar con otras personas y el mundo exterior. Prefieres la comunicación verbal y disfrutas de ambientes sociales activos.'
                          : 'Te energizas con tu mundo interior de ideas y reflexiones. Prefieres la comunicación escrita y los ambientes tranquilos para concentrarte.'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Información: {profileData.mbti_type.includes('S') ? 'Sensorial (S)' : 'Intuitivo (N)'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {profileData.mbti_type.includes('S') 
                          ? 'Te enfocas en datos concretos y detalles específicos. Confías en experiencias pasadas y prefieres soluciones prácticas y probadas.'
                          : 'Te enfocas en patrones y posibilidades futuras. Confías en la intuición y prefieres soluciones innovadoras y teóricas.'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Decisiones: {profileData.mbti_type.includes('T') ? 'Pensamiento (T)' : 'Sentimiento (F)'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {profileData.mbti_type.includes('T') 
                          ? 'Tomas decisiones basadas en la lógica y el análisis objetivo. Valoras la consistencia y la imparcialidad en los juicios.'
                          : 'Tomas decisiones basadas en valores personales y considerando a las personas. Valoras la armonía y la empatía en las relaciones.'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Estilo de vida: {profileData.mbti_type.includes('J') ? 'Juicio (J)' : 'Percepción (P)'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {profileData.mbti_type.includes('J') 
                          ? 'Prefieres un estilo de vida planificado y organizado. Te gusta tener claridad, estructura y decisiones tomadas.'
                          : 'Prefieres un estilo de vida flexible y adaptable. Te gusta mantener opciones abiertas y responder espontáneamente a las situaciones.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Fortalezas y contribuciones únicas
                    </h3>
                    <ul className="space-y-1">
                      {profileData.mbti_type === 'INFP' && (
                        <>
                          <li className="text-sm text-blue-700 dark:text-blue-400">• Fuerte sentido de los valores personales y éticos</li>
                          <li className="text-sm text-blue-700 dark:text-blue-400">• Creatividad e imaginación para resolver problemas</li>
                          <li className="text-sm text-blue-700 dark:text-blue-400">• Empatía profunda y capacidad para conectar con otros</li>
                          <li className="text-sm text-blue-700 dark:text-blue-400">• Adaptabilidad y apertura a nuevas posibilidades</li>
                          <li className="text-sm text-blue-700 dark:text-blue-400">• Capacidad para inspirar y motivar a otros con ideales</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="ikigai" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IkigaiChart ikigaiScores={profileData.ikigai_scores} />
              
              <Card className="shadow-lg border-border/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      I
                    </span>
                    Componentes de tu Ikigai
                  </CardTitle>
                  <CardDescription>
                    Análisis de los cuatro elementos que conforman tu propósito vital
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20 rounded-lg">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                        Pasión (Lo que amas) - {profileData.ikigai_scores.passion}%
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {profileData.development_areas.includes('Passion (What You Love)') 
                          ? 'Área identificada para desarrollo. Dedica tiempo a explorar actividades que te generen alegría genuina y entusiasmo.'
                          : 'Tienes claridad sobre las actividades que disfrutas profundamente y que generan satisfacción intrínseca.'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                        Misión (Lo que el mundo necesita) - {profileData.ikigai_scores.mission}%
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        {profileData.ikigai_scores.mission < 30
                          ? 'Podrías beneficiarte de conectar más tus actividades con necesidades reales de tu comunidad o sociedad.'
                          : 'Tienes un buen sentido de cómo tus acciones pueden contribuir positivamente a tu entorno y resolver problemas relevantes.'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/20 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                        Profesión (Por lo que te pagan) - {profileData.ikigai_scores.profession}%
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        {profileData.ikigai_scores.profession < 30
                          ? 'Explora cómo convertir tus habilidades en oportunidades profesionales que generen valor económico.'
                          : 'Has identificado adecuadamente cómo tus talentos pueden traducirse en actividades profesionales remuneradas.'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-lg">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                        Vocación (En lo que eres bueno) - {profileData.ikigai_scores.vocation}%
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        {profileData.ikigai_scores.vocation < 30
                          ? 'Trabaja en identificar y perfeccionar tus fortalezas naturales para alcanzar la excelencia.'
                          : 'Tienes una buena comprensión de tus talentos y capacidades donde puedes destacar naturalmente.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Armonizando tu Ikigai</h3>
                    <p className="text-sm text-muted-foreground">
                      Tu mayor equilibrio se encuentra entre 
                      {Object.entries(profileData.ikigai_scores)
                        .sort(([, a], [, b]) => Number(b) - Number(a))
                        .slice(0, 2)
                        .map(([key]) => ` ${key.charAt(0).toUpperCase() + key.slice(1)}`)
                        .join(' y ')}.
                      Para lograr mayor satisfacción vital, considera desarrollar el área de
                      {Object.entries(profileData.ikigai_scores)
                        .sort(([, a], [, b]) => Number(a) - Number(b))
                        .slice(0, 1)
                        .map(([key]) => ` ${key.charAt(0).toUpperCase() + key.slice(1)}`)}.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6">
            <RecommendationsList 
              personalities={profileData.recommended_personalities}
              activities={profileData.recommended_activities}
              professions={profileData.recommended_professions}
              skills={profileData.recommended_skills}
              interests={profileData.recommended_interests}
              advices={profileData.recommended_advices}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 