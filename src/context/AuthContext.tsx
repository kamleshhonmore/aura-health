import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import {
  getDatabaseProvider,
  setDatabaseProvider,
  getCurrentProviderType,
  DatabaseProviderType,
  UserProfileData,
  firestoreRepo,
  localRepo,
  syncLocalDataToCloud,
} from '../services/db';
import { DayLog, CycleRecord } from '../types';

export type SyncState = 'synced' | 'syncing' | 'offline' | 'local';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  isGuest: boolean;
  syncStatus: SyncState;
  activeProvider: DatabaseProviderType;
  providerName: string;
  signInWithGoogle: (useRedirect?: boolean) => Promise<void>;
  signOutUser: () => Promise<void>;
  continueAsGuest: () => void;
  switchDatabase: (type: DatabaseProviderType) => void;
  syncOfflineData: (logs: Record<string, DayLog>, cycles: CycleRecord[]) => Promise<{ migratedLogs: number; migratedCycles: number }>;
  updateSettings: (settings: Partial<UserProfileData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('aura_auth_guest') === 'true';
  });
  const [syncStatus, setSyncStatus] = useState<SyncState>('local');
  const [activeProvider, setActiveProviderState] = useState<DatabaseProviderType>(getCurrentProviderType());

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      if (user) setSyncStatus('synced');
    };
    const handleOffline = () => {
      setSyncStatus('offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Handle redirect login results on boot
  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      // Non-fatal if no redirect was pending
      if (err?.code !== 'auth/null-user') {
        console.log('Firebase redirect auth status:', err?.message);
      }
    });
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        setIsGuest(false);
        localStorage.removeItem('aura_auth_guest');
        setSyncStatus('syncing');

        try {
          const repo = getDatabaseProvider();
          let profile = await repo.getUserProfile(currentUser.uid);
          if (!profile) {
            // First time user registered/signed in
            profile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Cycle Tracker User',
              photoURL: currentUser.photoURL || '',
              cycleLength: 28,
              periodLength: 5,
              updatedAt: new Date().toISOString(),
            };
            await repo.saveUserProfile(currentUser.uid, profile);
          }
          setUserProfile(profile);
          setSyncStatus('synced');
        } catch (e) {
          console.warn('Failed to fetch user profile:', e);
          setSyncStatus('offline');
        }
      } else {
        setUserProfile(null);
        setSyncStatus('local');
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (useRedirect = false) => {
    try {
      if (useRedirect) {
        setLoading(true);
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      // Call popup synchronously immediately upon user interaction to avoid browser popup blockers
      const popupPromise = signInWithPopup(auth, googleProvider);
      setLoading(true);
      await popupPromise;
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsGuest(true);
      localStorage.setItem('aura_auth_guest', 'true');
      setSyncStatus('local');
    } catch (e) {
      console.error('Sign-out error:', e);
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('aura_auth_guest', 'true');
    setSyncStatus('local');
  };

  const switchDatabase = (type: DatabaseProviderType) => {
    setDatabaseProvider(type);
    setActiveProviderState(type);
    if (type === 'local') {
      setSyncStatus('local');
    } else if (user) {
      setSyncStatus('synced');
    }
  };

  const syncOfflineData = async (logs: Record<string, DayLog>, cycles: CycleRecord[]) => {
    if (!user) return { migratedLogs: 0, migratedCycles: 0 };
    setSyncStatus('syncing');
    try {
      const result = await syncLocalDataToCloud(user.uid, logs, cycles);
      setSyncStatus('synced');
      return result;
    } catch (e) {
      console.error('Failed to sync offline data to cloud:', e);
      setSyncStatus('offline');
      throw e;
    }
  };

  const updateSettings = async (settings: Partial<UserProfileData>) => {
    if (!user) return;
    try {
      const repo = getDatabaseProvider();
      await repo.saveUserProfile(user.uid, settings);
      setUserProfile((prev) => (prev ? { ...prev, ...settings } : null));
    } catch (e) {
      console.error('Failed to update settings in database:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isGuest,
        syncStatus,
        activeProvider,
        providerName: getDatabaseProvider().name,
        signInWithGoogle,
        signOutUser,
        continueAsGuest,
        switchDatabase,
        syncOfflineData,
        updateSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
