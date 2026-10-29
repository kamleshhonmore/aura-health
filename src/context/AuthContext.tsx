import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import {
  getDatabaseProvider,
  setDatabaseProvider,
  getCurrentProviderType,
  DatabaseProviderType,
  UserProfileData,
  UserRole,
  DoctorInfo,
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
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, role?: UserRole, doctorDetails?: DoctorInfo) => Promise<void>;
  signOutUser: () => Promise<void>;
  continueAsGuest: () => void;
  switchDatabase: (type: DatabaseProviderType) => void;
  syncOfflineData: (logs: Record<string, DayLog>, cycles: CycleRecord[]) => Promise<{ migratedLogs: number; migratedCycles: number }>;
  loginDemoUser: (role: UserRole) => Promise<void>;
  updateSettings: (settings: Partial<UserProfileData>) => Promise<void>;
  refreshProfile: () => Promise<void>;
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

  // Handle redirect login results on boot (web only, non-blocking on native)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      getRedirectResult(auth).catch((err) => {
        if (err?.code !== 'auth/null-user') {
          console.log('Firebase redirect auth status:', err?.message);
        }
      });
    }
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        setIsGuest(false);
        localStorage.removeItem('aura_auth_guest');
        setDatabaseProvider('firestore');
        setActiveProviderState('firestore');
        setSyncStatus('syncing');

        try {
          const repo = getDatabaseProvider();
          // Add 2-second timeout so app loads instantly even if Firestore network is delayed
          let profile = await Promise.race([
            repo.getUserProfile(currentUser.uid),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore connection timeout')), 2000))
          ]) as UserProfileData | null;

          const inferredRole: UserRole = (currentUser.email === 'honmorekamlesh2425@ternaengg.ac.in' || currentUser.email === 'demo.admin@aurahealth.com')
            ? 'admin'
            : (currentUser.email === 'doc0@mail.com' || currentUser.email === 'demo.doctor@aurahealth.com')
            ? 'doctor'
            : 'patient';

          if (!profile) {
            profile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || (inferredRole === 'doctor' ? 'Dr. Ananya Roy' : inferredRole === 'admin' ? 'Administrator' : 'Aura User'),
              photoURL: currentUser.photoURL || '',
              role: inferredRole,
              isVerified: true,
              doctorInfo: inferredRole === 'doctor' ? {
                specialization: 'Gynecologist',
                licenseNumber: 'MCI-MH-884920',
                hospitalClinic: 'Aura Ayur-Women Care Clinic',
              } : undefined,
              cycleLength: 28,
              periodLength: 5,
              updatedAt: new Date().toISOString(),
            };
            await repo.saveUserProfile(currentUser.uid, profile).catch(() => {});
          } else if (!profile.role) {
            profile.role = inferredRole;
          }
          setUserProfile(profile);
          setSyncStatus('synced');
        } catch (e) {
          console.warn('Failed to fetch user profile (using offline fallback):', e);
          const inferredRole: UserRole = (currentUser.email === 'honmorekamlesh2425@ternaengg.ac.in' || currentUser.email === 'demo.admin@aurahealth.com')
            ? 'admin'
            : (currentUser.email === 'doc0@mail.com' || currentUser.email === 'demo.doctor@aurahealth.com')
            ? 'doctor'
            : 'patient';

          setUserProfile({
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || (inferredRole === 'doctor' ? 'Dr. Ananya Roy' : inferredRole === 'admin' ? 'Administrator' : 'Aura User'),
            photoURL: currentUser.photoURL || '',
            role: inferredRole,
            isVerified: true,
            doctorInfo: inferredRole === 'doctor' ? {
              specialization: 'Gynecologist',
              licenseNumber: 'MCI-MH-884920',
              hospitalClinic: 'Aura Ayur-Women Care Clinic',
            } : undefined,
            cycleLength: 28,
            periodLength: 5,
            updatedAt: new Date().toISOString(),
          });
          setSyncStatus('offline');
        }
      } else {
        setUserProfile(null);
        setSyncStatus('local');
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time listener for profile changes (including doctor verification status)
  useEffect(() => {
    if (!user) return;
    const repo = getDatabaseProvider();
    if (repo.subscribeUserProfile) {
      const unsub = repo.subscribeUserProfile(user.uid, (freshProfile) => {
        if (freshProfile) {
          setUserProfile((prev) => ({ ...prev, ...freshProfile }));
          setSyncStatus('synced');
        }
      });
      return () => unsub();
    }
  }, [user]);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const repo = getDatabaseProvider();
      const fresh = await repo.getUserProfile(user.uid);
      if (fresh) {
        setUserProfile(fresh);
        setSyncStatus('synced');
      }
    } catch (e) {
      console.warn('Failed to refresh user profile:', e);
    }
  };

  const signInWithGoogle = async (useRedirect = false) => {
    try {
      setLoading(true);
      if (useRedirect || Capacitor.isNativePlatform()) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Normal user actions like closing popup window shouldn't be logged as uncaught fatal errors
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        console.info('Google sign-in popup closed by user.');
      } else {
        console.error('Google Sign-In failed:', error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error('Email sign-in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    role: UserRole = 'patient',
    doctorDetails?: DoctorInfo
  ) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        const repo = getDatabaseProvider();
        const initialProfile: UserProfileData = {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: res.user.displayName || email.split('@')[0],
          photoURL: res.user.photoURL || '',
          role: role,
          isVerified: role === 'patient' ? true : false,
          doctorInfo: doctorDetails,
          cycleLength: 28,
          periodLength: 5,
          updatedAt: new Date().toISOString(),
        };
        await repo.saveUserProfile(res.user.uid, initialProfile).catch(() => {});
        setUserProfile(initialProfile);
      }
    } catch (error: any) {
      console.error('Email sign-up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginDemoUser = async (role: UserRole) => {
    setLoading(true);
    try {
      let targetEmail = 'demo.patient@aurahealth.com';
      let targetPass = 'patient123';
      if (role === 'doctor') {
        targetEmail = 'demo.doctor@aurahealth.com';
        targetPass = 'AuraDoctor2026!';
      } else if (role === 'admin') {
        targetEmail = 'demo.admin@aurahealth.com';
        targetPass = 'AuraAdmin2026!';
      }
      await signInWithEmailAndPassword(auth, targetEmail, targetPass);
    } catch (err: any) {
      console.error(`Demo sign in failed for ${role}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      setUser(null);
      setUserProfile(null);
      setIsGuest(false);
      localStorage.removeItem('aura_auth_guest');
      setDatabaseProvider('local');
      setActiveProviderState('local');
      setSyncStatus('local');

      await signOut(auth);
    } catch (e) {
      console.error('Sign-out error:', e);
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('aura_auth_guest', 'true');
    setDatabaseProvider('local');
    setActiveProviderState('local');
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
    if (!user || !auth.currentUser || auth.currentUser.uid !== user.uid) {
      return { migratedLogs: 0, migratedCycles: 0 };
    }
    // Doctors and Admins do not manage or sync personal menstrual cycle data
    if (userProfile?.role === 'doctor' || userProfile?.role === 'admin') {
      return { migratedLogs: 0, migratedCycles: 0 };
    }
    setSyncStatus('syncing');
    try {
      const result = await syncLocalDataToCloud(user.uid, logs, cycles);
      setSyncStatus('synced');
      return result;
    } catch (e) {
      console.warn('Sync offline data deferred:', e);
      setSyncStatus('synced');
      return { migratedLogs: 0, migratedCycles: 0 };
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
        signInWithEmail,
        signUpWithEmail,
        loginDemoUser,
        signOutUser,
        continueAsGuest,
        switchDatabase,
        syncOfflineData,
        updateSettings,
        refreshProfile,
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
