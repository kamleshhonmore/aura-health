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
  Compass,
  HeartHandshake,
} from 'lucide-react';

interface CategoryHubProps {
  status: CycleStatus;
  settings: AppSettings;
  theme: ThemeConfig;
  todayLog?: DayLog;
  onNavigateTab: (tab: 'home' | 'calendar' | 'charts' | 'pregnancy' | 'ayurveda' | 'perimenopause' | 'clinical') => void;
  onOpenLogModal: () => void;
}

type HubCategory = 'all' | 'cycle' | 'clinical' | 'wellness';

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
      {/* 1. Header & Category Switcher */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl font-black font-['Fredoka'] text-[#1A1A24]">
              Clinical & Care Hub
            </h2>
            <p className="text-xs text-[#646478] font-medium">Evidence-based women's reproductive health modules</p>
          </div>
          <span className="text-[11px] font-bold text-[#FF5376] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FF5376] animate-pulse" />
            Active
          </span>
        </div>

        {/* Clean Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Modules', icon: Compass },
            { id: 'cycle', label: 'Cycle & Fertility', icon: Droplets },
            { id: 'clinical', label: 'Rotterdam Screening', icon: Shield },
            { id: 'wellness', label: 'Ayurvedic Care', icon: Leaf },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as HubCategory)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-white text-[#1A1A24] shadow-sm font-black'
                    : 'text-[#646478] hover:text-[#1A1A24]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FF5376]' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Featured Clinical Highlights */}
      {(activeCategory === 'all' || activeCategory === 'clinical') && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black font-['Fredoka'] tracking-wider text-[#646478] uppercase flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#FF5376]" />
              Clinical Insights
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
            {/* Slide 1: Cycle Regularity */}
            <div
              onClick={() => onNavigateTab('charts')}
              className="min-w-[280px] p-4.5 rounded-[24px] bg-gradient-to-br from-[#1A1A24] via-[#242038] to-[#1A1A24] text-white border border-slate-800 shadow-lg flex items-center justify-between snap-center shrink-0 relative overflow-hidden group cursor-pointer hover:border-slate-700 transition-all"
            >
              <div className="space-y-1.5 relative z-10 pr-2">
                <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Biomarker Analytics</div>
                <div>
                  <h4 className="text-base font-black font-['Fredoka'] leading-tight">
                    Cycle Regularity Index
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Historical log pattern & follicular variation metrics
                  </p>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {/* Slide 2: Rotterdam Phenotyping */}
            <div
              onClick={() => onNavigateTab('clinical')}
              className="min-w-[280px] p-4.5 rounded-[24px] bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 text-white border border-teal-800/40 shadow-lg flex items-center justify-between snap-center shrink-0 relative overflow-hidden group cursor-pointer hover:border-teal-600 transition-all"
            >
              <div className="space-y-1.5 relative z-10 pr-2">
                <div className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">ESHRE/ASRM Criteria</div>
                <div>
                  <h4 className="text-base font-black font-['Fredoka'] leading-tight">
                    Rotterdam PCOS Risk Profile
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1">
                    Multi-parameter screening & phenotype stratification
                  </p>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-teal-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Structured 2-Column Bento Grid */}
      {(activeCategory === 'all' || activeCategory === 'cycle') && (
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Period Tracker */}
          <button
            onClick={() => onNavigateTab('calendar')}
            className="p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer group hover:border-[#FF5376]/40 min-h-[135px] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE3E9] flex items-center justify-center text-[#FF5376] shadow-xs shrink-0">
                <Droplets className="w-5 h-5 fill-[#FF5376]" />
              </div>
              <span className="text-[11px] font-bold text-[#FF5376]">
                {status.isPeriodToday ? 'Period Active' : `${status.daysUntilNextPeriod}d left`}
              </span>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-black font-['Fredoka'] text-[#1A1A24] leading-snug truncate">
                Period Calendar
              </h4>
              <p className="text-[11px] text-[#646478] font-medium leading-tight line-clamp-2">
                Flow volume, symptoms & intimate wellness logs
              </p>
            </div>
          </button>

          {/* Card 2: Ovulation Hub */}
          <button
            onClick={() => onNavigateTab('charts')}
            className="p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer group hover:border-teal-500/40 min-h-[135px] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-xs shrink-0">
                <Thermometer className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-teal-700">
                {status.phase === 'ovulation' ? 'Peak Window' : 'Fertility Phase'}
              </span>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-black font-['Fredoka'] text-[#1A1A24] leading-snug truncate">
                Ovulation & BBT
              </h4>
              <p className="text-[11px] text-[#646478] font-medium leading-tight line-clamp-2">
                Biphasic temperature curve & conception window
              </p>
            </div>
          </button>
        </div>
      )}

      {/* 4. Full-width Clinical Cards */}
      <div className="space-y-3">
        {/* Rotterdam Clinical Diagnostics */}
        {(activeCategory === 'all' || activeCategory === 'clinical') && (
          <button
            onClick={() => onNavigateTab('clinical')}
            className="w-full p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group hover:border-teal-500/40"
          >
            <div className="space-y-1 pr-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                Clinical Diagnostics · 3 Criteria Scoring
              </div>
              <h4 className="text-base font-black font-['Fredoka'] text-[#1A1A24] leading-snug">
                Rotterdam PCOS Assessment
              </h4>
              <p className="text-xs text-[#646478] line-clamp-2">
                Oligo-ovulation, hyperandrogenism signs, and ultrasound morphology screening
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0 text-teal-700">
              <Shield className="w-5 h-5" />
            </div>
          </button>
        )}

        {/* Pregnancy Mode */}
        {(activeCategory === 'all' || activeCategory === 'cycle') && (
          <button
            onClick={() => onNavigateTab('pregnancy')}
            className="w-full p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group hover:border-amber-500/40"
          >
            <div className="space-y-1 pr-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Maternal Care · Week-by-Week
              </div>
              <h4 className="text-base font-black font-['Fredoka'] text-[#1A1A24] leading-snug">
                Pregnancy & Trimester Milestones
              </h4>
              <p className="text-xs text-[#646478] line-clamp-2">
                Gestational development, due date calculator, and fetal activity tracker
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 text-amber-700">
              <Activity className="w-5 h-5" />
            </div>
          </button>
        )}

        {/* Perimenopause Tracker */}
        {(activeCategory === 'all' || activeCategory === 'cycle') && (
          <button
            onClick={() => onNavigateTab('perimenopause')}
            className="w-full p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group hover:border-purple-500/40"
          >
            <div className="space-y-1 pr-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Hormonal Transition · Vasomotor Tracking
              </div>
              <h4 className="text-base font-black font-['Fredoka'] text-[#1A1A24] leading-snug">
                Perimenopause Transition
              </h4>
              <p className="text-xs text-[#646478] line-clamp-2">
                Hot flush monitoring, night sweat patterns, and sleep regularity
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0 text-purple-700">
              <Flame className="w-5 h-5" />
            </div>
          </button>
        )}

        {/* Ayurvedic Health */}
        {(activeCategory === 'all' || activeCategory === 'wellness') && (
          <div className="space-y-4">
            <button
              onClick={() => onNavigateTab('ayurveda')}
              className="w-full p-4 rounded-[24px] bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group hover:border-emerald-500/40"
            >
              <div className="space-y-1 pr-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Classical Ayurveda · Prakriti Harmony
                </div>
                <h4 className="text-base font-black font-['Fredoka'] text-[#1A1A24] leading-snug">
                  Ayurvedic Cycle & Dosha Care
                </h4>
                <p className="text-xs text-[#646478] line-clamp-2">
                  Ritucharya seasonal regimen, Dinacharya daily rhythm, and classical herb formulations
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-700">
                <Leaf className="w-5 h-5" />
              </div>
            </button>

            {/* Graphical Symptom Logs */}
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
