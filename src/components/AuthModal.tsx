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
        setErrorMessage('Browser blocked the sign-in popup. You can sign in using redirect or open the app in a new tab.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all border relative"
        style={{
          backgroundColor: theme.bgCard,
          borderColor: theme.borderCard,
          color: theme.textPrimary,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: theme.borderCard }}>
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${theme.accentPink}20`, color: theme.accentPink }}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">User Account & Database</h2>
              <p className="text-xs opacity-70">Cross-Platform Sync & Storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="mt-4 p-3 rounded-xl border flex items-center justify-between text-xs"
          style={{
            borderColor: theme.borderCard,
            backgroundColor: `${theme.accentGreen}12`,
          }}
        >
          <div className="flex items-center gap-2">
            {syncStatus === 'synced' ? (
              <Cloud className="w-4 h-4 text-emerald-600 animate-pulse" />
            ) : syncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            ) : syncStatus === 'offline' ? (
              <CloudOff className="w-4 h-4 text-amber-600" />
            ) : (
              <HardDrive className="w-4 h-4 text-purple-600" />
            )}
            <div>
              <div className="font-semibold capitalize">
                {syncStatus === 'synced'
                  ? 'Cloud Synced'
                  : syncStatus === 'syncing'
                  ? 'Syncing with Firestore...'
                  : syncStatus === 'offline'
                  ? 'Offline (Cached on device)'
                  : 'Local Storage (Guest Mode)'}
              </div>
              <div className="opacity-75 text-[11px]">Provider: {providerName}</div>
            </div>
          </div>

          {user && (
            <button
              onClick={handleManualSync}
              disabled={syncingNow}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 shadow-sm active:scale-95"
              style={{
                backgroundColor: theme.accentPink,
                color: '#fff',
              }}
            >
              <RefreshCw className={`w-3 h-3 ${syncingNow ? 'animate-spin' : ''}`} />
              {syncingNow ? 'Syncing...' : 'Sync Now'}
            </button>
          )}
        </div>

        {syncMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMessage}
          </div>
        )}

        {/* User Card or Login Form */}
        <div className="mt-5">
          {user ? (
            <div className="space-y-4">
              <div
                className="p-4 rounded-xl border flex items-center gap-3.5"
                style={{ borderColor: theme.borderCard }}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-12 h-12 rounded-full border shadow-sm object-cover"
                    style={{ borderColor: theme.accentPink }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-sm"
                    style={{ backgroundColor: theme.accentPink }}
                  >
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{user.displayName || 'Period Calendar User'}</h3>
                  <p className="text-xs opacity-70 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Google Authenticated</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border space-y-2 text-xs" style={{ borderColor: theme.borderCard }}>
                <div className="font-semibold flex items-center gap-1.5 opacity-90">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Cross-Device Compatibility</span>
                </div>
                <p className="opacity-75 text-[11px] leading-relaxed">
                  Your cycle logs, symptoms, and health tests are continuously synced to Firestore and cached offline so they run smoothly on your phone, web browser, and Android emulator.
                </p>
              </div>

              <button
                onClick={signOutUser}
                className="w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 transition-colors"
                style={{ borderColor: theme.borderCard }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out / Switch Account
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-xl bg-black/5 space-y-2">
                <p className="text-xs opacity-80 leading-relaxed">
                  Sign in with Google to backup your menstrual cycle logs, fertility predictions, and Ayurvedic profiles securely to the cloud.
                </p>
              </div>

              <button
                onClick={() => handleGoogleLogin(false)}
                disabled={loading}
                className="w-full py-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all text-white cursor-pointer"
                style={{ backgroundColor: theme.accentPink }}
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>

              {isPopupBlocked && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-left space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Popup Blocked by Browser</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-tight">
                    Your browser or preview window blocked the sign-in popup. Choose an alternative below:
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleGoogleLogin(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <LogIn className="w-3 h-3" />
                      Redirect Login
                    </button>
                    <button
                      onClick={openInNewTab}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold text-[11px] flex items-center justify-center gap-1 cursor-pointer hover:bg-amber-100/50 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Full Tab
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-3 pt-3 text-left border-t border-black/10 mt-3">
                <div className="text-xs font-semibold opacity-80 text-center">Or Sign in with Email / Password</div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border text-xs outline-none bg-black/5"
                  style={{ borderColor: theme.borderCard }}
                />
                <input
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2.5 rounded-xl border text-xs outline-none bg-black/5"
                  style={{ borderColor: theme.borderCard }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 text-white shadow-sm transition-all cursor-pointer"
                  style={{ backgroundColor: theme.accentPink }}
                >
                  {isSignUp ? 'Create Account & Sign In' : 'Sign In with Email'}
                </button>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="opacity-75">{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-bold underline cursor-pointer"
                    style={{ color: theme.accentPink }}
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
                className="w-full py-2 text-xs opacity-75 hover:opacity-100 transition-opacity font-medium mt-2"
              >
                Continue in Offline / Guest Mode
              </button>
            </div>
          )}
        </div>

        {/* Database Switcher (Easily Changeable Database Feature) */}
        <div className="mt-5 pt-4 border-t space-y-2" style={{ borderColor: theme.borderCard }}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold opacity-90 flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              <span>Database Backend</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-black/5 opacity-70">
              Easily Swappable
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => switchDatabase('firestore')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeProvider === 'firestore'
                  ? 'ring-2 font-medium shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                borderColor: activeProvider === 'firestore' ? theme.accentPink : theme.borderCard,
                backgroundColor: activeProvider === 'firestore' ? `${theme.accentPink}10` : 'transparent',
              }}
            >
              <div className="font-semibold text-[11px] flex items-center gap-1">
                <Cloud className="w-3 h-3 text-blue-500" />
                Firestore
              </div>
              <div className="text-[10px] opacity-70 mt-0.5">Cloud + Offline Cache</div>
            </button>

            <button
              onClick={() => switchDatabase('local')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeProvider === 'local'
                  ? 'ring-2 font-medium shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                borderColor: activeProvider === 'local' ? theme.accentPink : theme.borderCard,
                backgroundColor: activeProvider === 'local' ? `${theme.accentPink}10` : 'transparent',
              }}
            >
              <div className="font-semibold text-[11px] flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-purple-500" />
                LocalStorage
              </div>
              <div className="text-[10px] opacity-70 mt-0.5">On-device Only</div>
            </button>
          </div>
          <p className="text-[10px] opacity-60 leading-tight">
            The data layer uses an abstract Repository interface. You can switch to Firestore or LocalStorage anytime, or add SQLite/Postgres with zero frontend changes.
          </p>
        </div>
      </div>
    </div>
  );
};
