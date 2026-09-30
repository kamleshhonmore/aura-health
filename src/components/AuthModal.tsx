import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeConfig, DayLog, CycleRecord } from '../types';
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
  } = useAuth();

  const [syncingNow, setSyncingNow] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(emailInput, passwordInput);
        setSyncMessage('Account created and logged in successfully!');
      } else {
        await signInWithEmail(emailInput, passwordInput);
        setSyncMessage('Logged in successfully with email!');
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-fadeIn font-['Nunito'] text-slate-900">
      <div className="w-full max-w-md bg-white rounded-[32px] p-6 shadow-2xl border border-rose-100 relative overflow-hidden flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black font-['Fredoka'] tracking-tight">User Account & Database</h2>
              <p className="text-[11px] font-semibold text-slate-500">Cross-Platform Sync & Storage</p>
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
                  ? 'Cloud Synced'
                  : syncStatus === 'syncing'
                  ? 'Syncing with Firestore...'
                  : syncStatus === 'offline'
                  ? 'Offline (Cached on device)'
                  : 'Local Storage (Guest Mode)'}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Provider: {providerName}</div>
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
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 font-black uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Google Authenticated</span>
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
                  Or Sign in with Email & Password
                </div>
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <span>{isSignUp ? 'Create Account & Sign In' : 'Sign In with Email'}</span>
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

        {/* Database Switcher */}
        <div className="mt-5 pt-4 border-t border-rose-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-black text-slate-800 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-rose-500" />
              <span>Database Backend</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Easily Swappable
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <button
              onClick={() => switchDatabase('firestore')}
              className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                activeProvider === 'firestore'
                  ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-black text-xs flex items-center gap-1.5 mb-0.5">
                <Cloud className="w-4 h-4 text-blue-500" />
                Firestore
              </div>
              <div className="text-[10px] font-semibold text-slate-500">Cloud + Offline Cache</div>
            </button>

            <button
              onClick={() => switchDatabase('local')}
              className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                activeProvider === 'local'
                  ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-black text-xs flex items-center gap-1.5 mb-0.5">
                <HardDrive className="w-4 h-4 text-purple-500" />
                LocalStorage
              </div>
              <div className="text-[10px] font-semibold text-slate-500">On-device Only</div>
            </button>
          </div>
          <p className="text-[10px] font-medium text-slate-400 leading-tight px-1 pt-1">
            Abstract Repository pattern. Switch anytime to Firestore or LocalStorage.
          </p>
        </div>
      </div>
    </div>
  );
};
