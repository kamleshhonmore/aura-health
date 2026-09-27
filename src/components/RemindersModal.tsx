import React, { useState } from 'react';
import { AppSettings, ThemeConfig } from '../types';
import { Bell, Clock, X, Check, Droplets, Pill, Calendar } from 'lucide-react';
import { NotificationManager } from '../utils/notificationManager';

interface RemindersModalProps {
  isOpen: boolean;
  settings: AppSettings;
  theme: ThemeConfig;
  onSaveSettings: (updated: Partial<AppSettings>) => void;
  onClose: () => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  isOpen,
  settings,
  theme,
  onSaveSettings,
  onClose,
}) => {
  const [remindPeriod, setRemindPeriod] = useState(settings.remindPeriodEnabled);
  const [daysBefore, setDaysBefore] = useState(settings.remindPeriodDaysBefore);
  const [remindOvulation, setRemindOvulation] = useState(settings.remindOvulationEnabled);
  const [remindPill, setRemindPill] = useState(settings.remindPillEnabled);
  const [pillTime, setPillTime] = useState(settings.remindPillTime || '21:00');
  const [remindWater, setRemindWater] = useState(settings.remindWaterEnabled);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedSettings = {
      remindPeriodEnabled: remindPeriod,
      remindPeriodDaysBefore: daysBefore,
      remindOvulationEnabled: remindOvulation,
      remindPillEnabled: remindPill,
      remindPillTime: pillTime,
      remindWaterEnabled: remindWater,
    };
    onSaveSettings(updatedSettings);
    NotificationManager.scheduleReminders(updatedSettings);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h3 className="text-base font-black font-['Fredoka']">Reminders & Alarms</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
          {/* Period Reminder */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-pink-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🩸</span>
                <div>
                  <h4 className="font-black font-['Fredoka'] text-xs text-[#4A2E35]">
                    Period Coming Alert
                  </h4>
                  <p className="text-[10px] text-[#875C66]">Notification before your next cycle</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={remindPeriod}
                onChange={(e) => setRemindPeriod(e.target.checked)}
                className="w-5 h-5 accent-[#FF6B8B] cursor-pointer"
              />
            </div>

            {remindPeriod && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-pink-100/60">
                <span className="text-[11px] font-semibold text-[#875C66]">Remind me:</span>
                <select
                  value={daysBefore}
                  onChange={(e) => setDaysBefore(Number(e.target.value))}
                  className="px-2 py-1 rounded-xl bg-white border border-pink-200 font-bold text-xs text-[#4A2E35]"
                >
                  <option value={1}>1 day before</option>
                  <option value={2}>2 days before</option>
                  <option value={3}>3 days before</option>
                  <option value={5}>5 days before</option>
                </select>
              </div>
            )}
          </div>

          {/* Ovulation & Fertile Reminder */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-pink-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌸</span>
              <div>
                <h4 className="font-black font-['Fredoka'] text-xs text-[#4A2E35]">
                  Fertile & Ovulation Alert
                </h4>
                <p className="text-[10px] text-[#875C66]">Notify when fertile window begins</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={remindOvulation}
              onChange={(e) => setRemindOvulation(e.target.checked)}
              className="w-5 h-5 accent-[#81C784] cursor-pointer"
            />
          </div>

          {/* Pill Reminder */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-pink-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">💊</span>
                <div>
                  <h4 className="font-black font-['Fredoka'] text-xs text-[#4A2E35]">
                    Contraceptive & Vitamin Pill
                  </h4>
                  <p className="text-[10px] text-[#875C66]">Daily pill reminder alarm</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={remindPill}
                onChange={(e) => setRemindPill(e.target.checked)}
                className="w-5 h-5 accent-[#AB47BC] cursor-pointer"
              />
            </div>

            {remindPill && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-pink-100/60">
                <span className="text-[11px] font-semibold text-[#875C66]">Alarm Time:</span>
                <input
                  type="time"
                  value={pillTime}
                  onChange={(e) => setPillTime(e.target.value)}
                  className="px-2 py-1 rounded-xl bg-white border border-pink-200 font-bold text-xs text-[#4A2E35]"
                />
              </div>
            )}
          </div>

          {/* Water Reminder */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-pink-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💧</span>
              <div>
                <h4 className="font-black font-['Fredoka'] text-xs text-[#4A2E35]">
                  Drink Water Reminder
                </h4>
                <p className="text-[10px] text-[#875C66]">Every 2 hours during daytime</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={remindWater}
              onChange={(e) => setRemindWater(e.target.checked)}
              className="w-5 h-5 accent-[#0288D1] cursor-pointer"
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-pink-100 flex items-center justify-between">
          {savedToast ? (
            <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
              <Check className="w-4 h-4 stroke-[3]" /> Saved!
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
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
              Save Alarms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
