import { DayLog, CycleRecord, AppSettings, ThemeId, PetId } from '../../types';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface DoctorInfo {
  specialization: 'Gynecologist' | 'Endocrinologist' | 'Ayurvedic Practitioner' | 'General Physician';
  licenseNumber: string;
  hospitalClinic?: string;
  bio?: string;
  consultationFee?: number;
}

export interface UserProfileData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: UserRole;
  isVerified?: boolean;
  doctorInfo?: DoctorInfo;
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

export interface PatientDoctorConnection {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization?: string;
  status: 'pending' | 'accepted' | 'revoked';
  permissions: {
    shareCycleLogs: boolean;
    sharePcosAssessments: boolean;
    shareAyurvedicProfile: boolean;
  };
  accessCode?: string;
  consultationNote?: string;
  consultationDate?: string;
  prescriptionSummary?: string;
  createdAt: string;
  updatedAt: string;
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
  subscribeUserProfile?(userId: string, onUpdate: (profile: UserProfileData) => void): () => void;

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

  // Doctor & Admin Access Control
  getPendingDoctors?(): Promise<UserProfileData[]>;
  getAllDoctors?(): Promise<UserProfileData[]>;
  verifyDoctor?(doctorId: string, isVerified: boolean): Promise<void>;

  // Patient - Doctor Connections
  saveConnection?(connection: PatientDoctorConnection): Promise<void>;
  getPatientConnections?(patientId: string): Promise<PatientDoctorConnection[]>;
  getDoctorPatients?(doctorId: string): Promise<PatientDoctorConnection[]>;
  deleteConnection?(connectionId: string): Promise<void>;
}

