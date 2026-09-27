import React from 'react';
import { ThemeConfig } from '../types';
import { Pill, Check, Clock } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface PillTrackerProps {
  isTaken: boolean;
  pillTime?: string;
  cycleDay: number;
  theme: ThemeConfig;
  onTogglePill: () => void;
}

export const PillTracker: React.FC<PillTrackerProps> = ({
  isTaken,
  pillTime,
  cycleDay,
  theme,
  onTogglePill,
}) => {
  const handleTake = () => {
    onTogglePill();
    if (!isTaken) {
      fireCelebrationConfetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#C86D51', '#7B6B8D', '#E8ACA0'],
      });
    }
  };

  return (
    <div className="w-full product-card rounded-[32px] p-5 space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs transition-colors ${
              isTaken
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-[#F5EBE6] text-[#C86D51] border border-[#E8ACA0]'
            }`}
          >
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#2C2A29]">
              Pill Tracker
            </h3>
            <p className="text-xs font-semibold text-[#7A7571] flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-[#C86D51]" />
              {isTaken ? `Logged ${pillTime || '9:00 PM'}` : 'Scheduled 9:00 PM'} • Day {cycleDay}
            </p>
          </div>
        </div>

        {isTaken && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Taken
          </span>
        )}
      </div>

      <button
        onClick={handleTake}
        className={`w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
          isTaken
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
            : 'bg-[#C86D51] hover:bg-[#B05B41] text-white shadow-sm glow-primary'
        }`}
      >
        <Check className="w-4 h-4 stroke-[3]" />
        {isTaken ? 'Pill Taken (Undo)' : 'Take Daily Pill'}
      </button>
    </div>
  );
};
