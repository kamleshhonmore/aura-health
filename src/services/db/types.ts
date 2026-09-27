import { DayLog, CycleRecord, AppSettings, ThemeId, PetId } from '../../types';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  cycleLength?: number;
  periodLength?: number;
  lutealLength?: number;
  activeTheme?: ThemeId;
  activePet?: PetId;
  waterGoalGlasses?: number;
  pinLockEnabled?: boolean;
  isPregnancyMode?: boolean;
  userAge?: number;
  userHeight?: number;
  userWeight?: number;
  updatedAt?: string;
}

export interface AssessmentData {
  id: string;
  userId: string;
  createdAt: string;
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  answers: Record<string, any>;
  recommendations?: string[];
}

export interface AyurvedicProfileData {
  userId: string;
  primaryDosha: string;
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
  updatedAt: string;
}

/**
 * Universal Data Repository Interface.
 * Allows swapping database providers (Firestore, SQLite, PostgreSQL, Supabase, LocalStorage)
 * seamlessly without altering UI components.
 */
export interface IDataRepository {
  name: string;

  // Profile & Settings
  getUserProfile(userId: string): Promise<UserProfileData | null>;
  saveUserProfile(userId: string, profile: Partial<UserProfileData>): Promise<void>;

  // Daily Logs
  getDailyLogs(userId: string): Promise<Record<string, DayLog>>;
  saveDailyLog(userId: string, log: DayLog): Promise<void>;
  deleteDailyLog(userId: string, date: string): Promise<void>;
  subscribeDailyLogs?(userId: string, onUpdate: (logs: Record<string, DayLog>) => void): () => void;

  // Cycles
  getCycles(userId: string): Promise<CycleRecord[]>;
  saveCycle(userId: string, cycle: CycleRecord): Promise<void>;
  deleteCycle(userId: string, cycleId: string): Promise<void>;

  // PCOS & Clinical Assessments
  saveAssessment(userId: string, assessment: AssessmentData): Promise<void>;
  getAssessments(userId: string): Promise<AssessmentData[]>;

  // Ayurvedic Profile
  saveAyurvedicProfile(userId: string, profile: AyurvedicProfileData): Promise<void>;
  getAyurvedicProfile(userId: string): Promise<AyurvedicProfileData | null>;
}
