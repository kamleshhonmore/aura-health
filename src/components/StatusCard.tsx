import React from 'react';
import { CycleStatus } from '../utils/cycleCalculations';
import { ThemeConfig } from '../types';
import { Heart, Droplets, PlusCircle, Sparkles } from 'lucide-react';

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
  let headline = '';
  let subText = '';
  let badgeColor = '';
  let badgeText = '';

  if (status.isPeriodToday) {
    headline = `Day ${status.currentCycleDay} of Period`;
    subText = `Active period flow • ~${status.periodLength} days remaining`;
    badgeColor = 'bg-[#FF5376] text-white';
    badgeText = 'Menstruation Active';
  } else if (status.phase === 'ovulation') {
    headline = 'Ovulation Day';
    subText = 'Peak fertility today • 33% conception probability';
    badgeColor = 'bg-[#F59E0B] text-black font-bold';
    badgeText = 'Peak Ovulation';
  } else if (status.phase === 'fertile') {
    headline = 'Fertile Window';
    subText = `Ovulation predicted in ~${Math.max(1, status.daysUntilOvulation)} days`;
    badgeColor = 'bg-[#10B981] text-white';
    badgeText = `Fertile Window (${status.conceptionPercent}%)`;
  } else {
    headline = `Period in ${status.daysUntilNextPeriod} Days`;
    subText = `Next cycle begins ~${status.nextPeriodDate}`;
    badgeColor = 'bg-purple-600 text-white';
    badgeText = `Cycle Day ${status.currentCycleDay}/${status.totalCycleDays}`;
  }

  const size = 150;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.min(100, (status.currentCycleDay / status.totalCycleDays) * 100);
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="relative rounded-[32px] p-6 bg-white border border-[#EAECEF] shadow-xl transition-all overflow-hidden group card-stack-layer">
      {/* Micro-glow ambient backdrop */}
      <div
        className="absolute -top-16 -right-16 w-52 h-52 rounded-full pointer-events-none opacity-25 blur-3xl glow-pink"
        style={{ backgroundColor: theme.accentPink }}
      />

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex-1 space-y-3">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black shadow-xs ${badgeColor}`}>
            <Sparkles className="w-3 h-3" />
            {badgeText}
          </span>

          <div>
            <h2 className="text-2xl font-black font-['Fredoka'] tracking-tight text-[#1A1A24] leading-tight">
              {headline}
            </h2>
            <p className="text-xs font-medium text-[#646478] mt-1 leading-relaxed">
              {subText}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FF5376] bg-[#FFE3E9] px-3 py-1 rounded-full border border-pink-200">
              <Heart className="w-3.5 h-3.5 fill-[#FF5376] text-[#FF5376]" />
              Conception Chance: {status.conceptionChance}
            </span>
          </div>
        </div>

        {/* Circular Dial with Inner Layered Glass Effect */}
        <div
          onClick={onOpenCalendar}
          title="View Calendar Details"
          className="relative flex items-center justify-center shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
        >
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#F0F2F5"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={status.isPeriodToday ? '#FF5376' : status.phase === 'ovulation' ? '#F59E0B' : '#10B981'}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 rounded-full bg-white/40 backdrop-blur-xs">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#9696AA]">
              DAY
            </span>
            <span className="text-3xl font-black font-['Fredoka'] text-[#1A1A24] leading-none">
              {status.currentCycleDay}
            </span>
            <span className="text-[9px] font-semibold text-[#646478]">
              of {status.totalCycleDays}d
            </span>
          </div>
        </div>
      </div>

      {/* Embedded Action Bar */}
      <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-[#EAECEF] relative z-10">
        <button
          onClick={onTogglePeriodToday}
          className={`py-3 px-4 rounded-2xl text-xs font-black font-['Fredoka'] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
            status.isPeriodToday
              ? 'bg-[#FF5376] hover:bg-[#E04365] text-white shadow-pink-200'
              : 'bg-[#F4F6F9] hover:bg-[#EAECEF] text-[#1A1A24] border border-[#EAECEF]'
          }`}
        >
          <Droplets className="w-4 h-4 text-[#FF5376]" />
          {status.isPeriodToday ? 'Period Active (Edit)' : '+ Period Started'}
        </button>

        <button
          onClick={onOpenLogModal}
          className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF5376] via-[#FF758C] to-[#FF8FA3] hover:from-[#E04365] hover:to-[#FF5376] text-white text-xs font-black font-['Fredoka'] flex items-center justify-center gap-2 shadow-md shadow-pink-200 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] glow-pink"
        >
          <PlusCircle className="w-4 h-4" />
          Log Symptoms
        </button>
      </div>
    </div>
  );
};
