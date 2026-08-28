import React from 'react';
import { CycleStatus } from '../utils/cycleCalculations';
import { ThemeConfig, AppSettings, DayLog } from '../types';
import {
  ArrowRight,
  Heart,
  Droplets,
  Sparkles,
  Baby,
  Activity,
  BatteryCharging,
  Flame,
  Calendar,
} from 'lucide-react';

interface CategoryHubProps {
  status: CycleStatus;
  settings: AppSettings;
  theme: ThemeConfig;
  todayLog?: DayLog;
  onNavigateTab: (tab: 'home' | 'calendar' | 'charts' | 'pregnancy' | 'ayurveda' | 'perimenopause' | 'aichat' | 'babyai') => void;
  onOpenLogModal: () => void;
}

export const CategoryHub: React.FC<CategoryHubProps> = ({
  status,
  settings,
  theme,
  todayLog,
  onNavigateTab,
  onOpenLogModal,
}) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-4 font-['Nunito'] animate-in fade-in duration-200">
      {/* User Greeting matching Image 3 */}
      <div className="px-1 pt-1 space-y-0.5">
        <h2 className="text-xl font-black font-['Fredoka'] text-[#2D1B2D] flex items-center gap-1.5">
          Hello, Aisha <span className="animate-pulse">👋</span>
        </h2>
        <p className="text-xs font-semibold text-[#875C66]">
          Take charge of your cycle and your well-being.
        </p>
      </div>

      {/* 5 Sleek Category Feature Cards matching Image 3 */}
      <div className="space-y-3">
        {/* 1. Period Card */}
        <button
          onClick={() => onNavigateTab('calendar')}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#FFE7EC] to-[#FFF0F3] border border-[#FFCDD6] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="space-y-1">
            <h3 className="text-base font-black font-['Fredoka'] text-[#2D1B2D]">
              Period
            </h3>
            <p className="text-xs font-semibold text-[#875C66]">
              Track your period and symptoms
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-bold text-[#E91E63] bg-white/80 px-2 py-0.5 rounded-full border border-rose-200">
                {status.isPeriodToday ? `Day ${status.currentCycleDay} Active` : `In ${status.daysUntilNextPeriod} Days`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Droplets Illustration */}
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center text-2xl shadow-xs">
              <span className="text-3xl">🩸</span>
            </div>
            {/* Round Arrow Button */}
            <div className="w-9 h-9 rounded-full bg-[#FF758C]/20 group-hover:bg-[#FF758C] text-[#FF5376] group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* 2. Ovulation Card */}
        <button
          onClick={() => onNavigateTab('charts')}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#E0F7FA] to-[#E8F8F5] border border-[#B2EBF2] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="space-y-1">
            <h3 className="text-base font-black font-['Fredoka'] text-[#2D1B2D]">
              Ovulation
            </h3>
            <p className="text-xs font-semibold text-[#875C66]">
              Predict ovulation and fertile window
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-bold text-[#00838F] bg-white/80 px-2 py-0.5 rounded-full border border-teal-200">
                {status.phase === 'ovulation' ? 'Peak Fertile Today 🌟' : `Fertile Window in ${status.daysUntilOvulation}d`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center text-2xl shadow-xs">
              <span className="text-3xl">🌡️</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#00ACC1]/20 group-hover:bg-[#00ACC1] text-[#00838F] group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* 3. Pregnancy Card */}
        <button
          onClick={() => onNavigateTab('pregnancy')}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#FFF3E0] to-[#FFF8E1] border border-[#FFE0B2] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="space-y-1">
            <h3 className="text-base font-black font-['Fredoka'] text-[#2D1B2D]">
              Pregnancy & Baby AI
            </h3>
            <p className="text-xs font-semibold text-[#875C66]">
              Track pregnancy & future baby traits
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-bold text-[#E65100] bg-white/80 px-2 py-0.5 rounded-full border border-orange-200">
                Baby Generator & Kick Tracker
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center text-2xl shadow-xs">
              <span className="text-3xl">👶</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#FB8C00]/20 group-hover:bg-[#FB8C00] text-[#E65100] group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* 4. Peri-menopause Card */}
        <button
          onClick={() => onNavigateTab('perimenopause')}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#F3E5F5] to-[#EDE7F6] border border-[#E1BEE7] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="space-y-1">
            <h3 className="text-base font-black font-['Fredoka'] text-[#2D1B2D]">
              Peri-menopause
            </h3>
            <p className="text-xs font-semibold text-[#875C66]">
              Understand changes and manage better
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-bold text-[#7B1FA2] bg-white/80 px-2 py-0.5 rounded-full border border-purple-200">
                Hot Flashes, Sleep & Hormone Sync
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center text-2xl shadow-xs">
              <span className="text-3xl">🧘‍♀️</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#8E24AA]/20 group-hover:bg-[#8E24AA] text-[#7B1FA2] group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* 5. Gemini AI Health Companion & Specialist Chat */}
        <button
          onClick={() => onNavigateTab('aichat')}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#FFF0F5] via-[#F8E8FF] to-[#EDE7F6] border-2 border-pink-300 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[9px] font-black px-3 py-0.5 rounded-bl-xl uppercase tracking-wider shadow-xs">
            ✨ Powered by Gemini
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black font-['Fredoka'] text-[#2D1B2D] flex items-center gap-1.5">
              Aura AI Health Chat
            </h3>
            <p className="text-xs font-semibold text-[#875C66]">
              Multi-turn cycle, fertility & Ayurveda advice
            </p>
            <div className="pt-1 flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-purple-700 bg-white/90 px-2 py-0.5 rounded-full border border-purple-200">
                5 AI Specialists Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center text-2xl shadow-xs border border-pink-100">
              <span className="text-3xl">💬</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-purple-500/20 group-hover:bg-purple-600 text-purple-700 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* 5. Symptoms & Quick Diary Card */}
        <button
          onClick={onOpenLogModal}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#E3F2FD] to-[#E8EAF6] border border-[#BBDEFB] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="space-y-1">
            <h3 className="text-base font-black font-['Fredoka'] text-[#2D1B2D]">
              Symptoms
            </h3>
            <p className="text-xs font-semibold text-[#875C66]">
              Log and monitor your daily symptoms
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-bold text-[#1565C0] bg-white/80 px-2 py-0.5 rounded-full border border-blue-200">
                {todayLog?.symptoms?.length ? `${todayLog.symptoms.length} Logged Today` : '+ Quick Daily Check-in'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center text-2xl shadow-xs">
              <span className="text-3xl">🔋</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1E88E5]/20 group-hover:bg-[#1E88E5] text-[#1565C0] group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>

      {/* Quote Banner matching Image 3 */}
      <div className="p-4 rounded-3xl bg-white border border-pink-100 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-xl shrink-0">
          <Heart className="w-5 h-5 text-[#E91E63] fill-[#E91E63]" />
        </div>
        <p className="text-xs font-bold text-[#4A2E35] leading-snug">
          Every body is unique. <span className="text-[#FF5376] block">Every cycle matters.</span>
        </p>
      </div>
    </div>
  );
};
