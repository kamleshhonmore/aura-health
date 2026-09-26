import React from 'react';
import { CycleStatus } from '../utils/cycleCalculations';
import { ThemeConfig } from '../types';
import { Heart, Sparkles, Droplets, PlusCircle, Check, Calendar } from 'lucide-react';

interface StatusCardProps {
  status: CycleStatus;
  theme: ThemeConfig;
  onOpenLogModal: () => void;
  onTogglePeriodToday: () => void;
  onOpenCalendar: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  theme,
  onOpenLogModal,
  onTogglePeriodToday,
  onOpenCalendar,
}) => {
  // Determine primary headline
  let headline = '';
  let subText = '';
  let badgeColor = '';
  let badgeText = '';

  if (status.isPeriodToday) {
    headline = `Day ${status.currentCycleDay} of Period`;
    subText = `Predicted to last ~${status.periodLength} days`;
    badgeColor = 'bg-[#FF5376] text-white';
    badgeText = 'Menstruation Active';
  } else if (status.phase === 'ovulation') {
    headline = 'Ovulation Day! ✨';
    subText = 'Peak fertility today • 33% chance';
    badgeColor = 'bg-[#FFB300] text-[#4A3200]';
    badgeText = 'Peak Ovulation';
  } else if (status.phase === 'fertile') {
    headline = 'Fertile Window 🌸';
    subText = `Ovulation predicted in ~${Math.max(1, status.daysUntilOvulation)} days`;
    badgeColor = 'bg-[#81C784] text-[#1B4D20]';
    badgeText = `🌱 Fertile (${status.conceptionPercent}%)`;
  } else {
    headline = `Period in ${status.daysUntilNextPeriod} Days`;
    subText = `Next cycle begins ~${status.nextPeriodDate}`;
    badgeColor = 'bg-[#F48FB1] text-white';
    badgeText = `Cycle Day ${status.currentCycleDay}/${status.totalCycleDays}`;
  }

  // Ring arc math
  const size = 170;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.min(100, (status.currentCycleDay / status.totalCycleDays) * 100);
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      className={`relative rounded-3xl p-5 ${theme.bgCard} border ${theme.borderCard} ${theme.shadowColor} shadow-xl transition-all overflow-hidden`}
    >
      {/* Background soft ambient pastel blob */}
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none opacity-20 blur-2xl"
        style={{ backgroundColor: theme.accentPink }}
      />

      <div className="flex items-center justify-between gap-4">
        {/* Left: Info & Countdown */}
        <div className="flex-1 space-y-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${badgeColor}`}>
            {badgeText}
          </span>

          <div>
            <h2 className={`text-2xl font-black font-['Fredoka'] tracking-tight leading-tight ${theme.textPrimary}`}>
              {headline}
            </h2>
            <p className={`text-xs font-medium mt-0.5 ${theme.textSecondary}`}>
              {subText}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E91E63] bg-[#FCE4EC] px-2.5 py-0.5 rounded-lg">
              <Heart className="w-3 h-3 fill-[#E91E63]" />
              Conception: {status.conceptionChance} ({status.conceptionPercent}%)
            </span>
          </div>
        </div>

        {/* Right: Circular Day Dial */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#FCE4EC"
              strokeWidth={strokeWidth}
            />
            {/* Progress arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={status.isPeriodToday ? '#FF5376' : status.phase === 'ovulation' ? '#FFB300' : theme.accentPink}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Dial Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.textMuted}`}>
              DAY
            </span>
            <span className={`text-3xl font-black font-['Fredoka'] leading-none ${theme.textPrimary}`}>
              {status.currentCycleDay}
            </span>
            <span className={`text-[10px] font-semibold ${theme.textSecondary}`}>
              of {status.totalCycleDays} days
            </span>
          </div>
        </div>
      </div>

      {/* Dual Big Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-pink-50">
        <button
          onClick={onTogglePeriodToday}
          className={`py-2.5 px-3 rounded-2xl text-xs font-black font-['Fredoka'] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
            status.isPeriodToday
              ? 'bg-[#FF5376] hover:bg-[#E84365] text-white shadow-pink-200'
              : 'bg-[#FFF0F3] hover:bg-[#FFE0E6] text-[#E91E63] border border-[#FFCDD2]'
          }`}
        >
          <Droplets className="w-4 h-4" />
          {status.isPeriodToday ? 'Period Active (Edit)' : '+ Period Started'}
        </button>

        <button
          onClick={onOpenLogModal}
          className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] hover:from-[#FF6580] hover:to-[#FF6F9A] text-white text-xs font-black font-['Fredoka'] flex items-center justify-center gap-1.5 shadow-md shadow-pink-200 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          Log Symptoms & Mood
        </button>
      </div>
    </div>
  );
};
