import React from 'react';
import { ThemeConfig } from '../types';
import { Droplets, Plus, Minus, Check } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { motion } from 'motion/react';

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
  const currentMl = currentGlasses * 250;
  const goalMl = goalGlasses * 250;
  const percent = Math.min(100, Math.round((currentGlasses / goalGlasses) * 100));
  const isGoalMet = currentGlasses >= goalGlasses;

  const handleAddCup = () => {
    const next = currentGlasses + 1;
    onUpdateGlasses(next);
    if (next === goalGlasses) {
      fireCelebrationConfetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C86D51', '#5B8A72', '#7B6B8D', '#E8ACA0'],
      });
    }
  };

  const handleRemoveCup = () => {
    if (currentGlasses > 0) {
      onUpdateGlasses(currentGlasses - 1);
    }
  };

  return (
    <div className="w-full product-card rounded-[32px] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F5EBE6] text-[#C86D51] flex items-center justify-center shadow-xs">
            <Droplets className="w-5 h-5 fill-[#C86D51]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#2C2A29]">
              Hydration Gauge
            </h3>
            <p className="text-xs font-semibold text-[#7A7571]">
              {currentMl} ml / {goalMl} ml Goal
            </p>
          </div>
        </div>

        {isGoalMet ? (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" /> Goal Met
          </span>
        ) : (
          <span className="text-xs font-bold text-[#C86D51]">
            {percent}%
          </span>
        )}
      </div>

      {/* Sleek Single-Line Fluid Bar */}
      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
        <motion.div
          className="h-full bg-gradient-to-r from-[#C86D51] to-[#E8ACA0] rounded-full shadow-inner"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Quick Tap Controls (+250ml) in clean horizontal row */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleRemoveCup}
          disabled={currentGlasses === 0}
          className="p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-[#7A7571] transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={handleAddCup}
          className="flex-1 py-3 px-4 rounded-2xl bg-[#C86D51] hover:bg-[#B05B41] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add 250 ml Cup</span>
        </button>
      </div>
    </div>
  );
};
