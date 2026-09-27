import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  IDataRepository,
  UserProfileData,
  AssessmentData,
  AyurvedicProfileData,
} from './types';
import { DayLog, CycleRecord } from '../../types';

export class FirestoreRepository implements IDataRepository {
  name = 'Google Cloud Firestore';

  // --- Profile ---
  async getUserProfile(userId: string): Promise<UserProfileData | null> {
    const path = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (!snap.exists()) return null;
      return snap.data() as UserProfileData;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }

  async saveUserProfile(userId: string, profile: Partial<UserProfileData>): Promise<void> {
    const path = `users/${userId}`;
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        {
          ...profile,
          uid: userId,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  // --- Daily Logs ---
  async getDailyLogs(userId: string): Promise<Record<string, DayLog>> {
    const path = `users/${userId}/dailyLogs`;
    try {
      const querySnap = await getDocs(collection(db, 'users', userId, 'dailyLogs'));
      const result: Record<string, DayLog> = {};
      querySnap.forEach((d) => {
        const data = d.data();
        result[d.id] = {
          date: data.date || d.id,
          isPeriod: !!data.isPeriod,
          flow: data.flow || 'none',
          symptoms: data.symptoms || [],
          moods: data.moods || [],
          intimacy: data.intimacy || [],
          orgasms: data.orgasms || 0,
          pillTaken: !!data.pillTaken,
          pillTime: data.pillTime,
          waterGlasses: data.waterGlasses ?? 0,
          temperature: data.temperature,
          weight: data.weight,
          cervicalMucus: data.cervicalMucus,
          notes: data.notes || '',
        };
      });
      return result;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }

  async saveDailyLog(userId: string, log: DayLog): Promise<void> {
    const path = `users/${userId}/dailyLogs/${log.date}`;
    try {
      const logRef = doc(db, 'users', userId, 'dailyLogs', log.date);
      const docData: Record<string, any> = {
        userId,
        date: log.date,
        isPeriod: !!log.isPeriod,
        flow: log.flow || 'none',
        symptoms: log.symptoms || [],
        moods: log.moods || [],
        intimacy: log.intimacy || [],
        orgasms: log.orgasms || 0,
        pillTaken: !!log.pillTaken,
        waterGlasses: Number(log.waterGlasses) || 0,
        notes: (log.notes || '').slice(0, 1500),
        updatedAt: new Date().toISOString(),
      };
      if (log.pillTime) docData.pillTime = log.pillTime;
      if (typeof log.temperature === 'number') docData.temperature = log.temperature;
      if (typeof log.weight === 'number') docData.weight = log.weight;
      if (log.cervicalMucus) docData.cervicalMucus = log.cervicalMucus;

      await setDoc(logRef, docData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async deleteDailyLog(userId: string, date: string): Promise<void> {
    const path = `users/${userId}/dailyLogs/${date}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'dailyLogs', date));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  subscribeDailyLogs(userId: string, onUpdate: (logs: Record<string, DayLog>) => void): () => void {
    const path = `users/${userId}/dailyLogs`;
    return onSnapshot(
      collection(db, 'users', userId, 'dailyLogs'),
      (snapshot) => {
        const result: Record<string, DayLog> = {};
        snapshot.forEach((d) => {
          const data = d.data();
          result[d.id] = {
            date: data.date || d.id,
            isPeriod: !!data.isPeriod,
            flow: data.flow || 'none',
            symptoms: data.symptoms || [],
            moods: data.moods || [],
            intimacy: data.intimacy || [],
            orgasms: data.orgasms || 0,
            pillTaken: !!data.pillTaken,
            pillTime: data.pillTime,
            waterGlasses: data.waterGlasses ?? 0,
            temperature: data.temperature,
            weight: data.weight,
            cervicalMucus: data.cervicalMucus,
            notes: data.notes || '',
          };
        });
        onUpdate(result);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  }

  // --- Cycles ---
  async getCycles(userId: string): Promise<CycleRecord[]> {
    const path = `users/${userId}/cycles`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'cycles'));
      const cycles: CycleRecord[] = [];
      snap.forEach((d) => {
        const data = d.data();
        cycles.push({
          id: d.id,
          startDate: data.startDate,
          endDate: data.endDate || '',
          cycleLength: data.cycleLength,
          periodLength: data.periodLength,
          ovulationDate: data.ovulationDate || '',
        });
      });
      return cycles.sort((a, b) => b.startDate.localeCompare(a.startDate));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }

  async saveCycle(userId: string, cycle: CycleRecord): Promise<void> {
    const path = `users/${userId}/cycles/${cycle.id}`;
    try {
      const cycleRef = doc(db, 'users', userId, 'cycles', cycle.id);
      await setDoc(
        cycleRef,
        {
          id: cycle.id,
          userId,
          startDate: cycle.startDate,
          endDate: cycle.endDate || '',
          cycleLength: cycle.cycleLength,
          periodLength: cycle.periodLength,
          ovulationDate: cycle.ovulationDate || '',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async deleteCycle(userId: string, cycleId: string): Promise<void> {
    const path = `users/${userId}/cycles/${cycleId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'cycles', cycleId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  // --- Assessments ---
  async saveAssessment(userId: string, assessment: AssessmentData): Promise<void> {
    const path = `users/${userId}/assessments/${assessment.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'assessments', assessment.id), {
        ...assessment,
        userId,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async getAssessments(userId: string): Promise<AssessmentData[]> {
    const path = `users/${userId}/assessments`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'assessments'));
      const list: AssessmentData[] = [];
      snap.forEach((d) => list.push(d.data() as AssessmentData));
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }

  // --- Ayurvedic Profile ---
  async saveAyurvedicProfile(userId: string, profile: AyurvedicProfileData): Promise<void> {
    const path = `users/${userId}/ayurvedicProfile/current`;
    try {
      await setDoc(doc(db, 'users', userId, 'ayurvedicProfile', 'current'), {
        ...profile,
        userId,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async getAyurvedicProfile(userId: string): Promise<AyurvedicProfileData | null> {
    const path = `users/${userId}/ayurvedicProfile/current`;
    try {
      const snap = await getDoc(doc(db, 'users', userId, 'ayurvedicProfile', 'current'));
      if (!snap.exists()) return null;
      return snap.data() as AyurvedicProfileData;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }
}
