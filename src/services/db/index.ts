import { IDataRepository } from './types';
import { LocalStorageRepository } from './localRepository';
import { FirestoreRepository } from './firestoreRepository';
import { DayLog, CycleRecord } from '../../types';
import { auth } from '../firebase';

export * from './types';

// Instantiate repository drivers
export const localRepo = new LocalStorageRepository();
export const firestoreRepo = new FirestoreRepository();

export type DatabaseProviderType = 'firestore' | 'local';

let currentProviderType: DatabaseProviderType = 'firestore';
let activeRepo: IDataRepository = firestoreRepo;

/**
 * Easily switch database provider at runtime.
 * Allows effortless migration or testing of alternate backends.
 */
export function setDatabaseProvider(type: DatabaseProviderType): IDataRepository {
  currentProviderType = type;
  activeRepo = type === 'firestore' ? firestoreRepo : localRepo;
  return activeRepo;
}

export function getDatabaseProvider(): IDataRepository {
  return activeRepo;
}

export function getCurrentProviderType(): DatabaseProviderType {
  return currentProviderType;
}

/**
 * Seamlessly migrates local guest/offline cycle data and logs to Cloud Firestore
 * when a user logs in or reconnects to the internet.
 */
export async function syncLocalDataToCloud(
  userId: string,
  localLogs: Record<string, DayLog>,
  localCycles: CycleRecord[]
): Promise<{ migratedLogs: number; migratedCycles: number }> {
  // Ensure the user is authenticated in Firebase Auth and matches the target userId
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return { migratedLogs: 0, migratedCycles: 0 };
  }

  let migratedLogs = 0;
  let migratedCycles = 0;

  try {
    // 1. Upload local logs that are new or updated locally while offline
    const remoteLogs = await firestoreRepo.getDailyLogs(userId);
    if (!auth.currentUser || auth.currentUser.uid !== userId) {
      return { migratedLogs, migratedCycles };
    }

    for (const [date, log] of Object.entries(localLogs)) {
      if (!auth.currentUser || auth.currentUser.uid !== userId) break;
      const remote = remoteLogs[date];
      const isNew = !remote;
      const isNewer =
        remote &&
        ((log.updatedAt && !remote.updatedAt) ||
          (log.updatedAt && remote.updatedAt && log.updatedAt > remote.updatedAt));

      if (isNew || isNewer) {
        await firestoreRepo.saveDailyLog(userId, log);
        migratedLogs++;
      }
    }

    // 2. Upload cycles created or modified offline
    if (!auth.currentUser || auth.currentUser.uid !== userId) {
      return { migratedLogs, migratedCycles };
    }

    const remoteCycles = await firestoreRepo.getCycles(userId);
    if (!auth.currentUser || auth.currentUser.uid !== userId) {
      return { migratedLogs, migratedCycles };
    }

    const remoteCycleMap = new Map(remoteCycles.map((c) => [c.id, c]));
    for (const cycle of localCycles) {
      if (!auth.currentUser || auth.currentUser.uid !== userId) break;
      const remote = remoteCycleMap.get(cycle.id);
      if (
        !remote ||
        cycle.startDate !== remote.startDate ||
        cycle.cycleLength !== remote.cycleLength ||
        cycle.periodLength !== remote.periodLength
      ) {
        await firestoreRepo.saveCycle(userId, cycle);
        migratedCycles++;
      }
    }
  } catch (error) {
    console.warn('Sync offline data to cloud encountered an issue:', error);
  }

  return { migratedLogs, migratedCycles };
}
