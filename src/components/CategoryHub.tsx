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
  Calendar,
  Thermometer,
  MessageCircle,
  Leaf,
  Zap,
} from 'lucide-react';

interface CategoryHubProps {
  status: CycleStatus;
  settings: AppSettings;
  theme: ThemeConfig;
  todayLog?: DayLog;
  onNavigateTab: (tab: 'home' | 'calendar' | 'charts' | 'pregnancy' | 'ayurveda' | 'perimenopause' | 'aichat' | 'babyai' | 'clinical') => void;
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
      {/* User Greeting */}
      <div className="px-1 pt-1 space-y-0.5">
        <h2 className="text-xl font-black font-['Fredoka'] text-[#2D1B2D] flex items-center gap-1.5">
          Hello, Aisha <span className="text-xl">👋</span>
        </h2>
        <p className="text-xs font-semibold text-[#875C66]">
          Take charge of your cycle and your well-being.
        </p>
      </div>

      {/* Feature Cards */}
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
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-xs">
              <Droplets className="w-8 h-8 text-[#FF5376] fill-[#FF5376]" />
            </div>
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
                {status.phase === 'ovulation' ? 'Peak Fertile Today ✨' : `Fertile Window in ${status.daysUntilOvulation}d`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-xs">
              <Thermometer className="w-8 h-8 text-[#00ACC1]" />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#00ACC1]/20 group-hover:bg-[#00ACC1] text-[#00838F] group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* 3. Future Baby AI Generator */}
        <button
          onClick={() => onNavigateTab('babyai')}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#FFF0F5] via-[#FCE4EC] to-[#F3E5F5] border-2 border-pink-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 via-pink-500 to-rose-400 text-white text-[9px] font-black px-3 py-0.5 rounded-bl-xl uppercase tracking-wider shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> AI Photo Blend
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black font-['Fredoka'] text-[#2D1B2D] flex items-center gap-1.5">
              Future Baby Generator
            </h3>
            <p className="text-xs font-semibold text-[#875C66]">
              Generate baby face from Mom & Dad photos
            </p>
            <div className="pt-1 flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#D81B60] bg-white/90 px-2 py-0.5 rounded-full border border-pink-200">
                Photo Upload • Eye/Hair Genetics
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-xs border border-pink-100">
              <Baby className="w-8 h-8 text-[#EC407A]" />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#EC407A]/20 group-hover:bg-[#EC407A] text-[#D81B60] group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* 4. Pregnancy Mode */}
        <button
          onClick={() => onNavigateTab('pregnancy')}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#FFF3E0] to-[#FFF8E1] border border-[#FFE0B2] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="space-y-1">
            <h3 className="text-base font-black font-['Fredoka'] text-[#2D1B2D]">
              Pregnancy Mode
            </h3>
            <p className="text-xs font-semibold text-[#875C66]">
              Week-by-week size, due date & kick counter
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-bold text-[#E65100] bg-white/80 px-2 py-0.5 rounded-full border border-orange-200">
                Fetal Milestones & Kick Counter
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-xs">
              <Activity className="w-8 h-8 text-[#FB8C00]" />
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
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-xs text-purple-600">
              <Zap className="w-8 h-8" />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#8E24AA]/20 group-hover:bg-[#8E24AA] text-[#7B1FA2] group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* 5. Aura AI Chat */}
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
            <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-xs border border-pink-100">
              <MessageCircle className="w-8 h-8 text-purple-500" />
            </div>
            <div className="w-9 h-9 rounded-full bg-purple-500/20 group-hover:bg-purple-600 text-purple-700 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Clinical Diagnostics Hub */}
        <button
          onClick={() => onNavigateTab('clinical')}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#E8F5E9] to-[#E0F2F1] border border-[#A5D6A7] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="space-y-1">
            <h3 className="text-base font-black font-['Fredoka'] text-[#2D1B2D]">
              Clinical AI Engine
            </h3>
            <p className="text-xs font-semibold text-[#875C66]">
              Risk screening, optical analysis & metrics
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-bold text-[#2E7D32] bg-white/80 px-2 py-0.5 rounded-full border border-green-200">
                ML Diagnostic V3 Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-xs text-emerald-600">
              <Activity className="w-8 h-8" />
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 text-emerald-700 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Ayurvedic Hub */}
        <button
          onClick={() => onNavigateTab('ayurveda')}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#FFF3E0] to-[#FBE9E7] border border-[#FFCC80] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="space-y-1">
            <h3 className="text-base font-black font-['Fredoka'] text-[#2D1B2D]">
              Ayurvedic Health
            </h3>
            <p className="text-xs font-semibold text-[#875C66]">
              Dosha-based diet & lifestyle
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-bold text-[#E65100] bg-white/80 px-2 py-0.5 rounded-full border border-orange-200">
                Herbal remedies & routines
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-xs">
              <Leaf className="w-8 h-8 text-[#FB8C00]" />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#FB8C00]/20 group-hover:bg-[#FB8C00] text-[#E65100] group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>

      {/* Quote Banner */}
      <div className="p-4 rounded-3xl bg-white border border-pink-100 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 text-[#E91E63] fill-[#E91E63]" />
        </div>
        <p className="text-xs font-bold text-[#4A2E35] leading-snug">
          Every body is unique. <span className="text-[#FF5376] block">Every cycle matters.</span>
        </p>
      </div>
    </div>
  );
};
