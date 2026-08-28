import React from 'react';
import { ThemeConfig } from '../types';
import { Droplets, Plus, Minus, Check, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaterTrackerProps {
  currentGlasses: number;
  goalGlasses: number;
  theme: ThemeConfig;
  onUpdateGlasses: (newCount: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  currentGlasses,
  goalGlasses,
  theme,
  onUpdateGlasses,
}) => {
  const percent = Math.min(100, Math.round((currentGlasses / goalGlasses) * 100));
  const isGoalMet = currentGlasses >= goalGlasses;

  const handleAddGlass = () => {
    const next = currentGlasses + 1;
    onUpdateGlasses(next);
    if (next === goalGlasses) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4FC3F7', '#29B6F6', '#81D4FA', '#FF80AB'],
      });
    }
  };

  const handleRemoveGlass = () => {
    if (currentGlasses > 0) {
      onUpdateGlasses(currentGlasses - 1);
    }
  };

  return (
    <div
      className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} ${theme.shadowColor} shadow-md transition-all space-y-3`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E1F5FE] text-[#0288D1] flex items-center justify-center shadow-xs">
            <Droplets className="w-4 h-4 fill-[#0288D1]" />
          </div>
          <div>
            <h3 className={`font-black text-xs font-['Fredoka'] ${theme.textPrimary}`}>
              Daily Hydration Tracker
            </h3>
            <p className={`text-[10px] font-semibold ${theme.textSecondary}`}>
              {currentGlasses * 250} ml / {goalGlasses * 250} ml Goal
            </p>
          </div>
        </div>

        {isGoalMet ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" />
            Goal Met!
          </span>
        ) : (
          <span className="text-xs font-black font-['Fredoka'] text-[#0288D1]">
            {percent}%
          </span>
        )}
      </div>

      {/* Visual Glass Row */}
      <div className="flex items-center justify-between gap-1.5 px-1 py-1">
        {Array.from({ length: goalGlasses }).map((_, idx) => {
          const filled = idx < currentGlasses;
          return (
            <button
              key={idx}
              onClick={() => onUpdateGlasses(idx + 1)}
              title={`Glass ${idx + 1} (250ml)`}
              className={`flex-1 h-9 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                filled
                  ? 'bg-gradient-to-t from-[#29B6F6] to-[#81D4FA] text-white border-[#0288D1] shadow-xs scale-105'
                  : 'bg-[#F5F8FA] text-[#B0BEC5] border-dashed border-[#CFD8DC] hover:border-[#90CAF9]'
              }`}
            >
              <Droplets className={`w-3.5 h-3.5 ${filled ? 'fill-white' : ''}`} />
            </button>
          );
        })}
      </div>

      {/* Quick Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleRemoveGlass}
          disabled={currentGlasses === 0}
          className="p-2 rounded-xl bg-[#ECEFF1] hover:bg-[#CFD8DC] disabled:opacity-40 text-[#455A64] transition-colors cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleAddGlass}
          className="flex-1 mx-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#29B6F6] to-[#03A9F4] hover:from-[#0288D1] hover:to-[#039BE5] text-white text-xs font-black font-['Fredoka'] flex items-center justify-center gap-1.5 shadow-md shadow-blue-200 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          +1 Cup (250ml)
        </button>

        <button
          onClick={() => onUpdateGlasses(goalGlasses)}
          title="Mark All Complete"
          className="p-2 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] transition-colors cursor-pointer"
        >
          <Award className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
