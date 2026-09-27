import React, { useState } from 'react';
import { CycleStatus } from '../utils/cycleCalculations';
import { ThemeConfig, AppSettings, DayLog } from '../types';
import { GraphicalLogHub } from './GraphicalLogHub';
import {
  Droplets,
  Sparkles,
  Baby,
  Activity,
  Thermometer,
  Leaf,
  Shield,
  Flame,
  ChevronRight,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';

interface CategoryHubProps {
  status: CycleStatus;
  settings: AppSettings;
  theme: ThemeConfig;
  todayLog?: DayLog;
  onNavigateTab: (tab: 'home' | 'calendar' | 'charts' | 'pregnancy' | 'ayurveda' | 'perimenopause' | 'aichat' | 'babyai' | 'clinical') => void;
  onOpenLogModal: () => void;
}

type HubCategory = 'all' | 'cycle' | 'ai_diagnostics' | 'wellness';

export const CategoryHub: React.FC<CategoryHubProps> = ({
  status,
  settings,
  theme,
  todayLog,
  onNavigateTab,
  onOpenLogModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<HubCategory>('all');

  return (
    <div className="w-full max-w-md mx-auto space-y-5 font-['Nunito'] animate-fade-in pb-16">
      {/* 1. Segmented Filter Chips (Pill-shaped toggle chips with active glow) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black font-['Fredoka'] text-[#1A1A24]">
            Explore Services
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5376] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
            Aura Hub
          </span>
        </div>

        {/* Compact Segmented Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Services', icon: Compass },
            { id: 'cycle', label: 'Cycle & Fertility', icon: Droplets },
            { id: 'ai_diagnostics', label: 'AI & Diagnostics', icon: Sparkles },
            { id: 'wellness', label: 'Wellness & Dosha', icon: Leaf },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as HubCategory)}
                className={`px-3.5 py-2 rounded-full text-xs font-black font-['Fredoka'] flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF5376] to-[#FF758C] text-white border-[#FF5376] glow-pink scale-105'
                    : 'bg-white text-[#646478] border-[#EAECEF] hover:bg-slate-50 hover:text-[#1A1A24]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#FF5376]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Featured Layered Highlights Stack */}
      {(activeCategory === 'all' || activeCategory === 'ai_diagnostics') && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black font-['Fredoka'] tracking-wider text-[#646478] uppercase flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#FF5376]" />
              Featured Highlights
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
            {/* Slide 1 */}
            <div className="min-w-[280px] p-4.5 rounded-[28px] bg-gradient-to-r from-[#1A1A24] via-[#242038] to-[#1A1A24] text-white border border-[#EAECEF] shadow-xl flex items-center justify-between snap-center shrink-0 relative overflow-hidden group cursor-pointer">
              <div className="space-y-2 relative z-10 pr-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  Advanced Analytics
                </span>
                <div>
                  <h4 className="text-base font-black font-['Fredoka'] leading-tight">
                    Cycle Regularity Index
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    98% prediction accuracy based on historical logs
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl glass-circle-btn flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-amber-500" />
              </div>
            </div>

            {/* Slide 2 */}
            <div
              onClick={() => onNavigateTab('aichat')}
              className="min-w-[280px] p-4.5 rounded-[28px] bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border border-purple-500/30 shadow-xl flex items-center justify-between snap-center shrink-0 relative overflow-hidden group cursor-pointer"
            >
              <div className="space-y-2 relative z-10 pr-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/30 text-purple-200 border border-purple-400/30 shrink-0">
                  Gemini 2.5 AI
                </span>
                <div>
                  <h4 className="text-base font-black font-['Fredoka'] leading-tight">
                    Aura AI Expert Chat
                  </h4>
                  <p className="text-xs text-purple-200 mt-1">
                    Instant multi-turn cycle & health insights
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl glass-circle-btn flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Structured 2-Column Bento Grid ($2\times2$) */}
      {(activeCategory === 'all' || activeCategory === 'cycle') && (
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Period Tracker */}
          <button
            onClick={() => onNavigateTab('calendar')}
            className="p-4 rounded-[28px] bg-white border border-[#EAECEF] shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer group hover:scale-[1.02] min-h-[135px] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE3E9] flex items-center justify-center text-[#FF5376] shadow-xs shrink-0">
                <Droplets className="w-5 h-5 fill-[#FF5376]" />
              </div>
              <span className="text-[10px] font-bold text-[#FF5376] bg-[#FFE3E9] px-2 py-0.5 rounded-full shrink-0 border border-pink-200">
                {status.isPeriodToday ? 'Active' : `${status.daysUntilNextPeriod}d`}
              </span>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-black font-['Fredoka'] text-[#1A1A24] leading-snug truncate">
                Period Tracker
              </h4>
              <p className="text-[11px] text-[#646478] font-medium leading-tight line-clamp-2">
                Accurate flow & symptom logging
              </p>
            </div>
          </button>

          {/* Card 2: Ovulation Hub */}
          <button
            onClick={() => onNavigateTab('charts')}
            className="p-4 rounded-[28px] bg-white border border-[#EAECEF] shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer group hover:scale-[1.02] min-h-[135px] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-xs shrink-0">
                <Thermometer className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full shrink-0 border border-teal-200">
                {status.phase === 'ovulation' ? 'Peak Today' : 'Fertile'}
              </span>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-black font-['Fredoka'] text-[#1A1A24] leading-snug truncate">
                Ovulation Hub
              </h4>
              <p className="text-[11px] text-[#646478] font-medium leading-tight line-clamp-2">
                Peak fertility window analysis
              </p>
            </div>
          </button>
        </div>
      )}

      {/* 4. Full-width Bento Container Cards with Glass Action Triggers */}
      <div className="space-y-3">
        {/* Future Baby AI Generator */}
        {(activeCategory === 'all' || activeCategory === 'ai_diagnostics' || activeCategory === 'cycle') && (
          <button
            onClick={() => onNavigateTab('babyai')}
            className="w-full p-4 rounded-[28px] bg-gradient-to-r from-pink-50/80 via-white to-purple-50/80 border border-pink-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group hover:scale-[1.01]"
          >
            <div className="space-y-1 pr-3">
              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black bg-pink-100 text-pink-700 border border-pink-200 shrink-0">
                AI Photo Blend
              </span>
              <h4 className="text-base font-black font-['Fredoka'] text-[#1A1A24] leading-snug">
                Future Baby Generator
              </h4>
              <p className="text-xs text-[#646478] line-clamp-2">
                Generate baby face from Mom & Dad photos with ONNX genetics
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl glass-circle-btn flex items-center justify-center shrink-0">
              <Baby className="w-6 h-6 text-[#FF5376]" />
            </div>
          </button>
        )}

        {/* Pregnancy Mode */}
        {(activeCategory === 'all' || activeCategory === 'cycle') && (
          <button
            onClick={() => onNavigateTab('pregnancy')}
            className="w-full p-4 rounded-[28px] bg-white border border-[#EAECEF] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group hover:scale-[1.01]"
          >
            <div className="space-y-1 pr-3">
              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                Week-by-Week
              </span>
              <h4 className="text-base font-black font-['Fredoka'] text-[#1A1A24] leading-snug">
                Pregnancy Mode
              </h4>
              <p className="text-xs text-[#646478] line-clamp-2">
                Fetal size milestones, due date & kick counter
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl glass-circle-btn flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-amber-600" />
            </div>
          </button>
        )}

        {/* Clinical Diagnostics Hub */}
        {(activeCategory === 'all' || activeCategory === 'ai_diagnostics') && (
          <button
            onClick={() => onNavigateTab('clinical')}
            className="w-full p-4 rounded-[28px] bg-white border border-[#EAECEF] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group hover:scale-[1.01]"
          >
            <div className="space-y-1 pr-3">
              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                ML Diagnostic V3
              </span>
              <h4 className="text-base font-black font-['Fredoka'] text-[#1A1A24] leading-snug">
                Clinical Diagnostics Hub
              </h4>
              <p className="text-xs text-[#646478] line-clamp-2">
                PCOS risk screening, vision scan & symptom vectors
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl glass-circle-btn flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
          </button>
        )}

        {/* Ayurvedic Health */}
        {(activeCategory === 'all' || activeCategory === 'wellness') && (
          <div className="space-y-4">
            <button
              onClick={() => onNavigateTab('ayurveda')}
              className="w-full p-4 rounded-[28px] bg-white border border-[#EAECEF] shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group hover:scale-[1.01]"
            >
              <div className="space-y-1 pr-3">
                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black bg-orange-100 text-orange-800 border border-orange-200 shrink-0">
                  Dosha Diet & Herbs
                </span>
                <h4 className="text-base font-black font-['Fredoka'] text-[#1A1A24] leading-snug">
                  Ayurvedic Wellness
                </h4>
                <p className="text-xs text-[#646478] line-clamp-2">
                  Traditional remedies, yoga & herbal teas
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl glass-circle-btn flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6 text-orange-600" />
              </div>
            </button>

            {/* Graphical Self-Care & SOS Logs */}
            <div className="pt-2">
              <GraphicalLogHub
                onOpenLogModal={onOpenLogModal}
                onNavigateTab={(tab) => onNavigateTab(tab as any)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
