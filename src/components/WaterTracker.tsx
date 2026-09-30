import React from 'react';
import { ThemeConfig } from '../types';
import { Droplets, Plus, Minus } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

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
  const percent = Math.min(100, Math.round((currentGlasses / goalGlasses) * 100));

  const handleAddCup = () => {
    const next = Math.min(20, currentGlasses + 1); // Max limit 20 cups (5000ml)
    onUpdateGlasses(next);
    if (next === goalGlasses) {
      fireCelebrationConfetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#38BDF8', '#0EA5E9', '#0284C7', '#BAE6FD'],
      });
    }
  };

  const handleRemoveCup = () => {
    if (currentGlasses > 0) {
      onUpdateGlasses(currentGlasses - 1); // Min limit 0
    }
  };

  return (
    <div className="w-full h-full product-card rounded-[28px] p-4 flex flex-col justify-between bg-gradient-to-br from-sky-50/70 via-white to-blue-50/40 border border-sky-100/90 shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Droplets className="w-4 h-4 text-sky-500 fill-sky-400" />
          <h3 className="font-black text-xs text-slate-900 tracking-tight">
            Hydration
          </h3>
        </div>
        <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
          {currentMl}ml
        </span>
      </div>

      {/* Dynamic Graphical Water Droplet & Percentage Centerpiece */}
      <div className="flex flex-col items-center justify-center my-auto py-1">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-md animate-pulse" />

          <svg className="w-14 h-14 drop-shadow-md" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
              className="text-slate-100 fill-slate-100 stroke-slate-200"
              strokeWidth="1.5"
            />
            <defs>
              <clipPath id="waterFill">
                <rect x="0" y={24 - (24 * percent) / 100} width="24" height="24" />
              </clipPath>
            </defs>
            <path
              d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
              className="text-sky-500 fill-sky-500"
              clipPath="url(#waterFill)"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-black text-slate-800 font-mono">
              {percent}%
            </span>
          </div>
        </div>
      </div>

      {/* Controls: [-] and [+] Side-by-Side with Limit */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleRemoveCup}
          disabled={currentGlasses === 0}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 transition-all cursor-pointer shadow-xs active:scale-95"
          title="Decrease 250ml"
        >
          <Minus className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        <button
          onClick={handleAddCup}
          disabled={currentGlasses >= 20}
          className="flex-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-md shadow-sky-500/20 transition-all cursor-pointer active:scale-95"
          title="Add 250ml"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+250ml</span>
        </button>
      </div>
    </div>
  );
};
