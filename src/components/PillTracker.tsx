import React from 'react';
import { ThemeConfig } from '../types';
import { Pill, Check, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

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
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#AB47BC', '#BA68C8', '#E1BEE7'],
      });
    }
  };

  return (
    <div
      className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} ${theme.shadowColor} shadow-md transition-all flex items-center justify-between gap-3`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-xs transition-colors ${
            isTaken
              ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
              : 'bg-[#F3E5F5] text-[#8E24AA] border border-[#E1BEE7]'
          }`}
        >
          <Pill className={`w-5 h-5 ${isTaken ? 'text-[#2E7D32]' : 'text-[#8E24AA]'}`} />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h3 className={`font-black text-xs font-['Fredoka'] ${theme.textPrimary}`}>
              Contraceptive & Vitamin Pill
            </h3>
            {isTaken && (
              <span className="text-[10px] text-[#2E7D32] font-bold px-1.5 py-0.2 rounded-full bg-[#E8F5E9]">
                Taken!
              </span>
            )}
          </div>
          <p className={`text-[10px] font-semibold ${theme.textSecondary} flex items-center gap-1 mt-0.5`}>
            <Clock className="w-3 h-3 text-[#AB47BC]" />
            {isTaken ? `Logged at ${pillTime || '9:00 PM'}` : 'Scheduled for 9:00 PM'} • Pill #{cycleDay}
          </p>
        </div>
      </div>

      <button
        onClick={handleTake}
        className={`px-3.5 py-2 rounded-2xl text-xs font-black font-['Fredoka'] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
          isTaken
            ? 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] border border-[#A5D6A7]'
            : 'bg-gradient-to-r from-[#AB47BC] to-[#BA68C8] hover:from-[#8E24AA] hover:to-[#AB47BC] text-white shadow-purple-200'
        }`}
      >
        <Check className={`w-4 h-4 stroke-[3] ${isTaken ? 'text-[#2E7D32]' : 'text-white'}`} />
        {isTaken ? 'Taken' : 'Take Pill'}
      </button>
    </div>
  );
};
