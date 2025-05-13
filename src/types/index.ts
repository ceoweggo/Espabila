export type UserProfile = {
  id: string;
  name: string;
  email: string;
  profileType: string | null;
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
  recommendedProfessions: string[];
  advice: string;
  recommendedActivities: string[];
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
  type?: 'multiple-choice' | 'open' | 'scale';
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
  itemsEn?: string[];
  subPregunta?: string;
  subQuestion?: string;
  minLabel?: string;
  maxLabel?: string;
  minLabelEs?: string;
  maxLabelEs?: string;
  traits?: Record<string, number>;
  mbti_dimension?: string;
  ikigai_area?: string;
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
