export interface TestResult {
    profileType: string;
    mbtiType?: string;
    mbtiGroup?: string;
    skills: string[];
    interests: string[];
    similiarPersonalities: string[];
    recommendedProfessions: string[];
    advice: string;
    recommendedActivities: string[];
    // Campos adicionales que podrían ser útiles
    score?: number;
    startTime?: string;
    endTime?: string;
    duration?: number;
    testType?: string;
    status?: string;
  }