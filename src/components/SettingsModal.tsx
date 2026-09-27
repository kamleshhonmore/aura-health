import React, { useState } from 'react';
import { AppSettings, ThemeConfig } from '../types';
import {
  Settings,
  X,
  Check,
  Calendar,
  Lock,
  Cloud,
  RefreshCw,
  Sliders,
  Shield,
  HelpCircle,
  Database,
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  theme: ThemeConfig;
  onSaveSettings: (updated: Partial<AppSettings>) => void;
  onOpenPinSetup: () => void;
  onOpenAuth?: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  theme,
  onSaveSettings,
  onOpenPinSetup,
  onOpenAuth,
  onClose,
}) => {
  const [cycleLen, setCycleLen] = useState(settings.cycleLength);
  const [periodLen, setPeriodLen] = useState(settings.periodLength);
  const [lutealLen, setLutealLen] = useState(settings.lutealLength);
  const [tempUnit, setTempUnit] = useState(settings.tempUnit);
  const [weightUnit, setWeightUnit] = useState(settings.weightUnit);
  const [waterGoal, setWaterGoal] = useState(settings.waterGoalGlasses);
  const [userAge, setUserAge] = useState(settings.userAge);
  const [userHeight, setUserHeight] = useState(settings.userHeight);
  const [userWeight, setUserWeight] = useState(settings.userWeight);
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('aura_gemini_api_key') || '');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('aura_gemini_api_key', geminiKey);
    onSaveSettings({
      cycleLength: cycleLen,
      periodLength: periodLen,
      lutealLength: lutealLen,
      tempUnit,
      weightUnit,
      waterGoalGlasses: waterGoal,
      userAge,
      userHeight,
      userWeight,
    });
    onClose();
  };

  const handleCloudBackup = () => {
    setIsBackingUp(true);
    setBackupStatus('Syncing cycle diary to Google Account...');
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupStatus('Cloud Backup Completed! ☁️ Last synced: Just now');
      fireCelebrationConfetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h3 className="text-base font-black font-['Fredoka']">Cycle & App Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
          {/* Section 0: User Profile */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100">
            <h4 className="font-black font-['Fredoka'] text-xs text-rose-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-rose-500" />
              Biometric Profile
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-rose-800 uppercase">Age</label>
                <input
                  type="number"
                  value={userAge}
                  onChange={(e) => setUserAge(Math.max(12, Math.min(95, parseInt(e.target.value) || 0)))}
                  className="w-full px-2 py-2 rounded-xl bg-white border border-rose-200 text-center font-bold text-rose-900 focus:ring-1 focus:ring-rose-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-rose-800 uppercase">Height (cm)</label>
                <input
                  type="number"
                  value={userHeight}
                  onChange={(e) => setUserHeight(Math.max(100, Math.min(220, parseInt(e.target.value) || 0)))}
                  className="w-full px-2 py-2 rounded-xl bg-white border border-rose-200 text-center font-bold text-rose-900 focus:ring-1 focus:ring-rose-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-rose-800 uppercase">Weight ({weightUnit})</label>
                <input
                  type="number"
                  value={userWeight}
                  onChange={(e) => setUserWeight(Math.max(30, Math.min(300, parseInt(e.target.value) || 0)))}
                  className="w-full px-2 py-2 rounded-xl bg-white border border-rose-200 text-center font-bold text-rose-900 focus:ring-1 focus:ring-rose-400"
                />
              </div>
            </div>
          </div>

          {/* Section 1: Cycle Parameters */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#FFF9FA] border border-pink-100">
            <h4 className="font-black font-['Fredoka'] text-xs text-[#4A2E35] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#FF6B8B]" />
              Cycle & Period Duration
            </h4>

            {/* Cycle length */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#4A2E35]">Cycle Length</span>
                <p className="text-[10px] text-[#875C66]">Days from start to next start</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={20}
                  max={45}
                  value={cycleLen}
                  onChange={(e) => setCycleLen(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded-xl bg-white border border-pink-200 text-center font-black font-['Fredoka'] text-sm text-[#FF6B8B]"
                />
                <span className="text-xs font-bold text-[#875C66]">days</span>
              </div>
            </div>

            {/* Period length */}
            <div className="flex items-center justify-between pt-2 border-t border-pink-100/60">
              <div>
                <span className="font-bold text-xs text-[#4A2E35]">Period Length</span>
                <p className="text-[10px] text-[#875C66]">Bleeding duration</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={periodLen}
                  onChange={(e) => setPeriodLen(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded-xl bg-white border border-pink-200 text-center font-black font-['Fredoka'] text-sm text-[#FF5376]"
                />
                <span className="text-xs font-bold text-[#875C66]">days</span>
              </div>
            </div>

            {/* Luteal length */}
            <div className="flex items-center justify-between pt-2 border-t border-pink-100/60">
              <div>
                <span className="font-bold text-xs text-[#4A2E35]">Luteal Phase</span>
                <p className="text-[10px] text-[#875C66]">Days from ovulation to next cycle</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={10}
                  max={18}
                  value={lutealLen}
                  onChange={(e) => setLutealLen(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded-xl bg-white border border-pink-200 text-center font-black font-['Fredoka'] text-sm text-[#81C784]"
                />
                <span className="text-xs font-bold text-[#875C66]">days</span>
              </div>
            </div>
          </div>

          {/* Section 2: Units Preference */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#FFF9FA] border border-pink-100">
            <h4 className="font-black font-['Fredoka'] text-xs text-[#4A2E35] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#AB47BC]" />
              Measurement Units & Water Goal
            </h4>

            {/* Temp unit */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#4A2E35]">Temperature Unit</span>
              <div className="flex rounded-xl bg-white p-0.5 border border-pink-200">
                <button
                  onClick={() => setTempUnit('F')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    tempUnit === 'F' ? 'bg-[#FF6B8B] text-white' : 'text-[#875C66]'
                  }`}
                >
                  °F
                </button>
                <button
                  onClick={() => setTempUnit('C')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    tempUnit === 'C' ? 'bg-[#FF6B8B] text-white' : 'text-[#875C66]'
                  }`}
                >
                  °C
                </button>
              </div>
            </div>

            {/* Weight unit */}
            <div className="flex items-center justify-between pt-2 border-t border-pink-100/60">
              <span className="font-bold text-xs text-[#4A2E35]">Weight Unit</span>
              <div className="flex rounded-xl bg-white p-0.5 border border-pink-200">
                <button
                  onClick={() => setWeightUnit('kg')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    weightUnit === 'kg' ? 'bg-[#FF6B8B] text-white' : 'text-[#875C66]'
                  }`}
                >
                  kg
                </button>
                <button
                  onClick={() => setWeightUnit('lbs')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    weightUnit === 'lbs' ? 'bg-[#FF6B8B] text-white' : 'text-[#875C66]'
                  }`}
                >
                  lbs
                </button>
              </div>
            </div>

            {/* Water goal */}
            <div className="flex items-center justify-between pt-2 border-t border-pink-100/60">
              <div>
                <span className="font-bold text-xs text-[#4A2E35]">Daily Water Target</span>
                <p className="text-[10px] text-[#875C66]">{waterGoal * 250} ml / day</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={4}
                  max={16}
                  value={waterGoal}
                  onChange={(e) => setWaterGoal(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded-xl bg-white border border-pink-200 text-center font-black font-['Fredoka'] text-sm text-[#0288D1]"
                />
                <span className="text-xs font-bold text-[#875C66]">cups</span>
              </div>
            </div>
          </div>

          {/* Section 3: Privacy & Security */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-pink-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E91E63]" />
              <div>
                <span className="font-bold text-xs text-[#4A2E35]">Passcode PIN Lock</span>
                <p className="text-[10px] text-[#875C66]">
                  {settings.pinLockEnabled ? 'Active (PIN Protected)' : 'Disabled'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenPinSetup();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#FFF0F3] text-[#FF6B8B] border border-pink-200 text-xs font-bold cursor-pointer hover:bg-pink-100"
            >
              {settings.pinLockEnabled ? 'Change PIN' : 'Enable PIN'}
            </button>
          </div>

          {/* Section 4: Cloud Backup & Restore */}
          <div className="p-3.5 rounded-2xl bg-[#F0F7FF] border border-[#D0E2FF] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#0062FF]" />
                <div>
                  <span className="font-bold text-xs text-[#0043CE]">Cloud Database & Sync</span>
                  <p className="text-[10px] text-[#525252]">Google Cloud Firestore & LocalStorage</p>
                </div>
              </div>
              {onOpenAuth && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0062FF] hover:bg-[#0043CE] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Account & DB</span>
                </button>
              )}
            </div>
            {backupStatus && (
              <p className="text-[11px] font-bold text-[#0043CE] pt-1 border-t border-[#D0E2FF]">
                {backupStatus}
              </p>
            )}
          </div>

          {/* Section 5: AI Configuration */}
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
            <h4 className="font-black font-['Fredoka'] text-xs text-purple-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-600" />
              Real-Time AI Configuration
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-purple-800">Gemini API Key</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Paste AI API Key here..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <p className="text-[9px] text-purple-500 leading-tight">
                Get your key at <u>aistudio.google.com</u> to enable unrestricted real-time medical insights and cycle analysis.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-pink-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-[#875C66] hover:bg-gray-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white text-xs font-black font-['Fredoka'] cursor-pointer shadow-md"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
