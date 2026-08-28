import React from 'react';
import { CyclePhaseInfo } from '../types';
import { Sparkles, Heart, Plus } from 'lucide-react';

interface CycleRingProps {
  info: CyclePhaseInfo;
  onOpenLog: () => void;
}

export const CycleRing: React.FC<CycleRingProps> = ({ info, onOpenLog }) => {
  const size = 260;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate arc angles
  const progressPercent = (info.cycleDay / info.totalCycleDays) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#181B24] to-[#12141C] border border-white/8 rounded-3xl shadow-2xl">
      {/* Background glow */}
      <div className="absolute w-44 h-44 rounded-full bg-[#E29587]/10 blur-3xl pointer-events-none -top-6" />

      {/* SVG Ring */}
      <div className="relative w-[260px] h-[260px] flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#202430"
            strokeWidth={strokeWidth}
          />

          {/* Phase Zone Highlight (Follicular / Fertile) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="url(#phaseGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="phaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E29587" />
              <stop offset="50%" stopColor="#E5C388" />
              <stop offset="100%" stopColor="#9CAF88" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content Inside Ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E29587]/15 text-[#F2ADA0] border border-[#E29587]/30 mb-1.5">
            <Sparkles className="w-3 h-3" />
            {info.title}
          </span>

          <div className="text-3xl font-extrabold tracking-tight text-white font-sans mt-0.5">
            Cycle Day {info.cycleDay}
          </div>

          <div className="text-xs text-[#9DA4B5] font-medium mt-1">
            Period predicted in <span className="text-[#E29587] font-semibold">{info.daysUntilNextPeriod} days</span>
          </div>

          <div className="flex items-center gap-1.5 mt-2.5 px-2.5 py-0.5 rounded-lg bg-[#202430] border border-white/5">
            <Heart className="w-3 h-3 text-[#9CAF88]" />
            <span className="text-[11px] text-[#C4C9D6]">
              Conception: <strong className="text-[#9CAF88]">{info.conceptionChance} ({info.conceptionPercentage}%)</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Action Button: Log Symptoms */}
      <button
        onClick={onOpenLog}
        className="mt-4 w-full py-3 px-5 rounded-2xl bg-[#E29587] hover:bg-[#EAA194] active:scale-[0.98] text-[#111318] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E29587]/20 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        Log Daily Symptoms
      </button>
    </div>
  );
};
