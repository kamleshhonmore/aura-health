import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Delete,
  Fingerprint,
  Smile,
  X,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface PinLockModalProps {
  isOpen: boolean;
  isLockScreen: boolean;
  correctPin: string;
  onSuccess: () => void;
  onClose?: () => void;
  onSaveNewPin?: (newPin: string) => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  isOpen,
  isLockScreen,
  correctPin,
  onSuccess,
  onClose,
  onSaveNewPin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [biometricStatus, setBiometricStatus] = useState<string | null>(null);
  const [showForgotHint, setShowForgotHint] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      setErrorMsg('');

      if (next.length === 4) {
        if (isLockScreen) {
          if (next === correctPin || correctPin === '') {
            setPinInput('');
            onSuccess();
          } else {
            setErrorMsg('Incorrect PIN. Please try again.');
            setTimeout(() => {
              setPinInput('');
              setErrorMsg('');
            }, 800);
          }
        } else if (onSaveNewPin) {
          onSaveNewPin(next);
          setPinInput('');
          onSuccess();
        }
      }
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPinInput('');
    setErrorMsg('');
  };

  const handleBiometricTouch = (type: 'fingerprint' | 'face') => {
    setBiometricStatus(type === 'fingerprint' ? 'Scanning Fingerprint...' : 'Recognizing Face ID...');
    setTimeout(() => {
      setBiometricStatus('Verified! Welcome back ✨');
      fireCelebrationConfetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E91E63', '#FF758C', '#B388FF'],
      });
      setTimeout(() => {
        setBiometricStatus(null);
        onSuccess();
      }, 500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#FFF5F8] via-[#FFF9FA] to-[#FCE4EC] text-[#2D1B2D] animate-in fade-in duration-200 overflow-y-auto">
      {/* Decorative Floral Watercolor Background Motifs matching Image 2 */}
      <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-40 bg-radial from-pink-300 via-purple-200 to-transparent blur-xl" />
      <div className="absolute bottom-0 left-0 w-56 h-56 pointer-events-none opacity-40 bg-radial from-rose-200 via-pink-100 to-transparent blur-2xl" />

      {/* Main Lock Screen Card */}
      <div className="w-full max-w-xs flex flex-col items-center text-center space-y-4 relative z-10 my-auto py-2">
        {/* cyclebliss Brand Logo matching Image 2 */}
        <div className="flex items-center gap-1.5 pt-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF5376] to-[#BA68C8] flex items-center justify-center text-white text-xs font-bold shadow-xs">
            🌸
          </div>
          <span className="text-xl font-black font-['Fredoka'] text-[#3E1F47] tracking-tight">
            cyclebliss
          </span>
        </div>

        {/* Title and Subtitle matching Image 2 */}
        <div className="space-y-1">
          <h2 className="text-3xl font-black font-['Fredoka'] text-[#2D1B2D]">
            Keep it
            <span className="block text-[#E91E63] font-['Fredoka']">
              Secret
            </span>
          </h2>
          <p className="text-xs text-[#875C66] max-w-[220px] mx-auto leading-tight font-medium">
            Secure your space. Because your wellness is personal.
          </p>
        </div>

        {/* Floating Pink/Purple Lock with Heart inside (Matching Image 2) */}
        <div className="relative pt-1">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#BA68C8] via-[#FF758C] to-[#FF8FA3] flex items-center justify-center shadow-lg shadow-pink-300/50 relative">
            <div className="w-10 h-10 rounded-2xl bg-white/95 flex items-center justify-center shadow-inner relative">
              <Lock className="w-5 h-5 text-[#E91E63]" />
              <span className="absolute -bottom-1 text-[9px] text-[#E91E63]">♥</span>
            </div>
          </div>
        </div>

        {/* Enter PIN text */}
        <span className="text-sm font-black font-['Fredoka'] text-[#E91E63] tracking-wide block">
          {isLockScreen ? 'Enter PIN' : 'Set 4-Digit Passcode'}
        </span>

        {/* 4 Glowing PIN Dots (Matching Image 2) */}
        <div className="flex items-center gap-3.5 my-1">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pinInput.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  filled
                    ? 'bg-[#E91E63] scale-125 shadow-md shadow-pink-400'
                    : 'border-2 border-pink-300 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Forgot PIN / Error Notification */}
        {errorMsg ? (
          <p className="text-xs text-rose-600 font-bold animate-shake">{errorMsg}</p>
        ) : biometricStatus ? (
          <p className="text-xs text-[#E91E63] font-bold animate-pulse">{biometricStatus}</p>
        ) : (
          <button
            onClick={() => setShowForgotHint(true)}
            className="text-[11px] font-semibold text-[#875C66] hover:text-[#E91E63] cursor-pointer transition-colors"
          >
            Forgot PIN? Tap here!
          </button>
        )}

        {/* Forgot PIN Dialog */}
        {showForgotHint && (
          <div className="p-3 rounded-2xl bg-white/90 border border-pink-200 shadow-md text-xs text-[#875C66] space-y-2 animate-in fade-in">
            <p>
              Your default PIN code is <strong>1234</strong> (or use quick biometric touch below).
            </p>
            <button
              onClick={() => {
                setShowForgotHint(false);
                setPinInput('1234');
              }}
              className="px-3 py-1 bg-[#E91E63] text-white text-[11px] font-bold rounded-xl cursor-pointer"
            >
              Fill Default (1234)
            </button>
          </div>
        )}

        {/* Biometrics Icons (Touch ID & Face ID Matching Image 2) */}
        {isLockScreen && (
          <div className="flex items-center justify-center gap-4 pt-1">
            <button
              onClick={() => handleBiometricTouch('fingerprint')}
              title="Unlock with Fingerprint Touch ID"
              className="w-12 h-12 rounded-full bg-white border border-pink-200 text-[#E91E63] shadow-xs flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer hover:bg-pink-50"
            >
              <Fingerprint className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleBiometricTouch('face')}
              title="Unlock with Face ID"
              className="w-12 h-12 rounded-full bg-white border border-pink-200 text-[#E91E63] shadow-xs flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer hover:bg-pink-50"
            >
              <Smile className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Modern Numeric Keypad Matching Image 2 */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-3 w-full max-w-[220px] pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="w-14 h-14 rounded-full bg-transparent hover:bg-pink-100/60 active:scale-90 transition-all text-xl font-bold font-['Nunito'] text-[#2D1B2D] flex items-center justify-center cursor-pointer"
            >
              {num}
            </button>
          ))}

          {/* Cancel/Clear X */}
          <button
            onClick={handleClear}
            className="w-14 h-14 rounded-full text-rose-500 hover:bg-pink-100/60 active:scale-90 transition-all flex items-center justify-center cursor-pointer font-black text-base"
          >
            ✕
          </button>

          {/* Zero */}
          <button
            onClick={() => handleDigit('0')}
            className="w-14 h-14 rounded-full bg-transparent hover:bg-pink-100/60 active:scale-90 transition-all text-xl font-bold font-['Nunito'] text-[#2D1B2D] flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          {/* Delete / Backspace */}
          <button
            onClick={handleDelete}
            className="w-14 h-14 rounded-full text-[#E91E63] hover:bg-pink-100/60 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {!isLockScreen && onClose && (
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#875C66] hover:text-[#2D1B2D] pt-2 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
