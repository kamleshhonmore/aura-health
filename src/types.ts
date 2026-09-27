export type ThemeId = 'blossom' | 'wood' | 'lavender' | 'mint' | 'midnight';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  emoji: string;
  bgMain: string;
  bgCard: string;
  bgCardHover: string;
  borderCard: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPink: string;
  accentPinkLight: string;
  accentGreen: string;
  accentGold: string;
  accentPurple: string;
  shadowColor: string;
  bannerBg: string;
}

export type PetId = 'kitty' | 'bunny' | 'puppy' | 'teddy' | 'flora';

export interface PetCompanion {
  id: PetId;
  name: string;
  avatar: string;
  personality: string;
  greetings: {
    period: string[];
    fertile: string[];
    ovulation: string[];
    standard: string[];
    waterGoal: string[];
  };
}

export type FlowLevel = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
export type IntimacyType = 'none' | 'protected' | 'unprotected' | 'high_desire' | 'masturbation';
export type CervicalMucusType = 'dry' | 'sticky' | 'creamy' | 'egg_white' | 'watery';

export interface DayLog {
  date: string; // YYYY-MM-DD
  isPeriod: boolean;
  flow: FlowLevel;
  symptoms: string[];
  moods: string[];
  intimacy: IntimacyType[];
  orgasms: number;
  pillTaken: boolean;
  pillTime?: string;
  waterGlasses: number; // 250ml each
  temperature?: number; // e.g. 97.8 or 36.6
  weight?: number; // e.g. 58.5 kg or 129 lbs
  cervicalMucus?: CervicalMucusType;
  notes: string;
  updatedAt?: string;
}

export interface DayCalendarInfo {
  dateStr: string; // YYYY-MM-DD
  dayOfMonth: number;
  month: number; // 0-11
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  cycleDay?: number;
  dayType: 'period' | 'predicted_period' | 'fertile' | 'ovulation' | 'standard' | 'luteal';
  conceptionChance: 'Low' | 'Medium' | 'High' | 'Peak';
  log?: DayLog;
}

export interface CycleRecord {
  id: string;
  startDate: string;
  endDate: string;
  cycleLength: number;
  periodLength: number;
  ovulationDate: string;
}

export interface AppSettings {
  cycleLength: number; // e.g. 28
  periodLength: number; // e.g. 5
  lutealLength: number; // e.g. 14
  tempUnit: 'F' | 'C';
  weightUnit: 'kg' | 'lbs';
  waterGoalGlasses: number; // e.g. 8 (2000ml)
  theme: ThemeId;
  pet: PetId;
  pinLockEnabled: boolean;
  pinCode: string;
  isPregnancyMode: boolean;
  pregnancyDueDate: string;
  pregnancyStartDate: string;
  // User Profile (Centralized Data)
  userAge: number;
  userHeight: number;
  userWeight: number;
  // Reminders
  remindPeriodDaysBefore: number;
  remindPeriodEnabled: boolean;
  remindOvulationEnabled: boolean;
  remindPillEnabled: boolean;
  remindPillTime: string;
  remindWaterEnabled: boolean;
}

export interface KickLog {
  id: string;
  timestamp: string;
  count: number;
  durationMinutes: number;
}
