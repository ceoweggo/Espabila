export type UserProfile = {
  id: string;
  name: string;
  email: string;
  profileType: string | null;
  mbtiRaw?: string; // El código MBTI sin formato (como "INFP")
  mbtiGroup?: string; // The MBTI group (e.g., "Diplomáticos", "Analistas")
  skills: string[];
  interests: string[];
  similiarPersonalities: string[];
  recommendedProfessions: string[];
  completedTests: TestRecord[];
}

export type TestRecord = {
  id: string;
  date: string;
  type: 'quick' | 'comprehensive';
  result: TestResult;
}

export type TestResult = {
  profileType: string;
  mbtiType?: string; // MBTI personality type code
  mbtiGroup?: string; // MBTI group
  skills: string[];
  interests: string[];
  similiarPersonalities: string[];
  recommendedProfessions: (string | { id: string; name: string; name_es: string })[];
  recommendedActivities: (string | { id: string; name: string; name_es: string })[];
  advice: string;
}

export type Profile = {
  profileType: string;
  profileTypeEs: string;
  mbtiType?: string; // MBTI personality type code (e.g., "INTJ", "ENFP")
  mbtiGroup?: 'Analysts' | 'Diplomats' | 'Sentinels' | 'Explorers'; // MBTI group
  mbtiGroupEs?: 'Analistas' | 'Diplomáticos' | 'Centinelas' | 'Exploradores'; // MBTI group in Spanish
  skills: string[];
  skillsEs: string[];
  interests: string[];
  interestsEs: string[];
  similarPersonalities: string[];
  similarPersonalitiesEs: string[];
  recommendedProfessions: string[];
  recommendedProfessionsEs: string[];
  advice: string;
  adviceEs: string;
  recommendedActivities: string[];
  recommendedActivitiesEs: string[];
}

export type ScaleValueRange = {
  min: number;
  max: number;
  [key: string]: any; // Rasgos y valores adicionales para este rango
}

export type QuestionOption = {
  valor?: string;
  descripcion?: string;
}

export type Question = {
  id: string;
  pregunta?: string;
  text?: string;
  textEs?: string;
  tipo?: 'unica' | 'multiple' | 'abierta' | 'escala';
  type?: 'multiple-select' | 'multiple-choice' | 'open' | 'scale';
  opciones?: (string | QuestionOption)[];
  options?: (string | QuestionOption)[];
  optionsEs?: (string | QuestionOption)[];
  maxOpciones?: number;
  maxOptions?: number;
  valorMinimo?: number;
  minValue?: number;
  valorMaximo?: number;
  maxValue?: number;
  items?: string[];
  itemsEs?: string[];
  subPregunta?: string;
  subQuestion?: string;
  minLabel?: string;
  maxLabel?: string;
  minLabelEs?: string;
  maxLabelEs?: string;
  //traits?: Record<string, number>; // It deleted in the new version 
  optionValues?: Array<Record<string, any>>; // Question type = multiple-choice / multiple-select
  baseTraits?: Record<string, number>; // Question type = Open
  mbti_dimension?: string; // Question type = Open
  ikigai_area?: string; // Question type = Open
  scaleValues?: ScaleValueRange[]; // Question type = Scale - global para toda la pregunta
  itemScaleValues?: ScaleValueRange[][]; // NUEVO: valores específicos para cada ítem en preguntas de escala
  keywordAnalysis?: Record<string, string[]>; // Keywords in English
  keywordAnalysisEs?: Record<string, string[]>; // Keywords in Spanish
}

export type QuestionBlock = {
  id: number | string;
  titulo?: string;
  title?: string;
  titleEs?: string;
  description?: string;
  descriptionEs?: string;
  descriptionEn?: string;
  preguntas?: Question[];
  questions?: Question[];
}

export type Answer = {
  questionId: string;
  value: string | number | string[];
}

export type AppConfig = {
  tiempoMaximo: string;
  tipoPreguntas: string[];
  sugerenciasInteractividad: string[];
}
