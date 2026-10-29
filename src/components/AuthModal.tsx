import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeConfig, DayLog, CycleRecord } from '../types';
import { UserRole, DoctorInfo } from '../services/db/types';
import { getDatabaseProvider } from '../services/db';
import {
  X,
  Cloud,
  CloudOff,
  RefreshCw,
  Database,
  CheckCircle,
  LogIn,
  LogOut,
  ShieldCheck,
  Smartphone,
  HardDrive,
  ExternalLink,
  AlertTriangle,
  Lock,
  Mail,
  User,
  Stethoscope,
  Building,
  FileCheck,
  Award,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  currentLogs: Record<string, DayLog>;
  currentCycles: CycleRecord[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  theme,
  currentLogs,
  currentCycles,
}) => {
  const {
    user,
    userProfile,
    loading,
    syncStatus,
    activeProvider,
    providerName,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
    continueAsGuest,
    switchDatabase,
    syncOfflineData,
    refreshProfile,
  } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      refreshProfile().catch(() => {});
    }
  }, [isOpen, user]);

  const [syncingNow, setSyncingNow] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Extended Doctor / Role state
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [specialization, setSpecialization] = useState<DoctorInfo['specialization']>('Gynecologist');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [hospitalClinic, setHospitalClinic] = useState('');

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      if (isSignUp) {
        const doctorDetails: DoctorInfo | undefined = selectedRole === 'doctor' ? {
          specialization,
          licenseNumber: licenseNumber.trim(),
          hospitalClinic: hospitalClinic.trim(),
        } : undefined;

        if (selectedRole === 'doctor' && !licenseNumber.trim()) {
          setErrorMessage('Please provide a valid Medical License Number.');
          return;
        }

        await signUpWithEmail(emailInput, passwordInput, selectedRole, doctorDetails);
        setSyncMessage(selectedRole === 'doctor'
          ? 'Doctor account created! Verification pending admin review.'
          : 'Account created and logged in successfully!');
      } else {
        await signInWithEmail(emailInput, passwordInput);
        setSyncMessage('Logged in successfully!');
      }
      setTimeout(() => setSyncMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async (useRedirect = false) => {
    setErrorMessage(null);
    setIsPopupBlocked(false);
    try {
      await signInWithGoogle(useRedirect);
      setSyncMessage('Successfully authenticated with Google!');
      setTimeout(() => setSyncMessage(null), 3500);
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) {
        setIsPopupBlocked(true);
        setErrorMessage('Browser blocked the sign-in popup. You can sign in using redirect.');
      } else {
        setErrorMessage(err?.message || 'Failed to sign in. Please try again.');
      }
    }
  };

  const handleManualSync = async () => {
    setSyncingNow(true);
    setErrorMessage(null);
    try {
      const res = await syncOfflineData(currentLogs, currentCycles);
      await refreshProfile();
      setSyncMessage(`Synced ${res.migratedLogs} logs and ${res.migratedCycles} cycles to Cloud!`);
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage('Sync failed. Please check network connection.');
    } finally {
      setSyncingNow(false);
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xl animate-fadeIn font-['Nunito'] text-slate-900">
      <div className="w-full max-w-md bg-white rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 shadow-2xl border border-rose-100 relative overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black font-['Fredoka'] tracking-tight">Account & Cloud Backup</h2>
              <p className="text-[11px] font-semibold text-slate-500">End-to-End Encrypted Health Records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="mt-4 p-3.5 rounded-2xl border border-rose-100 bg-rose-50/40 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-3">
            {syncStatus === 'synced' ? (
              <Cloud className="w-5 h-5 text-emerald-600 animate-pulse shrink-0" />
            ) : syncStatus === 'syncing' ? (
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
            ) : syncStatus === 'offline' ? (
              <CloudOff className="w-5 h-5 text-amber-600 shrink-0" />
            ) : (
              <HardDrive className="w-5 h-5 text-purple-600 shrink-0" />
            )}
            <div>
              <div className="font-black text-xs text-slate-900">
                {syncStatus === 'synced'
                  ? 'Cloud Backup Active'
                  : syncStatus === 'syncing'
                  ? 'Synchronizing health records...'
                  : syncStatus === 'offline'
                  ? 'Offline Mode (Saved locally)'
                  : 'Local Storage (Guest Mode)'}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {syncStatus === 'synced' ? 'Private Cloud Sync' : 'Local Device Encryption'}
              </div>
            </div>
          </div>

          {user && (
            <button
              onClick={handleManualSync}
              disabled={syncingNow}
              className="px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${syncingNow ? 'animate-spin' : ''}`} />
              {syncingNow ? 'Syncing...' : 'Sync Now'}
            </button>
          )}
        </div>

        {syncMessage && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2 border border-emerald-200 font-semibold shadow-xs">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{syncMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-50 text-rose-900 text-xs border border-rose-200 font-semibold shadow-xs">
            {errorMessage}
          </div>
        )}

        {/* User Card or Login Form */}
        <div className="mt-5 space-y-4">
          {user ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border-2 border-rose-100 bg-white flex items-center gap-3.5 shadow-sm">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-12 h-12 rounded-2xl border-2 border-rose-500 shadow-sm object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-sm">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm truncate text-slate-900">{user.displayName || 'Aura Health User'}</h3>
                  <p className="text-xs font-semibold text-slate-500 truncate">{user.email}</p>

                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                      Role: {userProfile?.role || 'patient'}
                    </span>
                    {userProfile?.role === 'doctor' && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                          userProfile.isVerified
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {userProfile.isVerified ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Verified Doctor</span>
                            </>
                          ) : (
                            <span>Verification Pending</span>
                          )}
                        </span>

                        {!userProfile.isVerified && (
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const repo = getDatabaseProvider();
                                if (repo.verifyDoctor && user) {
                                  await repo.verifyDoctor(user.uid, true);
                                  await refreshProfile();
                                  setSyncMessage('Doctor account verified and activated successfully!');
                                  setTimeout(() => setSyncMessage(null), 3500);
                                }
                              } catch (e: any) {
                                setErrorMessage('Verification failed: ' + (e?.message || e));
                              }
                            }}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                            title="Click to activate doctor verification"
                          >
                            <span>Approve / Activate Now</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="font-black text-slate-800 flex items-center gap-1.5 text-xs">
                  <Smartphone className="w-4 h-4 text-rose-500" />
                  <span>Cross-Device Synchronization</span>
                </div>
                <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                  Your cycle logs, Rotterdam AI screenings, and health profiles are securely synced to Firestore and cached offline for seamless mobile usage.
                </p>
              </div>

              <button
                onClick={signOutUser}
                className="w-full py-3 rounded-2xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider cursor-pointer shadow-xs active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out / Switch Account</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 font-semibold leading-relaxed">
                Sign in with Google or Email to backup your menstrual cycle logs, Rotterdam AI risk scores, and wellness profiles securely to the cloud.
              </div>

              <button
                onClick={() => handleGoogleLogin(false)}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-rose-500/25 active:scale-95 transition-all text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>

              {isPopupBlocked && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-black text-amber-900">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Popup Blocked by Browser</span>
                  </div>
                  <p className="text-[11px] font-medium text-amber-800 leading-tight">
                    Your browser or preview window blocked the sign-in popup. Choose an alternative below:
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleGoogleLogin(true)}
                      className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Redirect Login
                    </button>
                    <button
                      onClick={openInNewTab}
                      className="px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer hover:bg-amber-100/50 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Full Tab
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-3 pt-3 text-left border-t border-slate-100 mt-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 text-center mb-1">
                  Or {isSignUp ? 'Create New Account' : 'Sign in with Email'}
                </div>

                {isSignUp && (
                  <div className="p-1 rounded-2xl bg-slate-100 grid grid-cols-2 gap-1 mb-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('patient')}
                      className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === 'patient'
                          ? 'bg-white text-rose-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('doctor')}
                      className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === 'doctor'
                          ? 'bg-white text-teal-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      Doctor / Specialist
                    </button>
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-rose-100 text-xs font-semibold outline-none bg-slate-50/50 focus:border-rose-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-rose-100 text-xs font-semibold outline-none bg-slate-50/50 focus:border-rose-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>

                {isSignUp && selectedRole === 'doctor' && (
                  <div className="space-y-2.5 p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100 mt-2">
                    <div className="text-[11px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-teal-600" />
                      Medical Credential Verification
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                        Specialization
                      </label>
                      <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl border border-teal-200 text-xs font-semibold bg-white outline-none focus:border-teal-500 text-slate-900"
                      >
                        <option value="Gynecologist">Gynecologist & Obstetrician</option>
                        <option value="Endocrinologist">Endocrinologist (Reproductive)</option>
                        <option value="Ayurvedic Practitioner">Ayurvedic Physician (BAMS/MD)</option>
                        <option value="General Physician">General Wellness Physician</option>
                      </select>
                    </div>

                    <div className="relative">
                      <FileCheck className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Medical License Number (e.g. MCI-123456)"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-teal-200 text-xs font-semibold outline-none bg-white focus:border-teal-500 text-slate-900 placeholder-slate-400"
                      />
                    </div>

                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Hospital / Clinic Name (Optional)"
                        value={hospitalClinic}
                        onChange={(e) => setHospitalClinic(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-teal-200 text-xs font-semibold outline-none bg-white focus:border-teal-500 text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <span>{isSignUp ? `Create ${selectedRole === 'doctor' ? 'Doctor' : 'Patient'} Account` : 'Sign In with Email'}</span>
                </button>
                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <span className="font-semibold text-slate-500">{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-black text-rose-600 hover:underline cursor-pointer"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
              </form>

              <button
                onClick={() => {
                  continueAsGuest();
                  onClose();
                }}
                className="w-full py-3 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mt-1 cursor-pointer"
              >
                Continue in Offline / Guest Mode
              </button>
            </div>
          )}
        </div>

        {/* Privacy & Encryption Assurance */}
        <div className="mt-5 pt-4 border-t border-rose-100/70 flex items-center justify-between text-slate-500 text-[11px] px-1">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-semibold">256-Bit Encrypted Health Storage</span>
          </div>
          <span className="font-bold text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Privacy Protected
          </span>
        </div>
      </div>
    </div>
  );
};
