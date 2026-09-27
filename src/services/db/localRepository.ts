import { IDataRepository, UserProfileData, AssessmentData, AyurvedicProfileData } from './types';
import { DayLog, CycleRecord } from '../../types';
import { sampleLogs, sampleCycles } from '../../data';

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeSave(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`LocalStorage write failed for ${key}:`, e);
  }
}

export class LocalStorageRepository implements IDataRepository {
  name = 'LocalStorage (Offline/Local)';

  async getUserProfile(userId: string): Promise<UserProfileData | null> {
    return safeLoad<UserProfileData | null>(`aura_profile_${userId}`, null);
  }

  async saveUserProfile(userId: string, profile: Partial<UserProfileData>): Promise<void> {
    const current = await this.getUserProfile(userId) || { uid: userId, email: '' };
    safeSave(`aura_profile_${userId}`, { ...current, ...profile, updatedAt: new Date().toISOString() });
  }

  async getDailyLogs(userId: string): Promise<Record<string, DayLog>> {
    return safeLoad<Record<string, DayLog>>(`aura_logs_${userId}`, sampleLogs);
  }

  async saveDailyLog(userId: string, log: DayLog): Promise<void> {
    const all = await this.getDailyLogs(userId);
    all[log.date] = log;
    safeSave(`aura_logs_${userId}`, all);
  }

  async deleteDailyLog(userId: string, date: string): Promise<void> {
    const all = await this.getDailyLogs(userId);
    delete all[date];
    safeSave(`aura_logs_${userId}`, all);
  }

  async getCycles(userId: string): Promise<CycleRecord[]> {
    return safeLoad<CycleRecord[]>(`aura_cycles_${userId}`, sampleCycles);
  }

  async saveCycle(userId: string, cycle: CycleRecord): Promise<void> {
    const all = await this.getCycles(userId);
    const index = all.findIndex((c) => c.id === cycle.id);
    if (index >= 0) {
      all[index] = cycle;
    } else {
      all.push(cycle);
    }
    safeSave(`aura_cycles_${userId}`, all);
  }

  async deleteCycle(userId: string, cycleId: string): Promise<void> {
    const all = await this.getCycles(userId);
    const filtered = all.filter((c) => c.id !== cycleId);
    safeSave(`aura_cycles_${userId}`, filtered);
  }

  async saveAssessment(userId: string, assessment: AssessmentData): Promise<void> {
    const all = await this.getAssessments(userId);
    all.unshift(assessment);
    safeSave(`aura_assessments_${userId}`, all);
  }

  async getAssessments(userId: string): Promise<AssessmentData[]> {
    return safeLoad<AssessmentData[]>(`aura_assessments_${userId}`, []);
  }

  async saveAyurvedicProfile(userId: string, profile: AyurvedicProfileData): Promise<void> {
    safeSave(`aura_ayurveda_${userId}`, profile);
  }

  async getAyurvedicProfile(userId: string): Promise<AyurvedicProfileData | null> {
    return safeLoad<AyurvedicProfileData | null>(`aura_ayurveda_${userId}`, null);
  }
}
